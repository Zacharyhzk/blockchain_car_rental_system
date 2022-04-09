import React from 'react';
import { Form, Input, Button, InputNumber } from 'antd';

function TransferForm({ setAddress, setAmount }) {
	const onFinish = async (values) => {
		setAddress(values.address);
		setAmount(values.amount);
		console.log(values);
	};

	return (
		<Form
			labelCol={{ lg: 3, xl: 2, xxl: 2 }}
			wrapperCol={{ lg: 14, xl: 12, xxl: 10 }}
			layout="horizontal"
			size="default"
			labelAlign="left"
			onFinish={onFinish}
		>
			<Form.Item label="Receiver" name="address" rules={[{ required: true, message: 'Please input receiver address!' }]}>
				<Input
					placeholder="Enter receiver's wallet address"
				/>
			</Form.Item>
			<Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Please input token amount!' }]}>
				<InputNumber
					min="0"
					style={{ width: '100%' }}
					placeholder="Enter amount"
				/>
			</Form.Item>
			<Form.Item wrapperCol={{
				lg: { span: 14, offset: 3 },
				xl: { span: 14, offset: 2 },
				xxl: { span: 14, offset: 2 } }}
			>
				<Button type="primary" htmlType="submit">Transfer Tokens</Button>
			</Form.Item>
		</Form>

	);
}

export default TransferForm;
