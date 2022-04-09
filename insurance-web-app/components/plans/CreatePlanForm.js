import React from 'react';
import PropTypes from 'prop-types';
import { Card, Form, InputNumber, Button, message } from 'antd';
import { postApi } from '../../util/fetchApi';

function CreatePlanForm({ togglePlan, setTogglePlan }) {
	const createPolicyPlan = async (values) => {
		try {
			const body = {
				months: values.duration,
				loanAmount: values.amount,
				payment: values.payment,
			};

			const response = await postApi({
				url: 'policy-plans',
				params: body,
			});

			const result = await response;
			console.log(result);

			message.success('New Insurance Polciy Plan added successfully');
			setTogglePlan(!togglePlan);
		} catch (err) {
			message.error('Error creating Insurance Polciy Plan');
			console.log(err);
		}
	};

	return (
		<Card title="Create Insurance Policy Plan" style={{ margin: '0px' }}>
			<Form
				labelCol={{
					lg: 4,
					xl: 3,
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
				onFinish={createPolicyPlan}
			>
				<Form.Item label="Loan Amount" name="amount" rules={[{ required: true, message: 'Please enter Loan Amount!' }]}>
					<InputNumber
						min="0"
						style={{ width: '100%' }}
						placeholder="Enter Loan Amount"
					/>
				</Form.Item>
				<Form.Item label="Loan Duration" name="duration" rules={[{ required: true, message: 'Please enter Loan Duration!' }]}>
					<InputNumber
						min="0"
						style={{ width: '100%' }}
						placeholder="Enter Loan Duration"
					/>
				</Form.Item>
				<Form.Item label="Insurance Fee" name="payment" rules={[{ required: true, message: 'Please enter Insurance Payment!' }]}>
					<InputNumber
						min="0"
						style={{ width: '100%' }}
						placeholder="Enter Insurance Payment"
					/>
				</Form.Item>
				<Form.Item wrapperCol={{
					lg: { span: 14, offset: 4 },
					xl: { span: 14, offset: 3 },
					xxl: { span: 14, offset: 2 } }}
				>
					<Button type="primary" htmlType="submit">Add New Plan</Button>
				</Form.Item>
			</Form>
		</Card>
	);
}

CreatePlanForm.propTypes = {
	togglePlan: PropTypes.bool.isRequired,
	setTogglePlan: PropTypes.func.isRequired,
};

export default CreatePlanForm;
