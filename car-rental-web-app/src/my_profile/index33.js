import React, { useContext } from "react";
import "antd/dist/antd.css";
import { useHistory } from "react-router";
import { Layout, Row, Col, Typography, Avatar, Select, Menu } from "antd";

import { UserOutlined } from "@ant-design/icons";

import styles from "./index.css";
// import BrokerMenu from './menu/BrokerMenu';
// import BankMenu from './menu/BankMenu';
// import BorrowerMenu from './menu/BorrowerMenu';
// import UserContext from '../stores/userContext';
// import GuestMenu from './menu/GuestMenu';

function BasicLayout({ children }) {
//   const router = useRouter();
  const history = useHistory();
  const { Title } = Typography;
  const { Option } = Select;

  // const { user, login } = useContext(UserContext);

  const { Header, Sider } = Layout;
  const logOut = () => {
    localStorage.setItem("Token", "");
    localStorage.setItem("username", "");
    window.dispatchEvent(new Event("storage"));
    history.push("/");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* <Header className="header" style={{ backgroundColor: 'purple', maxHeight: 50 }}> */}
      <div className="professorNav">
        <span className="logOut" onClick={logOut}>
          Log out
        </span>
        <span
          className="returnDashboard"
          onClick={() => history.push("/dashboard")}
        >
          Dashboard
        </span>
      </div>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={["/bank-loans"]}
            style={{ height: "100%", borderRight: 0 }}
          >
            <Menu.Item
              key="/bank-loans"
              onClick={() => history.push("/dashboard")}
            >
              Loans
            </Menu.Item>
            <Menu.Item key="/plans" 
            // onClick={() => router.push("/bank/plans")}
            >
              Loan Plans
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: "16px" }}>{children}</Layout>
      </Layout>
    </Layout>
  );
}

export default BasicLayout;
