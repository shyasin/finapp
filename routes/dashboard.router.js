import express from 'express';
import {customerRouter} from './customer.router.js';
import { showDashboard } from '../controllers/dashboard.controller.js';
import { invoiceRouter } from './invoice.router.js';


const dashboardRouter = express.Router();

dashboardRouter.get('/', showDashboard);

dashboardRouter.use('/customers', customerRouter);
dashboardRouter.use('/invoices', invoiceRouter);

export {dashboardRouter} ;