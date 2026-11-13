import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../services/db';

const router = Router();

// Validate Indian mobile numbers: 10 digits starting with 6-9
const isValidIndianMobile = (phone: string) => /^[6-9]\d{9}$/.test(phone.trim());

// Validate Indian PIN codes: 6 digits starting with 1-9
const isValidIndianPinCode = (pin: string) => /^[1-9][0-9]{5}$/.test(pin.trim());

// POST /api/checkout/validate - Validate cart against backend database
router.post('/validate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, pinCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty. Please add items to validate.',
      });
    }

    if (!pinCode || !isValidIndianPinCode(pinCode)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 6-digit Indian PIN code to check delivery availability.',
      });
    }

    const validation = await db.validateCartItems(items, pinCode);

    res.json({
      success: true,
      allValid: validation.allValid,
      items: validation.items,
      sellerSummaries: validation.sellerSummaries,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/checkout - Place Guest Order
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddressLine,
      deliveryStreet,
      deliveryLocality,
      deliveryCity,
      deliveryState,
      deliveryPinCode,
      deliveryInstructions,
      paymentMethod,
      items,
    } = req.body;

    // Strict guest input validation
    if (!customerName || customerName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid customer full name.',
      });
    }

    if (!customerPhone || !isValidIndianMobile(customerPhone)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid 10-digit Indian mobile number (e.g. 9845123456).',
      });
    }

    if (!deliveryAddressLine || deliveryAddressLine.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a complete house or building delivery address.',
      });
    }

    if (!deliveryCity || !deliveryState || !deliveryLocality) {
      return res.status(400).json({
        success: false,
        error: 'Locality, City, and State are required for delivery.',
      });
    }

    if (!deliveryPinCode || !isValidIndianPinCode(deliveryPinCode)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 6-digit Indian PIN code.',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Order items are required.',
      });
    }

    const validPaymentMethods = ['razorpay', 'cod', 'upi'];
    const chosenMethod = validPaymentMethods.includes(paymentMethod) ? paymentMethod : 'razorpay';

    // Execute atomic order creation and inventory deduction
    const orderResult = await db.createGuestOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail ? customerEmail.trim() : undefined,
      deliveryAddressLine: deliveryAddressLine.trim(),
      deliveryStreet: deliveryStreet ? deliveryStreet.trim() : undefined,
      deliveryLocality: deliveryLocality.trim(),
      deliveryCity: deliveryCity.trim(),
      deliveryState: deliveryState.trim(),
      deliveryPinCode: deliveryPinCode.trim(),
      deliveryInstructions: deliveryInstructions ? deliveryInstructions.trim() : undefined,
      paymentMethod: chosenMethod,
      items,
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      orderReference: orderResult.order.order_reference,
      trackingOtp: orderResult.trackingOtp, // Delivered to customer UI/SMS for guest tracking
      order: {
        id: orderResult.order.id,
        orderReference: orderResult.order.order_reference,
        customerName: orderResult.order.customer_name,
        grandTotal: orderResult.order.grand_total,
        paymentMethod: orderResult.order.payment_method,
        paymentStatus: orderResult.order.payment_status,
        subordersCount: orderResult.suborders.length,
        suborders: orderResult.suborders.map(so => ({
          suborderReference: so.suborder_reference,
          sellerName: so.seller?.business_name,
          suborderTotal: so.suborder_total,
          status: so.status,
          estimatedDeliveryDate: so.estimated_delivery_date,
        })),
      },
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.message || 'Failed to place order.',
    });
  }
});

export default router;
