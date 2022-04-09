import React, { useState, useContext, useEffect } from 'react';
import { Table, Tag, Card, message, Button, Space } from 'antd';
import SmartContractContext from '../../stores/smartContractContext';
import UserContext from '../../stores/userContext';

function InsuranceCompanyTable() {
	const { UserIdentityContract } = useContext(SmartContractContext);
	const { user } = useContext(UserContext);
	const [data, setData] = useState([]);

	const getInsuranceCompanies = async () => {
		try {
			const response = await UserIdentityContract.methods.getAllInsurers().call();

			setData([]);

			for (let i = 0; i < response.length; i++) {
				const row = {
					key: response[i].id,
					id: response[i].id,
					regNumber: response[i].registrationNumber,
					address: response[i].walletAddress,
					name: response[i].name,
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

	const approveInsuranceCompany = async (address) => {
		try {
			const accounts = await window.ethereum.enable();
			await UserIdentityContract.methods.approveInsuranceCompany(address).send({ from: accounts[0] });
			message.success('Insurance Company approved successfully!');
			getInsuranceCompanies();
		} catch (err) {
			message.error('Error approving Insurance Company');
		}
	};

	const rejectInsuranceCompany = async (address) => {
		try {
			const accounts = await window.ethereum.enable();
			await UserIdentityContract.methods.rejectInsuranceCompany(address).send({ from: accounts[0] });
			message.success(`Insurance Company ${address} rejected`);
			getInsuranceCompanies();
		} catch (err) {
			message.error('Error occured while rejecting Insurance Company');
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
			title: 'Registration Number',
			dataIndex: 'regNumber',
			key: 'regNumber',
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
						<Button type="primary" ghost onClick={() => approveInsuranceCompany(record.address)}>Approve</Button>
						<Button type="primary" danger ghost style={{ color: 'red' }} onClick={() => rejectInsuranceCompany(record.address)}>Reject</Button>
					</Space> : null
			),
		});
	}

	useEffect(() => {
		getInsuranceCompanies();
		// TODO: add event listner for newUserAdded event.
	}, []);

	return (
		<Card title="Insurance Companies">
			<Table pagination="True" columns={columns} dataSource={data} />
		</Card>
	);
}

export default InsuranceCompanyTable;
