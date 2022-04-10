import React, { createContext } from 'react';
import Web3 from 'web3';
import CarRentalBuild from '../build/contracts/CarRental.json';
// import BankLoanBuild from '../../blockchain/build/contracts/BankLoan.json';
// import UserIdentityBuild from '../../blockchain/build/contracts/UserIdentity.json';

// Create context and set default values.
const SmartContractContext = createContext({});

export const SmartContractContextProvider = ({ children }) => {
	const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');

	// Smart Contract Addresses
	// const microTokenAddress = MicroTokenBuild.networks[5777].address;
	// const userIdentityAddress = UserIdentityBuild.networks[5777].address;
	// const bankLoanAddress = BankLoanBuild.networks[5777].address;
	const carRentalAddress = CarRentalBuild.networks[5777].address;
	

	// Smart Contracts
	// const UserIdentityContract = new web3.eth.Contract(UserIdentityBuild.abi, userIdentityAddress);
	// const MicroTokenContract = new web3.eth.Contract(MicroTokenBuild.abi, microTokenAddress);
	// const BankLoanContract = new web3.eth.Contract(BankLoanBuild.abi, bankLoanAddress);
	const CarRentalContract = new web3.eth.Contract(CarRentalBuild.abi, carRentalAddress);
	


	const context = { web3, CarRentalContract };
	return (
		
		<SmartContractContext.Provider value={context}>
			{children}
		</SmartContractContext.Provider>
	);
};

export default SmartContractContext;
