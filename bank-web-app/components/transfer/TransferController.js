import React, { useEffect, useState, useContext } from 'react';
import { Typography, Card, Divider, message, Steps, Col, Row, Button } from 'antd';
import { FileTextOutlined, FileDoneOutlined, AuditOutlined } from '@ant-design/icons';
import TransferForm from './TransferForm';
import TransactionConfirm from './TransactionConfirm';
import TransactionSuccess from './TransactionSuccess';
import TransactionFail from './TransactionFail';
import SmartContractContext from '../../stores/smartContractContext';

const { Title } = Typography;
const { Step } = Steps;

function TransferController() {
	const [balance, setBalance] = useState('0'); // Token balance state
	const [symbol, setSymbol] = useState(''); // ERC20 token symbol
	const [address, setAddress] = useState(''); // User wallet address state
	const [amount, setAmount] = useState(''); // Transferring token amount state
	const [transactionHash, setTransactionHash] = useState(''); // Blockchain transaction state
	const [isTransactionSuccessful, setIsTransactionSuccessful] = useState(false); // Transaction successfull state

	const { MicroTokenContract } = useContext(SmartContractContext); // Get the Micro Token Contract object from smartContractContext defined in the 'stores/smartContractContext.js'

	// Stages of token transferring process
	// 	0. Fill token transfering formatCountdown
	// 	1. Confirm receiver address and amount
	// 	2. Transaction result (successful or not)
	const [current, setCurrent] = useState(0); // Current stage of token transferring process

	// Read the user token balance from the Micro Token Contract
	const getBalance = async () => {
		try {
			const accounts = await window.ethereum.enable(); // Get selected wallet account from the metamask plugin.
			// Read token balance from the Micro Token Smart Contract for the selected wallet address.
			const response = await MicroTokenContract.methods.balanceOf(accounts[0]).call();

			setBalance(response); // Update the balance state
		} catch (err) {
			console.log(err);
			message.error('Error occured while reading balance'); // Show error message if any error occured while reading the token balance
		}
	};

	const getSymbol = async () => {
		try {
			const response = await MicroTokenContract.methods.symbol().call();
			setSymbol(response);
		} catch (err) {
			message.error('Error occured while reading symbol');
		}
	};

	const loadConfirmPage = () => {
		setCurrent(current + 1); // Increase the token transfering process stage.
	};

	const setInitialStates = () => {
		setAddress('');
		setAmount('');
		setIsTransactionSuccessful(false);
		setTransactionHash('');
		setCurrent(0);
	};

	const prev = () => {
		setCurrent(current - 1); // Decrease the token transfering process stage.
		setInitialStates();
	};

	const backToHome = () => {
		setInitialStates();
	};

	// Transfer tokens from selected wallet account to receiver account
	const confirmTokenTransfer = async () => {
		try {
			const accounts = await window.ethereum.enable(); // Get selected wallet account from the metamask plugin.
			// Transfer tokens using Micro Token Smart Contract.
			// Parameters: address - receiver wallet address, amount - amount of tokens
			const response = await MicroTokenContract.methods.transfer(address, amount).send({
				from: accounts[0] });

			setTransactionHash(response.transactionHash); // Update the transaction hash state from the response
			setIsTransactionSuccessful(true); // Update transaction result state as successful.
			setCurrent(current + 1); // Update the transfer stage.
			getBalance();
			message.success('Token transferred successfully');
		} catch (err) {
			// If error occured while transferring tokens;
			console.log(err);
			message.error('Error occured while transferring tokens');
			setCurrent(current + 1); // Update the transfer statge.
			setIsTransactionSuccessful(false); // Update transaction result state as unsuccessful.
		}
	};

	useEffect(() => {
		getBalance(); // Load the wallet token balance when load the web page.
		getSymbol(); // Load ERC20 token symbol when load the web page.
	}, []);

	useEffect(() => {
		if (amount !== '') {
			loadConfirmPage(); // If amount state value is not empty transferTokens function will execute.
		}
	}, [amount]); // This useEffect function will execute when amount state value change.

	// Three steps of token transferring process
	const steps = [
		{
			title: 'Transfer Details',
			icon: <FileTextOutlined />,
		},
		{
			title: 'Transfer Confirm',
			icon: <FileDoneOutlined />,
		},
		{
			title: 'Transfer Results',
			icon: <AuditOutlined />,
		},
	];

	return (
		<Card
			title="Microfinance Token Transfer Form"
			extra={<Button type="primary" ghost onClick={getBalance}>Refresh Balance</Button>}
		>
			{/* This will show the balance state value in the web page */}
			<Title level={4}>Account balance: {balance} {symbol}</Title>
			<Divider />

			<Row>
				<Col lg={24} xl={18} xxl={16} style={{ marginBottom: 25 }}>
					{/* Steps will show in the line and update when current state value updated.
					For more details please refer Step component in AntDesign */}
					<Steps current={current}>
						{steps.map(item => (
							<Step key={item.title} title={item.title} icon={item.icon} />
						))}
					</Steps>
				</Col>
			</Row>
			{
				// If user in the first stage of the token transfering process, web page will show the transfer form
				current === 0 &&
				<Row>
					<Col lg={24} xl={18} xxl={16}>
						{/* This will load the TransferForm component in the web page */}
						<TransferForm
							setAddress={setAddress} // Pass setAddress method as setAddress property to the TrnsferForm Component.
							setAmount={setAmount} // Pass setAmount method as setAmount propert to the TransferForm Component.
						/>
					</Col>
				</Row>
			}
			{
				// If user submit the transfer details(receiver address and token amount) web page will ask for the confirmation.
				current === 1 &&
				<Row>
					<Col lg={24} xl={18} xxl={16}>
						{/* This will load the transaction confirmation in the web page */}
						<TransactionConfirm
							address={address}
							amount={amount}
							confirmTokenTransfer={confirmTokenTransfer}
							prev={prev}
						/>
					</Col>
				</Row>
			}
			{
				// when user confirm the details it will transfer the tokens and update the transaction results.
				// If transaction process in the results stage and transaction successful it will show the successful message on the web page.
				current === 2 && isTransactionSuccessful &&
				<Row>
					<Col lg={24} xl={18} xxl={16}>
						{/* Show the transaction successful message with the transaction details and transactionHash value */}
						<TransactionSuccess
							amount={amount}
							address={address}
							transactionHash={transactionHash}
							backToHome={backToHome}
						/>
					</Col>
				</Row>
			}
			{
				// If transaction process in the results stage and transaction failed it will show the transaction fail message on the web page.
				current === 2 && !isTransactionSuccessful &&
				<Row>
					<Col lg={24} xl={18} xxl={16}>
						<TransactionFail
							backToHome={backToHome}
						/>
					</Col>
				</Row>
			}
		</Card>

	);
}

export default TransferController;
