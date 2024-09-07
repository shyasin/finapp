import {Customer} from '../libs/models/customer.model.js';
import {body, validationResult} from 'express-validator';
import {Invoice} from '../libs/models/invoice.model.js';


//show existing customers
const showCustomers = async (req, res) => {
    const query = { owner: req.session.userId };
    const {search} = req.query;
    if (search) {
        query['$or'] = [
            {name:{$regex: search, $options: 'i'}},
            { email: { $regex: search, $options: 'i' } }, 
            { phone: { $regex: search, $options: 'i' } }, 
            { address: { $regex: search, $options: 'i' } }, 
        ];
    }
    const customers = await Customer.find(query);
    res.render('pages/customers', {
        title: 'Customers',
        type: 'data',
        customers,
        info: req.flash('info')[0],
    });
};

const validateCustomers = [
    body('name','name must not be empty').notEmpty(),
    body('email','email must not be empty').notEmpty(),
    body('phone','phone must not be empty').notEmpty(),
    body('address','address must not be empty').notEmpty(),
];
//create new customer
const createCustomer = async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()){
        const errors = validationErrors.array();
        req.flash('errors',errors);
        req.flash('data',req.body);
        return  res.rediredt('create');
    }
    const newCustomer = req.body;
    newCustomer.owner = req.session.userId;

    await Customer.create(newCustomer);
    req.flash('info',{
        message: 'customer created',
        type: 'success',
    });
    res.redirect('/dashboard/customers');
    };


//edit customer
const editCustomer = async (req, res) => {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);
    res.render('pages/customers', {
        title: 'Edit Customer',
        type: 'form',
        formAction: 'edit',
        customer: req.flash('data')[0] || customer,
        errors: req.flash('errors'),
    });
};

//update customer
const updateCustomer = async (req,res) => {
    const customerId = req.params.id;
    const customerData = req.body;
    await Customer.findByIdAndUpdate(customerId, customerData);
    req.flash('info', {
        message: 'Customer Updated',
        type: 'success'
    });
    res.redirect('/dashboard/customers');
};

//delete customer
const deleteCustomer = async (req,res) => {
    const customerId = req.params.id
    await Invoice.deleteMany({customer:customerId});
    await Customer.findByIdAndDelete(customerId);
    req.flash('info',{
        message: 'Customer Deleted',
        type: 'Success',
    });
    res.redirect('/dashboard/customers');
};

export {validateCustomers, createCustomer, showCustomers, editCustomer, updateCustomer, deleteCustomer} ;
