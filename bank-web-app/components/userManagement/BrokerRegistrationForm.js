import React, { useContext } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import SmartContractContext from '../../stores/smartContractContext';

function BrokerRegistrationForm() {
	const [form] = Form.useForm();

	const { UserIdentityContract } = useContext(SmartContractContext);

	const createBroker = async (values) => {
		try {
			const accounts = await window.ethereum.enable();

			await UserIdentityContract.methods.addBroker(values.socialId, values.address, values.name).send({ from: accounts[0] });
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

		<Card title="Broker Registration Form">
			<Form
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
				onFinish={createBroker}
				form={form}
			>
				<Form.Item label="Id Number" name="socialId" rules={[{ required: true, message: 'Please enter social security id!' }]}>
					<Input
						style={{ width: '100%' }}
						placeholder="Enter social security number"
					/>
				</Form.Item>
				<Form.Item label="Broker Name" name="name" rules={[{ required: true, message: 'Please enter name!' }]}>
					<Input
						style={{ width: '100%' }}
						placeholder="Enter broker's name"
					/>
				</Form.Item>
				<Form.Item label="Wallet Address" name="address" rules={[{ required: true, message: 'Please enter wallet address!' }]}>
					<Input
						style={{ width: '100%' }}
						placeholder="Enter borrower's wallet address"
						addonAfter={<AimOutlined onClick={(e) => setWalletAddress(e)} />}
					/>
				</Form.Item>
				<Form.Item wrapperCol={{
					lg: { span: 14, offset: 4 },
					xl: { span: 14, offset: 3 },
					xxl: { span: 14, offset: 2 } }}
				>
					<Button type="primary" htmlType="submit">Register as Broker</Button>
				</Form.Item>
			</Form>
		</Card>
	);
}

export default BrokerRegistrationForm;
