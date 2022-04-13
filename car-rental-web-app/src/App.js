import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Home from "./home";
import Signin from "./home/login";
import Signup from "./home/signup";
import Dashboard from "./home/dashboard";
import SearchCar from "./search_car";
import MyProfile from "./my_profile";
import CarDetail from "./car_detail";
import { useState, useEffect, useCallback } from "react";
import { SmartContractContextProvider } from "./stores/smartContractContext";

function App() {
  return (
    <SmartContractContextProvider>
      <Router>
        <Route exact path="/" component={Home} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/searchCar" component={SearchCar} />
        <Route exact path="/profile" component={MyProfile} />
        <Route exact path="/cardetail" component={CarDetail} />
      </Router>
    </SmartContractContextProvider>
  );
}

export default App;
