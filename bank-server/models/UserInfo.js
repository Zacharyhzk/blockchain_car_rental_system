const mongoose = require('mongoose')

const UserInfoSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    socialId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    isBankApproved: {
        type: Boolean,
        required: true
    },
    uType: {
        type: Number,
        required: true
    }
    //0=personal, 1=business
    
})

module.exports = mongoose.model('UserInfo', UserInfoSchema)