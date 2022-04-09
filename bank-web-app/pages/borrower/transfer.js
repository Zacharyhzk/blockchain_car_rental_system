import React from 'react';
import { Row, Col } from 'antd';
import TransferController from '../../components/transfer/TransferController';
import LoanPaymentForm from '../../components/payment/LoanPaymentForm';

// React functional component display to display transfer forma and loan payment form
function Transfer() {
	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				<TransferController />
			</Col>
			<Col span={24}>
				<LoanPaymentForm />
			</Col>
		</Row>
	);
}

export default Transfer;
