import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { liveCasinoList, virtualCasinoList } from './casinoJson'
import LeftSidebar from '../../../components/LeftSidebar/LeftSidebar';
// import CommingSoon from '../../components/CommingSoon/CommingSoon';

const { Meta } = Card;

const Casino = ({ history }) => {
  const [gameItem, setGameItem] = useState({});
  const [CommingSoonModal, setCommingSoonModal] = useState(false);
  const [domainSettingByDomainName, setDomainSettingByDomainName] = useState(null);

  useEffect(() => {
    getDomainSettingByDomainName();
    const timer = setTimeout(() => {
      setCommingSoonModal(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getDomainSettingByDomainName = () => {
    try {
      const domainSetting = localStorage.getItem('domainSettingByDomainName');
      if (domainSetting) {
        const parsedDomainSetting = JSON.parse(domainSetting);
        setDomainSettingByDomainName(parsedDomainSetting);
      } else {
        setDomainSettingByDomainName(null);
      }
    } catch (error) {
      console.error('Error parsing domainSettingByDomainName:', error);
      setDomainSettingByDomainName(null);
    }
  };

  const sortedVirtualCasinoList = virtualCasinoList.sort((a, b) => a.orderBy - b.orderBy);
  const sortedLiveCasinoList = liveCasinoList.sort((a, b) => a.orderBy - b.orderBy);
  return (
    <Row>
    <Col  xs={24}
    md={4}
    xl={3}
    className=" gx-d-none gx-d-md-block  gx-mx-0">
   
    <LeftSidebar />
    </Col>
    <Col style={{paddingInline:"2px"}} xs={24} md={20} xl={21} className='gx-px-3' >
    <div  style={{
        backgroundColor: "white",
        borderTop: "10px solid black",
        borderTopLeftRadius: "1rem",
        borderTopRightRadius: "1rem",
        height: "100%",
      }}>
        <div className='gx-px-3 gx-fs-lg gx-font-weight-semi-bold gx-text-black gx-py-2 gx-text-uppercase'>Casino Games</div>

    <Card className='gx-bg-transparent '>
      <Typography className='gx-bg-grey gx-text-white gx-mb-3  gx-font-weight-semi-bold gx-fs-lg gx-py-2 gx-px-2 gx-text-uppercase'>
        Virtual Casino
      </Typography>
      <Row gutter={[20,20]} justify="start" className='gx-pl-4' >
        {sortedVirtualCasinoList?.map((item, index) => (
          <Col key={index} className='gx-px-0 gx-mb-0 gx-px-2' xs={12} sm={8} md={8} lg={6} xl={4}>
            <Link to={`${item.shortName === "matka" ? `/main/matka`: `/main/virtual-games/${item.shortName}/ `}`}>
              <Card
                hoverable
                cover={
                  <img
                    alt={item.title}
                    src={item.img}
                    className='gx-rounded-base gx-pointer gx-object-contain'
                    style={{ height: '100%'  }}
                  />
                }
              >
              </Card>
            </Link>
          </Col>
        ))}

      </Row>

      <Typography className='gx-bg-grey gx-text-white gx-mb-3 gx-px-2 gx-font-weight-semi-bold gx-fs-lg gx-py-2 gx-text-uppercase'>
        Live Casino
      </Typography>
      <Row className='gx-px-4 ' >
        {sortedLiveCasinoList?.map((casino) => (
          <Col key={casino.eventId} className='gx-px-0 gx-mb-0 gx-px-2' xs={12} sm={8} md={8} lg={6} xl={4}>
            <Link to={`/main/${casino.shortName}/${casino.eventId}`}>
              <Card
                className='gx-position-relative'
                hoverable
                cover={
                  <img
                    alt={casino.title}
                    src={casino.img}
                    className=' gx-pointer gx-object-contain'
                    style={{ height: '10rem' }}
                  />
                }
              >
                <div className='gx-bg-red gx-text-white gx-text-center gx-py-2 gx-rounded-sm gx-font-weight-semi-bold gx-fs-sm gx-text-uppercase'>{casino.casinoName}</div>
                {/* {casino.casinoNew && ( */}
                  <div
                    style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'block' }}
                    className=" gx-blink gx-d-flex gx-justify-content-center gx-align-items-center gx-position-absolute gx-top-0 gx-right-0 flex justify-center items-center top-0"
                  >
                    <span className="gx-text-white gx-fs-xxs gx-text-center gx-font-weight-bold">New Launch</span>
                  </div>
                {/* )} */}
              </Card>
            </Link>
            
          </Col>
        ))}
      </Row>
    </Card>
    </div>

    </Col>
    </Row>

  );
};

export default Casino;
// casinoName