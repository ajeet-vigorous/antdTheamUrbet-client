



import React, { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "antd";
import Auxiliary from "util/Auxiliary";
import { completeLedgerDetailsList } from "../../../appRedux/actions/User";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import BackMenuButton from "../../../components/BackMenu";
import moment from "moment";
import Loader from "../../../components/loader";
import { values } from "lodash";
import LeftSidebar from "../../../components/LeftSidebar/LeftSidebar";



const LedgerDetails = () => {
  const [userLadger, setLadger] = useState([]);
  const [fancyLedger, setFancyLadger] = useState([]);
  const [completeDataLadger, setCompleteDataLadger] = useState([]);
  const [reacjectedFancyLedger, setReacjectedFancyLadger] = useState([]);
  const history = useHistory()

  const dispatch = useDispatch();
  const { marketId } = useParams();

  useEffect(() => {
    setLadger([])
    setFancyLadger([])
    completedLedger()
  }, [dispatch])

  const { completeLedgerListData, loading } = useSelector((state) => state.UserReducer);

  const completedLedger = () => {
    let reqData = {
      marketId: marketId
    }
    dispatch(completeLedgerDetailsList(reqData))
  }

  useEffect(() => {

    if (completeLedgerListData) {
      const { completeData, oddsBetsData, sessionBetsData, sessionTurnOver } = completeLedgerListData;
      const filteredData = oddsBetsData?.map((item, index) => ({
        key: `${index}`,
        createdAt: moment(item.createdAt).utcOffset("+05:30").format("DD MMM hh:mm:ss A"),
        teamName: item.teamName,
        profitLoss: item?.positionInfo[item?.decisionSelectionId],
        oddsType: item.oddsType,
        amount: item.amount,
        rate: item.odds,
        mode: item.type == "K" ? "KHAI" : "LAGAI",

      }));
      setLadger(filteredData);
      const filteredReajectedDataSession = sessionBetsData?.filter((item => item.isDeleted === 1))?.map((item, index) => ({
        key: `${index}`,
        FcreatedAt: moment(item.createdAt).utcOffset("+05:30").format("DD MMM hh:mm:ss A"),
        FsessionName: item.sessionName,
        Frate: item.odds,
        Frun: item.run,
        FdecisionRun: item.decisionRun,
        Famount: item.amount,
        Fmode: item.type === "Y" ? "YES" : 'NO',
        FprofitLoss: item.profitLoss,
        FdeletedRemark: item?.deletedRemark

      }));
      setReacjectedFancyLadger(filteredReajectedDataSession);

      const filteredDataSession = sessionBetsData?.filter((item => item.isDeleted !== 1))?.map((item, index) => ({
        key: `${index}`,
        FcreatedAt: moment(item.createdAt).utcOffset("+05:30").format("DD MMM hh:mm:ss A"),
        FsessionName: item.sessionName,
        Frate: item.odds,
        Frun: item.run,
        FdecisionRun: item.decisionRun,
        Famount: item.amount,
        Fmode: item.type === "Y" ? "YES" : 'NO',
        FprofitLoss: item.profitLoss

      }));
      setFancyLadger(filteredDataSession);
      setCompleteDataLadger(completeData);
    }
  }, [completeLedgerListData]);




  const renderContent = (value, row, index) => {
    const obj = {
      children: value,
      props: {},
    };
    return obj;
  };

  const columns = [

    {
      title: 'Team Name',
      dataIndex: 'teamName',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      render: (value) => <span className="gx-text-nowrap">{value}</span>
    },
    {
      title: 'Date',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'createdAt',
      render: (value) => <span className="gx-text-nowrap">{value}</span>
    },
    {
      title: 'Rate',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'rate',
      render: (value) => <span className="gx-text-nowrap">{value}</span>
    }, {
      title: 'Amount',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'amount',
      render: (value) => <span className="gx-text-nowrap">{value}</span>
    },
    {
      title: 'Mode',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'mode',
      render: (value) => <span className="gx-text-nowrap">{value}</span>
    },
    {
      title: 'ODDSTYPE',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'oddsType',
      render: (value) => <span className="gx-text-nowrap">{value}</span>
    },
  
    {
      title: 'P&L',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'profitLoss',
      render: (values) => (
        <span className={`${values >= 0 ? "gx-text-blue" : "gx-text-red"}`}>{Number.parseFloat(values).toFixed(2)}</span>
      )
    },

  ];

  const columnsFancy = [

    {
      title: 'Runner',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'FsessionName',
      render: (value) => <span className="gx-text-nowrap">{value}</span>
    },
    {
      title: 'Date',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'FcreatedAt',
      render: (value) => <span className="gx-text-nowrap">{value}</span>
    },
    {
      title: 'Rate',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'Frate',

      render: (value) => <span className="gx-text-nowrap">{value}</span>
    }, {
      title: 'Run',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'Frun',
      render: (value) => <span className="gx-text-nowrap">{value}</span>
    },
    {
      title: 'Res',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'FdecisionRun',
      render: (value) => <span className="gx-text-nowrap">{value}</span>
    },
    {
      title: 'Amount',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'Famount',
      render: (value) => <span className="gx-text-nowrap">{value}</span>
    },
    {
      title: 'Mode',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'Fmode',
      render: (value) => <span className="gx-text-nowrap">{value}</span>
    },
    {
      title: 'P&L',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'FprofitLoss',
      render: (values) => (<span className={`gx-text-nowrap ${values >= 0 ? "gx-text-blue" : "gx-text-red"}`}>{Number.parseFloat(values).toFixed(2)}</span>)

    },

  ];
  const columnsFancyRejected = [

    {
      title: 'Runner',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'FsessionName',
      render: (value) => <span className="gx-text-nowrap">{value}</span>
    },
    {
      title: 'Date',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'FcreatedAt',
      render: (value) => <span className="gx-text-nowrap">{value}</span>
    },
    {
      title: 'Rate',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'Frate',

      render: (value) => <span className="gx-text-nowrap">{value}</span>
    }, {
      title: 'Run',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'Frun',
      render: (value) => <span className="gx-text-nowrap">{value}</span>
    },
    {
      title: 'Res',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'FdecisionRun',
      render: (value) => <span className="gx-text-nowrap">{value}</span>
    },
    {
      title: 'Amount',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'Famount',
      render: (value) => <span className="gx-text-nowrap">{value}</span>
    },
    {
      title: 'Mode',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'Fmode',
      render: (value) => <span className="gx-text-nowrap">{value}</span>
    },
    {
      title: 'P&L',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'FprofitLoss',
      render: (values) => (<span className={`gx-text-nowrap ${values >= 0 ? "gx-text-blue" : "gx-text-red"}`}>{Number.parseFloat(values).toFixed(2)}</span>)

    },
    {
      title: 'Remark',
      onHeaderCell: (column) => ({
        style: {
          background: "rgba(0,0,0,0.4)",
          color: "black"
        },
      }),
      dataIndex: 'FdeletedRemark',
      render: (value) => <span className="gx-text-nowrap">{value}</span>

    },

  ];

  const customLocale = {
    emptyText: <div className="gx-text-center gx-text-black" >No data found</div>
  };

  return (
    <Row style={{ overflow: "hidden" }} justify={"space-between"} >
      <Col
        xs={24}
        md={24}
        lg={4}
        xl={3}
        className=" gx-d-none gx-d-lg-block gx-px-0 gx-mx-0"
      >
        <LeftSidebar />
      </Col>
      <Col style={{ paddingInline: "2px" }} xs={24} md={24} lg={20} xl={21}>
        {loading ? <Loader props={loading} /> :
          <Auxiliary>
            <Row justify={"center"}>
              <Col xs={24} md={15}>
                <Row>
                  <Col sm={24}>
                    {userLadger && userLadger?.length > 0 ?
                      <>
                        <div className="urbet_layout_header_top  gx-text-uppercase gx-text-black  gx-bg-flex gx-justify-content-between gx-align-items-center gx-px-2 gx-py-1">
                          <div className="gx-fs-lg gx-font-weight-semi-bold gx-text-black" >Match Bets</div>
                          <Button onClick={() => history.goBack()} size="small" style={{ color: "white" }} className="gx-bg-dark gx-mb-0 gx-text-white gx-font-weight-semi-bold">Back</Button>
                        </div>

                        <Table
                          columns={columns}
                          dataSource={userLadger}
                          bordered
                          pagination={false}
                          scroll={{ x: true }}
                          size="small"
                        />
                      </> : null
                    }

                    {fancyLedger && fancyLedger?.length > 0 ? <>
                      <div className="gx-py-2 gx-font-weight-semi-bold gx-fs-lg gx-px-2 gx-text-center gx-bg-white  gx-bg-flex gx-justify-content-between  gx-text-black ">

                        Fancy Bets

                      </div>
                      <Table
                        className="gx-table-responsive"
                        columns={columnsFancy}
                        dataSource={fancyLedger}
                        bordered
                        scroll={{ x: true }}
                        pagination={false}
                        size="small"
                      />
                    </> : null
                    }

                  </Col>
                </Row>
                <Row justify={"center"} className="gx-mt-5">
                  <Col xs={24} sm={24}>
                    <div className=" gx-px-2  ">
                      <span style={{ backgroundColor: "#2a3e5d" }} className=" gx-bg-flex gx-justify-content-center gx-py-1 gx-text-white gx-text-capitalize gx-fs-lg">Match Plus Minus</span>
                      <div className={`gx-bg-flex gx-justify-content-center gx-bg-white gx-py-1 ${completeDataLadger?.clientOddsAmount >= 0 ? "gx-text-blue" : "gx-text-red"}`}>{completeDataLadger?.clientOddsAmount > 0 ?
                        <div className=''>
                          <span className="gx-font-weight-semi-bold gx-fs-lg">You Won {completeDataLadger?.clientOddsAmount ? Number.parseFloat(completeDataLadger?.clientOddsAmount).toFixed(2).replace(/\.?0+$/, '') : 0}/- Coins.</span>
                        </div> :
                        <div className='gx-font-weight-semi-bold gx-fs-lg'>
                          <span >You Lost {completeDataLadger?.clientOddsAmount ? Number.parseFloat(completeDataLadger?.clientOddsAmount).toFixed(2).replace(/\.?0+$/, '') : 0}/- Coins.</span>
                        </div>
                      }</div>
                    </div>

                    <div className=" gx-px-2  ">
                      <span style={{ backgroundColor: "#2a3e5d" }} className=" gx-bg-flex gx-justify-content-center gx-py-1 gx-text-white gx-text-capitalize gx-fs-lg">Fancy Plus Minus</span>
                      <div className={`gx-bg-flex gx-justify-content-center gx-bg-white gx-py-1`}>{completeDataLadger?.clientSessionAmount > 0 ?
                        <div className=''>
                          <span className="gx-text-blue gx-font-weight-semi-bold gx-fs-lg">You Won {completeDataLadger?.clientSessionAmount ? Number.parseFloat(completeDataLadger?.clientSessionAmount).toFixed(2).replace(/\.?0+$/, '') : 0}/- Coins.</span>
                        </div> :
                        <div className=''>
                          <span className="gx-text-red gx-font-weight-semi-bold gx-fs-lg">You Lost {completeDataLadger?.clientSessionAmount ? Number.parseFloat(completeDataLadger?.clientSessionAmount).toFixed(2).replace(/\.?0+$/, '') : 0}/- Coins.</span>
                        </div>
                      }</div>
                    </div>

                    <div className=" gx-px-2  ">
                      <span style={{ backgroundColor: "#2a3e5d" }} className=" gx-bg-flex gx-justify-content-center gx-py-1 gx-text-white gx-text-capitalize gx-fs-lg">Total Commission</span>
                      <div className={`gx-bg-flex gx-justify-content-center gx-bg-white gx-py-1 `}> {(completeDataLadger?.clientOddsComm + completeDataLadger?.clientSessionComm) > 0 ?
                        <div className=''>
                          <span className="gx-text-blue gx-font-weight-semi-bold gx-fs-lg">You Won {Number.parseFloat((completeDataLadger?.clientOddsComm ?? 0) + (completeDataLadger?.clientSessionComm ?? 0)).toFixed(2).replace(/\.?0+$/, '')}/- Coins.</span>
                        </div> :
                        <div className=''>
                          <span className="gx-text-red gx-font-weight-semi-bold gx-fs-lg">You Lost {Number.parseFloat((completeDataLadger?.clientOddsComm ?? 0) + (completeDataLadger?.clientSessionComm ?? 0)).toFixed(2).replace(/\.?0+$/, '')}/- Coins.</span>
                        </div>
                      }</div>
                    </div>

                    {/* <div className=" gx-px-2  ">
            <span className="gx-bg-grey gx-bg-flex gx-justify-content-center gx-py-1 gx-text-white gx-text-capitalize gx-fs-lg">Mob. App. Charges</span>
            <div className="gx-bg-flex gx-justify-content-center gx-py-1 gx-bg-white gx-text-red gx-font-weight-semi-bold gx-fs-lg">  <span>You Lost 0/- Coins.</span></div>
          </div> */}

                    <div className=" gx-px-2  ">
                      <span style={{ backgroundColor: "#2a3e5d" }} className=" gx-bg-flex gx-justify-content-center gx-py-1 gx-text-white gx-text-capitalize gx-fs-lg">Net Plus Minus</span>
                      <div className={`gx-bg-flex gx-justify-content-center gx-bg-white gx-py-1 ${completeDataLadger?.clientSessionAmount >= 0 ? "gx-text-blue" : "gx-text-red"}`}>{(completeDataLadger?.clientOddsComm + completeDataLadger?.clientSessionComm + completeDataLadger?.clientSessionAmount + completeDataLadger?.clientOddsAmount) > 0 ?
                        <div className=''>
                          <span className="gx-text-blue gx-font-weight-semi-bold gx-fs-lg" >You Won {Number.parseFloat((completeDataLadger?.clientOddsComm ?? 0) + (completeDataLadger?.clientSessionComm ?? 0) + (completeDataLadger?.clientSessionAmount ?? 0) + (completeDataLadger?.clientOddsAmount ?? 0)).toFixed(2).replace(/\.?0+$/, '')} /- Coins.</span>
                        </div> :
                        <div className=' '>
                          <span className="gx-text-red gx-font-weight-semi-bold gx-fs-lg" >You Lost {Number.parseFloat((completeDataLadger?.clientOddsComm ?? 0) + (completeDataLadger?.clientSessionComm ?? 0) + (completeDataLadger?.clientSessionAmount ?? 0) + (completeDataLadger?.clientOddsAmount ?? 0)).toFixed(2).replace(/\.?0+$/, '')} /- Coins.</span>
                        </div>
                      }</div>
                    </div>

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
              columns={columnsFancyRejected}
              locale={customLocale}
              dataSource={reacjectedFancyLedger}
              bordered
              scroll={{ x: true }}
              pagination={false}
              size="small"
            />
      </div>
      </Col> */}
            </Row>
            {/* <BackMenuButton /> */}
          </Auxiliary>}

      </Col>
    </Row>
  );
};
export default LedgerDetails;







