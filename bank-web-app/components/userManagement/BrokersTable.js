import React, { useState, useContext, useEffect } from 'react';
import { Table, Tag, Card, Space, Button, message } from 'antd';
import SmartContractContext from '../../stores/smartContractContext';
import UserContext from '../../stores/userContext';

function BrokersTable() {
	const { user } = useContext(UserContext);
	const { UserIdentityContract } = useContext(SmartContractContext);
	const [data, setData] = useState([]);

	const getBrokers = async () => {
		try {
			const response = await UserIdentityContract.methods.getAllBrokers().call();

			setData([]);

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

	const approveBroker = async (address) => {
		try {
			const accounts = await window.ethereum.enable();
			await UserIdentityContract.methods.approveBroker(address).send({ from: accounts[0] });
			message.success('Broker approved successfully!');
			getBrokers();
		} catch (err) {
			message.error('Error approving Broker');
		}
	};

	const rejectBroker = async (address) => {
		try {
			const accounts = await window.ethereum.enable();
			await UserIdentityContract.methods.rejectBroker(address).send({ from: accounts[0] });
			message.success('Broker request rejected');
			getBrokers();
		} catch (err) {
			message.error('Error occured while rejecting Broker');
		}
	};

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
		{
			title: 'Status',
			key: 'status',
			dataIndex: 'status',
			render: tag => {
				/* PENDING, APPROVED, REJECTED */
				let color = '';
				let state = '';
				if (tag === '0') {
					color = 'geekblue';
					state = 'PENDING';
				} else if (tag === '1') {
					color = 'green';
					state = 'APPROVED';
				} else {
					color = 'red';
					state = 'REJECTED';
				}
				return (
					<Tag color={color} key={tag}>
						{state}
					</Tag>
				);
			},
		},
	];

	if (user.role === 'bank') {
		columns.push({
			title: 'Action',
			dataIndex: '',
			key: 'x',
			render: (record) => (
				record.status === '0' ?
					<Space>
						<Button type="primary" ghost onClick={() => approveBroker(record.address)}>Approve</Button>
						<Button type="primary" danger ghost style={{ color: 'red' }} onClick={() => rejectBroker(record.address)}>Reject</Button>
					</Space> : null
			),
		});
	}

	useEffect(() => {
		getBrokers();
		// TODO: add event listner for newUserAdded event.
	}, []);

	return (
		<Card title="Brokers">
			<Table pagination="True" columns={columns} dataSource={data} />
		</Card>
	);
}

export default BrokersTable;
