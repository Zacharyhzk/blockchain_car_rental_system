import "./index.css";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";


function Choice() {
    let history = useHistory();
    let userName=localStorage.getItem("userName");
    let userType =localStorage.getItem("userType");
    const logOut = () => {
        localStorage.setItem('userName', '')
        window.dispatchEvent(new Event('storage'))
        history.push("/")
    }
  return (
    userType == "user" ?
    <div class="App">
      <div className="hero-image">
        <div className="professorNav">
          <span className="logOut" onClick={logOut}>
            Log out
          </span>
          <span
            className="returnDashboard"
            onClick={() => history.push("/dashboard")}
          >
            User Dashboard
          </span>
        </div>
        <div class="hero-text">
          <h1>Choose what you are interested!</h1>
          <br></br>
          <p> Search Car </p>
          <Link to={"./searchCar"}>
            <button>Search Car</button>
          </Link>
          <p>My Profile</p>
          <Link to={"./profile"}>
            <button>My Profile</button>
          </Link>
        </div>
      </div>
    </div>
     : 
     <div class="App">
     <div className="hero-image">
       <div className="professorNav">
         <span className="logOut" onClick={logOut}>
           Log out
         </span>
         <span
           className="returnDashboard"
           onClick={() => history.push("/dashboard")}
         >
           Admin Dashboard
         </span>
       </div>
       <div class="hero-text">
         <h1>Choose what you are interested!</h1>
         <br></br>
         <p> Search and Add Car </p>
         <Link to={"./searchCar"}>
           <button>Search and Add Car</button>
         </Link>
         <p> </p>
         {/* <p> Add Car </p>
         <Link to={"./addCar"}>
           <button>Add Car</button>
         </Link>
         <p> </p> */}
         <p> Car Plans</p>
         <Link to={"./searchCar"}>
           <button>Car Plans</button>
         </Link>
         <p> </p>
         <p> Renters </p>
         <Link to={"./profile"}>
           <button>Renters</button>
         </Link>
       </div>
     </div>
   </div>
  );
}

export default Choice;
