import TextField from "@material-ui/core/TextField";
import { useState } from "react";
import { useHistory } from "react-router";
import '../../button.css';
import { postApi } from '../../util/fetchApi';
import { message, Card } from 'antd';
import imgBg from '../bg-img.jpg';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('')
    let history = useHistory();

    const  clickSignin = async () => {
      try {
        const body = {
          username: username,
          password: password,
          type:type};
  
        const requestOptions = {
          method: 'POST',
          body: JSON.stringify(body),
        };
  
        const response = await postApi({
          url: 'http://localhost:9092/user-auth/signin',
          options: requestOptions,
        });
  
        const result = await response;
        // await console.log(result);
        if (response.code == 4){
          message.success('User log in successfully');
          localStorage.setItem("userName", username);
          localStorage.setItem("userType", type);
          // localStorage.setItem("storage",  JSON.stringify([]));
          // localStorage.setItem("record",  JSON.stringify([]));
          let temp = [];
          if(JSON.parse(localStorage.getItem("storage")) === [] || JSON.parse(localStorage.getItem("record")) === []){
            localStorage.setItem("storage", JSON.stringify(temp));
            localStorage.setItem("record", JSON.stringify(temp));
          }
          history.push('/dashboard')
        } else{
          alert(result.message);
        }
      } catch (err) {
        message.error('Error while adding the User Info');
        console.log(err);
      }
    }

    return (
      <div className="App">
        <div className="bg-image">
        <div className = "">
          <h1>Welcome to ABC Rental Company</h1>
          <h3>Welcome Back!</h3>
          <a href="/signup">
          Don't have account, Sign up!
          </a>
        </div>
        <div>
          <TextField
            name="username"
            label="Username"
            id="outlined-basic"
            variant='outlined'
            margin="normal"
            onChange={e => setUsername(e.target.value)}
          />
        </div> 
        <div>
          <TextField
            name="password"
            label="Password"
            type="password"
            id="outlined-basic"
            variant='outlined'
            margin="normal"
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div>
          <TextField
            name="type"
            label="type"
            type="type"
            id="outlined-basic"
            variant='outlined'
            margin="normal"
            onChange={e => setType(e.target.value)}
          />
        </div>
        <button className="small green button" onClick={clickSignin}>
          Log in
        </button>
        </div>
      </div>
      );
  }
  
  export default Login;