import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { FaTimes } from "react-icons/fa";
import { Col, Divider, Input, Row } from "antd";
import { Button, Flex } from "antd";

const style = {
  background: "#0092ff",
  padding: "8px 0",
};

export default function PlaceBetMobileBmxBet(props) {
  const {
    betSlipData,
    count,
    time,
    section1Ref,
    inputRef,
    updateStake,
    placeBet,
    updateStackOnclick,
    handleClose,
    betChipsData,
    LoadingBet,
  } = props;


const betChipsFinalData = betChipsData?.filter((ele)=>ele < 50001)


  return (
    <div style={{ padding: '10px', backgroundColor: `#f28ea3`, borderRadius: '10px' }}>
      <div style={{  padding: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '18px', color: 'black', flex: 1 }}>
            {betSlipData?.nat ? betSlipData?.nat : betSlipData?.nation}
          </div>
          {/* <span style={{ flex: 1, textAlign: 'left' }}>RATE: {count}</span> */}
        </div>
        <div
                    style={{ gap: "10px" }}
                    className="gx-bg-flex  gx-justify-content-center gx-align-items-center"
                  >
                    <div className="gx-bg-flex gx-justify-content-center gx-align-items-center">
                      <div
                        style={{
                          background: "white",
                          borderRight: "1px solid grey",
                        }}
                        className="gx-px-2 gx-py-2 gx-font-weight-semi-bold"
                      >
                        -
                      </div>
                      <div>
                        <Input
                          // ref={inputRef}
                          style={{ background: "white" }}
                          inputMode="numeric"
                          value={count}
                          type="number"
                          className="gx-font-weight-semi-bold gx-fs-lg gx-rounded-0 gx-border-0 gx-text-center"
                          disabled
                        />
                      </div>
                      <div
                        style={{
                          background: "white",
                          borderLeft: "1px solid grey",
                        }}
                        className="gx-px-2 gx-py-2 gx-font-weight-semi-bold"
                      >
                        +
                      </div>
                    </div>
                    <div className="gx-bg-flex gx-justify-content-center gx-align-items-center">
                      <div
                        onClick={() => updateStackOnclick(Number(betSlipData.stake) - 1)}
                        style={{
                          background: "white",
                          borderRight: "1px solid grey",
                        }}
                        className="gx-px-2 gx-py-2 gx-font-weight-semi-bold"
                      >
                        -
                      </div>
                      <div>
                        <Input
                          // ref={inputRef}
                          inputMode="numeric"
                          value={betSlipData.stake}
                          onChange={updateStake}
                          type="number"
                          className="gx-font-weight-semi-bold gx-fs-lg gx-rounded-0 gx-border-0 gx-text-center"
                        />
                      </div>
                      <div
                        onClick={() =>  updateStackOnclick(Number(betSlipData.stake) + 1)}
                        style={{
                          background: "white",
                          borderLeft: "1px solid grey",
                        }}
                        className="gx-px-2 gx-py-2 gx-font-weight-semi-bold"
                      >
                        +
                      </div>
                    </div>
                  </div>

                  <div
                    className="gx-bg-flex gx-align-items-center gx-my-2"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "2px",
                    }}
                  >
                    {betChipsFinalData &&
                      Object.keys(betChipsFinalData).map((key) => (
                        <Button
                          style={{ background: "#D3D3D3" }}
                          className="gx-px-2 gx-font-weight-semi-bold gx-text-black "
                          key={key}
                          onClick={() => updateStackOnclick(betChipsFinalData[key])}
                        >
                          {Number(betChipsFinalData[key]) >= 1000
                            ? (Number(betChipsFinalData[key]) / 1000)
                                .toFixed(1)
                                .replace(/\.0$/, "") + "K"
                            : Number(betChipsFinalData[key])}
                        </Button>
                      ))}
                    <Button
                      style={{ background: "#D3D3D3" }}
                      className="gx-px-2 gx-font-weight-semi-bold gx-text-black "
                      key="clear"
                        onClick={() => updateStackOnclick(0)}
                      // onClick={() => setInputValue(0)}
                    >
                      Clear
                    </Button>
                  </div>
  

        
        <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "5px",
                      
                    }}
                    className=""
                  >
                    <Button
                      onClick={() => {
                        // setTimeLeft(0);
                        handleClose();
                      }}
                   style={{backgroundColor:"#d2322d"}}
                      className="gx-font-weight-semi-bold gx-text-white gx-fs-md"
                    >
                      CLOSE
                      <span className="gx-font-weight-semi-bold gx-fs-md gx-text-white gx-px-2">
                        {time}
                      </span>
                    </Button>
                    <Button
                      disabled={LoadingBet}
                      onClick={placeBet}
                      style={{backgroundColor:"#2f5a93",}}
                      className={` gx-text-white  gx-mb-0 gx-px-2 gx-font-weight-semi-bold gx-fs-md`}
                    >
                      Place Bet
                      {LoadingBet && (
                        <div className="loaderSpinner gx-px-1"></div>
                      )}
                    </Button>
                  </div>

        
      </div>
    </div>
  
  );
}
