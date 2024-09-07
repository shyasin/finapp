import {Customer} from '../libs/models/customer.model.js';
import {Invoice} from '../libs/models/invoice.model.js';
import { USDollar } from '../libs/formatter.js';


const showDashboard = async (req,res) => {
    const query = {owner:req.session.userId};
    const invoiceCount = await Invoice.countDocuments(query);
    const customerCount = await Customer.countDocuments(query);
    const allInvoices = await Invoice.find(query)
    .populate({
        path: 'customer',
        model: 'Customer',
        select: 'id name',
    });
    const totalPaid = allInvoices.reduce( (sum,invoice)=>{
        return invoice.status === 'paid'?sum + invoice.amount : sum;
    },0);

    const totalPending = allInvoices.reduce((sum,invoice) => {
        return invoice.status === 'pending'? sum+invoice.amount :sum ;
    },0);

    const revenueData = [];

    for (let i=0; i<6; i++){
        const today = new Date();
        today.setMonth(today.getMonth()-i);
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth()+1,0);
        const month = today.toLocaleString('default', {month: 'short'});

        const revenueForMonth = allInvoices
        .filter(invoice => {
            return (
                new Date(invoice.date) >= firstDay && 
                new Date(invoice.date) <= lastDay
            );
        })
        .reduce((total,invoice)=> 
            total + invoice.amount, 0);
            revenueData.unshift({month, revenue: revenueForMonth});
    };
       
    res.render('pages/dashboard', {
        title: 'Dashboard',
        revenueData: JSON.stringify(revenueData),
        invoiceCount,
        customerCount,
        totalPaid,
        totalPending,
        USDollar,
        info: req.flash('info')[0]
    });
};

export {showDashboard};

