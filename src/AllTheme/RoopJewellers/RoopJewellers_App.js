import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./Components/Pages/Home/Index";
import Header from "./Components/Pages/Home/Header/Header";
import Cart from "./Components/Pages/Cart/CartMain";
import LoginOption from "./Components/Pages/Auth/LoginOption/LoginOption";
import ContinueWithEmail from "./Components/Pages/Auth/ContinueWithEmail/ContinueWithEmail";
import LoginWithEmail from "./Components/Pages/Auth/LoginWithEmail/LoginWithEmail";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import ProductList from "./Components/Pages/Product/ProductList/ProductList";
import ProductDetail from "./Components/Pages/Product/ProductDetail/ProductDetail";
import ContactUs from "./Components/Pages/FooterPages/contactUs/ContactUs";
import ServicePolicy from "./Components/Pages/FooterPages/servicePolicy/ServicePolicy";
import ExpertAdvice from "./Components/Pages/FooterPages/ExpertAdvice/ExpertAdvice";
import FunFact from "./Components/Pages/FooterPages/FunFact/FunFact";
import Register from "./Components/Pages/Auth/Registretion/Register";
import ContimueWithMobile from "./Components/Pages/Auth/ContimueWithMobile/ContimueWithMobile";
import LoginWithEmailCode from "./Components/Pages/Auth/LoginWithEmailCode/LoginWithEmailCode";
import LoginWithMobileCode from "./Components/Pages/Auth/LoginWithMobileCode/LoginWithMobileCode";
import AboutUs from "./Components/Pages/aboutUs/AboutUs";
import Wishlist from "./Components/Pages/Wishlist/Wishlist";
import PageNotFound from "./Components/Pages/404Page/PageNotFound";
import PrivateRoutes from "./PrivateRoutes";
import { Helmet } from "react-helmet";
import Delivery from "./Components/Pages/OrderFlow/DeliveryPage/Delivery";
import Payment from "./Components/Pages/OrderFlow/PaymentPage/Payment";
import Confirmation from "./Components/Pages/OrderFlow/ConfirmationPage/Confirmation";
import ForgotPass from "./Components/Pages/Auth/forgotPass/ForgotPass";
import Header2 from "./Components/Pages/Home/Header/Header2";
import Account from "./Components/Pages/Account/Account";
import Cookies from "js-cookie";
import { LoginWithEmailAPI } from "../../utils/API/Auth/LoginWithEmailAPI";
import Lookbook from "./Components/Pages/Home/LookBook/Lookbook";
import ScrollToTop from "../DaimondTine/Components/Pages/ScrollToTop ";
import StamScrollToTop from "./Components/Pages/BackToTop/StamScrollToTop";
import Footer from "./Components/Pages/Home/Footer/Footer";
import { roop_companyLogo, roop_loginState } from "./Components/Recoil/atom";

const RoopJewellers_App = () => {
  const islogin = useRecoilValue(roop_loginState);
  const [localData, setLocalData] = useState();
  const navigation = useNavigate();
  const setIsLoginState = useSetRecoilState(roop_loginState);
  const location = useLocation();
  const search = location?.search;
  const updatedSearch = search.replace("?LoginRedirect=", "");
  const redirectEmailUrl = `${decodeURIComponent(updatedSearch)}`;
  const [companyTitleLogo, setCompanyTitleLogo] = useRecoilState(roop_companyLogo);

  useEffect(() => {
    let data = sessionStorage.getItem("storeInit");
    let Logindata = JSON.parse(sessionStorage.getItem("loginUserDetail"));
    let logo = JSON?.parse(data);
    if (Logindata) {
      if (Logindata?.IsPLWOn == 1) {
        setCompanyTitleLogo(Logindata?.Private_label_logo);
      } else {
        setCompanyTitleLogo(logo?.companylogo);
      }
    } else {
      setCompanyTitleLogo(logo?.companylogo);
    }
  });

  useEffect(() => {
    const cookieValue = Cookies.get("userLoginCookie");
    if (cookieValue) {
      LoginWithEmailAPI("", "", "", "", cookieValue)
        .then((response) => {
          if (response.Data.rd[0].stat === 1) {
            Cookies.set("userLoginCookie", response?.Data?.rd[0]?.Token);
            setIsLoginState(true);
            sessionStorage.setItem("LoginUser", true);
            sessionStorage.setItem(
              "loginUserDetail",
              JSON.stringify(response.Data.rd[0])
            );
            if (redirectEmailUrl) {
              navigation(redirectEmailUrl);
            } else {
              navigation("/");
            }
          }
        })
        .catch((err) => console.log(err));
    }
    let localD = JSON.parse(sessionStorage.getItem("storeInit"));
    setLocalData(localD);
  }, []);


  if (islogin === true) {
    const restrictedPaths = [
      '/LoginOption',
      '/ContinueWithEmail',
      '/ContinueWithMobile',
      '/LoginWithEmailCode',
      '/LoginWithMobileCode',
      '/ForgotPass',
      '/LoginWithEmail',
      '/register'
    ];
    if (restrictedPaths?.some(path => location.pathname.startsWith(path))) {
      return navigation("/");
    }
  }

  return (
    <>
      <Helmet>
        <title>{localData?.BrowserTitle}</title>
      </Helmet>
      <div style={{minHeight: '700px'}}>
        {localData?.Headerno === 1 && <Header />}
        {localData?.Headerno === 2 && <Header2 />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/LoginOption"
            element={<LoginOption />}
          />
          <Route
            path="/ContinueWithEmail"
            element={<ContinueWithEmail />}
          />
          <Route
            path="/ContimueWithMobile"
            element={<ContimueWithMobile />}
          />
          <Route
            path="/LoginWithEmailCode"
            element={<LoginWithEmailCode />}
          />
          <Route
            path="/LoginWithMobileCode"
            element={<LoginWithMobileCode />}
          />
          <Route
            path="/ForgotPass"
            element={<ForgotPass />}
          />
          <Route
            path="/LoginWithEmail"
            element={<LoginWithEmail />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/servicePolicy" element={<ServicePolicy />} />
          <Route path="/ExpertAdvice" element={<ExpertAdvice />} />
          <Route path="/FunFact" element={<FunFact />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/" element={<PrivateRoutes isLoginStatus={islogin} />}>
            <Route path="/p/*" element={<ProductList />} />
            <Route path="/d/*" element={<ProductDetail />} />
            <Route path="/cartPage" element={<Cart />} />
            <Route path="/myWishList" element={<Wishlist />} />
            <Route path="/Delivery" element={<Delivery />} />
            <Route path="/Payment" element={<Payment />} />
            <Route path="/Confirmation" element={<Confirmation />} />
            <Route path="/account" element={<Account />} />
          </Route>
          <Route path="/Lookbook" element={<Lookbook />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      {
        (location.pathname != "payment") ||
          (location.pathname != "Delivery") ||
          (location.pathname != "Confirmation") ?
          <Footer />
          :
          ''
      }
      <StamScrollToTop />
    </>
  );
};

export default RoopJewellers_App;