import express from 'express';
import { createCustomer, showCustomers, editCustomer, updateCustomer, deleteCustomer } from '../controllers/customer.controller.js';

const customerRouter = express.Router();

/* GET customers listing. */
customerRouter.get('/', showCustomers);

customerRouter.get('/create', (req,res) => {
const data = req.body ;
    res.render('pages/customers',{
    title: "create customer",
    formAction: 'create',
    type: 'form',
    customer: req.flash(data)[0],
    errors: req.flash('errors'),
})
});
customerRouter.post('/create', createCustomer);


customerRouter.get('/:id/edit', editCustomer);
customerRouter.post('/:id/edit', updateCustomer);

customerRouter.post('/:id/delete', deleteCustomer);

export  {customerRouter};
