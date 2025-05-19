
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getSocket, initSocket } from '../components/SocketConnection/SocketConnection';
import { userSignOut } from '../appRedux/actions';
import { useDispatch } from 'react-redux';
import { localstorage_id, socketDomain } from '../constants/global';
import { useParams } from 'react-router-dom';
import { domainSettingByDomain, getMatchList, userBalance } from '../appRedux/actions/User';


const BalanceContext = createContext();



export const BalanceProvider = ({ children }) => {
  let domain = socketDomain

  const [balance, setBalance] = useState({
    coins: JSON.parse(localStorage.getItem("client-wallet-balance")) || "",
    exposure: localStorage.getItem("client-wallet-exposure") || "0"
  });

  const dispatch = useDispatch()
  useEffect(() => {
    updateSocket();

    function updateSocket() {
      let userID = JSON.parse(localStorage.getItem(`user_id_${localstorage_id}`));
      let token_Id = userID?.token;
      let socket = getSocket();

      if (!socket || socket == null) {
        socket = initSocket(token_Id);
      }

      const loginData = {
        userId: userID?.data?.userId,
        token: token_Id,
        domain: domain
      };

      socket.emit(`login`, loginData);

      socket.on("userLoggedOut", (data) => {

        // if (data?.isLogout === true && data?.userId == userID?.data?.userId && data?.authenticateToken == token_Id) {
        //   localStorage.clear()
        //   window.location.href = '/signin'
        // }
      });

      socket.on("sportsListUpdate", (data) => {
        if (data?.isUpdate) {
          dispatch(getMatchList())
        }
      });

      socket.on("domainUpdate", (data) => {
        if (data?.sportListUpdate) {
          dispatch(getMatchList())
        } if (data?.isDomainSettingUpdate) {
          dispatch(domainSettingByDomain())

          
        } if (data?.isLogout) {
          localStorage.clear()
          window.location.href = '/signin'
        }

        if (data?.isRefresh) {
          dispatch(userBalance());
          window.location.href = '/signin'
        }

      });



      // socket.on("userLoggedIn", (data) => {

      //   console.warn('userLoggedIn');
      // });


      socket.on("coinUpdate", (data) => {
        localStorage.setItem("client-wallet-balance", JSON.stringify(data.coins));
        localStorage.setItem("client-wallet-exposure", JSON.stringify(data.exposure));
        setBalance({
          coins: data.coins,
          exposure: data.exposure,
        });
      });

      // socket.on("fetchCasinoBetList", (data) => {

      //   
      // });


    }
  }, []);

  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  return useContext(BalanceContext);
};
