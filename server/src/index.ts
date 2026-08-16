import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';

import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerSpec } from './docs/swagger';

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(helmet({ crossOriginResourcePolicy: false }));

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.CORS_ORIGIN || '').split(',').map((origin) => origin.trim()).filter(Boolean)
    : '*',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());
app.use(morgan('dev'));

// Persistent files are stored in Supabase Storage. Do not serve or write
// to the Vercel function filesystem in production.
app.use('/api', routes);

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

// Vercel provides the HTTP server in production. Keep app.listen for local development.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🩺 MedAxis API server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📘 Swagger UI: http://localhost:${PORT}/api-docs`);
  });
}

export default app;
