import React, { useState, useEffect } from "react";
import { Button, Col, Layout, Popover, Row } from "antd";
import { Link } from "react-router-dom";

import { toggleCollapsedSideNav } from "../../appRedux/actions";
import UserInfo from "../../components/UserInfo";
import Auxiliary from "util/Auxiliary";
import { userSignOut } from "../../appRedux/actions/Auth";
import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import Info from "./Info";
import {
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_MINI_SIDEBAR,
  TAB_SIZE,
} from "../../constants/ThemeSetting";
import { useDispatch, useSelector } from "react-redux";
import {
  domainSettingByDomain,
  getMatchList,
  userBalance,
} from "../../appRedux/actions/User";
import { useLocation } from "react-router-dom";
import { useBalance } from "../../ContextApi";
import Marquee from "react-fast-marquee";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import BetListMobile from "../../components/BetPlaceMobile/BetListMobile";
// import {HiSpeakerphone} from 'react-icons/hi'
import { HiSpeakerphone } from "react-icons/hi";
import { localstorage_id } from "../../constants/global";
import settings from "../../domainConfig";


const { Header } = Layout;

const Topbar = () => {
  const [searchText, setSearchText] = useState("");
  const [displayNumber, setDisplayNumber] = useState("");
  const { locale, navStyle } = useSelector(({ settings }) => settings);
  const navCollapsed = useSelector(({ common }) => common.navCollapsed);

  const auth = JSON.parse(useSelector((state) => state.auth?.authUser));
  const { exposureSaga, balanceSaga } = useSelector(
    (state) => state.UserReducer
  );
  const width = useSelector(({ common }) => common.width);
  const { balance, setBalance } = useBalance();

  const dispatch = useDispatch();
  const location = useLocation();

  // let notification = localStorage.getItem("notification");
  const { doaminsettingData } = useSelector((state) => state.UserReducer);
  const [showNotification, setNotification] = useState();

  useEffect(() => {
    let notificationData = localStorage.getItem("notification");
    let data = notificationData
      ? notificationData
      : doaminsettingData?.userNotification;
    setNotification(data);
  }, [doaminsettingData]);

  useEffect(() => {
    let domainSetting = {
      domainUrl: window.location.origin,
    };
    dispatch(userBalance());
    const balanceInterval = setInterval(() => {
      dispatch(userBalance());
    }, 5000);

    const interval = setInterval(() => {
      dispatch(getMatchList());
      dispatch(domainSettingByDomain(domainSetting));
    }, 60 * 1000 * 5);
    return () => {
      clearInterval(balanceInterval);
      clearInterval(interval);
    };
  }, [dispatch]);

  useEffect(() => {
    const path = location.pathname.split("/");
    if (path[1] === "main") {
      switch (path[2]) {
        case "rules":
          setDisplayNumber("Rules");
          break;
        case "matches":
          setDisplayNumber("MATCHES");
          break;

        case "dashboard":
          setDisplayNumber("");
          break;
        case "profile":
          setDisplayNumber("PROFILE");
          break;
        case "freegame":
          setDisplayNumber("Free Games");
          break;
        case "changepassword":
          setDisplayNumber("Change Password");
          break;
        case "casino":
          setDisplayNumber("");
          break;
        case "ledger":
          setDisplayNumber("Ledgers");
          break;
        case "statement":
          setDisplayNumber("Statement");
          break;

        default:
          setDisplayNumber("");
          break;
      }
     
    }
  }, [location]);



  useEffect(() => {
    // notification = localStorage.getItem("notification");
    const preventBodyScroll = () => {
      document.body.style.overflow = "hidden";
    };

    const allowBodyScroll = () => {
      document.body.style.overflow = "auto";
    };

    preventBodyScroll();
    allowBodyScroll();

    return () => {
      allowBodyScroll();
    };
  }, []);

  //  let userID = JSON.parse(localStorage.getItem("user_id"));
  //  let exposure = JSON.parse(localStorage.getItem("client-wallet-exposure"));
  //  let balance = JSON.parse(localStorage.getItem("client-wallet-balance"));
  // const modalOpen = localStorage.getItem("modalopen")

  let userID = JSON.parse(localStorage.getItem(`user_id_${localstorage_id}`));
  let exposureLocal = JSON.parse(localStorage.getItem("client-wallet-exposure"));
  let balanceLocal = JSON.parse(localStorage.getItem("client-wallet-balance"));
  const modalOpen = localStorage.getItem("modalopen");

  let client = userID?.data ? userID?.data : auth?.data;
  // let clientBalance = balance?.coins ? balance?.coins : balanceSaga;
  // let clientExposure = balance?.exposure ? balance?.exposure : exposureSaga;

  let clientBalance = balanceLocal ? balanceLocal : balanceSaga;
  let clientExposure = exposureLocal ? exposureLocal : exposureSaga ? exposureSaga : 0;

  const history = useHistory();

  useEffect(() => {
    if (userID?.data?.isPasswordChanged === false) {
      if (window.location.pathname !== "/main/changepassword") {
        history.push("/main/changepassword");
      }
    }
  }, [userID?.data]);


  const Notification = localStorage.getItem("notification");

  const [mobileBetListModal, setMobileBetListModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Account Statement");

  const handleTabClick = (tabName, path) => {
    setActiveTab(tabName); // Update active tab
    history.push(path); // Navigate to the specified path
  };
  const pathname = window.location.pathname;
  const getLinkClassName = (path) => {
    return pathname === path ? "gx-bg-grey gx-text-white" : "gx-text-black";
  };

  return (
    <>
      {mobileBetListModal && (
        <BetListMobile setMobileBetListModal={setMobileBetListModal} />
      )}
      <Header
        style={{ height: "50px", padding: 0, }}
        className="gx-bg-flex gx-w-100 gx-align-content-center gx-bg-grey"
      >
        <div

          className="gx-w-100 gx-d-lg-block gx-px-4 gx-d-none "
        >
          <div
            className="gx-w-100"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 40,
              height: "76px",
            }}
          >
            <div
              className=""
              style={{ display: "flex", alignItems: "center", gap: "16px" }}
            >
              {/* <GiHamburgerMenu onClick={() => setOpenTrue()} style={{ fontSize: '1.8rem', color: 'white', marginLeft: '8px', display: 'block' }} /> */}
              <div
                style={{
                  width: "150px",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
                className=""
              >
                <img
                  onClick={() => history.push("/main/dashboard")}
                  src={settings.logo}
                  alt="logo"
                  style={{ height: "35px", cursor: "pointer" }}
                />
              </div>
            </div>

            <div
              className="gx-w-75 gx-bg-grey"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "right",
                position: "sticky",
                top: 0,
                zIndex: 40,
                height: "50px",
              }}
            >
              <div className="gx-mr-4 gx-w-75">
                {Notification &&
                  Notification !== undefined &&
                  Notification !== "undefined" &&
                  Notification !== null && (
                    <marquee
                      scrollamount="5"
                      style={{ overflowY: "hidden", height: "20px" }}
                      gradient={false}
                      speed={70}
                      autoFill={true}
                      className=""

                    >
                      <HiSpeakerphone
                        className="gx-text-white"
                        size={18}
                        style={{ margin: "0 8px" }}
                      />
                      <span className="gx-text-white">
                        {Notification &&
                          Notification !== undefined &&
                          Notification !== "undefined" &&
                          Notification !== null &&
                          Notification}
                      </span>
                    </marquee>
                  )}
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <div style={{ color: "white", position: "relative" }} >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "400px",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          fontSize: "11px",
                          lineHeight: "1",
                          borderRadius: "4px",
                          cursor: "pointer",
                          color: "white",
                        }}
                      >
                        <p>
                          Chips:{" "}
                          <span>
                            {(Math.floor(Number(clientBalance) * 100) / 100)}
                          </span>
                        </p>
                        <p>
                          <Link to='/main/pending-bets' className="gx-text-white">
                            Expo:{" "}
                            <span>

                              {(clientExposure != undefined || clientExposure != null || !isNaN(clientExposure))
                                ? Math.floor(Number(clientExposure) * 100) / 100
                                : 0}
                            </span>
                          </Link>
                        </p>
                      </div>
                      <div>
                        <UserInfo />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div >
              <Marquee gradient={false} speed={70} className="">

                <span className="gx-text-white">g Welcomeddddddddddddddd zdsfg dsfff</span>
              </Marquee>
            </div> */}

        {/* Mobile Header  */}


        <div

          className="gx-w-100   gx-d-lg-none gx-d-block"
        >
          <div
            className="gx-w-100 gx-px-1"
            style={{
              display: "flex",
              justifyContent: "start",
              position: "sticky",
              top: 0,
              zIndex: 40,
              height: "45px",
            }}
          >
            {/* <div style={{ display: "flex", alignItems: "center", gap: "10px" }} className="gx-w-25 gx-bg-red"> */}
            {/* <GiHamburgerMenu onClick={() => setOpenTrue()} style={{ fontSize: '1.8rem', color: 'white', marginLeft: '8px', display: 'block' }} /> */}
            <div
              className="gx-w-25"
              style={{

                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}

            >
              <img
                onClick={() => history.push("/main/dashboard")}
                src={settings.logo}
                alt="logo"
                style={{ height: "25px", cursor: "pointer" }}
              />
            </div>
            {/* </div> */}
            <div className="gx-bg-flex gx-align-items-center gx-justify-content-start gx-text-uppercase gx-w-75">
              <div className="  gx-bg-flex gx-flex-column gx-align-items-end gx-justify-content-center gx-w-100 gx-mx-2">
                <UserInfo />
                <div className="gx-text-white  gx-fs-sm">
                  <span className="gx-px-1 gx-text-white gx-font-weight-bold">
                    Chips:{" "}
                    <span className="gx-text-white">

                      {(Math.floor(Number(clientBalance) * 100) / 100)}
                    </span>
                  </span>
                  <span className="gx-px-1 gx-text-white  gx-font-weight-bold">
                    <Link to='/main/pending-bets' className="gx-text-white">

                      <span className="gx-text-white">  Expo:{" "}</span>
                      <span className={`gx-text-white `}>

                        {(Math.floor(Number(clientExposure) * 100) / 100)}
                      </span>
                    </Link>
                  </span>
                </div>
              </div>
              <div

                className="gx-text-black gx-fs-xs  gx-font-weight-semi-bold gx-bg-flex gx-align-items-center gx-justify-content-end  gx-h-100 "
                onClick={() => setMobileBetListModal(true)}
              >
                <span style={{ backgroundColor: "#ffc107" }} className=" gx-py-2 gx-px-1 gx-h-100 gx-bg-flex gx-align-items-center gx-text-uppercase">
                  Bets
                </span>
              </div>
            </div>
          </div>
          {Notification &&
            Notification !== undefined &&
            Notification !== "undefined" &&
            Notification !== null && (
              <marquee
                scrollamount="5"
                style={{ overflowY: "hidden", height: "20px" }}
                gradient={false}
                speed={70}
                autoFill={true}
                className="gx-mt-3 gx-border-top gx-bg-grey"

              >
                <HiSpeakerphone
                  className="gx-text-white"
                  size={18}
                  style={{ margin: "0 8px" }}
                />
                <span className="gx-text-white ">
                  {Notification &&
                    Notification !== undefined &&
                    Notification !== "undefined" &&
                    Notification !== null &&
                    Notification}
                </span>
              </marquee>
            )}
        </div>
      </Header>
      <div className="gx-d-lg-flex gx-d-none gx-cursor-pointer gx-justify-content-start gx-bg-white gx-box-shadow">
        <span
          style={{ cursor: "pointer" }}
          className={`gx-px-3 gx-py-3  gx-fs-md gx-font-weight-semi-bold  ${getLinkClassName(
            "/main/statement"
          )}`}
          onClick={() => handleTabClick("Account Statement", "/main/statement")}
        >
          Account Statement
        </span>
        <span
          style={{ cursor: "pointer" }}
          className={`gx-px-3 gx-py-3 gx-fs-md gx-font-weight-semi-bold  ${getLinkClassName(
            "/main/ledger"
          )}`}
          onClick={() => handleTabClick("My Ledger", "/main/ledger")}
        >
          My Ledger
        </span>
        <span
          style={{ cursor: "pointer" }}
          className={`gx-px-3 gx-py-3 gx-fs-md gx-font-weight-semi-bold ${getLinkClassName(
            "/main/casino"
          )}`}
          onClick={() => handleTabClick("Live Games", "/main/casino")}
        >
          Live Games
        </span>
      </div>
    </>
  );
};

export default Topbar;
