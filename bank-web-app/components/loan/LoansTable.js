import React, { useState, useContext, useEffect } from 'react';
import { Table, Tag, Card, message, Modal, Form, InputNumber, Input, Space, Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import UserContext from '../../stores/userContext';
import { getApi } from '../../util/fetchApi';
import SmartContractContext from '../../stores/smartContractContext';

function LoansTable() {
	const { user } = useContext(UserContext);
	const { confirm, info } = Modal;
	const { BankLoanContract, UserIdentityContract, MicroTokenContract } = useContext(SmartContractContext);

	const state = ['REQUESTED', 'INSURANCE_APPLIED', 'INSURANCE_APPROVED', 'BORROWER_SIGNED',
		'INSURANCE_REJECTED', 'BANK_APPROVED', 'BANK_REJECTED', 'PAID_TO_INSURANCE', 'PAID_TO_BROKER',
		'ONGOING', 'DEFAULT', 'CLOSE', 'CLAIM_REQUESTED', 'CLAIMED'];

	const [isInsuranceModalVisible, setIsInsuranceModalVisible] = useState(false);
	const [id, setId] = useState(-1);
	const [insuranceId, setInsuranceId] = useState('');
	const [insurance, setInsurance] = useState('');
	const [insuranceFee, setInsuranceFee] = useState('');
	const [data, setData] = useState([]);
	const [payments, setPayments] = useState([]);
	const [loanRecord, setLoanRecord] = useState({});
	const [tokenTransferStep, setTokenTransferStep] = useState(0);
	const [isInsuranceTransferModalVisible, setIsInsuranceTransferModalVisible] = useState(false);
	const [isBrokerTransferModalVisible, setIsBrokerTransferModalVisible] = useState(false);
	const [isBorrowerTransferModalVisible, setIsBorrowerTransferModalVisible] = useState(false);

	const brokers = {};
	const borrowers = {};
	const insurers = {};

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

	const getInsuranceCompanies = async () => {
		const response = await UserIdentityContract.methods.getAllInsurers().call();
		for (let i = 0; i < response.length; i++) {
			insurers[response[i].walletAddress] = response[i].name;
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
					brokerName: brokers[response[i].broker],
					broker: response[i].broker,
					insurance: response[i].insurance,
					insuranceName: insurers[response[i].insurance],
					brokerFee: response[i].brokerFee,
					insuranceFee: response[i].insuranceFee,
					InsurancePolicyId: response[i].InsurancePolicyId,
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
		await getInsuranceCompanies();
		await getPayments();
		await getLoans();
	};

	const approveLoan = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.approveLoan(loanId).send({ from: accounts[0] });
			message.success(`Loan ${loanId} approved`);
			loadData();
		} catch (err) {
			console.log(err);
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

	const addInsuranceToLoan = async () => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.addInsurance(id, insurance, insuranceFee, insuranceId).send({ from: accounts[0] });
			message.success(`Insurance added successfully to the Loan ${id}`);
			loadData();
		} catch (err) {
			message.error('Error occured while adding insurance');
		}
	};

	const notifyInsuranceApproval = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.insuranceApproved(loanId).send({ from: accounts[0] });
			message.success(`Insurance Approval recorded for Loan ${id}`);
			loadData();
		} catch (err) {
			message.error('Error occured while updating Loan');
		}
	};

	const notifyInsuranceRejection = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.insuranceRejected(loanId).send({ from: accounts[0] });
			message.success(`Insurance Rejection recorded for Loan ${id}`);
			loadData();
		} catch (err) {
			message.error('Error occured while updating Loan');
		}
	};

	const signLoan = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.signByBorrower(loanId).send({ from: accounts[0] });
			message.success(`Loan ${id} signed`);
			loadData();
		} catch (err) {
			console.log(err);
			message.error('Error occured while signing Loan');
		}
	};

	const confirmTokenTrasferToInsurance = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.confirmTokenTrasferToInsurance(loanId).send({ from: accounts[0] });
			message.success(`Loan ${id} updated`);
			loadData();
		} catch (err) {
			console.log(err);
			message.error('Error occured while updating Loan');
		}
	};

	const showTransactionHash = (hash) => {
		info({
			content: `Transaction Hash: ${hash}`,
			width: 500,
		});
	};

	const transferTokensToInsurance = async () => {
		try {
			const accounts = await window.ethereum.enable();
			const response = await MicroTokenContract.methods.transfer(loanRecord.insurance, loanRecord.insuranceFee).send({
				from: accounts[0] });
			// setTransactionHash(response.transactionHash);
			message.success('Token transferred successfully');
			setTokenTransferStep(1);
			await confirmTokenTrasferToInsurance(loanRecord.id);
			setTokenTransferStep(0);
			setIsInsuranceTransferModalVisible(false);
			showTransactionHash(response.transactionHash);
		} catch (err) {
			console.log(err);
			await setTokenTransferStep(0);
			message.error('Error occured while transferring tokens');
		}
	};

	const confirmTokenTrasferToBroker = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.confirmTokenTrasferToBroker(loanId).send({ from: accounts[0] });
			message.success(`Loan ${id} updated`);
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
			message.success(`Loan ${id} updated`);
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

	const showBrokerTransferModal = (row) => {
		setLoanRecord(row);
		setIsBrokerTransferModalVisible(true);
	};

	const showBorrowerTransferModal = (row) => {
		setLoanRecord(row);
		setIsBorrowerTransferModalVisible(true);
	};

	const showInsuranceTransferModal = (row) => {
		setLoanRecord(row);
		setIsInsuranceTransferModalVisible(true);
	};

	const closeLoan = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.closeLoan(loanId).send({ from: accounts[0] });
			message.success(`Loan ${id} updated`);
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
			message.success(`Loan ${id} updated`);
			loadData();
		} catch (err) {
			console.log(err);
			message.error('Error occured while updating Loan');
		}
	};

	const requestClaim = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.requestClaim(loanId).send({ from: accounts[0] });
			message.success(`Loan ${id} updated`);
			loadData();
		} catch (err) {
			console.log(err);
			message.error('Error occured while updating Loan');
		}
	};

	const confirmRecivingOfClaim = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.confirmRecivingOfClaim(loanId).send({ from: accounts[0] });
			message.success(`Loan ${id} updated`);
			loadData();
		} catch (err) {
			console.log(err);
			message.error('Error occured while updating Loan');
		}
	};

	const showInsuranceModal = (value) => {
		setId(value);
		setIsInsuranceModalVisible(true);
	};

	const handleInsurance = () => {
		addInsuranceToLoan();
		setIsInsuranceModalVisible(false);
	};

	const handleCancel = () => {
		setIsInsuranceModalVisible(false);
		setIsInsuranceTransferModalVisible(false);
		setIsBrokerTransferModalVisible(false);
		setIsBorrowerTransferModalVisible(false);
	};

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			render: text => text,
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
			title: 'Loan Plan ID',
			dataIndex: 'planId',
		},
		{
			title: 'Status',
			dataIndex: 'status',
			render: tag => {
				let color = 'geekblue';
				if (tag === '4' || tag === '6' || tag === '10') {
					color = 'red';
				} else if (tag === '5' || tag === '9') {
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

	if (user.role === 'bank') {
		columns.push({
			title: 'Action',
			dataIndex: '',
			render: (record) => {
				let actionBlock = '';
				if (record.status === '3') {
					actionBlock =
						<Space>
							<Button type="primary" ghost onClick={() => confirmLoanApprove(record.id)}> Approve </Button>
							<Button type="primary" danger ghost onClick={() => confirmLoanReject(record.id)}> Reject </Button>
						</Space>;
				} else if (record.status === '5') {
					actionBlock =
						<Button type="primary" ghost onClick={() => showInsuranceTransferModal(record)}>
							Transfer Tokens to Insurance Co.
						</Button>;
				} else if (record.status === '7') {
					actionBlock =
						<Button type="primary" ghost onClick={() => showBrokerTransferModal(record)}>
							Transfer Tokens to Broker
						</Button>;
				} else if (record.status === '8') {
					actionBlock =
						<Button type="primary" ghost onClick={() => showBorrowerTransferModal(record)}>
							Token Transferred to Borrower
						</Button>;
				} else if (record.status === '9') {
					actionBlock =
						<Space>
							<Button type="primary" ghost onClick={() => closeLoan(record.id)}> Close </Button>
							<Button type="primary" danger ghost onClick={() => markAsDefaulted(record.id)}> Defaulted </Button>
						</Space>;
				} else if (record.status === '10') {
					actionBlock =
						<Button type="primary" ghost onClick={() => requestClaim(record.id)}>
							Claim Requested
						</Button>;
				} else if (record.status === '12') {
					actionBlock =
						<Button type="primary" ghost onClick={() => confirmRecivingOfClaim(record.id)}>
							Claimed
						</Button>;
				}
				return actionBlock;
			},
		});
	}

	if (user.role === 'broker') {
		columns.push({
			title: 'Action',
			dataIndex: '',
			render: (record) => {
				let actionBlock = '';
				if (record.status === '0') {
					actionBlock =
						<Button type="primary" ghost onClick={() => showInsuranceModal(record.id)}>
							Add Insurance
						</Button>;
				} else if (record.status === '1') {
					actionBlock =
						<Space>
							<Button type="primary" ghost onClick={() => notifyInsuranceApproval(record.id)}>Insurance Approved</Button>
							<Button type="primary" danger ghost ghostonClick={() => notifyInsuranceRejection(record.id)} style={{ color: 'red' }}>Insurance Rejected</Button>
						</Space>;
				}
				return actionBlock;
			},
		});
	}

	if (user.role === 'borrower') {
		columns.push({
			title: 'Action',
			dataIndex: '',
			render: (record) => {
				if (record.status === '2') {
					return (
						<Button type="primary" ghost onClick={() => signLoan(record.id)}>Sign Loan</Button>
					);
				}
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
				borrowerName: borrowers[result.borrower],
				borrower: result.borrower,
				brokerName: brokers[result.broker],
				broker: result.broker,
				insurance: result.insurance,
				insuranceName: insurers[result.insurance],
				brokerFee: result.brokerFee,
				insuranceFee: result.insuranceFee,
				InsurancePolicyId: result.InsurancePolicyId,
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
		const expandedData = [];
		expandedData.push(record);
		const expandedPayments = payments.filter(item => item.loanId == record.id);

		const expandedPaymentColumns = [
			{ title: 'Payment ID', dataIndex: '_id', key: 'id' },
			{ title: 'Amount', dataIndex: 'amount', key: 'amount' },
			{ title: 'Loan ID', dataIndex: 'loanId', key: 'loanId' },
			{ title: 'Transaction Hash', dataIndex: 'transactionHash', key: 'transactionHash' },
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
					<Form.Item label="Broker Address" style={{ marginBottom: '0px' }}>
						<span>{record.broker}</span>
					</Form.Item>
					<Form.Item label="Broker Fee" style={{ marginBottom: '0px' }}>
						<span>{record.brokerFee}</span>
					</Form.Item>
					<Form.Item label="Insurance Name" style={{ marginBottom: '0px' }}>
						<span>{record.insuranceName}</span>
					</Form.Item>
					<Form.Item label="Insurance Address" style={{ marginBottom: '0px' }}>
						<span>{record.insurance}</span>
					</Form.Item>
					<Form.Item label="Insurance Fee">
						<span>{record.insuranceFee}</span>
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
			<Card title="Loans" extra={<Button type="primary" ghost onClick={loadData}>Refresh</Button>}>
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
				title={`Add Insurance - Loan Request ${id}`}
				visible={isInsuranceModalVisible}
				onOk={handleInsurance}
				onCancel={handleCancel}
				width="50%"
			>
				<Form
					labelCol={{ lg: 6, xl: 6, xxl: 5 }}
					wrapperCol={{ lg: 12, xl: 12, xxl: 16 }}
					layout="horizontal"
					size="default"
					labelAlign="left"
				>
					<Form.Item label="Loan ID">
						<Input
							placeholder="Enter Insurance Wallet Address"
							value={id}
							disabled="true"
						/>
					</Form.Item>
					<Form.Item label="Insurance Address">
						<Input
							placeholder="Enter Insurance Wallet Address"
							value={insurance}
							onChange={(e) => setInsurance(e.target.value)}
						/>
					</Form.Item>
					<Form.Item label="Insurance Fee">
						<InputNumber
							min="0"
							style={{ width: '100%' }}
							placeholder="Enter Insurance fee pay by Bank"
							value={insuranceFee}
							onChange={(e) => setInsuranceFee(e)}
						/>
					</Form.Item>
					<Form.Item label="Insurance Policy ID">
						<InputNumber
							min="0"
							style={{ width: '100%' }}
							placeholder="Enter Insurance Policy Id"
							value={insuranceId}
							onChange={(e) => setInsuranceId(e)}
						/>
					</Form.Item>
				</Form>
			</Modal>
			<Modal
				title={`Transfer Tokens to Insurance Company - Loan Id ${loanRecord.id}`}
				visible={isInsuranceTransferModalVisible}
				width={700}
				onCancel={handleCancel}
				footer={null}
			>
				{
					tokenTransferStep === 0 &&
					<Form
						labelCol={{ lg: 6, xl: 5, xxl: 6 }}
						wrapperCol={{ lg: 20, xl: 20, xxl: 20 }}
						layout="horizontal"
						size="default"
						labelAlign="left"
					>
						<Form.Item label="Insurance Co. Name" style={{ marginBottom: '0px' }}>
							<span> { loanRecord.insuranceName } </span>
						</Form.Item>
						<Form.Item label="Insurance Co. Address" style={{ marginBottom: '0px' }}>
							<span> { loanRecord.insurance } </span>
						</Form.Item>
						<Form.Item label="Amount">
							<span> { loanRecord.insuranceFee } </span>
						</Form.Item>
						<Form.Item wrapperCol={{
							lg: { span: 14, offset: 6 },
							xl: { span: 14, offset: 5 },
							xxl: { span: 14, offset: 6 } }}
						>
							<Space direction="horizontal">
								<Button onClick={() => handleCancel()}>Cancel</Button>
								<Button type="primary" onClick={() => transferTokensToInsurance()}>Transfer Tokens</Button>
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
				title={`Transfer Tokens to Broker - Loan Id ${loanRecord.id}`}
				visible={isBrokerTransferModalVisible}
				width={700}
				onCancel={handleCancel}
				footer={null}
			>
				{
					tokenTransferStep === 0 &&
					<Form
						labelCol={{ lg: 6, xl: 5, xxl: 5 }}
						wrapperCol={{ lg: 20, xl: 20, xxl: 20 }}
						layout="horizontal"
						size="default"
						labelAlign="left"
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
								<Button type="primary" onClick={() => transferTokensToBroker()}>Transfer Tokens</Button>
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
								<Button type="primary" onClick={() => transferTokensToBorrower()}>Transfer Tokens</Button>
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
