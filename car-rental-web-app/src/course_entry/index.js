// import React, { useState } from "react";
// import {
//   Form,
//   Input,
//   Button,
//   Radio,
//   Select,
//   Cascader,
//   DatePicker,
//   InputNumber,
//   TreeSelect,
//   Switch,
// } from "antd";

// const CourseEntry = () => {
//   const [componentSize, setComponentSize] = useState("default");

//   const onFormLayoutChange = ({ size }) => {
//     setComponentSize(size);
//   };

//   return (
//     <Form
//       labelCol={{
//         span: 4,
//       }}
//       wrapperCol={{
//         span: 14,
//       }}
//       layout="horizontal"
//       initialValues={{
//         size: componentSize,
//       }}
//       onValuesChange={onFormLayoutChange}
//       size={componentSize}
//     >
//       <Form.Item label="Car Deposit">
//         <Input />
//       </Form.Item>
//       <Form.Item label="Car Plate">
//         <Input />
//       </Form.Item>
//       <Form.Item label="Car Brand">
//         <Input />
//       </Form.Item>
//       <Form.Item label="Car Description">
//         <Input />
//       </Form.Item>
//       <Form.Item label="Car Type">
//         <Input />
//       </Form.Item>
//       <Form.Item label="Car Status">
//         <Select>
//           <Select.Option value="1">Available</Select.Option>
//           <Select.Option value="0">Not Available</Select.Option>
//         </Select>
//       </Form.Item>
//       <Form.Item>
//         <Button type="primary" htmlType="submit">
//           Submit
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };
// export default CourseEntry;
