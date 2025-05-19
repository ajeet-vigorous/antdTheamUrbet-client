import { Col, message, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { NotificationContainer, NotificationManager } from "react-notifications";
const generateRandomWinners = () => {
  return Array(10)
    .fill(null)
    .map(() => ( Math.random() < 0.4 ? 'H' : Math.random() < 0.8 ? 'L' : 7));
};
const UpDown7 = () => {
  const [counter, setCounter] = useState(60);
  const [betOpen, setBetOpen] = useState(true);
  const [matchId, setMatchId] = useState(Math.floor(100000 + Math.random() * 900000));
  const [dummyData, setDummyData] = useState([]);
  const [card , setCard] =  useState(null)
  const [winners, setWinners] = useState(generateRandomWinners()); 
 
  // Function to generate new data
  function generateDummyData(matchId) {
    const data = [];
    let localCounter = 60;
    let localBetOpen = true;

    for (let i = 0; i < 60; i++) {
      if (localCounter <= 5) {
        localBetOpen = false;
      }

      data.push({
        type: "single_digit_counter",
        match_id: matchId,
        counter: localCounter,
        bet_open: localBetOpen,
      });

      localCounter -= 1;
    }

    return data;
  }

  // Start countdown
  useEffect(() => {
    let interval;

    if (counter > 0) {
      interval = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
        if (counter <= 6) setBetOpen(false); // Close betting after counter hits 5
      }, 1000);
    } else {
      // When counter reaches 0, wait for 10 seconds and restart
      clearInterval(interval);
      setTimeout(() => {
        const newMatchId = Math.floor(100000 + Math.random() * 900000); // Generate new match ID
        setMatchId(newMatchId);
        setDummyData(generateDummyData(newMatchId));
        setCounter(60);
        setBetOpen(true);
      }, 10000); // Wait 10 seconds before restarting the loop
    }

    return () => clearInterval(interval); // Cleanup on component unmount or before restarting interval
  }, [counter]);

  // Generate initial data on first render
  useEffect(() => {
    setDummyData(generateDummyData(matchId));
  }, [matchId]);
  const handleBetClick = ()=>{

    NotificationManager.error("Bets Coming sson", "error", 1000, () => {
      alert("callback");
    });
  }

  // Update winners array when bet status becomes false
  useEffect(() => {
    if (!betOpen) {
      const newWinner =  Math.random() < 0.4 ? 'H' : Math.random() < 0.8 ? 'L' : 7;
      setWinners((prevWinners) => {
        const updatedWinners = [...prevWinners.slice(1), newWinner]; // Maintain last 10 winners
        return updatedWinners;
      });
      setCard(Math.floor(Math.random() * 8) + 1);

    }
    if(betOpen){
      setCard(null);
    }
  }, [betOpen]);

  const dataSource = [
    {
      key: '1',
      number: '7Up',
      rate: 0.95,
    },
    {
      key: '2',
      number: '7',
      rate: 10,
    },
    {
      key: '3',
      number: '7Down',
      rate: 0.97,
    },
  ];

  const columns = [
    {
      title: 'Number',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
    },
  ];


  return (
    <Row style={{minHeight:'100vh' }} justify={"center"} className="gx-bg-dark ">
      <Col xs={24}  xxl={18}>
        <div className="container">
          <Row justify={"center"} className="pt-1">
            <Col className="gx-px-4" xs={24} md={12} xl={16}>
              <div
                style={{
                  backgroundImage: `url(/urbet.in/VUD7/blue-background.jpg)`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
                className="gx-position-relative videoframe"
              >
                <div className="roundId  gx-ml-4">
                  <span className="match_id">#{matchId}</span>
                </div>
                <div className="CountDown gx-mr-4" id="countdown">
                  <span>{counter}</span>
                </div>
                <div id="hand">
                  <div>
                    <img
                      className="card card-img"
                      style={{ left: "60px" }}
                      src={`${card === null ? "/urbet.in/assets/images/dummy.png" : `/urbet.in/assets/images/cards/${card}.png`}`}
                      alt="jsf"
                    />
                  </div>
                </div>
                <div className="winnerMessge">
                  <span className="winnerText bet_status">
                    {betOpen ? "Bet Open" : "Bet Closed"}
                  </span>
                </div>
              </div>

              <div className="pt-2 gx-my-1 gx-d-sm-flex gx-d-block overflow-auto">
                <h3 className="gx-text-nowrap gx-bg-flex gx-align-items-center gx-fs-md gx-text-center gx-text-white">Last 10 Winners</h3>
                <div
                  className="new-matka-last-winner-cells last-result"
                  id="lastwinner"
                >
                  {winners.map((winner, index) => (
                    <h2 key={index} className={`winner ${winner === "H" ? "gx-bg-green-0" : winner === "L" ?  " gx-bg-orange" : "gx-bg-grey" } gx-text-white gx-fs-md gx-px-2 gx-py-1 gx-rounded-circle gx-font-weight-semi-bold`}>
                      {winner}
                    </h2>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Row className="game-info-details gx-w-100">
                  <Col>
                    <span>Virtual 7 UP DOWN</span>
                  </Col>
                  <Col>
                    <span>Stake Limit : 50 - 10000</span>
                  </Col>
                </Row>

                <Row className="new-matka-cells pt-2 pd-2 new-cellblock">
                  <Col
                    span={8}
                    onClick={()=>handleBetClick()}
                    className="number number-btn runner_bet_high"
                    data-coin-placed="0"
                    data-runner="bet_high"
                  >
                    <div id="lock" className="suspended pd-10"></div>
                    <span className="num number-btn-txt">7 UP</span>
                    <span className="coin-placed">0</span>
                  </Col>
                  <Col
                    span={6}
                    onClick={()=>handleBetClick()}
                    className="number number-btn runner_bet_tie"
                    data-coin-placed="0"
                    data-runner="bet_tie"
                  >
                    <div id="lock" className="suspended pd-10"></div>
                    <span className="num number-btn-txt">7</span>
                    <span className="coin-placed">0</span>
                  </Col>
                  <Col
                    span={8}
                    onClick={()=>handleBetClick()}
                    className="number number-btn runner_bet_low"
                    data-coin-placed="0"
                    data-runner="bet_low"
                  >
                    <div id="lock" className="suspended pd-10"></div>
                    <span className="num number-btn-txt">7 DOWN</span>
                    <span className="coin-placed">0</span>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col xs={24} md={10} xl={8} className="pt-2 gx-mt-2 ">
              <Row className="coin-holder pt-2">
                <Col span={4} md={4} className="pt-2">
                  <img
                                      onClick={()=>handleBetClick()}
                    alt="Coin50"
                    className="coin min-value"
                    data-value="50"
                    src="/urbet.in/VUD7/50.png"
                  />
                </Col>
                <Col span={4} md={4} className="pt-2">
                  <img
                                      onClick={()=>handleBetClick()}
                    alt="Coin100"
                    className="coin min-value"
                    data-value="100"
                    src="/urbet.in/VUD7/100.png"
                  />
                </Col>
                <Col span={4} md={4} className="pt-2">
                  <img
                    alt="Coin500"
                    onClick={()=>handleBetClick()}
                    className="coin min-value"
                    data-value="500"
                    src="/urbet.in/VUD7/500.png"
                  />
                </Col>
                <Col span={4} md={4} className="pt-2">
                  <img
        
                    alt="Coin1k"
                    onClick={()=>handleBetClick()}
                    className="coin min-value"
                    data-value="1000"
                    src="/urbet.in/VUD7/1k.png"
                  />
                </Col>
                <Col span={4} md={4} className="pt-2">
                  <img
                    alt="Coin5k"
                    onClick={()=>handleBetClick()}
                    className="coin min-value"
                    data-value="5000"
                    src="/urbet.in/VUD7/5h.png"
                  />
                </Col>
                <Col span={4} md={4} className="pt-2">
                  <img
                    alt="Coin10k"
                    onClick={()=>handleBetClick()}
                    className="coin min-value"
                    data-value="10000"
                    src="/urbet.in/VUD7/10h.png"
                  />
                </Col>
              </Row>
              <Row justify={"center"} className=" gx-mt-4">
                <Col className="gx-w-100" xs={24}>
                  <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    size="large"
                    className="gx-w-100"
                  />
                  
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Col>
      <NotificationContainer position="top-left" />
    </Row>
  );
};

export default UpDown7;
