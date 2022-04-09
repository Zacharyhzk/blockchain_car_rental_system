const mongoose = require('mongoose')

const CarInfoSchema = mongoose.Schema({
    carId: {
        type: Number,
        required: true
    },
    carBrand: {
        type: String,
        required: true
    },
    carDescription: {
        type: String,
        required: true
    },
    carVin: {
        type: String,
        required: true
    },
    carSeat: {
        type: Number,
        required: true
    },
    carAvailable: {
        type: Boolean,
        required: true
    },
    carPrice: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('CarInfoSchema', CarInfoSchema)
