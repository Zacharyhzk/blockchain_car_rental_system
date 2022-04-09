const mongoose = require('mongoose')

const UserAuthSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('UserAuth', UserAuthSchema)