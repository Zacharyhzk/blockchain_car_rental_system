import React from 'react';
import { Card, Form, Input, Button, InputNumber, message } from 'antd';
import { postApi } from '../../util/fetchApi';

function PolicyPaymentForm() {
	const submitPolicyPayment = async (values) => {
		try {
			const body = {
				policyId: values.policyId,
				amount: values.amount,
				transactionHash: values.transactionHash,
			};

			const requestOptions = {
				method: 'POST',
				body: JSON.stringify(body),
			};

			const response = await postApi({
				url: 'policy-payments',
				options: requestOptions,
			});

			const result = await response;
			await console.log(result);

			message.success('Insurance Policy Payment added successfully');
		} catch (err) {
			message.error('Error while adding the Insurance Policy Payment');
			console.log(err);
		}
	};

	return (
		<Card title="Update Insurance Policy Payment">
			<Form
				labelCol={{
					lg: 5,
					xl: 4,
					xxl: 3,
				}}
				wrapperCol={{
					lg: 16,
					xl: 14,
					xxl: 10,
				}}
				layout="horizontal"
				size="default"
				labelAlign="left"
				onFinish={submitPolicyPayment}
			>
				<Form.Item label="Insurance Policy Id" name="policyId" rules={[{ required: true, message: 'Please enter insurance policy id!' }]}>
					<InputNumber
						min="1"
						style={{ width: '100%' }}
						placeholder="Enter loan id"
					/>
				</Form.Item>
				<Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Please enter amount!' }]}>
					<InputNumber
						min="0"
						style={{ width: '100%' }}
						placeholder="Enter amount"
					/>
				</Form.Item>
				<Form.Item label="Transaction hash" name="transactionHash" rules={[{ required: true, message: 'Please enter transaction hash!' }]}>
					<Input
						style={{ width: '100%' }}
						placeholder="Enter transaction has"
					/>
				</Form.Item>
				<Form.Item wrapperCol={{
					lg: { span: 14, offset: 5 },
					xl: { span: 14, offset: 4 },
					xxl: { span: 14, offset: 3 } }}
				>
					<Button type="primary" htmlType="submit">Submit Insurance Policy Payment</Button>
				</Form.Item>
			</Form>
		</Card>

	);
}

export default PolicyPaymentForm;
