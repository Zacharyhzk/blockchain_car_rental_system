import React from 'react';
import { Row, Col } from 'antd';
import BrokersTable from '../../components/userManagement/BrokersTable';

function ManageBrokers() {
	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				<BrokersTable />
			</Col>
		</Row>
	);
}

export default ManageBrokers;
