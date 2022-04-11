// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MicroToken.sol";
import "./UserIdentity.sol";

contract CarRentalOld is Ownable {

    // Declarations
    // Designing a structure to store the information of ABC Rental company's car fleet 
    struct carInfo {
        uint deposit; // Car deposit
        string carPlate; // Car lisence plate
        string carBrand; // Car brand 
        string carDescription; // Description about car
        uint carType; // 4 type, determined by room
        bool carAvailable; // Available: true ; Not Available: false
    }

    // Designing a structure to store the information of renter
    struct renterInfo {
        string renterId; // Renter identity card number
        string renterName; // Renter name
        uint renterAge; // Renter age
        string renterGender; // Renter gender
        address walletAddress; // Wallet address of customer
    }
    
    // Designing a structure to store the car renting history 
    struct rentalRecord {
        string carPlate; // Car plate
        string renterId; // Renter identity
        address walletAddress; // Wallet address of customer
        uint startDate;  // Start date
        uint endDate;   // End date
        uint duration;  // Num of days
        bool carReturned; // Car return status 
        uint extraFee; // Extra fee
        uint deposit; // deposit
    }

    address public companyAddress; // the address of the ABC company's account
    uint public contractBalance = 0; // check the contract balance
    uint public carCount = 0; // count the number of the cars added
    uint public customerCount = 0; // count the number of the customers
    uint public recordCount = 0; // count the number of the rental records 

    mapping(uint => carInfo) public cars; // to store the information of each car type
    mapping(uint => renterInfo) public renters; // to store the information of each renter
    mapping(uint => rentalRecord) public records; // to store the rental records

    // add token management
    MicroToken public tokenSC;  
    // add user identity management
    UserIdentity public identitySC;
    // Constructor
    constructor() {
        companyAddress = msg.sender;
        tokenSC = new MicroToken();
        identitySC = new UserIdentity();
    }

    // Modifiers  
    modifier isCompany() {
        require(msg.sender == companyAddress, "It must be company's address");
        _;
    }

    // A modifier that uses for the function which can only be called by Borrower.
    modifier isRegisteredCustomer() {
        // Now only borrower can request rent
        require(identitySC.verifyIsBorrower(msg.sender), "Bank Borrower Only");
       _;
   }

    // To check critical car info entered is correct
    modifier infoCorrect(uint carType) {
        bool numvalid = false;
        if (carType == 1 || carType == 2 || carType == 3 || carType == 4) {
            numvalid = true;
        }
        require(numvalid == true, "There's only 4 types of cars represented by 1 to 4.");
        _;
    }

   // Allow ABC Company to add car information
    function addCarInfo(uint deposit, string memory carPlate, string memory carDescription, string memory carBrand, uint carType, bool carAvailable) 
    public onlyOwner infoCorrect(carType) {
        bool carPlateUnique = true;
        for (uint i = 0; i < carCount+1; i++) {
            if (keccak256(bytes(cars[i].carPlate)) == keccak256(bytes(carPlate))) {
                carPlateUnique = false;
                break; 
            }
        }
        require(carPlateUnique == true, "Duplicated car license plate number!");
        // require(msg.value == 5 ether, "The company has to deposit 5 ETH for each car!");

        // Update contract balance
        // contractBalance = contractBalance + msg.value;

        // Only add if verified car plate has never been uploaded before
        cars[carCount] = carInfo(deposit, carPlate, carDescription, carBrand, carType, carAvailable);
        carCount++;
    }

    // Allow renter to check car availability
    function checkCarAvail(uint seatType) public view returns(uint[] memory) {
        require(carCount > 0, "There's no car in company");
        require(seatType == 1 || seatType == 2 || seatType == 3 || seatType == 4, "Only provide 4 types of cars! Type 1 can accommodate only 2, type 2 with 3 ~ 5, type 3 with 6 ~ 8, and type 4 can accommodate more than 8"); 

        uint tempCount;
        for (uint i = 0; i < carCount+1; i++) {
            if (cars[i].carType == seatType && cars[i].carAvailable == true) {
                tempCount++; 
            }
        }

        uint[] memory temp = new uint[](tempCount); 
        uint index = 0;
        for (uint i = 0; i < carCount + 1; i++) {
            if (cars[i].carType == seatType && cars[i].carAvailable == true) {
                temp[index] = i; 
                index++;
            }
        }
        return temp;
    }

    // Choose car that is available, Once deposit received from customer, company release car key to customer and key in start date. Contract amount will be reduced.
    // The customer should deposit car deposit + 5TH * num of days they intend to rent 
    function rentCar(uint carID, uint duration, string memory Name,
        string memory IDnum, uint renterAge, string memory renterGender, address walletAddress) 
        payable public 
        // noExtraFee(msg.sender) 
        {

        // To check the car is available
        require(cars[carID].carAvailable == true, "Car occupied, please pick another.");
        // require(walletAddress == msg.sender, "WalletAddress must be identical with message sender!");
        require(renterAge >= 21, "No cars for customers under 21.");
        // require(msg.value >= duration * 5 ether + cars[carID].deposit * 1 ether,
        //      "Deposit must larger than the sum of car deposit and 5 * duration (in ETH).");

        for (uint idx = recordCount; idx > 0; idx--) {
            if ( records[idx-1].walletAddress == walletAddress && records[idx-1].extraFee == 0 ether) {
                require(msg.value >= duration * 5 ether + cars[carID].deposit * 1 ether,
                 "Deposit must larger than the sum of car deposit and 5 * duration (in ETH).");
            } else if ( records[idx-1].walletAddress == walletAddress && records[idx-1].extraFee != 0 ether) {
                require(msg.value >= records[idx-1].extraFee + duration * 5 ether + cars[carID].deposit * 1 ether,
                 "You have to pay for your extrafee. Deposit must larger than the sum of car deposit + 5 * duration (in ETH) + extrafee.");
            } 
        }

        require(msg.value >= duration * 5 ether + cars[carID].deposit * 1 ether, "Deposit must larger than the sum of car deposit and 5 * duration (in ETH).");
        // Update contract balance
        contractBalance = contractBalance + msg.value;

        bool unique = true;
        // uint start = block.timestamp;
        // uint end = start + (duration * 1 days);
        
        // Customer database: Record customer info if unique
        for (uint i = 0; i < customerCount+1; i++) {
            if (keccak256(bytes(renters[i].renterId)) == keccak256(bytes(IDnum))) {
            unique = false;
            break;
            }
        }

        if (unique) {
            renters[customerCount] = renterInfo(Name, IDnum, renterAge, renterGender, walletAddress);
            customerCount++;
        }

        // Car Renting database: record cars that were rented and to which wallet address 
        records[recordCount] = rentalRecord(cars[carID].carPlate, IDnum, walletAddress, block.timestamp, 
                                            block.timestamp + (duration * 1 days), duration, false, 0, msg.value);
        
        cars[carID].carAvailable = false; // update car availability
        recordCount++;
        
        // As number of car available has reduced by 1, return the 5ETH deposited by company during listing
        uint companyDeposit = 5;
        contractBalance = contractBalance - companyDeposit;
        //companyAddress.transfer(5 ether);
        tokenSC.transferFrom(msg.sender, companyAddress, companyDeposit);
    }

    // To confirm the car return
    function confirmReturn(string memory carPlate, uint damageCharge, uint returnYear, uint returnMonth, uint returnDay) 
        payable public onlyOwner {
        uint recordIndex = 0;
        uint carIndex = 0;
        bool returnValid = false;
        
        // Check records and car list to ensure car is rented by customer, and get the wallet address of the customer
        for (uint i = recordCount; i > 0; i--) {
            if ( keccak256(bytes(records[i-1].carPlate)) == keccak256(bytes(carPlate)) ) {
                recordIndex = i-1;
                returnValid = true;
                break;
            }
        }
        require(returnValid, "This car is not rented by customer.");

        for (uint j = 0; j < carCount; j++) {
            if (keccak256(bytes(cars[j].carPlate)) == keccak256(bytes(carPlate)) ) {
                carIndex = j;
                break;
            }
        }

        // Final check to make sure this is the right car we looking at. 
        require(cars[carIndex].carAvailable == false, "The car has been rented.");
        require(records[recordIndex].carReturned == false, "This car has already been returned.");

        // Check date is entered correctly
        require(returnDay <= 31 && returnDay >= 1, "Check your day entered!");
        require(returnMonth <= 12 && returnMonth >= 1, "Check your month entered!");
        require(returnYear == getYear(block.timestamp), "Year of return should be the current year now which the car is returned.");

        // To confirm the return, the company need send in 5ETH which will be used to relist the car later
        require(msg.value == 5 ether, "The company needs to send in 5ETH to confirm the car return and relist it.");

        // To get the rental information
        address _walletAdd = records[recordIndex].walletAddress;
        uint num_of_days = records[recordIndex].duration;
        uint rent = 1;
        uint additionalCharge = 1; 
        uint surplusAmt = 0;
        uint lateFee = 0;
        // uint returnDate = block.timestamp;
        uint returnDate = timestampFromDate(returnYear, returnMonth, returnDay);
        uint deposit = 0 ether;

        // Update the return date in records
        records[recordIndex].endDate = returnDate;

        // check car type
        if (cars[carIndex].carType == 1) {											   
            rent = 2 ether;
        } 
        else if (cars[carIndex].carType == 2) {
            rent = 3 ether;
        } 
        else if (cars[carIndex].carType == 3) {
            rent = 4 ether;
        } 
        else if (cars[carIndex].carType == 4) {
            rent = 5 ether;
        }

        // Check if the car is returned late by calculating the days difference 
        //between startDate and endDate, and compare with numOfDays that user intended to rent.
        uint totalRentedDays = differentDays(records[recordIndex].startDate, returnDate);

        if(totalRentedDays > num_of_days) {
            lateFee = rent * (totalRentedDays - num_of_days); //charge rent * number of days late
        }

        // To calculate the total renting cost
        additionalCharge = additionalCharge * damageCharge; // convert to ether
        uint fee = num_of_days * rent + additionalCharge + lateFee;

        // update avail of the car by changing state to available
        cars[carIndex].carAvailable = true;

        // Update record
        records[recordIndex].carReturned = true;

        // Update the transfer of 5 ETH from company account to relist the car. 
        contractBalance = contractBalance + 5;
        // deposit = cars[carIndex].deposit * 1 ether;
        deposit = records[recordIndex].deposit;
        // Check if deposit can cover the total fee
        if (deposit <= fee) {
            // log the deficit that we require from the user
            records[recordIndex].extraFee = fee - deposit; 
            // No surplus and we take all the deposit 
            // surplusAmt = 0 ether;
            contractBalance = contractBalance - deposit; 
            //companyAddress.transfer(deposit);
            tokenSC.transferFrom(_walletAdd, companyAddress, deposit);
        }
        else { 
            surplusAmt = deposit - fee;
            // update contractbalance
            contractBalance = contractBalance - surplusAmt;
            contractBalance = contractBalance - fee;
            // Transfer surplus to customer
            //_walletAdd.transfer(surplusAmt);
            tokenSC.transferFrom(companyAddress, _walletAdd, surplusAmt);
            // Transfer fee earnings to company
            //companyAddress.transfer(fee);     
            tokenSC.transferFrom(_walletAdd, companyAddress, fee);       
        }
        // Ensure no overflow for the surplus, definitely will be between 0 and a value less than the deposit
        require(surplusAmt >= 0 && surplusAmt < deposit, "Customer's deposit not enough to cover the additional damage charge, topup required!");
        }

       
    // Pay extra fees if needed
    function CheckPayExtraFee(address walletAdd)  
    payable public {
        require(msg.sender == walletAdd, "You have to be the owner of the wallet address to pay for the extra fees.");

        address _walletAdd = walletAdd;

        bool needPay = true; //Do we need to pay outstanding fee
        uint index = 0;
        uint surplus = 0 ether;

        for (uint idx = recordCount; idx > 0; idx--) {
            if (records[idx-1].walletAddress != walletAdd) {
                break;
            } else if (records[idx-1].extraFee == 0 ether) {
                //If the latest rentor record available for this wallet address shows no outstanding fee, renter is allowed to rent 
                needPay = false;
                break;
            } else {
                //records[idx-1].extraFee != 0
                // found the record index where this wallet address has an extra fine
                index = idx -1;
            }
        }

        require(needPay == true, "You have no extra fees to pay! You can go ahead and rent a car!");

        if (records[index].extraFee > 0 ether) {
            require(msg.value >= records[index].extraFee, string(abi.encodePacked("Please pay for the extra fee ether: ", uint2str(records[index].extraFee/1000000000000000000))));
            surplus = msg.value - records[index].extraFee;
            records[index].extraFee = 0 ether;
            // companyAddress.transfer(records[index].extraFee); 
            // _walletAdd.transfer(surplus);
            tokenSC.transferFrom(records[index].walletAddress, companyAddress, records[index].extraFee);
            tokenSC.transferFrom(companyAddress, companyAddress, surplus);

        }

        require(recordCount > 0, "There is no extra associated fee so far!");

    }

    // helper function
    // Convert uint256 to string
    function uint2str(uint256 _i) internal pure returns (string memory str) {
      if (_i == 0) {
        return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
          length++;
          j /= 10;
          }
          bytes memory bstr = new bytes(length);
          uint256 k = length;
          j = _i;
          while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
            }
            str = string(bstr);
    }

    function _daysFromDate(uint year, uint month, uint day) internal pure returns (uint _days) {
        int OFFSET19700101 = 2440588;
        require(year >= 1970);
        int _year = int(year);
        int _month = int(month);
        int _day = int(day);

        int __days = _day
        - 32075
        + 1461 * (_year + 4800 + (_month - 14) / 12) / 4
        + 367 * (_month - 2 - (_month - 14) / 12 * 12) / 12
        - 3 * ((_year + 4900 + (_month - 14) / 12) / 100) / 4
        - OFFSET19700101;

        _days = uint(__days);
    }

    function timestampFromDate(uint year, uint month, uint day) internal pure returns (uint timestamp) {
        uint SECONDS_PER_DAY = 24 * 60 * 60;
        timestamp = _daysFromDate(year, month, day) * SECONDS_PER_DAY;
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
}