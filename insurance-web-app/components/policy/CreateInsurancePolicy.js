import React, { useContext } from 'react';
import { Card, Form, InputNumber, Input, Button, message } from 'antd';
import SmartContractContext from '../../stores/smartContractContext';

function CreateInsurancePolicy() {
	const { InsurancePolicyContract } = useContext(SmartContractContext);

	const createInsuranceRequest = async (values) => {
		try {
			const accounts = await window.ethereum.enable();
			await InsurancePolicyContract.methods.applyInsurance(
				values.LoanAmount,
				values.period,
				values.payment,
				values.planId,
				values.loanId,
				values.borrower).send({ from: accounts[0] });
			message.success('New policy request is created successfully');
		} catch (err) {
			console.log(err);
			message.error('Error creating policy request');
		}
	};

	return (
		<Card title="Insurance Policy Request">
			<Form
				labelCol={{
					lg: 4,
					xl: 3,
					xxl: 3,
				}}
				wrapperCol={{
					lg: 14,
					xl: 12,
					xxl: 10,
				}}
				layout="horizontal"
				size="default"
				labelAlign="left"
				onFinish={createInsuranceRequest}
			>
				<Form.Item label="Loan Amount" name="LoanAmount" rules={[{ required: true, message: 'Please input Loan amount!' }]}>
					<InputNumber min="0" style={{ width: '100%' }} placeholder="Enter amount" />
				</Form.Item>
				<Form.Item label="Period" name="period" rules={[{ required: true, message: 'Please enter Loan duration!' }]}>
					<InputNumber min="0" style={{ width: '100%' }} placeholder="Enter loan period" />
				</Form.Item>
				<Form.Item label="Loan ID" name="loanId" rules={[{ required: true, message: 'Please enter Loan ID!' }]}>
					<InputNumber min="0" style={{ width: '100%' }} placeholder="Enter Loan ID" />
				</Form.Item>
				<Form.Item label="Insurance Fee" name="payment" rules={[{ required: true, message: 'Please enter Insurance Payment Fee' }]}>
					<InputNumber min="0" style={{ width: '100%' }} placeholder="Enter Insurance Payment Fee" />
				</Form.Item>
				<Form.Item label="Insurance Plan ID" name="planId" rules={[{ required: true, message: 'Please enter Insurance Plan ID' }]}>
					<Input placeholder="Enter Insurance Plan ID" />
				</Form.Item>
				<Form.Item label="Borrower" name="borrower" rules={[{ required: true, message: 'Please enter Borrower Wallet Address' }]}>
					<Input min="0" style={{ width: '100%' }} placeholder="Enter Borrower Wallet Address" />
				</Form.Item>
				<Form.Item wrapperCol={{
					lg: { span: 14, offset: 4 },
					xl: { span: 14, offset: 3 },
					xxl: { span: 14, offset: 3 } }}
				>
					<Button type="primary" htmlType="submit">Request insurance policy</Button>
				</Form.Item>
			</Form>
		</Card>
	);
}

export default CreateInsurancePolicy;
