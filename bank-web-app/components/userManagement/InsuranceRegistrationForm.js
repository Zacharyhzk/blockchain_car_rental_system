import React, { useContext } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import SmartContractContext from '../../stores/smartContractContext';

function InsuranceRegistrationForm() {
	const [form] = Form.useForm();

	const { UserIdentityContract } = useContext(SmartContractContext);

	const createInusrer = async (values) => {
		try {
			const accounts = await window.ethereum.enable();
			await UserIdentityContract.methods.addInsurer(values.regNumber, values.address, values.name).send({ from: accounts[0] });
			message.success('Registered as Broker successfully');
		} catch (err) {
			message.error('Error registering as Broker');
		}
	};

	const setWalletAddress = async () => {
		const accounts = await window.ethereum.enable();
		form.setFieldsValue({
			address: accounts[0],
		});
	};

	return (
		<Card title="Insurance Registration Form">
			<Form
				form={form}
				labelCol={{
					lg: 4,
					xl: 3,
					xxl: 2,
				}}
				wrapperCol={{
					lg: 16,
					xl: 14,
					xxl: 10,
				}}
				layout="horizontal"
				size="default"
				labelAlign="left"
				onFinish={createInusrer}
			>
				<Form.Item label="Reg Number" name="regNumber" rules={[{ required: true, message: 'Please enter Insurance Reg. No.!' }]}>
					<Input
						style={{ width: '100%' }}
						placeholder="Enter Insurance Company registration number"
					/>
				</Form.Item>
				<Form.Item label="Company Name" name="name" rules={[{ required: true, message: 'Please enter Insurance name!' }]}>
					<Input
						style={{ width: '100%' }}
						placeholder="Enter Insurance Company name"
					/>
				</Form.Item>
				<Form.Item label="Wallet Address" name="address" rules={[{ required: true, message: 'Please enter wallet address!' }]}>
					<Input
						style={{ width: '100%' }}
						placeholder="Enter Insurance Company wallet address"
						addonAfter={<AimOutlined onClick={(e) => setWalletAddress(e)} />}
					/>
				</Form.Item>
				<Form.Item wrapperCol={{
					lg: { span: 14, offset: 4 },
					xl: { span: 14, offset: 3 },
					xxl: { span: 14, offset: 2 } }}
				>
					<Button type="primary" htmlType="submit">Register Insurance Company</Button>
				</Form.Item>
			</Form>
		</Card>
	);
}

export default InsuranceRegistrationForm;
