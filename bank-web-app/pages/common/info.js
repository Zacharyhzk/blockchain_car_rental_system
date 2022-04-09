import React from 'react';
import { Row, Col } from 'antd';
import TokenInfo from '../../components/info/TokenInfo';

function Info() {
	return (
		<>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<TokenInfo />
				</Col>
			</Row>
		</>
	);
}

export default Info;
