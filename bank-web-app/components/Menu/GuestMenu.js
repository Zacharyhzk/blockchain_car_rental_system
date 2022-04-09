import React from 'react';
import 'antd/dist/antd.css';
import { Menu } from 'antd';

import { useRouter } from 'next/router';

function GuestMenu() {
	const router = useRouter();
	const { SubMenu } = Menu;

	return (
		<Menu
			mode="inline"
			defaultSelectedKeys={['/register-broker']}
			defaultOpenKeys={['register']}
			style={{ height: '100%', borderRight: 0 }}
		>
			<SubMenu key="register" title="Register as">
				<Menu.Item key="/register-broker" onClick={() => router.push('/guest/register-broker')}>Broker</Menu.Item>
				<Menu.Item key="/register-insurance" onClick={() => router.push('/guest/register-insurance')}>Insurance Co.</Menu.Item>
			</SubMenu>
			<Menu.Item key="/info" onClick={() => router.push('/common/info')}>
				Info
			</Menu.Item>
		</Menu>
	);
}

export default GuestMenu;
