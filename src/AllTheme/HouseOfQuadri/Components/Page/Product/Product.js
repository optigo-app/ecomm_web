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
import { IoMdArrowBack } from "react-icons/io";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { FaWhatsapp } from "react-icons/fa";

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
import Stockitems from "./InstockProduct/Stockitems";
import DesignSet from "./DesignSet/DesignSet";

const ProductPage = () => {
  const Navigate = useNavigate();
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
  const [expandedIndex, setExpandedIndex] = useState(null);
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
  const [loadingdata, setloadingdata] = useState(false);
  const [cartArr, setCartArr] = useState({});

  useEffect(() => {
    if (singleProd?.IsInWish == 1) {
      setWishListFlag(true);
    } else {
      setWishListFlag(false);
    }
  }, [singleProd]);

  useEffect(() => {
    const isInCart = singleProd?.IsInCart === 0 ? false : true;
    setAddToCartFlag(isInCart);
  }, [singleProd]);

  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    loop: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    initialSlide: 2,
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
    setloadingdata(true);
    const FetchProductData = async () => {
      let obj = {
        mt: metalArr,
        diaQc: `${diaArr?.QualityId},${diaArr?.ColorId}`,
        csQc: `${csArr?.QualityId},${csArr?.ColorId}`,
      };

      setisPriceLoading(true);

      await SingleProdListAPI(decodeobj, sizeData, obj, cookie)
        .then(async (res) => {
          if (res) {
            setSingleProd(res?.pdList[0]);

            if (res?.pdList?.length > 0) {
              setisPriceLoading(false);
              setloadingdata(false);
            }

            if (!res?.pdList[0]) {
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

    if (!wishListFlag) {
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

    // console.log("eeee", obj);
    setisPriceLoading(true);
    await SingleProdListAPI(prod, size, obj, cookie)
      .then((res) => {
        setSingleProd1(res?.pdList[0]);

        if (res?.pdList?.length > 0) {
          setisPriceLoading(false);
        }
        setDiaList(res?.pdResp?.rd3);
        setCsList(res?.pdResp?.rd4);
        // console.log("res123", res);
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

    // console.log("pdImgList", pdImgList, pdImgListCol);
  };
  const handleMoveToDetail = (productData) => {
    let loginInfo = JSON.parse(localStorage.getItem("loginUserDetail"));

    let obj = {
      a: productData?.autocode,
      b: productData?.designno,
      m: loginInfo?.MetalId,
      d: loginInfo?.cmboDiaQCid,
      c: loginInfo?.cmboCSQCid,
      f: {},
    };

    let encodeObj = compressAndEncode(JSON.stringify(obj));

    Navigate(
      `/d/${productData?.TitleLine?.replace(/\s+/g, `_`)}${
        productData?.TitleLine?.length > 0 ? "_" : ""
      }${productData?.designno}?p=${encodeObj}`
    );
  };

  const handleCartandWish = (e, ele, type) => {
    // console.log("event", e.target.checked, ele, type);
    let loginInfo = JSON.parse(localStorage.getItem("loginUserDetail"));

    let prodObj = {
      StockId: ele?.StockId,
      // "autocode": ele?.autocode,
      // "Metalid": ele?.MetalPurityid,
      // "MetalColorId": ele?.MetalColorid,
      // "DiaQCid": loginInfo?.cmboDiaQCid,
      // "CsQCid": loginInfo?.cmboCSQCid,
      // "Size": ele?.Size,
      Unitcost: ele?.Amount,
      // "UnitCostWithmarkup": ele?.Amount,
      // "Remark": ""
    };

    if (e.target.checked == true) {
      CartAndWishListAPI(type, prodObj, cookie)
        .then((res) => {
          let cartC = res?.Data?.rd[0]?.Cartlistcount;
          let wishC = res?.Data?.rd[0]?.Wishlistcount;
          setWishCountVal(wishC);
          setCartCountVal(cartC);
        })
        .catch((err) => console.log("err", err));
    } else {
      RemoveCartAndWishAPI(type, ele?.StockId, cookie, true)
        .then((res) => {
          let cartC = res?.Data?.rd[0]?.Cartlistcount;
          let wishC = res?.Data?.rd[0]?.Wishlistcount;
          setWishCountVal(wishC);
          setCartCountVal(cartC);
        })
        .catch((err) => console.log("err", err));
    }

    if (type === "Cart") {
      setCartArr((prev) => ({
        ...prev,
        [ele?.StockId]: e.target.checked,
      }));
    }
  };

  const handleChange = (index) => (event, isExpanded) => {
    setExpandedIndex(isExpanded ? index : null);
  };

  if (!singleProd) {
    return <NotFoundProduct Navigate={Navigate} />;
  }

  return (
    <div className="hoq_main_Product" style={{ marginBottom: "25px" }}>
      {/* {ShowMangifier && (
        <MagnifierSlider
          product={products}
          close={() => setShowMangifier(!ShowMangifier)}
        />
      )} */}
      <main>
        {/* <span style={{
          display  :"flex",
          alignItems  :"center",
          position  :"relative"
        }}> <small style={{
          padding:"-1px 2px",
          backgroundColor  :"orangered" ,
          borderRadius : "3px",
          fontSize  :"12px",
          color  :"white" ,
          gap  :"5px"
          // position :"absolute" ,
          // marginTop : "-32px",
          // marginLeft  :"-10px"
        }}>New</small> lookBook</span> */}
        <div className="images_slider">
          {loadingdata ? (
            <>
              <div className="slider">
                {Array.from({ length: 3 })?.map((val, i) => {
                  return (
                    <div
                      key={i}
                      onClick={() => handleThumbnailClick(i)}
                      className="box"
                    >
                      <Skeleton
                        width={100}
                        height={160}
                        sx={{
                          backgroundColor: "#f0ededb4 !important;",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              <div
                className="main_image_a"
                style={{
                  height: "80vh",
                  width: "100%",
                  marginTop: "3rem",
                  marginLeft: "1rem",
                  borderRadius: "4px",
                }}
              >
                <Skeleton
                  width={"100%"}
                  sx={{
                    padding: "0",
                    marginTop: "-12.5rem",
                    height: "100vh",
                    backgroundColor: "#f0ededb4 !important;",
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="slider">
                {PdImageArr?.map((val, i) => {
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
                          <video
                            src={val?.src}
                            className="hoq_prod_thumb_img"
                          />
                          <IoIosPlayCircle className="play_io_icon" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="main_image">
                <Slider {...settings} ref={sliderRef} lazyLoad="progressive">
                  {PdImageArr?.length > 0 ? (
                    PdImageArr?.map((val, i) => {
                      return (
                        <div key={i} className="slider_card">
                          <div className="image">
                            {val?.type == "img" ? (
                              <img
                                loading="lazy"
                                src={
                                  val?.src ||
                                  "https://www.defindia.org/wp-content/themes/dt-the7/images/noimage.jpg"
                                }
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
                                  height: "80vh",
                                }}
                              >
                                <video
                                  src={val?.src}
                                  loop={true}
                                  autoPlay={true}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "scale-down",
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="main_image">
                      <img
                        src={
                          "https://www.defindia.org/wp-content/themes/dt-the7/images/noimage.jpg"
                        }
                        alt={""}
                        style={{
                          width: "100%",
                          height: "90%",
                          objectFit: "contain",
                          border: "1px solid #312f2f21",
                          marginTop: "45px",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://www.defindia.org/wp-content/themes/dt-the7/images/noimage.jpg";
                        }}
                      />
                    </div>
                  )}
                </Slider>
              </div>
            </>
          )}
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
                      style={{ paddingRight: "0.4rem" }}
                      className="hoq_currencyFont"
                      dangerouslySetInnerHTML={{
                        __html: decodeEntities(loginInfo?.CurrencyCode),
                      }}
                    />
                  )}
                  {isPriceloading ? (
                    <Skeleton variant="rounded" width={140} height={30} />
                  ) : (
                    <>
                      {singleProd1?.UnitCostWithMarkUp ??
                        singleProd?.UnitCostWithMarkUp?.toLocaleString("en-IN")}
                    </>
                  )}
                </div>
              }
            </div>
          </div>
          <div className="product_main_Details">
            {storeInit?.IsProductWebCustomization == 1 &&
              metalTypeCombo?.length > 0 && (
                <div className="hoq_single_prod_customize_main">
                  <div className="first_row_hoq_new">
                    {
                      <div className="hoq_single_prod_customize">
                        <label className="menuItemTimeEleveDeatil">
                          METAL TYPE:
                        </label>
                        {singleProd?.IsMrpBase == 1 ? (
                          <span
                            className="hoq_menuitemSelectoreMain"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              marginLeft: "4px",
                            }}
                          >
                            {
                              metalTypeCombo?.filter(
                                (ele) =>
                                  ele?.Metalid == singleProd?.MetalPurityid
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
                    }
                    {metalColorCombo?.length > 0 && (
                      <div className="hoq_single_prod_customize">
                        <label
                          className="menuItemTimeEleveDeatil"
                          htmlFor="metal_c_hoq"
                        >
                          METAL COLOR:
                        </label>
                        {singleProd?.IsMrpBase == 1 ? (
                          <span
                            className="hoq_menuitemSelectoreMain"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              marginLeft: "4px",
                            }}
                          >
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
                  </div>
                  <div className="first_row_hoq_new">
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
                  </div>
                  {/* {console.log("sizeData",SizeCombo?.find((size) => size.IsDefaultSize === 1)?.sizename)} */}
                  {SizeCombo?.rd?.length > 0 && (
                    <div className="hoq_single_prod_customize">
                      <label className="menuItemTimeEleveDeatil">SIZE:</label>
                      {singleProd?.IsMrpBase == 1 ? (
                        <span
                          className="hoq_menuitemSelectoreMain"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginLeft: "4px",
                          }}
                        >
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

            <Accordion
              className="accordian"
              sx={{
                border: "none", // Remove default border
                boxShadow: "none", // Remove default shadow
                "&:before": {
                  // Remove the border-top pseudo-element
                  display: "none",
                },
              }}
              key={1}
              expanded={expandedIndex === 1}
              onChange={handleChange(1)}
            >
              <AccordionSummary
                expandIcon={
                  expandedIndex === 1 ? (
                    <RemoveIcon
                      style={{ fontSize: "1.2rem", color: "black" }}
                    />
                  ) : (
                    <AddIcon style={{ fontSize: "1.2rem", color: "black" }} />
                  )
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
                  sx={{
                    textAlign: "center",
                    width: "100%",
                  }}
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
                        {singleProd1?.Nwt ?? singleProd?.Nwt?.toFixed(3)}
                      </span>
                    </span>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion
              className="accordian"
              sx={{
                border: "none", // Remove default border
                boxShadow: "none", // Remove default shadow
                "&:before": {
                  // Remove the border-top pseudo-element
                  display: "none",
                },
              }}
              key={2}
              expanded={expandedIndex === 2}
              onChange={handleChange(2)}
            >
              <AccordionSummary
                expandIcon={
                  expandedIndex === 2 ? (
                    <RemoveIcon
                      style={{ fontSize: "1.2rem", color: "black" }}
                    />
                  ) : (
                    <AddIcon style={{ fontSize: "1.2rem", color: "black" }} />
                  )
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
                  sx={{
                    textAlign: "center",
                    width: "100%",
                  }}
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
                        <ul
                          style={{
                            margin: "0px 0px 3px 0px",
                            listStyle: "none",
                          }}
                        >
                          <li
                            className="dia-title"
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
                              {data.M}&nbsp; / &nbsp;{data?.N?.toFixed(3)}
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
                              {data.M}&nbsp; / &nbsp;{data?.N?.toFixed(3)}
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
              <Accordion
                className="accordian"
                key={3}
                sx={{
                  border: "none", // Remove default border
                  boxShadow: "none", // Remove default shadow
                  "&:before": {
                    // Remove the border-top pseudo-element
                    display: "none",
                  },
                }}
                expanded={expandedIndex === 3}
                onChange={handleChange(3)}
              >
                <AccordionSummary
                  expandIcon={
                    expandedIndex === 3 ? (
                      <RemoveIcon
                        style={{ fontSize: "1.2rem", color: "black" }}
                      />
                    ) : (
                      <AddIcon style={{ fontSize: "1.2rem", color: "black" }} />
                    )
                    // <AddIcon
                    //   style={{ fontSize: "1.2rem", color: "black" }}
                    // />
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
                    sx={{
                      textAlign: "center",
                      width: "100%",
                    }}
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
                            style={{ paddingRight: "0.4rem" }}
                            className="smr_currencyFont"
                            dangerouslySetInnerHTML={{
                              __html: decodeEntities(loginInfo?.CurrencyCode),
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
                            style={{ paddingRight: "0.4rem" }}
                            className="smr_currencyFont"
                            dangerouslySetInnerHTML={{
                              __html: decodeEntities(loginInfo?.CurrencyCode),
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
                            style={{ paddingRight: "0.4rem" }}
                            className="smr_currencyFont"
                            dangerouslySetInnerHTML={{
                              __html: decodeEntities(loginInfo?.CurrencyCode),
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
                            style={{ paddingRight: "0.4rem" }}
                            className="smr_currencyFont"
                            dangerouslySetInnerHTML={{
                              __html: decodeEntities(loginInfo?.CurrencyCode),
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
                            style={{ paddingRight: "0.4rem" }}
                            className="smr_currencyFont"
                            dangerouslySetInnerHTML={{
                              __html: decodeEntities(loginInfo?.CurrencyCode),
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
                            style={{ paddingRight: "0.4rem" }}
                            className="smr_currencyFont"
                            dangerouslySetInnerHTML={{
                              __html: decodeEntities(loginInfo?.CurrencyCode),
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
                  {!wishListFlag ? "ADD TO Wislist" : "Remove from wishlist"}
                </span>
                <FaHeart />
              </button>

              {/* <div className="product_ins_banner">
                <img
                  src="https://houseofquadri.com/cdn/shop/files/IGI_Certified_1_1024x.png?v=1712319485"
                  alt=""
                />
              </div> */}
              <WhatsAppButton />
            </div>
          </div>
        </div>
      </main>
      {stockItemArr?.length > 0 && storeInit?.IsStockWebsite === 1 && (
        <Stockitems
          stockItemArr={stockItemArr}
          storeInit={storeInit}
          loginInfo={loginInfo}
          cartArr={cartArr}
          handleCartandWish={handleCartandWish}
        />
      )}
      {storeInit?.IsProductDetailSimilarDesign == 1 &&
        SimilarBrandArr?.length > 0 && (
          <RelatedProduct
            SimilarBrandArr={SimilarBrandArr}
            handleMoveToDetail={handleMoveToDetail}
            storeInit={storeInit}
            loginInfo={loginInfo}
          />
        )}
      {storeInit?.IsProductDetailDesignSet === 1 && (
        <DesignSet
          designSetList={designSetList}
          handleMoveToDetail={handleMoveToDetail}
          imageNotFound={imageNotFound}
          loginInfo={loginInfo}
          storeInit={storeInit}
        />
      )}

      {/* <RecentlyViewd /> */}
    </div>
  );
};

export default ProductPage;

const NotFoundProduct = ({ Navigate }) => {
  return (
    <div className="not-found-product">
      <h2>Product Not Found</h2>
      <p>We couldn't find the product you're looking for.</p>
      <button onClick={() => Navigate(-1)}>
        <IoMdArrowBack size={18} /> Go Back To Previous Page
      </button>
    </div>
  );
};
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
const WhatsAppButton = () => {
  const HandleWhatsApp = () => {
    const msg1 = "Hello, Talk to a Jewellery expert now!";
    const phoneNumber = 9099889962;
    const whatsappUrl = `https://web.whatsapp.com/send?phone=9099889962&text=${msg1}`;
    window.location.href = whatsappUrl;
  };
  return (
    <div className="whatsapp_btn">
      <div className="wa" onClick={() => HandleWhatsApp()}>
        <div className="left">
          <FaWhatsapp size={50} color="white" className="wa-hoq" />
        </div>
        <div className="con">
          <h4>
            Optigo Apps <span>Online</span>
          </h4>
          <h3>Need Help ? Chat With Us</h3>
        </div>
      </div>
    </div>
  );
};
