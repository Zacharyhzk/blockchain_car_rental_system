import { Link } from "react-router-dom";
import { Card, Avatar } from 'antd';
import { PayCircleOutlined,CheckCircleOutlined,CloseOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import * as images from '../../images/index.js';


const { Meta } = Card;

function CarEntryCard(props) {
    let {carAvailable, carBrand, carDescription, carId, carPrice, carSeat, carVin} = props;
    let history = useHistory();
    let title = (
         <div style={{fontSize:'18px'}}>
         <span>Car Brand:</span>&nbsp; 
         <span>{carBrand}</span>
         </div>
    )
    let description = (
        <div >
            <p>Car Plate Number: {carVin}</p >
            <p>Rental Fee: {carPrice}/per day </p >
            <p>Car Description: {carDescription}</p >
            <p>Car Seat: {carSeat}</p >
            <p>Car Avialability: &nbsp;
                {carAvailable==="1"? <CheckCircleOutlined style={{color:'green', fontSize:'14px'}} /> 
                : <CloseOutlined style={{color:'red',fontSize:'14px'}} />}</p >
        </div>
    )
    let actions = [(
           <div onClick={()=>{history.push('/carDetail',props)}} 
           style={{margin: '10px', fontSize:'16px'}}>
               <span style={{fontWeight: 'bold'}}>Rent/See Detail</span>&nbsp;
               <PayCircleOutlined />
           </div>
    )]
    // return (
    //     <div id="job" style={{width: '300px'}}>
    //             <div>
    //                 <p>Car Brand: </p >
    //                 <p>Car Type: </p >
    //                 <p>Car License Plate Number: </p >
    //                 <p>Deposit Amount: </p >
    //                 <p>Rental Amount: </p >
    //                 <p>Car Avialability: </p >
    //                 <p>Description: </p >
    //             </div>
    //     </div>
    // );
    return (
        <Card
             style={{ width: '300px', margin: '20px 10px 8px 20px' }}
            // cover={
            //     <img src={img}
            //         alt="example"
            //         style={{width: '300px', height: '200px'}}
            //     />
            // }
            actions={actions}
        >
            <Meta
                title={title}
                description= {description}
            />
        </Card>
    )

}

export default CarEntryCard;