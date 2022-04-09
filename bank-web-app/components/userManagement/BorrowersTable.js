import React, { useState, useContext, useEffect } from 'react';
import { Table, Tag, Card, message, Space, Button } from 'antd';
import SmartContractContext from '../../stores/smartContractContext';
import UserContext from '../../stores/userContext';

function BorrowersTable() {
	const { UserIdentityContract } = useContext(SmartContractContext);
	const { user } = useContext(UserContext);
	const [data, setData] = useState([]);
	const brokers = {};

	const getBrokers = async () => {
		const response = await UserIdentityContract.methods.getAllBrokers().call();
		for (let i = 0; i < response.length; i++) {
			brokers[response[i].walletAddress] = response[i].name;
		}
	};

	const getBorrowers = async () => {
		try {
			const response = await UserIdentityContract.methods.getAllBorrowers().call();

			setData([]);

			for (let i = 0; i < response.length; i++) {
				const row = {
					key: response[i].id,
					id: response[i].id,
					socialId: response[i].socialSecurityId,
					address: response[i].walletAddress,
					name: response[i].name,
					addedBy: brokers[response[i].addedBy],
					status: response[i].state,
				};

				setData((prev) => {
					return [...prev, row];
				});
			}
		} catch (err) {
			message.error('Error occured while loading brokers');
		}
	};

	const loadData = async () => {
		await getBrokers();
		await getBorrowers();
	};

	const approveBorrower = async (borrowerAddress) => {
		try {
			const accounts = await window.ethereum.enable();
			await UserIdentityContract.methods.approveBorrower(borrowerAddress).send({ from: accounts[0] });
			message.success('Borrower approved successfully!');
			loadData();
		} catch (err) {
			message.error('Error occured while approving Borrower');
			console.log(err);
		}
	};

	const rejectBorrower = async (borrowerAddress) => {
		try {
			const accounts = await window.ethereum.enable();
			await UserIdentityContract.methods.rejectBorrower(borrowerAddress).send({ from: accounts[0] });
			message.success('Borrower request rejected');
			loadData();
		} catch (err) {
			message.error('Error occured while rejecting Borrower');
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
			title: 'Added by',
			dataIndex: 'addedBy',
			key: 'addedBy',
		},
		{
			title: 'Status',
			key: 'status',
			dataIndex: 'status',
			render: tag => {
				const s = ['PENDING', 'APPROVED', 'REJECTED'];
				const c = ['geekblue', 'green', 'red'];
				return (
					<Tag color={c[tag]} key={tag}>
						{s[tag]}
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
						<Button type="primary" ghost onClick={() => approveBorrower(record.address)}>Approve</Button>
						<Button type="primary" danger ghost onClick={() => rejectBorrower(record.address)}>Reject</Button>
					</Space> : null
			),
		});
	}

	useEffect(() => {
		loadData();
	}, []);

	return (
		<Card title="Borrowers">
			<Table pagination="True" columns={columns} dataSource={data} />
		</Card>
	);
}

export default BorrowersTable;
