import { Button, Col, Form, Input, Row, Select, Typography } from "antd";
import Title from "antd/lib/skeleton/Title";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


const MatkaNewDesginJodi = () => {
  const [selected,setSelected] = useState([])
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
  }, []); // Empty dependency array to ensure this effect runs only on mount/unmount

  const history = useHistory()
  const {Option} = Select

  const handleButtonClick = (number) => {
    setSelected(selected.filter((n) => n !== number));
  };

  return (
    // <div style={{ padding: '40px', background: '#fff', width: '100%', maxWidth: '80%', margin: 'auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
    <Row style={{height:"80vh"}} justify={"center"} align={"middle"}>
      <Col style={{ padding: '40px', background: '#fff',  margin: 'auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} xs={24} sm={20} lg={15}  > 
    <Typography  className="gx-text-grey gx-fs-xxl gx-font-weight-bold gx-text-center gx-pb-3">JODI</Typography>
    <Form >
      <Row gutter={[16, 16]} style={{height:"400px", overflowY:"auto", border:"2px solid lightGrey" ,paddingBlock:"5px", cursor:"pointer"}} justify="space-between" align="middle">
        
        { (Array.from({ length: 101 }, (_, index) => index)).map((number) => (
          
         
              <Col className="gx-pr-1" span={24}>
                <div className={`${selected.find(ele=>ele === number) ? 'gx-bg-grey gx-text-white' : ' gx-text-black' }  gx-rounded-sm` } onClick={() => {
          // Only add the number if it's not already in the selected array
          if (!selected.includes(number)) {
            setSelected((state) => [...state, number]);
          }
        }} style={{ border:"1px solid lightGrey",  textAlign: 'start', padding: '11px', borderTopLeftRadius: '6px', borderBottomLeftRadius:"6px" }}>{number}</div>
              </Col>
              
           
        ))}
      </Row>
      <Row className="gx-my-3" gutter={[16, 16]} justify="space-between" align="middle">
        
        {selected.map((number) => (
          <Col key={number} xs={12} sm={8} md={4}>
            <Row gutter={8}>
            <Col  style={{ background: '#555', color: '#fff', textAlign: 'center', borderTopLeftRadius: '6px', borderBottomLeftRadius:"6px" }} className="gx-pr-1 gx-bg-flex gx-justify-content-center gx-align-items-center" span={5}>
            {number}
            </Col>
              <Col className="gx-px-0" span={14}>
                <Input type="number" value={inputValues[number] || ''} onChange={(e) => handleInputChange(number, e.target.value)} size="large" style={{borderRadius:"0px"}} />
              </Col>
              <Col onClick={()=>handleButtonClick(number)}   style={{ background: '#555', color: '#fff', textAlign: 'center', padding: '11px', borderTopRightRadius: '6px', borderBottomRightRadius:"6px" }} className="gx-pr-1 gx-bg-flex gx-justify-content-center gx-align-items-center" span={5}>
            X
            </Col>
              {/* <Col className="gx-pl-0" span={5}>
                <div onClick={()=>handleButtonClick(number)} style={{ background: '#555', color: '#fff', textAlign: 'center', padding: '11px', borderTopRightRadius: '6px', borderBottomRightRadius:"6px" }}>x</div>
              </Col> */}
            </Row>
          </Col>
        ))}
      </Row>

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

export default MatkaNewDesginJodi;
