import React from 'react';
import { Row, Col } from 'antd';
import BrokerRegistrationForm from '../../components/userManagement/BrokerRegistrationForm';

function RegisterBroker() {
	return (
		<>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<BrokerRegistrationForm />
				</Col>
			</Row>
		</>
	);
}

export default RegisterBroker;
