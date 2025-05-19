// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { Form, Input, Button, notification, Card, Row, Col } from 'antd';
//  import { NotificationManager } from "react-notifications";
//  import IntlMessages from "util/IntlMessages";
// // import { changePassword } from "../../../appRedux/actions/Auth";

// const ChangePassword = () => {
//   const dispatch = useDispatch();
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [confirmLoading, setConfirmLoading] = useState(false);

//   const handlePasswordChange = async () => {

//     if (newPassword !== confirmPassword) {
//       return NotificationManager.error(<IntlMessages id="notification.errorMessage" />,
//         <IntlMessages id="notification.clickMe" />,
//         5000, () => { alert('callback')}
//       );
//     }
//     setConfirmLoading(true);
//     try {
//       const data = {
//         oldPassword: oldPassword,
//         password: newPassword,
//         // isTransaction: false
//       }
//       // await dispatch(changePassword(data));
//       setOldPassword("");
//       setNewPassword("");
//       setConfirmPassword("")
//     } catch (error) {

//     } finally {
//       setConfirmLoading(false);
//     }
//   };

//   return (

//     <Row justify={'center'}>
//       <Col xxl={5} xl={5} lg={7} md={11} sm={14} xs={20} className=''>

//         <div className='gx-rounded-sm' style={{backgroundColor: '#1B2456'}} >
//           <div className='gx-bg-grey gx-py-3 gx-rounded-lg gx-bg-flex gx-justify-content-center  gx-align-content-center gx-text-white' style={{height: '70px'}}>
//             <div className='gx-h-100 gx-bg-flex gx-justify-content-center gx-font-weight-bold gx-fs-xxl  gx-align-content-center'>Change Password</div>
//           </div>

//           <div className=' gx-px-4 ' style={{backgroundColor: '#1B2456'}}>
//             <Form
//               layout="vertical"

//               initialValues={{ oldPassword: '', newPassword: '', confirmPassword: '' }}
//               className='gx-py-3'
//             >
//              <Form.Item required>
//               <Input.Password
//               className="gx-border-redius"
//                 value={oldPassword}
//                 placeholder="Enter Old Password"
//                 onChange={(e) => setOldPassword(e.target.value)}
//                 visibilityToggle={false}
//               />
//             </Form.Item>
//             <Form.Item required>
//               <Input.Password
//                 value={newPassword}
//                  className="gx-border-redius"
//                 placeholder="Enter New Password"
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 visibilityToggle={false}
//               />
//             </Form.Item>
//             <Form.Item required>
//               <Input.Password
//                 value={confirmPassword}
//                   className="gx-border-redius"
//                 placeholder="Enter Confirm password"
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 visibilityToggle={false}
//               />
//             </Form.Item>

// <div className='gx-bg-flex gx-justify-content-center'>
// <div className='gx-bg-red gx-px-3 gx-rounded-xxl gx-py-2 gx-text-white' style={{width: '62px'}} onClick={handlePasswordChange}>
//                   Done
//                 </div>
// </div>

//             </Form>

//           </div>

//         </div>

//       </Col>
//     </Row>

//   );
// };

// export default ChangePassword;

// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { Form, Input, Button, notification, Card, Row, Col } from 'antd';
// import { NotificationManager } from "react-notifications";
// import IntlMessages from "util/IntlMessages";
// // import { changePassword } from "../../../appRedux/actions/Auth";

// const ChangePassword = () => {
//   const dispatch = useDispatch();
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [confirmLoading, setConfirmLoading] = useState(false);

//   const handlePasswordChange = async () => {

//     if (newPassword !== confirmPassword) {
//       return NotificationManager.error(<IntlMessages id="notification.errorMessage" />,
//         <IntlMessages id="notification.clickMe" />,
//         5000, () => { alert('callback') }
//       );
//     }
//     setConfirmLoading(true);
//     try {
//       const data = {
//         oldPassword: oldPassword,
//         password: newPassword,
//         // isTransaction: false
//       }
//       // await dispatch(changePassword(data));
//       console.log(data, "gggggggggggggggggggggg");
//       setOldPassword("");
//       setNewPassword("");
//       setConfirmPassword("")
//     } catch (error) {

//     } finally {
//       setConfirmLoading(false);
//     }
//   };

//   return (

//     <Row justify={'center'}>
//       <Col xxl={5} xl={5} lg={7} md={11} sm={14} xs={20} className=''>

//         <div className='gx-rounded-sm' style={{ backgroundColor: '#1B2456' }} >
//           <div className='gx-bg-grey gx-py-3 gx-rounded-lg gx-bg-flex gx-justify-content-center  gx-align-content-center gx-text-white' style={{ height: '70px' }}>
//             <div className='gx-h-100 gx-bg-flex gx-justify-content-center  gx-align-content-center gx-pt-2'>Change Password</div>
//           </div>

//           <div className=' gx-px-4 ' style={{ backgroundColor: '#485BB4' }}>
//             <Form
//               layout="vertical"

//               initialValues={{ oldPassword: '', newPassword: '', confirmPassword: '' }}
//               className='gx-py-3'
//             >
//               <Form.Item required>
//                 <Input.Password
//                   className="gx-border-redius"
//                   value={oldPassword}
//                   placeholder="Enter Old Password"
//                   onChange={(e) => setOldPassword(e.target.value)}
//                   visibilityToggle={false}
//                 />
//               </Form.Item>
//               <Form.Item required>
//                 <Input.Password
//                   value={newPassword}
//                   className="gx-border-redius"
//                   placeholder="Enter New Password"
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   visibilityToggle={false}
//                 />
//               </Form.Item>
//               <Form.Item required>
//                 <Input.Password
//                   value={confirmPassword}
//                   className="gx-border-redius"
//                   placeholder="Enter Confirm password"
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   visibilityToggle={false}
//                 />
//               </Form.Item>

//               <div className='gx-bg-flex gx-justify-content-center'>
//                 <div className='gx-bg-red gx-px-3 gx-rounded-xxl gx-py-2 gx-text-white' style={{ width: '62px' }} onClick={handlePasswordChange}>
//                   Done
//                 </div>
//               </div>

//             </Form>

//           </div>

//         </div>

//       </Col>
//     </Row>

//   );
// };

// export default ChangePassword;

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Button, Row, Col } from "antd";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import IntlMessages from "util/IntlMessages";
import { changePassword } from "../../../appRedux/actions/Auth";
import LeftSidebar from "../../../components/LeftSidebar/LeftSidebar";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  const handlePasswordChange = async (values) => {
    const { oldPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      return NotificationManager.error(
        <IntlMessages id="notification.errorMessage" />,
        <IntlMessages id="notification.clickMe" />,
        5000,
        () => {
          alert("callback");
        }
      );
    }
    setConfirmLoading(true);
    try {
      const data = {
        oldPassword: oldPassword,
        password: newPassword,
      };
      await dispatch(changePassword(data));
    //  await dispatch(changePassword(data)).then((output) => (
    //    console.log(output, "fffffffffdddddddsaaaaaaaaa")
    //     // if (!output.error) {
    //     //   window.location.href = '/signin';
    //     //   localStorage.clear()
    //     // }
    //  ));

      // const output = await dispatch(changePassword(data));
      // if (!output.error) {
      //   localStorage.clear()
      //   window.location.href = '/signin';

      // }


      form.resetFields();
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoading(false);
    }
  };
  const handleReset = () => {
    // Use the resetFields method to clear the form
    form.resetFields();
  };

  return (
    <Row>
      <Col
        xs={24}
        md={4}
        xl={3}
        className=" gx-d-none gx-d-md-block gx-px-0 gx-mx-0"
      >
        <LeftSidebar />
      </Col>
      <Col style={{ paddingInline: "2px" }} xs={24} md={20} xl={21}>
        <>
          <div
            style={{
              backgroundColor: "white",
              borderTop: "10px solid black",
              borderTopLeftRadius: "1rem",
              borderTopRightRadius: "1rem",
              height: "100%",
            }}
          >
            <Row justify="center">
              <Col xs={24}>
                <div
                  className="gx-rounded-sm"

                >
                  <div className="gx-py-1">
                    <div className=" gx-px-2 gx-text-black gx-font-weight-semi-bold">
                      Change Password
                    </div>
                  </div>
                  <div className="gx-px-4">
                    <Form
                      form={form}
                      layout="vertical"
                      initialValues={{
                        oldPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      }}
                      className="gx-py-3"
                      onFinish={handlePasswordChange}
                    >
                      <div style={{ gap: '10px' }} className="gx-d-block gx-d-md-flex">
                        <div className="gx-w-100">
                          <Form.Item
                            name="oldPassword"
                            label="Old Password *"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your old password!",
                              },
                            ]}
                          >
                            <Input.Password
                              className="gx-border-radius"
                              placeholder="Old Password"
                              visibilityToggle={false}
                            />
                          </Form.Item>
                        </div>

                        <div className="gx-w-100">
                          <Form.Item
                            name="newPassword"
                            label="New Password *"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your new password!",
                              },
                            ]}
                          >
                            <Input.Password
                              className="gx-border-radius"
                              placeholder="New Password"
                              visibilityToggle={false}
                            />
                          </Form.Item>
                        </div>

                        <div className="gx-w-100">
                          <Form.Item
                            name="confirmPassword"
                            label="Retype New Password *"
                            dependencies={["newPassword"]}
                            rules={[
                              {
                                required: true,
                                message: "Please confirm your new password!",
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (!value || getFieldValue("newPassword") === value) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error("The two passwords do not match!")
                                  );
                                },
                              }),
                            ]}
                          >
                            <Input.Password
                              className="gx-border-radius"
                              placeholder="Retype Password"
                              visibilityToggle={false}
                            />
                          </Form.Item>
                        </div>
                      </div>

                      <Form.Item>
                        <div className="gx-d-flex gx-justify-content-start">
                          <Button
                            onClick={() => handleReset()}
                            type="default"
                            className="gx-rounded-sm gx-mr-2 gx-text-white gx-bg-grey"
                          >
                            Reset
                          </Button>
                          <Button

                            htmlType="submit"
                            loading={confirmLoading}
                            className="gx-rounded-sm gx-text-white gx-bg-grey"
                          >
                            Submit
                          </Button>
                        </div>
                      </Form.Item>
                    </Form>

                  </div>

                </div>
              </Col>
            </Row>
          </div>
        </>
      </Col>
    </Row>
  );
};

export default ChangePassword;
