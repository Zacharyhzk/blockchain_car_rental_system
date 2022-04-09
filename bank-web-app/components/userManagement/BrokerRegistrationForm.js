import React, { useContext } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import SmartContractContext from '../../stores/smartContractContext';

// React functional component for Broker registration form.
function BrokerRegistrationForm() {
	const [form] = Form.useForm();

	const { UserIdentityContract } = useContext(SmartContractContext); // Get User Identity Contract from smartContractContext

	// register new Broker in the User Identity contract
	// Parameter - values = field values submitted from form.
	const createBroker = async (values) => {
		try {
			const accounts = await window.ethereum.enable(); // Get the account seleceted in the metamask plugin.
			// Call addBroker method in the User Identity smart contract using form field values captured using their name property.
			// Method will call using selected account from the metamask.
			await UserIdentityContract.methods.addBroker(values.socialId, values.address, values.name).send({ from: accounts[0] });
			message.success('Broker is Registered successfully');
		} catch (err) {
			message.error('Error registering Broker');
			console.log(err);
		}
	};

	// Capture the selected account from the metamask and update the address form field value.
	const setWalletAddress = async () => {
		const accounts = await window.ethereum.enable();
		form.setFieldsValue({
			address: accounts[0],
		});
	};

	return (
		<Card title="Broker Registration Form">
			<Form
				labelCol={{ lg: 4, xl: 3, xxl: 2 }}
				wrapperCol={{ lg: 16, xl: 14, xxl: 10 }}
				layout="horizontal"
				size="default"
				labelAlign="left"
				onFinish={createBroker} // createBroker function will execute when user submits the form. form field valus will pass as an parameter.
				form={form}
			>
				{/* Form field values will captured using the name property */}
				<Form.Item label="Id Number" name="socialId" rules={[{ required: true, message: 'Please enter social security id!' }]}>
					<Input
						style={{ width: '100%' }}
						placeholder="Enter social security number"
					/>
				</Form.Item>
				<Form.Item label="Broker Name" name="name" rules={[{ required: true, message: 'Please enter name!' }]}>
					<Input
						style={{ width: '100%' }}
						placeholder="Enter Broker's name"
					/>
				</Form.Item>
				<Form.Item label="Wallet Address" name="address" rules={[{ required: true, message: 'Please enter Broker\'s wallet address!' }]}>
					<Input
						style={{ width: '100%' }}
						placeholder="Enter Broker's wallet address"
						addonAfter={<AimOutlined onClick={(e) => setWalletAddress(e)} />}
					/>
				</Form.Item>
				<Form.Item wrapperCol={{
					lg: { span: 14, offset: 4 },
					xl: { span: 14, offset: 3 },
					xxl: { span: 14, offset: 2 } }}
				>
					<Button type="primary" htmlType="submit">Register Broker</Button>
				</Form.Item>
			</Form>
		</Card>
	);
}

export default BrokerRegistrationForm;
