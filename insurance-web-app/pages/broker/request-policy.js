import React from 'react';
import { Row, Col } from 'antd';
import PlansTable from '../../components/plans/PlansTable';
import CreateInsurancePolicy from '../../components/policy/CreateInsurancePolicy'

function RequestPolicy() {
	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				<CreateInsurancePolicy />
			</Col>
			<Col span={24}>
				<PlansTable />
			</Col>
		</Row>
	)
}

export default RequestPolicy;
