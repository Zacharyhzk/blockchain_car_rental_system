// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./UserIdentity.sol";

contract InsurancePolicy{
    
    enum InsuranceState{
        REQUESTED, 
        BORROWER_SIGNED,
        APPROVED, 
        REJECTED, 
        ONGOING, 
        CLAIM_REQUESTED,
        CLAIM_APPROVED,
        CLAIM_REJECTED,
        CLAIMED, 
        CLOSE 
    }
    
    struct Policy
    {
        uint id;
        uint amount;
        uint months;
        uint payment;
        string planId;
        uint loanId;
        InsuranceState state;
        address broker;
        address borrower;
        bool insuranceApprove;
        bool isBorrowerSigned;
    }
    
    event insurancePolicyRequest(
        uint id,
        uint amount,
        uint months,
        uint payment,
        string planId,
        uint loanId,
        InsuranceState state,
        address broker,
        address borrower,
        bool insuranceApprove,
        bool isBorrowerSigned
    );
    
    address private admin;
    UserIdentity identitySC;
    Policy[] private policies;
    
    constructor (address _identitySC) {
            admin = msg.sender;
            identitySC = UserIdentity(_identitySC);
    }
    
    modifier isAdmin()
    {
        require(msg.sender == admin);
        _;
    }
    
    modifier isBorrower(address _address)
    {
        require(identitySC.verifyIsBorrower(_address), 'Borrower Only');
        _;
    }

    modifier isBroker(address _address)
    {
        require(identitySC.verifyIsBroker(_address), 'Broker Only');
        _;
    }
    
    modifier isBank(address _address)
    {
        require(identitySC.verifyIsBank(_address), 'Bank Only');
        _;
    }

    modifier isValidInsurance(uint _insuranceId)
    {
        bool isValid = false;
        for(uint i=0; i< policies.length; i++)
        {
            if(policies[i].id == _insuranceId)
            {
                isValid = true;
                break;
            }
        }
        require(isValid);
        _;
    }

    modifier isInsuranceIn(uint _policyId, InsuranceState _state)
    {
        bool isValid = false;
        for(uint i=0; i< policies.length; i++)
        {
            if(policies[i].id == _policyId && policies[i].state == _state)
            {
                isValid = true;
                break;
            }
        }
        require(isValid);
        _;
    }

    modifier checkBorrower(uint _policyId, address _borrower){
        bool isValid = false;
        for(uint i=0; i< policies.length; i++)
        {
            if(policies[i].id == _policyId && policies[i].borrower == _borrower)
            {
                isValid = true;
                break;
            }
        }
        require(isValid);
        _;
    }
    
    function applyInsurance(uint _amount, uint _months, uint _payment, string memory _planId, uint _loanId, address _borrower)
        public isBroker(msg.sender) isBorrower(_borrower)
    {
        Policy memory policy = Policy(policies.length + 1, _amount, _months, _payment, _planId, _loanId,
        InsuranceState.REQUESTED, msg.sender, _borrower, false, false);
        policies.push(policy);
        
        emit insurancePolicyRequest( policy.id, policy.amount, policy.months,  policy.payment, policy.planId,
            policy.loanId, policy.state, policy.broker, policy.borrower, policy.insuranceApprove,
            policy.isBorrowerSigned
        );
    }
    
    function signInsurancePolicy(uint _policyId) 
        public checkBorrower(_policyId, msg.sender) isValidInsurance(_policyId) isInsuranceIn(_policyId, InsuranceState.REQUESTED)
    {
        for (uint i = 0; i < policies.length; i++) {
            if (policies[i].id == _policyId) {
                policies[i].isBorrowerSigned = true; 
                policies[i].state = InsuranceState.BORROWER_SIGNED;
                break;
            }
        }
    }
    
    function approveInsurancePolicy(uint _policyId) 
        public isAdmin() isValidInsurance(_policyId) isInsuranceIn(_policyId, InsuranceState.BORROWER_SIGNED)
    {
        for (uint i = 0; i < policies.length; i++) {
            if (policies[i].id == _policyId) {
                policies[i].insuranceApprove = true;
                policies[i].state = InsuranceState.APPROVED;
                break;
            }
        }
    }
    
    function rejectInsurancePolicy(uint _policyId) 
        public isAdmin() isValidInsurance(_policyId) isInsuranceIn(_policyId, InsuranceState.BORROWER_SIGNED)
    {
        for (uint i = 0; i < policies.length; i++) {
            if (policies[i].id == _policyId) {
                policies[i].insuranceApprove = false;
                policies[i].state = InsuranceState.REJECTED;
                break;
            }
        }
    }
    
    function confirmPaymentFromBank(uint _policyId) 
        public isAdmin() isValidInsurance(_policyId) isInsuranceIn(_policyId, InsuranceState.APPROVED)
    {
        for (uint i = 0; i < policies.length; i++) {
            if (policies[i].id == _policyId) {
                policies[i].state = InsuranceState.ONGOING;
                break;
            }
        }
    }
    
    function closePolicy(uint _policyId) 
        public isAdmin() isValidInsurance(_policyId) isInsuranceIn(_policyId, InsuranceState.ONGOING)
    {
        for (uint i = 0; i < policies.length; i++) {
            if (policies[i].id == _policyId) {
                policies[i].state = InsuranceState.CLOSE;
                break;
            }
        }
    }
    
    function requestClaim(uint _policyId) 
        public isBank(msg.sender) isValidInsurance(_policyId) isInsuranceIn(_policyId, InsuranceState.ONGOING)
    {
        for (uint i = 0; i < policies.length; i++) {
            if (policies[i].id == _policyId) {
                policies[i].state = InsuranceState.CLAIM_REQUESTED;
                break;
            }
        }
    }
    
    function rejectClaim(uint _policyId) 
        public isAdmin() isValidInsurance(_policyId) isInsuranceIn(_policyId, InsuranceState.CLAIM_REQUESTED)
    {
        for (uint i = 0; i < policies.length; i++) {
            if (policies[i].id == _policyId) {
                policies[i].state = InsuranceState.CLAIM_REJECTED;
                break;
            }
        }
    }
    
    function approveClaim(uint _policyId) 
        public isAdmin() isValidInsurance(_policyId) isInsuranceIn(_policyId, InsuranceState.CLAIM_REQUESTED)
    {
        for (uint i = 0; i < policies.length; i++) {
            if (policies[i].id == _policyId) {
                policies[i].state = InsuranceState.CLAIM_APPROVED;
                break;
            }
        }
    }
    
    function confirmClaim(uint _policyId) 
        public isAdmin() isValidInsurance(_policyId) isInsuranceIn(_policyId, InsuranceState.CLAIM_APPROVED)
    {
        for (uint i = 0; i < policies.length; i++) {
            if (policies[i].id == _policyId) {
                policies[i].state = InsuranceState.CLAIMED;
                break;
            }
        }
    }
    
    function viewInsurancePolicy(uint _policyId) public view isValidInsurance(_policyId) 
    returns(Policy memory policy)
    {
        for (uint i = 0; i < policies.length; i++) {
            if (policies[i].id == _policyId) {
                return policies[i];
            }
        }
    }
    
    function getAllPolicies() public view returns(Policy [] memory)
    {
        return policies;
    } 
    
    //TODO - View broker's loans
    //TODO - modify applied loans
}