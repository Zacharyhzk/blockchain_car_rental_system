const mongoose = require('mongoose')

const CarRentSchema = mongoose.Schema({
    /* struct renterInfo {
        uint userId;
        string socialId; // Renter social id
        string userName; // Renter name
        uint userAge; // Renter age
        address walletAddress; // Wallet address of customer
        //IERC20 renterToken; // renter IERC20 token
    }*/

    userId: {
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
    userAge: {
        type: Number,
        required: true
    },
    walletAddress: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('CarRent', CarRentSchema)