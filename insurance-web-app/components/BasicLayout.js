import React, { useContext } from 'react';
import 'antd/dist/antd.css';
import { Layout, Row, Col, Typography, Avatar, Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './BasicLayout.module.css';
import BrokerMenu from './menu/BrokerMenu';
import BorrowerMenu from './menu/BorrowerMenu';
import InsuranceMenu from './menu/InsuranceMenu';
import BankMenu from './menu/BankMenu';
import UserContext from '../stores/userContext';

function BasicLayout({ children }) {
	const { Title } = Typography;
	const { Option } = Select;

	const { user, login } = useContext(UserContext);

	const { Header, Sider } = Layout;

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Header className="header" style={{ backgroundColor: '#FF8B00', maxHeight: 50 }}>
				<Row>
					<Col span={17}>
						<div className="logo" style={{ float: 'left' }}>
							<Title level={4} style={{ color: 'white', marginTop: 10, fontWeight: 300 }}>Microfinance - Insurance Company UI</Title>
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
							style={{ width: 130, backgroundColor: 'black', float: 'left', marginTop: 12, marginLeft: 10 }}
							onChange={login}
						>
							<Option value="insurance">Insurance Co.</Option>
							<Option value="broker">Broker</Option>
							<Option value="borrower">Borrower</Option>
							<Option value="bank">Bank</Option>
						</Select>
					</Col>
				</Row>
			</Header>
			<Layout>
				<Sider width={200} className="site-layout-background">
					{user.role === 'broker' && <BrokerMenu /> }
					{user.role === 'bank' && <BankMenu /> }
					{user.role === 'borrower' && <BorrowerMenu />}
					{user.role === 'insurance' && <InsuranceMenu /> }
				</Sider>
				<Layout style={{ padding: '16px' }}>
					{children}
				</Layout>
			</Layout>
		</Layout>
	);
}

export default BasicLayout;
