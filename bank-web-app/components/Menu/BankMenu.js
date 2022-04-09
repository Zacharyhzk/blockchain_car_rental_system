import React from 'react';
import 'antd/dist/antd.css';
import { Menu } from 'antd';

import { useRouter } from 'next/router';

function BankMenu() {
	const router = useRouter();
	const { SubMenu } = Menu;

	return (
		<Menu
			mode="inline"
			defaultSelectedKeys={['/bank-loans']}
			style={{ height: '100%', borderRight: 0 }}
		>
			<Menu.Item key="/bank-loans" onClick={() => router.push('/common/loans')}>
				Loans
			</Menu.Item>
			<Menu.Item key="/plans" onClick={() => router.push('/bank/plans')}>
				Loan Plans
			</Menu.Item>
			<SubMenu key="/users" title="Users">
				<Menu.Item key="/brokers" onClick={() => router.push('/bank/manage-brokers')}>
					Brokers
				</Menu.Item>
				<Menu.Item key="/borrowers" onClick={() => router.push('/bank/manage-borrowers')}>
					Borrowers
				</Menu.Item>
				<Menu.Item key="/insurance-company" onClick={() => router.push('/bank/manage-insurance-company')}>
					Insurance Co.
				</Menu.Item>
			</SubMenu>
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
