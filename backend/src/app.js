import express from 'express';
import cors from 'cors';
import passport from 'passport';
import passportConfig from './config/passport.js';

import authRoutes from './routes/authRoutes.js';
import parkingRoutes from './routes/parkingRoutes.js';
import moneyRoutes from './routes/moneyRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
passportConfig(passport);
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/user', moneyRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/admin', adminRoutes);

export default app;
