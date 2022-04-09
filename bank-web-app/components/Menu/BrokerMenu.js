import React from 'react';
import 'antd/dist/antd.css';
import { Menu } from 'antd';

import { useRouter } from 'next/router';

// Menu for Brokers
function BrokerMenu() {
	const router = useRouter();

	return (
		<Menu
			mode="inline"
			defaultSelectedKeys={['/transfer']}
			style={{ height: '100%', borderRight: 0 }}
		>
			<Menu.Item key="/transfer" onClick={() => router.push('/public/transfer')}>
				Transfer
			</Menu.Item>
			<Menu.Item key="/apply-loans" onClick={() => router.push('/broker/apply-loans')}>
				Apply Loan
			</Menu.Item>
			<Menu.Item key="/view-loans" onClick={() => router.push('/common/loans')}>
				Loans
			</Menu.Item>
			<Menu.Item key="/info" onClick={() => router.push('/common/info')}>
				Info
			</Menu.Item>
		</Menu>
	);
}

export default BrokerMenu;
