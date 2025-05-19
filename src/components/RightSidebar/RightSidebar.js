import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Select, Table } from "antd";
import { getMatchList, setMobileBetList } from "../../appRedux/actions/User";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { AiFillCaretDown } from "react-icons/ai";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import moment from "moment";
import { isEqual } from "lodash";

const { Option } = Select;



function RightSidebar({IncompleteddataList, mybetsData, betList,matkaBetList,totalSessionPlusMinus, completeddataList, compltedBetsColumn}) {
  const [activeBet,setActiveBet] = useState(0)

  const dispatch = useDispatch()

const dataSource = matkaBetList ? matkaBetList.map((tempData, index) => ({ ...tempData, key: index })) : [];

  const prevData = useRef({
    IncompleteddataList: null,
    mybetsData: null,
    betList: null
  });

  useEffect(() => {
    // Check if the data has actually changed
    if (
      !isEqual(prevData.current.IncompleteddataList, IncompleteddataList) ||
      !isEqual(prevData.current.mybetsData, mybetsData) ||
      !isEqual(prevData.current.betList, betList) ||
      !isEqual(prevData.current.matkaBetList, matkaBetList)
    ) {
      // Update the ref with the new values
      prevData.current = { IncompleteddataList, mybetsData, betList,matkaBetList };

      // Dispatch action if there's a change
      dispatch(setMobileBetList({ IncompleteddataList, mybetsData, betList,matkaBetList }));
    }
  }, [IncompleteddataList, mybetsData, betList,matkaBetList, dispatch]);


  const IncompltedBetsColumn = [
    {
      title: "RUNNER",
      dataIndex: "Team",
      key: "Team",
      render: (value) => <span className=" gx-text-uppercase gx-font-weight-semi-bold">{value}</span>,
    },

    {
      title: "AMOUNT",
      dataIndex: "Amount",
      key: "Amount",
      render: (value) => <span className=" gx-text-uppercase gx-font-weight-semi-bold">{value}</span>,
    },
    {
      title: "RUN",
      dataIndex: "Runs",
      key: "Runs",
      render: (value) => <span className=" gx-text-uppercase gx-font-weight-semi-bold">{value}</span>,
    },
    {
      title: "RATE",
      dataIndex: "Rate",
      key: "Rate",
      render: (value) => <span className=" gx-text-uppercase gx-font-weight-semi-bold">{value}</span>,
    },
    {
      title: "MODE",
      dataIndex: "Type",
      key: "Type",
      render: (value) => <span className=" gx-text-uppercase gx-font-weight-semi-bold">{value}</span>,
    },
  ];

  const mybets = [
    {
      title: "TEAM",
      dataIndex: "Team",
      key: "Team",
      render: (value) => <span className=" gx-text-uppercase gx-font-weight-semi-bold">{value}</span>,
    },
    {
      title: "ODDSTYPE",
      dataIndex: "oddsType",
      key: "oddsType",
      render: (value) => <span className=" gx-text-uppercase gx-font-weight-semi-bold">{value}</span>,
    },
    {
      title: "AMOUNT",
      dataIndex: "Amount",
      key: "Amount",
      render: (value) => <span className=" gx-text-uppercase gx-font-weight-semi-bold">{value}</span>,
    },

    {
      title: "RATE",
      dataIndex: "Rate",
      key: "Rate",
      render: (value) => <span className=" gx-text-uppercase gx-font-weight-semi-bold">{value}</span>,
    },
    {
      title: "MODE",
      dataIndex: "Type",
      key: "Type",
      render: (value) => <span className=" gx-text-uppercase gx-font-weight-semi-bold">{value}</span>,
    },
  ];
  const casinoColumn = [
    {
        title: 'Team',
        dataIndex: 'playerName',
        key: 'playerName',
        render: (value, row) =>
            <span className="gx-py-1  gx-text-black gx-font-weight-semi-bold gx-text-center">
                {row.playerName}
                <br />
                {row.roundId}
            </span>
    },
    {
        title: 'Mode',
        dataIndex: 'betType',
        key: 'betType',
        render: (value, row) => <span className="gx-text-center gx-text-nowrap gx-font-weight-semi-bold gx-text-black">{row.betType}</span>
    },
    {
        title: 'Rate',
        dataIndex: 'odds',
        key: 'odds',
        render: (value, row) => <span className="gx-text-right gx-text-nowrap gx-font-weight-semi-bold gx-text-black">{(parseFloat(row.odds)).toFixed(2).replace(/\.?0+$/, "")}</span>
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (value, row) => <span className="gx-text-center gx-text-nowrap gx-font-weight-semi-bold gx-text-black">{row.amount}</span>
    },
    {
        title: 'Result',
        dataIndex: 'betType',
        key: 'betType',
        render: (value, row) =>
            <span className={`px-3 py-1 gx-text-nowrap gx-font-weight-semi-bold ${row.profitLoss < 0 ? "gx-text-red" : row.profitLoss > 0 ? "gx-text-green-0" : "text-black"}`}>{row.profitLoss}
                <br />
                {row.isDeclare === 1 ?
                    <small>({row.showResult})</small> : null
                }
            </span>
    },
    {
        title: 'Date & Time',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (value, row) => <span className="gx-text-center gx-text-nowrap gx-font-weight-semi-bold gx-text-black">
            {moment(row?.createdAt).utcOffset("+05:30").format("DD-MM-YYYY hh:mm:ss")}
        </span>

    },
];
  
  const columns = [
    {
      title: "Team",
      onHeaderCell: (column) => ({
        style: {
          background: "#CCCCCC",
          color:"black",
          fontWeight:"bold"
        },
      }),
      dataIndex: "team",
      key: "team",
      className: "px-[6px] py-3 whitespace-nowrap",
    },
    {
      title: "Mode",
      onHeaderCell: (column) => ({
        style: {
          background: "#CCCCCC",
          color:"black",
          fontWeight:"bold"
        },
      }),
      dataIndex: "mode",

      key: "mode",
      className: "px-[6px] py-3 whitespace-nowrap",
    },
    {
      title: "Run",
      onHeaderCell: (column) => ({
        style: {
          background: "#CCCCCC",
          color:"black",
          fontWeight:"bold"
        },
      }),
      dataIndex: "run",
      key: "run",
      className: "px-[6px] py-3 whitespace-nowrap",
    },
    {
      title: "Rate",
      onHeaderCell: (column) => ({
        style: {
          background: "#CCCCCC",
          color:"black",
          fontWeight:"bold"
        },
      }),
      dataIndex: "rate",

      key: "rate",
      className: "px-[6px] py-3 whitespace-nowrap",
    },
    {
      title: "Amount",
      onHeaderCell: (column) => ({
        style: {
          background: "#CCCCCC",
          color:"black",
          fontWeight:"bold"
        },
      }),
      dataIndex: "amount",
      key: "amount",
      className: "px-[6px] py-3 whitespace-nowrap",
    },
  ];
  const matkaColumn = [
    {
        title: 'SR.',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => index + 1,
        align: 'center',
    },
    {
        title: 'Matka Name',
        dataIndex: 'matkaName',
        key: 'matkaName',
        align: 'left',
    },
    {
        title: 'Bet Number',
        dataIndex: 'betNumber',
        key: 'betNumber',
        align: 'center',
    },
    {
        title: 'Game Type',
        dataIndex: 'gameType',
        key: 'gameType',
        align: 'center',
    },
    {
        title: 'Amt.',
        dataIndex: 'amount',
        key: 'amount',
        render: (amount) => Number.parseFloat(Math.abs(amount)).toFixed(2).replace(/\.?0+$/, ""),
        align: 'center',
    },
    {
        title: 'Result',
        dataIndex: 'isDeclare',
        key: 'isDeclare',
        render: (isDeclare, record) => (isDeclare === 1 ? (record.result === null ? "Not Declare" : record.result) : "Not Declare"),
        align: 'center',
    },
    {
        title: 'P&L',
        dataIndex: 'profitLoss',
        key: 'profitLoss',
        render: (profitLoss) => (
            <span className={profitLoss > 0 ? "text-red-500" : "text-green-800"}>
                {Number.parseFloat(Math.abs(profitLoss)).toFixed(2).replace(/\.?0+$/, "")}
            </span>
        ),
        align: 'center',
    },
    {
        title: 'Created',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (createdAt) => createdAt ? moment(createdAt).utcOffset("+05:30").format("DD-MM-YYYY hh:mm:ss") : '',
        align: 'left',
    },
];

  const customLocale = {
    emptyText: <div></div>,
  };

  return (
    <>
     
  
    <div
      style={{
        backgroundColor: "white",
        height: "100%",
      }}
    >
  
      <div
        style={{ borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}
        className="gx-bg-grey gx-px-2 gx-text-white "
      >
        <div
          style={{ gap: "40px" }}
          className="gx-bg-flex gx-justify-content-start gx-py-1"
        >
          <div onClick={()=>{setActiveBet(0)}} >All bet</div>
          <div onClick={()=>{setActiveBet(1)}} >Match bet</div>
          <div onClick={()=>{setActiveBet(2)}} >Fancy bet</div>
        </div>
        <div
          style={{ gap: "40px" }}
          className=" gx-bg-flex gx-justify-content-start gx-py-1 "
        >
          <div onClick={()=>{setActiveBet(3)}} className="text_blink">Casino bet</div>
          <div className="text_blink">Matka bet</div>
        </div>
      </div>
      {IncompleteddataList && IncompleteddataList?.length > 0 && (activeBet === 0 || activeBet === 1) && (
              <Col className="gx-px-0 gx-py-0 gx-mx-0 gx-my-0" xs={24} sm={24}>
                <div className="gx-bg-flex gx-justify-content-center gx-bg-grey gx-fs-lg gx-font-weight-semi-bold gx-text-white gx-py-1">
                  FANCY BETS
                </div>
                <Table
                  className="gx-w-100 gx-mx-0 gx-my-0"
                  size="small"
                  rowHoverable={false}
                  title=""
                  scroll={{ x: true }}
                  dataSource={IncompleteddataList}
                  columns={IncompltedBetsColumn}
                  pagination={false}
                  bordered
                  rowClassName={(row, index) => row.Type === 'NO' ? 'matchdtailsNoBackground' : row.Type === 'YES' ? 'matchdtailsYesBackground' : "gx-bg-light-grey"}
                />
              </Col>
            )}

{mybetsData && mybetsData?.length > 0 &&  (activeBet === 0 || activeBet === 2 )&& (
              <Col className="gx-px-0 gx-py-0 gx-mx-0 gx-my-0" xs={24} sm={24}>
                <div className="gx-bg-flex gx-justify-content-center gx-bg-grey gx-fs-lg gx-font-weight-semi-bold gx-text-white gx-py-1">
                  MATCH BETS
                </div>
                <Table
                  className="gx-w-100 gx-mx-0 gx-my-0"
                  size="small"
                  rowHoverable={false}
                  title=""
                  scroll={{ x: true }}
                  dataSource={mybetsData}
                  columns={mybets}
                  pagination={false}
                  bordered
                  rowClassName={(row, index) => row.Type === 'Khai' ? 'matchdtailsNoBackground' : row.Type === 'Lagai' ? 'matchdtailsYesBackground' : "gx-bg-light-grey"}

                />
              </Col>
            )}
            {
              betList &&  betList?.length >  0 && (activeBet === 0 || activeBet === 2 ) && <Table className="gx-table-responsive "
              columns={casinoColumn}
              dataSource={betList}
              bordered
              pagination={false}
              size="small"
          /> 
            }
            {
              dataSource &&  dataSource?.length >  0  && <Table className="gx-table-responsive "
              columns={matkaColumn}
              dataSource={dataSource}
              bordered
              pagination={false}
              size="small"
          /> 
            }
            {completeddataList && completeddataList.length > 0 &&  
            <>
            <div className="gx-bg-flex gx-px-2 gx-justify-content-between gx-bg-grey gx-fs-lg gx-font-weight-semi-bold gx-text-white gx-py-1">
          <div>COMPLETED FANCY BETS</div> <div className={`${totalSessionPlusMinus >= 0 ? "gx-text-green" : "gx-text-red"}`}>{totalSessionPlusMinus ? Number.parseFloat(totalSessionPlusMinus).toFixed(2) : 0}</div>
        </div>
        <Table
          className="gx-w-100 gx-mx-0 gx-my-0"
          size="small"
          rowHoverable={false}
          title=""
          scroll={{ x: true }}
          dataSource={completeddataList}
          columns={compltedBetsColumn}
          pagination={false}
          bordered
          rowClassName={(row, index) => row.Type === 'NO' || row.Type === 'Khai' ? 'matchdtailsNoBackground' : row.Type === 'YES' || row.Type === 'Lagai' ? 'matchdtailsYesBackground' : "gx-bg-light-grey"}
        />
            </>

            }
    </div>
    </>
  );
}

export default RightSidebar;
