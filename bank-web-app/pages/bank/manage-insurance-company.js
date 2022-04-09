import React from 'react';
import { Row, Col } from 'antd';
import InsuranceCompanyTable from '../../components/userManagement/InsuranceCompanyTable';

function ManageInsuranceCompanies() {
	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				<InsuranceCompanyTable />
			</Col>
		</Row>
	);
}

export default ManageInsuranceCompanies;
