import React from 'react';
import { Card, Form, Input, Button, InputNumber, message } from 'antd';
import { postApi } from '../../util/fetchApi';

function LoanPaymentForm() {
	const submitLoanPayment = async (values) => {
		try {
			const body = {
				loanId: values.loanId,
				amount: values.amount,
				transactionHash: values.transactionHash,
			};

			const requestOptions = {
				body: JSON.stringify(body),
			};

			await postApi({
				url: 'loan-payments',
				options: requestOptions,
			});

			message.success('Loan Payment added successfully');
		} catch (err) {
			console.log(err);
			message.error('Error while adding the Loan Payment');
		}
	};

	return (
		<Card title="Loan Payment Update Form">
			<Form
				labelCol={{ lg: 5, xl: 4, xxl: 3 }}
				wrapperCol={{ lg: 16, xl: 14, xxl: 10 }}
				layout="horizontal"
				size="default"
				labelAlign="left"
				onFinish={submitLoanPayment}
			>
				<Form.Item label="Loan Id" name="loanId" rules={[{ required: true, message: 'Please enter loan id!' }]}>
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
						placeholder="Enter transaction hash"
					/>
				</Form.Item>
				<Form.Item wrapperCol={{
					lg: { span: 14, offset: 5 },
					xl: { span: 14, offset: 4 },
					xxl: { span: 14, offset: 3 } }}
				>
					<Button type="primary" htmlType="submit">Submit Loan Payment</Button>
				</Form.Item>
			</Form>
		</Card>

	);
}

export default LoanPaymentForm;
