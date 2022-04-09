import React, { useEffect, useState, useContext } from 'react';
import { Card, Table, message } from 'antd';
import SmartContractContext from '../../stores/smartContractContext';

// This component displays the Micro Token information
function TokenInfo() {
	const [totalSupply, setTotalSupply] = useState('0'); // Contains the totalSupply value from the Micro Token Contract.
	const [decimals, setDecimals] = useState('0'); // Contains the decimas value from the Micro Token Contract.
	const { MicroTokenContract } = useContext(SmartContractContext); // // Get the Micro Token Contract instance defined in the 'stores/smartContractContext.js'

	// Fetches totalSupply information from Micro Token contract.
	const getTotalSupply = async () => {
		try {
			// Calls totalSupply method of the Micro Token contract.
			// Since totalSupply is a public attribute no need to define the totalSupply method explicitly.
			const response = await MicroTokenContract.methods.totalSupply().call();
			setTotalSupply(response); // Updates the totalSupply state with response.
		} catch (err) {
			console.log(err);
			message.error('Error occured while reading totalSupply');
		}
	};

	// Fetch decimal information from the Micro Token Contract.
	const getDecimals = async () => {
		try {
			// Calls decimals method of the Micro Token contract.
			// Since decimals is a public attribute no need to define the decimals method explicitly.
			const response = await MicroTokenContract.methods.decimals().call();
			setDecimals(response); // Updates the decimals state with response.
		} catch (err) {
			console.log(err);
			message.error('Error occured while reading decimals');
		}
	};

	useEffect(() => {
		getTotalSupply();
		getDecimals();
	}, []); // useEffect will execute only when page loads.

	// Defined the information table columns.
	const columns = [
		{ title: 'Attribute', dataIndex: 'attribute', key: 'attribute', width: '20%' },
		{ title: 'Description', dataIndex: 'description', key: 'description' },
	];

	// Defines the information table data.
	const data = [
		{
			attribute: 'Contract address',
			description: MicroTokenContract._address,
		},
		{
			attribute: 'Total supply',
			description: totalSupply,
		},
		{
			attribute: 'Decimals',
			description: decimals,
		},
	];

	return (
		// Displays the information in a table
		<Card title="Microfinance Tokens informations">
			<Table columns={columns} dataSource={data} pagination={false} size="small" columnWidth="30%" />
		</Card>
	);
}

export default TokenInfo;
