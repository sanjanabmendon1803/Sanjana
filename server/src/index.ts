import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config';
import publicRoutes from './routes/public';
import checkoutRoutes from './routes/checkout';
import ordersRoutes from './routes/orders';
import paymentsRoutes from './routes/payments';
import sellerRoutes from './routes/seller';
import adminRoutes from './routes/admin';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Global Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature'],
}));
app.use(express.json());
app.use(morgan('dev'));

// Health & System Info
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'LOCALROOTS API Server',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api', publicRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/admin', adminRoutes);

// Centralized Error Handler
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`====================================================`);
    console.log(` LOCALROOTS API Server running on port ${config.port}`);
    console.log(` Health Check: http://localhost:${config.port}/api/health`);
    console.log(` Environment: ${config.nodeEnv}`);
    console.log(`====================================================`);
  });
}

export default app;
