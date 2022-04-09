import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import ProfileEntryCard from "./profile_entrycard";
import "./index.css"

function CourseList() {
    let history = useHistory();
    let token = localStorage.getItem('Token')
    const [courseList, setCourseList] = useState([
        { courseID: "123", courseName: "1233", professorName: "1313" }
    ]);

//     useEffect(() => {
//         const url = "http://34.126.85.190:8080/course";
//         const request = new Request(url, {
//               method: "get",
//               body: null,
//               headers:new Headers ({
//               'Token': token,
//               'Accept': "application/json, text/plain, */*",
//               "Content-Type": "application/json"
//               })
//           })      
//           fetch(request).then((res) => {
//               return res.json()
//           }).then(json => {
//               setCourseList(json.course_list) 
//           }).catch(error => {
//               console.log(error);
//           });
//     }
//   , [])

    const logOut = () => {
        localStorage.setItem('Token', '')
        localStorage.setItem('username', '')
        window.dispatchEvent(new Event('storage'))
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