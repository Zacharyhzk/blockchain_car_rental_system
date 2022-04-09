// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./UserIdentity.sol";

contract BankLoan{
    
    enum LoanState{
        REQUESTED, 
        INSURANCE_APPLIED, 
        INSURANCE_APPROVED, 
        BORROWER_SIGNED, 
        INSURANCE_REJECTED,
        BANK_APPROVED, 
        BANK_REJECTED,  
        PAID_TO_INSURANCE, 
        PAID_TO_BROKER,
        ONGOING, 
        DEFAULT, 
        CLOSE,
        CLAIM_REQUESTED, 
        CLAIMED
    }
    
    struct Loan
    {
        uint id;
        uint amount;
        uint months;
        uint interest;
        string planId;
        LoanState state;
        address broker;
        address borrower;
        uint brokerFee;
        uint insuranceFee;
        address insurance;
        uint insurancePolicyId;
    }
    
    event loanRequest(
        uint id,
        uint amount,
        uint months,
        uint interest,
        string planId,
        LoanState state,
        address broker,
        address borrower,
        uint brokerFee,
        uint insuranceFee,
        address insurance,
        uint insurancePolicyId
    );
    
    address private admin;
    UserIdentity identitySC;
    Loan[] private loans;
    
    constructor (address _identitySC) {
            admin = msg.sender;
            identitySC = UserIdentity(_identitySC);
    }
    
    modifier isAdmin()
    {
        require(msg.sender == admin);
        _;
    }
    
    modifier isBroker()
    {
        require(identitySC.verifyIsBroker(msg.sender), 'Broker Only');
        _;
    }

    modifier isInsurance(address _address)
    {
        require(identitySC.verifyIsInsurer(_address), 'Invalid Insurance Company');
        _;
    }

    modifier isLoanBroker(uint _loanId){
        bool isValid = false;
        for(uint i=0; i< loans.length; i++)
        {
            if(loans[i].id == _loanId && loans[i].broker == msg.sender)
            {
                isValid = true;
                break;
            }
        }
        require(isValid);
        _;
    }

    modifier isLoanBorrower(uint _loanId){
        bool isValid = false;
        for(uint i=0; i< loans.length; i++)
        {
            if(loans[i].id == _loanId && loans[i].borrower == msg.sender)
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
            if(loans[i].id == _loanId)
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
            if(loans[i].id == _loanId && loans[i].state == _state)
            {
                isValid = true;
                break;
            }
        }
        require(isValid);
        _;
    }

    function applyLoan(uint _amount, uint _months, uint _interest, string memory _planId, 
        address _borrower, uint _brokerFee) public isBroker()
    {
        Loan memory l = Loan(loans.length + 1, _amount, _months, _interest, _planId, LoanState.REQUESTED, msg.sender,
        _borrower, _brokerFee, 0, 0x0000000000000000000000000000000000000000, 0);
        
        loans.push(l);
        
        emit loanRequest(l.id, l.amount, l.months, l.interest, l.planId,
            l.state, l.broker, l.borrower, l.brokerFee, l.insuranceFee, l.insurance, l.insurancePolicyId );
    }
    
    function addInsurance(uint _loanId, address _insurance, uint _insuranceFee, uint _insurancePolicyId) public 
        isLoanBroker(_loanId) 
        isValidLoan(_loanId)
        isLoanIn(_loanId, LoanState.REQUESTED) 
        isInsurance(_insurance)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId) {
                loans[i].insurance = _insurance;
                loans[i].insuranceFee = _insuranceFee;
                loans[i].insurancePolicyId = _insurancePolicyId;
                loans[i].state = LoanState.INSURANCE_APPLIED;
                break;
            }
        }
    }

    function insuranceApproved(uint _loanId) public isLoanBroker(_loanId) isValidLoan(_loanId)
        isLoanIn(_loanId, LoanState.INSURANCE_APPLIED)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId) {
                loans[i].state = LoanState.INSURANCE_APPROVED;
                break;
            }
        }
    }
    
    function insuranceRejected(uint _loanId) public isLoanBroker(_loanId) isValidLoan(_loanId) 
        isLoanIn(_loanId, LoanState.INSURANCE_APPLIED)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId && loans[i].state == LoanState.INSURANCE_APPLIED) {
                loans[i].state = LoanState.INSURANCE_REJECTED;
                break;
            }
        }
    }
    
    function signByBorrower(uint _loanId) public isLoanBorrower(_loanId) isValidLoan(_loanId) isLoanIn(_loanId, LoanState.INSURANCE_APPROVED)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId) {
                loans[i].state = LoanState.BORROWER_SIGNED;
                break;
            }
        }
    }
    
    
    function approveLoan(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.BORROWER_SIGNED)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId) {
                loans[i].state = LoanState.BANK_APPROVED;
                break;
            }
        }
    }
    
    function rejectLoan(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.BORROWER_SIGNED)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId) {
                loans[i].state = LoanState.BANK_REJECTED;
                break;
            }
        }
    }
    
    function confirmTokenTrasferToInsurance(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.BANK_APPROVED)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId) {
                loans[i].state = LoanState.PAID_TO_INSURANCE;
                break;
            }
        }
    }
    
    function confirmTokenTrasferToBroker(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.PAID_TO_INSURANCE)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId) {
                loans[i].state = LoanState.PAID_TO_BROKER;
                break;
            }
        }
    }
    
    
    function confirmTokenTrasferToBorrower(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.PAID_TO_BROKER)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId) {
                loans[i].state = LoanState.ONGOING;
                break;
            }
        }
    }
    
    function closeLoan(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.ONGOING)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId) {
                loans[i].state = LoanState.CLOSE;
                break;
            }
        }
    }
    
    function markAsDefaulted(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.ONGOING)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId) {
                loans[i].state = LoanState.DEFAULT;
                break;
            }
        }
    }
    
    function requestClaim(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.DEFAULT)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId) {
                loans[i].state = LoanState.CLAIM_REQUESTED;
                break;
            }
        }
    }
    
    function confirmRecivingOfClaim(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.CLAIM_REQUESTED)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId) {
                loans[i].state = LoanState.CLAIMED;
                break;
            }
        }
    }
    
    function viewLoan(uint _loanId) public view returns(Loan memory loan)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId) {
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