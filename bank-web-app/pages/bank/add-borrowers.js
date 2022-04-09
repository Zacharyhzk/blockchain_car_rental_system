import React from 'react';
import { Row, Col } from 'antd';
import CreateBorrowerForm from '../../components/userManagement/BorrowerRegistrationForm';

// React coponent to render Broker creation form.
function AddBorrower() {
	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				<CreateBorrowerForm />
			</Col>
		</Row>
	);
}

export default AddBorrower;
