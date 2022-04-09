import { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import CarEntryCard from "./car_entrycard";
import './index.css'

function ProfList() {
  let history = useHistory();
  const [carList, setCarList] = useState([
    { id:1,carBrand: "Kia", carType: "1",image: 'img1', 
    plateNumber: "SLB1231",Deposit:"S$10",Rental:"2S$",Availability:0,Description: "Mass-Market Cars" },
    { id:2,carBrand: "Chang AN X7", carType: "2", image: 'img2',
    plateNumber: "SLB121",Deposit:"S$5",Rental:"3S$",Availability:1,Description: "Mass-Market Cars" },
    { id:3,carBrand: "Tesla", carType: "3", image: 'img3',
    plateNumber: "SZB1431",Deposit:"S$6",Rental:"4S$",Availability:0,Description: "Luxury Electric Vehicles" },
    { id:4,carBrand: "Suzuki--x", carType: "4", image: 'img4',
    plateNumber: "SDB3431",Deposit:"S$4",Rental:"6S$",Availability:1,Description: "Mass-Market Cars" },
    { id:5,carBrand: "Suzuki xx", carType: "4", image: 'img5',
    plateNumber: "SXB4431",Deposit:"S$10",Rental:"1S$",Availability:0,Description: "Mass-Market Cars" },
    { id:6,carBrand: "Hyundai", carType: "4", image: 'img6',
    plateNumber: "SXB4431",Deposit:"S$10",Rental:"1S$",Availability:1,Description: "Small Cars" },
  ]);



  const logOut = () => {
    localStorage.setItem("Token", "");
    localStorage.setItem("username", "");
    window.dispatchEvent(new Event("storage"));
    history.push("/");
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
      <ul className="carList">
        {carList.map((car) => {
          return (
            <CarEntryCard
              {...car}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default ProfList;
