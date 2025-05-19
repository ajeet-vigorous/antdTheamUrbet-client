import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { httpPost } from "../../../http/http";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { Button, Col, Modal, Row, Select } from "antd";
import BetListTableMatka from "./BatListTableMatka";
import PlaceBetMobileBmx from "../../../components/casino_components/PlaceBetMobileBmx/PlaceBetMobileBmx";
import PlaceBetMobileBmxBet from "../../../components/casino_components/PlaceBetMobileBmxBet/PlaceBetMobileBmxBet";
import MatkaMessage from "./MatkaMessage";
import RightSidebar from "../../../components/RightSidebar/RightSidebar";
import LeftSidebar from "../../../components/LeftSidebar/LeftSidebar";
import { userBalance } from "../../../appRedux/actions/User";

const Matka = (props) => {
  const [selectedGame, setSelectedGame] = useState('');
  const [sattaList, setSattaList] = useState({});
  const [domainSettingByDomainName, setDomainSettingByDomainName] = useState(null);
  const [message, setMessage] = useState("");
  const [betChipsData, setBetChipsData] = useState([]);
  const [error, setError] = useState("");
  const [betSlipData, setBetSlipData] = useState({});
  const [backBetModal, setBackBetModal] = useState(false);
  const [backBetModalMobile, setBackBetModalMobile] = useState(false);
  const [time, setTime] = useState(7);
  const [isFetch, setIsFetch] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorType, setErrorType] = useState(0);
  const [resMessage, setResMessage] = useState("");
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);
  const [betList, setBetList] = useState([]);
  const [LoadingBet, setLoadingBet] = useState(false);
  const [betresponse, setBetresponse] = useState(null);
  const section1Ref = useRef();
  const scrollTimeout = useRef(null);
  const inputRef = useRef();
  const [activeTab, setActiveTab] = useState(0)

  const dispatch = useDispatch();

  const params = useParams()
  useEffect(() => {
    getDomainSettingByDomainName();
    const marketEvent = {
      "matkaEventId": params.marketEvent
    };
    getMatkaList(marketEvent);
    betListFunction(marketEvent);
    betChipData();
    checkWindowWidth();
  }, [params.marketEvent]);

  const checkWindowWidth = () => {
    const isMobile = window.matchMedia('(max-width: 100vw)').matches;
    if (isMobile && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 0);
    }
  };

  const getDomainSettingByDomainName = () => {
    try {
      let domainSetting = localStorage.getItem('domainSettingByDomainName');
      if (domainSetting) {
        const parsedDomainSetting = JSON.parse(domainSetting);
        setDomainSettingByDomainName(parsedDomainSetting);
      } else {
        setDomainSettingByDomainName(null);
      }
    } catch {
      console.error('Error parsing domainSettingByDomainName:');
      setDomainSettingByDomainName(null);
    }
  };

  const betChipData = async () => {
    try {
      let betChipsDatas = JSON.parse(localStorage.getItem('betChipsData'));
      const myArray = betChipsDatas && Object.keys(betChipsDatas).length > 0 ? Object.values(betChipsDatas) : Object.values(betChipsData);
      setBetChipsData(myArray);
    } catch (error) {
      console.error('Error parsing JSON from localStorage: betChipsDatas', error);
      setBetChipsData(betChipsData);
    }
  };

  const getMatkaList = async (matkaEventId) => {
    // setIsFetch(true);
    let sattaList = await httpPost('matka/getMatkaByMatkaEventId', matkaEventId);
    if (sattaList) {
      setSattaList(sattaList.data ? sattaList?.data : {});
    } else {
      setShowAlert(true);
      setErrorType(1);
      setResMessage("Something went wrong");
    }
    // setIsFetch(false);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleGameChange = (event) => {
    setSelectedGame(event.target.value);
  };

  const handleBackOpen = (data, sectionRef) => {
    if (scrollTimeout.current) {
      clearInterval(scrollTimeout.current);
    }
    setBackBetModal(true);
    setBackBetModalMobile(true);
    setBetSlipData({ ...data, stake: "0" });
    setTime(7);
    scrollTimeout.current = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 0) {
          clearInterval(scrollTimeout.current);
          setBackBetModal(false);
        }
        return prevTime - 1;
      });
    }, 1000);
    setTimeout(() => {
      if (sectionRef && sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: 'smooth' });
        if (window.innerWidth <= 768 && inputRef.current && sectionRef && sectionRef.current) {
          sectionRef.current.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            inputRef.current.focus();
          }, 0);
        }
      }
    }, 0);
  };

  const updateStake = (event) => {
    try {
      let { value } = event.target;
      if (value.startsWith('0') && value.length > 1) {
        value = value.slice(1);
      }
      setBetSlipData(prevBetSlipData => ({
        ...prevBetSlipData,
        stake: value,
      }));
    } catch (error) {
      console.error('Error updating stake:', error);
    }
  };

  const updateStackOnclick = (num) => {
    setBetSlipData(prevBetSlipData => ({
      ...prevBetSlipData,
      stake: num,
    }));
  };

  const inputChange = (event) => {
    const { name, value } = event.target;
    setBetSlipData(prevBetSlipData => ({
      ...prevBetSlipData,
      [name]: Number(value),
    }));
  };

  const betListFunction = async (eventId) => {
    let betReq = {
      "matkaEventId": eventId?.matkaEventId,
      fromDate: moment().format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
      isDeleted: false,
      isDeclare: false,
    };

    let getCasinoDetails = await httpPost(`matka/matkaBetList`, betReq);
    let totalProfitLoss = 0;
    let betList = getCasinoDetails?.data;
    if (betList && betList.length > 0) {
      betList.map((bet) => {
        totalProfitLoss += Number(bet.profitLoss);
      });
    }
    if (getCasinoDetails) {
      setBetList(betList);
      setTotalProfitLoss(totalProfitLoss);
    }
  };

  const placeBet = async () => {
    setLoadingBet(true);
    let t1 = betSlipData?.data?.t1?.[0] || {};
    
    console.log(betSlipData, "betSlipData");

    let betObject = {
      "matkaEventId": betSlipData?.data?.matkaEventId,
      "gameType": betSlipData?.gameType,
      "betType": betSlipData?.betType,
      "betNumber": betSlipData?.betNumber,
      "amount": Number(betSlipData.stake)
    };

    // const result = await httpPost("matka/matkaPlaceBet", betObject);
    // if (result) {
    //   if (!result.error) {
    //     console.log(result, "resultresultresultresultresultresult");

    //     setBetresponse(result.data);
    //     setIsFetch(true);
    //     setMessage(result?.message);
    //     setError(false);
    //     setTimeout(() => {
    //       setIsFetch(false);
    //     }, 3000);
    //     betListFunction(params.eventId);
    //     // dispatch(userActions.getUserBalance());
    //   } else {
    //     console.log(result, "12132134234");
    //     setIsFetch(true);
    //     setMessage(result?.data?.message);
    //     setError(true);
    //     setTimeout(() => {
    //       setIsFetch(false);
    //     }, 3000);
    //   }
    // }

    try {
      const result = await httpPost("matka/matkaPlaceBet", betObject);
      if (result) {
        if (!result?.data.error) {
          setBetresponse(result.data);
          setIsFetch(true);
          setMessage(result?.message);
          setError(false);
          setTimeout(() => {
            setIsFetch(false);
          }, 3000);
          betListFunction(params.eventId);
          dispatch(userBalance())
        } else {
          setIsFetch(true);
          setMessage(result?.data?.message);
          setError(true);
          setTimeout(() => {
            setIsFetch(false);
          }, 3000);
        }
      }
    } catch (error) {

      setIsFetch(true);
      setMessage("An error occurred while placing the bet.");
      setError(true);
      setTimeout(() => {
        setIsFetch(false);
      }, 3000);
    }

    handleClose();
    setLoadingBet(false);
  };

  const handleClose = () => {
    setBackBetModal(false);
    setBackBetModalMobile(false);
    setTime(0)
  };

  const handleBetStatus = () => {
    setIsFetch(true);
    setTimeout(() => {
      setIsFetch(false);
      setMessage("Your Bet is Closed Please Connect With Upline");
      setError(true);
    }, 3000);
  };

  const handleBetBlock = () => {
    setIsFetch(true);
    setMessage("Matka Bet Timeout");
    setError(true);
    setTimeout(() => {
      setIsFetch(false);
    }, 3000);
  };

  const toastClose = () => {
    setIsFetch(false);
  };

  const onClickMenu = (url) => {
    props.history.push(url);
  };


  const cards = Array.from({ length: 100 }, (_, index) => index + 1);
  const cardData = Array.from({ length: 10 }, (_, index) => index);


  const handleChange = (value) => {
    setActiveTab(value)
  };





  // const getMatkaPosition = (cardNumber, gameType, matkaName) => {
  //   const bets = betList.filter((betItem) => betItem.betNumber === cardNumber && betItem.gameType === gameType && betItem.matkaName == matkaName);

  //   if (bets.length > 0) {
  //     let totalBetAmount = 0;
  //     betList.filter((betItem) => betItem.gameType === gameType && betItem.matkaName === matkaName).forEach((bet) => { totalBetAmount += Number(bet.amount) });
  //     const totalProfit = bets.reduce((sum, bet) => sum + bet.profit, 0);
  //     const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);

 
      
  //     return totalProfit > 0 ? totalProfit - totalBetAmount : totalAmount;
  //   } else {
  //     let totalAmountForGameType = 0;
  //     betList.filter((betItem) => betItem.gameType === gameType && betItem.matkaName === matkaName).forEach((bet) => { totalAmountForGameType += Number(bet.amount) });
  //     return -totalAmountForGameType;
  //   }
  // };

  

  const getMatkaPosition = (cardNumber, gameType, matkaName) => {
    const bets = betList.filter((betItem) => betItem.betNumber === cardNumber && betItem.gameType === gameType && betItem.matkaName == matkaName);
    
    if (bets.length > 0) {
      let totalBetAmount = 0;
      betList.filter((betItem) => betItem.gameType === gameType && betItem.matkaName === matkaName).forEach((bet) => { totalBetAmount += Number(bet.amount) });
      
      const totalProfit = bets.reduce((sum, bet) => sum + bet.profit, 0);
      const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
  
      const firstBetForGameType = betList.filter((betItem) => betItem.gameType === gameType && betItem.matkaName == matkaName).length == bets.length;
  
      // console.log(totalProfit, "4444444");
      // console.log(totalBetAmount, "44444");
      // console.log(totalAmount, "444444");
      
      if (firstBetForGameType) {
        return totalProfit > 0 ? totalProfit  : totalAmount;
      } else {
        return totalProfit > 0 ? totalProfit - totalBetAmount : totalAmount;
      }
    } else {
      let totalAmountForGameType = 0;
      betList.filter((betItem) => betItem.gameType === gameType && betItem.matkaName === matkaName).forEach((bet) => { totalAmountForGameType += Number(bet.amount) });
      return -totalAmountForGameType;
    }
  };
  



  return (
    <Row style={{ overflow: "hidden" }} justify={"space-between"}>
      <Col
        xs={24}
        md={24}
        lg={5}
        xl={5}
        xxl={3}
        className=" gx-d-none gx-d-lg-block gx-px-1 gx-mx-0"
      >
        <LeftSidebar />
      </Col>






      <Col style={{ paddingInline: "2px" }} xs={24} md={24} lg={12} xl={12} xxl={16} className="">
        <>
          {
            isFetch ?
              <MatkaMessage message={message} toastClose={toastClose} error={error} /> : null
          }

          <div className="gx-bg-grey w-full gx-py-3 gx-text-white gx-px-3 gx-fs-md  gx-bg-flex gx-justify-content-between">

            <div>Satta</div>
            <div>{moment().format("DD-MMM-YYYY hh:mm a")}</div>

          </div>
          <Row className="gx-px-3" justify={"center"}>
            <Col style={{ backgroundColor: "rgb(49, 116, 94)" }} xs={12} onClick={() => { handleChange(1) }} className="gx-bg-flex gx-text-uppercase gx-px-4 gx-py-2 gx-text-white gx-text-nowrap gx-fs-lmd  gx-font-weight-normal gx-justify-content-center " >

              Single Patti
            </Col>
            <Col style={{ backgroundColor: "rgb(49, 116, 94)" }} onClick={() => { handleChange(2) }} xs={12} className="gx-bg-flex gx-text-uppercase gx-px-4 gx-py-2 gx-text-white   gx-fs-lmd gx-font-weight-normal gx-justify-content-center" >

              Harup Andar Bahar
            </Col>
          </Row>

          <div className="gx-bg-white gx-py-2">
            <div className="gx-bg-flex gx-justify-content-center gx-fs-xl">


              {sattaList?.shortName}-{moment().format("DD-MM-YYYY")}</div>
            <div onClick={() => { handleChange(1) }} className="gx-d-flex gx-text-grey gx-flex-row gx-text-uppercase  gx-px-3 gx-py-2 gx-fs-xl   gx-justify-content-md-center gx-align-items-center " >

              <span className="gx-px-2">Open Time :   {`${moment().format("DD-MM-YYYY")} ${moment(sattaList?.showOpenTime, "HH:mm").format("hh:mm A")}`}
              &nbsp; |
                Close Time : {sattaList?.extendedCloseDay === 0 ? `${moment().format("DD-MM-YYYY")} ${moment(sattaList?.showCloseTime, "HH:mm").format("hh:mm A")}` : `${moment().add(1, 'days').format("DD-MM-YYYY")} ${moment(sattaList?.showCloseTime, "HH:mm").format("hh:mm A")}`

                }

              </span>
              {/* <div>Result Time : {sattaList?.resultTime ? sattaList?.resultTime : "-"}</div>
            <div>Min Stake : {sattaList?.minStake ? sattaList?.minStake : "-"}</div>
            <div>Max Stake : {sattaList?.maxStake ? sattaList?.maxStake : "-"}</div> */}
            </div>

          </div>

          {activeTab === 1 && <Row className="gx-mx-1" justify={"center"}>
            <Col xs={24} >
              <Row className="gx-bg-flex  gx-bg-grey gx-my-2 gx-py-2 gx-justify-content-center gx-align-items-center gx-text-uppercase" >
                <span className="gx-fs-lg gx-font-weight-heavy gx-text-white">Single Patti</span>
              </Row>
              <Row gutter={[20, 20]} >
                {cards.map((card, index) => (
                  <Col key={index} className="gx-text-center" xs={12} sm={8} md={6}>
                    {sattaList?.betStatus === true ?
                      <>
                        {sattaList?.jodiBet === true ?
                          <div
                            className="gx-fs-lg gx-rounded-sm gx-py-3 gx-text-white "
                            onClick={() => handleBackOpen({ data: sattaList, gameType: "JODI", betType: "JODI", betNumber: card.toString().padStart(2, "0"), },)}
                            style={{ backgroundColor: "#008080" }} >
                            {card.toString().padStart(2, "0")}
                          </div>
                          :
                          <div
                            onClick={() => handleBetBlock()}
                            // onClick={() => alert(" Single Patti betStatus == false, Matka Bet Timeout")}

                            className="gx-fs-lg gx-rounded-sm gx-py-3 gx-text-white "
                            style={{ backgroundColor: "#008080" }}>
                            {card.toString().padStart(2, "0")}
                          </div>
                        }
                      </> :
                      <div
                        onClick={() => handleBetStatus()}
                        // onClick={() => alert(" Single Patti betStatus == false, Your Bet is Closed Please Connect With Upline")}
                        className="gx-fs-lg gx-rounded-sm gx-py-3 gx-text-white "
                        style={{ backgroundColor: "#008080" }}>
                        {card.toString().padStart(2, "0")}
                      </div>
                    }


                    <div className={`gx-py-1 ${getMatkaPosition(card, "JODI", sattaList?.shortName) > 0 ? 'gx-text-green-0' : 'gx-text-red'}`}>
                      {getMatkaPosition(card, "JODI", sattaList?.shortName,)}
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
          }
          {activeTab === 2 && <Row justify={"center"}>
            <Col xs={24} >
              <Row
                className="gx-bg-flex gx-bg-grey gx-my-2 gx-py-2 gx-mx-2 gx-justify-content-center gx-align-items-center"
                justify={"center"}
              >
                <span className="gx-fs-lg gx-font-weight-semi-bold gx-text-white gx-text-uppercase">
                  Harup Ander
                </span>
              </Row>
              <Row justify={"start"} gutter={[8, 8]} className="gx-bg-flex gx-w-100 gx-mx-2" align="middle">
                {cardData.map((card) => (
                  <Col key={card} xs={12} sm={12} md={8} lg={6} className="gx-py-1 gx-text-center">
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        borderRadius: '4px',
                        backgroundColor: '#008080',
                        textAlign: 'center',
                        padding: '8px',
                      }}
                    >
                      {sattaList?.betStatus ? (
                        <>
                          {sattaList?.openBet ? (
                            <div
                              style={{ fontSize: '18px', borderRadius: '4px', color: '#fff' }}
                              onClick={() =>
                                handleBackOpen({
                                  data: sattaList,
                                  gameType: 'HAROOP_ANDAR',
                                  betType: 'HAROOP_ANDAR',
                                  betNumber: card.toString().padStart(1, '0'),
                                })
                              }
                            >
                              {card.toString().padStart(2, '0')}
                            </div>
                          ) : (
                            <div
                              style={{ fontSize: '18px', borderRadius: '4px', color: '#fff' }}
                              onClick={handleBetBlock}
                            >
                              {card.toString().padStart(2, '0')}
                            </div>
                          )}
                        </>
                      ) : (
                        <div
                          style={{ fontSize: '18px', borderRadius: '4px', color: '#fff' }}
                          onClick={handleBetStatus}
                        >
                          {card.toString().padStart(2, '0')}
                        </div>
                      )}
                    </div>
                    <div className={`gx-py-1 ${getMatkaPosition(card, "HAROOP_ANDAR", sattaList?.shortName) > 0 ? 'gx-text-green-0' : 'gx-text-red'}`}>
                      {getMatkaPosition(card, "HAROOP_ANDAR", sattaList?.shortName)}
                    </div>
                  </Col>
                ))}
              </Row>

              <Row
                className="gx-bg-flex gx-bg-grey gx-my-2 gx-py-2 gx-mx-2 gx-justify-content-center gx-align-items-center"
                justify={"center"}
              >
                <div className="gx-fs-lg gx-font-weight-semi-bold gx-text-white gx-text-uppercase">
                  Harup Bahar
                </div>
              </Row>

              <Row justify={"start"} gutter={[8, 8]} className="gx-bg-flex gx-w-100 gx-mx-2 gx-align-items-center">
                {cardData.map((card) => (
                  <Col key={card} xs={12} sm={12} md={8} lg={6} className="gx-py-1 gx-w-100 gx-text-center">
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        borderRadius: '4px',
                        backgroundColor: '#008080',
                        textAlign: 'center',
                        padding: '8px',
                      }}
                    >
                      {sattaList?.betStatus ? (
                        <>
                          {sattaList?.closeBet ? (
                            <div
                              style={{ fontSize: '18px', borderRadius: '4px', color: '#fff' }}
                              onClick={() =>
                                handleBackOpen({
                                  data: sattaList,
                                  gameType: 'HAROOP_BAHAR',
                                  betType: 'HAROOP_BAHAR',
                                  betNumber: card.toString().padStart(1, '0'),
                                })
                              }
                            >
                              {card.toString().padStart(2, '0')}
                            </div>
                          ) : (
                            <div
                              style={{ fontSize: '18px', borderRadius: '4px', color: '#fff' }}
                              onClick={handleBetBlock}
                            >
                              {card.toString().padStart(2, '0')}
                            </div>
                          )}
                        </>
                      ) : (
                        <div
                          style={{ fontSize: '18px', borderRadius: '4px', color: '#fff' }}
                          onClick={handleBetStatus}
                        >
                          {card.toString().padStart(2, '0')}
                        </div>
                      )}
                    </div>
                    <div className={`gx-py-1 ${getMatkaPosition(card, "HAROOP_BAHAR", sattaList?.shortName) > 0 ? 'gx-text-green-0' : 'gx-text-red'}`}>
                      {getMatkaPosition(card, "HAROOP_BAHAR", sattaList?.shortName)}
                    </div>
                  </Col>
                ))}
              </Row>


            </Col>
          </Row>}

          {backBetModal === true ?
            <PlaceBetMobileBmx
              betSlipData={betSlipData}
              time={time}
              count={betSlipData?.betNumber}
              betChipsData={betChipsData}
              section1Ref={section1Ref}
              inputRef={inputRef}
              updateStake={updateStake}
              placeBet={placeBet}
              updateStackOnclick={updateStackOnclick}
              handleClose={handleClose}
              LoadingBet={LoadingBet}
            />
            : null}



          {/* <div className="gx-my-2">
        <BetListTableMatka betList={betList} />
      </div> */}
        </>
      </Col>


















      <Col
        xs={24}
        md={24}
        lg={7}
        xl={7}
        xxl={5}
        className="gx-d-none gx-d-lg-block gx-px-2 gx-mx-0"
      >
        {backBetModal === true ?
          <PlaceBetMobileBmxBet
            betSlipData={betSlipData}
            time={time}
            count={betSlipData?.betNumber}
            betChipsData={betChipsData}
            section1Ref={section1Ref}
            inputRef={inputRef}
            updateStake={updateStake}
            placeBet={placeBet}
            updateStackOnclick={updateStackOnclick}
            handleClose={handleClose}
            LoadingBet={LoadingBet}
          />
          : null}

        <RightSidebar
          matkaBetList={betList}
        // IncompleteddataList={IncompleteddataList}
        // IncompltedBetsColumn={IncompltedBetsColumn}
        // mybetsData={mybetsData}
        // mybets={mybets}
        />
      </Col>
    </Row>
  );
};

export default Matka;