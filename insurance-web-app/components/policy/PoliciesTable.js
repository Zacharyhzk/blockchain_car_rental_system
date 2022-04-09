import React, { useState, useContext, useEffect } from 'react';

import { Table, Tag, Card, message, Modal, Button, Form, Space } from 'antd';
import { getApi } from '../../util/fetchApi';
import UserContext from '../../stores/userContext';
import SmartContractContext from '../../stores/smartContractContext';

function PoliciesTable() {
	const { user } = useContext(UserContext);
	const { confirm, info } = Modal;
	const { InsurancePolicyContract, UserIdentityContract, MicroTokenContract } = useContext(SmartContractContext);

	const state = ['REQUESTED', 'BORROWER_SIGNED', 'APPROVED', 'REJECTED', 'ONGOING', 'CLAIM_REQUESTED', 
		'CLAIM_APPROVED', 'CLAIM_REJECTED', 'CLAIMED', 'CLOSE'];

	const [payments, setPayments] = useState([]);
	const [data, setData] = useState([]);
	const [isBankTransferModalVisible, setIsBankTransferModalVisible] = useState(false);
	const [policyRecord, setPolicyRecord] = useState({});
	const [bankAddress, setBankAddress] = useState('');
	const [tokenTransferStep, setTokenTransferStep] = useState(0);

	const brokers = {};
	const borrowers = {};

	const getPayments = async () => {
		try {
			const response = await getApi({
				url: 'policy-payments',
			});
			const paymentsResult = await response;
			setPayments(paymentsResult);
		} catch (err) {
			console.log(err);
			message.error('Error occured while loading Insurance Policy Payments');
		}
	};

	const getAllBorrowers = async () => {
		const response = await UserIdentityContract.methods.getAllBorrowers().call();
		for (let i = 0; i < response.length; i++) {
			borrowers[response[i].walletAddress] = response[i].name;
		}
	};

	const getBrokers = async () => {
		const response = await UserIdentityContract.methods.getAllBrokers().call();
		for (let i = 0; i < response.length; i++) {
			brokers[response[i].walletAddress] = response[i].name;
		}
	};

	const getBankAddress = async () => {
		const response = await UserIdentityContract.methods.getBankAddress().call();
		setBankAddress(response);
	};

	const getPolicies = async () => {
		try {
			const response = await InsurancePolicyContract.methods.getAllPolicies().call();

			setData([]);

			for (let i = 0; i < response.length; i++) {
				const row = {
					key: response[i].id,
					id: response[i].id,
					amount: response[i].amount,
					period: response[i].months,
					planId: response[i].planId,
					loanId: response[i].loanId,
					borrower: borrowers[response[i].borrower],
					broker: brokers[response[i].broker],
					brokerAddress: response[i].broker,
					borrowerAddress: response[i].borrower,
					payment: response[i].payment,
					status: response[i].state,
					borrowerSigned: response[i].isBorrowerSigned,
					insuranceApprove: response[i].insuranceApprove,
				};

				setData((prev) => {
					return [...prev, row];
				});
			}
		} catch (err) {
			message.error('Error occured while loading plans');
		}
	};

	const loadData = async () => {
		await getAllBorrowers();
		await getBrokers();
		await getPayments();
		await getPolicies();
		await getBankAddress();
	};

	const showBankTransferModal = (row) => {
		setPolicyRecord(row);
		setIsBankTransferModalVisible(true);
	};

	const confirmTokenTrasferToBank = async (policyId) => {
		try {
			const accounts = await window.ethereum.enable();
			await InsurancePolicyContract.methods.confirmClaim(policyId).send({ from: accounts[0] });
			message.success(`Insurance Policy ${policyId} updated`);
			loadData();
		} catch (err) {
			console.log(err);
			message.error('Error occured while updating the Insurance Policy');
		}
	};

	const showTransactionHash = (hash) => {
		info({
			content: `Transaction Hash: ${hash}`,
			width: 500,
		});
	};

	const transferTokensToBank = async () => {
		try {
			const accounts = await window.ethereum.enable();
			const response = await MicroTokenContract.methods.transfer(bankAddress, policyRecord.amount).send({
				from: accounts[0] });
			message.success('Token transferred successfully');
			setTokenTransferStep(1);
			await confirmTokenTrasferToBank(policyRecord.id);
			setTokenTransferStep(0);
			setIsBankTransferModalVisible(false);
			showTransactionHash(response.transactionHash);
		} catch (err) {
			console.log(err);
			await setTokenTransferStep(0);
			message.error('Error occured while transferring tokens');
		}
	};

	const signPolicyRequest = async (policyId) => {
		try {
			const accounts = await window.ethereum.enable();
			await InsurancePolicyContract.methods.signInsurancePolicy(policyId).send({ from: accounts[0] });
			message.success(`Insurance Policy ${policyId} signed`);
			loadData();
		} catch (err) {
			console.log(err);
			message.error('Error occured while signing Insurance Policy');
		}
	};

	const approveInsurancePolicy = async (policyId) => {
		try {
			const accounts = await window.ethereum.enable();
			await InsurancePolicyContract.methods.approveInsurancePolicy(policyId).send({ from: accounts[0] });
			message.success(`Insurance Policy ${policyId} approved`);
			loadData();
		} catch (err) {
			message.error('Error occured while approving the Insurance Policy');
		}
	};

	const rejectInsurancePolicy = async (policyId) => {
		try {
			const accounts = await window.ethereum.enable();
			await InsurancePolicyContract.methods.rejectInsurancePolicy(policyId).send({ from: accounts[0] });
			message.success(`Insurance Policy ${policyId} rejected`);
			loadData();
		} catch (err) {
			message.error('Error occured while approving the Insurance Policy');
		}
	};

	const confirmPaymentFromBank = async (policyId) => {
		try {
			const accounts = await window.ethereum.enable();
			await InsurancePolicyContract.methods.confirmPaymentFromBank(policyId).send({ from: accounts[0] });
			message.success(`Insurance Policy ${policyId} updated`);
			loadData();
		} catch (err) {
			message.error('Error occured while updating the Insurance Policy');
		}
	};

	const closePolicy = async (policyId) => {
		try {
			const accounts = await window.ethereum.enable();
			await InsurancePolicyContract.methods.closePolicy(policyId).send({ from: accounts[0] });
			message.success(`Insurance Policy ${policyId} updated`);
			loadData();
		} catch (err) {
			message.error('Error occured while updating the Insurance Policy');
		}
	};

	const requestClaim = async (policyId) => {
		try {
			const accounts = await window.ethereum.enable();
			await InsurancePolicyContract.methods.requestClaim(policyId).send({ from: accounts[0] });
			message.success('Claim requested successfully');
			loadData();
		} catch (err) {
			message.error('Error occured while requesting claim');
		}
	};

	const approveClaim = async (policyId) => {
		try {
			const accounts = await window.ethereum.enable();
			await InsurancePolicyContract.methods.approveClaim(policyId).send({ from: accounts[0] });
			message.success('Claim approved');
			loadData();
		} catch (err) {
			message.error('Error occured while approving claim');
		}
	};

	const rejectClaim = async (policyId) => {
		try {
			const accounts = await window.ethereum.enable();
			await InsurancePolicyContract.methods.rejectClaim(policyId).send({ from: accounts[0] });
			message.success('Claim rejected');
			loadData();
		} catch (err) {
			message.error('Error occured while rejecting claim');
		}
	};

	const handleCancel = () => {
		setIsBankTransferModalVisible(false);
	};

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
		},
		{
			title: 'Borrower',
			dataIndex: 'borrower',
		},
		{
			title: 'Broker',
			dataIndex: 'broker',
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
			title: 'Loan ID',
			dataIndex: 'loanId',
		},
		{
			title: 'Policy Plan ID',
			dataIndex: 'planId',
		},
		{
			title: 'Insurance Fee',
			dataIndex: 'payment',
		},
		{
			title: 'Status',
			key: 'status',
			dataIndex: 'status',
			render: tag => {
				let color = 'geekblue';
				if (tag === '3' || tag === '7') {
					color = 'red';
				} else if (tag === '2' || tag === '6' || tag === '8') {
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

	const signInsurancePolicy = (policyId) => {
		confirm({
			content: `Are you sure you want to sign this Insurance Policy ${policyId} ?`,
			okText: 'Sign Policy',
			width: 500,
			onOk: () => signPolicyRequest(policyId),
		});
	};

	if (user.role === 'borrower') {
		columns.push({
			title: 'Action',
			dataIndex: '',
			key: '',
			render: (record) => {
				if (record.status === '0') {
					return (
						<Button type="primary" ghost onClick={() => signInsurancePolicy(record.id)}>
							Sign Policy
						</Button>
					);
				}
			},
		});
	}

	if (user.role === 'bank') {
		columns.push({
			title: 'Action',
			dataIndex: '',
			key: '',
			render: (record) => {
				let actionBlock = '';
				if (record.status === '4') {
					actionBlock =
						<Button type="primary" ghost onClick={() => requestClaim(record.id)}>
							Request Claim
						</Button>;
				}
				return actionBlock;
			},
		});
	}

	if (user.role === 'insurance') {
		columns.push({
			title: 'Action',
			dataIndex: '',
			key: '',
			render: (record) => {
				let actionBlock = '';
				if (record.status === '1') {
					actionBlock =
						<Space>
							<Button type="primary" ghost onClick={() => approveInsurancePolicy(record.id)}>Approve</Button>
							<Button type="primary" danger ghost onClick={() => rejectInsurancePolicy(record.id)}>Reject</Button>
						</Space>;
				} else if (record.status === '2') {
					actionBlock =
						<Button type="primary" ghost onClick={() => confirmPaymentFromBank(record.id)}>
							Token Received
						</Button>;
				} else if (record.status === '4') {
					actionBlock =
						<Button type="primary" ghost onClick={() => closePolicy(record.id)}>
							Close Insurance Policy
						</Button>;
				} else if (record.status === '5') {
					actionBlock =
						<Space>
							<Button type="primary" ghost onClick={() => approveClaim(record.id)}>Approve Claim</Button>
							<Button type="primary" danger ghost style={{ color: 'red' }} onClick={() => rejectClaim(record.id)}>Reject Claim</Button>
						</Space>;
				} else if (record.status === '6') {
					actionBlock =
						<Button type="primary" ghost onClick={() => showBankTransferModal(record)}>
							Token Transferred to Bank
						</Button>;
				}
				return actionBlock;
			},
		});
	}

	const expandedRowRender = (record) => {
		const expandedData = [];

		expandedData.push(record);

		const expandedPayments = payments.filter(item => item.policyId == record.id);

		const expandedPaymentColumns = [
			{ title: 'Payment ID', dataIndex: '_id', key: 'id' },
			{ title: 'Amount', dataIndex: 'amount', key: 'amount' },
			{ title: 'Insurance Policy ID', dataIndex: 'policyId', key: 'policyId' },
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
					<Form.Item label="Borrower address" style={{ marginBottom: '0px' }}>
						<span>{record.borrowerAddress}</span>
					</Form.Item>
					<Form.Item label="Broker address" style={{ marginBottom: '0px' }}>
						<span>{record.brokerAddress}</span>
					</Form.Item>
					<Form.Item label="Payment" style={{ marginBottom: '0px' }}>
						<span>{record.payment} (Pay by Bank)</span>
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


	useEffect(() => {
		loadData();
		const emitter = InsurancePolicyContract.events.insurancePolicyRequest({ fromBlock: 'latest' }, (error, response) => {
			const result = response.returnValues;

			const row = {
				key: result.id,
				id: result.id,
				amount: result.amount,
				period: result.months,
				planId: result.planId,
				loanId: result.loanId,
				borrower: borrowers[result.borrower],
				broker: brokers[result.broker],
				brokerAddress: result.broker,
				borrowerAddress: result.borrower,
				payment: result.payment,
				status: result.state,
				borrowerSigned: result.isBorrowerSigned,
				insuranceApprove: result.insuranceApprove,
			};

			setData((prev) => {
				return [...prev, row];
			});
		});

		return () => {
			emitter.unsubscribe();
		};
	}, []);

	return (
		<>
			<Card title="Current Policies" extra={<Button type="primary" ghost onClick={loadData}>Refresh</Button>}>
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
				title={`Transfer Tokens to Bank - Policy Id ${policyRecord.id}`}
				visible={isBankTransferModalVisible}
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
						<Form.Item label="Amount" style={{ marginBottom: '0px' }}>
							<span> { policyRecord.amount } </span>
						</Form.Item>
						<Form.Item label="Bank Address">
							<span> {bankAddress} </span>
						</Form.Item>
						<Form.Item wrapperCol={{
							lg: { span: 14, offset: 6 },
							xl: { span: 14, offset: 5 },
							xxl: { span: 14, offset: 5 } }}
						>
							<Space direction="horizontal">
								<Button onClick={() => handleCancel()}>Cancel</Button>
								<Button type="primary" onClick={() => transferTokensToBank()}>Transfer Tokens</Button>
							</Space>
						</Form.Item>
					</Form>
				}
				{
					tokenTransferStep === 1 &&
					<span>Updating Insurance Policy State</span>
				}
			</Modal>
		</>
	);
}

export default PoliciesTable;
