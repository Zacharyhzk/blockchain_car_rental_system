import { useState, useContext } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import CarEntryCard from "./car_entrycard";
import "./index.css";
import SmartContractContext from "../stores/smartContractContext";
import { message, Button, Modal } from "antd";
import Rent_form from "./car_add_modal/rent_form";

function ProfList() {
  const { CarRentalContract } = useContext(SmartContractContext);
  let userType = localStorage.getItem("userType");
  let Form;
  let storage = JSON.parse(localStorage.getItem("storage"));
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
      storage.push(temp);
      localStorage.setItem("storage", JSON.stringify(storage));
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
          values.carAvailable,
          values.carPrice,
          CarRentalContract._address
        )
        .send({
          from: accounts[0],
        });
      message.success("Add Car Info Successfully");
      console.log("234");
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
      await CarRentalContract.methods.getAllCars();

      console.log(CarRentalContract.methods.getAllCars(), "234");
    } catch (err) {
      debugger;
      console.log("22", err);
      message.error("Error Get All Car Info");
    }
  }, []);

  const [carList, setCarList] = useState(
    JSON.parse(localStorage.getItem("storage"))
  );

  // useEffect( ()=>{
  //   setCarList(JSON.parse(localStorage.getItem("storage")))
  // },[carList])

  // const [carList, setCarList] = useState([
  //   {
  //     id: 1,
  //     carBrand: "Kia",
  //     carType: "1",
  //     image: "img1",
  //     plateNumber: "SLB1231",
  //     Deposit: "S$10",
  //     Rental: "2S$",
  //     Availability: 0,
  //     Description: "Mass-Market Cars",
  //   },
  //   {
  //     id: 2,
  //     carBrand: "Chang AN X7",
  //     carType: 2,
  //     image: "img2",
  //     plateNumber: "SLB121",
  //     Deposit: "S$5",
  //     Rental: "3S$",
  //     Availability: 1,
  //     Description: "Mass-Market Cars",
  //   },
  //   {
  //     id: 3,
  //     carBrand: "Tesla",
  //     carType: "3",
  //     image: "img3",
  //     plateNumber: "SZB1431",
  //     Deposit: "S$6",
  //     Rental: "4S$",
  //     Availability: 0,
  //     Description: "Luxury Electric Vehicles",
  //   },
  //   {
  //     id: 4,
  //     carBrand: "Suzuki--x",
  //     carType: "4",
  //     image: "img4",
  //     plateNumber: "SDB3431",
  //     Deposit: "S$4",
  //     Rental: "6S$",
  //     Availability: 1,
  //     Description: "Mass-Market Cars",
  //   },
  //   {
  //     id: 5,
  //     carBrand: "Suzuki xx",
  //     carType: "4",
  //     image: "img5",
  //     plateNumber: "SXB4431",
  //     Deposit: "S$10",
  //     Rental: "1S$",
  //     Availability: 0,
  //     Description: "Mass-Market Cars",
  //   },
  //   {
  //     id: 6,
  //     carBrand: "Hyundai",
  //     carType: "4",
  //     image: "img6",
  //     plateNumber: "SXB4431",
  //     Deposit: "S$10",
  //     Rental: "1S$",
  //     Availability: 1,
  //     Description: "Small Cars",
  //   },
  // ]);

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
