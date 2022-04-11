const mongoose = require('mongoose')


const RentRecordSchema = mongoose.Schema({
    renterRecordId: {
        type: Number,
        required: true
    },
    carId: {
        type: Number,
        required: true
    },
    renterId: {
        type: String,
        required: true
    },
    walletAddress: {
        type: String,
        required: true
    },
    startDate: {
        type: Number, // 这里不用change成date类型吗？
        required: true
    },
    endDate: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    carRenturned: {
        type: Boolean,
        require: true
    },
    extraFee: {
        type: Number,
        required: true
    },
    deposit: {
        type: Number,
        required: true
    },
    rentState: { //这里改了变量名，对应contract里改一下
        type: String,
        required: true
    }
})

module.exports = mongoose.model('RentRecord', RentRecordSchema)