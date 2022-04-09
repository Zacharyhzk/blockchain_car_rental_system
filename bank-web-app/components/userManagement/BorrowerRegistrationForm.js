import React, { useContext } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import SmartContractContext from '../../stores/smartContractContext';

// React functional component for Borrower registration form.
function CreateBorrowerForm() {
	const [form] = Form.useForm();

	const { UserIdentityContract } = useContext(SmartContractContext); // Get User Identity contract instance defined in the smartContractContext.

	// Add new borrower entry in to the User Identity smart contract.
	// values parameter contains the submitted form field values and captured using their names later.
	const createBorrower = async (values) => {
		try {
			const accounts = await window.ethereum.enable(); // Get the selected account from the metamask plugin.
			// Call the addBorrower method of the User Identity contract.
			// SocialSecurityID, wallter address, user name will pass as parameters to the functions.
			// Smart contract function will call using selected account from the metamask.
			await UserIdentityContract.methods.addBorrower(values.socialId, values.address, values.name).send({ from: accounts[0] });
			message.success('Borrower is registered successfully!');
		} catch (err) {
			message.error('Error occured while registering Borrower!');
			console.log(err);
		}
	};

	return (

		<Card title="Borrower Registration Form">
			<Form
				form={form}
				labelCol={{ lg: 4, xl: 3, xxl: 2 }}
				wrapperCol={{ lg: 16, xl: 14, xxl: 10 }}
				layout="horizontal"
				size="default"
				labelAlign="left"
				onFinish={createBorrower} // createBorrower function will execute when user submits the form. Form field values will pass as a parameter to the function.
			>
				{/* name property will use to capture the form filed values when user submits the form */}
				<Form.Item label="Id Number" name="socialId" rules={[{ required: true, message: 'Please input Borrower\'s social security id!' }]}>
					<Input
						style={{ width: '100%' }}
						placeholder="Enter social security number"
					/>
				</Form.Item>
				<Form.Item label="Borrower Name" name="name" rules={[{ required: true, message: 'Please input Borrower\'s name!' }]}>
					<Input
						style={{ width: '100%' }}
						placeholder="Enter Borrower's name"
					/>
				</Form.Item>
				<Form.Item label="Wallet Address" name="address" rules={[{ required: true, message: 'Please input Borrower\'s address!' }]}>
					<Input
						style={{ width: '100%' }}
						placeholder="Enter Borrower's wallet address"
					/>
				</Form.Item>
				<Form.Item wrapperCol={{
					lg: { span: 14, offset: 4 },
					xl: { span: 14, offset: 3 },
					xxl: { span: 14, offset: 2 } }}
				>
					{/* Form submit button */}
					<Button type="primary" htmlType="submit">Register Borrower</Button>
				</Form.Item>
			</Form>
		</Card>
	);
}

export default CreateBorrowerForm;
