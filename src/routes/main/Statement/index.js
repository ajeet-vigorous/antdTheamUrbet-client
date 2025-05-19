import React, { useEffect, useState } from "react";
import { Col, Row, DatePicker, Table, Pagination, Button, Radio } from "antd";
import Auxiliary from "util/Auxiliary";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getUserStatement } from "../../../appRedux/actions/User";
import BackMenuButton from "../../../components/BackMenu";
import Loader from "../../../components/loader";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min";
import LeftSidebar from "../../../components/LeftSidebar/LeftSidebar";
import { FaFilter } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const Statement = () => {
  const [dateRange, setDateRange] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);
  const [dates, setDates] = useState(dateRange);
  const [userLists, setUserLists] = useState([]);
  const { userId } = useParams();
  const [currentPage, setCurrentPage] = useState(1)
  const [totalSize, setTotalSize] = useState('')
  const [activeTab, setActiveTab] = useState(1);
  const [paginationicon, setPaginationIcon] = useState(true)
  const pageSize = 50;
  const dispatch = useDispatch();
  const { userStatement, loading, balanceAmount, message } = useSelector(state => state.UserReducer)
  const { userStatementMessage } = useSelector(state => state.UserReducer)

  const [displayedData, setDisplayedData] = useState([]);
  useEffect(() => {
    getUserStatementFun()
  }, [dispatch, currentPage, userId]);

  
  useEffect(() => {
    setDisplayedData([]);
    filterData();
  }, [userLists, activeTab]);




  useEffect(() => {
   
    if(userStatement?.totalCount){ 

   
    if (userStatement?.statementData) {
      let balance = Number(userStatement.balanceAmount);
      const reversedData = [...userStatement.statementData].reverse();
      const filteredData = reversedData.map((item, index) => {
        balance += Number(item.amount);
        return {
          key: `${index}`,
          createdAt: item.createdAt,
          remark: item.remark,
          amount: item.amount,
          newAmount: balance,
          statementFor: item.statementFor,
        };
      });
      const finalData = filteredData.reverse();
      setUserLists(finalData);
      setTotalSize(userStatement?.totalCount);
      setPaginationIcon(true);
      return;
    }
  } else{
    
    if (userStatement?.length > 0) {

      let balance = Number(userStatement.balanceAmount);
      let balanceReset = false; 
      const reversedData = [...userStatement].reverse();
      const filteredData = reversedData.map((item, index) => {
        if(item.statementFor === "ACCOUNT_STATEMENT" && !balanceReset){
          balance = 0
          balanceReset = true;
        }
        balance += Number(item.amount);
        return {
          key: `${index}`,
          createdAt: item.createdAt,
          remark: item.remark,
          amount: item.amount,
          newAmount: balance,
          statementFor: item.statementFor,
        };
      });
      const finalData = filteredData.reverse();
      setUserLists(finalData);
      setTotalSize(userStatement?.totalCount);
      setPaginationIcon(false);
      return;
    }
  }
    if (userStatementMessage) {




      let balance = Number(userStatementMessage.message);
      const reversedData = [...userStatementMessage?.data].reverse();
      const filteredData = reversedData?.map((item, index) => {

        if(item.statementFor === "ACCOUNT_STATEMENT"){
          balance = 0
    
        }
        balance += Number(item.amount);
      
        return {
          key: `${index}`,
          createdAt: item.createdAt,
          remark: item.remark,
          amount: item.amount,
          newAmount: balance,
          statementFor: item.statementFor,
        };
      });
      const finalData = filteredData.reverse();
      setUserLists(finalData);
      setPaginationIcon(false)
      return;
    }
  }, [userStatement]);



  const getUserStatementFun = async () => {
    let reqData = {
      userId: userId,
      pageNo: currentPage,
      size: pageSize
    };
    dispatch(getUserStatement(reqData))
  }

  const filterData = () => {
    const data = userLists?.filter((item) => {
      if (activeTab === 1) return item.statementFor !== "All";
      if (activeTab === 2) return item.statementFor !== "ACCOUNT_STATEMENT";
      if (activeTab === 3) return item.statementFor === "ACCOUNT_STATEMENT";
      return true;
    });
    return setDisplayedData(data)
  };


  const RangePicker = DatePicker.RangePicker;



 
  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);

    setCurrentPage(1);

    if (tabIndex === 1) {
      let reqData = {
        userId: userId,
        toDate: moment().format("YYYY-MM-DD"),
        fromDate: moment().subtract(60, "days").format("YYYY-MM-DD"),
        pageNo: currentPage,
        size: pageSize,
        // statementFor: 'ACCOUNT_STATEMENT'
      };
      dispatch(getUserStatement(reqData))
    }
    if (tabIndex === 3) {
      let reqData = {
        userId: userId,
        // toDate: moment().format("YYYY-MM-DD"),
        // fromDate: moment().subtract(60, "days").format("YYYY-MM-DD"),
        // pageNo: currentPage,
        // size: pageSize,
        statementFor: 'ACCOUNT_STATEMENT'
      };
      dispatch(getUserStatement(reqData))
    }
    if (tabIndex === 2) {
      let reqData = {
        userId: userId,
        // toDate: moment().format("YYYY-MM-DD"),
        // fromDate: moment().subtract(60, "days").format("YYYY-MM-DD"),
        pageNo: currentPage,
        size: pageSize,
        statementFor: 'profitLoss'
      };
      dispatch(getUserStatement(reqData))
    }
    return setDisplayedData([]);
  };

  const onChange = (dates) => {
    setDates(dates);
  }
  const handlePageChange = (page) => {
    setCurrentPage(page);
  }

  const itemRender = (current, type, originalElement) => {
    if (type === "prev") {
      return <a className="gx-px-2 gx-fs-sm gx-py-2 gx-bg-white gx-border gx-border-info">Prev</a>;
    }
    if (type === "next") {
      return <a className="gx-px-2 gx-fs-sm gx-py-2 gx-border gx-bg-white gx-border-info">Next</a>;
    }
    return originalElement;
  };
  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      onHeaderCell: (column) => ({
        style: {
          background: "#D3D3D3",
          color: "black",
          fontWeight: "bold",
        },
      }),
      className: "gx-py-2",
      render: (text) => moment(text).utcOffset("+05:30").format("DD MMM YY"),
    },
    {
      title: "Description",
      dataIndex: "remark",
      onHeaderCell: (column) => ({
        style: {
          background: "#D3D3D3",
          color: "black",
          fontWeight: "bold",
        },
      }),
      key: "remark",
      className: " ",
      render: (text) => <div className="truncate gx-text-black gx-font-weight-bold gx-fs-sm">{text}</div>,
    },
    {
      title: "Prev Balance",
      dataIndex: "preBalance",
      onHeaderCell: (column) => ({
        style: {
          background: "#D3D3D3",
          color: "black",
          fontWeight: "bold",
        },
      }),
      align: "center",
      key: "preBalance",
      className: " ",
      render: (text) => <div className="truncate">{text ? text : "-"}</div>,
    },
    {
      title: "CREDIT",
      dataIndex: "amount",
      onHeaderCell: (column) => ({
        style: {
          background: "#D3D3D3",
          color: "black",
          fontWeight: "bold",
        },
      }),
      key: "credit",
      className: " ",
      render: (text) =>
        text > 0 ? (
          <div className="gx-text-green-0 gx-font-weight-bold gx-fs-md">
            {Number.parseFloat(Math.abs(text))
              .toFixed(2)
              .replace(/\.?0+$/, "")}
          </div>
        ) : (
          0
        ),
    },
    {
      title: "DEBIT",
      dataIndex: "amount",
      onHeaderCell: (column) => ({
        style: {
          background: "#D3D3D3",
          color: "black",
          fontWeight: "bold",
        },
      }),
      key: "debit",
      className: " ",
      render: (text) =>
        text < 0 ? (
          <div className="gx-text-red gx-font-weight-bold gx-fs-md">
            {Number.parseFloat(Math.abs(text))
              .toFixed(2)
              .replace(/\.?0+$/, "")}
          </div>
        ) : (
          0
        ),
    },
    {
      title: "Comm+",
      dataIndex: "Comm",
      onHeaderCell: (column) => ({
        style: {
          background: "#D3D3D3",
          color: "black",
          fontWeight: "bold",
        },
      }),
      key: "remark",
      align: "center",
      className: " ",
      render: (text) => <div className="truncate">{text ? text : "-"}</div>,
    },

    {
      title: "Balance",
      dataIndex: "newAmount",
      onHeaderCell: (column) => ({
        style: {
          background: "#D3D3D3",
          color: "black",
          fontWeight: "bold",
        },
      }),
      key: "balance",
      className: " ",
      render: (text) => (
        <div className="gx-text-black gx-font-weight-bold gx-fs-md">
          {Number.parseFloat(text)
            .toFixed(2)
            .replace(/\.?0+$/, "")}
        </div>
      ),
    },
  ];

  const onFilter = () => {
    if (!dates && !dates?.length) return null
    const reqData = {
      userId: userId,
      toDate: dates[1]?.format("YYYY-MM-DD"),
      fromDate: dates[0]?.format("YYYY-MM-DD"),
    };
    dispatch(getUserStatement(reqData));
  };

  const onClear = ()=>{
    setDates([])
  }

  const displayDataWithoutZero = displayedData?.filter(item => Number(item.amount) !== 0)
  
  

  return (
    <>
      {loading ? (
        <Loader props={loading} />
      ) : (
        <Row>
          <Col
            xs={24}
            md={4}
            xl={3}
            style={{paddingRight:"5px",paddingLeft:'0px'}}
            className=" gx-d-none gx-d-md-block gx-px-0 gx-mx-0"
          >
            <LeftSidebar />
          </Col>
          <Col style={{paddingInline:"6px"}} xs={24} md={20} xl={21}>
            <div
              style={{
                backgroundColor: "white",
                borderTop: "10px solid black",
                borderTopLeftRadius: "1rem",
                borderTopRightRadius: "1rem",
                height: "100%",
              }}
            >
              <Auxiliary>
                <Row justify={"center"}>
                  <Col xs={24} className="gx-col-full ">
                    <div className="gx-py-2 gx-px-2 gx-font-weight-semi-bold gx-text-black">
                      ACCOUNT STATEMENT
                    </div>
                    <Row className="gx-font-weight-semi-bold gx-text-black" justify={"start"}>
                      <Radio.Group
                        size="small"
                        value={activeTab}
                        className=" gx-font-weight-semi-bold gx-text-black gx-w-100 gx-px-4 gx-my-0   "
                      >
                        <Radio
                          className={` gx-font-weight-semi-bold gx-text-black gx-py- gx-my-0`}
                          onClick={() => handleTabClick(1)}
                          value={1}
                        >
                          All
                        </Radio>
                        <Radio
                          className={` gx-font-weight-semi-bold gx-text-black gx-py- gx-my-0`}
                          onClick={() => handleTabClick(2)}
                          value={2}
                        >
                          Profit and loss
                        </Radio>
                       
                        <Radio
                          className={` gx-font-weight-semi-bold gx-text-black gx-py- gx-my-0`}
                          onClick={() => handleTabClick(3)}
                          value={3}
                        >
                          Account statement
                        </Radio>
                      </Radio.Group>
                    </Row>
                    <Row
                      className="  gx-bg-flex  gx-align-items-center gx-justify-content-start gx-w-100 gx-py-1"
                     
                    >
                      <Col
                        className="gx-mt-3 gx-py-md-0  gx-px-4"
                        sm={8}
                        xs={24}
                      >
                        <RangePicker
                          className="gx-border-redius0 gx-ml-2 gx-mb-3 gx-w-100"
                          ranges={{
                            Today: [moment(), moment()],
                            Yesterday: [
                              moment().subtract(1, "days"),
                              moment().subtract(1, "days"),
                            ],
                            "This Week": [
                              moment().startOf("week"),
                              moment().endOf("week"),
                            ],
                            "Last Week": [
                              moment().subtract(1, "week").startOf("week"),
                              moment().subtract(1, "week").endOf("week"),
                            ],
                            "This Month": [
                              moment().startOf("month"),
                              moment().endOf("month"),
                            ],
                            "Last Month": [
                              moment().subtract(1, "month").startOf("month"),
                              moment().subtract(1, "month").endOf("month"),
                            ],
                          }}
                          onChange={onChange}
                          style={{ width: 300 }}
                          value={dates}
                        />
                      </Col>
                      <Col
                        className=" gx-bg-flex gx-align-items-center gx-pb-0 gx-mb-0 gx-justify-content-start gx-px-4 gx-h-100 "
                        sm={8}
                        xs={24}
                      >
                        <div
                          className="gx-bg-flex gx-align-items-center gx-h-100 "
                        >
                          <button
                            onClick={onFilter}
                            style={{
                             paddingInline:'15px 0',
                              backgroundColor: "#F7BE27",
                              color: "black",
                              display:"flex",
                              justifyContent:"space-between",
                              alignItems:"center",
                              fontSize: "16px",
                              fontWeight: "bold",
                              border:"0px",
                              gap:"10px"
                            }}
                          >
                          <span>  Filter</span>
                          <span
                              style={{ display: "flex", alignItems: "center",backgroundColor:"rgba(0,0,0,0.3)", padding: "9px", }}
                          >
                            <FaFilter />
                          </span>
                          </button>
                          <button
                            onClick={onClear}
                            style={{
                              paddingInline:'15px 0',
                              backgroundColor: "#D2322E",
                              color: "black",
                              display:"flex",
                              justifyContent:"space-between",
                              alignItems:"center",
                              fontSize: "16px",
                              fontWeight: "bold",
                              border:"0px",
                              gap:"10px"
                            }}
                          >
                           <span > Clear</span>
                          <span
                            style={{ display: "flex", alignItems: "center",backgroundColor:"rgba(0,0,0,0.3)", padding: "9px", }}
                          >
                            <RxCross2 />
                          </span>
                          </button>
                        </div>
                      </Col>
                    </Row>
                    <Table
                      className=""
                      dataSource={displayDataWithoutZero}
                      pagination={false}
                      bordered
                      size="small"
                      rowKey="createdAt"
                      columns={columns}
                      scroll={{ x: true }}
                    />
                   {activeTab !== 3 &&  <Row justify={"space-between"} align={"middle"} className="gx-px-4 gx-py-2  gx-w-100  gx-px-2">
                      <Col
                      xs={24} sm={12}
                        style={{ color: "#00008B" }}
                        className="gx-fs-lg gx-w-100 gx-font-weight-semi-bold "
                      >
                        Total Records : {totalSize}
                      </Col>
                      <Col className="gx-w-100 gx-d-block gx-d-sm-flex gx-justify-content-end"  xs={24} sm={12}> 
                      {paginationicon &&  (
                        <Pagination
                        className="gx-mt-3"
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalSize}
                        onChange={handlePageChange}
                        itemRender={itemRender}
                        showSizeChanger={false}
                        />
                      )}
                      </Col>
                    </Row>}
                   
                  </Col>
                </Row>
              </Auxiliary>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
}

export default Statement;