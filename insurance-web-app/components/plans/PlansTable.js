import React, { useState, useContext, useEffect } from 'react';
import { Table, Form, InputNumber, Card, Divider, Modal, Button, message, Space } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { getApi, patchApi, deleteApi } from '../../util/fetchApi';
import UserContext from '../../stores/userContext';

function PlansTable({ togglePlan }) {
	const { user } = useContext(UserContext);
	const [data, setData] = useState('');

	const { confirm } = Modal;

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [id, setId] = useState('');
	const [amount, setAmount] = useState('');
	const [period, setPeriod] = useState('');
	const [payment, setPayment] = useState('');


	const fetchPolicyPlans = async () => {
		try {
			const response = await getApi({
				url: 'policy-plans',
			});

			const plans = await response;
			setData([]);
			console.log(response);
			console.log(plans);
			for (let i = 0; i < plans.length; i++) {
				const row = {
					key: plans[i]._id,
					id: plans[i]._id,
					amount: plans[i].loanAmount,
					period: plans[i].months,
					payment: plans[i].payment,
				};

				setData((prev) => {
					return [...prev, row];
				});
			}
		} catch (err) {
			console.log(err);
			message.error('Error occured while loading Insurance Policy Plans');
		}
	};

	const fetchPlanById = async (planId) => {
		try {
			const response = await getApi({
				url: 'policy-plans/' + planId,
			});

			const plan = await response;
			setId(plan._id);
			setAmount(plan.loanAmount);
			setPeriod(plan.months);
			setPayment(plan.payment);
		} catch (err) {
			console.log(err);
			message.error('Error occured while loading Loan Plan');
		}
	};

	const showModal = (value) => {
		fetchPlanById(value);
		setIsModalVisible(true);
	};

	const deletePlan = (planId) => {
		confirm({
			icon: <CloseCircleOutlined style={{ color: 'red' }} />,
			content: `Delete Insurance Polict Plan ${planId}`,
			onOk: async () => {
				try {
					const response = await deleteApi({
						url: 'policy-plans/' + planId,
					});
					if (response.status === 200) {
						await message.success('Sucsessfully delete the Insurance Policy Plan');
						fetchPolicyPlans();
					} else {
						message.error('Error occured while deleting Insurance Policy Plan');
					}
				} catch (err) {
					console.log(err);
					message.error('Error occured while deleting Insurance Policy Plan');
				}
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	};

	const handleOk = async () => {
		setIsModalVisible(false);

		try {
			const body = {
				loanAmount: amount,
				months: period,
				payment,
			};

			const requestOptions = {
				// method: 'PATCH',
				body: JSON.stringify(body),
			};

			const response = await patchApi({
				url: 'policy-plans/' + id,
				options: requestOptions,
			});

			const result = await response;

			message.success('Insurance Policy Plan updated successfully');
			fetchPolicyPlans();
		} catch (err) {
			message.error('Error while updating the Insurance Policy Plan');
			console.log(err);
		}
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	useEffect(() => {
		fetchPolicyPlans();
	}, [togglePlan]);

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
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
			title: 'Insurance Fee',
			dataIndex: 'payment',
		},
	];

	if (user.role === 'insurance') {
		columns.push({
			title: 'Action',
			dataIndex: '',
			render: (record) => (
				<Space>
					<Button type="primary" ghost onClick={() => showModal(record.id)}>Edit</Button>
					<Button type="primary" danger ghost onClick={() => deletePlan(record.id)} style={{ color: 'red' }}>Delete</Button>
				</Space>
			),
		});
	}

	return (
		<>
			<Card title="Insurance Policy Plans" extra={<Button type="primary" ghost onClick={fetchPolicyPlans}>Refresh</Button>}>
				<Table columns={columns} dataSource={data} />
			</Card>
			<Modal
				title="Edit Insurance Policy Plan"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={[
					<Button key="back" onClick={handleCancel}>
						Cancel
					</Button>,
					<Button key="submit" type="primary" onClick={handleOk}>
						Save Changes
					</Button>,
				]}
			>
				<Form
					labelCol={{
						span: 6,
					}}
					wrapperCol={{
						span: 18,
					}}
					layout="horizontal"
					size="default"
				>
					<Form.Item label="Id">
						<span className="ant-form-text">{id}</span>
					</Form.Item>
					<Form.Item label="Loan Amount">
						<InputNumber
							min="0"
							style={{ width: '100%' }}
							placeholder="Enter Loan amount"
							value={amount}
							onChange={(e) => setAmount(e)}
						/>
					</Form.Item>
					<Form.Item label="Loan Duration">
						<InputNumber
							min="0"
							style={{ width: '100%' }}
							placeholder="Enter Loan duration"
							value={period}
							onChange={(e) => setPeriod(e)}
						/>
					</Form.Item>
					<Form.Item label="Payment">
						<InputNumber
							min="0"
							style={{ width: '100%' }}
							placeholder="Enter Insurance payment"
							value={payment}
							onChange={(e) => setPayment(e)}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
}

export default PlansTable;
