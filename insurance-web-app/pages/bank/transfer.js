import React from 'react';
import { Row, Col } from 'antd';
import TransferController from '../../components/transfer/TransferController';
import PolicyPaymentForm from '../../components/payment/PolicyPaymentForm';

function Transfer() {
	return (
		<>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<TransferController />
				</Col>
				<Col span={24}>
					<PolicyPaymentForm />
				</Col>
			</Row>
		</>
	);
}

export default Transfer;
