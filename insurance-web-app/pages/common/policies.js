import React from 'react';
import { Row, Col } from 'antd';
import PoliciesTable from '../../components/policy/PoliciesTable';

function Policies() {
	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				<PoliciesTable />
			</Col>
		</Row>
	);
}

export default Policies;
