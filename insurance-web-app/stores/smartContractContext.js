import React, { createContext } from 'react';
import Web3 from 'web3';
import InsurancePolicyArtifact from '../../blockchain/build/contracts/InsurancePolicy.json';
import MicroTokenArtifact from '../../blockchain/build/contracts/MicroToken.json';
import UserIdentityArtifact from '../../blockchain/build/contracts/UserIdentity.json';

const SmartContractContext = createContext({});

export const SmartContractContextProvider = ({ children }) => {
	const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');

	// Smart Contract Addresses
	const insurancePolicyAddress = InsurancePolicyArtifact.networks[5777].address;
	const microTokenAddress = MicroTokenArtifact.networks[5777].address;
	const userIdentityAddress = UserIdentityArtifact.networks[5777].address;

	// Smart Contracts
	const UserIdentityContract = new web3.eth.Contract(UserIdentityArtifact.abi, userIdentityAddress);
	const MicroTokenContract = new web3.eth.Contract(MicroTokenArtifact.abi, microTokenAddress);
	const InsurancePolicyContract = new web3.eth.Contract(InsurancePolicyArtifact.abi, insurancePolicyAddress);

	const context = { InsurancePolicyContract, MicroTokenContract, UserIdentityContract };

	return (
		<SmartContractContext.Provider value={context}>
			{children}
		</SmartContractContext.Provider>
	);
};

export default SmartContractContext;
