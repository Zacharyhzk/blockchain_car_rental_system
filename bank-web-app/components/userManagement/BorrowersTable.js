import React, { useState, useContext, useEffect } from 'react';
import { Table, Card, message } from 'antd';
import { array } from 'prop-types';
import SmartContractContext from '../../stores/smartContractContext';

// React functional component to display borrowers details.
// This will return table of borrowers.
function BorrowersTable() {
	const { UserIdentityContract } = useContext(SmartContractContext); // Get User Identity smart contract instance from smartContractContext.
	const [data, setData] = useState([]); // Borrowers data state.
	const brokers = {}; // Attribute to store broker address and name mapping.

	// Fetch broker details from User Identity smart contract.
	const getBrokers = async () => {
		const response = await UserIdentityContract.methods.getAllBrokers().call();
		// Update the broker address -> name mapping using response
		for (let i = 0; i < response.length; i++) {
			brokers[response[i].walletAddress] = response[i].name;
		}
	};

	// Fetch all borrowers details from User Identity smart contract.
	const getBorrowers = async () => {
		try {
			const response = await UserIdentityContract.methods.getAllBorrowers().call();

			setData([]);

			// Create objects from response and update the data array.
			for (let i = 0; i < response.length; i++) {
				const row = {
					key: response[i].id,
					id: response[i].id,
					socialId: response[i].socialSecurityId,
					address: response[i].walletAddress,
					name: response[i].name,
				};

				setData((prev) => {
					return [...prev, row];
				});
			}
		} catch (err) {
			console.log(err);
			message.error('Error occured while loading brokers');
		}
	};

	// Defines the table columns
	// title - name of the column.
	// dataIndex - property name of the object to be display in the column.
	// key - unique key of the column
	// render - The way data should diplay in the column.
	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			render: text => text,
		},
		{
			title: 'Social Id',
			dataIndex: 'socialId',
			key: 'socialId',
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Wallet Address',
			dataIndex: 'address',
			key: 'address',
		},
	];

	useEffect(() => {
		getBrokers();
		getBorrowers();
	}, []); // useEffect will execute it renders the Borrower table component in to the DOM.

	return (
		<Card title="Borrowers">
			<Table pagination="true" columns={columns} dataSource={data} />
		</Card>
	);
}

export default BorrowersTable;
