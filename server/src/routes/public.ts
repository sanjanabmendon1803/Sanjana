import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../services/db';

const router = Router();

// GET /api/categories - List all marketplace categories
router.get('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await db.getCategories();
    res.json({
      success: true,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products - Discovery listing with filtering, sorting, and search
router.get('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      city,
      pinCode,
      sort,
      seller,
    } = req.query;

    const products = await db.getProducts({
      search: search ? String(search) : undefined,
      categorySlug: category ? String(category) : undefined,
      minPrice: minPrice ? parseFloat(String(minPrice)) : undefined,
      maxPrice: maxPrice ? parseFloat(String(maxPrice)) : undefined,
      city: city ? String(city) : undefined,
      pinCode: pinCode ? String(pinCode) : undefined,
      sort: (sort as any) || 'newest',
      sellerSlug: seller ? String(seller) : undefined,
    });

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id - Product detail page
router.get('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/sellers - Featured and approved local artisans
router.get('/sellers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellers = await db.getSellers(true);
    res.json({
      success: true,
      count: sellers.length,
      data: sellers,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/sellers/:slug - Public storefront profile
router.get('/sellers/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const seller = await db.getSellerBySlug(req.params.slug);
    if (!seller || !seller.is_approved || !seller.is_active) {
      return res.status(404).json({
        success: false,
        error: 'Seller storefront not found or inactive',
      });
    }

    // Get delivery areas
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

// GET /api/sellers/:slug/products - All products belonging to this seller
router.get('/sellers/:slug/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const seller = await db.getSellerBySlug(req.params.slug);
    if (!seller) {
      return res.status(404).json({
        success: false,
        error: 'Seller not found',
      });
    }

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

export default router;
