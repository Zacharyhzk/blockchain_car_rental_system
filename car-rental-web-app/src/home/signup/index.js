import TextField from "@material-ui/core/TextField";
import { useState } from "react";
import { useHistory } from "react-router";
import { message } from 'antd';
import '../../button.css'
import { postApi } from '../../util/fetchApi';
import 'antd/dist/antd.css'; 

function Signup() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [type, setType] = useState('')
    let history = useHistory();

    const clickSignup = async () => {
      try {
        const body = {
          username: username,
          password: password,
          emailAddress: email,
          type:type};
  
        const requestOptions = {
          method: 'POST',
          body: JSON.stringify(body),
        };
  
        const response = await postApi({
          url: 'http://localhost:9092/user-auth/register',
          options: requestOptions,
        });
  
        const result = await response;
        if (response.code == 4){
          message.success('User info added successfully');
          history.push('/signin')
        } else{
          alert(result.message);
        }
        debugger
      } catch (err) {
        debugger
        message.error('Error while adding the User Info');
        console.log(err);
      }
    };
  

    return (
      <div className="App">
        <div class = "signin-header">
          <h1>ABC Rental Company</h1>
          <br></br>
          <h3>Create your account!</h3>
          <a href="/signin">
          Already have an account, Sign in!
          </a>
        </div>
        <div>
          <TextField
            name="username"
            label="username"
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
            name="email"
            label="email"
            type="email"
            id="outlined-basic"
            variant='outlined'
            margin="normal"
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        {/* <button className="small red button" onClick={clickSignup}> */}
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
        <button className="small red button" onClick={clickSignup}>
          Sign up
        </button>
      </div>
    );
  }
  
  export default Signup;