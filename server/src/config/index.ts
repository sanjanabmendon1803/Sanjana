import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'localroots_super_secret_jwt_key_2026',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  // Supabase PostgreSQL & Auth Credentials
  supabase: {
  url: process.env.SUPABASE_URL || '',
  serviceKey: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  anonKey: process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '',
},

  // Razorpay Sandbox Credentials
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_localroots2026',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'test_secret_localroots2026',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret_test_2026',
  },
};
