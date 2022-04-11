import { useEffect, useContext } from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import ProfileEntryCard from "./profile_entrycard";
import SmartContractContext from "../stores/smartContractContext";
import {
  PayCircleOutlined,
  CheckCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "./index.css";
import { message, Button, Modal } from "antd";
import CheckCar_form from "./check_car/checkCar_form";



function CourseList() {
  const { CarRentalContract } = useContext(SmartContractContext);
  let history = useHistory();
  // let [records,setRecords] = useState(JSON.parse(localStorage.getItem('record')));
  let [records, setRecords] = useState([]);
  let token = localStorage.getItem("Token");
  const [courseList, setCourseList] = useState([
    { courseID: "123", courseName: "1233", professorName: "1313" },
  ]);
  const [visible, setVisible] = useState(false);
  let Form;
  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    try {
      // console.log(Form.getFieldsValue(),"123")
    //   clickEntry(Form.getFieldsValue());
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

  useEffect(async () => {
    try {
      let temp = await CarRentalContract.methods.getAllReconds().call();
      setRecords(temp);
      console.log(temp, "333");
    } catch (err) {
      // debugger;
      console.log("22", err);
      message.error("Error Get All Car Info");
    }
  }, []);

  // const [data, setData] = useState([]);
  // const getRecords = async () => {
  //     try {

  //         // let records = localStorage.getItem("record")
  //         debugger
  //         // const response = await CarRentalContract.methods.getAllReconds().call();
  //         // debugger
  //         // console.log(response,"1233")
  //         // setData([
  //         //         {
  //         //           "carId": 0,
  //         //           "carBrand": "123",
  //         //           "carDescription": "23",
  //         //           "carVin": "423",
  //         //           "carSeat": 5,
  //         //           "carAvailable": "1",
  //         //           "carPrice": 30
  //         //         }
  //         // ]);
  //         // for (let i = 0; i < response.length; i++) {
  //         //     const row = {
  //         //         key: response[i].id,
  //         //         id: response[i].id,
  //         //         amount: response[i].amount,
  //         //         period: response[i].months,
  //         //     };
  //         //     setData((prev) => {
  //         //         return [...prev, row];
  //         //     });
  //         // }

  //         // setData([]);

  //     } catch (err) {

  //         console.log(err);
  //         alert('Error occured while loading current Loans');
  //     }
  // };
  // useEffect(()=>{
  //     getRecords()
  // },[])

  const logOut = () => {
    // localStorage.setItem('Token', '')
    // localStorage.setItem('username', '')
    // window.dispatchEvent(new Event('storage'))
    history.push("/");
  };

  return (
    <div className="">
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
      <table className="Information">
        <tbody>
          <tr>
            <th>ID</th>
            <th>Price</th>
            <th>Rent Period</th>
            {/* <th> 
                        Car Model
                    </th> */}
            <th>Status</th>
            {/* <th> 
                        Car Condition
                    </th> */}
            <th>Action</th>
          </tr>
          {records.map((user) => {
            return (
              <tr>
                <td>{user.carId}</td>
                <td>{user.deposit}</td>
                <td>{user.duration}</td>
                {/* <td>
                            {user.carModel}
                        </td>                     */}
                <td>
                  {user.carAvailable === "1" ? (
                    <CheckCircleOutlined
                      style={{ color: "green", fontSize: "14px" }}
                    />
                  ) : (
                    <CloseOutlined style={{ color: "red", fontSize: "14px" }} />
                  )}
                </td>
                {/* <td>
                            {user.carCondition}
                        </td> */}
                <td>
                  {/* Admin essentially does 'sudo user' */}
                  <button onClick={showModal}>check</button>

                  <Modal
                    title="Check Car Modal"
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                  >
                    <CheckCar_form
                      setForm={(form) => {
                        Form = form;
                      }}
                    />
                  </Modal>
                  {/* Server call to delete user */}
                  <button>remove</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default CourseList;
