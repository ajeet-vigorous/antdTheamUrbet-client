import { Col, Row } from "antd";
import LeftSidebar from "../LeftSidebar/LeftSidebar";
import RightSidebar from "../RightSidebar/RightSidebar";

function UrbetLayout({ children }) {
  return (
    <Row style={{overflow:"hidden"}} justify={"space-between"} >
      <Col
          xs={24}
          md={24}
          lg={5}
          xl={5}
          xxl={3}
          style={{paddingRight:"5px",paddingLeft:'0px'}}
        className=" gx-d-none gx-d-lg-block  gx-mx-0"
      >
        <LeftSidebar />
      </Col>
      <Col style={{paddingInline:"1px"}} xs={24} md={24} lg={12} xl={12} xxl={16}>
        {children}
      </Col>
      <Col
         xs={24}
         md={24}
         lg={7}
         xl={7}
         xxl={5}
         style={{paddingLeft:"5px", paddingRight:"0px"}}
        className="gx-d-none gx-d-lg-block  gx-mx-0"
      >
        <RightSidebar />
      </Col>
    </Row>
  );
}

export default UrbetLayout;
