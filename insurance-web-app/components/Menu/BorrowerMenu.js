import React from 'react';
import 'antd/dist/antd.css';
import { Menu } from 'antd';

import { useRouter } from 'next/router';

function BankMenu() {
	const router = useRouter();

	return (
		<Menu
			mode="inline"
			defaultSelectedKeys={['/policies']}
			style={{ height: '100%', borderRight: 0 }}
		>
			<Menu.Item key="/policies" onClick={() => router.push('/common/policies')}>
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

export default BankMenu;
