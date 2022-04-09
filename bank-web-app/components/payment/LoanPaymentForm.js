import React from 'react';
import { Card, Form, Input, Button, InputNumber, message } from 'antd';
import { postApi } from '../../util/fetchApi';

// Loan Payment Form component to submit loan payment details.
function LoanPaymentForm() {
	// Submit loan payment function
	// This function will submit loan payment details to the bank web server.
	// values parameter contains the field values submitted from form.
	const submitLoanPayment = async (values) => {
		try {
			// Build the jsomn object for submit loan payment details.
			// This json object send through the http request body.
			// Field values captured by their names.
			const body = {
				loanId: values.loanId,
				amount: values.amount,
				transactionHash: values.transactionHash,
			};

			// Call the loan-payments post method to save the Loan payment information.
			await postApi({
				url: 'loan-payments', // URL for the api call. This will call "<Bank Server URL>/loan-payments" api.
				params: body,
			});

			message.success('Loan Payment added successfully');
		} catch (err) {
			message.error('Error while adding the Loan Payment');
			console.log(err);
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
				onFinish={submitLoanPayment} // submitLoanPayment function will execute when use submit the form.
			>
				{/* Form field value will capture using name property */}
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
