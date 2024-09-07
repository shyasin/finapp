import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import flash from 'connect-flash';
import  * as path from 'node:path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import  logger from 'morgan';
import { dashboardRouter } from './routes/dashboard.router.js';
import {userRouter}  from './routes/user.router.js';
//import {customerRouter} from './routes/customer.router.js';
import createError from 'http-errors';
import mongoose from 'mongoose';
import 'dotenv/config';
import './libs/dbConnect.js';
import Toastify from 'toastify-js';
import {verifyUser, redirectAuthenticated} from './libs/middleware.js';

const app = express();

// view engine setup
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.AUTH_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('./public'));
app.use(express.static('node_modules'));
app.use('/', userRouter);
app.use('/dashboard',verifyUser, dashboardRouter);
//app.use('/createCustomer', customerRouter);
app.get('*', function (req, res) {
    res.status(404).render('pages/error',{
        title: 'Not Found',
        message: 'Not Found' 
    });
});

export {app} ;
