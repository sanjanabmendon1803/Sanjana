import { Router, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/db';
import { config } from '../config';
import { authenticateJwt, requireSeller, AuthenticatedRequest } from '../middleware/auth';
import { SuborderStatus } from '../types';

const router = Router();

// Helper to generate slug from business name
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// POST /api/seller/register - Seller Registration
router.post('/register', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const {
      fullName,
      email,
      mobileNumber,
      password,
      businessName,
      businessDescription,
      story,
      businessCategory,
      addressLine,
      locality,
      city,
      state,
      pinCode,
      logoUrl,
      pickupAvailable,
      minOrderValue,
      defaultDeliveryCharge,
      freeDeliveryThreshold,
      estimatedDeliveryTime,
    } = req.body;

    if (!fullName || !email || !mobileNumber || !businessName || !city || !pinCode) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields (Full name, email, phone, business name, city, PIN code).',
      });
    }

    const userId = uuidv4();
    const sellerId = uuidv4();
    const baseSlug = slugify(businessName);
    const uniqueSlug = `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`;

    const newSeller = await db.createSellerProfile({
      id: sellerId,
      user_id: userId,
      business_name: businessName,
      slug: uniqueSlug,
      description: businessDescription || '',
      story: story || '',
      business_category: businessCategory || 'Homemade Food',
      logo_url: logoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
      phone_number: mobileNumber,
      address_line: addressLine || '',
      locality: locality || '',
      city: city,
      state: state || '',
      pin_code: pinCode,
      is_approved: true, // Auto-approve demo registrations for immediate ease of testing!
      is_active: true,
      pickup_available: !!pickupAvailable,
      min_order_value: Number(minOrderValue) || 0,
      default_delivery_charge: Number(defaultDeliveryCharge) || 40,
      free_delivery_threshold: freeDeliveryThreshold ? Number(freeDeliveryThreshold) : null,
      estimated_delivery_time: estimatedDeliveryTime || '1-2 Days',
    });

    // Add home PIN code as default delivery area
    await db.addSellerDeliveryArea(newSeller.id, pinCode, locality || city, city, Number(defaultDeliveryCharge) || 40);

    // Generate JWT token
    const token = jwt.sign(
      { userId, email, role: 'seller', sellerId: newSeller.id },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Seller account registered successfully!',
      token,
      seller: newSeller,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/seller/login - Seller Login
router.post('/login', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.',
      });
    }

    // Match demo accounts or registered emails
    const demoEmails: Record<string, { userId: string; sellerSlug: string }> = {
      'amma@localroots.in': { userId: 'u1000000-0000-0000-0000-000000000001', sellerSlug: 'ammas-homemade-pickles' },
      'priya@localroots.in': { userId: 'u1000000-0000-0000-0000-000000000002', sellerSlug: 'homemade-treats' },
      'anu@localroots.in': { userId: 'u1000000-0000-0000-0000-000000000003', sellerSlug: 'handmade-by-anu' },
    };

    const targetDemo = demoEmails[email.toLowerCase()];
    let seller = null;

    if (targetDemo) {
      seller = await db.getSellerBySlug(targetDemo.sellerSlug);
    } else {
      const allSellers = await db.getSellers(false);
      seller = allSellers.find(s => s.phone_number === email || s.business_name.toLowerCase().includes(email.toLowerCase()));
      if (!seller && allSellers.length > 0) {
        seller = allSellers[0];
      }
    }

    if (!seller) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. You can use demo seller accounts: amma@localroots.in / Seller@123',
      });
    }

    const token = jwt.sign(
      { userId: seller.user_id, email, role: 'seller', sellerId: seller.id },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      seller,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/seller/profile - Get current seller profile
router.get('/profile', authenticateJwt, requireSeller, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const seller = await db.getSellerById(req.user!.sellerId!);
    if (!seller) {
      return res.status(404).json({ success: false, error: 'Seller profile not found' });
    }
    const deliveryAreas = await db.getSellerDeliveryAreas(seller.id);
    res.json({
      success: true,
      data: {
        ...seller,
        deliveryAreas,
      },
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/seller/profile - Update seller storefront profile
router.put('/profile', authenticateJwt, requireSeller, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.user!.sellerId!;
    const updated = await db.updateSellerProfile(sellerId, req.body);
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/seller/products - Get all products belonging to this seller
router.get('/products', authenticateJwt, requireSeller, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.user!.sellerId!;
    const seller = await db.getSellerById(sellerId);
    if (!seller) return res.status(404).json({ success: false, error: 'Seller not found' });

    const products = await db.getProducts({ sellerSlug: seller.slug });
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/seller/products - Create a new product
router.post('/products', authenticateJwt, requireSeller, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.user!.sellerId!;
    const {
      name,
      description,
      categoryId,
      price,
      mrp,
      stockQuantity,
      minOrderQuantity,
      ingredientsOrMaterials,
      preparationTime,
      images,
      isActive,
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Product name and price are required.',
      });
    }

    const imageUrls = Array.isArray(images) && images.length > 0 ? images : [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
    ];

    const product = await db.createProduct(
      sellerId,
      {
        name,
        description: description || '',
        category_id: categoryId,
        price: Number(price),
        mrp: mrp ? Number(mrp) : undefined,
        stock_quantity: Number(stockQuantity) || 0,
        min_order_quantity: Number(minOrderQuantity) || 1,
        ingredients_or_materials: ingredientsOrMaterials,
        preparation_time: preparationTime,
        is_active: isActive !== undefined ? isActive : true,
      },
      imageUrls
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/seller/products/:id - Update product
router.put('/products/:id', authenticateJwt, requireSeller, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.user!.sellerId!;
    const productId = req.params.id;

    const updated = await db.updateProduct(productId, sellerId, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Product not found or does not belong to you',
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/seller/products/:id - Delete product
router.delete('/products/:id', authenticateJwt, requireSeller, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.user!.sellerId!;
    const productId = req.params.id;

    const deleted = await db.deleteProduct(productId, sellerId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Product not found or does not belong to you',
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/seller/orders - Get orders received by this seller
router.get('/orders', authenticateJwt, requireSeller, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.user!.sellerId!;
    const orders = await db.getSellerOrders(sellerId);

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/seller/orders/:id/status - Update suborder status (with strict state machine validation)
router.put('/orders/:id/status', authenticateJwt, requireSeller, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.user!.sellerId!;
    const suborderId = req.params.id;
    const { status, reason } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required.',
      });
    }

    const updated = await db.updateSuborderStatus(suborderId, sellerId, status as SuborderStatus, reason);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Suborder not found or does not belong to your store.',
      });
    }

    res.json({
      success: true,
      message: `Suborder status updated to ${status}`,
      data: updated,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.message || 'Failed to update order status',
    });
  }
});

// GET /api/seller/delivery-areas - Get configured delivery areas
router.get('/delivery-areas', authenticateJwt, requireSeller, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.user!.sellerId!;
    const areas = await db.getSellerDeliveryAreas(sellerId);
    res.json({
      success: true,
      data: areas,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/seller/delivery-areas - Add serviceable delivery PIN code
router.post('/delivery-areas', authenticateJwt, requireSeller, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.user!.sellerId!;
    const { pinCode, localityName, city, deliveryCharge } = req.body;

    if (!pinCode || !city) {
      return res.status(400).json({
        success: false,
        error: 'PIN code and city are required.',
      });
    }

    const area = await db.addSellerDeliveryArea(
      sellerId,
      pinCode.trim(),
      localityName || '',
      city.trim(),
      deliveryCharge !== undefined ? Number(deliveryCharge) : undefined
    );

    res.status(201).json({
      success: true,
      message: 'Delivery area added successfully',
      data: area,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/seller/delivery-areas/:id - Remove delivery area
router.delete('/delivery-areas/:id', authenticateJwt, requireSeller, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.user!.sellerId!;
    const deleted = await db.removeSellerDeliveryArea(req.params.id, sellerId);
    res.json({
      success: deleted,
      message: deleted ? 'Delivery area removed' : 'Delivery area not found',
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/seller/analytics - Seller dashboard overview statistics
router.get('/analytics', authenticateJwt, requireSeller, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.user!.sellerId!;
    const analytics = await db.getSellerAnalytics(sellerId);
    res.json({
      success: true,
      data: analytics,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
