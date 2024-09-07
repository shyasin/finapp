import {Invoice} from '../libs/models/invoice.model.js';
import {Customer} from '../libs/models/customer.model.js';
import {body, validationResult} from 'express-validator';
import {USDollar} from '../libs/formatter.js';

const validateInvoice = [
    body('customer', 'Select the customer').notEmpty(),
    body('amount','Amount amount not be empty').notEmpty(),
    body('date', 'Due date must not be empty').notEmpty(),
    body('status', 'Select the status').notEmpty(),
];

const populateInvoices = (query, search) => {
    const populateOptions = {
        path: 'customer',
        model: 'Customer',
        select: '_id name'
    };
    if (search){
        populateOptions['match']= {name: {$regex: search, $options: 'i'}};
    }
    return query
    .populate(populateOptions)
    .then(invoices => invoices.filter(invoices => invoices.customer != null));
};



const showInvoices = async (req,res) => {
    const query = {owner: req.session.userId};
    const {search} = req.query;
    const invoices = await populateInvoices(Invoice.find(query),search) ;
    res.render('pages/invoices',{
        title: 'Invoices',
        type: 'data',
        invoices,
        USDollar,
        info: req.flash('info')[0],
    });
};

const getCustomers = async (req, res, next) => {
    const customersQuery = { owner: req.session.userId };
    const customers = await Customer.find(customersQuery);
    req.customers = customers;
    next();
};


const createInvoice = async (req,res) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()){
        const errors = validationErrors.array();
        req.flash('errors', errors);
        console.log(errors);
        req.flash('data', req.body);
        return res.redirect('create');
    }
    const newInvoice = req.body;
    newInvoice.owner = req.session.userId;
    await Invoice.create(newInvoice);
    req.flash('info',{
        message: 'New Invoice Created',
        type: 'Success',
    });
    res.redirect('/dashboard/invoices');
};

const editInvoice = async (req,res) => {
    const invoiceId = req.params.id ; 
    const invoice = await populateInvoices(Invoice.findById(invoiceId));
    const {customers} = req;

    res.render('pages/invoices', {
        title: 'Edit Invoice',
        type: 'form',
        formAction: 'edit',
        customers,
        invoice: req.flash('data')[0] || invoice, 
        errors: req.flash('errors'),
    });
};


const updateInvoice = async (req,res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array();
        req.flash('errors', errors);
        req.flash('data', req.body);
        return res.redirect('edit');
    }

    const invoiceId = req.params.id;
    const data = req.body;
    
    
    await Invoice.findByIdAndUpdate(invoiceId, data);
    req.flash({
        'info': {
            message: 'Invoice Updated',
            type: 'Success',
        }
    });
    res.redirect('/dashboard/invoices');

}

const deleteInvoice = async (req, res) => {
    const invoiceId = req.params.id;

    await Invoice.findByIdAndDelete(invoiceId);
    req.flash(
        'info', {
        message: 'Invoice Deleted',
        type: 'Success',

    });
    res.redirect('/dashboard/invoices');
}


export { validateInvoice, showInvoices, createInvoice, getCustomers, editInvoice, updateInvoice, deleteInvoice };