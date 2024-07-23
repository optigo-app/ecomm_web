import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Product.modul.scss";
import { Product } from "../../Constants/DynamicValue";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Zoom, Navigation, Pagination } from "swiper/modules";
import imageNotFound from "../../Assets/noImageFound.jpg";
import {
  FaChevronLeft,
  FaChevronRight,
  FaArrowLeftLong,
} from "react-icons/fa6";
import { IoIosPlayCircle, IoMdClose } from "react-icons/io";
import { CiDeliveryTruck } from "react-icons/ci";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Skeleton, Typography } from "@mui/material";
import { FaHeart } from "react-icons/fa";
import RelatedProduct from "./RelatedProduct/RelatedProduct";
import RecentlyViewd from "./RecentlyViewed/RecentlyViewd";
import { responsiveConfig } from "../../Config/ProductSliderConfig";
import { getSizeData } from "../../../../../utils/API/CartAPI/GetCategorySizeAPI";
import { StockItemApi } from "../../../../../utils/API/StockItemAPI/StockItemApi";
import { DesignSetListAPI } from "../../../../../utils/API/DesignSetListAPI/DesignSetListAPI";
import { SingleProdListAPI } from "../../../../../utils/API/SingleProdListAPI/SingleProdListAPI";
import Pako from "pako";
import Cookies from "js-cookie";
import { MetalTypeComboAPI } from "../../../../../utils/API/Combo/MetalTypeComboAPI";
import { MetalColorCombo } from "../../../../../utils/API/Combo/MetalColorCombo";
import { ColorStoneQualityColorComboAPI } from "../../../../../utils/API/Combo/ColorStoneQualityColorComboAPI";
import { DiamondQualityColorComboAPI } from "../../../../../utils/API/Combo/DiamondQualityColorComboAPI";
import { CartAndWishListAPI } from "../../../../../utils/API/CartAndWishList/CartAndWishListAPI";
import { RemoveCartAndWishAPI } from "../../../../../utils/API/RemoveCartandWishAPI/RemoveCartAndWishAPI";
import { Hoq_CartCount, Hoq_WishCount } from "../../Recoil/atom";
import { useSetRecoilState } from "recoil";

const ProductPage = () => {
  const [pdVideoArr, setPdVideoArr] = useState([]);
  const [storeInit, setStoreInit] = useState({});
  const [metalTypeCombo, setMetalTypeCombo] = useState([]);
  const [diaQcCombo, setDiaQcCombo] = useState([]);
  const [csQcCombo, setCsQcCombo] = useState([]);
  const [metalColorCombo, setMetalColorCombo] = useState([]);
  const [singleProd, setSingleProd] = useState({});
  const [singleProd1, setSingleProd1] = useState({});
  const [addToCartFlag, setAddToCartFlag] = useState(null);
  const [wishListFlag, setWishListFlag] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productId } = useParams();
  const naviagate = useNavigate();
  const location = useLocation();
  const previousPath = "Previous Page";
  const [ShowMangifier, setShowMangifier] = useState(false);
  const sliderRef = useRef(null);
  const [decodeUrl, setDecodeUrl] = useState({});
  const [loginInfo, setLoginInfo] = useState();
  const [SizeCombo, setSizeCombo] = useState();
  const [sizeData, setSizeData] = useState();
  const [isPriceloading, setisPriceLoading] = useState(false);
  const [isDataFound, setIsDataFound] = useState(false);
  const [metalWiseColorImg, setMetalWiseColorImg] = useState();
  const [stockItemArr, setStockItemArr] = useState([]);
  const [SimilarBrandArr, setSimilarBrandArr] = useState([]);
  const [diaList, setDiaList] = useState([]);
  const [csList, setCsList] = useState([]);
  const [designSetList, setDesignSetList] = useState();
  const [selectMtType, setSelectMtType] = useState();
  const [selectDiaQc, setSelectDiaQc] = useState();
  const [selectCsQc, setSelectCsQc] = useState();
  const [selectMtColor, setSelectMtColor] = useState();
  const [pdThumbImg, setPdThumbImg] = useState([]);
  const [isImageload, setIsImageLoad] = useState(true);
  const [selectedThumbImg, setSelectedThumbImg] = useState();
  const [thumbImgIndex, setThumbImgIndex] = useState();
  let cookie = Cookies.get("visiterId");
  const [PdImageArr, setPdImageArr] = useState([]);
  const setCartCountVal = useSetRecoilState(Hoq_CartCount);
  const setWishCountVal = useSetRecoilState(Hoq_WishCount);

  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    loop: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    beforeChange: (current, next) => setCurrentSlide(next),
    afterChange: (current) => setCurrentSlide(current),
    responsive: responsiveConfig,
  };

  const callAllApi = () => {
    let mtTypeLocal = JSON.parse(localStorage.getItem("metalTypeCombo"));
    let diaQcLocal = JSON.parse(
      localStorage.getItem("diamondQualityColorCombo")
    );
    let csQcLocal = JSON.parse(
      localStorage.getItem("ColorStoneQualityColorCombo")
    );
    let mtColorLocal = JSON.parse(localStorage.getItem("MetalColorCombo"));

    if (!mtTypeLocal || mtTypeLocal?.length === 0) {
      MetalTypeComboAPI(cookie)
        .then((response) => {
          if (response?.Data?.rd) {
            let data = response?.Data?.rd;
            localStorage.setItem("metalTypeCombo", JSON.stringify(data));
            setMetalTypeCombo(data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setMetalTypeCombo(mtTypeLocal);
    }

    if (!diaQcLocal || diaQcLocal?.length === 0) {
      DiamondQualityColorComboAPI()
        .then((response) => {
          if (response?.Data?.rd) {
            let data = response?.Data?.rd;
            localStorage.setItem(
              "diamondQualityColorCombo",
              JSON.stringify(data)
            );
            setDiaQcCombo(data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setDiaQcCombo(diaQcLocal);
    }

    if (!csQcLocal || csQcLocal?.length === 0) {
      ColorStoneQualityColorComboAPI()
        .then((response) => {
          if (response?.Data?.rd) {
            let data = response?.Data?.rd;
            localStorage.setItem(
              "ColorStoneQualityColorCombo",
              JSON.stringify(data)
            );
            setCsQcCombo(data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setCsQcCombo(csQcLocal);
    }

    if (!mtColorLocal || mtColorLocal?.length === 0) {
      MetalColorCombo(cookie)
        .then((response) => {
          if (response?.Data?.rd) {
            let data = response?.Data?.rd;
            localStorage.setItem("MetalColorCombo", JSON.stringify(data));
            setMetalColorCombo(data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setMetalColorCombo(mtColorLocal);
    }
  };

  console.log(isImageload);

  useEffect(() => {
    const logininfo = JSON.parse(localStorage.getItem("loginUserDetail"));
    setLoginInfo(logininfo);
  }, []);

  useEffect(() => {
    callAllApi();
  }, [storeInit]);

  useEffect(() => {
    let storeinit = JSON.parse(localStorage.getItem("storeInit"));
    if (storeinit) setStoreInit(storeinit);
  }, []);

  const decodeAndDecompress = (encodedString) => {
    try {
      const binaryString = atob(encodedString);

      const uint8Array = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }

      const decompressed = Pako.inflate(uint8Array, { to: "string" });

      const jsonObject = JSON.parse(decompressed);

      return jsonObject;
    } catch (error) {
      console.error("Error decoding and decompressing:", error);
      return null;
    }
  };

  const handleThumbnailClick = (index) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };
  const decodeEntities = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };
  function checkImageAvailability(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imageUrl;
    });
  }

  useEffect(() => {
    let navVal = location?.search.split("?p=")[1];
    let decodeobj = decodeAndDecompress(navVal);
    if (decodeobj) {
      setDecodeUrl(decodeobj);
    }

    let mtTypeLocal = JSON.parse(localStorage.getItem("metalTypeCombo"));

    let diaQcLocal = JSON.parse(
      localStorage.getItem("diamondQualityColorCombo")
    );

    let csQcLocal = JSON.parse(
      localStorage.getItem("ColorStoneQualityColorCombo")
    );

    let metalArr;
    let diaArr;
    let csArr;

    if (mtTypeLocal?.length) {
      metalArr =
        mtTypeLocal?.filter((ele) => ele?.Metalid == decodeobj?.m)[0]
          ?.Metalid ?? mtTypeLocal[0]?.Metalid;
    }

    if (diaQcLocal) {
      diaArr =
        diaQcLocal?.filter(
          (ele) =>
            ele?.QualityId == decodeobj?.d?.split(",")[0] &&
            ele?.ColorId == decodeobj?.d?.split(",")[1]
        )[0] ?? diaQcLocal[0];
    }

    if (csQcLocal) {
      csArr =
        csQcLocal?.filter(
          (ele) =>
            ele?.QualityId == decodeobj?.c?.split(",")[0] &&
            ele?.ColorId == decodeobj?.c?.split(",")[1]
        )[0] ?? csQcLocal[0];
    }

    const FetchProductData = async () => {
      let obj = {
        mt: metalArr,
        diaQc: `${diaArr?.QualityId},${diaArr?.ColorId}`,
        csQc: `${csArr?.QualityId},${csArr?.ColorId}`,
      };

      console.log("objjj", obj);

      setisPriceLoading(true);

      await SingleProdListAPI(decodeobj, sizeData, obj, cookie)
        .then(async (res) => {
          if (res) {
            setSingleProd(res?.pdList[0]);
            console.log("prod", res);

            if (res?.pdList?.length > 0) {
              setisPriceLoading(false);
            }

            if (!res?.pdList[0]) {
              console.log("singleprod", res?.pdList[0]);
              setisPriceLoading(false);
              setIsDataFound(true);
            }

            setDiaList(res?.pdResp?.rd3);
            setCsList(res?.pdResp?.rd4);

            let prod = res?.pdList[0];

            let initialsize =
              prod && prod.DefaultSize !== ""
                ? prod?.DefaultSize
                : SizeCombo?.rd?.find((size) => size.IsDefaultSize === 1)
                    ?.sizename === undefined
                ? SizeCombo?.rd[0]?.sizename
                : SizeCombo?.rd?.find((size) => size.IsDefaultSize === 1)
                    ?.sizename;

            setSizeData(initialsize);

            // await SingleFullProdPriceAPI(decodeobj).then((res) => {
            //   setSingleProdPrice(res);
            //   console.log("singlePrice", res);
            // });
          }
          return res;
        })
        .then(async (resp) => {
          if (resp) {
            await getSizeData(resp?.pdList[0], cookie)
              .then((res) => {
                console.log("Sizeres", res);
                setSizeCombo(res?.Data);
              })
              .catch((err) => console.log("SizeErr", err));

            await StockItemApi(resp?.pdList[0]?.autocode, "stockitem", cookie)
              .then((res) => {
                setStockItemArr(res?.Data?.rd);
              })
              .catch((err) => console.log("stockItemErr", err));

            await StockItemApi(
              resp?.pdList[0]?.autocode,
              "similarbrand",
              obj,
              cookie
            )
              .then((res) => {
                setSimilarBrandArr(res?.Data?.rd);
              })
              .catch((err) => console.log("similarbrandErr", err));

            await DesignSetListAPI(obj, resp?.pdList[0]?.designno, cookie)
              .then((res) => {
                console.log("designsetList", res?.Data?.rd[0]);
                setDesignSetList(res?.Data?.rd);
              })
              .catch((err) => console.log("designsetErr", err));
          }
        })
        .catch((err) => console.log("err", err));
    };

    FetchProductData();

    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, [location?.key]);

  const handleCart = (cartflag) => {
    let metal =
      metalTypeCombo?.filter((ele) => ele?.metaltype == selectMtType)[0] ??
      metalTypeCombo[0];
    let dia =
      diaQcCombo?.filter(
        (ele) =>
          ele?.Quality == selectDiaQc.split(",")[0] &&
          ele?.color == selectDiaQc.split(",")[1]
      )[0] ?? diaQcCombo[0];
    let cs =
      csQcCombo?.filter(
        (ele) =>
          ele?.Quality == selectCsQc.split(",")[0] &&
          ele?.color == selectCsQc.split(",")[1]
      )[0] ?? csQcCombo[0];
    let mcArr = metalColorCombo?.filter(
      (ele) =>
        ele?.id == (singleProd1?.MetalColorid ?? singleProd?.MetalColorid)
    )[0];

    let prodObj = {
      autocode: singleProd?.autocode,
      Metalid: metal?.Metalid,
      MetalColorId: mcArr?.id ?? singleProd?.MetalColorid,
      DiaQCid: `${dia?.QualityId},${dia?.ColorId}`,
      CsQCid: `${cs?.QualityId},${cs?.ColorId}`,
      Size: sizeData ?? singleProd?.DefaultSize,
      Unitcost: singleProd1?.UnitCost ?? singleProd?.UnitCost,
      markup: singleProd1?.DesignMarkUp ?? singleProd?.DesignMarkUp,
      UnitCostWithmarkup:
        singleProd1?.UnitCostWithMarkUp ?? singleProd?.UnitCostWithMarkUp,
      Remark: "",
    };

    if (cartflag) {
      CartAndWishListAPI("Cart", prodObj, cookie)
        .then((res) => {
          let cartC = res?.Data?.rd[0]?.Cartlistcount;
          let wishC = res?.Data?.rd[0]?.Wishlistcount;
          setWishCountVal(wishC);
          setCartCountVal(cartC);
        })
        .catch((err) => console.log("err", err))
        .finally(() => {
          setAddToCartFlag(cartflag);
        });
    } else {
      RemoveCartAndWishAPI("Cart", singleProd?.autocode, cookie)
        .then((res) => {
          let cartC = res?.Data?.rd[0]?.Cartlistcount;
          let wishC = res?.Data?.rd[0]?.Wishlistcount;
          setWishCountVal(wishC);
          setCartCountVal(cartC);
        })
        .catch((err) => console.log("err", err))
        .finally(() => {
          setAddToCartFlag(cartflag);
        });
    }
  };

  const handleWishList = (wishFlag) => {
    setWishListFlag(wishFlag);

    let metal =
      metalTypeCombo?.filter((ele) => ele?.metaltype == selectMtType)[0] ??
      metalTypeCombo[0];
    let dia =
      diaQcCombo?.filter(
        (ele) =>
          ele?.Quality == selectDiaQc.split(",")[0] &&
          ele?.color == selectDiaQc.split(",")[1]
      )[0] ?? diaQcCombo[0];
    let cs =
      csQcCombo?.filter(
        (ele) =>
          ele?.Quality == selectCsQc.split(",")[0] &&
          ele?.color == selectCsQc.split(",")[1]
      )[0] ?? csQcCombo[0];
    let mcArr = metalColorCombo?.filter(
      (ele) =>
        ele?.id == (singleProd1?.MetalColorid ?? singleProd?.MetalColorid)
    )[0];

    let prodObj = {
      autocode: singleProd?.autocode,
      Metalid: metal?.Metalid,
      MetalColorId: mcArr?.id ?? singleProd?.MetalColorid,
      DiaQCid: `${dia?.QualityId},${dia?.ColorId}`,
      CsQCid: `${cs?.QualityId},${cs?.ColorId}`,
      Size: sizeData ?? singleProd?.DefaultSize,
      Unitcost: singleProd1?.UnitCost ?? singleProd?.UnitCost,
      markup: singleProd1?.DesignMarkUp ?? singleProd?.DesignMarkUp,
      UnitCostWithmarkup:
        singleProd1?.UnitCostWithMarkUp ?? singleProd?.UnitCostWithMarkUp,
      Remark: "",
    };

    if (wishListFlag == true) {
      CartAndWishListAPI("Wish", prodObj, cookie)
        .then((res) => {
          let cartC = res?.Data?.rd[0]?.Cartlistcount;
          let wishC = res?.Data?.rd[0]?.Wishlistcount;
          setWishCountVal(wishC);
          setCartCountVal(cartC);
        })
        .catch((err) => console.log("err", err))
        .finally(() => {
          setWishListFlag(wishFlag);
        });
    } else {
      RemoveCartAndWishAPI("Wish", singleProd?.autocode, cookie)
        .then((res) => {
          let cartC = res?.Data?.rd[0]?.Cartlistcount;
          let wishC = res?.Data?.rd[0]?.Wishlistcount;
          setWishCountVal(wishC);
          setCartCountVal(cartC);
        })
        .catch((err) => console.log("err", err))
        .finally(() => {
          setWishListFlag(wishFlag);
        });
    }
  };

  useEffect(() => {
    let navVal = location?.search.split("?p=")[1];
    let decodeobj = decodeAndDecompress(navVal);

    let mtTypeLocal = JSON.parse(localStorage.getItem("metalTypeCombo"));

    let diaQcLocal = JSON.parse(
      localStorage.getItem("diamondQualityColorCombo")
    );

    let csQcLocal = JSON.parse(
      localStorage.getItem("ColorStoneQualityColorCombo")
    );

    setTimeout(() => {
      if (decodeUrl) {
        let metalArr;
        let diaArr;
        let csArr;

        if (mtTypeLocal?.length) {
          metalArr =
            mtTypeLocal?.filter((ele) => ele?.Metalid == decodeobj?.m)[0] ??
            mtTypeLocal[0];
        }

        if (diaQcLocal?.length) {
          diaArr =
            diaQcLocal?.filter(
              (ele) =>
                ele?.QualityId == decodeobj?.d?.split(",")[0] &&
                ele?.ColorId == decodeobj?.d?.split(",")[1]
            )[0] ?? diaQcLocal[0];
        }

        if (csQcLocal?.length) {
          csArr =
            csQcLocal?.filter(
              (ele) =>
                ele?.QualityId == decodeobj?.c?.split(",")[0] &&
                ele?.ColorId == decodeobj?.c?.split(",")[1]
            )[0] ?? csQcLocal[0];
        }

        setSelectMtType(metalArr?.metaltype);

        setSelectDiaQc(`${diaArr?.Quality},${diaArr?.color}`);

        setSelectCsQc(`${csArr?.Quality},${csArr?.color}`);

        // let InitialSize = (singleProd && singleProd.DefaultSize !== "")
        //                       ? singleProd?.DefaultSize
        //                       : (SizeCombo?.rd?.find((size) => size.IsDefaultSize === 1)?.sizename === undefined ? SizeCombo?.rd[0]?.sizename : SizeCombo?.rd?.find((size) => size.IsDefaultSize === 1)?.sizename)
        // if(InitialSize){
        //   setSizeData(InitialSize)
        // }

        // if(metalArr || diaArr || csArr || InitialSize){
        //   setCustomObj({metalArr, diaArr, csArr ,InitialSize})
        // }

        console.log("default", { metalArr, diaArr, csArr }, decodeobj);
      }
    }, 500);
  }, [singleProd]);

  useEffect(() => {
    let mtColorLocal = JSON.parse(localStorage.getItem("MetalColorCombo"));
    let mcArr;

    if (mtColorLocal?.length) {
      mcArr = mtColorLocal?.filter(
        (ele) =>
          ele?.id == (singleProd?.MetalColorid ?? singleProd1?.MetalColorid)
      )[0];
    }

    setSelectMtColor(mcArr?.metalcolorname);
  }, [singleProd, singleProd1]);

  const ProdCardImageFunc = () => {
    let finalprodListimg;
    let pdImgList = [];
    let pdvideoList = [];

    let pd = singleProd;

    if (pd?.ImageCount > 0) {
      for (let i = 1; i <= pd?.ImageCount; i++) {
        let imgString =
          storeInit?.DesignImageFol +
          pd?.designno +
          "_" +
          i +
          "." +
          pd?.ImageExtension;
        pdImgList.push(imgString);
      }
    } else {
      finalprodListimg = imageNotFound;
    }

    if (pd?.VideoCount > 0) {
      for (let i = 1; i <= pd?.VideoCount; i++) {
        let videoString =
          (storeInit?.DesignImageFol).slice(0, -13) +
          "video/" +
          pd?.designno +
          "_" +
          i +
          "." +
          pd?.VideoExtension;
        pdvideoList.push(videoString);
      }
    }

    if (pdImgList?.length > 0) {
      finalprodListimg = pdImgList[0];
      setSelectedThumbImg({ link: pdImgList[0], type: "img" });
      setPdThumbImg(pdImgList);
      setThumbImgIndex(0);
      const imageMap = pdImgList?.map((val, i) => {
        return { src: val, type: "img" };
      });
      setPdImageArr(imageMap);
    }

    if (pdvideoList?.length > 0) {
      setPdVideoArr(pdvideoList);
      const VideoMap = pdvideoList?.map((val, i) => {
        return { src: val, type: "video" };
      });
      setPdImageArr((prev) => [...prev, ...VideoMap]);
    }
    return finalprodListimg;
  };

  useEffect(() => {
    ProdCardImageFunc();
  }, [singleProd]);

  const handleCustomChange = async (e, type) => {
    let metalArr;
    let diaArr;
    let csArr;
    let size;

    let mtTypeLocal = JSON.parse(localStorage.getItem("metalTypeCombo"));

    let diaQcLocal = JSON.parse(
      localStorage.getItem("diamondQualityColorCombo")
    );

    let csQcLocal = JSON.parse(
      localStorage.getItem("ColorStoneQualityColorCombo")
    );

    if (type === "mt") {
      metalArr = mtTypeLocal?.filter(
        (ele) => ele?.metaltype == e.target.value
      )[0]?.Metalid;
      setSelectMtType(e.target.value);
    }
    if (type === "dia") {
      setSelectDiaQc(e.target.value);
      diaArr = diaQcLocal?.filter(
        (ele) =>
          ele?.Quality == e.target.value?.split(",")[0] &&
          ele?.color == e.target.value?.split(",")[1]
      )[0];
    }
    if (type === "cs") {
      setSelectCsQc(e.target.value);
      csArr = csQcLocal?.filter(
        (ele) =>
          ele?.Quality == e.target.value?.split(",")[0] &&
          ele?.color == e.target.value?.split(",")[1]
      )[0];
    }
    if (type === "sz") {
      setSizeData(e.target.value);
      size = e.target.value;
    }

    if (metalArr == undefined) {
      metalArr = mtTypeLocal?.filter((ele) => ele?.metaltype == selectMtType)[0]
        ?.Metalid;
    }

    if (diaArr == undefined) {
      diaArr = diaQcLocal?.filter(
        (ele) =>
          ele?.Quality == selectDiaQc?.split(",")[0] &&
          ele?.color == selectDiaQc?.split(",")[1]
      )[0];
    }

    if (csArr == undefined) {
      csArr = csQcLocal?.filter(
        (ele) =>
          ele?.Quality == selectCsQc?.split(",")[0] &&
          ele?.color == selectCsQc?.split(",")[1]
      )[0];
    }

    let obj = {
      mt: metalArr,
      diaQc: `${diaArr?.QualityId},${diaArr?.ColorId}`,
      csQc: `${csArr?.QualityId},${csArr?.ColorId}`,
    };

    let prod = {
      a: singleProd?.autocode,
      b: singleProd?.designno,
    };

    console.log("eeee", obj);
    setisPriceLoading(true);
    await SingleProdListAPI(prod, size, obj, cookie)
      .then((res) => {
        setSingleProd1(res?.pdList[0]);

        if (res?.pdList?.length > 0) {
          setisPriceLoading(false);
        }
        setDiaList(res?.pdResp?.rd3);
        setCsList(res?.pdResp?.rd4);
        console.log("res123", res);
      })
      .catch((err) => {
        console.log("customProdDetailErr", err);
      });
  };
  const handleMetalWiseColorImg = async (e) => {
    let mtColorLocal = JSON.parse(localStorage.getItem("MetalColorCombo"));
    let mcArr;

    if (mtColorLocal?.length) {
      mcArr = mtColorLocal?.filter(
        (ele) => ele?.metalcolorname == e.target.value
      )[0];
    }

    setSelectMtColor(e.target.value);

    let imgLink =
      storeInit?.DesignImageFol +
      (singleProd ?? singleProd1)?.designno +
      "_" +
      (thumbImgIndex + 1) +
      "_" +
      mcArr?.colorcode +
      "." +
      (singleProd ?? singleProd1)?.ImageExtension;

    setMetalWiseColorImg(imgLink);

    let isImg = await checkImageAvailability(imgLink);

    if (isImg) {
      setMetalWiseColorImg(imgLink);
    } else {
      setMetalWiseColorImg();
    }

    let pd = singleProd;
    let pdImgListCol = [];
    let pdImgList = [];

    if (singleProd?.ColorImageCount > 0) {
      for (let i = 1; i <= singleProd?.ImageCount; i++) {
        let imgString =
          storeInit?.DesignImageFol +
          singleProd?.designno +
          "_" +
          i +
          "_" +
          mcArr?.colorcode +
          "." +
          singleProd?.ImageExtension;
        pdImgListCol.push(imgString);
      }
    }

    if (singleProd?.ImageCount > 0) {
      for (let i = 1; i <= singleProd?.ImageCount; i++) {
        let imgString =
          storeInit?.DesignImageFol +
          singleProd?.designno +
          "_" +
          i +
          "." +
          singleProd?.ImageExtension;
        pdImgList.push(imgString);
      }
    }

    let isImgCol;

    if (pdImgListCol?.length > 0) {
      isImgCol = await checkImageAvailability(pdImgListCol[0]);
    }

    if (pdImgListCol?.length > 0 && isImgCol == true) {
      setPdThumbImg(pdImgListCol);
      setSelectedThumbImg({ link: pdImgListCol[thumbImgIndex], type: "img" });
      setThumbImgIndex(thumbImgIndex);
    } else {
      if (pdImgList?.length > 0) {
        setSelectedThumbImg({ link: pdImgList[thumbImgIndex], type: "img" });
        setPdThumbImg(pdImgList);
        setThumbImgIndex(thumbImgIndex);
      }
    }

    console.log("pdImgList", pdImgList, pdImgListCol);
  };

  return (
    <div className="hoq_main_Product">
      {/* {ShowMangifier && (
        <MagnifierSlider
          product={products}
          close={() => setShowMangifier(!ShowMangifier)}
        />
      )} */}
      <main>
        <div className="images_slider">
          <div className="slider">
            {PdImageArr?.length > 0 ? (
              PdImageArr?.map((val, i) => {
                return (
                  <div
                    key={i}
                    className={`box ${i === currentSlide ? "active" : ""}`}
                    onClick={() => handleThumbnailClick(i)}
                  >
                    {val?.type === "img" ? (
                      <img src={val?.src} alt="" />
                    ) : (
                      <div
                        className="video_box"
                        style={{ position: "relative" }}
                      >
                        <video src={val?.src} className="hoq_prod_thumb_img" />
                        <IoIosPlayCircle className="play_io_icon" />
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div className="box">
                    <Skeleton width={100} height={160} />
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="main_image">
            {PdImageArr.length > 0 ? (
              <Slider {...settings} ref={sliderRef}>
                {PdImageArr?.map((val, i) => {
                  return (
                    <div key={i} className="slider_card">
                      <div className="image">
                        {val?.type == "img" ? (
                          <img
                            src={val?.src ?? imageNotFound}
                            alt={""}
                            onLoad={() => setIsImageLoad(false)}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://www.defindia.org/wp-content/themes/dt-the7/images/noimage.jpg";
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              maxWidth: "100%",
                              width: "100%",
                            }}
                          >
                            <video
                              src={val?.src}
                              loop={true}
                              autoPlay={true}
                              style={{
                                width: "100%",
                                height: "100%",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </Slider>
            ) : (
              <div
                className="no-image"
                style={{
                  width: "100%",
                  height: "80vh",
                  // backgroundColor : "red",
                }}
              >
                <Skeleton
                  animation="wave"
                  width={"100%"}
                  sx={{
                    height: "170%",
                    marginTop: "-15rem",
                    bgcolor: "#f7f7f7",
                  }}
                />
                <img
                  src=""
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://www.defindia.org/wp-content/themes/dt-the7/images/noimage.jpg";
                  }}
                  alt=""
                />
              </div>
            )}
          </div>
        </div>
        <div className="product_details">
          <div className="product_info">
            {singleProd?.TitleLine && <h1> {singleProd?.TitleLine}</h1>}
            <span
              className="hoq_single_prod_designno"
              style={{ marginTop: "5px", fontSize: "1.1rem" }}
            >
              {singleProd?.designno}
            </span>
            <div className="pricecharge">
              {
                <div className="hoq_price_portion">
                  {isPriceloading ? (
                    ""
                  ) : (
                    <span
                      className="hoq_currencyFont"
                      dangerouslySetInnerHTML={{
                        __html: decodeEntities(storeInit?.Currencysymbol),
                      }}
                    />
                  )}
                  {isPriceloading ? (
                    <Skeleton variant="rounded" width={140} height={30} />
                  ) : (
                    singleProd1?.UnitCostWithMarkUp ??
                    singleProd?.UnitCostWithMarkUp
                  )}
                </div>
              }
            </div>
          </div>
          <div className="product_main_Details">
            {storeInit?.IsProductWebCustomization == 1 &&
              metalTypeCombo?.length > 0 && (
                <div className="hoq_single_prod_customize_main">
                  <div className="hoq_single_prod_customize">
                    <label className="menuItemTimeEleveDeatil">
                      METAL TYPE:
                    </label>
                    {singleProd?.IsMrpBase == 1 ? (
                      <span className="hoq_menuitemSelectoreMain">
                        {
                          metalTypeCombo?.filter(
                            (ele) => ele?.Metalid == singleProd?.MetalPurityid
                          )[0]?.metaltype
                        }
                      </span>
                    ) : (
                      <select
                        className="hoq_menuitemSelectoreMain"
                        value={selectMtType}
                        onChange={(e) => handleCustomChange(e, "mt")}
                        // onChange={(e) => setSelectMtType(e.target.value)}
                      >
                        {metalTypeCombo.map((ele) => (
                          <option key={ele?.Metalid} value={ele?.metaltype}>
                            {ele?.metaltype}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  {metalColorCombo?.length > 0 && (
                    <div className="hoq_single_prod_customize">
                      <label
                        className="menuItemTimeEleveDeatil"
                        htmlFor="metal_c_hoq"
                      >
                        METAL COLOR:
                      </label>
                      {singleProd?.IsMrpBase == 1 ? (
                        <span className="hoq_menuitemSelectoreMain">
                          {
                            metalColorCombo?.filter(
                              (ele) => ele?.id == singleProd?.MetalColorid
                            )[0]?.metalcolorname
                          }
                        </span>
                      ) : (
                        <select
                          className="hoq_menuitemSelectoreMain"
                          id="metal_c_hoq"
                          value={selectMtColor}
                          onChange={(e) => handleMetalWiseColorImg(e)}
                        >
                          {metalColorCombo?.map((ele) => (
                            <option key={ele?.id} value={ele?.metalcolorname}>
                              {ele?.metalcolorname}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                  {storeInit?.IsDiamondCustomization === 1 &&
                    diaQcCombo?.length > 0 && (
                      <div className="hoq_single_prod_customize">
                        <label className="menuItemTimeEleveDeatil">
                          DIAMOND :
                        </label>
                        {
                          <select
                            className="hoq_menuitemSelectoreMain"
                            value={selectDiaQc}
                            // onChange={(e) => setSelectDiaQc(e.target.value)}
                            onChange={(e) => handleCustomChange(e, "dia")}
                          >
                            {diaQcCombo.map((ele) => (
                              <option
                                key={ele?.QualityId}
                                value={`${ele?.Quality},${ele?.color}`}
                              >{`${ele?.Quality},${ele?.color}`}</option>
                            ))}
                          </select>
                        }
                      </div>
                    )}
                  {storeInit?.IsCsCustomization === 1 &&
                    selectCsQc?.length > 0 && (
                      <div className="hoq_single_prod_customize">
                        <label className="menuItemTimeEleveDeatil">
                          COLOR STONE :
                        </label>
                        <select
                          className="hoq_menuitemSelectoreMain"
                          value={selectCsQc}
                          // onChange={(e) => setSelectCsQc(e.target.value)}
                          onChange={(e) => handleCustomChange(e, "cs")}
                        >
                          {csQcCombo.map((ele) => (
                            <option
                              key={ele?.QualityId}
                              value={`${ele?.Quality},${ele?.color}`}
                            >{`${ele?.Quality},${ele?.color}`}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  {/* {console.log("sizeData",SizeCombo?.find((size) => size.IsDefaultSize === 1)?.sizename)} */}
                  {SizeCombo?.rd?.length > 0 && (
                    <div className="hoq_single_prod_customize">
                      <label className="menuItemTimeEleveDeatil">SIZE:</label>
                      {singleProd?.IsMrpBase == 1 ? (
                        <span className="hoq_menuitemSelectoreMain">
                          {singleProd?.DefaultSize}
                        </span>
                      ) : (
                        <select
                          className="hoq_menuitemSelectoreMain"
                          value={sizeData}
                          // onChange={(e) => {
                          //   setSizeData(e.target.value);
                          // }}
                          onChange={(e) => handleCustomChange(e, "sz")}
                        >
                          {SizeCombo?.rd?.map((ele) => (
                            <option
                              value={ele?.sizename}
                              // selected={
                              //   singleProd && singleProd.DefaultSize === ele.sizename
                              // }
                              key={ele?.id}
                            >
                              {ele?.sizename}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </div>
              )}

            <Accordion className="accordian">
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    style={{ fontSize: "1.2rem", color: "black" }}
                  />
                }
                aria-controls="panel1-content"
                id="panel1-header"
                className="summary"
                sx={{
                  padding: "0 5px",
                }}
              >
                <Typography
                  className="title"
                  style={{
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    marginLeft: "3.4px",
                  }}
                >
                  MATERIAL DETAILS
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div
                  className="smr_prod_summury_info"
                  style={{ border: "none" }}
                >
                  <div className="smr_prod_summury_info_inner">
                    <span className="smr_single_prod_designno">
                      {singleProd?.designno}
                    </span>
                    <span className="smr_prod_short_key">
                      Metal Purity :{" "}
                      <span className="smr_prod_short_val">{selectMtType}</span>
                    </span>
                    <span className="smr_prod_short_key">
                      Metal Color :{" "}
                      <span className="smr_prod_short_val">
                        {selectMtColor}
                      </span>
                    </span>
                    <span className="smr_prod_short_key">
                      Diamond Quality Color :{" "}
                      <span className="smr_prod_short_val">
                        {`${selectDiaQc}`}
                      </span>
                    </span>
                    <span className="smr_prod_short_key">
                      Net Wt :{" "}
                      <span className="smr_prod_short_val">
                        {singleProd1?.Nwt ?? singleProd?.Nwt}
                      </span>
                    </span>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion className="accordian">
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    style={{ fontSize: "1.2rem", color: "black" }}
                  />
                }
                aria-controls="panel1-content"
                id="panel1-header"
                className="summary"
                sx={{
                  padding: "0 5px",
                }}
              >
                <Typography
                  className="title"
                  style={{
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    marginLeft: "3.4px",
                  }}
                >
                  PRODUCT DETAILS
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="details_d_C"> 
                  <div className="hoq_material_details_portion">
                    {/* {diaList?.length > 0 && (
                      <p className="hoq_details_title"> Product Details</p>
                    )} */}
                    {diaList?.length > 0 && (
                      <div className="hoq_material_details_portion_inner">
                        <ul style={{ margin: "0px 0px 3px 0px" }}>
                          <li
                            style={{ fontWeight: 600 }}
                          >{`Diamond Detail(${diaList?.reduce(
                            (accumulator, data) => accumulator + data.M,
                            0
                          )}/${diaList
                            ?.reduce(
                              (accumulator, data) => accumulator + data?.N,
                              0
                            )
                            .toFixed(2)}ct)`}</li>
                        </ul>
                        <ul className="hoq_mt_detail_title_ul">
                          <li className="hoq_proDeatilList">Shape</li>
                          <li className="hoq_proDeatilList">Clarity</li>
                          <li className="hoq_proDeatilList">Color</li>
                          <li className="hoq_proDeatilList">
                            Pcs&nbsp;&nbsp;Wt
                          </li>
                        </ul>
                        {diaList?.map((data) => (
                          <ul className="hoq_mt_detail_title_ul">
                            <li className="hoq_proDeatilList1">{data?.F}</li>
                            <li className="hoq_proDeatilList1">{data?.H}</li>
                            <li className="hoq_proDeatilList1">{data?.J}</li>
                            <li className="hoq_proDeatilList1">
                              {data.M}&nbsp;&nbsp;{data?.N}
                            </li>
                          </ul>
                        ))}
                      </div>
                    )}

                    {csList?.length > 0 && (
                      <div className="hoq_material_details_portion_inner">
                        <ul style={{ margin: "10px 0px 3px 0px" }}>
                          <li
                            style={{ fontWeight: 600 }}
                          >{`ColorStone Detail(${csList?.reduce(
                            (accumulator, data) => accumulator + data.M,
                            0
                          )}/${csList
                            ?.reduce(
                              (accumulator, data) => accumulator + data?.N,
                              0
                            )
                            .toFixed(2)}ct)`}</li>
                        </ul>
                        <ul className="hoq_mt_detail_title_ul">
                          <li className="hoq_proDeatilList">Shape</li>
                          <li className="hoq_proDeatilList">Clarity</li>
                          <li className="hoq_proDeatilList">Color</li>
                          <li className="hoq_proDeatilList">
                            Pcs&nbsp;&nbsp;Wt
                          </li>
                        </ul>
                        {csList?.map((data) => (
                          <ul className="hoq_mt_detail_title_ul">
                            <li className="hoq_proDeatilList1">{data?.F}</li>
                            <li className="hoq_proDeatilList1">{data?.H}</li>
                            <li className="hoq_proDeatilList1">{data?.J}</li>
                            <li className="hoq_proDeatilList1">
                              {data.M}&nbsp;&nbsp;{data?.N}
                            </li>
                          </ul>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            {storeInit?.IsPriceBreakUp == 1 && (
              <Accordion className="accordian">
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      style={{ fontSize: "1.2rem", color: "black" }}
                    />
                  }
                  aria-controls="panel1-content"
                  id="panel1-header"
                  className="summary-hoq"
                  sx={{
                    padding: "0 5px",
                  }}
                >
                  <Typography
                    className="title"
                    style={{
                      fontSize: "0.9rem",
                      textTransform: "uppercase",
                      marginLeft: "3.4px",
                    }}
                  >
                    Price Breakup
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography className="smr_Price_breakup_label">
                      Metal
                    </Typography>
                    <span style={{ display: "flex" }}>
                      <Typography>
                        {
                          <span
                            className="smr_currencyFont"
                            dangerouslySetInnerHTML={{
                              __html: decodeEntities(storeInit?.Currencysymbol),
                            }}
                          />
                        }
                      </Typography>
                      <Typography>
                        {(singleProd1?.Metal_Cost
                          ? singleProd1?.Metal_Cost
                          : singleProd?.Metal_Cost
                        )?.toFixed(2)}
                      </Typography>
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography className="smr_Price_breakup_label">
                      Diamond{" "}
                    </Typography>

                    <span style={{ display: "flex" }}>
                      <Typography>
                        {
                          <span
                            className="smr_currencyFont"
                            dangerouslySetInnerHTML={{
                              __html: decodeEntities(storeInit?.Currencysymbol),
                            }}
                          />
                        }
                      </Typography>
                      <Typography>
                        {(singleProd1?.Diamond_Cost
                          ? singleProd1?.Diamond_Cost
                          : singleProd?.Diamond_Cost
                        )?.toFixed(2)}
                      </Typography>
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography className="smr_Price_breakup_label">
                      Stone{" "}
                    </Typography>

                    <span style={{ display: "flex" }}>
                      <Typography>
                        {
                          <span
                            className="smr_currencyFont"
                            dangerouslySetInnerHTML={{
                              __html: decodeEntities(storeInit?.Currencysymbol),
                            }}
                          />
                        }
                      </Typography>
                      <Typography>
                        {(singleProd1?.ColorStone_Cost
                          ? singleProd1?.ColorStone_Cost
                          : singleProd?.ColorStone_Cost
                        )?.toFixed(2)}
                      </Typography>
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography className="smr_Price_breakup_label">
                      MISC{" "}
                    </Typography>

                    <span style={{ display: "flex" }}>
                      <Typography>
                        {
                          <span
                            className="smr_currencyFont"
                            dangerouslySetInnerHTML={{
                              __html: decodeEntities(storeInit?.Currencysymbol),
                            }}
                          />
                        }
                      </Typography>
                      <Typography>
                        {(singleProd1?.Misc_Cost
                          ? singleProd1?.Misc_Cost
                          : singleProd?.Misc_Cost
                        )?.toFixed(2)}
                      </Typography>
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography className="smr_Price_breakup_label">
                      Labour{" "}
                    </Typography>

                    <span style={{ display: "flex" }}>
                      <Typography>
                        {
                          <span
                            className="smr_currencyFont"
                            dangerouslySetInnerHTML={{
                              __html: decodeEntities(storeInit?.Currencysymbol),
                            }}
                          />
                        }
                      </Typography>
                      <Typography>
                        {(singleProd1?.Labour_Cost
                          ? singleProd1?.Labour_Cost
                          : singleProd?.Labour_Cost
                        )?.toFixed(2)}
                      </Typography>
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography className="smr_Price_breakup_label">
                      Other{" "}
                    </Typography>

                    <span style={{ display: "flex" }}>
                      <Typography>
                        {
                          <span
                            className="smr_currencyFont"
                            dangerouslySetInnerHTML={{
                              __html: decodeEntities(storeInit?.Currencysymbol),
                            }}
                          />
                        }
                      </Typography>
                      <Typography>
                        {(
                          (singleProd1?.Other_Cost
                            ? singleProd1?.Other_Cost
                            : singleProd?.Other_Cost) +
                          (singleProd1?.Size_MarkUp
                            ? singleProd1?.Size_MarkUp
                            : singleProd?.Size_MarkUp) +
                          (singleProd1?.DesignMarkUpAmount
                            ? singleProd1?.DesignMarkUpAmount
                            : singleProd?.DesignMarkUpAmount) +
                          (singleProd1?.ColorStone_SettingCost
                            ? singleProd1?.ColorStone_SettingCost
                            : singleProd?.ColorStone_SettingCost) +
                          (singleProd1?.Diamond_SettingCost
                            ? singleProd1?.Diamond_SettingCost
                            : singleProd?.Diamond_SettingCost) +
                          (singleProd1?.Misc_SettingCost
                            ? singleProd1?.Misc_SettingCost
                            : singleProd?.Misc_SettingCost)
                        )?.toFixed(2)}
                      </Typography>
                    </span>
                  </div>
                </AccordionDetails>
              </Accordion>
            )}
            {/* ring select */}
            {/* <div className="ring_size_select">
              <label htmlFor="RING">RING SIZE</label>
              <select onChange={() => {}} id="RING">
                {Array.from({ length: 22 }).map((val, i) => {
                  return (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  );
                })}
              </select>

              <a
                href="https://cdn.shopify.com/s/files/1/0643/8731/8014/files/Ring_guide_updated_-4.pdf?v=1708776159"
                target="_blank"
              >
                Ring Size Guide
              </a>
              <a
                href="https://cdn.shopify.com/s/files/1/0643/8731/8014/files/IGI_CERTIFICATE_COPY.pdf?v=1655287503"
                target="_blank"
              >
                View Sample Certificate
              </a>
            </div> */}
            {/* ends */}
            <div className="btn_Section">
              <button
                className={
                  !addToCartFlag
                    ? "hoq_AddToCart_btn"
                    : "hoq_AddToCart_btn_afterCart"
                }
                onClick={() => handleCart(!addToCartFlag)}
              >
                <span
                  className="hoq_addtocart_btn_txt"
                  style={{
                    color: !addToCartFlag ? "" : "white",
                    fontSize: "1rem",
                  }}
                >
                  {!addToCartFlag ? "ADD TO CART" : "REMOVE FROM CART"}
                </span>
              </button>
              <button onClick={() => handleWishList(!wishListFlag)}>
                <span className="hoq_addtocart_btn_txt">
                  {wishListFlag ? "ADD TO Wislist" : "Remove from wishlist"}
                </span>
                <FaHeart />
              </button>

              {/* <div className="product_ins_banner">
                <img
                  src="https://houseofquadri.com/cdn/shop/files/IGI_Certified_1_1024x.png?v=1712319485"
                  alt=""
                />
              </div> */}
            </div>
          </div>
          {/* <div className="backbutton">
            <button onClick={() => naviagate(-1)}>
              <FaArrowLeftLong /> BACK TO {previousPath}
            </button>
          </div> */}
        </div>
      </main>
      {/* <div className="details_d_C">
        <div className="hoq_material_details_portion">
          {diaList?.length > 0 && (
            <p className="hoq_details_title"> Product Details</p>
          )}
          {diaList?.length > 0 && (
            <div className="hoq_material_details_portion_inner">
              <ul style={{ margin: "0px 0px 3px 0px" }}>
                <li
                  style={{ fontWeight: 600 }}
                >{`Diamond Detail(${diaList?.reduce(
                  (accumulator, data) => accumulator + data.M,
                  0
                )}/${diaList
                  ?.reduce((accumulator, data) => accumulator + data?.N, 0)
                  .toFixed(2)}ct)`}</li>
              </ul>
              <ul className="hoq_mt_detail_title_ul">
                <li className="hoq_proDeatilList">Shape</li>
                <li className="hoq_proDeatilList">Clarity</li>
                <li className="hoq_proDeatilList">Color</li>
                <li className="hoq_proDeatilList">Pcs&nbsp;&nbsp;Wt</li>
              </ul>
              {diaList?.map((data) => (
                <ul className="hoq_mt_detail_title_ul">
                  <li className="hoq_proDeatilList1">{data?.F}</li>
                  <li className="hoq_proDeatilList1">{data?.H}</li>
                  <li className="hoq_proDeatilList1">{data?.J}</li>
                  <li className="hoq_proDeatilList1">
                    {data.M}&nbsp;&nbsp;{data?.N}
                  </li>
                </ul>
              ))}
            </div>
          )}

          {csList?.length > 0 && (
            <div className="hoq_material_details_portion_inner">
              <ul style={{ margin: "10px 0px 3px 0px" }}>
                <li
                  style={{ fontWeight: 600 }}
                >{`ColorStone Detail(${csList?.reduce(
                  (accumulator, data) => accumulator + data.M,
                  0
                )}/${csList
                  ?.reduce((accumulator, data) => accumulator + data?.N, 0)
                  .toFixed(2)}ct)`}</li>
              </ul>
              <ul className="hoq_mt_detail_title_ul">
                <li className="hoq_proDeatilList">Shape</li>
                <li className="hoq_proDeatilList">Clarity</li>
                <li className="hoq_proDeatilList">Color</li>
                <li className="hoq_proDeatilList">Pcs&nbsp;&nbsp;Wt</li>
              </ul>
              {csList?.map((data) => (
                <ul className="hoq_mt_detail_title_ul">
                  <li className="hoq_proDeatilList1">{data?.F}</li>
                  <li className="hoq_proDeatilList1">{data?.H}</li>
                  <li className="hoq_proDeatilList1">{data?.J}</li>
                  <li className="hoq_proDeatilList1">
                    {data.M}&nbsp;&nbsp;{data?.N}
                  </li>
                </ul>
              ))}
            </div>
          )}
        </div>
      </div> */}

      <RelatedProduct />
      <RecentlyViewd />
    </div>
  );
};

export default ProductPage;

const MagnifierSlider = ({ product, close }) => {
  const swiperRef = useRef(null);

  const goNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const goPrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };
  return (
    <>
      <div className="MagnifierSlider">
        <Swiper
          ref={swiperRef}
          zoom={true}
          navigation={false}
          pagination={false}
          spaceBetween={30}
          loop={true}
          modules={[Zoom, Navigation, Pagination]}
          className="mySwiper"
          effect="fade"
        >
          {product?.map((val, i) => {
            return (
              <SwiperSlide>
                <div className="swiper-zoom-container">
                  <img src={val?.img} />
                </div>
              </SwiperSlide>
            );
          })}
          <div className="controller">
            <button onClick={goNext}>
              <FaChevronLeft />
            </button>
            <button onClick={close}>
              <IoMdClose size={27} />
            </button>
            <button onClick={goPrev}>
              <FaChevronRight />
            </button>
          </div>
        </Swiper>
      </div>
    </>
  );
};

{
  /* material  */
}
{
  /* <Accordion className="accordian">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                className="summary"
              >
                <Typography
                  className="title"
                  align="center"
                  sx={{ width: "100%" }}
                >
                  MATERIAL & DETAILS
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="product_mt-dt">
                  <strong>Material & Details</strong>
                  <ul>
                    <li>
                      Our Lab Grown Diamonds are EF colour VVS-VS clarity (all
                      below 1 ct solitaires)
                    </li>
                    <li>
                      All 1 ct+ solitaires are IGI certified & available in
                      options of E/F/G colour and VVS/VS clarity
                    </li>
                    <li>
                      All products are 18K gold and available in 3 color
                      options: Yellow, White, and Rose Gold
                    </li>
                    <li>
                      Ladies ring pricing is maximum for ring size 14 and for
                      Gents, it is till ring size 21. Additional charges will be
                      applicable above that.
                    </li>
                    <li>
                      Each piece is customized and made to order. Center
                      solitaires can be set according to your preference
                    </li>
                    <li>
                      We provide free engraving such as a date/number wherever
                      possible
                    </li>
                  </ul>
                </div>
              </AccordionDetails>
            </Accordion> */
}
{
  /* payment */
}
{
  /* <Accordion className="accordian">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                className="summary"
              >
                <Typography
                  className="title"
                  align="center"
                  sx={{ width: "100%" }}
                >
                  PAYMENT & SHIPPING
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="product_terms">
                  <strong>Payment Terms</strong>
                  <ul>
                    <li>
                      50% advance is collected before processing your order
                      balance 50% before order ships
                    </li>
                    <li>
                      The prices are indicative considering Gold Rate @ Rs.
                      7k/gm. Will modify subject to change of rate
                    </li>
                    <li>
                      The price is also subject to the final diamond wt. +/- 5%
                    </li>
                  </ul>

                  <strong>Shipping Policy</strong>
                  <ul>
                    <li>3 weeks days from date of order + Shipping 2 days</li>
                    <li>Shipping is free PAN India</li>
                    <li>
                      International Shipping is available. To know more, reach
                      us at +919819086344
                    </li>
                  </ul>
                </div>
              </AccordionDetails>
            </Accordion> */
}
{
  /* ends */
}
{
  /* <span className="delivery">
              {" "}
              <CiDeliveryTruck size={24} /> Ships within 3 weeks
            </span>
            <p>
              This Band features 5 diamonds of 0.10 ct each. An essential that
              couples well with your solitaire ring completes the stacked look.
              Optionally reduce diamond size and increase count to 7 stones
              match your solitaire ring.
            </p> */
}
