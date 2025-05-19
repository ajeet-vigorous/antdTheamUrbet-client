import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { FaTimes } from 'react-icons/fa';
import { Button, Flex, Input } from 'antd';

export default function PlaceBetMobileBmx(props) {
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

        
        <div
        style={{
          position: "fixed",
          bottom: "0px",
          top: "auto",
          left: "0px",
  
          width: "100%",
          background: "#fff",
          padding: "0px",
          zIndex: 1000,
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
       
        }}
        className="gx-d-block gx-d-lg-none"
      >
        <div
         
          className="gx-py-3"
          id="betPLaceModal"
          style={{backgroundColor: `#f28ea3`}}
        >
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "18px", fontWeight: "600" }}>
            {betSlipData?.nat ? betSlipData?.nat : betSlipData?.nation}
            </span>
          </div>

          <div
              style={{ gap: "10px" }}
              className="gx-bg-flex gx-mb-3  gx-justify-content-center gx-align-items-center"
            >
              <div className="gx-bg-flex  gx-justify-content-center gx-align-items-center">
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
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "2px",
              marginBottom: "20px",
            }}
          >
            {betChipsFinalData &&
              Object.keys(betChipsFinalData).map((key) => (
                <button
                  style={{
                    background: "#D3D3D3",
                    padding: "10px",
                    fontWeight: "600",
                    color: "#000",
                    border: "none",
                    borderRadius: "5px",
                  }}
                  key={key}
                  onClick={() => updateStackOnclick(betChipsFinalData[key])}
                >
                  {Number(betChipsFinalData[key]) >= 1000
                    ? (Number(betChipsFinalData[key]) / 1000)
                        .toFixed(1)
                        .replace(/\.0$/, "") + "K"
                    : Number(betChipsFinalData[key])}
                </button>
              ))}
            <button
              style={{
                background: "#D3D3D3",
                padding: "10px",
                fontWeight: "600",
                color: "#000",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={() => updateStackOnclick(0)}
            >
              Clear
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "5px",
            }}
          >
            <button
              style={{
                backgroundColor:"#d2322d",
                color: "#fff",
                padding: "10px",
                fontWeight: "600",
                borderRadius: "5px",
                border: "none",
              }}
              onClick={() => {
               
                handleClose()
              }}
            >
              CLOSE
              <span style={{ paddingLeft: "10px" }}>{time}</span>
            </button>
            <button
              style={{
                backgroundColor:"#2f5a93",
                color: "#fff",
                padding: "10px",
                fontWeight: "600",
                borderRadius: "5px",
                border: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={placeBet}
              disabled={LoadingBet}
            >
              Place Bet
              {LoadingBet && (
                <div
                  className="loaderSpinner"
                  style={{ paddingLeft: "10px" }}
                ></div>
              )}
            </button>
          </div>
        </div>
      </div>
    );
}
