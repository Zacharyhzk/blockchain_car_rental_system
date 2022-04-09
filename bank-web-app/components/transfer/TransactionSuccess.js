import React from 'react';
import { Button, Result, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

function TransactionSuccess({ address, amount, transactionHash, backToHome }) {
	const { Paragraph, Text } = Typography;

	return (
		<>
			<Result
				status="success"
				title="Transaction successful!"
				extra={[
					<Button type="primary" key="home" onClick={(e) => backToHome(e)}>
						Done
					</Button>,
				]}
			/>
			<Paragraph>
				<Text
					strong
					style={{
						fontSize: 16,
					}}
				>
					Transaction receipt
				</Text>
			</Paragraph>
			<Paragraph>
				<CheckCircleOutlined style={{ color: 'green' }} /> Receiver address: {address}
			</Paragraph>
			<Paragraph>
				<CheckCircleOutlined style={{ color: 'green' }} /> Amount: {amount}
			</Paragraph>
			<Paragraph>
				<CheckCircleOutlined style={{ color: 'green' }} /> Transaction hash: {transactionHash}
			</Paragraph>

		</>

	);
}

export default TransactionSuccess;
