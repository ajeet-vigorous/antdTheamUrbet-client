import React, { useEffect, useState } from "react";
import {useDispatch} from "react-redux";
import {Avatar, Dropdown, Menu, Popover} from "antd";
import {userSignOut} from "appRedux/actions/Auth";
import { FaUnlock, FaUser } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { localstorage_id } from "../../constants/global";


const UserInfo = () => {

  const dispatch = useDispatch();
  const history = useHistory()
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal=()=>{
    setShowModal(false)
  }

 
  const menu = (
    <Menu className="gx-bg-grey gx-mt-4 gx-text-white gx-font-weight-medium">
      <Menu.Item onClick={()=>history.push('/main/changepassword')} key="1" style={{borderBottom:"2px solid white", gap:"5px"}}  className="gx-text-white gx-bg-flex gx-align-items-center gx-justify-content-between gx-font-weight-medium  ">
        <FaUnlock size={15} />
        <span className="gx-px-2">Change Password</span>
      </Menu.Item>

      <Menu.Item onClick={()=>history.push('/main/profile')} key="2" style={{borderBottom:"2px solid white", gap:"5px"}}  className="gx-text-white gx-bg-flex gx-align-items-center gx-justify-content-between gx-font-weight-medium  ">
        <FaUser size={15} />
        <span className="gx-px-2">Profile</span>
      </Menu.Item>
      <Menu.Item  onClick={() => dispatch(userSignOut())} key="3" style={{ gap:"5px"}}  className="gx-text-white gx-bg-flex gx-align-items-center gx-justify-content-between gx-font-weight-medium  ">
      <IoLogOut size={15} />
      <span className="gx-px-2">Logout</span>
      </Menu.Item>
    </Menu>
  );
  let userInfo = JSON.parse(localStorage.getItem(`user_id_${localstorage_id}`));
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
   isMobile ?  <Dropdown overlay={menu} trigger={['click']} className="user-dropdown gx-text-center">
   <div className="gx-fs-lg gx-font-weight-bold gx-bg-flex gx-justify-content-center gx-mt-1  gx-text-white gx-pointer">
  <span>{userInfo?.data?.name} ({userInfo?.data?.username})</span>
  {/* <span className="gx-pt-0.5"> */}
    <i className="icon icon-chevron-down" />
  {/* </span> */}
</div>
 </Dropdown> 
 :
  <Dropdown overlay={menu} trigger={['click']} className="user-dropdown gx-text-center">
  <div className="gx-fs-lg gx-font-weight-bold gx-bg-flex gx-justify-content-center  gx-text-white gx-pointer">
 <span>{userInfo?.data?.name} ({userInfo?.data?.username})</span>
 {/* <span className="gx-pt-0.5"> */}
   <i className="icon icon-chevron-down" />
 {/* </span> */}
</div>
</Dropdown>
    
  )

}

export default UserInfo;


