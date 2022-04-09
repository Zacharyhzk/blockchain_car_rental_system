import React, { useState, useContext, useEffect } from 'react';
import { Table, Tag, Card, message, Modal, Form, Space, Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { getApi } from '../../util/fetchApi';
import UserContext from '../../stores/userContext';
import SmartContractContext from '../../stores/smartContractContext';

function LoansTable() {
	// Following properties will captured from userContext and smartContractContext.
	// user - selected user role form the top right corner of the bank web app.
	// Smart contract instances - Micro Token, Bank Loan and User Identity.
	const { user } = useContext(UserContext);
	const { MicroTokenContract, BankLoanContract, UserIdentityContract } = useContext(SmartContractContext);

	const { confirm } = Modal;

	// Define Bank Loan states.
	// These states should be in order as defined in the Bank Loan smart contract.
	const state = ['REQUESTED', 'BORROWER_SIGNED', 'BANK_APPROVED', 'BANK_REJECTED',
		'PAID_TO_BROKER', 'ONGOING', 'DEFAULT', 'CLOSE'];

	const [isBrokerTransferModalVisible, setIsBrokerTransferModalVisible] = useState(false);
	const [isBorrowerTransferModalVisible, setIsBorrowerTransferModalVisible] = useState(false);
	const [loanRecord, setLoanRecord] = useState({});
	const [tokenTransferStep, setTokenTransferStep] = useState(0);
	const [payments, setPayments] = useState([]);
	const [data, setData] = useState([]);

	const brokers = {};
	const borrowers = {};

	const getBrokers = async () => {
		const response = await UserIdentityContract.methods.getAllBrokers().call();
		for (let i = 0; i < response.length; i++) {
			brokers[response[i].walletAddress] = response[i].name;
		}
	};

	const getBorrowers = async () => {
		const response = await UserIdentityContract.methods.getAllBorrowers().call();
		for (let i = 0; i < response.length; i++) {
			borrowers[response[i].walletAddress] = response[i].name;
		}
	};

	const getPayments = async () => {
		try {
			const response = await getApi({
				url: 'loan-payments',
			});
			const paymentsResult = await response;
			setPayments(paymentsResult);
		} catch (err) {
			console.log(err);
			message.error('Error occured while loading Loan Payments');
		}
	};

	const getLoans = async () => {
		try {
			const response = await BankLoanContract.methods.getLoans().call();

			setData([]);

			for (let i = 0; i < response.length; i++) {
				const row = {
					key: response[i].id,
					id: response[i].id,
					amount: response[i].amount,
					period: response[i].months,
					interest: response[i].interest,
					planId: response[i].planId,
					borrowerName: borrowers[response[i].borrower],
					borrower: response[i].borrower,
					brokerFee: response[i].brokerFee,
					brokerName: brokers[response[i].broker],
					broker: response[i].broker,
					status: response[i].state,
				};

				setData((prev) => {
					return [...prev, row];
				});
			}
		} catch (err) {
			console.log(err);
			message.error('Error occured while loading current Loans');
		}
	};

	const loadData = async () => {
		await getBrokers();
		await getBorrowers();
		await getPayments();
		await getLoans();
	};

	const confirmTokenTrasferToBroker = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.confirmTokenTrasferToBroker(loanId).send({ from: accounts[0] });
			message.success(`Loan ${loanId} updated`);
			loadData();
		} catch (err) {
			console.log(err);
			message.error('Error occured while updating Loan');
		}
	};

	const transferTokensToBroker = async () => {
		try {
			const accounts = await window.ethereum.enable();
			await MicroTokenContract.methods.transfer(loanRecord.broker, loanRecord.brokerFee).send({
				from: accounts[0] });
			message.success('Token transferred successfully');
			await setTokenTransferStep(1);
			await confirmTokenTrasferToBroker(loanRecord.id);
			await setTokenTransferStep(0);
			await setIsBrokerTransferModalVisible(false);
		} catch (err) {
			console.log(err);
			await setTokenTransferStep(0);
			message.error('Error occured while transferring tokens');
		}
	};

	const confirmTokenTrasferToBorrower = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.confirmTokenTrasferToBorrower(loanId).send({ from: accounts[0] });
			message.success(`Loan ${loanId} updated`);
			loadData();
		} catch (err) {
			console.log(err);
			message.error('Error occured while updating Loan');
		}
	};

	const transferTokensToBorrower = async () => {
		try {
			const accounts = await window.ethereum.enable();
			await MicroTokenContract.methods.transfer(loanRecord.borrower, loanRecord.amount).send({
				from: accounts[0] });
			message.success('Token transferred successfully');
			await setTokenTransferStep(1);
			await confirmTokenTrasferToBorrower(loanRecord.id);
			await setTokenTransferStep(0);
			await setIsBorrowerTransferModalVisible(false);
		} catch (err) {
			console.log(err);
			await setTokenTransferStep(0);
			message.error('Error occured while transferring tokens');
		}
	};

	const approveLoan = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.approveLoan(loanId).send({ from: accounts[0] });
			message.success(`Loan ${loanId} approved`);
			loadData();
		} catch (err) {
			message.error('Error occured while approving the Loan');
		}
	};

	const confirmLoanApprove = (loanId) => {
		confirm({
			content: `Approve Loan ${loanId} ?`,
			okText: 'Approve Loan',
			onOk: () => approveLoan(loanId),
		});
	};

	const rejectLoan = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.rejectLoan(loanId).send({ from: accounts[0] });
			message.success(`Loan ${loanId} rejected`);
			loadData();
		} catch (err) {
			message.error('Error occured while rejecting the Loan');
		}
	};

	const confirmLoanReject = (loanId) => {
		confirm({
			icon: <CloseCircleOutlined style={{ color: 'red' }} />,
			content: `Reject Loan ${loanId} ?`,
			okText: 'Reject Loan',
			okButtonProps: {
				type: 'danger',
			},
			onOk: () => rejectLoan(loanId),
		});
	};

	const signLoan = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.signByBorrower(loanId).send({ from: accounts[0] });
			message.success(`Loan ${loanId} signed`);
			loadData();
		} catch (err) {
			console.log(err);
			message.error('Error occured while signing Loan');
		}
	};

	const closeLoan = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.closeLoan(loanId).send({ from: accounts[0] });
			message.success(`Loan ${loanId} updated`);
			loadData();
		} catch (err) {
			console.log(err);
			message.error('Error occured while updating Loan');
		}
	};

	const markAsDefaulted = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.markAsDefaulted(loanId).send({ from: accounts[0] });
			message.success(`Loan ${loanId} updated`);
			loadData();
		} catch (err) {
			console.log(err);
			message.error('Error occured while updating Loan');
		}
	};

	const showBrokerTransferModal = (row) => {
		setLoanRecord(row);
		setIsBrokerTransferModalVisible(true);
	};

	const showBorrowerTransferModal = (row) => {
		setLoanRecord(row);
		setIsBorrowerTransferModalVisible(true);
	};

	const handleCancel = () => {
		setIsBrokerTransferModalVisible(false);
		setIsBorrowerTransferModalVisible(false);
	};

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
		},
		{
			title: 'Borrower Name',
			dataIndex: 'borrowerName',
		},
		{
			title: 'Broker Name',
			dataIndex: 'brokerName',
		},
		{
			title: 'Amount',
			dataIndex: 'amount',
		},
		{
			title: 'Period',
			dataIndex: 'period',
		},
		{
			title: 'Interest %',
			dataIndex: 'interest',
		},
		{
			title: 'Broker Fee',
			dataIndex: 'brokerFee',
		},
		{
			title: 'Plan ID',
			dataIndex: 'planId',
		},
		{
			title: 'Status',
			dataIndex: 'status',
			render: tag => {
				let color = 'geekblue';
				if (tag === '3' || tag === '6') {
					color = 'red';
				} else if (tag === '2' || tag === '5') {
					color = 'green';
				}
				return (
					<Tag color={color} key={tag}>
						{state[tag]}
					</Tag>
				);
			},
		},
	];

	if (user.role === 'borrower') {
		columns.push({
			title: 'Action',
			dataIndex: '',
			render: (record) => {
				if (record.status === '0') {
					return (
						<Button type="primary" ghost onClick={() => signLoan(record.id)}> Sign Loan </Button>
					);
				}
			},
		});
	}

	if (user.role === 'bank') {
		columns.push({
			title: 'Action',
			dataIndex: '',
			render: (record) => {
				let actionBlock = '';
				if (record.status === '1') {
					actionBlock =
						<Space>
							<Button type="primary" ghost onClick={() => confirmLoanApprove(record.id)}> Approve </Button>
							<Button type="primary" danger ghost onClick={() => confirmLoanReject(record.id)}> Reject </Button>
						</Space>;
				} else if (record.status === '2') {
					actionBlock =
						<Button type="primary" ghost onClick={() => showBrokerTransferModal(record)}>
							Transfer Tokens to Broker
						</Button>;
				} else if (record.status === '4') {
					actionBlock =
						<Button type="primary" ghost onClick={() => showBorrowerTransferModal(record)}>
							Transfer Tokens to Borrower
						</Button>;
				} else if (record.status === '5') {
					actionBlock =
						<Space>
							<Button type="primary" ghost onClick={() => closeLoan(record.id)}> Close </Button>
							<Button type="primary" danger ghost onClick={() => markAsDefaulted(record.id)}> Defaulted </Button>
						</Space>;
				}
				return actionBlock;
			},
		});
	}

	useEffect(() => {
		loadData();
		const emitter = BankLoanContract.events.loanRequest({ fromBlock: 'latest' }, (error, response) => {
			const result = response.returnValues;

			const row = {
				key: result.id,
				id: result.id,
				amount: result.amount,
				period: result.months,
				interest: result.interest,
				planId: result.planId,
				borrower: result.borrower,
				brokerFee: result.brokerFee,
				broker: result.broker,
				status: result.state,
			};

			setData((prev) => {
				return [...prev, row];
			});
		});

		return () => {
			emitter.unsubscribe();
		};
	}, []);

	const expandedRowRender = (record) => {
		const expandedPayments = payments.filter(item => item.loanId == record.id);

		const expandedPaymentColumns = [
			{ title: 'Payment ID', dataIndex: '_id' },
			{ title: 'Amount', dataIndex: 'amount' },
			{ title: 'Transaction Hash', dataIndex: 'transactionHash' },
		];

		return (
			<>
				<Form
					labelCol={{
						lg: 6,
						xl: 6,
						xxl: 3,
					}}
					wrapperCol={{
						lg: 12,
						xl: 12,
						xxl: 16,
					}}
					layout="horizontal"
					size="default"
					labelAlign="left"
				>
					<Form.Item label="Borrower Address" style={{ marginBottom: '0px' }}>
						<span>{record.borrower}</span>
					</Form.Item>
					<Form.Item label="Broker Address">
						<span>{record.broker}</span>
					</Form.Item>
				</Form>
				<Table
					columns={expandedPaymentColumns}
					dataSource={expandedPayments}
					pagination={false}
				/>
			</>
		);
	};

	return (
		<>
			<Card title="Loans">
				<Table
					pagination="true"
					columns={columns}
					dataSource={data}
					expandable={{
						expandedRowRender,
					}}
				/>
			</Card>
			<Modal
				title={`Transfer Tokens to Broker - Loan Id ${loanRecord.id}`}
				visible={isBrokerTransferModalVisible}
				width={700}
				onCancel={handleCancel}
				footer={null}
			>
				{
					tokenTransferStep === 0 &&
					<Form
						labelCol={{
							lg: 6,
							xl: 5,
							xxl: 5,
						}}
						wrapperCol={{
							lg: 20,
							xl: 20,
							xxl: 20,
						}}
						layout="horizontal"
						size="default"
						labelAlign="left"
						onFinish={transferTokensToBroker}
					>
						<Form.Item label="Broker Name" style={{ marginBottom: '0px' }}>
							<span> { loanRecord.brokerName } </span>
						</Form.Item>
						<Form.Item label="Broker Address" style={{ marginBottom: '0px' }}>
							<span> { loanRecord.broker } </span>
						</Form.Item>
						<Form.Item label="Amount">
							<span> { loanRecord.brokerFee } </span>
						</Form.Item>
						<Form.Item wrapperCol={{
							lg: { span: 14, offset: 6 },
							xl: { span: 14, offset: 5 },
							xxl: { span: 14, offset: 5 } }}
						>
							<Space direction="horizontal">
								<Button onClick={() => handleCancel()}>Cancel</Button>
								<Button type="primary" htmlType="submit">Transfer Tokens</Button>
							</Space>
						</Form.Item>
					</Form>
				}
				{
					tokenTransferStep === 1 &&
					<span>Updating the Loan State</span>
				}
			</Modal>
			<Modal
				title={`Transfer Tokens to Borrower - Loan Id ${loanRecord.id}`}
				visible={isBorrowerTransferModalVisible}
				width={700}
				onCancel={handleCancel}
				footer={null}
			>
				{
					tokenTransferStep === 0 &&
					<Form
						labelCol={{
							lg: 6,
							xl: 5,
							xxl: 5,
						}}
						wrapperCol={{
							lg: 20,
							xl: 20,
							xxl: 20,
						}}
						layout="horizontal"
						size="default"
						labelAlign="left"
						onFinish={transferTokensToBorrower}
					>
						<Form.Item label="Borrower Name" style={{ marginBottom: '0px' }}>
							<span> { loanRecord.borrowerName } </span>
						</Form.Item>
						<Form.Item label="Borrower Address" style={{ marginBottom: '0px' }}>
							<span> { loanRecord.borrower } </span>
						</Form.Item>
						<Form.Item label="Amount">
							<span> { loanRecord.amount } </span>
						</Form.Item>
						<Form.Item wrapperCol={{
							lg: { span: 14, offset: 6 },
							xl: { span: 14, offset: 5 },
							xxl: { span: 14, offset: 5 } }}
						>
							<Space direction="horizontal">
								<Button onClick={() => handleCancel()}>Cancel</Button>
								<Button type="primary" htmlType="submit">Transfer Tokens</Button>
							</Space>
						</Form.Item>
					</Form>
				}
				{
					tokenTransferStep === 1 &&
					<span>Updating the Loan State</span>
				}
			</Modal>
		</>
	);
}

export default LoansTable;
