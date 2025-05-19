import { Col, Row } from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


const MatkaNewDesgin = () => {
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
  

  return (
    <Row
      gutter={[16, 16]}
      style={{height:"85vh"}}
      className=" gx-w-100 gx-ml-0"
      justify="center"
      align="middle"
    >
      <Col xs={24}>
      <Row justify={"center"}>
        <Col xs={24} className="gx-text-yellow gx-fs-xxl gx-text-center gx-font-weight-semi-bold">
        Gaziabad
        </Col>
      </Row>
        <Row className="gx-py-2" justify={"center"}>
          <Col xl={4} md={5} xs={8}>
            <img onClick={()=>history.push("/main/matkanewdesgin-single")} alt="single" src="/matkaNewImages/images/1_single.png" />
          </Col>
          <Col xl={4} md={5} xs={8}>
            <img onClick={()=>history.push("/main/matkanewdesgin-jodi")} alt="single" src="/matkaNewImages/images/2_jodi.png" />
          </Col>
        </Row>
       
        <Row className="gx-py-2" justify={"center"}>
          <Col xl={4} md={5} xs={8}>
            <img onClick={()=>history.push("/main/matkanewdesgin-single-patti")} alt="single" src="/matkaNewImages/images/3_singlepatti.png" />
          </Col>
          <Col xl={4} md={5} xs={8}>
            <img onClick={()=>history.push("/main/matkanewdesgin-double-patti")} alt="single" src="/matkaNewImages/images/4_double.png" />
          </Col>
          <Col xl={4} md={5} xs={8}>
            <img onClick={()=>history.push("/main/matkanewdesgin-tripple-patti")} alt="single" src="/matkaNewImages/images/5_triple.png" />
          </Col>
        </Row>
        <Row className="gx-py-2" justify={"center"}>
          <Col xl={4} md={5} xs={8}>
            <img onClick={()=>history.push("/main/matkanewdesgin-odd-even")} alt="single" src="/matkaNewImages/images/16_odd_even.png" />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default MatkaNewDesgin;
