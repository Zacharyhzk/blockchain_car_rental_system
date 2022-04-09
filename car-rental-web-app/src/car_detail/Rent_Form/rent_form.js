import {
    Form,
    Input,
    DatePicker
} from 'antd';
import { useEffect, useRef, useState } from 'react';


function Rent_form(props) {
    let { id, carBrand, carType, image, plateNumber,
        Deposit, Rental, Availability, Description } = props;
    let [address,setAddre] = useState('');
  //  let [Total_Deposit,setTotal_Deposit] = useState(0);
    let [From_End,setDate] = useState([]);
    let myRef = useRef();
    let initialValues = {
        Car_Brand: carBrand,
        Plate_Number: plateNumber,
        Rent_Fee:  Rental,
    }

    useEffect(()=>{
        props.setForm(myRef.current)
    },[])

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
    };

    const rangeConfig = {
        rules: [
          {
            type: 'array',
            required: true,
            message: 'Please select time!',
          },
        ],
      };

    const changeValue =(values)=>{
           console.log(values);
    }
    
    const setDeposit = (value)=>{
          myRef.current.setFieldsValue({
            Total_Deposit: '12 S$'
          })
          console.log(value);
          setDate(()=>{
              return value
          });
          props.setDate(value); 
    }

    const setAddress = (e)=>{
          setAddre(e.target.value);
          props.setAddress(e.target.value);
    }

    const getAddress = () => address;
 //   const getDeposit = () => Total_Deposit;
    const getDate = ()=> From_End;

    return (
        <Form {...formItemLayout}
              initialValues = {initialValues}
              onValuesChange = {changeValue}
              ref={myRef}
        >
            <Form.Item
                name="Car_Brand"
                label="Car_Brand"
            >
                <Input disabled/>
            </Form.Item>
            <Form.Item
                name="Plate_Number"
                label="Plate_Number"
            >
                <Input disabled/>
            </Form.Item>
            <Form.Item
                name="Rent_Fee"
                label="Rent_Fee"
            >
                <Input disabled/>
            </Form.Item>
            <Form.Item
                name="Wallet_Address"
                label="Wallet_Address"
                rules={[
                    {
                        required: true,
                        message: 'Please input your Wallet_Address',
                    }
                ]}
            >
                <Input onChange={setAddress}/>
            </Form.Item>
            <Form.Item name="time-picker" label="TimePicker" hasFeedback 
            {...rangeConfig}
            validateStatus="error">
                <DatePicker.RangePicker
                    style={{
                        width: '100%',
                    }}
                    onChange= {setDeposit}
                />
            </Form.Item>
            <Form.Item
                name="Total_Deposit"
                label="Total_Deposit"
            >
                <Input disabled/>
            </Form.Item>
        </Form>
    )
}

export default Rent_form;