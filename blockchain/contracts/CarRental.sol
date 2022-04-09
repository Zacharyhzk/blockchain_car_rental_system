pragma solidity >=0.7.0 <0.9.0;

import "./MicroToken.sol";

contract CarRental{

    enum RentState{
        REQUESTED,
        COMPANY_APPROVED, 
        COMPANY_REJECTED, 
        DEPOSIT_RETURNED,
        RENTER_SIGNED, 
        PENDING,
        CAR_RECEIVED,
        WAITING_TO_PAY,
        WAITING_TO_PAY_EXTRA_FEE,
        ACCOUNT_LOCKED
    }
    //(op)Dodo can buy insurance for the rental. She can buy while signing a contract with the company. The company will represent the Insurance Co.
    //(op)Dodo needs to transfer insurance fees to the company. 
    //(op)The company transfers part of the insurance fee to the Insurance Co. when rental begins and transfers the left part after the contract is over.
    //Above need extra RentState

    enum RegisterState{
        REQUESTED,
        COMPANY_APPROVED, 
        COMPANY_REJECTED
    }

    //Do we need RENTER_SIGNED really need???

    // Designing a structure to store the information of ABC Rental company's car fleet 
    struct carInfo {
        uint carId; //Incremental generation 
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
        IERC20 renterToken; // renter IERC20 token
    }

    // Designing a structure to store the car renting history 
    struct rentalRecord {
        string carVin; // Car vin
        string renterId; // Renter identity
        IERC20 renterToken;
        address walletAddress; // Wallet address of customer
        uint startDate;  // Start date
        uint endDate;   // End date
        uint duration;  // Num of days
        bool carReturned; // Car return status 
        uint extraFee; // Extra fee
    }

    event addCarInfoRequest(
        uint carId, 
        string carBrand,
        string carDescription,
        string carVin, 
        uint carSeat, 
        bool carAvailable,
        uint carPrice
    );
    // do we need car available date

    IERC20 public companyToken; // The token of the ABC company
    address public companyAddress; // the address of the ABC company's account
    carInfo[] private cars;

    mapping(uint => carInfo) public cars; // to store the information of each car type
    mapping(uint => renterInfo) public renters; // to store the information of each renter
    mapping(uint => rentalRecord) public records; // to store the rental records

    constructor (address _companyAddress) {
            companyAddress = msg.sender;
            //How to verify company's address
    }

    // Modifiers  
    modifier isABCCompany()
    {
        require(msg.sender == companyAddress, "It must be ABC company's address");
        _;
    }

    //Do we need modifier to verify renter's address???

    //add user just need add rentRequest or still need 

    function addCarInfo(string _carBrand, string _carDescription, string _carVin, uint carSeat, uint carPrice) public isABCCompany()
    {
        bool carVinUnique = true;
        carInfo memory carInfo = carInfo(cars.length + 1, _carBrand, _carDescription, _carVin, _carSeat, _carPrice);
        for (uint i = 0; i < cars.length+1; i++) {
            if (keccak256(bytes(cars[i].carVin)) == keccak256(bytes(carVin))) {
                carVinUnique = false;
                break; 
            }
        }

        require(carVinUnique == true, "Duplicated car license vin number!");
        cars.push(carInfo);

        emit addCarInfoRequest(carInfo.carId, carInfo.carBrand, carInfo.carDescription, carInfo.carVin, carInfo.carSeat, true, carInfo.carPrice);

    }

    

}