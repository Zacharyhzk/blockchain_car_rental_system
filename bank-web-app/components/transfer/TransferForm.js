import React from 'react';
import { Form, Input, Button, InputNumber } from 'antd';

// TransferForm functional component. setAddress and setAmount are pass as props from TransactionController Component.
function TransferForm({ setAddress, setAmount }) {
	// This method will call when submit the form
	// Values parameter contains the submitted field values from form.
	// Each field values can be captured using form item name.
	const onFinish = async (values) => {
		setAddress(values.address); // Update the address state by address field value
		setAmount(values.amount); // Update the amount state by amount field value.
	};

	return (
		<Form
			labelCol={{ lg: 3, xl: 2, xxl: 2 }}
			wrapperCol={{ lg: 14, xl: 12, xxl: 10 }}
			layout="horizontal"
			size="default"
			labelAlign="left"
			onFinish={onFinish} // onFinish method will executed when user submit the form.
		>
			{/* Name property value(address) will use to capture the Input field value when submit the form */}
			<Form.Item label="Receiver" name="address" rules={[{ required: true, message: 'Please input receiver address!' }]}>
				<Input
					placeholder="Enter receiver address"
				/>
			</Form.Item>
			{/* Name property value(amount) will use to capture the Input field value when submit the form */}
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
				{/* Form submit button */}
				<Button type="primary" htmlType="submit">Transfer Tokens</Button>
			</Form.Item>
		</Form>

	);
}

export default TransferForm;
