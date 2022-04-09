import React from 'react';
import PropTypes from 'prop-types';
import { Card, Form, InputNumber, Button, message } from 'antd';
import { postApi } from '../../util/fetchApi';

function CreatePlanForm({ togglePlan, setTogglePlan }) {
	const addPlan = async (values) => {
		try {
			const body = {
				minAmount: values.minAmount,
				maxAmount: values.maxAmount,
				minMonths: values.minMonths,
				maxMonths: values.maxMonths,
				interest: values.interest,			};

			const requestOptions = {
				method: 'POST',
				body: JSON.stringify(body),
			};

			const response = await postApi({
				url: 'loan-plans',
				options: requestOptions,
			});

			const result = await response;
			await console.log(result);

			message.success('Loan Plan added successfully');
			setTogglePlan(!togglePlan);
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
				onFinish={addPlan}
			>
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
				<Form.Item label="Min months" name="minMonths" rules={[{ required: true, message: 'Please enter minimum months!' }]}>
					<InputNumber
						min="0"
						style={{ width: '100%' }}
						placeholder="Enter minimum loan period(months)"
					/>
				</Form.Item>
				<Form.Item label="Max months" name="maxMonths" rules={[{ required: true, message: 'Please enter maximum duration in months!' }]}>
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
