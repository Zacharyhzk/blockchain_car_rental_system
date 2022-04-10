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
        //IERC20 renterToken; // renter IERC20 token
    }

    // Designing a structure to store the car renting history 
    struct rentalRecord {
        uint renterRecordId;
        uint carId; // Car id
        string renterId; // Renter identity
        //IERC20 renterToken;
        address walletAddress; // Wallet address of customer
        uint startDate;  // Start date
        uint endDate;   // End date
        uint duration;  // Num of days
        bool carReturned; // Car return status 
        uint extraFee; // Extra fee
        uint deposit; // deposit
        RentState state;
    }

    event carRentalRequest (rentalRecord);

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

    IERC20 public tokenSC; // 
    address public companyAddress; // the address of the ABC company's account
    carInfo[] private cars;
    rentalRecord[] private records; // to store the rental records

    mapping(uint => renterInfo) public renters; // to store the information of each rente

    constructor () {
            companyAddress = msg.sender;
            //How to verify company's address
    }

    // Modifiers  
    modifier isABCCompany()
    {
        require(msg.sender == companyAddress, "It must be ABC company's address");
        _;
    }

    //if car available,user car id or car vin?
    modifier isAvailableCar(uint _carId) 
    {
        bool isAvailable = false;
        // for(uint i=0; i< cars.length; i++)
        // {
        //     if(cars[i].carVin == _carVin)
        //     {
        //         isAvailable = true;
        //         break;
        //     }
        // }
        if (_carId <= cars.length) {
            isAvailable = true;
        }
        require(isAvailable);
        _;
    }

    //Do we need modifier to verify renter's address???

    //add user just need add rentRequest or still need 

    function addCarInfo(string memory _carBrand, string memory _carDescription, string memory _carVin, uint _carSeat, uint _carPrice) public isABCCompany()
    {
        bool carVinUnique = true;
        carInfo memory car = carInfo(cars.length + 1, _carBrand, _carDescription, _carVin, _carSeat, true, _carPrice);
        for (uint i = 0; i < cars.length+1; i++) {
            if (keccak256(bytes(cars[i].carVin)) == keccak256(bytes(_carVin))) {
                carVinUnique = false;
                break; 
            }
        }

        require(carVinUnique == true, "Duplicated car license vin number!");
        cars.push(car);

        emit addCarInfoRequest(car.carId, car.carBrand, car.carDescription, car.carVin, car.carSeat, car.carAvailable, car.carPrice);

    }

    function editCarInfo(uint _carId, string memory _carBrand, string memory _carDescription, string memory _carVin, uint _carSeat, uint _carPrice) public isABCCompany() {
        //carVin can not change->vin unique check do in server
        cars[_carId-1].carBrand = _carBrand;
        cars[_carId-1].carDescription = _carDescription;
        cars[_carId-1].carSeat = _carSeat;
        cars[_carId-1].carPrice = _carPrice;
        cars[_carId-1].carVin = _carVin;
    }

    function deleteCarInfo(uint _carId) public isABCCompany() {
        //In case id issue, so just change the car status
        cars[_carId].carAvailable = false;
    }

    function applyCar(uint _carId, string memory _renterId, uint _startDate, uint _endDate, uint _duration) public isAvailableCar(_carId){
        uint deposit = calculateDeposit(_duration, _carId);

        rentalRecord memory record = rentalRecord(records.length + 1, _carId, _renterId, msg.sender, _startDate, _endDate, _duration, false, 0, deposit, RentState.REQUESTED);
        records.push(record);

        emit carRentalRequest(record);

        tokenSC.transferFrom(msg.sender, companyAddress, deposit);

    }

    function calculateDeposit(uint _duration, uint _carId) public view returns (uint deposit) {
        //should use 10/100 rather than 0.1
        return cars[_carId].carPrice * _duration * 10 / 100;
    }

    function approveRent(uint _renterRecordId, uint _carId) public isABCCompany() isAvailableCar(_carId) {

        for (uint i = 0; i < records.length; i++) {
            if (records[i].renterRecordId == _renterRecordId) {
                records[i].state = RentState.COMPANY_APPROVED;
                break;
            }
        }

        cars[_carId - 1].carAvailable = false;
    }

    function rejectRent(uint _renterRecordId, uint _carId) public isABCCompany() isAvailableCar(_carId) {

        for (uint i = 0; i < records.length; i++) {
            if (records[i].renterRecordId == _renterRecordId) {
                records[i].state = RentState.COMPANY_REJECTED;
                break;
            }
        }

    }

    function returnDeposit(uint _renterRecordId) public isABCCompany() {

        tokenSC.transferFrom(companyAddress, records[_renterRecordId-1].walletAddress, records[_renterRecordId-1].deposit);
        records[_renterRecordId-1].state = RentState.COMPANY_REJECTED;

    }
    
}