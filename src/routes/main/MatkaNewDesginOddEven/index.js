import { Button, Col, Form, Input, Row, Select, Typography } from "antd";
import Title from "antd/lib/skeleton/Title";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const MatkaNewDesginOddEven = () => {
  useEffect(() => {
    // Add background image style to gx_layout_content when component mounts
    const gx_layout_content = document.querySelector(".gx-layout-content");

    if (gx_layout_content) {
      gx_layout_content.style.backgroundImage =
        "url('/matkaNewImages/images/mw-ban.png')";
      gx_layout_content.style.backgroundSize = "cover"; // optional: to cover the entire page
    }

    // Cleanup function to remove the background image when component unmounts
    return () => {
      if (gx_layout_content) {
        gx_layout_content.style.backgroundImage = "";
      }
    };
  }, []); // Empty dependency array to ensure this effect runs only on mount/unmount

  const history = useHistory();
  const { Option } = Select;

  return (
    // <div style={{ padding: '40px', background: '#fff', width: '100%', maxWidth: '80%', margin: 'auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
    <Row style={{ height: "80vh" }} justify={"center"} align={"middle"}>
      <Col
        style={{
          padding: "40px",
          background: "#fff",
          margin: "auto",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
        xs={24}
        sm={20}
        lg={15}
      >
        <Typography className="gx-text-grey gx-fs-xxl gx-font-weight-bold gx-text-center gx-pb-3">
          ODD EVEN
        </Typography>
    
        <Form className=" gx-font-weight-semi-bold  gx-fs-lg" >
          {/* Select Market */}
          <Row  style={{ border:"3px solid lightGrey"}} justify={"center"} className="gx-pt-3 gx-bg-grey gx-rounded-sm  gx-mb-3 gx-px-2 gx-fs-xxl">
            <Col xs={24} md={8}>
              <Form.Item className="gx-fs-xxl"  required>
                <label className="gx-text-white minMax" >Market Type</label>
                <Select size="large" placeholder="Select Market Type">
                  <Option value="">Select Market Type</Option>
                  <Option value="market2">Closed Market</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={16}>
              <Row>
                <Col xs={12}>
                  <Form.Item
                    className="gx-fs-xxl"
                    // label=""
                    required
                  >
                    <label className="gx-text-white minMax">Select Even/Odd</label>
                    <Select size="large" placeholder="Select Even/ Odd">
                      <Option value="">Select Even/ Odd</Option>
                      <Option value="market2">ODD</Option>
                      <Option value="market2">EVEN</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item className="gx-fs-xxl"  required>
                    <label className="gx-text-white minMax">Amount</label>
                    <Input size="large" className="gx-rounded-0" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row justify={"center"} className="gx-fs-xxl gx-pb-2">
            {/* Total Point Display */}
            <span>
              Total Point: <strong>00</strong>
            </span>
          </Row>

          {/* Submit Button */}
          <Row justify="center">
            <Col>
              <Button
                size="large"
                style={{ paddingInline: "50px" }}
                className="gx-bg-grey gx-text-white gx-font-weight-semi-bold"
                htmlType="submit"
              >
                Submit Game
              </Button>
            </Col>
          </Row>
        </Form>
     
      </Col>
    </Row>
  );
};

export default MatkaNewDesginOddEven;
