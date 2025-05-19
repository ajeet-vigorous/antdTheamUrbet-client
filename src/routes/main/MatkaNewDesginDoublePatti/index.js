import { Button, Col, Form, Input, Row, Select, Typography } from "antd";
import Title from "antd/lib/skeleton/Title";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


const MatkaNewDesginDoublePatti = () => {
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
   
   [200, 110, 228, 255, 336, 499, 660, 688, 778],
   [300, 166, 229, 337, 355, 445, 599, 779, 788],
   [400, 112, 220, 266, 338, 446, 455, 699, 770],
   [500, 113, 122, 177, 339, 366, 447, 799, 889],
   [600, 114, 277, 330, 448, 466, 556, 880, 899],
   [700, 115, 133, 188, 223, 377, 449, 557, 566],
   [800, 116, 224, 233, 288, 440, 477, 558, 990],
   [900, 117, 144, 199, 225, 388, 559, 577, 667],
   [550, 668, 244, 299, 226, 488, 677, 118, 334],
   [100, 119, 155, 227, 335, 344, 399, 588, 669],
];


  return (
    // <div style={{ padding: '40px', background: '#fff', width: '100%', maxWidth: '80%', margin: 'auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
    <Row style={{height:"80vh"}} justify={"center"} align={"middle"}>
    <Col style={{ padding: '40px', background: '#fff',  margin: 'auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} xs={24} sm={20} lg={15}  > 
  <Typography  className="gx-text-grey gx-fs-xxl gx-font-weight-bold gx-text-center gx-pb-3">DOUBLE PATTI</Typography>
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
              <Input type="number" value={inputValues[number] || ''} onChange={(e) => handleInputChange(number, e.target.value)} size="large" style={{borderTopLeftRadius: '0px', borderBottomLeftRadius:"0px"}} />
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

export default MatkaNewDesginDoublePatti;
