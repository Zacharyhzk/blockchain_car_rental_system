import React, { useContext } from 'react';
import 'antd/dist/antd.css';

import { Layout, Row, Col, Typography, Avatar, Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import styles from './BasicLayout.module.css';
import BrokerMenu from './menu/BrokerMenu';
import BankMenu from './menu/BankMenu';
import BorrowerMenu from './menu/BorrowerMenu';
import UserContext from '../stores/userContext';

// React functional component to define the layout of the bank web app.
function BasicLayout({ children }) {
	const { Title } = Typography;
	const { Option } = Select;

	const { user, login } = useContext(UserContext); // Get the user and login context values from the userContext.

	const { Header, Sider } = Layout;

	return (
		<Layout style={{ minHeight: '100vh' }}>
			{/* Header section. Purple bar with site name and user name. */}
			<Header className="header" style={{ backgroundColor: 'purple', maxHeight: 50 }}>
				<Row>
					<Col span={17}>
						<div className="logo" style={{ float: 'left' }}>
							<Title level={4} style={{ color: 'white', marginTop: 10, fontWeight: 300 }}>Microfinance - Bank UI</Title>
						</div>
					</Col>
					<Col span={4}>
						<div className={styles.profile} style={{ maxHeight: 45, float: 'right' }}>
							<Avatar style={{ backgroundColor: user.color }} size="small" icon={<UserOutlined />} />
							<span style={{ color: 'white', margin: '0px 10px', fontSize: 20, fontWeight: 200 }}>{user.name}</span>
						</div>
					</Col>
					<Col span={3}>
						<Select
							size="small"
							defaultValue={user.role}
							style={{ width: 110, backgroundColor: 'black', float: 'left', marginTop: 12, marginLeft: 10 }}
							onChange={login}
						>
							<Option value="bank">Bank</Option>
							<Option value="broker">Broker</Option>
							<Option value="borrower">Borrower</Option>
						</Select>
					</Col>
				</Row>
			</Header>
			<Layout>
				{/* Side bar to render the menu according to the selected user role. */}
				<Sider width={200} className="site-layout-background">
					{user.role === 'broker' && <BrokerMenu /> }
					{user.role === 'bank' && <BankMenu /> }
					{user.role === 'borrower' && <BorrowerMenu /> }
				</Sider>
				{/* Main content area. React components will render in to this area. */}
				<Layout style={{ padding: '16px' }}>
					{children}
				</Layout>
			</Layout>
		</Layout>
	);
}

export default BasicLayout;
