import {User} from '../libs/models/user.model.js';
import bcrypt from 'bcrypt';
import {body, validationResult} from 'express-validator';

const validateSignup = [
        body('userName', 'Name must not be empty').notEmpty(),
        body('email', 'Email must not be empty').notEmpty(),
        body('email', 'should be Email format').isEmail(),
        body('password', 'password must not be empty').notEmpty(),
        body('password', 'password must be at least 6 characters long').isLength({ min: 6 }),
        body('repeatedPassword', 'Repeated password must not be empty').notEmpty(),
        body('repeatedPassword', 'passwords do not match').custom((value, { req }) => {
        return value === req.body.password;
    }),
    /*
        body('email', 'E-mail already in use').custom(value => {
            const repeatedEmail = User.find({ email: value});
            return !repeatedEmail ;
    }),
*/
        
   ];

const signup = async (req,res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()){
        const errors = validationErrors.array();
        req.flash('errors',errors);
        req.flash('data',req.body);
        return res.redirect('/signup');
    }
    const {userName, email,password} = req.body;
    const query = {email};
    const existingUser =await User.findOne(query);
    if (existingUser) {
        //Email already exists
        req.flash('data', req.body);
        req.flash('info',{
            message: 'Email is already registered',
            type: 'error'
        })
        res.redirect('/signup');
    }else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            userName,
            email,
            password: hashedPassword
        };
        const result = await User.create(user);
        req.session.userId = result._id;
        req.flash('info', {
            message: 'Signup Successful',
            type: 'success'
        });
        res.redirect('/');
    }
};


const validateLogin = [
body('email','email is not empty').notEmpty(),
body('password','password is not empty').notEmpty(),
];

const login = async (req,res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array();
        req.flash('errors', errors);
        req.flash('data', req.body);
        return res.redirect('/login');
    }else{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        const passwordMatch = await bcrypt.compare(password,user.password);
        if (passwordMatch){
            req.session.userId = user._id;
            req.flash('info', {
                message: 'Login Successful',
                type: 'success'
            });
            res.redirect('/dashboard');
        }else {
            req.flash('info', {
                message: 'Wrong Password',
                type: 'error'
            });
            req.flash('data', req.body)
            res.redirect('/login');
        };
    };
    };
};

const logout = async (req,res) => {
    req.session.userId = null;
    req.flash('info', {
        message: 'Logout Successful',
        type: 'success'
    });
    res.redirect('/');
};

export {validateSignup, signup, validateLogin, login, logout };