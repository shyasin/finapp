import express from 'express';
import {validateSignup, signup, validateLogin, login, logout} from '../controllers/user.controller.js';
import {redirectAuthenticated} from '../libs/middleware.js';

const userRouter = express.Router();

/* GET home page. */
userRouter.get('/', function(req, res) {
  res.render('pages/index', { 
    title: 'Shapp Home Page' ,
    info: req.flash('info')[0],
  });
});

userRouter.get('/signup', redirectAuthenticated,  function(req,res){
  res.render('pages/signup', {
    title: 'signup',
    user: req.flash('data')[0],
    info: req.flash('info')[0],
    errors: req.flash('errors'),
  });
});

userRouter.post('/signup', validateSignup, signup);

userRouter.get('/login', redirectAuthenticated,  function (req, res) {
  res.render('pages/login', { 
    title: 'Login',
    user: req.flash('data')[0],
    info: req.flash('info')[0],
    errors: req.flash('errors'),

  });
});

userRouter.post('/login', validateLogin, login);

userRouter.get('/logout', logout);


export {userRouter};
