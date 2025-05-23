import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Table } from "antd";
import Auxiliary from "util/Auxiliary";
import {
  completeLedgerDetailsList,
  setDiamondBetsList,
  setcasinoTransactionReport,
} from "../../../appRedux/actions/User";
import { useSelector, useDispatch } from "react-redux";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import BackMenuButton from "../../../components/BackMenu";
import moment from "moment";
import DemoResult from "./DemoResult";
import Loader from "../../../components/loader";
import LeftSidebar from "../../../components/LeftSidebar/LeftSidebar";

const LedgerCasinoDetails = () => {
  const [userLadger, setLadger] = useState([]);
  const [fancyLedger, setFancyLadger] = useState([]);
  const [completeDataLadger, setCompleteDataLadger] = useState([]);
  const [showBetList, setBetList] = useState([]);
  const [showModalData, setModalData] = useState([]);
  const [showModal, setModal] = useState(false);

  const dispatch = useDispatch();
  const { marketId, eventId, date, ledgerType } = useParams();
  const {
    casinoTransactionReport,
    completeLedgerListData,
    diamondBetsList,
    casinoReportLoader,
  } = useSelector((state) => state.UserReducer);

  useEffect(() => {
    setLadger([]);
    setFancyLadger([]);
    completedLedger();
    betList(eventId);
  }, [dispatch]);

  const completedLedger = () => {
    let reqData = {
      eventId: marketId,
      fromDate: moment(parseInt(date, 10)).format("yyyy-MM-DD"),
      toDate: moment(parseInt(date, 10)).format("yyyy-MM-DD"),
      casinoType: ledgerType,
    };
    dispatch(setcasinoTransactionReport(reqData));
  };

  // setDiamondBetsList
  // diamondBetsList

  const betList = async (eventId) => {
    let betReq = {
      eventId: eventId,
      isDeleted: false,
      fromDate: moment(parseInt(date, 10)).format("yyyy-MM-DD"),
      toDate: moment(parseInt(date, 10)).format("yyyy-MM-DD"),
    };
    dispatch(setDiamondBetsList(betReq));
  };

  useEffect(() => {
    if (diamondBetsList) {
      const { casinoBetData } = diamondBetsList;
      const filteredData = casinoBetData?.map((item, index) => ({
        key: `${index}`,
        createdAt: moment(item.createdAt)
          .utcOffset("+05:30")
          .format("DD MMM hh:mm:ss A"),
        teamName: item.teamName,
        profitLoss: item.profitLoss,
        amount: item.amount,
        rate: item.odds,
        mode: item.type == "K" ? "KHAI" : "LAGAI",
        roundId: item.roundId,
        playerName: item.playerName,
        showResult: item.showResult,
        eventId: item.eventId,
        sid: item.sid,
        userName: item.userInfo.username,
        userFullName: item.userInfo.name,
        posArray: item.posArray,
        result: item.result,
        isDeclare: item.isDeclare,
        ip: item.ip,
        cards: item.resultDetails.cards,
        gtype: item.resultDetails.gtype,
        win: item.resultDetails.win,
        desc: item.resultDetails.desc,
        // resultDetails: item.resultDetails
        //add more data ...
      }));
      setLadger(filteredData);
      // const filteredDataSession = sessionBetsData?.map((item, index) => ({
      //   key: `${index}`,
      //   FcreatedAt: moment(item.createdAt).utcOffset("+05:30").format("DD MMM hh:mm:ss A"),
      //   FsessionName: item.sessionName,
      //   Frate: item.odds,
      //   Frun: item.run,
      //   FdecisionRun: item.decisionRun,
      //   Famount: item.amount,
      //   Fmode: item.type === "Y" ? "YES" : 'NO',
      //   FprofitLoss: item.profitLoss

      // }));
      // console.log("filteredDataSession", filteredDataSession);
      // setFancyLadger(filteredDataSession);
      // setCompleteDataLadger(completeData);
    }
  }, [completeLedgerListData, diamondBetsList, casinoTransactionReport]);

  // console.log("casinoTransactionReport", casinoTransactionReport);
  const renderContent = (value, row, index) => {
    const obj = {
      children: value,
      props: {},
    };
    return obj;
  };
  const columns = [
    {
      title: "TEAM",
       onHeaderCell: (column) => ({
        style: {
          background:"rgba(0,0,0,0.4)",
          color:"black",
          fontWeight:"bold"
        },
      }),
      dataIndex: "roundId",
      // render: renderContent
      render: (values, row) => (
        <span className="gx-text-blue" onClick={() => handleResultModel(row)}>
          <div className="gx-text-black">{row.playerName}</div>
          {row.roundId}
        </span>
      ),
    },
    {
      title: "Date",
       onHeaderCell: (column) => ({
        style: {
          background:"rgba(0,0,0,0.4)",
          color:"black",
          fontWeight:"bold"
        },
      }),
      dataIndex: "createdAt",
      render: (value) => <span className="gx-text-nowrap">{value}</span>,
    },
    {
      title: "Rate",
       onHeaderCell: (column) => ({
        style: {
          background:"rgba(0,0,0,0.4)",
          color:"black",
          fontWeight:"bold"
        },
      }),
      dataIndex: "rate",
      render: (value) => <span className="gx-text-nowrap">{value}</span>,
    },
    {
      title: "Amount",
       onHeaderCell: (column) => ({
        style: {
          background:"rgba(0,0,0,0.4)",
          color:"black",
          fontWeight:"bold"
        },
      }),
      dataIndex: "amount",
      render: (value) => <span className="gx-text-nowrap">{value}</span>,
    },
    {
      title: "Mode",
       onHeaderCell: (column) => ({
        style: {
          background:"rgba(0,0,0,0.4)",
          color:"black",
          fontWeight:"bold"
        },
      }),
      dataIndex: "mode",
      render: (value) => <span className="gx-text-nowrap">{value}</span>,
    },
    {
      title: "Show Result",
       onHeaderCell: (column) => ({
        style: {
          background:"rgba(0,0,0,0.4)",
          color:"black",
          fontWeight:"bold"
        },
      }),
      dataIndex: "showResult",
      render: (value) => <span className="gx-text-nowrap">{value}</span>,
    },
    {
      title: "P&L",
       onHeaderCell: (column) => ({
        style: {
          background:"rgba(0,0,0,0.4)",
          color:"black",
          fontWeight:"bold"
        },
      }),
      dataIndex: "profitLoss",
      render: (values) => (
        <span className={`${values >= 0 ? "gx-text-blue" : "gx-text-red"}`}>
          {Math.abs(values).toFixed(2)}
        </span>
      ),
    },
  ];

  const columnsFancy = [
    {
      title: "Runner",
       onHeaderCell: (column) => ({
        style: {
          background:"rgba(0,0,0,0.4)",
          color:"black",
          fontWeight:"bold"
        },
      }),
      dataIndex: "FsessionName",
      render: renderContent,
    },
    {
      title: "Date",
       onHeaderCell: (column) => ({
        style: {
          background:"rgba(0,0,0,0.4)",
          color:"black",
          fontWeight:"bold"
        },
      }),
      dataIndex: "FcreatedAt",
      render: renderContent,
    },
    {
      title: "Rate",
       onHeaderCell: (column) => ({
        style: {
          background:"rgba(0,0,0,0.4)",
          color:"black",
          fontWeight:"bold"
        },
      }),
      dataIndex: "Frate",
      render: renderContent,
    },
    {
      title: "Run",
       onHeaderCell: (column) => ({
        style: {
          background:"rgba(0,0,0,0.4)",
          color:"black",
          fontWeight:"bold"
        },
      }),
      dataIndex: "Frun",
      render: renderContent,
    },
    {
      title: "Res",
       onHeaderCell: (column) => ({
        style: {
          background:"rgba(0,0,0,0.4)",
          color:"black",
          fontWeight:"bold"
        },
      }),
      dataIndex: "FdecisionRun",
      render: renderContent,
    },
    {
      title: "Amount",
       onHeaderCell: (column) => ({
        style: {
          background:"rgba(0,0,0,0.4)",
          color:"black",
          fontWeight:"bold"
        },
      }),
      dataIndex: "Famount",
      render: renderContent,
    },
    {
      title: "Mode",
       onHeaderCell: (column) => ({
        style: {
          background:"rgba(0,0,0,0.4)",
          color:"black",
          fontWeight:"bold"
        },
      }),
      dataIndex: "Fmode",
      render: renderContent,
    },
    {
      title: "P&L",
       onHeaderCell: (column) => ({
        style: {
          background:"rgba(0,0,0,0.4)",
          color:"black",
          fontWeight:"bold"
        },
      }),
      dataIndex: "FprofitLoss",
      render: (values) => (
        <span className={`${values >= 0 ? "gx-text-blue" : "gx-text-red"}`}>
          {Number.parseFloat(values).toFixed(2)}
        </span>
      ),
    },
  ];
  const customLocale = {
    emptyText: <div className="gx-text-center gx-text-black" >No data found</div>
  };
  const handleResultModel = (data) => {
    setModalData(data);
    setModal(true);
  };

  const handleClose = () => {
    setModal(false);
  };
  const history = useHistory();

  return (
    <Row style={{overflow:"hidden"}} justify={"space-between"} >
    <Col
      xs={24}
      md={24}
      lg={4}
      xl={3}
      className=" gx-d-none gx-d-lg-block gx-px-0 gx-mx-0"
    >
      <LeftSidebar />
    </Col>
    <Col style={{paddingInline:"2px"}} xs={24} md={24} lg={20} xl={21}>
    <>
    
      {casinoReportLoader ? (
        <Loader props={casinoReportLoader} />
      ) : (
        <Auxiliary>
         <Row justify={"center"}>
      <Col xs={24} md={15}>
      <Row>
            <Col xs={24}>
              {userLadger && userLadger?.length > 0 ? (
                <>
                  <div className="urbet_layout_header_top  gx-text-uppercase gx-text-black  gx-bg-flex gx-justify-content-between gx-align-items-center gx-px-2 gx-py-1">
                    <div className="gx-fs-lg gx-font-weight-semi-bold gx-text-black">
                      Casino Bets
                    </div>
                    <Button
                      onClick={() => history.goBack()}
                      size="small"
                      style={{ color: "white" }}
                      className="gx-bg-dark gx-mb-0 gx-text-white gx-font-weight-semi-bold"
                    >
                      Back
                    </Button>
                  </div>

                  <Table
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={userLadger}
                    bordered
                    pagination={false}
                    size="small"
                  />
                </>
              ) : null}

              {/* {fancyLedger && fancyLedger?.length > 0 ? <>
              <div className="gx-py-1 gx-px-2 gx-bg-red gx-bg-flex gx-justify-content-between  gx-text-white ">
                <span></span>
                <span className="gx-font-weight-semi-bold gx-fs-lg">Fancy Odds</span>
                <span>{ }</span>
              </div>
              <Table
                columns={columnsFancy}
                dataSource={fancyLedger}
                bordered
                pagination={false}
                size="small"
              />
            </> : null
            } */}
              <>
            {casinoTransactionReport && casinoTransactionReport.length > 0
              ? casinoTransactionReport.map((element, index) => (
                  <Row justify={"center"} className="gx-mt-5">
                    <Col xs={24}>
                      <div className=" gx-px-2  ">
                        <span style={{backgroundColor:"#2a3e5d"}} className="gx-fs-lg gx-bg-flex gx-justify-content-center gx-py-1 gx-text-white">
                          Casino Plus Minus
                        </span>
                        <div
                          className={`gx-bg-flex gx-justify-content-center gx-bg-white gx-py-1 ${
                            element?.amount >= 0
                              ? "gx-text-blue"
                              : "gx-text-red"
                          }`}
                        >
                          {element?.amount > 0 ? (
                            <div className="">
                              <span className="gx-font-weight-semi-bold gx-fs-lg">
                                You Won{" "}
                                {element?.amount
                                  ? Number.parseFloat(element?.amount)
                                      .toFixed(2)
                                      .replace(/\.?0+$/, "")
                                  : 0}
                                /- Coins.
                              </span>
                            </div>
                          ) : (
                            <div className="gx-font-weight-semi-bold gx-fs-lg">
                              <span>
                                You Lost{" "}
                                {element?.amount
                                  ? Number.parseFloat(element?.amount)
                                      .toFixed(2)
                                      .replace(/\.?0+$/, "")
                                  : 0}
                                /- Coins.
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className=" gx-px-2  ">
                        <span style={{backgroundColor:"#2a3e5d"}} className="gx-fs-lg gx-bg-flex gx-justify-content-center gx-py-1 gx-text-white">
                          Total Commission
                        </span>
                        <div
                          className={`gx-bg-flex gx-justify-content-center gx-bg-white gx-py-1`}
                        >
                          {element?.totalComm > 0 ? (
                            <div className="">
                              <span className="gx-text-blue gx-font-weight-semi-bold gx-fs-lg">
                                You Won{" "}
                                {element?.totalComm
                                  ? Number.parseFloat(element?.totalComm)
                                      .toFixed(2)
                                      .replace(/\.?0+$/, "")
                                  : 0}
                                /- Coins.
                              </span>
                            </div>
                          ) : (
                            <div className="">
                              <span className="gx-text-red gx-font-weight-semi-bold gx-fs-lg">
                                You Lost{" "}
                                {element?.totalComm
                                  ? Number.parseFloat(element?.totalComm)
                                      .toFixed(2)
                                      .replace(/\.?0+$/, "")
                                  : 0}
                                /- Coins.
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className=" gx-px-2  ">
                        <span style={{backgroundColor:"#2a3e5d"}} className="gx-fs-lg gx-bg-flex gx-justify-content-center gx-py-1 gx-text-white">
                          Net Plus Minus
                        </span>
                        <div
                          className={`gx-bg-flex gx-justify-content-center gx-bg-white gx-py-1 `}
                        >
                          {" "}
                          {element?.totalAmount + element?.clientSessionComm >
                          0 ? (
                            <div className="">
                              <span className="gx-text-blue gx-font-weight-semi-bold gx-fs-lg">
                                You Won{" "}
                                {Number.parseFloat(
                                  (element?.totalAmount ?? 0) +
                                    (element?.clientSessionComm ?? 0)
                                )
                                  .toFixed(2)
                                  .replace(/\.?0+$/, "")}
                                /- Coins.
                              </span>
                            </div>
                          ) : (
                            <div className="">
                              <span className="gx-text-red gx-font-weight-semi-bold gx-fs-lg">
                                You Lost{" "}
                                {Number.parseFloat(
                                  (element?.totalAmount ?? 0) +
                                    (element?.clientSessionComm ?? 0)
                                )
                                  .toFixed(2)
                                  .replace(/\.?0+$/, "")}
                                /- Coins.
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>
                ))
              : null}
          </>

            </Col>
          </Row>
          </Col>
          {/* <Col xs={24} md={9}>
      <div className="">
      <div className="urbet_layout_header_top  gx-text-uppercase gx-text-black  gx-bg-flex gx-justify-content-between gx-align-items-center gx-px-2 gx-py-1">
                <div className="gx-fs-lg gx-font-weight-semi-bold gx-text-black" >Rejected Bets</div>
                
            </div>
            
       
              
      
            <Table
            className="gx-table-responsive"
              columns={columnsFancy}
              locale={customLocale}
              dataSource={[]}
              bordered
              scroll={{ x: true }}
              pagination={false}
              size="small"
            />
      </div>
      </Col> */}
          </Row>

        
          {/* <BackMenuButton /> */}
        </Auxiliary>
      )}
      <DemoResult
        data={showModalData}
        visible={showModal}
        handleClose={handleClose}
      />
    </>

    </Col>
    </Row>
  );
};
export default LedgerCasinoDetails;
