import "./ReadyToShip.modul.scss";
import { ReadyToShipImage } from "../../../Constants/ReadyToShopImg";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Hoq_loginState } from "../../../Recoil/atom";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "../../../../../../utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import Cookies from "js-cookie";
import { useRecoilValue } from "recoil";
import Pako from "pako";
const ReadyToShip = () => {
  const [imageUrl, setImageUrl] = useState();
  const [bestSellerData, setBestSellerData] = useState([]);
  const [storeInit, setStoreInit] = useState({});
  const loginUserDetail = JSON.parse(localStorage.getItem("loginUserDetail"));
  const islogin = useRecoilValue(Hoq_loginState);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigation = useNavigate();

  useEffect(() => {
    const loginUserDetail = JSON.parse(localStorage?.getItem("loginUserDetail"));
    const storeInit = JSON.parse(localStorage?.getItem("storeInit"));
    const  IsB2BWebsite  = storeInit?.IsB2BWebsite;
    const visiterID = Cookies.get("visiterId");
    let finalID;
    if (IsB2BWebsite == 0) {
      finalID = islogin === false ? visiterID : loginUserDetail?.id || "0";
    } else {
      finalID = loginUserDetail?.id || "0";
    }

    let storeinit = JSON.parse(localStorage.getItem("storeInit"));
    setStoreInit(storeinit);

    let data = JSON.parse(localStorage.getItem("storeInit"));
    setImageUrl(data?.DesignImageFol);

   const BestSeller =async()=>{
    Get_Tren_BestS_NewAr_DesigSet_Album("GETBestSeller", finalID)
    .then((response) => {
      if (response?.Data?.rd) {
        setBestSellerData(response?.Data?.rd);
        console.log(response?.Data?.rd);
      }
    })
    .catch((err) => console.log(err));
   }

   BestSeller()
  }, []);

  const compressAndEncode = (inputString) => {
    try {
      const uint8Array = new TextEncoder().encode(inputString);
      const compressed = Pako.deflate(uint8Array, { to: "string" });
      return btoa(String.fromCharCode.apply(null, compressed));
    } catch (error) {
      console.error("Error compressing and encoding:", error);
      return null;
    }
  };

  const handleNavigation = (designNo, autoCode, titleLine) => {
    console.log("aaaaaaaaaaa", designNo, autoCode, titleLine);
    let obj = {
      a: autoCode,
      b: designNo,
      m: loginUserDetail?.MetalId,
      d: loginUserDetail?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid,
      f: {},
    };
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    navigation(
      `/d/${titleLine.replace(/\s+/g, `_`)}${
        titleLine?.length > 0 ? "_" : ""
      }${designNo}?p=${encodeObj}`
    );
  };

  const ImageUrl = (designNo, ext) => {
    return storeInit?.DesignImageFol + designNo + "_" + 1 + "." + ext;
  };
  const RollUpImageUrl2 = (designNo, ext, imagCount) => {
    if (imagCount > 1) {
      return storeInit?.DesignImageFol + designNo + "_" + 2 + "." + ext;
    }
    return;
  };

  return (
    <div className="hoq_main_TabSection">
      <div className="header">
        <h1>Best Seller</h1>
        <button
          onClick={() => navigation(`/p/BestSeller/?N=${btoa("BestSeller")}`)}
        >
          View All
        </button>
      </div>
      <div className="tab_card">
        {bestSellerData?.slice(0,4)?.map((data, i) => {
          return (
            <CARD
              imgurl={ImageUrl(data?.designno, data?.ImageExtension)}
              data={data}
              i={i}
              rollUpImage={RollUpImageUrl2(
                data?.designno,
                data?.ImageExtension,
                data?.ImageCount
              )}
              designNo={data?.designno}
              CurrCode={
                loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode
              }
              price={data?.UnitCostWithMarkUp}
              onClick={() =>
                handleNavigation(
                  data?.designno,
                  data?.autocode,
                  data?.TitleLine
                )
              }
              ImageCount={data?.ImageCount}
            />
          );
        })}
        <div className="TabCard_main t-mobile-only">
          <div className="box">
            <span onClick={()=>navigation(`/p/BestSeller/?N=${btoa("BestSeller")}`)}>
              View All 
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadyToShip;

const CARD = ({
  imgurl,
  i,
  data,
  rollUpImage,
  designNo,
  CurrCode,
  price,
  onClick,
  ImageCount,
}) => {
  console.log(ImageCount);
  const formatter = new Intl.NumberFormat("en-IN");
  return (
    <div
      className="TabCard_main"
      style={{ backgroundColor: "#F5F5F5" }}
      onClick={onClick}
    >
      {data?.new && <button className="new">New</button>}
      <div className="cardhover">
        <img
          style={{ mixBlendMode: "multiply" }}
          src={imgurl}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://www.defindia.org/wp-content/themes/dt-the7/images/noimage.jpg";
          }}
        />
        {ImageCount > 1 && (
          <div className="overlay_img" style={{ backgroundColor: "#F5F5F5" }}>
            <img src={rollUpImage} style={{ mixBlendMode: "multiply" }} />
          </div>
        )}
      </div>
      <div className="tab_hover_Details">
        <h3>{designNo}</h3>
        <small>
          {CurrCode}
          &nbsp;
          {formatter.format(price)}
        </small>
      </div>
    </div>
  );
};
