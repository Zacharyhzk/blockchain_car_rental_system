import React from 'react';
import { Row, Col } from 'antd';
import InsuranceRegistrationForm from '../../components/userManagement/InsuranceRegistrationForm';

function RegisterInsuranceCompany() {
	return (
		<>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<InsuranceRegistrationForm />
				</Col>
			</Row>
		</>
	);
}

export default RegisterInsuranceCompany;
