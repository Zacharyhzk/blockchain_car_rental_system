import React, { useEffect, useState, useContext } from 'react';
import { Card, Table, message } from 'antd';
import SmartContractContext from '../../stores/smartContractContext';

function TokenInfo() {
	const [totalSupply, setTotalSupply] = useState('0.00');
	const [decimals, setDecimals] = useState('0.00');
	const { MicroTokenContract } = useContext(SmartContractContext);

	const getTotalSupply = async () => {
		try {
			const response = await MicroTokenContract.methods.totalSupply().call();
			setTotalSupply(response);
		} catch (err) {
			message.error('Error occured while reading totalSupply');
		}
	};

	const getDecimals = async () => {
		try {
			const response = await MicroTokenContract.methods.decimals().call();
			setDecimals(response);
		} catch (err) {
			message.error('Error occured while reading decimals');
		}
	};

	useEffect(() => {
		getTotalSupply();
		getDecimals();
	}, []);

	const columns = [
		{ title: 'Attribute', dataIndex: 'attribute', key: 'attribute', width: '20%' },
		{ title: 'Description', dataIndex: 'description', key: 'description' },
	];

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
		<Card title="Micro Tokens informations">
			<Table columns={columns} dataSource={data} pagination={false} size="small" columnWidth="30%" />
		</Card>
	);
}

export default TokenInfo;
