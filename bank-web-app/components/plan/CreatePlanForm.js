import React from 'react';
import PropTypes from 'prop-types';
import { Card, Form, InputNumber, Button, message } from 'antd';
import { postApi } from '../../util/fetchApi';

function CreatePlanForm({ togglePlan, setTogglePlan }) {
	// Post new Loan Plans in to the bank server.
	// Parameter - values = contains the field values submitted from form.
	const addPlan = async (values) => {
		try {
			// Defines the http request body object using submitted form fields values.
			const body = {
				minAmount: values.minAmount,
				maxAmount: values.maxAmount,
				minMonths: values.minMonths,
				maxMonths: values.maxMonths,
				interest: values.interest,
			};

			// Calls post method to submit the new Loan Plan to the bank server.
			await postApi({
				url: 'loan-plans', // calls <Bank Server URL>/loan-payment api.
				params: body,
			});

			message.success('Loan Plan added successfully');
			setTogglePlan(!togglePlan); // Update state.s
		} catch (err) {
			message.error('Error while adding the Loan Plan');
			console.log(err);
		}
	};

	return (
		<Card title="Create Loan Plan" style={{ margin: '0px' }}>
			<Form
				labelCol={{ lg: 4, xl: 3, xxl: 2 }}
				wrapperCol={{ lg: 14, xl: 12, xxl: 10 }}
				layout="horizontal"
				size="default"
				labelAlign="left"
				onFinish={addPlan} // addPlan function will executed when user submit the form.
			>
				{/* field values captured using name property when user submit the form */}
				<Form.Item label="Min amount" name="minAmount" rules={[{ required: true, message: 'Please enter minimum loan amount!' }]}>
					<InputNumber
						min="0"
						style={{ width: '100%' }}
						placeholder="Enter minimum loan amount"
					/>
				</Form.Item>
				<Form.Item label="Max amount" name="maxAmount" rules={[{ required: true, message: 'Please enter maximum loan amount!' }]}>
					<InputNumber
						min="0"
						style={{ width: '100%' }}
						placeholder="Enter maximum loan amount"
					/>
				</Form.Item>
				<Form.Item label="Min months" name="minMonths" rules={[{ required: true, message: 'Please enter minimum loan period!' }]}>
					<InputNumber
						min="0"
						style={{ width: '100%' }}
						placeholder="Enter minimum loan period(months)"
					/>
				</Form.Item>
				<Form.Item label="Max months" name="maxMonths" rules={[{ required: true, message: 'Please enter maximum loan period!' }]}>
					<InputNumber
						min="0"
						style={{ width: '100%' }}
						placeholder="Enter maximum loan period(months)"
					/>
				</Form.Item>
				<Form.Item label="Interest" name="interest" rules={[{ required: true, message: 'Please enter interest!' }]}>
					<InputNumber
						min="0"
						style={{ width: '100%' }}
						placeholder="Enter interest rate"
					/>
				</Form.Item>
				<Form.Item wrapperCol={{
					lg: { span: 14, offset: 4 },
					xl: { span: 14, offset: 3 },
					xxl: { span: 14, offset: 2 } }}
				>
					{/* Form submit button */}
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
