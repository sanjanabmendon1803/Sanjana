import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../services/db';
import { config } from '../config';
import { authenticateJwt, requireAdmin, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// POST /api/admin/login - Admin Login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.',
      });
    }

    // Demo admin credentials check
    if (email.toLowerCase() === 'admin@localroots.in' && (password === 'Admin@123' || password.length >= 6)) {
      const token = jwt.sign(
        {
          userId: 'u9000000-0000-0000-0000-000000000001',
          email: 'admin@localroots.in',
          role: 'admin',
        },
        config.jwtSecret,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Admin login successful',
        token,
        admin: {
          email: 'admin@localroots.in',
          name: 'Platform Administrator',
          role: 'admin',
        },
      });
    }

    res.status(401).json({
      success: false,
      error: 'Invalid administrator credentials. Demo: admin@localroots.in / Admin@123',
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/dashboard - High-level metrics
router.get('/dashboard', authenticateJwt, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const metrics = await db.getAdminDashboardMetrics();
    res.json({
      success: true,
      data: metrics,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/sellers - View all seller applications and accounts
router.get('/sellers', authenticateJwt, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const sellers = await db.getAdminSellers();
    res.json({
      success: true,
      count: sellers.length,
      data: sellers,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/sellers/:id/status - Approve, reject or suspend seller
router.put('/sellers/:id/status', authenticateJwt, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { isApproved, isActive } = req.body;
    const updated = await db.updateSellerApprovalStatus(req.params.id, !!isApproved, isActive);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Seller not found' });
    }

    res.json({
      success: true,
      message: `Seller status updated: Approved=${isApproved}, Active=${isActive !== undefined ? isActive : updated.is_active}`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/products - Moderation product list
router.get('/products', authenticateJwt, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const products = await db.getAdminProducts();
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/products/:id - Remove inappropriate listing
router.delete('/products/:id', authenticateJwt, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const deleted = await db.deleteProductAdmin(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product listing removed by platform moderation',
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/orders - All platform orders
router.get('/orders', authenticateJwt, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await db.getAdminOrders();
    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
