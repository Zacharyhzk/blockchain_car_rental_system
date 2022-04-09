// SPDX-License-Identifier: MIT
pragma solidity >=0.4.2 <0.9.0;

contract CarRental{
    // Designing a structure to store the information of ABC Rental company's car fleet 
    struct carInfo {
        string carBrand; // Car brand 
        string carDescription; // Description about car
        string carVin; // Car vehicle identification number 
        uint carSeat; // 
        bool carAvailable; // Available: true ; Not Available: false
        uint carPrice; // Car rental price per day
    }

    // Designing a structure to store the information of renter
    struct renterInfo {
        uint userId;
        string socialId; // Renter social id
        string userName; // Renter name
        uint userAge; // Renter age
        address walletAddress; // Wallet address of customer
    }
    
    // Designing a structure to store the car renting history 
    struct rentalRecord {
        string carVin; // Car vin
        string socialId; // Renter social identity
        address walletAddress; // Wallet address of customer
        uint startDate;  // Start date
        uint endDate;   // End date
        uint duration;  // Num of days
        bool carReturned; // Car return status 
        uint extraFee; // Extra fee
    }
}