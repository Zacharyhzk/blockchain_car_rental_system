// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./UserInfo.sol";

contract BankLoan{
    
    enum LoanState{
        REQUESTED, 
        USER_SIGNED, 
        BANK_APPROVED, 
        BANK_REJECTED,  
        PAID_TO_BANK, 
        ONGOING, 
        DEFAULT, 
        CLOSE,
        CLAIM_REQUESTED, 
        CLAIMED
    }
    
    struct Loan
    {
        uint loanId;
        uint amount;
        uint months;
        uint interest;
        string planId;
        LoanState state;
        address user;
    }
    
    event loanRequest(
        uint loanId,
        uint amount,
        uint months,
        uint interest,
        string planId,
        LoanState state,
        address user
    );
    
    address private bank_admin;
    UserInfo identitySC;
    Loan[] private loans;
    
    constructor (address _identitySC) {
            bank_admin = msg.sender;  // Ganache Account 1, the Bank
            identitySC = UserInfo(_identitySC);
    }
    
    modifier isAdmin()
    {
        require(msg.sender == bank_admin);
        _;
    }

    modifier isUser()
    {
        require(identitySC.verifyIsUser(msg.sender), 'Broker Only');
        _;
    }

    modifier isLoanUser(uint _loanId){
        bool isValid = false;
        for(uint i=0; i< loans.length; i++)
        {
            if(loans[i].loanId == _loanId && loans[i].user == msg.sender)
            {
                isValid = true;
                break;
            }
        }
        require(isValid);
        _;
    }
    
    modifier isValidLoan(uint _loanId)
    {
        bool isValid = false;
        for(uint i=0; i< loans.length; i++)
        {
            if(loans[i].loanId == _loanId)
            {
                isValid = true;
                break;
            }
        }
        require(isValid);
        _;
    }
    
    modifier isLoanIn(uint _loanId, LoanState _state)
    {
        bool isValid = false;
        for(uint i=0; i< loans.length; i++)
        {
            if(loans[i].loanId == _loanId && loans[i].state == _state)
            {
                isValid = true;
                break;
            }
        }
        require(isValid);
        _;
    }

    function applyLoan(uint _amount, uint _months, uint _interest, string memory _planId, address _user) public isUser()
    {
        Loan memory l = Loan(loans.length + 1, _amount, _months, _interest, _planId, LoanState.REQUESTED, msg.sender);
        
        loans.push(l);
        
        emit loanRequest(l.loanId, l.amount, l.months, l.interest, l.planId,
            l.state, l.user);
    }
    
    function signByUser(uint _loanId) public isLoanUser(_loanId) isValidLoan(_loanId) isLoanIn(_loanId, LoanState.REQUESTED)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].loanId == _loanId) {
                loans[i].state = LoanState.USER_SIGNED;
                break;
            }
        }
    }
    
    function approveLoan(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.USER_SIGNED)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].loanId == _loanId) {
                loans[i].state = LoanState.BANK_APPROVED;
                break;
            }
        }
    }
    
    function rejectLoan(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.USER_SIGNED)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].loanId == _loanId) {
                loans[i].state = LoanState.BANK_REJECTED;
                break;
            }
        }
    }
    
    function confirmTokenTrasferToUser(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.PAID_TO_BANK)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].loanId == _loanId) {
                loans[i].state = LoanState.PAID_TO_BANK;
                break;
            }
        }
    }
    
    
    function confirmTokenTrasferToBorrower(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.PAID_TO_BANK)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].loanId == _loanId) {
                loans[i].state = LoanState.ONGOING;
                break;
            }
        }
    }
    
    function closeLoan(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.ONGOING)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].loanId == _loanId) {
                loans[i].state = LoanState.CLOSE;
                break;
            }
        }
    }
    
    function markAsDefaulted(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.ONGOING)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].loanId== _loanId) {
                loans[i].state = LoanState.DEFAULT;
                break;
            }
        }
    }
    
    function requestClaim(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.DEFAULT)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].loanId == _loanId) {
                loans[i].state = LoanState.CLAIM_REQUESTED;
                break;
            }
        }
    }
    
    function confirmRecivingOfClaim(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.CLAIM_REQUESTED)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].loanId == _loanId) {
                loans[i].state = LoanState.CLAIMED;
                break;
            }
        }
    }
    
    function viewLoan(uint _loanId) public view returns(Loan memory loan)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].loanId == _loanId) {
                return (loans[i]);
            }
        }
    }
    
    function getLoans() public view returns(Loan [] memory)
    {
        return loans;
    }  
    
    //TODO - View broker's loans
    //TODO - modify applied loans
}