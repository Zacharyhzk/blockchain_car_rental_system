// SPDX-License-Identifier: MIT
pragma solidity >=0.4.2 <0.9.0;

contract UserIdentity{

    //enum Role { Borrower, Company } // Do we need to identity the difference from the borrower and company for bank
    enum UserState { PENDING, APPROVED, REJECTED }

    struct User{
        uint id; 
        string socialId; // everyone has an unique social id
        address walletAddress; // User wallet address
        string userName;
        //string userType;  //Admin, users (For bank, there is no difference between ABC company and consumers)
        bool isBankApproved;
        UserState state;
        //uint uType;  //0=personal, 1=business
    }

    event newUserAdded(
        uint id,
        string socialSecurityId,
        address walletAddress,
        string name,
        bool isBankApproved,
        UserState state
    );

    address public bank_admin; //Stores smart contract deployer’s(Bank) address

    uint usersCount = 0;

    mapping(address => User) private users;

    address[] private usersAddresses;

    constructor(){
        bank_admin = msg.sender;
    }

    modifier isAdmin(address _address){
        // Checks _address is the smart contract admin’s(Bank) address.
        require(bank_admin == _address, 'Bank Admin Only');
        _;
    }

    modifier isUserIn(address _address, UserState _state)
    {
        require(users[_address].state == _state, 'User is in a Invalid state');
        _;
    }

    function addAccountToBlockchain(string memory _socialId, address _walletAddress, string memory _userName) 
        public isAdmin(msg.sender)
    {
        usersCount += 1; //usersCount = usersCount + 1
        User memory user = User(usersCount, _socialId, _walletAddress, _userName,  false, UserState.PENDING);
        users[_walletAddress] = user;
        usersAddresses.push(_walletAddress);
        emit newUserAdded(user.id, user.socialId, user.walletAddress, user.userName, user.isBankApproved, user.state);
    }

    function verifyIsUser(address _walletAddress) public view returns(bool)
    {
        bool isValid = false;
        isValid = users[_walletAddress].isBankApproved == true;
        return isValid;
    }

    function verifyIsBank(address _walletAddress) public view returns(bool)
    {
        return bank_admin == _walletAddress;
    }

    function approveUser(address _address) public isAdmin(msg.sender) isUserIn(_address, UserState.PENDING)
    {
        users[_address].isBankApproved = true;
        users[_address].state = UserState.APPROVED;
    }

    function rejectUser(address _address) public isAdmin(msg.sender) isUserIn(_address, UserState.PENDING)
    {
        users[_address].isBankApproved = false;
        users[_address].state = UserState.REJECTED;
    }
    

    function getAllUsers() public view returns (User[] memory){
        User[] memory ret = new User[](usersCount);
        for (uint i = 0; i < usersCount; i++) {
            ret[i] = users[usersAddresses[i]];
        }
        return ret;
    }

    function getBankAddress() public view returns (address _bankAddress){
        return bank_admin;
    }


}