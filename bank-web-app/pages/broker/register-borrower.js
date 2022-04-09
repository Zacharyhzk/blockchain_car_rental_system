import React from 'react';
import { Row, Col } from 'antd';
import BorrowerRegistrationForm from '../../components/userManagement/BorrowerRegistrationForm';

function RegisterBorrower() {
	return (
		<>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<BorrowerRegistrationForm />
				</Col>
			</Row>
		</>
	);
}

export default RegisterBorrower;
