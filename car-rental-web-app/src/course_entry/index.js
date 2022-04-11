import { useState, useContext} from "react";
import { useHistory } from "react-router";
import TextField from "@material-ui/core/TextField";
import './index.css'
import SmartContractContext from '../stores/smartContractContext';
import { message } from "antd";

function CourseEntry() {
    let history = useHistory();
    let token = localStorage.getItem('Token')
    const [courseId, setcourseId] = useState('')
    const [professorName, setProfessorName] = useState('')
    const [courseName, setCourseName] = useState('')

    const { CarRentalContract } = useContext(SmartContractContext);

    const clickEntry = async (values) => {
          try {
              const accounts = await window.ethereum.enable();
                console.log("12344",accounts)
              await CarRentalContract.methods.addCarInfo("brand", "des", "carVin", 4, 20, true);
              message.success('Add Car Info Successfully');
              console.log("234")

          } catch (err) {
        debugger
        console.log("22",err)
              message.error('Error Add Car Info');
          }
      };

    const clickEntry2 = () => {
        const course = {'course_id': courseId, 'professor_name':professorName, 'course_name':courseName}
        const request = new Request('http://34.126.85.190:8080/course/add', {
            method: "POST",
            body: JSON.stringify(course),
            headers: {
                Accept: "application/json, text/plain, */*",
                'Token': token,
                "Content-Type": "application/json"
            }
        });
        fetch(request)
            .then(res => {
                let temp = res.json()
                return temp
                })
            .then(json => {
                if (json.info === 'Success') {
                    console.log(json)
                    alert('Course creation success!')
                    history.push('/dashboard')
            } else {
                alert('Course creation failed!')
            }
            })
            .catch(error => {
            console.log(error);
            });
    }

    return (
        <div className="courseEntry">
            <h2>Create a new Course Entry</h2>
            <a href="/dashboard">Go back to dashboard </a>
            <div>
                <TextField
                    name="courseid"
                    label="Course ID"
                    id="outlined-basic"
                    variant='outlined'
                    margin="normal"
                    onChange={e => setcourseId(e.target.value)}
                />
            </div> 
            <div>
                <TextField
                    name="professorname"
                    label="Prefessor Name"
                    id="outlined-basic"
                    variant='outlined'
                    margin="normal"
                    onChange={e => setProfessorName(e.target.value)}
                />
            </div>
            <div>
                <TextField
                    name="coursename"
                    label="Course Name"
                    id="outlined-basic"
                    variant='outlined'
                    margin="normal"
                    onChange={e => setCourseName(e.target.value)}
                />
            </div>
            <button className="small green button" onClick={clickEntry}>
                Complete
            </button>
        </div>
    );
  }
  
  export default CourseEntry;