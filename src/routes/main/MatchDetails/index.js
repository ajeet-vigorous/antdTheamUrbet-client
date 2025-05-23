import React, { useEffect, useRef, useState } from "react";
import {
  AutoComplete,
  Button,
  Col,
  Dropdown,
  Input,
  Menu,
  Row,
  Select,
  Spin,
  Switch,
  Modal,
  Table,
} from "antd";
import { LoadingOutlined, SettingFilled } from "@ant-design/icons";
import { RxCross2 } from "react-icons/rx";
import Auxiliary from "util/Auxiliary";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  ErrorModalClose,
  getMatchDetail,
  getSportsBetsList,
  // getSportsBetsList,
  getUserBetsList,
  oddsPlaceBets,
  placeBets,
  setBetListEmpty,
  userBalance,
  userPositionByMarketId,
} from "../../../appRedux/actions/User";
import { io } from "socket.io-client";
import axios from "axios";
import MatchModal from "./MatchModal";
import moment from "moment";
import AlertModal from "./AlertModal";
import { betChipsValues, localstorage_id, noFancyMatchDetails } from "../../../constants/global";
import CompletedBetsModal from "./CompletedBetsModal";
import BetPlaceModal from "./BetPlaceModal";
import {
  getSocket,
  initSocket,
} from "../../../components/SocketConnection/SocketConnection";
import { httpPatch, httpPost } from "../../../http/http";
import { NotificationManager } from "react-notifications";
import { Link } from "react-router-dom";
import { BsGraphUp, BsArrowDownShort, BsInfoCircleFill } from "react-icons/bs";
import SessionBookDataModal from "./SessionBookDataModal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import FancyRuleModal from "./FancyRuleModal";
import LeftSidebar from "../../../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../../../components/RightSidebar/RightSidebar";
import BetListMobile from "../../../components/BetPlaceMobile/BetListMobile";

const MatchDetails = () => {
  const { marketId, eventId, cacheUrls } = useParams();
  const dispatch = useDispatch();
  const intervalIdRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  // const [socket, setSocket] = useState(null);
  const [activeTabTv, setActiveTabTv] = useState(false);
  const [activeTabFrame, setActiveTabFame] = useState(false);
  const [socketDetails, setsocketDetails] = useState(null);
  const [matchScoreDetails, setMatchScoreDetails] = useState(null);
  const [matchModal, setMatchModal] = useState(false);
  const [inputValue, setInputValue] = useState(0);
  const [minMaxCoins, setminMaxCoins] = useState({ max: null, min: null });
  const [sessionCoin, setSessionCoin] = useState({ max: null, min: null });
  const [isTieCoin, setIsTieCoin] = useState({ max: null, min: null });
  const [isTossCoin, setIsTossCoin] = useState({ max: null, min: null });
  const [isMatchCoin, setIsMatchCoin] = useState({ max: null, min: null });
  const [completedModal, setCompltedModal] = useState(false);
  const [matchBetChipPlaceModal, setMatchBetChipPlaceModal] = useState(false);
  const [showBetPlaceModal, setShowBetPlaceModal] = useState(false);
  const [totalSessionPlusMinus, setTotalSessionPlusMinus] = useState();
  const [sessionBookData, setSessionBookData] = useState();
  const [sessionBookModal, setSessionBookModal] = useState();
  const [fancyRuleModal, setFancyRuleModal] = useState(false);
  const [positionObj, setPositionObj] = useState(null)
  const {
    matchDetailsResponse,
    userpositionbymarketId,
    matchList,
    sportsBetsList,
    processingBet,
    betStatus,
  } = useSelector((state) => state.UserReducer);

  const matchBetPlaceModal = localStorage.getItem("matchBetPlaceModal")
    ? JSON.parse(localStorage.getItem("matchBetPlaceModal"))
    : false;
  const history = useHistory();
  // const decodedCacheUrl = decodeURIComponent(cacheUrls);
  const scrollToRef = useRef(null);
  const inputRef2 = useRef(null); /////// desktop
  const inputRef = useRef(null); //////// mobile
  const matchlistfromLocalStorage = JSON.parse(
    localStorage.getItem("matchList")
  );
  const matchCacheUrl = matchlistfromLocalStorage?.find(
    (el) => el.marketId === marketId
  )?.cacheUrl;

  const eventCacheUrl = matchlistfromLocalStorage?.find(
    (el) => el.marketId === marketId
  )?.otherMarketCacheUrl;

  const matchIframeUrl =
    matchlistfromLocalStorage?.find(({ marketId: id }) => id === marketId)
      ?.scoreIframe;

  const handleCloseCompletedModal = () => {
    setCompltedModal(false);
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  ///////////////////////-----------------------handling bet place Error modals------------------//////////////////////////
  useEffect(() => {
    const storedModalState = localStorage.getItem("matchBetPlaceModal");
    setMatchBetChipPlaceModal(storedModalState == "true");
  }, []);

  const handleCloseAlertModal = () => {
    dispatch(ErrorModalClose());
  };

  //////////////////////////////////////////////initial code ////////////////////
  const socketRef = useRef(null);

  const setupAsyncActions = async () => {
    getMarketCacheUrl(matchCacheUrl);
    getMarketEventUrl(eventCacheUrl);
    setDataFromLocalstorage(marketId);

    getMatchDataByMarketIdWise();
    // getuserPositionByMarketIdWise();
    fetchBetLists();

  };

  const handleClose = () => {
    setShowBetPlaceModal(false);
  };
  const setDataFromLocalstorage = async (marketId) => {
    let data = localStorage.getItem(`${marketId}_BookmakerData`);
    if (data) {
      setMatchScoreDetails(JSON.parse(data).result);
    } else {
      setMatchScoreDetails("");
    }
  };

  const setMatchDataFromLocalstorage = async (eventId) => {
    let data = localStorage.getItem(`${eventId}_MatchOddsData`);

    if (data) {
      setsocketDetails(JSON.parse(data));
    }
    // else{
    //   setsocketDetails("");
    // }
  };

  const getMatchDataByMarketIdWise = async () => {
    let reqData = {
      marketId: marketId,
    };
    dispatch(getMatchDetail(reqData));
  };
  // useEffect(() => {
  //   if (betStatus === true) {
  //     getuserPositionByMarketIdWise();
  //   }
  // }, [betStatus]);

  const socketUrl1 = matchlistfromLocalStorage?.find(
    (el) => el.marketId === marketId
  )?.socketUrl;
  const socketPermLoca = matchlistfromLocalStorage?.find(
    (el) => el.marketId === marketId
  )?.socketPerm;

  useEffect(() => {

    setMatchDataFromLocalstorage(eventId);
    setupAsyncActions(marketId);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (!isConnected) {
          connectSocket(socketUrl1);
        }
      } else if (document.visibilityState === "hidden") {
        cleanupWebSocket();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cleanupWebSocket();
      clearInterval(intervalIdRef.current);
    };
  }, [eventId, marketId]);

  useEffect(() => {
    if (!matchDetailsResponse) return;
    if (matchDetailsResponse?.status !== "INPLAY") {
      history.push("/")
    }
    // Set the socket URL
    // setSocketUrl(matchDetailsResponse.socketUrl);
    clearInterval(intervalIdRef.current);
    if (matchDetailsResponse.socketPerm) {
      if (
        !socketRef.current ||
        socketRef.current.readyState !== WebSocket.OPEN
      ) {
        connectSocket(matchDetailsResponse.socketUrl);
      }
    } else {
      callCache(matchDetailsResponse.cacheUrl);
    }

    // Clean up on unmount
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
      dispatch(setBetListEmpty())
    };
  }, [matchDetailsResponse]);

  const connectSocket = (socketUrl = matchDetailsResponse?.socketUrl) => {
    socketRef.current = io(socketUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5
    });

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      socketRef.current.emit("marketByEvent", eventId);
    });

    socketRef.current.on(eventId, (data) => {
      localStorage.setItem(`${eventId}_MatchOddsData`, data);
      setsocketDetails(JSON.parse(data));
    });

    let userID = JSON.parse(localStorage.getItem(`user_id_${localstorage_id}`));
    let token_Id = userID?.token;
    let socketSessionBet = getSocket();

    if (!socketSessionBet || socketSessionBet == null) {
      socketSessionBet = initSocket(token_Id);
    }

    socketSessionBet.on("listUpdate", (data) => {

      if (data?.isSessionListUpdate) {
        fetchBetLists(true, false, data.marketId);
      }
    });


    socketSessionBet.on("marketReload", (data) => {
      if (marketId == data.marketId) {
        window.location.reload();
      }
    });

    if (socketPermLoca === true) {
      socketRef.current.emit("JoinRoom", marketId);
      socketRef.current.on(marketId, (data) => {
        localStorage.setItem(`${marketId}_BookmakerData`, data);
        setMatchScoreDetails(JSON.parse(data).result);
      });
    }
  };
  const getMarketCacheUrl = async (cacheUrl) => {
    try {
      const response = await axios.get(cacheUrl);
      localStorage.setItem(
        `${marketId}_BookmakerData`,
        JSON.stringify(response.data)
      );
      setMatchScoreDetails(response?.data?.result);
    } catch (error) {
      setMatchScoreDetails(null);
      console.error("Error fetching market cache URL:", error);
    }
  };
  const getMarketEventUrl = async (eventurl) => {
    try {
      const response = await axios.get(eventurl);
      localStorage.setItem(
        `${eventId}_MatchOddsData`,
        JSON.stringify(response?.data?.data)
      );
      setsocketDetails(response?.data?.data);
    } catch (error) {
      setMatchScoreDetails(null);
      console.error("Error fetching market cache URL:", error);
    }
  };

  const callCache = (cacheUrl) => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    const newIntervalId = setInterval(() => getMarketCacheUrl(cacheUrl), 1000);
    intervalIdRef.current = newIntervalId;
  };

  const cleanupWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  };
  const getuserPositionByMarketIdWise = async () => {
    let reqData = {
      marketId: marketId,
    };
    dispatch(userPositionByMarketId(reqData));
  };

  const fetchBetLists = async (
    fancyBet = true,
    oddsBet = true,
    marketIdPass
  ) => {
    if (marketIdPass && marketIdPass != marketId) {
      return false;
    }
    try {
      const BetListData = {
        fancyBet: true,
        oddsBet: true,
        marketId: marketId,
        isDeleted: false,


      };
      dispatch(getSportsBetsList(BetListData));
    } catch (error) {
      console.error("Error fetching bet lists:", error);
      throw error;
    }
  };

  ///////////////////////////--------------------------handling user positions --------------///////////////
  const [returnDataObject, setReturnDataObject] = useState({});
  const [returnDataObject2, setReturnDataObject2] = useState({});

  useEffect(() => {
    if (userpositionbymarketId) {
      let oddsPos = [];

      let returMatchOdds = {};
      let returnTossMatch = {};
      if (userpositionbymarketId?.oddsPosition) {
        oddsPos = userpositionbymarketId.oddsPosition;
        oddsPos
          .filter((ele) => ele.oddsType === "matchOdds")
          .forEach((data) => {
            returMatchOdds[data._id] = data.totalPosition.toFixed(2);
          });
        setReturnDataObject(returMatchOdds);
      }
      if (userpositionbymarketId?.oddsPosition) {
        oddsPos = userpositionbymarketId.oddsPosition;
        oddsPos
          .filter((ele) => ele.oddsType === "toss")
          .forEach((data) => {
            returnTossMatch[data._id] = data.totalPosition.toFixed(2);
          });
        setReturnDataObject2(returnTossMatch);
      }
      if (userpositionbymarketId?.oddsPosition) {
        oddsPos = userpositionbymarketId.oddsPosition;
        oddsPos
          .filter((ele) => ele.oddsType === "tiedMatch")
          .forEach((data) => {
            returnTossMatch[data._id] = data.totalPosition.toFixed(2);
          });
        setReturnDataObject2(returnTossMatch);
      }

      // const finalOddsTotalPosTemp = bookmakerTeamData.map((teamData) => {
      //   let pushPos = 0;
      //   if (returnDataObjectTemp[teamData.betfairSelectionId]) {
      //     pushPos += returnDataObjectTemp[teamData.betfairSelectionId];
      //   }
      //   if (returnDataObjectTemp[teamData.bookmakerSelectionId]) {
      //     pushPos += returnDataObjectTemp[teamData.bookmakerSelectionId];
      //   }
      //   return { ...teamData, finalPos: pushPos };
      // });

      // setFinalOddsTotalPos(finalOddsTotalPosTemp);
    }
  }, [userpositionbymarketId]);

  //////////////////////////////-----------------------handling scroll effect -----------------------///////////////////////

  const scrollToElement = () => {
    // scrollToRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    if (inputRef.current) {
      // setTimeout(() => {
      //   if (inputRef.current) {
      inputRef.current.focus();
      //   }
      // }, 500);
    }
    if (inputRef2.current) {
      // setTimeout(() => {
      //   if (inputRef2.current) {
      inputRef2.current.focus();
      //   }
      // }, 500);
    }
  };
  // const scrollToRef = useRef(null);
  // const scrollToElement = () => {
  //   scrollToRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  // };
  ///////////////////---------------------Timer ConCept and bet handling handlebet place ----------------------
  const [timeLeft, setTimeLeft] = useState(0);
  const [betModalData, setBetModalData] = useState(false);
  const [betChips, setBetChips] = useState(betChipsValues);

  useEffect(() => {
    if (timeLeft === 0) {
      setBetModalData({});
      setInputValue(0);
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const handlebet = (record) => {
    setBetModalData(record);
    setTimeLeft(7);
  };

  useEffect(() => {
    const betChipsLocal = localStorage.getItem("betChipsData");
    if (betChipsLocal) {
      const betChipsData = JSON.parse(betChipsLocal);
      setBetChips(betChipsData);
    } else {
      setBetChips(betChipsValues);
    }
  }, []);


  // useEffect(() => {
  //   const authUser = localStorage.getItem("authUser");
  //   if (authUser) {
  //     const authUserData = JSON.parse(authUser);
  //     const betChipsData = authUserData?.data?.betChipsData;
  //     setBetChips(betChipsData);
  //   } else {
  //     setBetChips(betChipsValues);
  //   }
  // }, []);


  const handleCloseMatchModal = () => {
    setMatchModal(false);
  };

  /////////////////////////////////////////--------------------filtering table  odd , completed and incompletedfancy -------------------------------- ///////////////////////////
  const [oddsbetdata, setOddsbetData] = useState();
  const [incomletedFancy, setIncompletedFancy] = useState();
  const [compltedFancy, setCompletedFancy] = useState();
  useEffect(() => {
    if (sportsBetsList) {
      const sortedOddsBetData = sportsBetsList?.data?.oddsBetData
        ? sportsBetsList?.data?.oddsBetData
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];
      const filteredFancyBetData = sportsBetsList?.data?.fancyBetData
        ? sportsBetsList?.data?.fancyBetData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        : [];
      const completeFancy =
        filteredFancyBetData && filteredFancyBetData.length > 0
          ? filteredFancyBetData.filter((element) => element.isDeclare === 1)
          : [];
      let showCompletedFancy = [];

      completeFancy.map((data, key) => {
        let pos = 0;
        if (data.decisionRun >= data.run && data.type === "Y") {
          pos = Math.round(data.amount * data.odds);
        } else if (data.decisionRun >= data.run && data.type === "N") {
          pos = Math.round(-1 * data.amount * data.odds);
        } else if (data.decisionRun < data.run && data.type === "Y") {
          pos = Math.round(-1 * data.amount);
        } else if (data.decisionRun < data.run && data.type === "N") {
          pos = Math.round(data.amount);
        }
        data.pos = pos;
        completeFancy[key].pos = pos;

        showCompletedFancy.push(data);
      });
      const finalPositionInfo = {};
      sortedOddsBetData && sortedOddsBetData.forEach(item => {
        const positionInfo = item.positionInfo;

        for (const key in positionInfo) {
          if (positionInfo.hasOwnProperty(key)) {
            if (!finalPositionInfo[key]) {
              finalPositionInfo[key] = 0;
            }
            finalPositionInfo[key] += positionInfo[key];
          }
        }
      });


      setPositionObj(finalPositionInfo)



      setOddsbetData(sortedOddsBetData);
      setCompletedFancy(showCompletedFancy);
      setIncompletedFancy(
        filteredFancyBetData && filteredFancyBetData.length > 0
          ? filteredFancyBetData.filter((element) => element.isDeclare === 0)
          : []
      );
    }
  }, [sportsBetsList]);



  ////////////////////-----------------------------min max coins ----------------------//////////////////
  useEffect(() => {
    const maxCoinData = matchDetailsResponse?.maxMinCoins
      ? JSON.parse(matchDetailsResponse?.maxMinCoins)
      : {
        maximum_match_bet: null,
        minimum_match_bet: null,
        maximum_session_bet: null,
        minimum_session_bet: null,
      };

    setminMaxCoins({
      max: maxCoinData?.maximum_match_bet,
      min: maxCoinData?.minimum_match_bet,
    });
    setSessionCoin({
      max: maxCoinData?.maximum_session_bet,
      min: maxCoinData?.minimum_session_bet,
    });

    setIsTieCoin({
      max:
        maxCoinData?.maximum_tie_coins > 0
          ? maxCoinData?.maximum_tie_coins
          : maxCoinData?.maximum_match_bet,
      min: maxCoinData?.minimum_match_bet,
    });

    setIsTossCoin({
      max:
        maxCoinData?.maximum_toss_coins > 0
          ? maxCoinData?.maximum_toss_coins
          : maxCoinData?.maximum_match_bet,
      min: maxCoinData?.minimum_match_bet,
    });

    setIsMatchCoin({
      max:
        maxCoinData?.maximum_matchOdds_coins > 0
          ? maxCoinData?.maximum_matchOdds_coins
          : maxCoinData?.maximum_match_bet,
      min: maxCoinData?.minimum_match_bet,
    });
  }, [matchDetailsResponse]);
  useEffect(() => {
    if (processingBet === false) {
      fetchBetLists();
      dispatch(userBalance());
      setTimeLeft(0);
    }
  }, [processingBet]);


  /////////////////////---------------bet place --------------------////////////////////
  const placeNewBet = () => {
    if (
      betModalData.oddsType === "bookmaker" ||
      betModalData.oddsType === "matchOdds" ||
      betModalData.oddsType === "toss" ||
      betModalData.oddsType === "tiedMatch"
    ) {
      const reqData = {
        odds: betModalData.odds + "",
        amount: inputValue,
        selectionId: betModalData.selectionId + "",
        marketId: marketId + "",
        betfairMarketId: betModalData.betfairMarketId + "",
        eventId: eventId,
        betFor: betModalData.betFor + "",
        run: betModalData.runs ? betModalData.runs + "" : "0",
        oddsType: betModalData.oddsType + "",
        type:
          betModalData.oddsType === "fancy"
            ? betModalData.type + ""
            : betModalData.betType + "",
      };
      if (
        // reqData.amount <= minMaxCoins.max &&
        // reqData.amount >= minMaxCoins.min &&
        reqData.amount > 0
      ) {
        dispatch(oddsPlaceBets(reqData));
        // dispatch(userBalance());
      } else {
        setTimeLeft(0);
      }
    }
    if (betModalData.oddsType === "fancy") {
      const reqData = {
        odds: betModalData.odds + "",
        amount: inputValue,
        selectionId: betModalData.selectionId + "",
        marketId: marketId + "",
        eventId: eventId,
        betFor: betModalData.betFor + "",
        run: betModalData.runs ? betModalData.runs + "" : "0",
        oddsType: betModalData.oddsType + "",
        type:
          betModalData.oddsType === "fancy"
            ? betModalData.type + ""
            : betModalData.betType + "",
      };
      if (
        // reqData.amount <= sessionCoin.max &&
        // reqData.amount >= sessionCoin.min &&
        reqData.amount > 0
      ) {
        dispatch(placeBets(reqData));

      } else {
        setTimeLeft(0);
      }
    }
  };

  /////////////////////////////-------------------- bests calling every 10 sec ---------------------------------///////////////////////////////
  useEffect(() => {
    fetchBetLists();
    // const fetchBetListsInterval = setInterval(() => {
    //   fetchBetLists();
    // }, 3000);

    // return () => {
    //   clearInterval(fetchBetListsInterval);
    // };
  }, []);
  ////////////////////////////----------------------- Bookmaker Data --------------------//////////////////

  const bookmakerData = [];
  if (matchScoreDetails) {
    const sortedSelectionIdData = matchScoreDetails?.team_data
      ?.slice() // Create a copy of the array
      .sort((a, b) => a.team_name.localeCompare(b.team_name));

    sortedSelectionIdData.forEach((ele, i) => {
      bookmakerData.push({
        key: i,
        teamName: ele.team_name,
        lgaai: ele.lgaai,
        khaai: ele.khaai,
        positon: ele.positon,
        selectionid: ele.selectionid,
      });
    });
  }

  // const bookmakerColumn = [
  //   {
  //     title: "",
  //     dataIndex: "teamName",
  //     className: "",
  //     key: "teamName",
  //     onHeaderCell: (column) => ({
  //       style: {
  //         background: "transparent",
  //       },
  //     }),
  //     width: "60%",
  //     render: (text, record, index) => (
  //       <div className="gx-bg-flex gx-text-black">
  //         <div className=" gx-font-weight-semi-bold gx-text-uppercase">
  //           {text}
  //         </div>
  //         <div
  //           className={`gx-font-weight-semi-bold ${userpositionbymarketId?.oddsPosition?.find(
  //             (item) => item?._id === record?.selectionid
  //           )?.Position > 0
  //             ? "gx-text-primary"
  //             : "gx-text-red"
  //             } `}
  //         >
  //           {userpositionbymarketId?.oddsPosition
  //             ?.find((item) => item?._id === record?.selectionid)
  //             ?.Position.toFixed(2)}
  //         </div>
  //       </div>
  //     ),
  //   },
  //   {
  //     title: "Lagai",
  //     dataIndex: "lgaai",
  //     key: "lgaai",
  //     width: "20%",
  //     align: "center",
  //     onCell: (record) => ({
  //       className:
  //         record.running_status === "SUSPENDED"
  //           ? "matchdtailsSuspendBackground"
  //           : "matchdtailsYesBackground",
  //     }),

  //     render: (text, record, index) => (
  //       <div
  //         onClick={() => {
  //           if (Number(text) <= 0) return;
  //           handlebet({
  //             sessionName: record.teamName,
  //             odds: record.lgaai,
  //             selectionId: record.selectionid,
  //             // runs:"-",
  //             type: "YES",
  //             betType: "L",
  //             betForMarketId: marketId,
  //             marketId: marketId,
  //             eventId: eventId,
  //             oddsType: "bookmaker",
  //             betFor: "odds",
  //             printData: "Lagai",
  //           });
  //           matchBetPlaceModal && setShowBetPlaceModal(true)
  //           !matchBetPlaceModal && scrollToElement();
  //         }}
  //         className="gx-font-weight-semi-bold gx-text-black gx-fs-lg gx-text-uppercase"
  //       >
  //         {(Number(text) * 100).toFixed(0)}
  //       </div>
  //     ),
  //   },
  //   {
  //     title: "Khai",
  //     dataIndex: "khaai",
  //     key: "khaai",
  //     width: "20%",
  //     onCell: (record, rowIndex) => ({
  //       className:
  //         record.running_status === "SUSPENDED"
  //           ? "matchdtailsSuspendBackground"
  //           : "matchdtailsNoBackground",
  //     }),
  //     align: "center",
  //     render: (text, record, index) => (
  //       <div
  //         onClick={() => {
  //           if (Number(text) <= 0) return;
  //           handlebet({
  //             sessionName: record.teamName,
  //             odds: record.khaai,
  //             // runs:"-",
  //             selectionId: record.selectionid,
  //             type: "NO",
  //             betType: "K",
  //             betForMarketId: marketId,
  //             marketId: marketId,
  //             eventId: eventId,
  //             oddsType: "bookmaker",
  //             betFor: "odds",
  //             printData: "Khai",
  //           });
  //           matchBetPlaceModal && setShowBetPlaceModal(true)
  //           !matchBetPlaceModal && scrollToElement();
  //         }}
  //         className="gx-font-weight-semi-bold gx-text-black gx-fs-lg gx-text-capitalize"
  //       >
  //         {(Number(text) * 100).toFixed(0)}
  //       </div>
  //     ),
  //   },
  // ]

  const bookmakerColumn = isMobile ? [
    {
      title: "",
      dataIndex: "teamName",
      className: "",
      onHeaderCell: (column) => ({
        style: {
          background: "transparent",
        },
      }),
      key: "teamName",

      width: "60%",
      render: (text, record, index) => (
        <div className=" gx-text-black">
          <div className=" gx-font-weight-semi-bold gx-text-uppercase">
            {text}
          </div>

          <div
            className={`gx-font-weight-semi-bold ${(positionObj && positionObj[record.selectionid]) > 0
              ? "gx-text-primary"
              : positionObj && positionObj[record.selectionid] < 0 ? "gx-text-red" : "gx-text-light-grey"
              } `}
          >
            {(positionObj && positionObj[record.selectionid]) ? (positionObj[record.selectionid].toFixed(2)) : 0}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="gx-text-black gx-bg-flex gx-d-md-block gx-fs-xs gx-justify-content-center gx-font-weight-semi-bold">
          <div className="gx-px-1">LAGAI</div>
          <div className="gx-text-white">
            <BsArrowDownShort
              style={{ backgroundColor: "#4fa0e7" }}
              className="gx-text-white h-4 w-4 gx-rounded-circle"
              size={10}
            />
          </div>
        </div>
      ),
      dataIndex: "lgaai",
      key: "lgaai",
      width: "20%",
      onHeaderCell: (column) => ({
        style: {
          background: "transparent",
        },
      }),
      align: "center",
      onCell: (record) => ({
        className:
          (parseFloat(record.lgaai) === 0)
            ? "matchdtailsSuspendBackground gx-bg-light-grey "
            : "matchdtailsYesBackground",

      }),


      render: (text, record, index) => (
        (parseFloat(record.lgaai) === 0) ? <div style={{ fontSize: "10px", color: "black" }}>SUSPENDED</div> :
          <div
            onClick={() => {
              if (Number(text) <= 0) return;
              handlebet({
                sessionName: record.teamName,
                odds: record.lgaai,
                selectionId: record.selectionid,
                // runs:"-",
                type: "YES",
                betType: "L",
                betForMarketId: marketId,
                marketId: marketId,
                eventId: eventId,
                oddsType: "bookmaker",
                betFor: "odds",
                printData: "Lagai",
              });
              matchBetPlaceModal && setShowBetPlaceModal(true);
              !matchBetPlaceModal && scrollToElement();
            }}
            className="gx-font-weight-semi-bold gx-text-black gx-fs-lg gx-text-uppercase"
          >
            {(Number(text) * 100).toFixed(0)}
          </div>
      ),
    },
    {
      title: (
        <div className="gx-text-black gx-bg-flex gx-d-md-block gx-fs-xs gx-justify-content-center  gx-font-weight-semi-bold">
          <span className="gx-px-1">KHAI</span>
          <span className="gx-text-white">
            <BsArrowDownShort
              style={{ backgroundColor: "#FAA9BA" }}
              className="gx-text-white h-4 w-4 gx-rounded-circle"
              size={10}
            />
          </span>
        </div>
      ),
      dataIndex: "khaai",
      key: "khaai",
      onHeaderCell: (column) => ({
        style: {
          background: "transparent",
        },
      }),
      width: "20%",
      onCell: (record, rowIndex) => ({
        className:
          (parseFloat(record.khaai) === 0)
            ? "matchdtailsSuspendBackground gx-bg-light-grey "
            : "matchdtailsNoBackground",
      }),
      align: "center",
      render: (text, record, index) => (
        (parseFloat(record.khaai) === 0) ? <div style={{ fontSize: "10px", color: "black" }}>SUSPENDED</div> :
          <div
            onClick={() => {
              if (Number(text) <= 0) return;
              handlebet({
                sessionName: record.teamName,
                odds: record.khaai,
                // runs:"-",
                selectionId: record.selectionid,
                type: "NO",
                betType: "K",
                betForMarketId: marketId,
                marketId: marketId,
                eventId: eventId,
                oddsType: "bookmaker",
                betFor: "odds",
                printData: "Khai",
              });
              matchBetPlaceModal && setShowBetPlaceModal(true);
              !matchBetPlaceModal && scrollToElement();
            }}
            className="gx-font-weight-semi-bold gx-text-black gx-fs-lg gx-text-capitalize"
          >
            {(Number(text) * 100).toFixed(0)}
          </div>
      ),
    },

  ] : [
    {
      title: "",
      dataIndex: "teamName",
      className: "",
      onHeaderCell: (column) => ({
        style: {
          background: "transparent",
        },
      }),
      key: "teamName",

      width: "65%",
      render: (text, record, index) => (
        <div className=" gx-text-black">
          <div className=" gx-font-weight-semi-bold gx-text-uppercase">
            {text}
          </div>
          <div
            className={`gx-font-weight-semi-bold ${(positionObj && positionObj[record.selectionid]) > 0
              ? "gx-text-primary"
              : positionObj && positionObj[record.selectionid] < 0 ? "gx-text-red" : "gx-text-light-grey"
              } `}
          >
            {(positionObj && positionObj[record.selectionid]) ? (positionObj[record.selectionid].toFixed(2)) : 0}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="gx-text-black gx-font-weight-semi-bold">
          <div className="gx-px-1">LAGAI</div>
          <div className="gx-text-white">
            <BsArrowDownShort
              style={{ backgroundColor: "#4fa0e7" }}
              className="gx-text-white h-4 w-4 gx-rounded-circle"
              size={16}
            />
          </div>
        </div>
      ),
      dataIndex: "lgaai",
      key: "lgaai",
      width: "10%",
      onHeaderCell: (column) => ({
        style: {
          background: "transparent",
        },
      }),
      align: "center",
      onCell: (record) => ({
        className:
          (parseFloat(record.lgaai) === 0)
            ? "matchdtailsSuspendBackground gx-bg-light-grey "
            : "matchdtailsYesBackground",
      }),

      render: (text, record, index) => (
        (parseFloat(record.lgaai) === 0) ? <div style={{ fontSize: "10px", color: "black" }}>SUSPENDED</div> :
          <div
            onClick={() => {
              if (Number(text) <= 0) return;
              handlebet({
                sessionName: record.teamName,
                odds: record.lgaai,
                selectionId: record.selectionid,
                // runs:"-",
                type: "YES",
                betType: "L",
                betForMarketId: marketId,
                marketId: marketId,
                eventId: eventId,
                oddsType: "bookmaker",
                betFor: "odds",
                printData: "Lagai",
              });
              matchBetPlaceModal && setShowBetPlaceModal(true);
              !matchBetPlaceModal && scrollToElement();
            }}
            className="gx-font-weight-semi-bold gx-text-black gx-fs-lg gx-text-uppercase"
          >
            {(Number(text) * 100).toFixed(0)}
          </div>
      ),
    },
    {
      title: (
        <div className="gx-text-black gx-font-weight-semi-bold">
          <span className="gx-px-1">KHAI</span>
          <span className="gx-text-white">
            <BsArrowDownShort
              style={{ backgroundColor: "#FAA9BA" }}
              className="gx-text-white h-4 w-4 gx-rounded-circle"
              size={16}
            />
          </span>
        </div>
      ),
      dataIndex: "khaai",
      key: "khaai",
      onHeaderCell: (column) => ({
        style: {
          background: "transparent",
        },
      }),
      width: "10%",
      onCell: (record, rowIndex) => ({
        className:
          (parseFloat(record.khaai) === 0)
            ? "matchdtailsSuspendBackground gx-bg-light-grey"
            : "matchdtailsNoBackground",
      }),
      align: "center",
      render: (text, record, index) => (
        (parseFloat(record.khaai) === 0) ? <div style={{ fontSize: "10px", color: "black" }}>SUSPENDED</div> :
          <div
            onClick={() => {
              if (Number(text) <= 0) return;
              handlebet({
                sessionName: record.teamName,
                odds: record.khaai,
                // runs:"-",
                selectionId: record.selectionid,
                type: "NO",
                betType: "K",
                betForMarketId: marketId,
                marketId: marketId,
                eventId: eventId,
                oddsType: "bookmaker",
                betFor: "odds",
                printData: "Khai",
              });
              matchBetPlaceModal && setShowBetPlaceModal(true);
              !matchBetPlaceModal && scrollToElement();
            }}
            className="gx-font-weight-semi-bold gx-text-black gx-fs-lg gx-text-capitalize"
          >
            {(Number(text) * 100).toFixed(0)}
          </div>
      ),
    },
    {
      title: "",
      key: "teanName",
      onHeaderCell: (column) => ({
        style: {
          background: "transparent",
        },
      }),
      width: "15%",
      render: (text, record, index) => <div className="gx-bg-flex"></div>,
    },
  ];

  ///////////////////-----------------------odddsss data -------------------//////////////////////


  const oddsData = [];
  if (socketDetails) {
    const matchoddsData = socketDetails?.find(
      (el) => el.marketType === "Match Odds"
    );
    const betfairmatchoddsMarketId = matchoddsData?.marketId;

    if (matchoddsData) {
      matchoddsData.runners?.forEach((ele, i) => {
        oddsData.push({
          key: i,
          runnerName: ele.selectionName,
          selectionId: ele.selectionId,
          lgaaiprice: socketDetails
            ?.find((el) => el.marketType === "Match Odds")
            ?.runners?.find((item) => item.selectionId === ele.selectionId)?.ex
            ?.availableToLay[0]?.price,
          lgaaisize: socketDetails
            ?.find((el) => el.marketType === "Match Odds")
            ?.runners?.find((item) => item.selectionId === ele.selectionId)
            ?.ex?.availableToLay[0]?.size?.toFixed(2),
          khaaiprice: socketDetails
            ?.find((el) => el.marketType === "Match Odds")
            ?.runners?.find((item) => item.selectionId === ele.selectionId)?.ex
            ?.availableToBack[0]?.price,
          khaaisize: socketDetails
            ?.find((el) => el.marketType === "Match Odds")
            ?.runners?.find((item) => item.selectionId === ele.selectionId)
            ?.ex?.availableToBack[0]?.size?.toFixed(2),
          oddsposition:
            returnDataObject[ele.selectionId] != 0
              ? returnDataObject[ele.selectionId]
              : "-",
          betfairMarketId: betfairmatchoddsMarketId,
        });
      });
    }
  }

  const oddsColumn = isMobile
    ? [
      {
        title: "",
        dataIndex: "runnerName",

        key: "runnerName",
        onHeaderCell: (column) => ({
          style: {
            background: "transparent",
          },
        }),

        width: "60%",
        render: (text, record, index) => (
          <div className="">
            <div className=" gx-font-weight-semi-bold gx-text-black gx-text-uppercase">
              <BsGraphUp /> {text}
            </div>
            <div
              className={`gx-font-weight-semi-bold ${(positionObj && positionObj[record.selectionId]) > 0 ? "gx-text-primary" : (positionObj && positionObj[record.selectionId]) ? "gx-text-red" : 'gx-text-light-grey'
                } `}
            >
              {(positionObj && positionObj[record.selectionId]) ? (positionObj && positionObj[record.selectionId]) : 0}
            </div>
          </div>
        ),
      },

      {
        title: (
          <div className="gx-text-black gx-font-weight-semi-bold">
            <div className="gx-px-1">LAGAI</div>
            <div className="gx-text-white">
              <BsArrowDownShort
                style={{ backgroundColor: "#4fa0e7" }}
                className="gx-text-white h-4 w-4 gx-rounded-circle"
                size={16}
              />
            </div>
          </div>
        ),
        dataIndex: "lgaai",
        key: "lgaai",
        onHeaderCell: (column) => ({
          style: {
            background: "transparent",
          },
        }),
        width: "20%",
        onCell: (record, rowIndex) => ({
          className:
            record.running_status === "SUSPENDED"
              ? "matchdtailsSuspendBackground"
              : "matchdtailsYesBackground",
        }),
        align: "center",
        render: (text, record, index) => (
          <div
            onClick={() => {
              if (Number(text) <= 0) return;
              handlebet({
                sessionName: record.runnerName,
                odds: record.khaaiprice,
                selectionId: record.selectionId,
                type: "NO",
                betType: "L",
                runs: record.khaaisize,
                betForMarketId: marketId,
                marketId: marketId,
                eventId: eventId,
                oddsType: "matchOdds",
                betFor: "matchOdds",
                printData: "Lagai",
                betfairMarketId: record.betfairMarketId,
              });

              matchBetPlaceModal && setShowBetPlaceModal(true);
              !matchBetPlaceModal && scrollToElement();
            }}
            className="gx-font-weight-semi-bold gx-text-black gx-bg-flex gx-flex-column"
          >
            <span>{record.khaaiprice}</span>
            <span className="gx-fs-xs">{record.khaaisize}</span>
          </div>
        ),
      },

      {
        title: (
          <div className="gx-text-black gx-font-weight-semi-bold">
            <span className="gx-px-1">KHAI</span>
            <span className="gx-text-white">
              <BsArrowDownShort
                style={{ backgroundColor: "#FAA9BA" }}
                className="gx-text-white h-4 w-4 gx-rounded-circle"
                size={16}
              />
            </span>
          </div>
        ),
        dataIndex: "khaai",
        key: "khaai",
        width: "20%",
        onHeaderCell: (column) => ({
          style: {
            background: "transparent",
          },
        }),
        onCell: (record) => ({
          className:
            record.running_status === "SUSPENDED"
              ? "matchdtailsSuspendBackground"
              : "matchdtailsNoBackground",
        }),
        align: "center",
        render: (text, record, index) => (
          <div
            onClick={() => {
              if (Number(text) <= 0) return;
              handlebet({
                sessionName: record.runnerName,
                odds: record.lgaaiprice,
                selectionId: record.selectionId,
                type: "YES",
                betType: "K",
                runs: record.lgaaisize,
                betForMarketId: marketId,
                marketId: marketId,
                eventId: eventId,
                oddsType: "matchOdds",
                betFor: "matchOdds",
                printData: "Khai",
                betfairMarketId: record.betfairMarketId,
              });
              matchBetPlaceModal && setShowBetPlaceModal(true);
              !matchBetPlaceModal && scrollToElement();
            }}
            className="gx-font-weight-semi-bold gx-text-black gx-bg-flex gx-flex-column"
          >
            <span>{record.lgaaiprice}</span>
            <span className="gx-fs-xs">{record.lgaaisize}</span>
          </div>
        ),
      },
    ]
    : [
      {
        title: "",
        dataIndex: "runnerName",

        key: "runnerName",
        onHeaderCell: (column) => ({
          style: {
            background: "transparent",
          },
        }),

        width: "65%",
        render: (text, record, index) => (
          <div className="">
            <div className=" gx-font-weight-semi-bold gx-text-black gx-text-uppercase">
              <BsGraphUp /> {text}
            </div>
            <div
              className={`gx-font-weight-semi-bold ${(positionObj && positionObj[record.selectionId]) > 0 ? "gx-text-primary" : (positionObj && positionObj[record.selectionId]) ? "gx-text-red" : 'gx-text-light-grey'
                } `}
            >
              {(positionObj && positionObj[record.selectionId]) ? (positionObj && positionObj[record.selectionId]) : 0}
            </div>
          </div>
        ),
      },

      {
        title: (
          <div className="gx-text-black gx-font-weight-semi-bold">
            <div className="gx-px-1">LAGAI</div>
            <div className="gx-text-white">
              <BsArrowDownShort
                style={{ backgroundColor: "#4fa0e7" }}
                className="gx-text-white h-4 w-4 gx-rounded-circle"
                size={16}
              />
            </div>
          </div>
        ),
        dataIndex: "lgaai",
        key: "lgaai",
        onHeaderCell: (column) => ({
          style: {
            background: "transparent",
          },
        }),
        width: "10%",
        onCell: (record, rowIndex) => ({
          className:
            record.running_status === "SUSPENDED"
              ? "matchdtailsSuspendBackground"
              : "matchdtailsYesBackground",
        }),
        align: "center",
        render: (text, record, index) => (
          <div
            onClick={() => {
              if (Number(text) <= 0) return;
              handlebet({
                sessionName: record.runnerName,
                odds: record.khaaiprice,
                selectionId: record.selectionId,
                type: "NO",
                betType: "L",
                runs: record.khaaisize,
                betForMarketId: marketId,
                marketId: marketId,
                eventId: eventId,
                oddsType: "matchOdds",
                betFor: "matchOdds",
                printData: "Lagai",
                betfairMarketId: record.betfairMarketId,
              });

              matchBetPlaceModal && setShowBetPlaceModal(true);
              !matchBetPlaceModal && scrollToElement();
            }}
            className="gx-font-weight-semi-bold gx-text-black gx-bg-flex gx-flex-column"
          >
            <span>{record.khaaiprice}</span>
            <span className="gx-fs-xs">{record.khaaisize}</span>
          </div>
        ),
      },

      {
        title: (
          <div className="gx-text-black gx-font-weight-semi-bold">
            <span className="gx-px-1">KHAI</span>
            <span className="gx-text-white">
              <BsArrowDownShort
                style={{ backgroundColor: "#FAA9BA" }}
                className="gx-text-white h-4 w-4 gx-rounded-circle"
                size={16}
              />
            </span>
          </div>
        ),
        dataIndex: "khaai",
        key: "khaai",
        width: "10%",
        onHeaderCell: (column) => ({
          style: {
            background: "transparent",
          },
        }),
        onCell: (record) => ({
          className:
            record.running_status === "SUSPENDED"
              ? "matchdtailsSuspendBackground"
              : "matchdtailsNoBackground",
        }),
        align: "center",
        render: (text, record, index) => (
          <div
            onClick={() => {
              if (Number(text) <= 0) return;
              handlebet({
                sessionName: record.runnerName,
                odds: record.lgaaiprice,
                selectionId: record.selectionId,
                type: "YES",
                betType: "K",
                runs: record.lgaaisize,
                betForMarketId: marketId,
                marketId: marketId,
                eventId: eventId,
                oddsType: "matchOdds",
                betFor: "matchOdds",
                printData: "Khai",
                betfairMarketId: record.betfairMarketId,
              });
              matchBetPlaceModal && setShowBetPlaceModal(true);
              !matchBetPlaceModal && scrollToElement();
            }}
            className="gx-font-weight-semi-bold gx-text-black gx-bg-flex gx-flex-column"
          >
            <span>{record.lgaaiprice}</span>
            <span className="gx-fs-xs">{record.lgaaisize}</span>
          </div>
        ),
      },
      {
        title: "",
        key: "teanName",
        onHeaderCell: (column) => ({
          style: {
            background: "transparent",
          },
        }),
        width: "15%",
        render: (text, record, index) => <div className="gx-bg-flex"></div>,
      },
    ];

  ///////////////////////////////////-------------------Tied data --------------////////////////////////

  const tiedData = [];
  if (socketDetails) {
    const tiedMatchData = socketDetails?.find(
      (el) => el.marketType === "Tied Match"
    );

    // const sortedSelectionIdData = tiedMatchData?.selectionIdData?.slice()
    //   ?.sort((a, b) => a.sortPriority - b.sortPriority);

    const betfairTiedId = tiedMatchData?.marketId;

    if (tiedMatchData) {
      tiedMatchData.runners?.forEach((ele, i) => {
        tiedData.push({
          key: i,
          runnerName: ele?.selectionName,
          selectionId: ele.selectionId,
          lgaaiprice: socketDetails
            ?.find((el) => el.marketType === "Tied Match")
            ?.runners?.find((item) => item.selectionId === ele.selectionId)?.ex
            ?.availableToLay[0]?.price,
          lgaaisize: socketDetails
            ?.find((el) => el.marketType === "Tied Match")
            ?.runners?.find((item) => item.selectionId === ele.selectionId)
            ?.ex?.availableToLay[0]?.size.toFixed(2),
          khaaiprice: socketDetails
            ?.find((el) => el.marketType === "Tied Match")
            ?.runners?.find((item) => item.selectionId === ele.selectionId)?.ex
            ?.availableToBack[0]?.price,
          khaaisize: socketDetails
            ?.find((el) => el.marketType === "Tied Match")
            ?.runners?.find((item) => item.selectionId === ele.selectionId)
            ?.ex?.availableToBack[0]?.size.toFixed(2),
          tiedposition:
            returnDataObject2[ele.selectionId] != 0
              ? returnDataObject2[ele.selectionId]
              : 0,
          betfairMarketId: betfairTiedId,
        });
      });
    }
  }
  const tiedColumn = [
    {
      title: (
        <div
          style={{ display: "flex " }}
          className="gx-bg-flex gx-justify-content-between minMax"
        >
          <span className="gx-text-uppercase">Tied Match</span>
          <span style={{ textWrap: "nowrap" }}>
            Min: {isTieCoin?.min} Max: {isTieCoin?.max}
          </span>
        </div>
      ),
      dataIndex: "runnerName",
      width: "60%",
      render: (text, record, index) => (
        <div className="gx-bg-flex gx-text-black">
          <div className=" gx-font-weight-semi-bold ">{text}</div>
          <div
            className={`gx-font-weight-semi-bold ${(positionObj && positionObj[record.selectionId]) > 0 ? "gx-text-primary" : (positionObj && positionObj[record.selectionId]) ? "gx-text-red" : 'gx-text-light-grey'
              } `}
          >
            {(positionObj && positionObj[record.selectionId]) ? (positionObj && positionObj[record.selectionId]) : 0}
          </div>
        </div>
      ),
    },

    {
      title: "Lagai",
      dataIndex: "lgaai",
      key: "lgaai",
      width: "20%",
      onCell: (record, rowIndex) => ({
        className:
          record.running_status === "SUSPENDED"
            ? "matchdtailsSuspendBackground"
            : "matchdtailsYesBackground",
      }),
      align: "center",
      render: (text, record, index) => (
        <div
          onClick={() => {
            if (Number(text) <= 0) return;
            handlebet({
              sessionName: record.runnerName,
              odds: record.khaaiprice,
              selectionId: record.selectionId,
              type: "YES",
              betType: "L",
              run: "0",
              runs: record.khaaisize,
              betForMarketId: marketId,
              marketId: marketId,
              eventId: eventId,
              oddsType: "tiedMatch",
              betFor: "tiedMatch",
              printData: "Lagai",
              betfairMarketId: record.betfairMarketId,
            });
            matchBetPlaceModal && setShowBetPlaceModal(true);
            !matchBetPlaceModal && scrollToElement();
          }}
          className="gx-font-weight-semi-bold gx-text-black gx-bg-flex gx-flex-column"
        >
          <span>{record.khaaiprice}</span>
          <span className="gx-fs-xs">{record.khaaisize}</span>
        </div>
      ),
    },

    {
      title: "Khai",
      dataIndex: "khaai",
      key: "khaai",
      width: "20%",
      onCell: (record) => ({
        className:
          record.running_status === "SUSPENDED"
            ? "matchdtailsSuspendBackground"
            : " matchdtailsNoBackground",
      }),
      align: "center",
      render: (text, record, index) => (
        <div
          onClick={() => {
            if (Number(text) <= 0) return;
            handlebet({
              sessionName: record.runnerName,
              odds: record.lgaaiprice,
              selectionId: record.selectionId,
              type: "NO",
              betType: "K",
              run: "0",
              runs: record.lgaaisize,
              betForMarketId: marketId,
              marketId: marketId,
              eventId: eventId,
              oddsType: "tiedMatch",
              betFor: "tiedMatch",
              printData: "Khai",
              betfairMarketId: record.betfairMarketId,
            });
            matchBetPlaceModal && setShowBetPlaceModal(true);
            !matchBetPlaceModal && scrollToElement();
          }}
          className="gx-font-weight-semi-bold gx-text-black gx-bg-flex gx-flex-column"
        >
          <span>{record.lgaaiprice}</span>
          <span className="gx-fs-xs">{record.lgaaisize}</span>
        </div>
      ),
    },
  ];

  ///////////////////////////////////-------------------Toss data --------------////////////////////////
  const tossData = [];
  if (matchScoreDetails) {
    // const sortedSelectionIdData = matchScoreDetails?.toss_data

    const tossMarket = matchScoreDetails?.toss_data;
    if (tossMarket) {
      tossMarket.forEach((ele, i) => {
        tossData.push({
          key: i,
          runnerName: ele?.team_name,
          selectionId: ele.selectionid,
          lgaaiprice: ele.lgaai,
          lgaaisize: socketDetails
            ?.find((el) => el.marketType === "To Win the Toss")
            ?.runners?.find((item) => item.selectionId === ele.selectionId)
            ?.ex?.availableToLay[0]?.size.toFixed(2),
          khaaiprice: ele.khaai,
          khaaisize: socketDetails
            ?.find((el) => el.marketType === "To Win the Toss")
            ?.runners?.find((item) => item.selectionId === ele.selectionId)
            ?.ex?.availableToBack[0]?.size.toFixed(2),
          tossposition:
            returnDataObject2[ele.selectionid] != 0
              ? returnDataObject2[ele.selectionid]
              : 0,

          // lgaaiprice: Number(ele.lgaai) * 100,
          // lgaaisize: socketDetails
          //   ?.find((el) => el.marketType === "To Win the Toss")
          //   ?.runners?.find((item) => item.selectionId === ele.selectionid)
          //   ?.ex?.availableToLay[0]?.size.toFixed(2),
          // khaaiprice: Number(ele.khaai) * 100,
          // khaaisize: socketDetails
          //   ?.find((el) => el.marketType === "To Win the Toss")
          //   ?.runners?.find((item) => item.selectionId === ele.selectionid)
          //   ?.ex?.availableToBack[0]?.size.toFixed(2),
        });
      });
    }
  }

  const tossColumn = isMobile
    ? [
      {
        title: (
          <div
            style={{ display: "flex " }}
            className="gx-bg-flex gx-justify-content-between minMax"
          >
            <span className="gx-text-uppercase text_blink gx-fs-11">Toss Book</span>
            <span style={{ textWrap: "nowrap" }} className="gx-fs-11">
              Min: {isTossCoin?.min} Max: {isTossCoin?.max}
            </span>
          </div>
        ),
        dataIndex: "runnerName",

        key: "runnerName",

        width: "60%",
        render: (text, record, index) => (
          <div className=" gx-text-black">
            <div className=" gx-font-weight-semi-bold ">{text}</div>

            <div
              className={`gx-font-weight-semi-bold ${(positionObj && positionObj[record.selectionId]) > 0 ? "gx-text-primary" : (positionObj && positionObj[record.selectionId]) < 0 ? "gx-text-red" : 'gx-text-light-grey'
                } `}
            >
              {(positionObj && positionObj[record.selectionId]) ? (positionObj && positionObj[record.selectionId].toFixed(2)) : 0}
            </div>
          </div>
        ),
      },
      {
        title: "LAGAI",
        dataIndex: "lgaai",
        onCell: (record, rowIndex) => ({
          className:
            record.running_status === "SUSPENDED"
              ? "matchdtailsSuspendBackground"
              : "matchdtailsYesBackground",
        }),
        key: "lgaai",
        width: "20%",
        align: "center",
        render: (text, record, index) => (
          <div
            onClick={() => {
              if (Number(record.lgaaiprice) <= 0) return;
              handlebet({
                sessionName: record.runnerName,
                odds: record.lgaaiprice,
                selectionId: record.selectionId,
                type: "NO",
                betType: "L",
                // run:record.khaaisize,
                // runs:"-",
                betForMarketId: marketId,
                marketId: marketId,
                eventId: eventId,
                oddsType: "toss",
                betFor: "toss",
                printData: "Lay",
              });
              matchBetPlaceModal && setShowBetPlaceModal(true);
              !matchBetPlaceModal && scrollToElement();
            }}
            className=" gx-bg-flex gx-text-black gx-flex-column"
          >
            <span className="gx-font-weight-semi-bold">
              {Number(record.lgaaiprice) * 100}
            </span>
            <span className="gx-fs-xs">
              {record.lgaaisize ? record.lgaaisize : "100"}
            </span>
          </div>
        ),
      },

      {
        title: "KHAI",
        dataIndex: "khaai",
        key: "khaai",
        width: "20%",
        onCell: (record) => ({
          className:
            record.running_status === "SUSPENDED"
              ? "matchdtailsSuspendBackground"
              : "matchdtailsNoBackground",
        }),
        align: "center",
        render: (text, record, index) => (
          <div
            onClick={() => {
              if (Number(record.khaaiprice) <= 0) return;
              handlebet({
                sessionName: record.runnerName,
                odds: record.khaaiprice,
                selectionId: record.selectionId,
                type: "NO",
                betType: "K",
                // runs:"-",
                // run:record.khaaisize,
                betForMarketId: marketId,
                marketId: marketId,
                eventId: eventId,
                oddsType: "toss",
                betFor: "toss",
                printData: "Back",
              });
              matchBetPlaceModal && setShowBetPlaceModal(true);
              !matchBetPlaceModal && scrollToElement();
            }}
            className=" gx-text-black gx-bg-flex gx-flex-column"
          >
            <span className="gx-font-weight-semi-bold">
              {Number(record.khaaiprice) * 100}
            </span>
            <span className="gx-fs-xs">
              {record.khaaisize ? record.khaaisize : "100"}
            </span>
          </div>
        ),
      },
    ]
    : [
      {
        title: (
          <div
            style={{ display: "flex " }}
            className="gx-bg-flex gx-justify-content-between "
          >
            <span className="gx-text-uppercase text_blink gx-fs-11">Toss Book</span>
            {/* <span style={{ textWrap: "nowrap" }}>
            Min: {isTossCoin?.min} Max: {isTossCoin?.max}
          </span> */}
          </div>
        ),
        dataIndex: "runnerName",

        key: "runnerName",

        width: "65%",
        render: (text, record, index) => (
          <div className=" gx-text-black">
            <div className=" gx-font-weight-semi-bold ">{text}</div>

            <div
              className={`gx-font-weight-semi-bold ${(positionObj && positionObj[record.selectionId]) >= 0 ? "gx-text-primary" : "gx-text-red"
                } `}
            >
              {(positionObj && positionObj[record.selectionId]) ? (positionObj && positionObj[record.selectionId].toFixed(2)) : 0.0}
            </div>
          </div>
        ),
      },
      {
        title: "LAGAI",
        dataIndex: "lgaai",
        onCell: (record, rowIndex) => ({
          className:
            record.running_status === "SUSPENDED"
              ? "matchdtailsSuspendBackground"
              : "matchdtailsYesBackground",
        }),
        key: "lgaai",
        width: "10%",
        align: "center",
        render: (text, record, index) => (
          <div
            onClick={() => {
              if (Number(record.lgaaiprice) <= 0) return;
              handlebet({
                sessionName: record.runnerName,
                odds: record.lgaaiprice,
                selectionId: record.selectionId,
                type: "NO",
                betType: "L",
                // run:record.khaaisize,
                // runs:"-",
                betForMarketId: marketId,
                marketId: marketId,
                eventId: eventId,
                oddsType: "toss",
                betFor: "toss",
                printData: "Lay",
              });
              matchBetPlaceModal && setShowBetPlaceModal(true);
              !matchBetPlaceModal && scrollToElement();
            }}
            className=" gx-bg-flex gx-text-black gx-flex-column"
          >
            <span className="gx-font-weight-semi-bold">
              {Number(record.lgaaiprice) * 100}
            </span>
            <span className="gx-fs-xs">
              {record.lgaaisize ? record.lgaaisize : "100"}
            </span>
          </div>
        ),
      },

      {
        title: "KHAI",
        dataIndex: "khaai",
        key: "khaai",
        width: "10%",
        onCell: (record) => ({
          className:
            record.running_status === "SUSPENDED"
              ? "matchdtailsSuspendBackground"
              : "matchdtailsNoBackground",
        }),
        align: "center",
        render: (text, record, index) => (
          <div
            onClick={() => {
              if (Number(record.khaaiprice) <= 0) return;
              handlebet({
                sessionName: record.runnerName,
                odds: record.khaaiprice,
                selectionId: record.selectionId,
                type: "NO",
                betType: "K",
                // runs:"-",
                // run:record.khaaisize,
                betForMarketId: marketId,
                marketId: marketId,
                eventId: eventId,
                oddsType: "toss",
                betFor: "toss",
                printData: "Back",
              });
              matchBetPlaceModal && setShowBetPlaceModal(true);
              !matchBetPlaceModal && scrollToElement();
            }}
            className=" gx-text-black gx-bg-flex gx-flex-column"
          >
            <span className="gx-font-weight-semi-bold">
              {Number(record.khaaiprice) * 100}
            </span>
            <span className="gx-fs-xs">
              {record.khaaisize ? record.khaaisize : "100"}
            </span>
          </div>
        ),
      },
      {
        title: "",
        key: "xyz",
        width: "15%",
        render: (text, record, index) => <div className=""></div>,
      },
    ];

  //  //////////////////////--------------------------fancy data----------------------/////////////////////////////////

  const [data2, setData2] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  useEffect(() => {
    if (matchScoreDetails) {
      // const sortedSessions = matchScoreDetails.session.sort((a, b) => {
      //   // Helper functions
      //   const getInitialChar = (str) => str.trim().charAt(0);
      //   const startsWithDigit = (str) => /^\d/.test(str);
      //   const includesOver = (str) => /OVER/.test(str);
      //   const getNumericPart = (str) =>
      //     parseInt(str.match(/^\d+/)?.[0] || "0", 10);
      //   const containsFirst = (str) =>
      //     /\b1ST\b|\bFIRST\b/.test(str.toUpperCase());

      //   // Extract session names
      //   const nameA = a.session_name;
      //   const nameB = b.session_name;

      //   // Check properties of the session names
      //   const isDigitA = startsWithDigit(nameA);
      //   const isDigitB = startsWithDigit(nameB);
      //   const includesOverA = includesOver(nameA);
      //   const includesOverB = includesOver(nameB);
      //   const containsFirstA = containsFirst(nameA);
      //   const containsFirstB = containsFirst(nameB);

      //   // Handle cases where either session contains "1ST" or "FIRST"
      //   if (containsFirstA && !containsFirstB) return 1; // "1ST"/"FIRST" comes last
      //   if (!containsFirstA && containsFirstB) return -1; // "1ST"/"FIRST" comes last

      //   // First priority: Digits with "OVER" come before digits without "OVER"
      //   if (isDigitA && isDigitB) {
      //     if (includesOverA && !includesOverB) return -1; // "OVER" comes before non-"OVER"
      //     if (!includesOverA && includesOverB) return 1; // "OVER" comes after non-"OVER"

      //     // If both have or don't have "OVER", sort numerically
      //     const numA = getNumericPart(nameA);
      //     const numB = getNumericPart(nameB);
      //     return numA - numB;
      //   }

      //   // Second priority: Digits come before letters
      //   if (isDigitA && !isDigitB) return -1; // Digits come before letters
      //   if (!isDigitA && isDigitB) return 1; // Letters come after digits

      //   // Third priority: Sort alphabetically for letters
      //   return nameA.localeCompare(nameB);
      // });


      const order = {
        "STRING": 0,
        "ONLY": 1,
        "OVER": 2,
        "FALL OF": 3,
        "RUN": 4,
        "BOUNDARIES": 5,
        "HOW": 6,
        "BALLS": 7,
      };

      const sortedSessions = matchScoreDetails.session.sort((a, b) => {
        const getSessionType = (sessionName) => {
          if (sessionName.includes("ONLY")) return "ONLY";
          if (sessionName.includes("OVER")) return "OVER";
          if (sessionName.includes("FALL OF")) return "FALL OF";
          if (sessionName.includes("RUN")) return "RUN";
          if (sessionName.includes("BOUNDARIES")) return "BOUNDARIES";
          if (sessionName.includes("HOW")) return "HOW";
          if (sessionName.includes("BALLS")) return "BALLS";
          return "STRING"; // Default to STRING if none match
        };

        const typeA = getSessionType(a.session_name);
        const typeB = getSessionType(b.session_name);

        // Compare based on the defined order
        let orderComparison = order[typeA] - order[typeB];

        // If types are the same, further logic for "OVER" cases
        // If both are of type "OVER", sort based on the numeric value before "OVER"
        if (typeA === "OVER" && typeB === "OVER") {
          const numberA = parseInt(a.session_name.split(" ")[0]) || 0; // Extracting number before "OVER"
          const numberB = parseInt(b.session_name.split(" ")[0]) || 0; // Extracting number before "OVER"
          return numberA - numberB; // Compare based on numeric values
        }

        return orderComparison;
      });



      const newData = [];
      const newExpandedKeys = [];
      sortedSessions?.forEach((ele, i) => {
        if (ele.com_perm === "YES") {
          const record = {
            key: i,
            session_name: ele.session_name,
            oddsYes: ele.oddsYes,
            oddsNo: ele.oddsNo,
            runsNo: ele.runsNo,
            runsYes: ele.runsYes,
            running_status: ele.running_status,
            session_id: ele.session_id,
            max: ele.max,
            selectionId: ele.Selection_id,
            remark: ele.remark ? ele.remark : null,
          };
          newData.push(record);
          if (record.remark) {
            newExpandedKeys.push(record.session_id);
          }
        }
      });
      setData2(newData);
      setExpandedRowKeys(newExpandedKeys); // Set expanded rows initially
    }
  }, [matchScoreDetails]);



  const fancyColumns = isMobile
    ? [
      {
        title: (
          <div
            style={{ display: "flex " }}
            className="gx-bg-flex gx-justify-content-between  "
          >
            <div>
              <span className="gx-text-uppercase gx-fs-11 text_blink gx-pr-1">
                Fancy
              </span>
              <span className="gx-fs-11" style={{ textWrap: "nowrap" }} >
                Min: {sessionCoin?.min} <br /> Max: {sessionCoin?.max}
              </span>
            </div>
            <BsInfoCircleFill
              onClick={() => {
                openFancyRuleModal();
              }}
              style={{ color: "#208091" }}
              className="gx-fs-lg"
            />
          </div>
        ),
        dataIndex: "session_name",
        key: "session_name",
        width: "60%",
        padding: "0px",

        render: (text, record, index) => {
          return (
            <div className=" gx-my-0 gx-text-black gx-bg-flex gx-flex-column">
              <div className="gx-bg-flex">
                <div className="gx-font-weight-semi-bold">{text}</div>
                {/* <div className="gx-font-weight-semi-bold gx-fs-sm">
                session Limit : {record.max}
              </div> */}
                <div style={{ gap: "5px" }} className="gx-bg-flex">
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item>Min: 100</Menu.Item>
                        <Menu.Item>Max: {record.max}</Menu.Item>
                      </Menu>
                    }
                    // getPopupContainer={trigger => trigger.parentElement}
                    trigger={["click"]}
                  >
                    <BsInfoCircleFill
                      style={{ color: "#208091" }}
                      className="gx-fs-xl"
                    />
                  </Dropdown>

                  <Button
                    onClick={() => {
                      getSessionDetailBySelectionId(record.session_id);
                      setSessionBookModal(true);
                    }}
                    size="small"
                    className="gx-mb-0 gx-bg-grey gx-font-weight-semi-bold gx-text-light"
                  >
                    Book
                  </Button>
                </div>
              </div>


            </div>
          );
        },
      },
      {
        title: "NO",
        dataIndex: "oddsNo",
        key: "oddsNo",
        width: "20%",
        onCell: (record, rowIndex) => ({
          className:
            record.running_status === "SUSPENDED"
              ? "matchdtailsSuspendBackground matchdtailsNoBackground gx-bg-light-grey"
              : "matchdtailsNoBackground",
        }),
        align: "center",
        render: (text, record) => {

          return record.running_status !== "SUSPENDED" ? (
            <div
              onClick={() => {
                if (record.runsNo <= 0) return;
                handlebet({
                  sessionName: record.session_name,
                  odds: record.oddsNo,
                  runs: record.runsNo,
                  selectionId: record.session_id,
                  type: "N",
                  betForMarketId: marketId,
                  marketId: marketId,
                  eventId: eventId,
                  oddsType: "fancy",
                  betFor: "fancy",
                  printData: "No",
                });
                matchBetPlaceModal && setShowBetPlaceModal(true);
                !matchBetPlaceModal && scrollToElement();
              }}
            >
              <div className="gx-font-weight-semi-bold gx-fs-lg gx-text-black">
                {record.runsNo}
              </div>
              <div className="gx-font-weight-semi-bold gx-fs-xs gx-text-black">
                {(Number(text) * 100).toFixed(0)}
              </div>
            </div>
          ) : (
            <>
              <div className="gx-fs-xs gx-py-1" style={{ fontSize: "8px" }}>
                {record.running_status}
              </div>

            </>
          );
        },
      },
      {
        title: "YES",
        dataIndex: "oddsYes",
        width: "20%",
        onCell: (record) => ({
          className:
            record.running_status === "SUSPENDED"
              ? "matchdtailsSuspendBackground matchdtailsYesBackground gx-bg-light-grey"
              : "matchdtailsYesBackground",
        }),
        key: "oddsYes",

        align: "center",
        render: (text, record) => {
          return record.running_status !== "SUSPENDED" ? (
            <div
              onClick={() => {
                if (record.runsYes <= 0) return;
                handlebet({
                  sessionName: record.session_name,
                  odds: record.oddsYes,
                  runs: record.runsYes,
                  selectionId: record.session_id,
                  type: "Y",
                  betForMarketId: marketId,
                  marketId: marketId,
                  eventId: eventId,
                  oddsType: "fancy",
                  betFor: "fancy",
                  printData: "Yes",
                });
                matchBetPlaceModal && setShowBetPlaceModal(true);
                !matchBetPlaceModal && scrollToElement();
              }}
            >
              <div className="gx-font-weight-semi-bold gx-fs-lg gx-text-black">
                {record.runsYes}
              </div>
              <div className="gx-font-weight-semi-bold gx-fs-xs gx-text-black">
                {(Number(text) * 100).toFixed(0)}
              </div>
            </div>
          ) : (
            <>
              <div>
                <div className="gx-fs-xs gx-py-1" style={{ fontSize: "8px" }}>
                  {record.running_status}
                </div>

              </div>
            </>
          );
        },
      },
    ]
    : [
      {
        title: (
          <div
            style={{ display: "flex " }}
            className="gx-d-block gx-d-md-flex gx-justify-content-between "
          >
            <div>
              <span className="gx-text-uppercase text_blink gx-pr-2">
                Fancy
              </span>
              <span style={{ textWrap: "nowrap" }}>
                Min: {sessionCoin?.min} Max: {sessionCoin?.max}
              </span>
            </div>
            <BsInfoCircleFill
              onClick={() => openFancyRuleModal()}
              style={{ color: "#208091" }}
              className="gx-fs-xl"
            />
          </div>
        ),
        dataIndex: "session_name",
        key: "session_name",
        width: "65%",
        padding: "0px",

        render: (text, record, index) => {
          return (
            <div className=" gx-my-0 gx-text-black gx-bg-flex gx-flex-column">
              <div className="gx-bg-flex">
                <div className="gx-font-weight-semi-bold">{text}</div>
                {/* <div className="gx-font-weight-semi-bold gx-fs-sm">
                session Limit : {record.max}
              </div> */}
                <div style={{ gap: "5px" }} className="gx-bg-flex">
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item>Min: 100</Menu.Item>
                        <Menu.Item>Max: {record.max}</Menu.Item>
                      </Menu>
                    }
                    // getPopupContainer={trigger => trigger.parentElement}
                    trigger={["click"]}
                  >
                    <BsInfoCircleFill
                      style={{ color: "#208091" }}
                      className="gx-fs-xl"
                    />
                  </Dropdown>

                  <Button
                    onClick={() => {
                      getSessionDetailBySelectionId(record.session_id);
                      setSessionBookModal(true);
                    }}
                    size="small"
                    className="gx-mb-0 gx-bg-grey gx-font-weight-semi-bold gx-text-light"
                  >
                    Book
                  </Button>
                </div>
              </div>


            </div>
          );
        },
      },
      {
        title: "NO",
        dataIndex: "oddsNo",
        key: "oddsNo",
        width: "10%",
        onCell: (record, rowIndex) => ({
          className:
            record.running_status === "SUSPENDED"
              ? "matchdtailsSuspendBackground matchdtailsNoBackground gx-bg-light-grey"
              : "matchdtailsNoBackground",
        }),
        align: "center",
        render: (text, record) => {
          return record.running_status !== "SUSPENDED" ? (
            <div
              onClick={() => {
                if (record.runsNo <= 0) return;
                handlebet({
                  sessionName: record.session_name,
                  odds: record.oddsNo,
                  runs: record.runsNo,
                  selectionId: record.session_id,
                  type: "N",
                  betForMarketId: marketId,
                  marketId: marketId,
                  eventId: eventId,
                  oddsType: "fancy",
                  betFor: "fancy",
                  printData: "No",
                });
                matchBetPlaceModal && setShowBetPlaceModal(true);
                !matchBetPlaceModal && scrollToElement();
              }}
            >
              <div className="gx-font-weight-semi-bold gx-fs-lg gx-text-black">
                {record.runsNo}
              </div>
              <div className="gx-font-weight-semi-bold gx-fs-xs gx-text-black">
                {(Number(text) * 100).toFixed(0)}
              </div>
            </div>
          ) : (
            <>
              <div className="gx-fs-xs gx-py-1" style={{ fontSize: "8px" }}>
                {record.running_status}
              </div>

            </>
          );
        },
      },
      {
        title: "YES",
        dataIndex: "oddsYes",
        width: "10%",
        onCell: (record) => ({
          className:
            record.running_status === "SUSPENDED"
              ? "matchdtailsSuspendBackground matchdtailsYesBackground gx-bg-light-grey"
              : "matchdtailsYesBackground",
        }),
        key: "oddsYes",

        align: "center",
        render: (text, record) => {
          return record.running_status !== "SUSPENDED" ? (
            <div
              onClick={() => {
                if (record.runsYes <= 0) return;
                handlebet({
                  sessionName: record.session_name,
                  odds: record.oddsYes,
                  runs: record.runsYes,
                  selectionId: record.session_id,
                  type: "Y",
                  betForMarketId: marketId,
                  marketId: marketId,
                  eventId: eventId,
                  oddsType: "fancy",
                  betFor: "fancy",
                  printData: "Yes",
                });
                matchBetPlaceModal && setShowBetPlaceModal(true);
                !matchBetPlaceModal && scrollToElement();
              }}
            >
              <div className="gx-font-weight-semi-bold gx-fs-lg gx-text-black">
                {record.runsYes}
              </div>
              <div className="gx-font-weight-semi-bold gx-fs-xs gx-text-black">
                {(Number(text) * 100).toFixed(0)}
              </div>
            </div>
          ) : (
            <>
              <div>
                <div className="gx-fs-xs gx-py-1" style={{ fontSize: "8px" }}>
                  {record.running_status}
                </div>

              </div>
            </>
          );
        },
      },
      {
        title: "",
        key: "xyz",
        width: "15%",
        padding: "0px",

        render: (text, record, index) => {
          return <div className=" "></div>;
        },
      },
    ];

  const expandedRowRender = (record) => {
    return record.remark ? (
      <div className="gx-font-weight-semi-bold gx-text-red">
        <span>{record.remark}</span>
      </div>
    ) : null;
  };
  //........................................No Commition fancy Data......................................................//

  const [NoCommFancyData, setNoCommFancyData] = useState([]);
  const [expandedRowKeysNoComm, setExpandedRowKeysNoComm] = useState([]);
  useEffect(() => {
    if (matchScoreDetails) {
      // const sortedSessions = matchScoreDetails.session.sort((a, b) => {
      //   // Helper functions
      //   const getInitialChar = (str) => str.trim().charAt(0);
      //   const startsWithDigit = (str) => /^\d/.test(str);
      //   const includesOver = (str) => /OVER/.test(str);
      //   const getNumericPart = (str) =>
      //     parseInt(str.match(/^\d+/)?.[0] || "0", 10);
      //   const containsFirst = (str) =>
      //     /\b1ST\b|\bFIRST\b/.test(str.toUpperCase());

      //   // Extract session names
      //   const nameA = a.session_name;
      //   const nameB = b.session_name;

      //   // Check properties of the session names
      //   const isDigitA = startsWithDigit(nameA);
      //   const isDigitB = startsWithDigit(nameB);
      //   const includesOverA = includesOver(nameA);
      //   const includesOverB = includesOver(nameB);
      //   const containsFirstA = containsFirst(nameA);
      //   const containsFirstB = containsFirst(nameB);

      //   // Handle cases where either session contains "1ST" or "FIRST"
      //   if (containsFirstA && !containsFirstB) return 1; // "1ST"/"FIRST" comes last
      //   if (!containsFirstA && containsFirstB) return -1; // "1ST"/"FIRST" comes last

      //   // First priority: Digits with "OVER" come before digits without "OVER"
      //   if (isDigitA && isDigitB) {
      //     if (includesOverA && !includesOverB) return -1; // "OVER" comes before non-"OVER"
      //     if (!includesOverA && includesOverB) return 1; // "OVER" comes after non-"OVER"

      //     // If both have or don't have "OVER", sort numerically
      //     const numA = getNumericPart(nameA);
      //     const numB = getNumericPart(nameB);
      //     return numA - numB;
      //   }

      //   // Second priority: Digits come before letters
      //   if (isDigitA && !isDigitB) return -1; // Digits come before letters
      //   if (!isDigitA && isDigitB) return 1; // Letters come after digits

      //   // Third priority: Sort alphabetically for letters
      //   return nameA.localeCompare(nameB);
      // });




      const order = {
        "STRING": 0,
        "ONLY": 1,
        "OVER": 2,
        "FALL OF": 3,
        "RUN": 4,
        "BOUNDARIES": 5,
        "HOW": 6,
        "BALLS": 7,
      };

      const sortedSessions = matchScoreDetails.session.sort((a, b) => {
        const getSessionType = (sessionName) => {
          if (sessionName.includes("ONLY")) return "ONLY";
          if (sessionName.includes("OVER")) return "OVER";
          if (sessionName.includes("FALL OF")) return "FALL OF";
          if (sessionName.includes("RUN")) return "RUN";
          if (sessionName.includes("BOUNDARIES")) return "BOUNDARIES";
          if (sessionName.includes("HOW")) return "HOW";
          if (sessionName.includes("BALLS")) return "BALLS";
          return "STRING"; // Default to STRING if none match
        };

        const typeA = getSessionType(a.session_name);
        const typeB = getSessionType(b.session_name);

        // Compare based on the defined order
        let orderComparison = order[typeA] - order[typeB];

        // If types are the same, further logic for "OVER" cases
        // If both are of type "OVER", sort based on the numeric value before "OVER"
        if (typeA === "OVER" && typeB === "OVER") {
          const numberA = parseInt(a.session_name.split(" ")[0]) || 0; // Extracting number before "OVER"
          const numberB = parseInt(b.session_name.split(" ")[0]) || 0; // Extracting number before "OVER"
          return numberA - numberB; // Compare based on numeric values
        }

        return orderComparison;
      });


      const newData = [];
      const newExpandedKeys = [];
      sortedSessions?.forEach((ele, i) => {
        if (ele.com_perm === "NO") {
          const record = {
            key: i,
            session_name: ele.session_name,
            oddsYes: ele.oddsYes,
            oddsNo: ele.oddsNo,
            runsNo: ele.runsNo,
            runsYes: ele.runsYes,
            running_status: ele.running_status,
            session_id: ele.session_id,
            max: ele.max,
            selectionId: ele.Selection_id,
            remark: ele.remark ? ele.remark : null,
          };
          newData.push(record);
          if (record.remark) {
            newExpandedKeys.push(record.session_id);
          }
        }
      });
      setNoCommFancyData(newData);
      setExpandedRowKeysNoComm(newExpandedKeys);
    }
  }, [matchScoreDetails]);
  const NoCommfancyColumns = isMobile
    ? [
      {
        title: (
          <div
            style={{ display: "flex " }}
            className="gx-bg-flex gx-justify-content-between "
          >
            <div>
              <span className="gx-text-uppercase text_blink gx-pr-2 gx-fs-11">
                No Comm Fancy
              </span>
              <span style={{ textWrap: "nowrap" }} className="gx-fs-11">
                Min: {sessionCoin?.min} <br /> Max: {sessionCoin?.max}
              </span>
            </div>
            {/* <BsInfoCircleFill style={{color:"#208091"}} className="gx-fs-xl" /> */}
          </div>
        ),
        dataIndex: "session_name",
        key: "session_name",
        width: "60%",
        padding: "0px",

        render: (text, record, index) => {
          return (
            <div className=" gx-my-0 gx-text-black gx-bg-flex gx-flex-column">
              <div className="gx-bg-flex">
                <div className="gx-font-weight-semi-bold">{text}</div>
                {/* <div className="gx-font-weight-semi-bold gx-fs-sm">
                session Limit : {record.max}
              </div> */}
                <div style={{ gap: "5px" }} className="gx-bg-flex">
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item>Min: 100</Menu.Item>
                        <Menu.Item>Max: {record.max}</Menu.Item>
                      </Menu>
                    }
                    // getPopupContainer={trigger => trigger.parentElement}
                    trigger={["click"]}
                  >
                    <BsInfoCircleFill
                      style={{ color: "#208091" }}
                      className="gx-fs-xl"
                    />
                  </Dropdown>

                  <Button
                    onClick={() => {
                      getSessionDetailBySelectionId(record.session_id);
                      setSessionBookModal(true);
                    }}
                    size="small"
                    className="gx-mb-0 gx-bg-grey gx-font-weight-semi-bold gx-text-light"
                  >
                    Book
                  </Button>
                </div>
              </div>


            </div>
          );
        },
      },
      {
        title: "NO",
        dataIndex: "oddsNo",
        key: "oddsNo",
        width: "20%",
        onCell: (record, rowIndex) => ({
          className:
            record.running_status === "SUSPENDED"
              ? "matchdtailsSuspendBackground matchdtailsNoBackground gx-bg-light-grey"
              : "matchdtailsNoBackground",
        }),
        align: "center",
        render: (text, record) => {
          return record.running_status !== "SUSPENDED" ? (
            <div
              onClick={() => {
                if (record.runsNo <= 0) return;
                handlebet({
                  sessionName: record.session_name,
                  odds: record.oddsNo,
                  runs: record.runsNo,
                  selectionId: record.session_id,
                  type: "N",
                  betForMarketId: marketId,
                  marketId: marketId,
                  eventId: eventId,
                  oddsType: "fancy",
                  betFor: "fancy",
                  printData: "No",
                });
                matchBetPlaceModal && setShowBetPlaceModal(true);
                !matchBetPlaceModal && scrollToElement();
              }}
            >
              <div className="gx-font-weight-semi-bold gx-fs-lg gx-text-black">
                {record.runsNo}
              </div>
              <div className="gx-font-weight-semi-bold gx-fs-xs gx-text-black">
                {(Number(text) * 100).toFixed(0)}
              </div>
            </div>
          ) : (
            <>
              <div>
                <div className="gx-fs-xs gx-py-1" style={{ fontSize: "8px" }}>
                  {record.running_status ? record.running_status : 'SUSPENDED'}
                </div>

              </div>
            </>
          );
        },
      },
      {
        title: "YES",
        dataIndex: "oddsYes",
        width: "20%",
        onCell: (record) => ({
          className:
            record.running_status === "SUSPENDED"
              ? "matchdtailsSuspendBackground matchdtailsYesBackground gx-bg-light-grey"
              : "matchdtailsYesBackground",
        }),
        key: "oddsYes",

        align: "center",
        render: (text, record) => {
          return record.running_status !== "SUSPENDED" ? (
            <div
              onClick={() => {
                if (record.runsYes <= 0) return;
                handlebet({
                  sessionName: record.session_name,
                  odds: record.oddsYes,
                  runs: record.runsYes,
                  selectionId: record.session_id,
                  type: "Y",
                  betForMarketId: marketId,
                  marketId: marketId,
                  eventId: eventId,
                  oddsType: "fancy",
                  betFor: "fancy",
                  printData: "Yes",
                });
                matchBetPlaceModal && setShowBetPlaceModal(true);
                !matchBetPlaceModal && scrollToElement();
              }}
            >
              <div className="gx-font-weight-semi-bold gx-fs-lg gx-text-black">
                {record.runsYes}
              </div>
              <div className="gx-font-weight-semi-bold gx-fs-xs gx-text-black">
                {(Number(text) * 100).toFixed(0)}
              </div>
            </div>
          ) : (
            <>
              <div className="gx-fs-xs gx-py-1" style={{ fontSize: "8px" }}>
                {record.running_status ? record.running_status : 'SUSPENDED'}
              </div>


            </>
          );
        },
      },
    ]
    : [
      {
        title: (
          <div
            style={{ display: "flex " }}
            className="gx-bg-flex gx-justify-content-between "
          >
            <div>
              <span className="gx-text-uppercase text_blink gx-pr-2">
                No Comm Fancy
              </span>
              <span style={{ textWrap: "nowrap" }}>
                Min: {sessionCoin?.min} Max: {sessionCoin?.max}
              </span>
            </div>
            {/* <BsInfoCircleFill style={{color:"#208091"}} className="gx-fs-xl" /> */}
          </div>
        ),
        dataIndex: "session_name",
        key: "session_name",
        width: "65%",
        padding: "0px",

        render: (text, record, index) => {
          return (
            <div className=" gx-my-0 gx-text-black gx-bg-flex gx-flex-column">
              <div className="gx-bg-flex">
                <div className="gx-font-weight-semi-bold">{text}</div>
                {/* <div className="gx-font-weight-semi-bold gx-fs-sm">
                session Limit : {record.max}
              </div> */}
                <div style={{ gap: "5px" }} className="gx-bg-flex">
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item>Min: 100</Menu.Item>
                        <Menu.Item>Max: {record.max}</Menu.Item>
                      </Menu>
                    }
                    // getPopupContainer={trigger => trigger.parentElement}
                    trigger={["click"]}
                  >
                    <BsInfoCircleFill
                      style={{ color: "#208091" }}
                      className="gx-fs-xl"
                    />
                  </Dropdown>

                  <Button
                    size="small"
                    className="gx-mb-0 gx-bg-grey gx-font-weight-semi-bold gx-text-light"
                  >
                    Book
                  </Button>
                </div>
              </div>


            </div>
          );
        },
      },
      {
        title: "NO",
        dataIndex: "oddsNo",
        key: "oddsNo",
        width: "10%",
        onCell: (record, rowIndex) => ({
          className:
            record.running_status === "SUSPENDED"
              ? "matchdtailsSuspendBackground matchdtailsNoBackground gx-bg-light-grey"
              : "matchdtailsNoBackground",
        }),
        align: "center",
        render: (text, record) => {
          return record.running_status !== "SUSPENDED" ? (
            <div
              onClick={() => {
                if (record.runsNo <= 0) return;
                handlebet({
                  sessionName: record.session_name,
                  odds: record.oddsNo,
                  runs: record.runsNo,
                  selectionId: record.session_id,
                  type: "N",
                  betForMarketId: marketId,
                  marketId: marketId,
                  eventId: eventId,
                  oddsType: "fancy",
                  betFor: "fancy",
                  printData: "No",
                });
                matchBetPlaceModal && setShowBetPlaceModal(true);
                !matchBetPlaceModal && scrollToElement();
              }}
            >
              <div className="gx-font-weight-semi-bold gx-fs-lg gx-text-black">
                {record.runsNo}
              </div>
              <div className="gx-font-weight-semi-bold gx-fs-xs gx-text-black">
                {(Number(text) * 100).toFixed(0)}
              </div>
            </div>
          ) : (
            <>
              <div>
                <div className="gx-fs-xs gx-py-1" style={{ fontSize: "8px" }}>
                  {record.running_status ? record.running_status : 'SUSPENDED'}
                </div>

              </div>
            </>
          );
        },
      },
      {
        title: "YES",
        dataIndex: "oddsYes",
        width: "10%",
        onCell: (record) => ({
          className:
            record.running_status === "SUSPENDED"
              ? "matchdtailsSuspendBackground matchdtailsYesBackground gx-bg-light-grey"
              : "matchdtailsYesBackground",
        }),
        key: "oddsYes",

        align: "center",
        render: (text, record) => {
          return record.running_status !== "SUSPENDED" ? (
            <div
              onClick={() => {
                if (record.runsYes <= 0) return;
                handlebet({
                  sessionName: record.session_name,
                  odds: record.oddsYes,
                  runs: record.runsYes,
                  selectionId: record.session_id,
                  type: "Y",
                  betForMarketId: marketId,
                  marketId: marketId,
                  eventId: eventId,
                  oddsType: "fancy",
                  betFor: "fancy",
                  printData: "Yes",
                });
                matchBetPlaceModal && setShowBetPlaceModal(true);
                !matchBetPlaceModal && scrollToElement();
              }}
            >
              <div className="gx-font-weight-semi-bold gx-fs-lg gx-text-black">
                {record.runsYes}
              </div>
              <div className="gx-font-weight-semi-bold gx-fs-xs gx-text-black">
                {(Number(text) * 100).toFixed(0)}
              </div>
            </div>
          ) : (
            <>
              <div className="gx-fs-xs gx-py-1" style={{ fontSize: "8px" }}>
                {record.running_status ? record.running_status : 'SUSPENDED'}
              </div>

            </>
          );
        },
      },
      {
        title: "",
        key: "session_namefgbnh",
        width: "15%",
        padding: "0px",

        render: (text, record, index) => {
          return (
            <div className="gx-text-black gx-my-0 gx-bg-flex gx-flex-column"></div>
          );
        },
      },
    ];

  ////////////////////////////////////////////////End Of No Commition Fancy data

  //  //////////////////////--------------------------match bets data----------------------/////////////////////////////////
  const mybets = [
    {
      title: "TEAM",
      dataIndex: "Team",
      key: "Team",
      render: (value) => (
        <span className="gx-text-nowrap gx-text-uppercase gx-font-weight-semi-bold">
          {value}
        </span>
      ),
    },
    {
      title: "ODDSTYPE",
      dataIndex: "oddsType",
      key: "oddsType",
      render: (value) => (
        <span className="gx-text-nowrap gx-text-uppercase gx-font-weight-semi-bold">
          {value}
        </span>
      ),
    },
    {
      title: "AMOUNT",
      dataIndex: "Amount",
      key: "Amount",
      render: (value) => (
        <span className="gx-text-nowrap gx-text-uppercase gx-font-weight-semi-bold">
          {value}
        </span>
      ),
    },

    {
      title: "RATE",
      dataIndex: "Rate",
      key: "Rate",
      render: (value) => (
        <span className="gx-text-nowrap gx-text-uppercase gx-font-weight-semi-bold">
          {value}
        </span>
      ),
    },
    {
      title: "MODE",
      dataIndex: "Type",
      key: "Type",
      render: (value) => (
        <span className="gx-text-nowrap gx-text-uppercase gx-font-weight-semi-bold">
          {value}
        </span>
      ),
    },
  ];
  const generateOddsData = () => {
    const data = [];

    oddsbetdata?.forEach((element, index) => {
      data.push({
        key: index,
        Runs: element.run,
        Rate: Number.parseFloat(100 * element.odds).toFixed(2),
        Amount: Number.parseFloat(element.amount).toFixed(2),
        Type:
          element.type === "N"
            ? "NO"
            : element.type === "Y"
              ? "YES"
              : element.type === "K"
                ? "Khai"
                : element.type === "L"
                  ? "Lagai"
                  : "",

        Team: element.teamName,
        Client: `${element.userInfo && element.userInfo.clientName
          ? element.userInfo.clientName
          : ""
          } ${element.userInfo && element.userInfo.clientCode
            ? element.userInfo.clientCode
            : ""
          }`,
        Agent: `${element.userInfo && element.userInfo.creatorName
          ? element.userInfo.creatorName
          : ""
          }`,
        oddsType: `${element.oddsType}`,
        Date: `${element.createdAt
          ? moment(element.createdAt)
            .utcOffset("+05:30")
            .format("DD MMM hh:mm:ss A")
          : ""
          }`,
        Loss: `${element.loss
          ? Number.parseFloat(Math.abs(element.loss)).toFixed(2)
          : 0
          }`,
        Profit: `${element.profit
          ? Number.parseFloat(Math.abs(element.profit)).toFixed(2)
          : 0
          }`,
      });
    });
    return data;
  };

  const mybetsData = generateOddsData();

  //////////////////////////////////////--------------------------------------Incompleted fancy data -------------------////////////////

  const IncompltedBetsColumn = [
    {
      title: "RUNNER",
      dataIndex: "Team",
      key: "Team",
      render: (value) => (
        <span className="gx-text-nowrap gx-text-uppercase gx-font-weight-semi-bold">
          {value}
        </span>
      ),
    },

    {
      title: "AMOUNT",
      dataIndex: "Amount",
      key: "Amount",
      render: (value) => (
        <span className="gx-text-nowrap gx-text-uppercase gx-font-weight-semi-bold">
          {value}
        </span>
      ),
    },
    {
      title: "RUN",
      dataIndex: "Runs",
      key: "Runs",
      render: (value) => (
        <span className="gx-text-nowrap gx-text-uppercase gx-font-weight-semi-bold">
          {value}
        </span>
      ),
    },
    {
      title: "RATE",
      dataIndex: "Rate",
      key: "Rate",
      render: (value) => (
        <span className="gx-text-nowrap gx-text-uppercase gx-font-weight-semi-bold">
          {value}
        </span>
      ),
    },
    {
      title: "MODE",
      dataIndex: "Type",
      key: "Type",
      render: (value) => (
        <span className="gx-text-nowrap gx-text-uppercase gx-font-weight-semi-bold">
          {value}
        </span>
      ),
    },
  ];

  const generateInCompletedData = () => {
    const data = [];

    incomletedFancy?.forEach((element, index) => {
      data.push({
        key: index,
        Runs: element.run,
        Rate: Number.parseFloat(100 * element.odds).toFixed(2),
        Amount: Number.parseFloat(element.amount).toFixed(2),
        Type:
          element.type === "N"
            ? "NO"
            : element.type === "Y"
              ? "YES"
              : element.type === "K"
                ? "Khaai"
                : element.type === "L"
                  ? "Lagaai"
                  : "",

        Team: element.sessionName ? element.sessionName : "-",
        Client: `${element.userInfo && element.userInfo.clientName
          ? element.userInfo.clientName
          : ""
          } ${element.userInfo && element.userInfo.clientCode
            ? element.userInfo.clientCode
            : ""
          }`,
        Agent: `${element.userInfo && element.userInfo.creatorName
          ? element.userInfo.creatorName
          : ""
          }`,
        oddsType: `${element.oddsType}`,
        Date: `${element.createdAt
          ? moment(element.createdAt)
            .utcOffset("+05:30")
            .format("DD MMM hh:mm:ss A")
          : ""
          }`,
      });
    });
    return data;
  };

  const IncompleteddataList = generateInCompletedData();
  ////////////////////////////////////////--------------------------------------completed fancy data -------------------////////////////////

  const compltedBetsColumn = [
    {
      title: "Runner",
      dataIndex: "Team",
      key: "Team",
      render: (value) => (
        <span className="gx-text-nowrap gx-text-uppercase">{value}</span>
      ),
    },

    {
      title: "Amount",
      dataIndex: "Amount",
      key: "Amount",
    },
    {
      title: "Run",
      dataIndex: "Runs",
      key: "Runs",
    },
    {
      title: "Rate",
      dataIndex: "Rate",
      key: "Rate",
    },
    {
      title: "Mode",
      dataIndex: "Type",
      key: "Type",
    },
    {
      title: "Date",
      dataIndex: "Date",
      key: "Date",
      render: (value) => <span className="gx-text-nowrap">{value}</span>,
    },
    {
      title: "Results",
      dataIndex: "results",
      key: "results",
    },
    {
      title: "P&L",
      dataIndex: "pos",
      key: "pos",
      render: (value) => (
        <span
          className={`${value > 0
            ? ""
            : value < 0
              ? ""
              : "gx-text-black"
            }`}
        >
          {value}
        </span>
      ),
    },
  ];
  const generateCompletedData = () => {
    const data = [];

    compltedFancy?.forEach((element, index) => {
      data.push({
        key: index,
        Runs: element.run,
        Rate: Number.parseFloat(100 * element.odds).toFixed(2),
        Amount: Number.parseFloat(element.amount).toFixed(2),
        Type:
          element.type === "N"
            ? "NO"
            : element.type === "Y"
              ? "YES"
              : element.type === "K"
                ? "Khai"
                : element.type === "L"
                  ? "Lagai"
                  : "",

        Team: element.sessionName,
        Client: `${element.userInfo && element.userInfo.clientName
          ? element.userInfo.clientName
          : ""
          } ${element.userInfo && element.userInfo.clientCode
            ? element.userInfo.clientCode
            : ""
          }`,
        Agent: `${element.userInfo && element.userInfo.creatorName
          ? element.userInfo.creatorName
          : ""
          }`,
        oddsType: `${element.oddsType}`,
        results: `${element.decisionRun}`,
        Date: `${element.createdAt
          ? moment(element.createdAt)
            .utcOffset("+05:30")
            .format("DD MMM hh:mm:ss A")
          : ""
          }`,
        pos: `${element.pos}`,
      });
    });
    return data;
  };

  useEffect(() => {
    let sessionPlusMinus = 0;
    compltedFancy?.map((data, key) => {
      let pos = 0;
      if (data.decisionRun >= data.run && data.type === "Y") {
        pos = Math.round(data.amount * data.odds);
      } else if (data.decisionRun >= data.run && data.type === "N") {
        pos = Math.round(-1 * data.amount * data.odds);
      } else if (data.decisionRun < data.run && data.type === "Y") {
        pos = Math.round(-1 * data.amount);
      } else if (data.decisionRun < data.run && data.type === "N") {
        pos = Math.round(data.amount);
      }
      sessionPlusMinus += pos;
      data.pos = pos;
      compltedFancy[key].pos = pos;
    });
    setTotalSessionPlusMinus(sessionPlusMinus);
  }, [compltedFancy]);

  const completeddataList = generateCompletedData();
  const handleInputChange = (value) => {
    if (!isNaN(value)) {
      setInputValue(value);
    } else if (value === "") {
      setInputValue(value);
    }
  };

  const options = Object.keys(betChips).map((key) => ({
    value: String(betChips[key]),
  }));

  // if(!matchDetailsResponse || matchDetailsResponse === undefined){
  //   return
  // }

  const handleBetModalToggle = () => {
    const newState = !matchBetPlaceModal;
    setMatchBetChipPlaceModal(newState);
    updateBetChipsModal();
  };
  const updateBetChipsModal = async () => {
    try {
      const currentBetChipModalStatus = localStorage.getItem(
        "matchBetPlaceModal"
      )
        ? JSON.parse(localStorage.getItem("matchBetPlaceModal"))
        : false;
      const reqData = {
        status: !currentBetChipModalStatus,
      };
      const result = await httpPatch("user/updateBetChipsModal", reqData);

      if (result) {
        if (result.error === false) {
          localStorage.setItem(
            "matchBetPlaceModal",
            JSON.stringify(result?.data?.betChipsModal)
          );
          NotificationManager.success(result?.message, "Success", 1000, () => {
            alert("callback");
          });
        } else {
          // Add error handling code for when result.error is true
          console.error("Error occurred: ", result.message);
        }
      } else {
        console.error("No result returned from the server.");
      }
    } catch (error) {
      // Handle any exceptions that might occur during the HTTP request
      console.error("An exception occurred: ", error.message);
    }
  };

  //////////////////////////------------------------------------ handlng session book by selectionId--------------///////////////////////////////

  const getSessionDetailBySelectionId = async (selectionId) => {
    try {
      const reqData = {
        marketId: marketId,
        selectionId: selectionId + "",
      };
      const result = await httpPost(
        "sports/getSessionPositionBySelectionId",
        reqData
      );
      if (result) {
        if (result.error === false) {
          setSessionBookData(result?.data);
        } else {
          console.error("Error occurred: ", result.message);
        }
      } else {
        console.error("No result returned from the server.");
      }
    } catch (error) {
      console.error("An exception occurred: ", error.message);
    }
  };

  const handleCloseSessionBookModal = () => {
    setSessionBookData(null);
    setSessionBookModal(false);
  };

  const openFancyRuleModal = () => {
    setFancyRuleModal(true);
  };
  const closeFancyRuleModal = () => {
    setFancyRuleModal(false);
  };



  return (
    <>
      <Row justify={"center"}>
        <Col xs={12}>
          {
            showBetPlaceModal && timeLeft > 0 && <BetPlaceModal setShowBetPlaceModal={setShowBetPlaceModal} timeLeft={timeLeft} betModalData={betModalData} inputValue={inputValue} setInputValue={setInputValue} processingBet={processingBet} betChips={betChips} setTimeLeft={setTimeLeft} placeNewBet={placeNewBet} options={options} handleInputChange={handleInputChange} />
          }
        </Col>
      </Row>

      <Row style={{ overflow: "hidden" }} justify={"space-between"}>
        <Col
          xs={24}
          md={24}
          lg={5}
          xl={5}
          xxl={3}
          className=" gx-d-none gx-d-lg-block gx-px-2 gx-mx-0"
        >
          <LeftSidebar />
        </Col>
        <Col xs={24} md={24} lg={12} xl={12} xxl={16} className="">
          <Auxiliary>
            {sessionBookModal && (
              <SessionBookDataModal
                sessionBookData={sessionBookData}
                handleCloseSessionBookModal={handleCloseSessionBookModal}
              />
            )}



            {completedModal && (
              <CompletedBetsModal
                handleClose={handleCloseCompletedModal}
                compltedBetsColumn={compltedBetsColumn}
                completeddataList={completeddataList}
                totalSessionPlusMinus={totalSessionPlusMinus}
              />
            )}

            {fancyRuleModal && (
              <FancyRuleModal closeFancyRuleModal={closeFancyRuleModal} />
            )}
            {/* <AlertModal  onConfirm={handleCloseAlertModal} betStatus={betStatus} /> */}
            {betStatus && (
              <AlertModal
                onConfirm={handleCloseAlertModal}
                betStatusUpdate={betStatus}
              />
            )}

            <Row
              justify={"space-between"}
              className="urbet_layout_header_top gx-px-3 gx-py-2 gx-bg-grey"
            >
              <Col className="gx-bg-flex gx-align-items-center gx-justify-content-center">
                <Button
                  onClick={() => history.goBack()}
                  size="small"
                  className="  gx-mb-0 gx-text-black"
                  style={{ backgroundColor: "#ffc107" }}
                >
                  Back
                </Button>
                <span className="gx-px-2 ">
                  <Link to='/main/edit-stakes'>
                    <span className=" gx-px-1 gx-py-1 gx-font-weight-semi-bold gx-text-uppercase gx-text-white">
                      <SettingFilled style={{ fontSize: '18px' }} />
                    </span>
                  </Link>

                </span>

              </Col>

              <Col className="gx-bg-flex gx-align-items-center gx-justify-content-center">
                <Switch
                  onChange={handleBetModalToggle}
                  checked={matchBetChipPlaceModal}
                  checkedChildren="ON"
                  unCheckedChildren="OFF"
                  size='small'
                  className="gx-mx-2"
                  style={{
                    backgroundColor: matchBetChipPlaceModal ? "green" : "red",
                    transform: "scale(1.3)",

                  }}
                />
                {matchDetailsResponse?.isTv && (<>
                  <img
                    onClick={() => setActiveTabTv((tv) => !tv)}
                    style={{ height: "20px" }}
                    alt="tv"
                    src="/images/live-tv.png"
                  />
                  <div
                    onClick={() => setActiveTabTv((tv) => !tv)}
                    className=" gx-text-white"
                  >
                    Live TV
                  </div>
                </>
                )}
              </Col>


            </Row>
            <Row>
              {matchDetailsResponse?.notification && (
                <Col className=" gx-text-white gx-fs-md gx-font-weight-semi-bold gx-py-1  gx-text-uppercase" xs={24} style={{ backgroundColor: "#73766F", borderTop: '2px solid white' }}>
                  <marquee>{matchDetailsResponse?.notification ? matchDetailsResponse?.notification : null}</marquee>
                </Col>
              )}
            </Row>

            {/* <Row className="gx-bg-flex gx-align-items-center gx-justify-content-between gx-bg-grey">
        <div>
        <span
          onClick={() => setActiveTabTv((tv) => !tv)}
          className="gx-bg-primary gx-px-3 gx-py-1 gx-font-weight-semi-bold gx-text-white"
        >
          TV
        </span>
        <span className="gx-px-2 ">
        <Link to='/main/edit-stakes'>
                <span  className=" gx-px-1 gx-py-1 gx-font-weight-semi-bold gx-text-uppercase gx-text-white">
                <SettingFilled style={{ fontSize: '18px' }}/>
                </span>
               </Link>
         
          </span>
        </div>
        
        <div className="gx-py-1">
         <span className="">

         <Switch
              onChange={handleBetModalToggle}
              checked={matchBetChipPlaceModal}
              checkedChildren="ON"
              unCheckedChildren="OFF"
              size='small'
              className="gx-mx-3"
              style={{
                backgroundColor: matchBetChipPlaceModal ? "green" : "red",
                transform: "scale(1.3)",
               
              }}
            />
         </span>
        <span
          onClick={() => {
            setActiveTabFame((frame) => !frame);
          }}
          className="gx-bg-primary gx-px-3 gx-py-1 gx-font-weight-semi-bold gx-text-white"
        >
          FS
        </span>
        </div>
      
      </Row> */}
            <Row
              justify={"center"}
              className="   gx-mt-1 gx-bg-flex gx-align-items-center gx-justify-content-between"
            >
              {activeTabTv && (
                <Col
                  xs={26}
                  className="gx-bg-flex urbet_layout_header_top gx-w-100 gx-justify-content-center"
                >
                  <div className="gx-w-100">
                    <iframe
                      style={{ width: "100%", height: 250 }}
                      src={matchDetailsResponse?.tvUrl}
                      title=" "
                      className="gx-w-100"
                    ></iframe>
                  </div>
                </Col>
              )}
            </Row>
            <Row justify={"center"} className="">
              {matchDetailsResponse?.isScore && (
                <Col xs={24} sm={24} className="gx-col-full ">


                  {matchDetailsResponse?.scoreIframe || matchIframeUrl ? (
                    <Row
                      style={{ height: `${activeTabFrame ? "238px" : "125px"}` }}
                      className="urbet_layout_header_top"
                    >
                      <iframe
                        style={{ width: "100%", height: "100%", border: "none" }}
                        src={matchDetailsResponse?.scoreIframe ? matchDetailsResponse?.scoreIframe : matchIframeUrl}
                        title="Score-I-frame"
                        className=""
                      ></iframe>
                    </Row>
                  ) : null}
                </Col>
              )}

              {/* <Col
              className="gx-px-0 gx-py-0 gx-mx-0 gx-my-0 urbet_layout_header_top"
              xs={24}
              sm={24}
            >
            

              {matchDetailsResponse?.isMatchOdds &&
                socketDetails?.find((el) => el.marketType === "Match Odds") && (
                  <Table
                    className="gx-w-100 custom-ant-table gx-mx-0 gx-my-0"
                    size="small"
                    title=""
                    dataSource={oddsData}
                    columns={oddsColumn}
                    pagination={false}
                    locale={{
                      emptyText: (
                        <div
                          className="gx-text-center
                "
                        >
                          No Data found
                        </div>
                      ),
                    }}
                    scroll={{ x: true }}
                    rowClassName="no-hover"
                    style={{ marginTop: "16px" }}
                  />
                )}
            </Col> */}
              <Col className="gx-px-0 gx-py-0 gx-mx-0 gx-my-0" xs={24} sm={24}>
                <div className="gx-bg-flex gx-justify-content-between gx-align-items-center gx-py-1 gx-bg-grey gx-text-white gx-fs-md gx-px-2">
                  <div className="gx-pt-1">
                    <span className="gx-text-uppercase gx-fs-xs">
                      {matchDetailsResponse?.matchName}
                    </span>
                    &nbsp; / &nbsp;
                    <span className="gx-text-uppercase text_blink gx-fs-11">
                      Match Odds
                    </span> <br />
                    <span style={{ textWrap: "nowrap" }} className="gx-fs-11">
                      Min: {isMatchCoin?.min} Max: {isMatchCoin?.max}
                    </span>
                  </div>
                  <Button

                    onClick={() => {
                      setActiveTabFame((frame) => !frame);
                    }}
                    size="small"
                    className="gx-rounded-xxl gx-text-black  gx-mb-0 gx-top-0 gx-font-weight-semi-bold gx-fs-11 gx-text-uppercase  gx-text-white"
                    style={{ backgroundColor: "#ffc107" }}
                  >
                    {activeTabFrame ? "score" : "score"}
                  </Button>
                </div>
                {bookmakerData && bookmakerData.length > 0 ? (
                  <Table
                    className="gx-w-100 custom-ant-table gx-mx-0 gx-my-0 no-hover"
                    size="small"
                    title=""
                    dataSource={bookmakerData}
                    columns={bookmakerColumn}
                    pagination={false}
                    rowHoverable={false}
                    scroll={{ x: true }}

                    style={{ marginTop: "16px" }}
                  />
                ) : null}
              </Col>
              {/* <Col className="gx-px-0 gx-py-0 gx-mx-0 gx-my-0" xs={24} sm={24}>
          {matchDetailsResponse?.isTieOdds &&
            matchScoreDetails?.team_data?.length <= 2 &&
            socketDetails?.find((el) => el.marketType == "Tied Match") && (
              <Table
                className="gx-w-100 gx-mx-0 gx-my-0"
                size="small"
                rowHoverable={false}
                title=""
                dataSource={tiedData}
                columns={tiedColumn}
                pagination={false}
                bordered
                style={{ marginTop: "16px" }}
              />
            )}
        </Col> */}
              <Col className="gx-px-0 gx-py-0 gx-mx-0 gx-my-0" xs={24} sm={24}>
                {matchDetailsResponse?.isToss &&
                  tossData &&
                  tossData.length > 0 ? (
                  <Table
                    className="gx-w-100 gx-mx-0 gx-my-0"
                    size="small"
                    rowHoverable={false}
                    title=""
                    dataSource={tossData}
                    columns={tossColumn}
                    pagination={false}
                    style={{ marginTop: "16px" }}
                  />
                ) : null}
              </Col>
              <Col className="gx-px-0 gx-py-0 gx-mx-0 gx-my-0" xs={24} sm={24}>
                {data2 && data2.length > 0 ? (
                  <Table
                    className="gx-w-100 gx-mx-0 gx-my-0"
                    size="small"
                    title=""
                    dataSource={data2}
                    columns={fancyColumns}
                    rowKey="session_id"
                    expandable={{
                      expandedRowRender,
                      rowExpandable: (record) => !!record.remark,
                    }}
                    expandedRowKeys={expandedRowKeys}
                    onExpand={(expanded, record) => {
                      setExpandedRowKeys((prevKeys) =>
                        expanded
                          ? [...prevKeys, record.session_id]
                          : prevKeys.filter((key) => key !== record.session_id)
                      );
                    }}
                    cellPaddingBlockSM
                    pagination={false}
                    style={{ marginTop: "16px" }}
                  />
                ) : null}
              </Col>
              {noFancyMatchDetails && (
                <Col className="gx-px-0 gx-py-0 gx-mx-0 gx-my-0" xs={24} sm={24}>
                  {NoCommFancyData && NoCommFancyData.length > 0 ? (
                    <Table
                      className="gx-w-100 gx-mx-0 gx-my-0"
                      size="small"
                      title=""
                      dataSource={NoCommFancyData}
                      columns={NoCommfancyColumns}
                      cellPaddingBlockSM
                      pagination={false}
                      rowKey="session_id"
                      expandable={{
                        expandedRowRender,
                        rowExpandable: (record) => !!record.remark,
                      }}
                      expandedRowKeys={expandedRowKeysNoComm}
                      onExpand={(expanded, record) => {
                        setExpandedRowKeysNoComm((prevKeys) =>
                          expanded
                            ? [...prevKeys, record.session_id]
                            : prevKeys.filter((key) => key !== record.session_id)
                        );
                      }}
                      style={{ marginTop: "16px" }}
                    />
                  ) : null}
                </Col>
              )}
            </Row>

            {!matchBetPlaceModal && timeLeft > 0 && (
              <div
                style={{
                  position: "fixed",
                  bottom: "0px",
                  top: "auto",
                  left: "0px",
                  // transform: "translateX(-50%)",
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
                  style={{
                    backgroundColor:
                      betModalData?.printData === "No" ||
                        betModalData?.printData === "Khai"
                        ? "#FAA9BA"
                        : betModalData?.printData === "Yes" ||
                          betModalData?.printData === "Lagai" ||
                          betModalData?.printData === "Lay"
                          ? "#72BBEF"
                          : "#fff",
                    paddingInline: "20px"
                  }}
                  className="gx-py-3"
                  id="betPLaceModal"
                >
                  <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    <span style={{ fontSize: "18px", fontWeight: "600" }}>
                      {betModalData?.sessionName}
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
                        className="gx-px-2 gx-py-1 gx-font-weight-semi-bold gx-fs-xxl"
                      >
                        -
                      </div>
                      <div>
                        <Input
                          // ref={inputRef}
                          style={{ background: "white" }}
                          inputMode="numeric"
                          value={betModalData?.runs ? betModalData?.runs : "0"}
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
                        className="gx-px-2 gx-py-1 gx-font-weight-semi-bold gx-fs-xxl"
                      >
                        +
                      </div>
                    </div>
                    <div className="gx-bg-flex gx-justify-content-center gx-align-items-center">
                      <div
                        onClick={() => setInputValue(Number(inputValue) - 1)}
                        style={{
                          background: "white",
                          borderRight: "1px solid grey",
                        }}
                        className="gx-px-2 gx-py-1 gx-font-weight-semi-bold gx-fs-xxl"
                      >
                        -
                      </div>
                      <div>
                        <Input
                          // ref={inputRef}
                          inputMode="numeric"
                          value={inputValue}
                          onChange={(values) =>
                            setInputValue(Number(values.target.value))
                          }
                          type="number"
                          className="gx-font-weight-semi-bold gx-fs-lg gx-rounded-0 gx-border-0 gx-text-center"
                        />
                      </div>
                      <div
                        onClick={() => setInputValue(Number(inputValue) + 1)}
                        style={{
                          background: "white",
                          borderLeft: "1px solid grey",
                        }}
                        className="gx-px-2 gx-py-1 gx-font-weight-semi-bold gx-fs-xxl"
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
                    {betChips &&
                      Object.keys(betChips).map((key) => (
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
                          onClick={() => setInputValue(betChips[key])}
                        >
                          {Number(betChips[key]) >= 1000
                            ? (Number(betChips[key]) / 1000)
                              .toFixed(1)
                              .replace(/\.0$/, "") + "K"
                            : Number(betChips[key])}
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
                      onClick={() => setInputValue(0)}
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
                        backgroundColor: "#d2322d",
                        color: "#fff",
                        padding: "10px",
                        fontWeight: "600",
                        borderRadius: "5px",
                        border: "none",
                      }}
                      onClick={() => {
                        setTimeLeft(0);
                        setInputValue(0);
                      }}
                    >
                      CLOSE
                      <span style={{ paddingLeft: "10px" }}>{timeLeft}</span>
                    </button>
                    <button
                      style={{
                        backgroundColor: "#2f5a93",
                        color: "#fff",
                        padding: "10px",
                        fontWeight: "600",
                        borderRadius: "5px",
                        border: "none",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onClick={() => placeNewBet()}
                      disabled={processingBet}
                    >
                      PLACE BET
                      {processingBet && (
                        <div
                          className="loaderSpinner"
                          style={{ paddingLeft: "10px" }}
                        ></div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <Row justify={"center"} className=""></Row>
            <Row justify={"center"} className="">
              {mybetsData && mybetsData?.length > 0 && (
                <Col className="gx-px-0 gx-py-0 gx-mx-0 gx-d-lg-none gx-d-block gx-my-0" xs={24} sm={24}>
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
              {IncompleteddataList && IncompleteddataList?.length > 0 && (
                <Col className="gx-px-0 gx-py-0 gx-mx-0 gx-my-0 gx-d-lg-none gx-d-block" xs={24} sm={24}>
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

              {completeddataList && completeddataList?.length > 0 && (

                <Col className="gx-px-0 gx-py-1 gx-mx-0 gx-my-0 gx-d-lg-none gx-d-block" xs={24} sm={24}>
                  <div className="gx-bg-flex gx-text-uppercase gx-uppercase gx-justify-content-center gx-bg-grey gx-fs-lg gx-font-weight-semi-bold gx-text-white gx-py-1">
                    Bet Settlement
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
                    rowClassName={(row, index) => row.pos < 0 ? 'gx-bg-red gx-text-white' : row.pos > 0 ? 'gx-bg-green-0 gx-text-white' : "gx-bg-light-grey"}
                  />
                </Col>
              )}

            </Row>
            <Row className="urbet_layout_header_top gx-d-block gx-d-lg-none  gx-bg-white gx-py-2">
              <Col xs={24}>
                <div
                  onClick={() => {
                    history.push(`/main/complted-bets/${marketId}`);
                  }}
                  className="gx-text-center gx-text-primary"
                >
                  See All Completed Bets
                </div>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col className="gx-px-0 gx-py-2 gx-my-1 gx-justify-content-center">
                <Button
                  onClick={() => setMatchModal(true)}
                  className={`gx-my-0 gx-text-uppercase gx-bg-grey gx-text-white gx-font-weight-semi-bold `}
                >
                  All Matches
                </Button>
                {matchModal && (
                  <MatchModal
                    handleClose={handleCloseMatchModal}
                    datalist={matchList}
                    marketId={marketId}
                  />
                )}
              </Col>
            </Row>
          </Auxiliary>
        </Col>
        <Col
          xs={24}
          md={24}
          lg={7}
          xl={7}
          xxl={5}
          className="gx-d-none gx-d-lg-block gx-px-2 gx-mx-0"
        >
          {!matchBetPlaceModal && (
            <Row id="betPLaceModal" justify={"center"}>
              {timeLeft > 0 && (
                <Col
                  style={{
                    backgroundColor:
                      betModalData?.printData === "No" ||
                        betModalData?.printData === "Khai"
                        ? "#FAA9BA"
                        : betModalData?.printData === "Yes" ||
                          betModalData?.printData === "Lagai" ||
                          betModalData?.printData === "Lay"
                          ? "#72BBEF"
                          : "#fff",
                  }}
                  className={`gx-px-0 gx-py-0 gx-rounded-lg gx-mx-0 gx-my-0 `}
                  xs={24}
                  sm={22}
                >
                  <div className="gx-my-1 gx-lg-block gx-d-none gx-d-lg-block gx-mx-1">
                    <div className="gx-bg-flex gx-align-items-center gx-fs-xl  ">
                      <div className="gx-mb-2" style={{ gap: "40px" }}>
                        <span className="gx-fs-md gx-font-weight-semi-bold ">
                          {betModalData?.sessionName}{" "}
                        </span>
                      </div>
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
                            value={betModalData?.runs ? betModalData?.runs : "0"}
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
                          onClick={() => setInputValue(Number(inputValue) - 1)}
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
                            value={inputValue}
                            onChange={(values) =>
                              setInputValue(Number(values.target.value))
                            }
                            type="number"
                            className="gx-font-weight-semi-bold gx-fs-lg gx-rounded-0 gx-border-0 gx-text-center"
                          />
                        </div>
                        <div
                          onClick={() => setInputValue(Number(inputValue) + 1)}
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
                      {betChips &&
                        Object.keys(betChips).map((key) => (
                          <Button
                            style={{ background: "#D3D3D3" }}
                            className="gx-px-2 gx-font-weight-semi-bold gx-text-black "
                            key={key}
                            onClick={() => setInputValue(betChips[key])}
                          >
                            {Number(betChips[key]) >= 1000
                              ? (Number(betChips[key]) / 1000)
                                .toFixed(1)
                                .replace(/\.0$/, "") + "K"
                              : Number(betChips[key])}
                          </Button>
                        ))}
                      <Button
                        style={{ background: "#D3D3D3" }}
                        className="gx-px-2 gx-font-weight-semi-bold gx-text-black "
                        key="clear"
                        onClick={() => setInputValue(0)}
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
                          setTimeLeft(0);
                          setInputValue(0);
                        }}
                        style={{ backgroundColor: "#d2322d" }}
                        className="gx-font-weight-semi-bold gx-text-white gx-fs-md"
                      >
                        CLOSE
                        <span className="gx-font-weight-semi-bold gx-fs-md gx-text-white gx-px-2">
                          {timeLeft}
                        </span>
                      </Button>
                      <Button
                        disabled={processingBet}
                        onClick={() => placeNewBet()}
                        style={{ backgroundColor: "#2f5a93" }}
                        className={` gx-text-white  gx-mb-0 gx-px-2 gx-font-weight-semi-bold gx-fs-md`}
                      >
                        PLACE BET
                        {processingBet && (
                          <div className="loaderSpinner gx-px-1"></div>
                        )}
                      </Button>
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          )}

          <RightSidebar
            IncompleteddataList={IncompleteddataList}
            IncompltedBetsColumn={IncompltedBetsColumn}
            mybetsData={mybetsData}
            mybets={mybets}
            compltedBetsColumn={compltedBetsColumn}
            completeddataList={completeddataList}
            totalSessionPlusMinus={totalSessionPlusMinus}
          />
        </Col>
      </Row>

    </>
  );
};
export default MatchDetails;
