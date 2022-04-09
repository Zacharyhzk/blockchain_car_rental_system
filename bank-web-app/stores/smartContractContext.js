import React, { createContext } from 'react';
import Web3 from 'web3';
import MicroTokenArtifact from '../../blockchain/build/contracts/MicroToken.json';
import BankLoanArtifact from '../../blockchain/build/contracts/BankLoan.json';
import UserIdentityArtifact from '../../blockchain/build/contracts/UserIdentity.json';

// Create context and set default values.
const SmartContractContext = createContext({});

export const SmartContractContextProvider = ({ children }) => {
	const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');

	// Smart Contract Addresses
	const microTokenAddress = MicroTokenArtifact.networks[5777].address;
	const userIdentityAddress = UserIdentityArtifact.networks[5777].address;
	const bankLoanAddress = BankLoanArtifact.networks[5777].address;

	const UserIdentityContract = new web3.eth.Contract(UserIdentityArtifact.abi, userIdentityAddress);
	const MicroTokenContract = new web3.eth.Contract(MicroTokenArtifact.abi, microTokenAddress);
	const BankLoanContract = new web3.eth.Contract(BankLoanArtifact.abi, bankLoanAddress);

	const context = { MicroTokenContract, UserIdentityContract, BankLoanContract };

	return (
		<SmartContractContext.Provider value={context}>
			{children}
		</SmartContractContext.Provider>
	);
};

export default SmartContractContext;
