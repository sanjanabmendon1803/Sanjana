import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../services/db';

const router = Router();

// POST /api/orders/track - Step 1: Look up order and trigger OTP
router.post('/track', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderReference } = req.body;
    if (!orderReference || !orderReference.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Order reference number is required (e.g. LR-XXXXXX-XXX).',
      });
    }

    const check = await db.getOrderForTracking(orderReference.trim());
    if (!check.exists) {
      return res.status(404).json({
        success: false,
        error: 'No order found with the provided reference number.',
      });
    }

    // In production, an SMS OTP is dispatched to the customer's phone.
    // For demonstration testing, we inform the user that OTP is sent to the masked number.
    res.json({
      success: true,
      message: `A 6-digit verification code was sent to registered phone ${check.customerPhoneMasked}. (For testing, you may also use demo code 123456 or the code shown at checkout confirmation).`,
      maskedPhone: check.customerPhoneMasked,
      orderReference: orderReference.trim().toUpperCase(),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/orders/verify-otp - Step 2: Verify OTP and return tracking details
router.post('/verify-otp', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderReference, otp } = req.body;

    if (!orderReference || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Order reference and verification OTP are required.',
      });
    }

    const trackingData = await db.verifyGuestTracking(orderReference.trim(), otp.trim());
    if (!trackingData) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or incorrect verification code. Please check and try again.',
      });
    }

    res.json({
      success: true,
      data: trackingData,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
