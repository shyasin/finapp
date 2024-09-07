import express from 'express';
import {validateInvoice, showInvoices, getCustomers, createInvoice, editInvoice, updateInvoice, deleteInvoice} from '../controllers/invoice.controller.js';


const invoiceRouter = express.Router();


invoiceRouter.get('/', showInvoices); 

invoiceRouter.get('/:id/edit', getCustomers, editInvoice);

invoiceRouter.post('/:id/edit', validateInvoice, updateInvoice);

invoiceRouter.get('/create', getCustomers, (req,res) => {
    const {customers} = req;
    res.render('pages/invoices',{
        title: 'Create Invoice',
        formAction: 'create',
        type: 'form',
        customers,
        invoice: req.flash('data')[0],
        errors: req.flash('errors'),
    });
});
    
invoiceRouter.post('/create', validateInvoice, createInvoice);

invoiceRouter.post('/:id/delete', deleteInvoice);



export {invoiceRouter};