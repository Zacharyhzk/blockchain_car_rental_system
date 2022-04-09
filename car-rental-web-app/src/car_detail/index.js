import './index.css';
import { useHistory } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { Card, Avatar, Button, Modal } from 'antd';
import * as images from '../images/index.js';
import { PayCircleOutlined, CheckCircleOutlined, CloseOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import Rent_form from './Rent_Form/rent_form';


const { Meta } = Card;
function Rent_Car(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    let { id, carBrand, carType, image, plateNumber,
        Deposit, Rental, Availability, Description } = props.location.state;
    let history = useHistory();
    let img = images[image];
    let Form;
    let wallet_address = '';
    let from_to_end = [];
   // let myRef = useRef();

    const logOut = () => {
        localStorage.setItem('Token', '')
        localStorage.setItem('username', '')
        window.dispatchEvent(new Event('storage'))
        history.push("/")
    }

    const showModal = () => {
        setIsModalVisible(true);
    }

    const handleOk = () => {
        if(wallet_address==='') {
             alert('please input')
             return;
        }
        if(!from_to_end.length) {
            alert('please select date')
            return;
        }
        Form.getFieldsValue();
        console.log(Form.getFieldsValue());
        console.log(wallet_address);
        console.log(from_to_end);
        Form.resetFields();
        setTimeout(()=>{
            setIsModalVisible(false);
        },1000)
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    }

    let title = (
        <div style={{ fontSize: '18px' }}>
            <span>Car Brand:</span>&nbsp;
            <span>{carBrand}</span>
        </div>
    )
    let description = (
        <div >
            <p>Car License Plate Number: {plateNumber}</p >
            <p>Car Type: {carType} </p >
            <p>Rental Fee: {Rental}/per day </p >
            <p>Deposit: {Deposit} </p >
            <p>Description: {Description} </p>
            <p>Car Avialability: &nbsp;
                {Availability === 1 ? <CheckCircleOutlined style={{ color: 'green', fontSize: '14px' }} />
                    : <CloseOutlined style={{ color: 'red', fontSize: '14px' }} />}</p >
        </div>
    )
    let action = (
        <div>
            {Availability === 1 ? <Button onClick={showModal} block="true" type="primary" icon={<SafetyCertificateOutlined />}>Rent</Button> :
                <Button block="true" type="primary" disabled="true" icon={<CloseOutlined />}>UnAvailable</Button>}
        </div>
    );
    let actions = [action];

    return (
        <div className="professorContainer">
            <div className="professorNav">
                <span className="logOut" onClick={logOut}>
                    Log out
                </span>
                <span className="returnDashboard" onClick={() => history.push("/dashboard")}>
                    Dashboard
                </span>
            </div>
            <Card
                style={{ width: '300px', margin: '10px auto' }}
                cover={
                    <img src={img}
                        alt="example"
                        style={{ width: '300px', height: '200px' }}
                    />
                }
                actions={actions}
            >
                <Meta
                    title={title}
                    description={description}
                />
            </Card>
            <Modal title="Basic Modal" visible={isModalVisible}
                onOk={handleOk} onCancel={handleCancel}
                footer={
                    [
                        <Button key="back" type="primary" onClick={handleOk}>
                            Confirm
                        </Button>,
                        <Button key="submit" onClick={handleCancel}>
                            Cancel
                        </Button>,
                    ]
                }
            >
              <Rent_form {...props.location.state} setForm={(form)=>{Form=form}}
                     setAddress={(addr)=>{wallet_address=addr}}
                     setDate = {(date)=>{from_to_end=date}}               
              />
            </Modal>
        </div>
    );
}

export default Rent_Car;