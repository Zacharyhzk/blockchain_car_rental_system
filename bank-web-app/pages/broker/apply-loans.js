import React from 'react';
import { Row, Col } from 'antd';
import LoanForm from '../../components/loan/LoanForm';
import PlansTable from '../../components/plan/PlansTable';

// React functional component display loan application form and loan plans table
function ApplyLoans() {
	return (
		<>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<LoanForm />
				</Col>
				<Col span={24}>
					<PlansTable />
				</Col>
			</Row>
		</>
	);
}

export default ApplyLoans;
