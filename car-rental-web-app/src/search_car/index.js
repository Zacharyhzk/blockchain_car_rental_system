import { useState, useContext } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import CarEntryCard from "./car_entrycard";
import "./index.css";
import SmartContractContext from "../stores/smartContractContext";
import { message, Button, Modal } from "antd";
import Rent_form from "./car_add_modal/rent_form";

function ProfList() {
  const { CarRentalContract, MicroTokenContract } =
    useContext(SmartContractContext);
  let userType = localStorage.getItem("userType");
  let Form;
  // let storage = JSON.parse(localStorage.getItem("storage"));
  const [carList, setCarList] = useState([]);
  // let carList = [];
  // let newCarList = [];
  const clickEntry = async (values) => {
    try {
      let temp = {
        carId: values.carId,
        carBrand: values.carBrand,
        carDescription: values.carDescription,
        carVin: values.carVin,
        carSeat: values.carSeat,
        carAvailable: values.carAvailable,
        carPrice: values.carPrice,
      };
      // storage.push(temp);
      // localStorage.setItem("storage", JSON.stringify(storage));
      const accounts = await window.ethereum.enable();
      console.log("12344", accounts);
      console.log(CarRentalContract._address);
      await CarRentalContract.methods
        .addCarInfo(
          values.carId,
          values.carBrand,
          values.carDescription,
          values.carVin,
          values.carSeat,
          values.carAvailable == "1"? true: false,
          values.carPrice,
          CarRentalContract._address
        )
        .send({
          from: accounts[0],
        });

      // const response =  MicroTokenContract.methods.balanceOf(accounts[0]).call();
      // console.log("MicroTokenContract balance", response);
      // const a = CarRentalContract.methods.getAllCars().call();
      // setCars(a);
      // console.log("carstest11111", a);
      // console.log("carstest11111", cars);
      // const renters = CarRentalContract.methods.getAllCars().call();
      // console.log("carstest11111", cars);
      message.success("Add Car Info Successfully");
    } catch (err) {
      debugger;
      console.log("22", err);
      message.error("Error Add Car Info");
    }
  };

  let history = useHistory();
  // console.log("all car", CarRentalContract.methods.getAllCars().call())
  useEffect(async () => {
    try {
      let temp = await CarRentalContract.methods.getAllCars().call();
      setCarList(temp);
      console.log("cars", temp);
    } catch (err) {
      // debugger;
      console.log("22", err);
      message.error("Error Get All Car Info");
    }
  }, []);

  const logOut = () => {
    // localStorage.setItem("Token", "");
    // localStorage.setItem("username", "");
    // window.dispatchEvent(new Event("storage"));
    history.push("/");
  };

  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    try {
      // console.log(Form.getFieldsValue(),"123")
      clickEntry(Form.getFieldsValue());
      Form.resetFields();
      setVisible(false);
      history.push("/dashboard");
    } catch (err) {
      history.push("/dashboard");
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
  };

  return (
    <div className="searchCar">
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
      {userType == "admin" ? (
        <>
          <Button
            type="primary"
            style={{ display: "block", margin: "20px auto 0 auto" }}
            onClick={showModal}
          >
            Add New Car
          </Button>
          <Modal
            title="Add A New Car"
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <Rent_form
              setForm={(form) => {
                Form = form;
              }}
            />
          </Modal>
        </>
      ) : (
        <div></div>
      )}
      <ul className="carList">
        {carList.map((car) => {
          return <CarEntryCard {...car} />;
        })}
      </ul>
      <div></div>
    </div>
  );
}

export default ProfList;
