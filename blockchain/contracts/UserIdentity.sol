// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract UserIdentity{
    
    enum Role { GUEST, BROKER, BORROWER, INSURER }
    enum UserState { PENDING, APPROVED, REJECTED }
    
    struct Broker{
        uint id; 
        string socialSecurityId; // each Broker has unique social security id
        address walletAddress;
        string name;
        Role role;
        bool isBankApproved;
        UserState state;
    }

    struct InsuranceCompany{
        uint id; 
        string registrationNumber; // each company has unique registration number
        address walletAddress;
        string name;
        Role role;
        bool isBankApproved;
        UserState state;
    }

    struct Borrower{
        uint id; 
        string socialSecurityId; // each Borrower has unique social security id
        address walletAddress;
        string name;
        Role role;
        address addedBy;
        bool isBankApproved;
        UserState state;
    }
    
    event newBrokerAdded(
        uint id,
        string socialSecurityId,
        address walletAddress,
        string name,
        Role role,
        bool isBankApproved,
        UserState state
    );
    
    event newBorrowerAdded(
        uint id, 
        string socialSecurityId,
        address walletAddress,
        string name,
        Role role,
        address addedBy,
        bool isBankApproved,
        UserState state
    );
    
    event newInsurerAdded(
        uint id, 
        string registrationNumber,
        address walletAddress,
        string name,
        Role role,
        bool isBankApproved,
        UserState state
    );
    
    address owner;
    
    uint private brokersCount = 0;
    uint private borrowersCount = 0;
    uint private insurersCount = 0;
    
    mapping(address => Borrower) private borrowers;
    mapping(address => Broker) private brokers;
    mapping(address => InsuranceCompany) private insurers;
    
    address[] private brokersAddresses;
    address[] private borrowersAddresses;
    address[] private insurersAddresses;
    
    constructor()
    {
        owner = msg.sender;
    }
    
    modifier isOwner(address _address)
    {
        require(owner == _address, 'Bank Only');
        _;
    }
    
    modifier isBroker(address _address)
    {
        require(brokers[_address].role == Role.BROKER, 'Broker Only');
        _;
    }
    
    modifier isNewBroker(address _address)
    {
        bool isNew = false;
        if (brokers[_address].id == 0)
        {
            isNew = true;
        }
        require(isNew, 'Broker already exists');
        _;
    }
    
    modifier isNewIsnsurer(address _address)
    {
        bool isNew = false;
        if (insurers[_address].id == 0)
        {
            isNew = true;
        }
        require(isNew, 'Insurance Company already exists');
        _;
    }
    
    modifier isNewBorrower(address _address)
    {
        bool isNew = false;
        if (borrowers[_address].id == 0)
        {
            isNew = true;
        }
        require(isNew, 'Borrower already exists');
        _;
    }

    modifier isBrokerIn(address _address, UserState _state)
    {
        require(brokers[_address].state == _state, 'Broker is in a Invalid state');
        _;
    }

    modifier isBorrowerIn(address _address, UserState _state)
    {
        require(borrowers[_address].state == _state, 'Borrower is in a Invalid state');
        _;
    }

    modifier isInsuranceCompanyIn(address _address, UserState _state)
    {
        require(insurers[_address].state == _state, 'Insurance Company is in a Invalid state');
        _;
    }
    
    function addBroker(string memory _socialSecurityId, address _address, string memory _name) public isNewBroker(_address)
    {
        brokersCount = brokersCount + 1;
        Broker memory user = Broker(brokersCount, _socialSecurityId, _address, _name, Role.BROKER, false, UserState.PENDING);
        brokers[_address] = user;
        brokersAddresses.push(_address);
        emit newBrokerAdded(user.id, user.socialSecurityId, user.walletAddress, user.name, user.role, user.isBankApproved, user.state);
    }
    
    function addInsurer(string memory _registrationNumber, address _address, string memory _name) public isNewIsnsurer(_address)
    {
        insurersCount = insurersCount + 1;
        InsuranceCompany memory user = InsuranceCompany(insurersCount, _registrationNumber, _address, _name, Role.INSURER, false, UserState.PENDING);
        insurers[_address] = user;
        insurersAddresses.push(_address);
        emit newInsurerAdded(user.id, user.registrationNumber, user.walletAddress, user.name, user.role, user.isBankApproved, user.state);
    }
    
    function addBorrower(string memory _socialSecurityId, address _address, string memory _name) public isBroker(msg.sender) isNewBorrower(_address)
    {
        borrowersCount = borrowersCount + 1;
        Borrower memory user = Borrower(borrowersCount, _socialSecurityId, _address, _name,  Role.BORROWER, msg.sender, false, UserState.PENDING);
        borrowers[_address] = user;
        borrowersAddresses.push(_address);
        emit newBorrowerAdded(user.id, user.socialSecurityId, user.walletAddress, user.name, user.role, user.addedBy, user.isBankApproved, user.state);
    }
    
    function verifyIsBroker(address _address) public view returns(bool)
    {
        bool isValid = false;
        isValid = brokers[_address].role == Role.BROKER && brokers[_address].isBankApproved == true;
        return isValid;
    }
    
    function verifyIsBorrower(address _address) public view returns(bool)
    {
        bool isValid = false;
        isValid = borrowers[_address].role == Role.BORROWER && borrowers[_address].isBankApproved == true;
        return isValid;
    }
    
    function verifyIsInsurer(address _address) public view returns(bool)
    {
        bool isValid = false;
        isValid = insurers[_address].role == Role.INSURER && insurers[_address].isBankApproved == true;
        return isValid;
    }

    function verifyIsBank(address _address) public view returns(bool)
    {
        return owner == _address;
    }
    
    function approveBorrower(address _address) public isOwner(msg.sender) isBorrowerIn(_address, UserState.PENDING)
    {
        borrowers[_address].isBankApproved = true;
        borrowers[_address].state = UserState.APPROVED;
    }
    
    function approveBroker(address _address) public isOwner(msg.sender) isBrokerIn(_address, UserState.PENDING)
    {
        brokers[_address].isBankApproved = true;
        brokers[_address].state = UserState.APPROVED;
    }
    
    function approveInsuranceCompany(address _address) public isOwner(msg.sender) isInsuranceCompanyIn(_address, UserState.PENDING)
    {
        insurers[_address].isBankApproved = true;
        insurers[_address].state = UserState.APPROVED;
    }

    function rejectBorrower(address _address) public isOwner(msg.sender) isBorrowerIn(_address, UserState.PENDING)
    {
        borrowers[_address].isBankApproved = false;
        borrowers[_address].state = UserState.REJECTED;
    }
    
    function rejectBroker(address _address) public isOwner(msg.sender) isBrokerIn(_address, UserState.PENDING)
    {
        brokers[_address].isBankApproved = false;
        brokers[_address].state = UserState.REJECTED;
    }
    
    function rejectInsuranceCompany(address _address) public isOwner(msg.sender) isInsuranceCompanyIn(_address, UserState.PENDING)
    {
        insurers[_address].isBankApproved = false;
        insurers[_address].state = UserState.REJECTED;
    }
    
    function getAllBrokers() public view returns (Broker[] memory){
        Broker[] memory ret = new Broker[](brokersCount);
        for (uint i = 0; i < brokersCount; i++) {
            ret[i] = brokers[brokersAddresses[i]];
        }
        return ret;
    }
    
    function getAllInsurers() public view returns (InsuranceCompany[] memory){
        InsuranceCompany[] memory ret = new InsuranceCompany[](insurersCount);
        for (uint i = 0; i < insurersCount; i++) {
            ret[i] = insurers[insurersAddresses[i]];
        }
        return ret;
    }
    
    function getAllBorrowers() public view returns (Borrower[] memory){
        Borrower[] memory ret = new Borrower[](borrowersCount);
        for (uint i = 0; i < borrowersCount; i++) {
            ret[i] = borrowers[borrowersAddresses[i]];
        }
        return ret;
    }

    function getBankAddress() public view returns (address _bankAddress){
        return owner;
    }
}