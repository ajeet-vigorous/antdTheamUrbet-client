import { Button, Col, Form, Input, Row, Select, Typography } from "antd";
import Title from "antd/lib/skeleton/Title";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


const MatkaNewDesginSinglePatti = () => {
  const [inputValues, setInputValues] = useState({});
  const handleInputChange = (number, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [number]: value, // Update the value for the specific number
    }));
  };
  useEffect(() => {
    // Add background image style to gx_layout_content when component mounts
    const gx_layout_content = document.querySelector(".gx-layout-content");
    
    if (gx_layout_content) {
      gx_layout_content.style.backgroundImage = "url('/matkaNewImages/images/mw-ban.png')";
      gx_layout_content.style.backgroundSize = "cover"; // optional: to cover the entire page
    }
  
    // Cleanup function to remove the background image when component unmounts
    return () => {
      if (gx_layout_content) {
        gx_layout_content.style.backgroundImage = '';
      }
    };
  }, []); 

  const history = useHistory()
  const {Option} = Select
  const imageData = [ 
    [127, 136, 145, 190, 235, 280, 370, 479, 460, 569, 389, 578],
     [128, 137, 146, 236, 245, 290, 380, 470, 489, 560, 678, 579],
    [129, 138, 147, 156, 237, 246, 345, 390, 480, 570, 679, 589],
     [120, 139, 148, 157, 238, 247, 256, 346, 490, 580, 670, 689],
   [130, 149, 158, 167, 239, 248, 257, 347, 356, 590, 680, 789],
  [140, 159, 168, 230, 249, 258, 267, 348, 357, 456, 690, 780],
   [123, 150, 169, 178, 240, 259, 268, 349, 358, 457, 367, 790],
    [124, 160, 179, 250, 269, 278, 340, 359, 368, 458, 467, 890],
  [125, 134, 170, 189, 260, 279, 350, 369, 378, 459, 567, 468],
    [126, 135, 180, 234, 270, 289, 360, 379, 450, 469, 478, 568],
    
];




  return (
    // <div style={{ padding: '40px', background: '#fff', width: '100%', maxWidth: '80%', margin: 'auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
    <Row style={{height:"80vh"}} justify={"center"} align={"middle"}>
    <Col style={{ padding: '40px', background: '#fff',  margin: 'auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} xs={24} sm={20} lg={15}  > 
  <Typography  className="gx-text-grey gx-fs-xxl gx-font-weight-bold gx-text-center gx-pb-3">SINGLE PATTI</Typography>
  <Form >
    { imageData.map((numbers,index)=>
    <Row key={index} gutter={[16, 16]} className="gx-pt-2" justify="space-between" align="middle">
      <Col  className="gx-px-2 gx-rounded-sm gx-bg-grey gx-py-2 gx-fs-lg gx-font-weight-bold gx-text-white" xs={24}>
{index}
      </Col>
      
      {numbers.map((number) => (
        <Col key={number} xs={12} sm={8} md={4}>
          <Row gutter={8}>
            <Col  style={{ background: '#555', color: '#fff', textAlign: 'center', borderTopLeftRadius: '6px', borderBottomLeftRadius:"6px" }} className="gx-pr-1 gx-bg-flex gx-justify-content-center gx-align-items-center" span={8}>
            {number}
            </Col>
            <Col className="gx-pl-0" span={16}>
              <Input type="number" value={inputValues[number] || ''} onChange={(e) => handleInputChange(number, e.target.value)}  size="large" style={{borderTopLeftRadius: '0px', borderBottomLeftRadius:"0px"}} />
            </Col>
          </Row>
        </Col>
      ))}
    </Row>
    )
}
    {/* Select Market */}
    <Row justify={"center"} className="gx-pt-3 gx-fs-xxl">
      {/* <Col  xs={12}> */}
        <Form.Item className="gx-fs-xxl" label="Select Market" required>
        <Select size="large" placeholder="Select Market Type">
                  <Option value="">Select Market Type</Option>
                  <Option value="market2">Closed Market</Option>
                </Select>
        </Form.Item>
      {/* </Col> */}
      </Row>
      <Row  justify={"center"} className="gx-fs-xxl gx-pb-2">
      {/* Total Point Display */}
      <span>
        
          Total Point: <strong>00</strong>
        
      </span>
    </Row>

    {/* Submit Button */}
    <Row justify="center">
      <Col>
        <Button size="large" style={{paddingInline:"50px"}}  className="gx-bg-grey gx-text-white gx-font-weight-semi-bold" htmlType="submit">
          Submit Game
        </Button>
      </Col>
    </Row>
  </Form>
  </Col>
  </Row>

  )
};

export default MatkaNewDesginSinglePatti;
