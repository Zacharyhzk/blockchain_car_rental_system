import React from 'react';
import { Row, Col } from 'antd';
import LoansTable from '../../components/loan/LoansTable';

// React functional component display loans table
function Loans() {
	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				<LoansTable />
			</Col>
		</Row>
	);
}

export default Loans;
