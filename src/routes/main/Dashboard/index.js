import React, { useEffect, useState } from "react";
import { Button, Card, Carousel, Col, message, Row } from "antd";
import Auxiliary from "util/Auxiliary";
import { Link } from "react-router-dom";
import CasinoCheckModal from "../../../components/CasinoCheckModal/CasinoCheckModal";
import Slider from "react-slick";
import UrbetLayout from "../../../components/UrbetLayout/UrbetLayout";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import RulesModal from "./RulesModal";
import { element } from "prop-types";
import Footers from "../../../components/Footers";
import moment from "moment";
import { getMatchList } from "../../../appRedux/actions/User";
import settings from "../../../domainConfig";
import { FaTableTennis } from "react-icons/fa";
import { PiCricketFill } from "react-icons/pi";
import { IoFootballSharp } from "react-icons/io5";
import { MdOutlineSportsHandball } from "react-icons/md";
import IntCasino from "../IntCasino";
import { liveCasinoList } from "../IntCasino/casinoJson";


const parseMatchDate = (dateString) => {
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("-");
  const [hours, minutes] = timePart.split(":");
  const isPM = timePart.includes("PM");

  let hour = parseInt(hours, 10);
  if (isPM && hour !== 12) hour += 12;
  if (!isPM && hour === 12) hour = 0;

  return new Date(year, month - 1, day, hour, minutes);
};

const Dashboard = () => {
  const history = useHistory();
  const dispatch = useDispatch()

  const { matchList } = useSelector((state) => state.UserReducer);
  const [matchData, setMatchData] = useState([]);
  const [activeTab, setActiveTab] = useState(4);
  const [matchCounts, setMatchCounts] = useState({
  cricket: 0,
  football: 0,
  tennis: 0,
  other: 0,
});
  const [modalOpen, setModalOpen] = useState(
    localStorage.getItem("modalopen") == "true"
  );
  const [betSlipData, setBetSlipData] = useState({});
  const [casinoDataModal, setCasinoDataModal] = useState(false);

  const handleCasinoOpen = (data) => {
    setBetSlipData({ ...data });
    setCasinoDataModal(true);
  };

  const handleClose = () => {
    setCasinoDataModal(false);
    setBetSlipData({});
  };
  useEffect(() => {
    dispatch(getMatchList());
  }, [dispatch]);

  const settings1 = {
    dots: false, // Disable the navigation dots
    arrows: false, // Disable the navigation arrows
    infinite: true, // Enable infinite scrolling
    speed: 500, // Transition speed in ms
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Enable auto-play
    autoplaySpeed: 3000, // Set the auto-slide interval in ms (3 seconds here)
    pauseOnHover: false, // Optional: Prevent auto-slide pause on hover
  };

  let adminMatchList = JSON.parse(localStorage.getItem("matchList"));
  let domainSetting = JSON.parse(localStorage.getItem('clientDomainSetting'));

  useEffect(() => {
    let matchListData = adminMatchList ? adminMatchList : matchList;
    const filteredAndSortedData = matchListData?.filter((element) => element.sportId == activeTab)?.map((item, index) => ({
      key: item._id,
      sn: index + 1,
      name: item.matchName,
      matchDate: item.matchDate,
      seriesName: item.seriesName,
      inplay: item.status,
      matchName: item.matchName,
      marketId: item.marketId,
      eventId: item.eventId,
      cacheUrl: item.cacheUrl,
      status: item.status,
    })).sort((a, b) => moment(a.matchDate, "DD-MM-YYYY HH:mm:ss").isBefore(moment(b.matchDate, "DD-MM-YYYY HH:mm:ss")) ? -1 : 1);

    setMatchData(filteredAndSortedData);
     const cricketMatches = matchListData?.filter((m) => m.sportId == 4).length || 0;
  const footballMatches = matchListData?.filter((m) => m.sportId == 1).length || 0;
  const tennisMatches = matchListData?.filter((m) => m.sportId == 2).length || 0;
  const otherMatches = matchListData?.filter((m) => m.sportId == 5).length || 0;

  setMatchCounts({
    cricket: cricketMatches,
    football: footballMatches,
    tennis: tennisMatches,
    other: otherMatches,
  });
  }, [matchList, activeTab]);
  const handleResponseGame = (element) => {
    if (element.status === "INPLAY") {
      history.push(`/main/match-deatils/${element.marketId}/${element.eventId}`);
    } else {
      message.error("Match will be started soon");
    }
  };

  const handleNavigate = (route) => {
    history.push(`${route}`);
  };
  const onConfirm = () => {
    setModalOpen(false);
    localStorage.setItem("modalopen", false);
  };

  const contentStyle = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  const Notification = localStorage.getItem("notification");
  const sortedLiveCasinoList = liveCasinoList.sort((a, b) => a.orderBy - b.orderBy);

  return (
    <>
      {modalOpen && <RulesModal modalOpen={modalOpen} onConfirm={onConfirm} />}

      {casinoDataModal ? (
        <CasinoCheckModal handleClose={handleClose} betSlipData={betSlipData} />
      ) : (
        <UrbetLayout>
          <Row
            className=" gx-text-uppercase dashboardUrbetLayout gx-mx-0 gx-bg-white"
            justify={"center"}
          >
            <Col className={Notification &&
              Notification !== undefined &&
              Notification !== "undefined" &&
              Notification !== null ? 'gx-mt-3' : "gx-mt-0"}>

              {domainSetting?.banner?.length > 0 ? (
                <Carousel autoplay speed={200}>
                  {domainSetting.banner?.sort((a, b) => a.priority - b.priority)?.map((req, index) => (
                    <div key={index} className="border-0 rounded-lg">

                      {req?.url ? <a href={req.url} >
                        <img
                          src={req.image}
                          alt={req.name}
                          style={contentStyle}

                        /> </a> : <img
                        src={req.image}
                        alt={req.name}
                        style={contentStyle}

                      />}
                    </div>
                  ))}
                </Carousel>
              ) :
                <Carousel autoplay speed={200}>
                  <img style={contentStyle} src="/images/banner.png" alt="" />
                  <img style={contentStyle} src="/images/banner_2.png" alt="" />
                </Carousel>
              }


              <div>
                {settings?.sportFlag && (
                  <Row className="gx-px-1 gx-mx-0  gx-border-bottom-2" style={{ backgroundColor: "rgb(240,240,240)" }} >
                    <Col className="gx-my-2 gx-px-0" xs={6}>
                   
                      <Button onClick={() => { setActiveTab(4) }}


                        className={`gx-w-100 gx-border-0 gx-pl-0 gx-pl-0   gx-m-0 ${activeTab === 4
                          ? "gx-bg-grey gx-text-white gx-box-shadow"
                          : "gx-bg-white gx-text-black"
                          }   `}
                      > 
                        <span className="gx-bg-flex gx-gap-4 gx-mx-auto gx-fs-sm  gx-font-weight-bold  gx-justify-content-center gx-align-items-center"><PiCricketFill /> <span>Cricket ({matchCounts.cricket})</span></span>

                      </Button>
                    </Col>
                    <Col className="gx-my-2 gx-px-1" xs={6}>
                      <Button onClick={() => setActiveTab(1)}

                        className={`gx-w-100 gx-border-0 gx-pl-0   gx-m-0 ${activeTab === 1
                          ? "gx-bg-grey gx-text-white gx-box-shadow"
                          : "gx-bg-white gx-text-black"
                          }   `}
                      >
                        <span className="gx-bg-flex gx-gap-4 gx-mx-auto gx-fs-sm  gx-font-weight-bold   gx-justify-content-center gx-align-items-center"><IoFootballSharp /> <span>Football ({matchCounts.football})</span></span>

                      </Button>
                    </Col>
                    <Col className="gx-my-2 gx-px-0" xs={6}>
                      <Button
                        onClick={() => {

                          setActiveTab(2)
                        }}


                        className={`gx-w-100 gx-border-0 gx-pl-0   gx-m-0 ${activeTab === 2
                          ? "gx-bg-grey gx-text-white gx-box-shadow"
                          : "gx-bg-white gx-text-black "
                          }   `}
                      >
                        <span className="gx-bg-flex gx-gap-4 gx-mx-auto gx-fs-sm  gx-font-weight-bold  gx-justify-content-center gx-align-items-center"><FaTableTennis size={15} /> <span>Tennis ({matchCounts.tennis})</span></span>
                      </Button>
                    </Col>


                    <Col className="gx-my-2 gx-px-1" xs={6}>
                      <Button onClick={() => setActiveTab(5)}

                        className={`gx-w-100 gx-border-0 gx-pl-0   gx-m-0 ${activeTab === 5
                          ? "gx-bg-grey gx-text-white gx-box-shadow"
                          : "gx-bg-white gx-text-black"
                          }   `}
                      >
                        <span className="gx-bg-flex gx-gap-4 gx-mx-auto gx-fs-sm gx-font-weight-bold  gx-justify-content-center gx-align-items-center"><MdOutlineSportsHandball /> <span>Other ({matchCounts.other})</span></span>

                      </Button>
                    </Col>

                  </Row>)}
                <div className="gx-fs-lg gx-px-1 gx-py-1 gx-font-weight-semi-bold gx-text-white gx-bg-grey">
                  {activeTab === 4 ? 'Cricket' : activeTab === 1 ? 'Football' : activeTab === 2 ? 'Tennis' : activeTab === 5 ? 'Other' : 'Sport'}
                </div>
                <div className="gx-w-100 gx-mt-2">
                  {matchData && matchData.length > 0
                    ? matchData.map((element, index) => (
                      <>
                        <Row
                          key={index}
                          className=" gx-ml-1  gx-py-1 gx-border-top "
                        >
                          <Col xs={24} md={12}>
                            <Row
                              gutter={[20, 20]}
                              className="gx-bg-flex  gx-w-100"
                            >
                              <Col span={24}>
                                <Row
                                  gutter={[20, 20]}
                                  className="gx-bg-flex justify-between "
                                >
                                  <Col span={24}>
                                    <Row
                                      gutter={[20, 20]}
                                      style={{ marginBottom: "-5px" }}
                                      className="gx-bg-flex justify-start gx-align-items-center cursor-pointer"
                                    >
                                      <Col span={24}>
                                        <h2
                                          className="gx-fs-md  gx-font-weight-semi-bold"
                                          onClick={() =>
                                            handleResponseGame(element)
                                          }
                                        >
                                          {element.matchName}
                                        </h2>
                                      </Col>
                                    </Row>
                                    <Row
                                      gutter={[20, 20]}
                                      className="gx-bg-flex justify-between py-1 gx-align-items-center text-gray-600 gx-fs-md  gx-font-weight-semi-bold space-x-1"
                                    >
                                      <Col>
                                        <span>
                                          {element && element.matchDate
                                            ? element.matchDate
                                            : "--"}
                                        </span>
                                        <span className="gx-px-3">
                                          <img
                                            style={{ width: "25px" }}
                                            alt="tv"
                                            src="/images/live-tv.png"
                                          />
                                        </span>
                                      </Col>

                                      <Col>
                                        {
                                          (() => {
                                            const inputMoment = moment(element.matchDate, "DD-MM-YYYY HH:mm:ss A");
                                            const currentMoment = moment();
                                            return currentMoment.isSameOrAfter(inputMoment) ?
                                              <div className='gx-fs-sm gx-bg-grey gx-text-white gx-d-block gx-d-lg-none gx-px-2 gx-py-1 gx-font-weight-semi-bold gx-rounded-xxl'>Inplay</div>
                                              : '';
                                          })()
                                        }

                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Col>
                          <Col xs={24} md={12}>
                            <Row
                              gutter={[20, 20]}
                              className=" gx-flex-wrap gx-d-none gx-d-md-flex   gx-w-100 text-base gx-position-relative rounded-xl"
                            >
                              <Col
                                style={{ fontSize: "20px" }}
                                className="matchdtailsYesBackground gx-bg-flex gx-justify-content-center gx-align-items-center  gx-font-weight-bold gx-py-2 gx-px-1 rounded-l-xl"
                                span={4}
                              >
                                -
                              </Col>
                              <Col
                                style={{ fontSize: "20px" }}
                                className="matchdtailsNoBackground gx-bg-flex gx-justify-content-center gx-align-items-center  gx-font-weight-bold gx-py-2 gx-px-1"
                                span={4}
                              >
                                -
                              </Col>
                              <Col
                                style={{ fontSize: "20px" }}
                                className="matchdtailsYesBackground gx-bg-flex gx-justify-content-center gx-align-items-center  gx-font-weight-bold gx-py-2 gx-px-1"
                                span={4}
                              >
                                -
                              </Col>
                              <Col
                                style={{ fontSize: "20px" }}
                                className="matchdtailsNoBackground gx-bg-flex gx-justify-content-center gx-align-items-center  gx-font-weight-bold gx-py-2 gx-px-1"
                                span={4}
                              >
                                -
                              </Col>
                              <Col
                                style={{ fontSize: "20px" }}
                                className="matchdtailsYesBackground gx-bg-flex gx-justify-content-center gx-align-items-center  gx-font-weight-bold gx-py-2 gx-px-1"
                                span={4}
                              >
                                -
                              </Col>
                              <Col
                                style={{ fontSize: "20px" }}
                                className="matchdtailsNoBackground gx-bg-flex gx-justify-content-center gx-align-items-center  gx-font-weight-bold gx-py-2 gx-px-1 rounded-r-xl"
                                span={4}
                              >
                                -
                              </Col>
                            </Row>
                            <Row
                              gutter={[20, 20]}
                              className=" gx-flex-wrap gx-mt-1  gx-d-flex gx-d-md-none gx-w-100 text-base gx-position-relative rounded-xl"
                            >
                              <Col
                                style={{
                                  borderStartStartRadius: "2rem",
                                  borderEndStartRadius: "2rem",
                                  fontSize: "20px",
                                }}
                                className="matchdtailsYesBackground gx-bg-flex gx-justify-content-center gx-align-items-center  gx-font-weight-bold  gx-px-1 rounded-l-xl"
                                span={4}
                              >
                                -
                              </Col>
                              <Col
                                style={{ fontSize: "20px" }}
                                className="matchdtailsNoBackground gx-bg-flex gx-justify-content-center gx-align-items-center  gx-font-weight-bold  gx-px-1"
                                span={4}
                              >
                                -
                              </Col>
                              <Col
                                style={{ fontSize: "20px" }}
                                className="matchdtailsYesBackground gx-bg-flex gx-justify-content-center gx-align-items-center  gx-font-weight-bold  gx-px-1"
                                span={4}
                              >
                                -
                              </Col>
                              <Col
                                style={{ fontSize: "20px" }}
                                className="matchdtailsNoBackground gx-bg-flex gx-justify-content-center gx-align-items-center  gx-font-weight-bold  gx-px-1"
                                span={4}
                              >
                                -
                              </Col>
                              <Col
                                style={{ fontSize: "20px" }}
                                className="matchdtailsYesBackground gx-bg-flex gx-justify-content-center gx-align-items-center  gx-font-weight-bold  gx-px-1"
                                span={4}
                              >
                                -
                              </Col>
                              <Col
                                style={{
                                  borderEndEndRadius: "2rem",
                                  borderStartEndRadius: "2rem",
                                  fontSize: "20px",
                                }}
                                className="matchdtailsNoBackground gx-bg-flex gx-justify-content-center gx-align-items-center  gx-font-weight-bold  gx-px-1 rounded-r-xl"
                                span={4}
                              >
                                -
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </>
                    ))
                    : <div className="gx-w-100 gx-text-center">No Match Found</div>}
                </div>
              </div>
              <div className=" gx-mt-2" >
                <div className="gx-fs-lg gx-px-1 gx-py-1 gx-font-weight-semi-bold gx-text-white gx-bg-grey">
                  Games
                </div>
                <Row
                  // justify={"space-between"}
                  className="grid grid-cols-3  lg:grid-cols-5 xl:grid-cols-6 md:grid-cols-4 gx-mt-4"
                  style={{

                    fontSize: "11px",
                  }}
                >


                  <Col
                    xs={8}
                    sm={6}
                    md={4}
                    lg={4}
                    className="gx-bg-flex gx-flex-column gx-text-center gx-align-items-center gx-justify-content-center"
                    onClick={() =>
                      handleCasinoOpen({
                        image: "/assets/images/aviator1.png",
                        name: "Aviator",
                        gameId: "201206",
                        nameHindi: "एविएटर",
                      })
                    }
                  >
                    <div style={{ width: "100px" }} className="gx-bg-flex  gx-flex-column gx-justify-content-center gx-align-items-center">
                      <img alt="inage" src="/assets/images/aviator1.png" className="gx-p-3 gx-bg-grey gx-rounded-circle" />
                      <div className="gx-font-weight-bold gx-text-black gx-text-center gx-text-uppercase gx-py-2">Aviator</div>
                    </div>

                  </Col>
                  <Col xs={8}
                    sm={6}
                    md={4}
                    lg={4}
                    onClick={() => handleCasinoOpen({ image: "/assets/images/int-casino/ludo.png", name: "Ludo", gameId: "600113", nameHindi: "लूडो" })}
                  >

                    <div style={{ width: "100px" }} className="gx-bg-flex gx-flex-column gx-justify-content-center gx-align-items-center">
                      <img alt="inage" src="/assets/images/int-casino/ludo.png" className="gx-p-3 gx-bg-grey gx-rounded-circle" />
                      <div className="gx-font-weight-bold gx-text-black gx-text-center gx-text-uppercase gx-py-2">LUDO</div>
                    </div>

                  </Col>

                  <Col xs={8}
                    sm={6}
                    md={4}
                    lg={4}
                     onClick={() => history.push("matka")}
                  >

                    <div style={{ width: "100px" }} className="gx-bg-flex gx-flex-column gx-justify-content-center gx-align-items-center">
                      <img alt="inage" src="/assets/Dashboard/matka.png" className="gx-p-3 gx-bg-grey gx-rounded-circle" />
                      <div className="gx-font-weight-bold gx-text-black gx-text-center gx-text-uppercase gx-py-2">Matka</div>
                    </div>

                  </Col>
                    {/* <Col
                        xs={8}
                        sm={6}
                        md={4}
                        lg={4}
                        onClick={() => history.push("matka")}
                        className="gx-bg-flex gx-flex-column gx-text-center gx-align-items-center gx-justify-content-center"
                      >
                        <img
                          style={{ width: "80px", height: "80px" }}
                          className="gx-rounded-circle"
                          alt=""
                          src="/images/CasinoImages/matka.png"
                        />
                        <div className="gx-font-weight-semi-bold">Matka</div>
                      </Col> */}



                  <Col xs={8}
                    sm={6}
                    md={4}
                    lg={4}
                  // onClick={() => handleCasinoOpen({ image: "/assets/images/int-casino/ludo.png", name: "Ludo", gameId: "600113", nameHindi: "लूडो" })}
                  >

                    <div style={{ width: "100px" }} className="gx-bg-flex gx-flex-column gx-justify-content-center gx-align-items-center">
                      {/* <img alt="inage" src="/assets/images/int-casino/ludo.png" className="gx-p-3 gx-bg-grey gx-rounded-circle" /> */}
                      <div className="gx-p-5 gx-bg-grey gx-fs-icon-lg gx-rounded-circle gx-text-white">O</div>
                      <div className="gx-font-weight-bold gx-text-black gx-text-center gx-text-uppercase gx-py-2">Other</div>
                    </div>

                  </Col>

                </Row>
              </div>




              <div className=" gx-mt-2" >
                <div className="gx-fs-lg gx-px-1 gx-py-1 gx-font-weight-semi-bold gx-text-white gx-bg-grey">
                  Live Casino
                </div>
                <Row
                  // justify={"space-between"}
                  className="grid grid-cols-3  lg:grid-cols-5 xl:grid-cols-6 md:grid-cols-4 gx-mt-4"
                  style={{

                    fontSize: "11px",
                  }}
                >
                  {/* <Col
                  xs={8}
                  sm={6}
                  md={4}
                  lg={4}
                  onClick={() => {
                    handleNavigate("ab2/3043");
                  }}
                  className="gx-bg-flex gx-align-items-center gx-flex-column gx-py-1 gx-justify-content-center"
                >
                  <img
                    style={{ width: "80px", height: "80px" }}
                    className=" gx-rounded-circle"
                    alt=""
                    src="/images/CasinoImages/abj.jpg"
                  />
                  <div className="gx-font-weight-bold gx-text-center">
                    Andar Bahar 2
                  </div>
                </Col> */}
                  <Col
                    xs={8}
                    sm={6}
                    md={4}
                    lg={4}
                    onClick={() => {
                      handleNavigate("teen20/3030");
                    }}
                    className="gx-bg-flex gx-align-items-center gx-flex-column gx-py-1 gx-justify-content-center"
                  >
                    <img
                      style={{ width: "80px", height: "80px" }}
                      className="gx-rounded-circle"
                      alt=""
                      src="/images/CasinoImages/teen20.jpg"
                    />
                    <div className="gx-font-weight-bold gx-text-center">
                      TeenPatti T20
                    </div>
                  </Col>
                  <Col
                    xs={8}
                    sm={6}
                    md={4}
                    lg={4}
                    onClick={() => {
                      handleNavigate("teen/3031");
                    }}
                    className="gx-bg-flex gx-align-items-center gx-flex-column gx-py-1 gx-justify-content-center"
                  >
                    <img
                      style={{ width: "80px", height: "80px" }}
                      className="gx-rounded-circle"
                      alt=""
                      src="/images/CasinoImages/teen.jpg"
                    />
                    <div className="gx-font-weight-bold gx-text-center">
                      TeenPatti ODI
                    </div>
                  </Col>
                  <Col
                    xs={8}
                    sm={6}
                    md={4}
                    lg={4}
                    onClick={() => {
                      handleNavigate("teen9/3048");
                    }}
                    className="gx-bg-flex gx-align-items-center gx-flex-column gx-py-1 gx-justify-content-center"
                  >
                    <img
                      style={{ width: "80px", height: "80px" }}
                      className="gx-rounded-circle"
                      alt=""
                      src="/assets/images/casino-images/rg_teen_patti.jpg"
                    />
                    <div className="gx-font-weight-bold gx-text-center">
                      TeenPatti Test
                    </div>
                  </Col>
                  <Col
                    xs={8}
                    sm={6}
                    md={4}
                    lg={4}
                    onClick={() => {
                      handleNavigate("lucky7/3032");
                    }}
                    className="gx-bg-flex gx-align-items-center gx-flex-column gx-py-1 gx-justify-content-center"
                  >
                    <img
                      style={{ width: "80px", height: "80px" }}
                      className=" gx-rounded-circle"
                      alt=""
                      src="/images/CasinoImages/lucky7eu.jpg"
                    />
                    <div className="gx-font-weight-bold gx-text-center">
                      Lucky7B
                    </div>
                  </Col>
                  <Col
                    xs={8}
                    sm={6}
                    md={4}
                    lg={4}
                    onClick={() => {
                      handleNavigate("aaa/3056");
                    }}
                    className="gx-bg-flex gx-align-items-center gx-flex-column gx-py-1 gx-justify-content-center"
                  >
                    <img
                      style={{ width: "80px", height: "80px" }}
                      className="gx-rounded-circle"
                      alt=""
                      src="/images/CasinoImages/aaa.jpg"
                    />
                    <div className="gx-font-weight-bold gx-text-center">
                      AAA
                    </div>
                  </Col>




                  <Col
                    xs={8}
                    sm={6}
                    md={4}
                    lg={4}
                    onClick={() => {
                      handleNavigate("dt20/3035");
                    }}
                    className="gx-bg-flex gx-align-items-center gx-flex-column gx-py-1 gx-justify-content-center"
                  >
                    <img
                      style={{ width: "80px", height: "80px" }}
                      className="gx-rounded-circle"
                      alt=""
                      src="/images/CasinoImages/dt20.jpg"
                    />
                    <div className="gx-font-weight-bold gx-text-center">
                      Dragon Tiger
                    </div>
                  </Col>
                  <Col
                    xs={8}
                    sm={6}
                    md={4}
                    lg={4}
                    onClick={() => {
                      handleNavigate("dt202/3059");
                    }}
                    className="gx-bg-flex gx-align-items-center gx-flex-column gx-py-1 gx-justify-content-center"
                  >
                    <img
                      style={{ width: "80px", height: "80px" }}
                      className="gx-rounded-circle"
                      alt=""
                      src="/images/CasinoImages/dt20.jpg"
                    />
                    <div className="gx-font-weight-bold gx-text-center">
                      Dragon Tiger 2
                    </div>
                  </Col>



                  <Col
                    xs={8}
                    sm={6}
                    md={4}
                    lg={4}
                    onClick={() => {
                      handleNavigate("ab2/3043");
                    }}
                    className="gx-bg-flex gx-align-items-center gx-flex-column gx-py-1 gx-justify-content-center"
                  >
                    <img
                      style={{ width: "80px", height: "80px" }}
                      className="gx-rounded-circle"
                      alt=""
                      src="/images/CasinoImages/abj.jpg"
                    />
                    <div className="gx-font-weight-bold gx-text-center">
                      Andar Bahar 2
                    </div>
                  </Col>





                  <Col
                    xs={8}
                    sm={6}
                    md={4}
                    lg={4}
                    className="gx-bg-flex gx-flex-column gx-text-center gx-align-items-center gx-justify-content-center"
                  >
                    <img
                      onClick={() => history.push("card32-a/3055")}
                      style={{ width: "80px", height: "80px" }}
                      className="gx-rounded-circle"
                      alt=""
                      src="/assets/images/casino-images/32-Cards-B.jpg"
                    />
                    <div className="gx-font-weight-semi-bold">Card 32 A</div>
                  </Col>
                  <Col
                    xs={8}
                    sm={6}
                    md={4}
                    lg={4}
                    className="gx-bg-flex gx-flex-column gx-text-center gx-align-items-center gx-justify-content-center"
                  >
                    <img
                      onClick={() => history.push("card32eu/3034")}
                      style={{ width: "80px", height: "80px" }}
                      className="gx-rounded-circle"
                      alt=""
                      src="/assets/images/casino-images/32cards.png"
                    />
                    <div className="gx-font-weight-semi-bold">Card 32 B</div>
                  </Col>

                   <Col
                        xs={8}
                        sm={6}
                        md={4}
                        lg={4}
                        className="gx-bg-flex gx-flex-column gx-mt-2 gx-text-center gx-align-items-center gx-justify-content-center"
                      >
                        <img
                          onClick={() => history.push("worli2/3054")}
                          style={{ width: "80px", height: "80px" }}
                          className="gx-rounded-circle"
                          alt=""
                          src="/images/CasinoImages/Matka.webp"
                        />
                        <div className="gx-font-weight-semi-bold">Worli Matka</div>
                      </Col>
                </Row>
              </div>
         


              {settings.internationalCasino === true && (
                <div>

                  <div className=" gx-mt-2">
                    <div className="gx-fs-lg gx-px-1 gx-py-1 gx-font-weight-semi-bold gx-text-white gx-bg-grey">
                      International Casino
                    </div>
                    <Row className="gx-py-1 gx-mt-4 gx-mx-1" style={{

                      fontSize: "11px",
                    }}>

                      {sortedLiveCasinoList?.map((casino) => (
                        <Col key={casino.gameId} className='gx-px-0 gx-mb-0' xs={8}
                          sm={6}
                          md={4}
                          lg={4}>
                          <div onClick={() => {
                            window.location.href = `/main/iframe-casino/${casino.gameId}`;
                          }}
                            className="gx-bg-flex gx-flex-column gx-justify-content-center  gx-align-items-center">
                            <img alt="inage" src={casino.img} className="gx-p-3  gx-rounded-circle"  height={120} width={120}/>
                              <div className="gx-font-weight-bold gx-text-black gx-text-center gx-text-uppercase ">{casino?.casinoName}</div>
                            
                          </div>
                        </Col>
                      ))}

                      {/* <Col
                        xs={8}
                        sm={6}
                        md={4}
                        lg={4}
                        className="gx-bg-flex gx-flex-column gx-text-center gx-align-items-center gx-justify-content-center"
                        onClick={() =>
                          handleCasinoOpen({
                            image: "/assets/Dashboard/aviator.png",
                            name: "Aviator",
                            gameId: "201206",
                            nameHindi: "एविएटर",
                          })
                        }
                      >
                        <div style={{ width: "100px" }} className="gx-bg-flex  gx-flex-column gx-justify-content-center gx-align-items-center">
                          <img alt="inage" src="/assets/Dashboard/aviator.png" className="gx-p-3 gx-bg-grey gx-rounded-circle" />
                          <div className="gx-font-weight-bold gx-text-black gx-text-center gx-text-uppercase gx-py-2">Aviator</div>
                        </div>
                      
                      </Col>


                      <Col xs={8}
                        sm={6}
                        md={4}
                        lg={4} onClick={() => handleCasinoOpen({ image: "/assets/Dashboard/rg-casino.png", name: "IntCasino", gameId: "900000", nameHindi: "एविएटर" })}>

                        <div style={{ width: "100px" }} className="gx-bg-flex  gx-flex-column gx-justify-content-center gx-align-items-center">
                          <img alt="inage" src="/assets/Dashboard/rg-casino.png" className="gx-p-3 gx-bg-grey gx-rounded-circle" />
                          <div className="gx-font-weight-bold gx-text-black gx-text-center gx-text-uppercase gx-py-2">RG casino</div>
                        </div>

                      </Col>






                      <Col xs={8}
                        sm={6}
                        md={4}
                        lg={4}
                        onClick={() => handleCasinoOpen({ image: "/assets/Dashboard/ludo.png", name: "Ludo", gameId: "600113", nameHindi: "लूडो" })}
                      >

                        <div style={{ width: "100px" }} className="gx-bg-flex gx-flex-column gx-justify-content-center gx-align-items-center">
                          <img alt="inage" src="/assets/Dashboard/ludo.png" className="gx-p-3 gx-bg-grey gx-rounded-circle" />
                          <div className="gx-font-weight-bold gx-text-black gx-text-center gx-text-uppercase gx-py-2">LUDO</div>
                        </div>

                      </Col>

                      <Col xs={8}
                        sm={6}
                        md={4}
                        lg={4} onClick={() => handleCasinoOpen({ image: "/assets/Dashboard/int-casino.png", name: "Casino", gameId: "0", nameHindi: "कैसीनो" })}>

                        <div style={{ width: "100px" }} className="gx-bg-flex gx-flex-column gx-justify-content-center gx-align-items-center">
                          <img alt="inage" src="/assets/Dashboard/int-casino.png" className="gx-p-3 gx-bg-grey gx-rounded-circle" />
                          <div className="gx-font-weight-bold gx-text-black gx-text-center gx-text-uppercase gx-py-2">Int casino</div>
                        </div>

                      </Col> */}

                    </Row>
                  </div>
                </div>
              )}

                   {settings.virtuleGame === true && (
                <div>
                  <div className=" gx-mt-2">
                    <div className="gx-fs-lg gx-px-1 gx-py-1 gx-font-weight-semi-bold gx-text-white gx-bg-grey">
                      Virtual Casino
                    </div>
                    <Row className="gx-py-1 gx-mt-4" style={{

                      fontSize: "11px",
                    }}>
                      <Col
                        xs={8}
                        sm={6}
                        md={4}
                        lg={4}
                        className="gx-bg-flex gx-flex-column gx-text-center gx-align-items-center gx-justify-content-center"

                      >
                        <img
                         onClick={() => {
                            window.location.href = `/main/iframe-casino/${901001}`;
                          }}
                          style={{ width: "80px", height: "80px" }}
                          className="gx-rounded-circle"
                          alt=""
                          src="/assets/images/int-casino/rg_7up.webp"
                        />
                        <div className="gx-font-weight-semi-bold">7 Up Down</div>
                      </Col>
                      <Col
                        xs={8}
                        sm={6}
                        md={4}
                        lg={4}
                        className="gx-bg-flex gx-flex-column gx-text-center gx-align-items-center gx-justify-content-center "
                      >
                       
                        <img
                         onClick={() => {
                            window.location.href = `/main/iframe-casino/${901005}`;
                          }}
                         
                          style={{ width: "80px", height: "80px" }}
                          className="gx-rounded-circle"
                          alt=""
                          src="/assets/images/int-casino/rg_cric_war_vr.webp"
                        />
                        <div className="gx-font-weight-semi-bold gx-font-[12px]">
                          Cricket war
                        </div>
                      </Col>

                      <Col
                        xs={8}
                        sm={6}
                        md={4}
                        lg={4}
                        className="gx-bg-flex gx-flex-column gx-text-center gx-align-items-center gx-justify-content-center "
                      >
                       
                        <img
                        onClick={() => {
                            window.location.href = `/main/iframe-casino/${901013}`;
                          }}
                        
                          style={{ width: "80px", height: "80px" }}
                          className="gx-rounded-circle"
                          alt=""
                          src="/assets/images/int-casino/rg_dus_kadum_vr.webp"
                        />
                        <div className="gx-font-weight-semi-bold gx-font-[12px]">
                         Dus Kadum
                        </div>
                      </Col>

                       <Col xs={8} sm={6} md={4} lg={4} className="gx-bg-flex gx-flex-column gx-text-center gx-align-items-center gx-justify-content-center ">
                       
                        <img
                         onClick={() => {
                            window.location.href = `/main/iframe-casino/${230026}`;
                          }}
                        
                     
                          style={{ width: "80px", height: "80px" }}
                          className="gx-rounded-circle"
                          alt=""
                          src="/assets/images/int-casino/leprechauns_luck__cash_collect_megaways.webp"
                        />
                        <div className="gx-font-weight-semi-bold gx-font-[12px]">
                          LLCCM
                        </div>
                      </Col>
                       <Col xs={8} sm={6} md={4} lg={4} className="gx-bg-flex gx-flex-column gx-text-center gx-align-items-center gx-justify-content-center ">
                       
                        <img
                         onClick={() => {
                            window.location.href = `/main/iframe-casino/${230024}`;
                          }}
                        
                     
                          style={{ width: "80px", height: "80px" }}
                          className="gx-rounded-circle"
                          alt=""
                          src="/assets/images/int-casino/macabra_linx.webp"
                        />
                        <div className="gx-font-weight-semi-bold gx-font-[12px]">
                          Macabra Linx  
                        </div>
                      </Col>
                       <Col xs={8} sm={6} md={4} lg={4} className="gx-bg-flex gx-flex-column gx-text-center gx-align-items-center gx-justify-content-center ">
                       
                        <img
                         onClick={() => {
                            window.location.href = `/main/iframe-casino/${230025}`;
                          }}
                        
                     
                          style={{ width: "80px", height: "80px" }}
                          className="gx-rounded-circle"
                          alt=""
                          src="/assets/images/int-casino/oink_oink_oink.webp"
                        />
                        <div className="gx-font-weight-semi-bold gx-font-[12px]">
                          OOO 
                        </div>
                      </Col>
                       <Col xs={8} sm={6} md={4} lg={4} className="gx-bg-flex gx-flex-column gx-text-center gx-align-items-center gx-justify-content-center ">
                       
                        <img
                         onClick={() => {
                            window.location.href = `/main/iframe-casino/${230029}`;
                          }}
                        
                     
                          style={{ width: "80px", height: "80px" }}
                          className="gx-rounded-circle"
                          alt=""
                          src="/assets/images/int-casino/samba start.webp"
                        />
                        <div className="gx-font-weight-semi-bold gx-font-[12px]">
                          Samba Start
                        </div>
                      </Col>
                       <Col xs={8} sm={6} md={4} lg={4} className="gx-bg-flex gx-flex-column gx-text-center gx-align-items-center gx-justify-content-center ">
                       
                        <img
                         onClick={() => {
                            window.location.href = `/main/iframe-casino/${230070}`;
                          }}
                        
                     
                          style={{ width: "80px", height: "80px" }}
                          className="gx-rounded-circle"
                          alt=""
                          src="/assets/images/int-casino/sweet_bonanza_1000.webp"
                        />
                        <div className="gx-font-weight-semi-bold gx-font-[12px]">
                          Book Futuria   
                        </div>
                      </Col>
                       <Col xs={8} sm={6} md={4} lg={4} className="gx-bg-flex gx-flex-column gx-text-center gx-align-items-center gx-justify-content-center ">
                       
                        <img
                         onClick={() => {
                            window.location.href = `/main/iframe-casino/${230027}`;
                          }}
                        
                     
                          style={{ width: "80px", height: "80px" }}
                          className="gx-rounded-circle"
                          alt=""
                          src="/assets/images/int-casino/veils_of_venice.webp"
                        />
                        <div className="gx-font-weight-semi-bold gx-font-[12px]">
                          VOV
                        </div>
                      </Col>
                      
                    </Row>
                  </div>
                </div>)}
            </Col>
          </Row>
        </UrbetLayout>
      )}
    </>
  );
};
export default Dashboard;
