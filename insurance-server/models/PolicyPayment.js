const mongoose = require('mongoose')

const PolicyPaymentSchema = mongoose.Schema({
    policyId: {
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

module.exports = mongoose.model('PolicyPayment', PolicyPaymentSchema)