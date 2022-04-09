import React from 'react';
import { Form, Button, Space } from 'antd';

function TransactionConfirm({ address, amount, confirmTokenTransfer, prev }) {
	return (
		<Form
			labelCol={{
				lg: 3,
				xl: 2,
				xxl: 2,
			}}
			wrapperCol={{
				lg: 14,
				xl: 12,
				xxl: 10,
			}}
			layout="horizontal"
			size="default"
			labelAlign="left"
		>
			<Form.Item label="Receiver">
				<span> { address } </span>
			</Form.Item>
			<Form.Item label="Amount">
				<span> { amount } </span>
			</Form.Item>
			<Form.Item wrapperCol={{
				lg: { span: 14, offset: 3 },
				xl: { span: 14, offset: 2 },
				xxl: { span: 14, offset: 2 } }}
			>
				<Space direction="horizontal">
					<Button type="primary" onClick={(e) => confirmTokenTransfer(e)}>Confirm transfer</Button>
					<Button onClick={(e) => prev(e)}>Back</Button>
				</Space>
			</Form.Item>
		</Form>

	);
}

export default TransactionConfirm;
