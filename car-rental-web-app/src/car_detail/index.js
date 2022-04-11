import "./index.css";
import { useHistory } from "react-router";
import { useEffect, useRef, useState, useContext } from "react";
import { Card, Avatar, Button, Modal } from "antd";
// import * as images from "../images/index.js";
import {
  PayCircleOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import Rent_form from "./Rent_Form/rent_form";
import SmartContractContext from "../stores/smartContractContext";
import { message } from "antd";

const { Meta } = Card;
function Rent_Car(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  let {
    carId,
    carBrand,
    carType,
    // image,
    carVin,
    Deposit,
    carPrice,
    carAvailable,
    carDescription,
  } = props.location.state;
  let history = useHistory();
  // let img = images[image];
  let Form;
  let wallet_address = "";
  let from_to_end = [];
  // let myRef = useRef();
  let record = JSON.parse(localStorage.getItem("record"));
  let userName = localStorage.getItem("userName");
  const { CarRentalContract, MicroTokenContract } =
    useContext(SmartContractContext);
  const clickEntry = async (values) => {
    try {
      let temp = {
        carId: carId,
        carBrand: carBrand,
        carDescription: carDescription,
        carVin: values.carVin,
        carAvailable: carAvailable === true ? false : true,
        carPrice: carPrice,
        walletAddress: values.Wallet_Address,
        duration: values.duration,
        fee: values.Rent_Fee,
      };
      //   debugger
      record.push(temp);
      // localStorage.setItem("record", JSON.stringify(record));
      const accounts = await window.ethereum.enable();
      console.log("12344", accounts);
      // await MicroTokenContract.methods.transfer('0x611028530093a8F8dB8b501304f220fCbCDe90bB', 12).send({
      // 	from: accounts[0] });
      // await CarRentalContract.methods.applyCar(values.Wallet_Address, values.Total_Deposit).send({
      // from: accounts[0] });
      await CarRentalContract.methods
        .applyCar(
          carId,
          userName,
          1234,
          4567,
          values.duration,
          values.Rent_Fee
        )
        .send({
          from: accounts[0],
        });
      message.success("Apply Car Info Successfully");
      console.log("234");
    } catch (err) {
      debugger;
      console.log("22", err);
      message.error("Error Add Car Info");
    }
  };

  const logOut = () => {
    // localStorage.setItem("Token", "");
    // localStorage.setItem("username", "");
    // window.dispatchEvent(new Event("storage"));
    history.push("/dashboard");
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    await clickEntry(Form.getFieldsValue());
    Form.resetFields();
    setIsModalVisible(false);
    //  let arr = JSON.parse(localStorage.getItem('storage'));
    //  console.log(arr);
    //  let target = arr.find((item)=>{
    //            return item.carId===carId
    //   });
    //  console.log(target);
    //  target.carAvailable = target.carAvailable===true?false:true;
    //  localStorage.setItem("storage",JSON.stringify(arr));
    history.push("/dashboard");

    // if (wallet_address === "") {
    //   alert("please input");
    //   return;
    // }
    // if (!from_to_end.length) {
    //   alert("please select date");
    //   return;
    // }
    // Form.getFieldsValue();
    // console.log(Form.getFieldsValue());
    // console.log(wallet_address);
    // console.log(from_to_end);
    // Form.resetFields();
    // setTimeout(() => {
    //   setIsModalVisible(false);
    // }, 1000);
  };

  const handleCancel = () => {
    Form.resetFields();
    setIsModalVisible(false);
  };

  let title = (
    <div style={{ fontSize: "18px" }}>
      <span>Car Brand:</span>&nbsp;
      <span>{carBrand}</span>
    </div>
  );
  let description = (
    <div>
      <p>Car License Plate Number: {carVin}</p>
      {/* <p>Car Type: {carType} </p> */}
      <p>Rental Fee: {carPrice}/per day </p>
      {/* <p>Deposit: {Deposit} </p> */}
      <p>Description: {carDescription} </p>
      <p>
        Car Avialability: &nbsp;
        {carAvailable === true ? (
          <CheckCircleOutlined style={{ color: "green", fontSize: "14px" }} />
        ) : (
          <CloseOutlined style={{ color: "red", fontSize: "14px" }} />
        )}
      </p>
    </div>
  );
  let action = (
    <div>
      {carAvailable === true ? (
        <Button
          onClick={showModal}
          block="true"
          type="primary"
          icon={<SafetyCertificateOutlined />}
        >
          Rent
        </Button>
      ) : (
        <Button
          block="true"
          type="primary"
          disabled="true"
          icon={<CloseOutlined />}
        >
          UnAvailable
        </Button>
      )}
    </div>
  );
  let actions = [action];

  return (
    <div className="professorContainer">
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
      <Card
        style={{ width: "300px", margin: "10px auto" }}
        // cover={
        //   <img
        //     src={img}
        //     alt="example"
        //     style={{ width: "300px", height: "200px" }}
        //   />
        // }
        actions={actions}
      >
        <Meta title={title} description={description} />
      </Card>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" type="primary" onClick={handleOk}>
            Confirm
          </Button>,
          <Button key="submit" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <Rent_form
          {...props.location.state}
          setForm={(form) => {
            Form = form;
          }}
          setAddress={(addr) => {
            wallet_address = addr;
          }}
          setDate={(date) => {
            from_to_end = date;
          }}
        />
      </Modal>
    </div>
  );
}

export default Rent_Car;
