import { useEffect, useRef, useState, useContext } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
} from "antd";
import SmartContractContext from "../../stores/smartContractContext";
import { message } from "antd";

function Rent_form(props) {
  const [componentSize, setComponentSize] = useState("default");
  let myRef = useRef();
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  useEffect(() => {
    props.setForm(myRef.current);
  }, []);
  return (
    <Form
      labelCol={{
        span: 6,
      }}
      wrapperCol={{
        span: 18,
      }}
      layout="horizontal"
      initialValues={{
        size: componentSize,
      }}
      onValuesChange={onFormLayoutChange}
      size={componentSize}
      ref={myRef}
    >
      <p>
        Confirm Return Car?
      </p>
    </Form>
  );
}

export default Rent_form;
