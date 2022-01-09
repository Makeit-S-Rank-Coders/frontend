import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

import { useCookies } from "react-cookie";

import styles from "./App.module.css";
import "react-toastify/dist/ReactToastify.css";

import { BG_LINE_IMG } from "./Utils/Constants/StaticData";

import Home from "./Containers/Home";
import NavBar from "./Components/NavBar/index";
import Preloader from "./Components/Preloader";
import { ToastContainer } from "react-toastify";

import { getUserData } from "./Services/user.service";
import notify from "./Utils/Helpers/notifyToast";
import Search from "./Containers/Search/index";
import Product from "./Containers/Product/Product";
import Cart from "./Containers/Cart/index";
import Profile from "./Containers/Profile/index";
import PopUp from "./Components/_General/PopUp/PopUp";
import AddAddress from "./Components/AddAddress/index";

import {
  UPDATE_USER_DATA,
  UPDATE_ADD_ADDRESS_POPUP_STATE,
} from "./Redux/ActionTypes";

const App = () => {
  const userData = useSelector((state) => state.userReducer.userData);
  const popupStates = useSelector((state) => state.popUpReducer);
  const dispatch = useDispatch();
  const [cookie] = useCookies(["token"]);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // dispatch({
    //   type: UPDATE_ADD_ADDRESS_POPUP_STATE,
    //   value: Math.random() > 0.5,
    // });
  }, []);

  useEffect(async () => {
    fetchUserData();
  }, [cookie]);

  useEffect(() => {
    console.log("userData", userData);
    if (userData) {
      setInitialized(true);
    }
  }, [userData]);

  useEffect(() => {
    console.log(cookie.token);
  }, [cookie.token]);

  const fetchUserData = async () => {
    // setCookie(
    //   "token",
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZDEyZjUwYmQ3ODY4NzBiODdmMmY4ZiIsImlhdCI6MTY0MTA5OTA4OH0.kY_HiMKWRfbAZoeH2MSwb8F7zdWzKrmDU79AZ_3BoJI",
    //   { sameSite: "strict" }
    // );

    if (cookie.token) {
      try {
        console.log("SHit");
        const localeUserData = await getUserData(cookie.token);
        localeUserData.accessToken = cookie.token;
        localeUserData.isSeller = false;
        localeUserData.isSeller = true;
        localeUserData.shopName = "London hills fashion";
        localeUserData.gstIn = "GST123456789";
        localeUserData.pickupAddress = {
          Address: "123, ABC Street, XYZ City, ABC State,",
          pincode: "123456",
        };

        dispatch({
          type: UPDATE_USER_DATA,
          data: localeUserData,
        });
      } catch (err) {
        notify("Internal Server Error", "error");
        dispatch({
          type: UPDATE_USER_DATA,
          data: null,
        });
        setInitialized(true);
      }
    } else {
      dispatch({
        type: UPDATE_USER_DATA,
        data: null,
      });
      setInitialized(true);
    }
  };

  const closeAddAddressPopup = () => {
    dispatch({
      type: UPDATE_ADD_ADDRESS_POPUP_STATE,
      value: false,
    });
  };

  return (
    <>
      <ToastContainer bodyClassName={styles.ToastBody} />
      {initialized ? (
        <div className={styles.Wrapper}>
          <NavBar isLoggedIn={userData ? true : false} />
          <img src={BG_LINE_IMG} alt="bg-line" className={styles.BgLine} />

          <Routes>
            {["/", "login", "signup"].map((path, index) => (
              <Route key={index} path={path} element={<Home />} />
            ))}
            <Route exact path="/search" element={<Search />} />
            <Route path="p/:id" element={<Product />} />
            <Route path="cart" element={<Cart />} />
            <Route path="profile/*" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          <PopUp
            isOpen={popupStates.addAddress}
            ContentComp={
              <AddAddress
                closePopupFunction={closeAddAddressPopup}
                refreshDataFunction={fetchUserData}
              />
            }
            closeFun={closeAddAddressPopup}
            withBorder={false}
          />
        </div>
      ) : (
        <>
          <Preloader />
        </>
      )}
    </>
  );
};

export default App;
