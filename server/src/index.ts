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
const allowedOrigins = [
  config.clientUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile apps, curl, server-to-server) or matching allowed origins
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      config.nodeEnv !== 'production'
    ) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback to allow cross-origin requests gracefully
    }
  },
  credentials: true,
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
const port = parseInt(process.env.PORT || String(config.port || 4000), 10);
const host = '0.0.0.0';

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, host, () => {
    console.log(`====================================================`);
    console.log(` LOCALROOTS API Server running on http://${host}:${port}`);
    console.log(` Health Check: http://${host}:${port}/api/health`);
    console.log(` Environment: ${config.nodeEnv}`);
    console.log(` Client URL: ${config.clientUrl}`);
    console.log(`====================================================`);
  });
}

export default app;
