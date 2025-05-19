import { Col, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { httpPost } from "../../http/http";

const BetListMobile = ({ setMobileBetListModal }) => {

  const [activeBet, setActiveBet] = useState(0);
  const [declaredBetList, setDeclaredBetList] = useState([]);
  const [matkaSattaList, setMatkaSattaList] = useState([]);
  const [fancyData , setFancyData] = useState([])
  const [oddData , setOddData] = useState([])
  const [sportsBetsList , setSportsBetsList] = useState([])
  const [loading , setLoading] = useState (false)


  const fancyColumn = [
    {
      title: "RUNNER",
      dataIndex: "sessionName",
      key: "Team",
      render: (value) => (
        <span className=" gx-text-uppercase gx-font-weight-semi-bold">
          {value}
        </span>
      ),
    },

    {
      title: "AMOUNT",
      dataIndex: "amount",
      key: "Amount",
      render: (value) => (
        <span className=" gx-text-uppercase gx-font-weight-semi-bold">
          {value}
        </span>
      ),
    },
    {
      title: "RUN",
      dataIndex: "run",
      key: "Runs",
      render: (value) => (
        <span className=" gx-text-uppercase gx-font-weight-semi-bold">
          {value}
        </span>
      ),
    },
    {
      title: "RATE",
      dataIndex: "odds",
      key: "Rate",
      render: (value) => (
        <span className=" gx-text-uppercase gx-font-weight-semi-bold">
          {Number.parseFloat(100 * value).toFixed(2)}
        </span>
      ),
    },
    {
      title: "MODE",
      dataIndex: "type",
      key: "Type",
      render: (value) => (
        <span className=" gx-text-uppercase gx-font-weight-semi-bold">
          { value === "N"
            ? "NO"
            : value === "Y"
              ? "YES"
              : value === "K"
                ? "Khaai"
                : value === "L"
                  ? "Lagaai"
                  : ""}
        </span>
      ),
    },
  ];

  const oddcolumn = [
    {
      title: "TEAM",
      dataIndex: "teamName",
      key: "Team",
      render: (value) => (
        <span className=" gx-text-uppercase gx-font-weight-semi-bold">
          {value}
        </span>
      ),
    },
    {
      title: "ODDSTYPE",
      dataIndex: "oddsType",
      key: "oddsType",
      render: (value) => (
        <span className=" gx-text-uppercase gx-font-weight-semi-bold">
          {value}
        </span>
      ),
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      key: "Amount",
      render: (value) => (
        <span className=" gx-text-uppercase gx-font-weight-semi-bold">
          {value}
        </span>
      ),
    },

    {
      title: "RATE",
      dataIndex: "odds",
      key: "Rate",
      render: (value) => (
        <span className=" gx-text-uppercase gx-font-weight-semi-bold">
          {Number.parseFloat(100 * value).toFixed(2)}
        </span>
      ),
    },
    {
      title: "MODE",
      dataIndex: "type",
      key: "Type",
      render: (value) => (
        <span className=" gx-text-uppercase gx-font-weight-semi-bold">
          {value === "N"
            ? "NO"
            : value === "Y"
            ? "YES"
            : value === "K"
            ? "Khai"
            : value === "L"
            ? "Lagai"
            : ""}
        </span>
      ),
    },
  ];
  const casinoColumn = [
    {
      title: "Team",
      dataIndex: "playerName",
      key: "playerName",
      render: (value, row) => (
        <span className="gx-py-1  gx-text-black gx-font-weight-semi-bold gx-text-center">
          {row.playerName}
          <br />
          {row.roundId}
        </span>
      ),
    },
    {
      title: "Mode",
      dataIndex: "betType",
      key: "betType",
      render: (value, row) => (
        <span className="gx-text-center gx-text-nowrap gx-font-weight-semi-bold gx-text-black">
          {row.betType}
        </span>
      ),
    },
    {
      title: "Rate",
      dataIndex: "odds",
      key: "odds",
      render: (value, row) => (
        <span className="gx-text-right gx-text-nowrap gx-font-weight-semi-bold gx-text-black">
          {parseFloat(row.odds)
            .toFixed(2)
            .replace(/\.?0+$/, "")}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (value, row) => (
        <span className="gx-text-center gx-text-nowrap gx-font-weight-semi-bold gx-text-black">
          {row.amount}
        </span>
      ),
    },
    {
      title: "Result",
      dataIndex: "betType",
      key: "betType",
      render: (value, row) => (
        <span
          className={`px-3 py-1 gx-text-nowrap gx-font-weight-semi-bold ${
            row.profitLoss < 0
              ? "gx-text-red"
              : row.profitLoss > 0
              ? "gx-text-green-0"
              : "text-black"
          }`}
        >
          {row.profitLoss}
          <br />
          {row.isDeclare === 1 ? <small>({row.showResult})</small> : null}
        </span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value, row) => (
        <span className="gx-text-center gx-text-nowrap gx-font-weight-semi-bold gx-text-black">
          {moment(row?.createdAt)
            .utcOffset("+05:30")
            .format("DD-MM-YYYY hh:mm:ss")}
        </span>
      ),
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


const getMatkaList = async () => {
  const reqData = {
    isDeclare:false,
    isDeleted:false
  }
  let sattaList = await httpPost('matka/matkaBetList', reqData);
  if (sattaList) {
    setMatkaSattaList(sattaList.data ? sattaList?.data : {});
  } else {
    
  }
};
const getSportsBetsList = async (reqData) => {
  setLoading(true)
  let sattaList = await httpPost('sports/betsList', reqData);
  if (sattaList) {
    setSportsBetsList(sattaList.data ? sattaList?.data : {});
  } else {
    
  }
  setLoading(false)
};
const declaredbetListfunc = async (eventId) => {
  let betReq = {
    isDeclare: false,
    isDeleted: false
  };

  try {
    let getCasinoDetails = await httpPost(`casino/diamondBetsList`, betReq);
    let totalProfitLoss = 0;
    let betList = getCasinoDetails?.data?.casinoBetData;

    if (betList && betList.length > 0) {
      betList = betList.map((bet) => {
        let profitLoss = "Not Declare";
        let profitLossCount = 0;

        if (bet.isDeclare) {
          profitLossCount = bet.profitLoss ? bet.profitLoss : 0;
          profitLoss = bet.profitLoss;
        }
        totalProfitLoss += Number(profitLossCount);
        return { ...bet, profitLoss };
      });
    }

    setDeclaredBetList(betList || []);

  } catch (error) {
    console.error("Error fetching bet list:", error);
  }
};

useEffect(()=>{
if(sportsBetsList){
  setFancyData(sportsBetsList?.fancyBetData  )
  setOddData(sportsBetsList?.oddsBetData  )
}
},[sportsBetsList])
useEffect(() => {
 const reqData ={
  fancyBet:true,
  oddsBet: true,
  isDeclare: false,
  isDeleted: false
 }
  declaredbetListfunc();
  getMatkaList()
  getSportsBetsList(reqData)
}, []);




  return (
    <div
      style={{
        position: "fixed",
        top: "5px",
        left: "0px",
        width: "100vw",
        height: "100vh",
        background: "#fff",
        padding: "0px",
        zIndex: 1000000000,
        border: "10px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        overflow: "hidden",
      }}
      className="gx-d-block gx-d-lg-none"
    >
      <div className="gx-bg-flex gx-justify-content-between gx-py-2 gx-align-items-center gx-px-3">
        <div className="gx-fs-lg gx-font-weight-bold gx-text-uppercase ">Bets</div>
        <ImCross
          onClick={() => setMobileBetListModal(false)}
          className="gx-text-red gx-font-weight-bold"
          size={20}
        />
      </div>
      
      {loading ?
<div className="gx-bg-flex gx-justify-content-center gx-align-items-center">
<div className="mobileUrbetLoader"></div>
  </div>

      : <div
        style={{
          backgroundColor: "white",
          height: "100%",
          overflow:"auto"
        }}
      >
        <div
          style={{ borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}
          className="gx-bg-grey gx-px-2 gx-text-white "
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
          <div onClick={()=>{setActiveBet(4)}} className="text_blink">Matka bet</div>
        </div>
      </div>
        </div>
        {fancyData &&
          fancyData?.length > 0 &&
          (activeBet === 0 || activeBet === 1) && (
            <Col className="gx-px-0 gx-py-0 gx-mx-0 gx-my-0 gx-my-1" xs={24} sm={24}>
              <div className="gx-bg-flex gx-justify-content-center gx-bg-grey gx-fs-lg gx-font-weight-semi-bold gx-text-white gx-py-1">
                FANCY BETS
              </div>
              <Table
                className="gx-w-100 gx-mx-0 gx-my-0"
                size="small"
                rowHoverable={false}
                title=""
                scroll={{ x: true }}
                dataSource={fancyData}
                columns={fancyColumn}
                pagination={false}
                bordered
                rowClassName={(row, index) =>
                  row.Type === "NO"
                    ? "matchdtailsNoBackground"
                    : row.Type === "YES"
                    ? "matchdtailsYesBackground"
                    : "gx-bg-light-grey"
                }
              />
            </Col>
          )}

        {oddData &&
          oddData?.length > 0 &&
          (activeBet === 0 || activeBet === 2) && (
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
                dataSource={oddData}
                columns={oddcolumn}
                pagination={false}
                bordered
                rowClassName={(row, index) =>
                  row.Type === "Khai"
                    ? "matchdtailsNoBackground"
                    : row.Type === "Lagai"
                    ? "matchdtailsYesBackground"
                    : "gx-bg-light-grey"
                }
              />
            </Col>
          )}
        {declaredBetList &&
          declaredBetList?.length > 0 &&
          (activeBet === 0 || activeBet === 3) && (
            <Col className="gx-px-0 gx-py-0 gx-mx-0 gx-my-0" xs={24} sm={24}>
            <div className="gx-bg-flex gx-justify-content-center gx-bg-grey gx-fs-lg gx-font-weight-semi-bold gx-text-white gx-py-1">
             Casino BETS
            </div>
            <Table
              className="gx-table-responsive "
              columns={casinoColumn}
              dataSource={declaredBetList}
              bordered
              pagination={false}
              size="small"
            />
              </Col>
          )}
        {matkaSattaList &&
          matkaSattaList?.length > 0 &&
          (activeBet === 0 || activeBet === 4) && (
            <Col className="gx-px-0 gx-py-0 gx-mx-0 gx-my-0" xs={24} sm={24}>
            <div className="gx-bg-flex gx-justify-content-center gx-bg-grey gx-fs-lg gx-font-weight-semi-bold gx-text-white gx-py-1">
             Matka BETS
            </div>
            <Table
              className="gx-table-responsive "
              columns={matkaColumn}
              dataSource={matkaSattaList}
              bordered
              pagination={false}
              size="small"
            />
              </Col>
          )}
           
      </div>}
    </div>
  );
};

export default BetListMobile;
