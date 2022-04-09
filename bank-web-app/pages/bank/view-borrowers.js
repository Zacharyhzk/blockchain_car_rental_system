import React from 'react';
import { Row, Col } from 'antd';
import BorrowersTable from '../../components/userManagement/BorrowersTable';

// React functional component display the borrowers table.
function ViewBorrowers() {
	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				<BorrowersTable />
			</Col>
		</Row>
	);
}

export default ViewBorrowers;
