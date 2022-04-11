pragma solidity >=0.7.0 < 0.9.0;

import "./MicroToken.sol";
import "./UserIdentity.sol";

contract CarRentalSmartContract {

    struct Car {
        string name;
        // Car's Deposit = 90 * dailyRent (3 month's rent)
        uint needDeposit;
        // The rent for renting the car one day.
        uint dailyRent;
    }

    //will record the action involved with money
    // 
    struct customerRentCarRecord {
        uint rentRecordId;
        address customerAddress;
        string carName;
        uint rentDays;
        uint totalMoneyDeposit;
        uint rentTimeStamp;
        int returnRecordId;
    }

    struct customerReturnCarRecord {
        uint returnRecordId;
        uint rentRecordId;
        address customerAddress;
        string carName;
        uint returnTimeStamp;
        uint rentFee;
        int auditRecordId;

    }

    struct ABCAuditDepositRecord {
        uint auditRecordId;
        uint returnRecordId;
        address customerAddress;
        uint damageFixFee;
        uint actualRefundAmount;

    }
    
    // company address
    address public ABCAddress;

    // A mapping that stores all customers' addresses.
    // If an address exists, its value is true, else false.
    // Now borrower rents car. No need customer's registration
    //mapping (address => bool) public allCustomerAddresses;

    /* 
        This customer's renting car. 
        Customer's Address => Car's Name => This Car's Number
        e.g. Bob's renting 2 cars A. Bob's Address => 'A' => 2
    */
    mapping (address => mapping(string => uint)) public customerRentingCarNumber;


    // Cars' Info. Car's Name => Car's Info (a Car struct)
    mapping (string => Car) public carInfo;
    // Cars' availability. Car's Name => Available Number
    mapping (string => uint) public carAvailability;



    // All action history. 
    // Use allCustomerRentCarRecord[RentRecordId] to visit the record.
    uint public currentRentRecordId  = 1;
    mapping (uint => customerRentCarRecord) public allCustomerRentCarRecord;

    uint public currentReturnRecordId = 1;
    mapping (uint => customerReturnCarRecord) public allCustomerReturnCarRecord;

    uint public currentAuditRecordId = 1;
    mapping (uint => ABCAuditDepositRecord) public allABCAuditDepositRecord;

    // add token management
    MicroToken public tokenSC;  
    // add user identity management
    UserIdentity public identitySC;

    // A modifier that uses for the function which can only be called by ABC.
    modifier onlyABCCompanyCanCall {
      require(msg.sender == ABCAddress, "Only ABC can call this function!");
      _;
   }

    // A modifier that uses for the function which can only be called by Borrower.
    modifier onlyRegisteredCustomerCanCall {
        // Now only borrower can request rent
        require(identitySC.verifyIsBorrower(msg.sender), "Borrower Only");
       _;
   }

    /* 
    ABC company calls this function.
    ABC company deploys this contract.
    */
    constructor(address microTokenContractAddress, address userIdentityContractAddress) {
        ABCAddress = msg.sender;
        tokenSC = MicroToken(microTokenContractAddress);
        identitySC = UserIdentity(userIdentityContractAddress);
    }


    /* 
    Now borrower can request rent.
    No need to check the customer's registration.
    */
    /*
    function customerRegister() public returns (bool) {
        allCustomerAddresses[msg.sender] = true;
        return true;
    }
    */

    /* 
    ABC company calls this function.
    Abc company add cars to this contract. 
    Store car's info in carInfo. Update carAvailability.
    */
    function ABCAddCar(string calldata carName, uint carDailyRent, uint number) public onlyABCCompanyCanCall returns (bool) {
        //require(msg.sender == ABCAddress, "Only ABC can add cars!");

        carInfo[carName] = Car({
            name: carName, 
            needDeposit: carDailyRent * 90,
            dailyRent: carDailyRent
        });

        carAvailability[carName] += number;

        return true;
    }

    /*
    Customer calls this function.
    Customer rent ONE car.
    Specify the carName and the rentDays.
    */
    function customerRentCar(string calldata carName, uint rentDays) payable public onlyRegisteredCustomerCanCall returns (customerRentCarRecord memory) {
        //require(allCustomerAddresses[msg.sender] == true, "Customer not registered! Please register first!");
        require(carAvailability[carName] > 0, "No this type's cars available now!");

        uint depositValueHere = carInfo[carName].needDeposit + rentDays * carInfo[carName].dailyRent;
        //require(msg.value >= (carInfo[carName].needDeposit + rentDays * carInfo[carName].dailyRent), "Deposit given here is not enough! Deposit shoule be larger than (90 + rentDays) * dailyRent");

        // update customer renting car info
        customerRentingCarNumber[msg.sender][carName] += 1;
        // update car's availability info
        carAvailability[carName] -= 1;
        // generate a customerRentCarRecord and put the record into customerRentCarRecord
        customerRentCarRecord memory thisRentCarRecord = customerRentCarRecord(currentRentRecordId, msg.sender, carName, rentDays, depositValueHere, block.timestamp, -1);
        allCustomerRentCarRecord[currentRentRecordId] = thisRentCarRecord;
        currentRentRecordId += 1;

        // customer pay token to the ABCAddress as Deposit
        tokenSC.transferFrom(msg.sender, ABCAddress, depositValueHere);
        

        return thisRentCarRecord;
    }
    

    /*
    Customer calls this function.
    According to given rentRecordId, customer returns the car to this specified rent record. 
    */
    function customerReturnCar(uint rentRecordId) public onlyRegisteredCustomerCanCall returns (customerReturnCarRecord memory) {
        require(rentRecordId <= currentRentRecordId && rentRecordId > 0, "Input rentRecordId Invaid!");
        require(msg.sender == allCustomerRentCarRecord[rentRecordId].customerAddress, "The customer's address doesn't matched!");
        require(allCustomerRentCarRecord[rentRecordId].returnRecordId == -1, "The rent of this rentId has been already returned!");
        
        // Retrieve some values.
        string memory carNameHere = allCustomerRentCarRecord[rentRecordId].carName;
        uint rentTimeStampHere = allCustomerRentCarRecord[rentRecordId].rentTimeStamp;
        
        // update customer renting car info
        customerRentingCarNumber[msg.sender][carNameHere] -= 1;
        // update car's availability info
        carAvailability[carNameHere] += 1;

        // Use timestamp to compute the actual 
        uint timeNow = block.timestamp;
        uint actualTimePassed =  timeNow - rentTimeStampHere;
        /* Calculate how many days passed. 
            In Solidity,the decimal part will be tructated, so the actualDayPassed will be added 1 finally. 
         */
        uint actualDayPassed = actualTimePassed / 60 / 60 / 24 + 1;


        // Compute rent fee.
        uint rentFeeHere = actualDayPassed * carInfo[carNameHere].dailyRent;
        
        // generate a customerReturnCarRecord and put the record into customerRentCarRecord
        customerReturnCarRecord memory thisReturnCarRecord = customerReturnCarRecord(currentReturnRecordId, 
                                                                                     rentRecordId, 
                                                                                     msg.sender, 
                                                                                     carNameHere, 
                                                                                     timeNow, 
                                                                                     rentFeeHere, 
                                                                                     -1);
        allCustomerReturnCarRecord[currentReturnRecordId] = thisReturnCarRecord;
        allCustomerRentCarRecord[rentRecordId].returnRecordId = int(currentReturnRecordId);
        currentReturnRecordId += 1;

        return thisReturnCarRecord;
    }

    /*
    ABC company calls this function.
     According to given returnRecordId, ABC companys checks the rentFee + damageFee and gives back the remained deposit to customer. 
     */
    function ABCAuditDeposit(uint returnRecordId, uint damageFixFeeHere) payable public onlyABCCompanyCanCall returns (ABCAuditDepositRecord memory) {
        require(returnRecordId <= currentReturnRecordId && returnRecordId > 0, "Input returnRecordId Invaid!");
        //require(msg.sender == ABCAddress, "Only ABC company can audit the deposit!");
        require(allCustomerReturnCarRecord[returnRecordId].auditRecordId == -1, "The return of this returnId has been already audited!");


        // Retrieve some values from rent&return record
        address customerAddressHere = allCustomerReturnCarRecord[returnRecordId].customerAddress;
        uint totalDepositHere = allCustomerRentCarRecord[allCustomerReturnCarRecord[returnRecordId].rentRecordId].totalMoneyDeposit;
        uint rentFeeHere = allCustomerReturnCarRecord[returnRecordId].rentFee;

        // Compute Remained Deposit that will be refunded to customer
        uint refundAmountHere = totalDepositHere - rentFeeHere - damageFixFeeHere;

        // Refund to customer
        tokenSC.transferFrom(ABCAddress, customerAddressHere, refundAmountHere);

        ABCAuditDepositRecord memory auditDepositRecordHere = ABCAuditDepositRecord(currentAuditRecordId, 
                                                                                    returnRecordId,
                                                                                    customerAddressHere, 
                                                                                    damageFixFeeHere, 
                                                                                    refundAmountHere);

        allABCAuditDepositRecord[currentAuditRecordId] = auditDepositRecordHere;
        allCustomerReturnCarRecord[returnRecordId].auditRecordId = int(currentAuditRecordId);
        currentAuditRecordId += 1;
        
        return auditDepositRecordHere;
    }

}