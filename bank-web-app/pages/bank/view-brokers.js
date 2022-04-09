import React from 'react';
import { Row, Col } from 'antd';
import BrokersTable from '../../components/userManagement/BrokersTable';

// React functional component display the brokers table.
function ViewBrokers() {
	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				<BrokersTable />
			</Col>
		</Row>
	);
}

export default ViewBrokers;
