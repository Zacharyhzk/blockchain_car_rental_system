import React from 'react';
import 'antd/dist/antd.css';
import { Menu } from 'antd';

import { useRouter } from 'next/router';

function BrokerMenu() {
	const router = useRouter();

	return (
		<Menu
			mode="inline"
			defaultSelectedKeys={['/req-policy']}
			style={{ height: '100%', borderRight: 0 }}
		>
			<Menu.Item key="/req-policy" onClick={() => router.push('/broker/request-policy')}>
				Request Policy
			</Menu.Item>
			<Menu.Item key="/view-policies" onClick={() => router.push('/common/policies')}>
				Policies
			</Menu.Item>
			<Menu.Item key="/transfer" onClick={() => router.push('/common/transfer')}>
				Transfer
			</Menu.Item>
			<Menu.Item key="/info" onClick={() => router.push('/common/info')}>
				Info
			</Menu.Item>
		</Menu>
	);
}

export default BrokerMenu;
