const mongoose = require('mongoose')

const PlanSchema = mongoose.Schema({
    months: {
        type: Number,
        required: true
    },
    loanAmount: {
        type: Number,
        required: true
    },
    payment: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('Plans', PlanSchema)