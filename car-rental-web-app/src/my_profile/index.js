import { useEffect, useContext} from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import ProfileEntryCard from "./profile_entrycard";
import SmartContractContext from "../stores/smartContractContext";
import "./index.css"

function CourseList() {
    const { CarRentalContract } = useContext(SmartContractContext);
    let history = useHistory();
    let token = localStorage.getItem('Token')
    const [courseList, setCourseList] = useState([
        { courseID: "123", courseName: "1233", professorName: "1313" }
    ]);

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

//     useEffect(async() => {
//         // let temp = {
//         //     carId: values.carId,
//         //     carBrand: values.carBrand,
//         //     carDescription: values.carDescription,
//         //     carVin: values.carVin,
//         //     carSeat: values.carSeat,
//         //     carAvailable: values.carAvailable,
//         //     carPrice: values.carPrice,
//         //   };
//         //   storage.push(temp);
//         //   localStorage.setItem("storage", JSON.stringify(storage));
//         //   const accounts = await window.ethereum.enable();
//         //   console.log("12344", accounts);
//         //   console.log(CarRentalContract._address);
//           await CarRentalContract.methods
//             .getAllReconds().
//             send({
//               from: accounts[0],
//             });
//           message.success("Add Car Info Successfully");
//           console.log("234");
//     }
//   , [])

    const logOut = () => {
        // localStorage.setItem('Token', '')
        // localStorage.setItem('username', '')
        // window.dispatchEvent(new Event('storage'))
        history.push("/")
    }

    return (
      <div className="">
          <div className="professorNav">
                <span className="logOut" onClick={logOut}>
                    Log out
                </span>
                <span className="returnDashboard" onClick={()=>history.push("/dashboard")}>
                    Dashboard
                </span>
            </div>
            <table className="Information">
                <tbody>
                    <tr>
                    <th>
                        ID
                    </th>
                    <th>
                        Price
                    </th>
                    <th> 
                        Rent Period
                    </th>
                    <th> 
                        Car Model
                    </th>
                    <th> 
                        Car Plan ID
                    </th>
                    <th> 
                        Status
                    </th>
                    <th> 
                        Car Condition
                    </th>
                    <th> 
                        Action
                    </th>
                    </tr>
                    { courseList.map((user) => {
                    return(
                        <tr>
                        <td>
                            {user.iD}
                        </td>
                        <td>
                            {user.price}
                        </td>
                        <td>
                            {user.rentPeriod}
                        </td>
                        <td>
                            {user.carModel}
                        </td>
                        <td>
                            {user.carPlan}
                        </td>
                        <td>
                            {user.status}
                        </td>
                        <td>
                            {user.carCondition}
                        </td>
                        <td>
                            {/* Admin essentially does 'sudo user' */}
                            <button>check</button>

                            {/* Server call to delete user */}
                            <button>remove</button>
                        </td>
                        </tr>   
                    )  
                    })}   
                </tbody>       
            </table>
      </div>
    );
  }
  
  export default CourseList;