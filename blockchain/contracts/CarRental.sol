// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.7.0 <0.9.0;

import "./MicroToken.sol";
import "./UserIdentity.sol";
// import "truffle/Console.sol";

contract CarRental{

    enum RentState{
        REQUESTED,
        COMPANY_APPROVED, 
        COMPANY_REJECTED, 
        DEPOSIT_RETURNED,
        RENTER_SIGNED, 
        CLOSE,
        WAITING_TO_PAY,
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
        uint lateFee; //late Fee
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

    MicroToken public tokenSC; // 
    // add user identity management
    UserIdentity public identitySC;
    address payable public companyAddress; // the address of the ABC company's account
    carInfo[] private cars;
    rentalRecord[] private records; // to store the rental records
    uint public carCount = 0; // count the number of the cars added

    mapping(uint => renterInfo) public renters; // to store the information of each rente

    constructor (address _userIdentityAddress, address _microTokenAddress) payable{
            companyAddress = payable(msg.sender);
            tokenSC = MicroToken(_microTokenAddress);
            identitySC = UserIdentity(_userIdentityAddress);
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
        if (_carId <= cars.length) {
            isAvailable = true;
        }
        require(isAvailable);
        _;
    }

    // A modifier that uses for the function which can only be called by Borrower.
    modifier onlyRegisteredCustomerCanCall {
        // Now only borrower can request rent
        require(identitySC.verifyIsBorrower(msg.sender), "Bank Borrower Only");
       _;
   }

    //Do we need modifier to verify renter's address???

    //add user just need add rentRequest or still need 

    function addCarInfo(string memory _carBrand, string memory _carDescription, string memory _carVin, uint _carSeat, uint _carPrice, address contractAddress) public payable
    {
        // isABCCompany
        bool carVinUnique = true;
        carInfo memory car = carInfo(cars.length, _carBrand, _carDescription, _carVin, _carSeat, true, _carPrice);
        for (uint i = 0; i < cars.length; i++) {
            if (keccak256(bytes(cars[i].carVin)) == keccak256(bytes(_carVin))) {
                carVinUnique = false;
                break; 
            }
        }

        require(carVinUnique == true, "Duplicated car license vin number!");
        tokenSC.transfer(contractAddress, _carPrice / 100);
        cars.push(car);
        emit addCarInfoRequest(car.carId, car.carBrand, car.carDescription, car.carVin, car.carSeat, car.carAvailable, car.carPrice);

    }

    function editCarInfo(uint _carId, string memory _carBrand, string memory _carDescription, string memory _carVin, uint _carSeat, uint _carPrice) payable public  {
        //isABCCompany()
        //carVin can not change->vin unique check do in server
        bool carVinRepeat = false;
        cars[_carId-1].carBrand = _carBrand;
        cars[_carId-1].carDescription = _carDescription;
        cars[_carId-1].carSeat = _carSeat;
        cars[_carId-1].carPrice = _carPrice;
        for (uint i = 0; i < cars.length; i++) {
            if (keccak256(bytes(cars[i].carVin)) == keccak256(bytes(_carVin))) {
                carVinRepeat = true;
                break;
            }
        }
        require(carVinRepeat == false, "Duplicated car vin number!");
        cars[_carId-1].carVin = _carVin;
    }

    function deleteCarInfo(uint _carId) public payable isABCCompany() {
        //In case id issue, so just change the car status
        cars[_carId].carAvailable = false;
    }

    function applyCar(uint _carId, string memory _renterId, uint _startDate, uint _endDate, uint _duration) payable public isAvailableCar(_carId) {
        //onlyRegisteredCustomerCanCall
        uint deposit = calculateDeposit(_duration, _carId);

        rentalRecord memory record = rentalRecord(records.length, _carId, _renterId, msg.sender, _startDate, _endDate, _duration, false, 0, deposit, 0, RentState.REQUESTED);
        records.push(record);

        emit carRentalRequest(record);

        // companyAddress.transfer(deposit);
        tokenSC.transferFrom(msg.sender, companyAddress, deposit); //after this step user receive car?

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

    function returnDeposit(uint _renterRecordId) payable public isABCCompany() {

        address payable renterAddress = payable(records[_renterRecordId-1].walletAddress);

        renterAddress.transfer(records[_renterRecordId-1].deposit);
        //tokenSC.transferFrom(companyAddress, records[_renterRecordId-1].walletAddress, records[_renterRecordId-1].deposit);
        records[_renterRecordId-1].state = RentState.DEPOSIT_RETURNED;

    }

    function applyReturnCar(uint _renterRecordId) public onlyRegisteredCustomerCanCall {
        records[_renterRecordId-1].state = RentState.WAITING_TO_PAY;
    }

    function confirmReturn(uint _renterRecordId, uint _extraFee, uint _returnYear, uint _returnMonth, uint _returnDay) public isABCCompany() {

        require(records[_renterRecordId-1].carReturned == false, "This car has already been returned.");

        // Check date is entered correctly
        require(_returnDay <= 31 && _returnDay >= 1, "Check your day entered!");
        require(_returnMonth <= 12 && _returnMonth >= 1, "Check your month entered!");
        require(_returnYear == getYear(block.timestamp), "Year of return should be the current year now which the car is returned.");

        // Update the return date in records
        records[_renterRecordId-1].endDate = _returnDay;

        // Check if the car is returned late by calculating the days difference 
        //between startDate and endDate, and compare with numOfDays that user intended to rent.
        uint totalRentedDays = differentDays(records[_renterRecordId-1].startDate, _returnDay);

        uint price = cars[records[_renterRecordId-1].carId -1].carPrice;

        if (totalRentedDays > records[_renterRecordId-1].duration) {
            records[_renterRecordId-1].lateFee = price * (totalRentedDays - records[_renterRecordId-1].duration); //charge rent * number of days late
        }

        records[_renterRecordId-1].extraFee = _extraFee;

        records[_renterRecordId-1].state = RentState.WAITING_TO_PAY;

    }

    function payFee(uint _renterRecordId) public {
        uint totalRentedDays = differentDays(records[_renterRecordId-1].startDate,records[_renterRecordId-1].endDate);
        uint price = cars[records[_renterRecordId-1].carId -1].carPrice;
        uint feeWaitingPay = totalRentedDays * price * 9 / 10 + records[_renterRecordId-1].extraFee;
        
        companyAddress.transfer(feeWaitingPay);
        //tokenSC.transferFrom(msg.sender,companyAddress, feeWaitingPay);
        records[_renterRecordId-1].carReturned = true;

        records[_renterRecordId-1].state = RentState.CLOSE;

    }

    function differentDays(uint fromTimestamp, uint toTimestamp) internal pure returns (uint _days) {
        uint SECONDS_PER_DAY = 24 * 60 * 60;
        require(fromTimestamp <= toTimestamp);
        _days = (toTimestamp - fromTimestamp) / SECONDS_PER_DAY;
    }

    function getYear(uint timestamp) internal pure returns (uint year) {
        uint secondsAccounted = 0;
        uint numLeapYears;
        uint16 ORIGIN_YEAR = 1970;
        uint YEAR_IN_SECONDS = 31536000;
        uint LEAP_YEAR_IN_SECONDS = 31622400;
 
        // Year
        year = uint16(ORIGIN_YEAR + timestamp / YEAR_IN_SECONDS);
        numLeapYears = leapYearsBefore(year) - leapYearsBefore(ORIGIN_YEAR);
 
        secondsAccounted += LEAP_YEAR_IN_SECONDS * numLeapYears;
        secondsAccounted += YEAR_IN_SECONDS * (year - ORIGIN_YEAR - numLeapYears);
 
        while (secondsAccounted > timestamp) {
            if (isLeapYear(uint16(year - 1))) {
                secondsAccounted -= LEAP_YEAR_IN_SECONDS;
            }
            else {
                secondsAccounted -= YEAR_IN_SECONDS;
            }
            year -= 1;
        }
        return year;
    }

        //To calculate the leap year before the input year
    function leapYearsBefore(uint year) public pure returns (uint) {
        year -= 1;
        return year / 4 - year / 100 + year / 400;
    }

    //To check if the year inputed is a leapyear
    function isLeapYear(uint16 year) public pure returns (bool) {
        if (year % 4 != 0) {
            return false;
        }
        if (year % 100 != 0) {
            return true;
        }
        if (year % 400 != 0) {
            return false;
        }
        return true;
    }

    function carTransfer(address _walletAddress, uint _amount) public payable returns (bool){
        tokenSC.transfer(_walletAddress , _amount);

        return true;
    }

    function parseAddr(string memory _a) internal pure returns (address _parsedAddress) {
        bytes memory tmp = bytes(_a);
        uint160 iaddr = 0;
        uint160 b1;
        uint160 b2;
        for (uint i = 2; i < 2 + 2 * 20; i += 2) {
            iaddr *= 256;
            b1 = uint160(uint8(tmp[i]));
            b2 = uint160(uint8(tmp[i + 1]));
            if ((b1 >= 97) && (b1 <= 102)) {
                b1 -= 87;
            } else if ((b1 >= 65) && (b1 <= 70)) {
                b1 -= 55;
            } else if ((b1 >= 48) && (b1 <= 57)) {
                b1 -= 48;
            }
            if ((b2 >= 97) && (b2 <= 102)) {
                b2 -= 87;
            } else if ((b2 >= 65) && (b2 <= 70)) {
                b2 -= 55;
            } else if ((b2 >= 48) && (b2 <= 57)) {
                b2 -= 48;
            }
            iaddr += (b1 * 16 + b2);
        }
        return address(iaddr);
}

    function getAllCars() public view returns (carInfo[] memory) {
        return cars;
    }

    function getCarById(uint _carId) public view returns (carInfo memory) {
        //pay attentation the carid relationship with index and id
        return cars[_carId];
    }
    
}