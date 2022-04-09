import React, { useState, useContext, useEffect } from 'react';
import { Table, Card, message } from 'antd';
import SmartContractContext from '../../stores/smartContractContext';

// React functional component to display brokers details.
// This will return table of brokers.
function BrokersTable() {
	const { UserIdentityContract } = useContext(SmartContractContext); // Get the User Identity contract instance from smartContractContext.

	const [data, setData] = useState([]); // data state to store brokers' data.

	// Fetch brokers details from the User Identity smart contract.
	const getBrokers = async () => {
		try {
			const response = await UserIdentityContract.methods.getAllBrokers().call();

			setData([]);

			// Update data array using brokers data returned from User Identity smart contract.
			for (let i = 0; i < response.length; i++) {
				const row = {
					key: response[i].id,
					id: response[i].id,
					socialId: response[i].socialSecurityId,
					address: response[i].walletAddress,
					name: response[i].name,
					status: response[i].state,
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

	// Define brokers table columns.
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
			title: 'Address',
			dataIndex: 'address',
			key: 'address',
		},
	];

	useEffect(() => {
		getBrokers();
	}, []); // useEffect will execute only when component render in to the DOM.

	return (
		<Card title="Brokers">
			<Table pagination="true" columns={columns} dataSource={data} />
		</Card>
	);
}

export default BrokersTable;
