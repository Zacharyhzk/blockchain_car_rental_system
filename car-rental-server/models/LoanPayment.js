const mongoose = require('mongoose')

const LoanPaymentSchema = mongoose.Schema({
    loanId: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    transactionHash: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('LoanPayment', LoanPaymentSchema)