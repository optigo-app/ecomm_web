import React, { useEffect, useState } from "react";
import "./productlist.scss";
import ProductListApi from "../../../../../../utils/API/ProductListAPI/ProductListApi";
import { useLocation, useNavigate } from "react-router-dom";
import imageNotFound from "../../../Assets/image-not-found.jpg"
import { GetPriceListApi } from "../../../../../../utils/API/PriceListAPI/GetPriceListApi";
import { findMetal, findMetalColor, findMetalType } from "../../../../../../utils/Glob_Functions/GlobalFunction";
import ProductListSkeleton from "./productlist_skeleton/ProductListSkeleton";
import { FilterListAPI } from "../../../../../../utils/API/FilterAPI/FilterListAPI";
import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, FormControlLabel, Pagination } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Footer from "../../Home/Footer/Footer";
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { CartAndWishListAPI } from "../../../../../../utils/API/CartAndWishList/CartAndWishListAPI";
import { RemoveCartAndWishAPI } from "../../../../../../utils/API/RemoveCartandWishAPI/RemoveCartAndWishAPI";
import { useSetRecoilState } from "recoil";
import { CartCount, WishCount } from "../../../Recoil/atom";
import pako from "pako";
import { SearchProduct } from "../../../../../../utils/API/SearchProduct/SearchProduct";
import { MetalTypeComboAPI } from "../../../../../../utils/API/Combo/MetalTypeComboAPI";
import { DiamondQualityColorComboAPI } from "../../../../../../utils/API/Combo/DiamondQualityColorComboAPI";
import { ColorStoneQualityColorComboAPI } from "../../../../../../utils/API/Combo/ColorStoneQualityColorComboAPI";
import { MetalColorCombo } from "../../../../../../utils/API/Combo/MetalColorCombo";

const ProductList = () => {

  const loginUserDetail = JSON.parse(localStorage.getItem("loginUserDetail"));

  let location = useLocation();
  let navigate = useNavigate();

  const [productListData, setProductListData] = useState([]);
  const [priceListData, setPriceListData] = useState([]);
  const [finalProductListData, setFinalProductListData] = useState([]);
  const [isProdLoading, setIsProdLoading] = useState(true);
  const [isOnlyProdLoading, setIsOnlyProdLoading] = useState(true);
  const [storeInit, setStoreInit] = useState({});
  const [filterData, setFilterData] = useState([])
  const [filterChecked, setFilterChecked] = useState({})
  const [afterFilterCount, setAfterFilterCount] = useState();
  const [accExpanded, setAccExpanded] = useState(null);
  const [currPage, setCurrPage] = useState(1);
  const [cartArr, setCartArr] = useState({})
  const [wishArr, setWishArr] = useState({})
  const [menuParams, setMenuParams] = useState({})
  const [filterProdListEmpty, setFilterProdListEmpty] = useState(false)
  const [metalTypeCombo, setMetalTypeCombo] = useState([]);
  const [diaQcCombo, setDiaQcCombo] = useState([]);
  const [csQcCombo, setCsQcCombo] = useState([]);
  const [selectedMetalId, setSelectedMetalId] = useState(loginUserDetail?.MetalId ?? "");
  const [selectedDiaId, setSelectedDiaId] = useState(loginUserDetail?.cmboDiaQCid ?? "");
  const [selectedCsId, setSelectedCsId] = useState(loginUserDetail?.cmboCSQCid ?? "");
  const [IsBreadCumShow,setIsBreadcumShow] = useState(false);
  const [loginInfo, setLoginInfo] = useState();

  const [rollOverImgPd,setRolloverImgPd] = useState()

  const setCartCountVal = useSetRecoilState(CartCount)
  const setWishCountVal = useSetRecoilState(WishCount)


  // useEffect(()=>{

  //   let UrlVal =  location?.search.slice(1).split("/")

  //     let MenuVal = '';
  //     let MenuKey = '';
  //     let SearchVar = '';
  //     let TrendingVar = '';
  //     let NewArrivalVar = '';
  //     let BestSellerVar = '';
  //     let AlbumVar = '';

  //   UrlVal.forEach((ele)=>{
  //     let firstChar = ele.charAt(0);

  //     switch (firstChar) {
  //       case 'V':
  //           MenuVal = ele;
  //           break;
  //       case 'K':
  //           MenuKey = ele;
  //           break;
  //       case 'S':
  //           SearchVar = ele;
  //           break;
  //       case 'T':
  //           TrendingVar = ele;
  //           break;
  //       case 'N':
  //           NewArrivalVar = ele;
  //           break;
  //       case 'B':
  //           BestSellerVar = ele;
  //           break;
  //       case 'AB':
  //           AlbumVar = ele;
  //           break;
  //       default:
  //           return '';
  //     }
  //   })

  //   if(MenuVal && MenuKey){
  //     let key = location?.search.slice(1).split("/")[1]?.slice(2).split("&")
  //     let val = location?.search.slice(1).split("/")[0]?.slice(2).split("&")

  //     let MergedUrlArr = MergedUrl(key,val)

  //     console.log("menuval",MergedUrlArr)
  //   }

  //   if(SearchVar){
  //     console.log("SearchVar",SearchVar)
  //   }
  //   if(TrendingVar){
  //     console.log("TrendingVar",TrendingVar)
  //   }
  //   if(NewArrivalVar){
  //     console.log("NewArrivalVar",NewArrivalVar)
  //   }
  //   if(BestSellerVar){
  //     console.log("BestSellerVar",BestSellerVar)
  //   }
  //   if(AlbumVar){
  //     console.log("AlbumVar",AlbumVar)
  //   }


  // },[location?.key])


  const callAllApi = () => {
    let mtTypeLocal = JSON.parse(localStorage.getItem("metalTypeCombo"));
    let diaQcLocal = JSON.parse(localStorage.getItem("diamondQualityColorCombo"));
    let csQcLocal = JSON.parse(localStorage.getItem("ColorStoneQualityColorCombo"));
    let mtColorLocal = JSON.parse(localStorage.getItem("MetalColorCombo"));

    if (!mtTypeLocal || mtTypeLocal?.length === 0) {
      MetalTypeComboAPI()
        .then((response) => {
          if (response?.Data?.rd) {
            let data = response?.Data?.rd;
            localStorage.setItem("metalTypeCombo", JSON.stringify(data));
            setMetalTypeCombo(data);

          }
        })
        .catch((err) => console.log(err));
    }
     else {
      setMetalTypeCombo(mtTypeLocal);
    }

    if (!diaQcLocal || diaQcLocal?.length === 0) {
      DiamondQualityColorComboAPI()
        .then((response) => {
          if (response?.Data?.rd) {
            let data = response?.Data?.rd;
            localStorage.setItem("diamondQualityColorCombo",JSON.stringify(data));
            setDiaQcCombo(data);
          }
        })
        .catch((err) => console.log(err));
    } 
    else {
      setDiaQcCombo(diaQcLocal);
    }

    if (!csQcLocal || csQcLocal?.length === 0) {
      ColorStoneQualityColorComboAPI()
        .then((response) => {
          if (response?.Data?.rd) {
            let data = response?.Data?.rd;
            localStorage.setItem("ColorStoneQualityColorCombo", JSON.stringify(data) );
            setCsQcCombo(data);
          }
        })
        .catch((err) => console.log(err));
    } 
    else {
      setCsQcCombo(csQcLocal);
    }

    if (!mtColorLocal || mtColorLocal?.length === 0) {
      MetalColorCombo()
        .then((response) => {
          if (response?.Data?.rd) {
            let data = response?.Data?.rd;
            localStorage.setItem("MetalColorCombo", JSON.stringify(data));
          }
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    const logininfo = JSON.parse(localStorage.getItem("loginUserDetail"));
    setLoginInfo(logininfo);
  }, []);

  useEffect(() => {
    callAllApi();
  }, [loginInfo]);

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    })
  }, [])

  // useEffect(()=>{
  //   if(location?.state?.SearchVal !== undefined){ 
  //     setTimeout(()=>{
  //       SearchProduct(location?.state?.SearchVal).then((res)=>{
  //         console.log("search",res)
  //       })
  //     },500)
  //   }
  // },[location?.key])

  useEffect(() => {
    let storeinit = JSON.parse(localStorage.getItem("storeInit"));
    setStoreInit(storeinit)

    let mtCombo = JSON.parse(localStorage.getItem("metalTypeCombo"));
    setMetalTypeCombo(mtCombo)

    let diaQcCombo = JSON.parse(localStorage.getItem("diamondQualityColorCombo"));
    setDiaQcCombo(diaQcCombo)

    let CsQcCombo = JSON.parse(localStorage.getItem("ColorStoneQualityColorCombo"));
    setCsQcCombo(CsQcCombo)
  }, [])

  useEffect(() => {
    let param = JSON.parse(localStorage.getItem("menuparams"))
    if(location?.state?.SearchVal === undefined){
      setMenuParams(param)
     }
  },[location?.key,productListData,filterChecked])
  // },[location?.state?.menu,productListData,filterChecked])

  useEffect(() => {


    let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId }

    let UrlVal =  location?.search.slice(1).split("/")

    console.log("URLVal",UrlVal);

      let MenuVal = '';
      let MenuKey = '';
      let SearchVar = '';
      let TrendingVar = '';
      let NewArrivalVar = '';
      let BestSellerVar = '';
      let AlbumVar = '';

      let productlisttype;

    UrlVal.forEach((ele)=>{
      let firstChar = ele.charAt(0);

      switch (firstChar) {
        case 'M':
            MenuVal = ele;
            break;
        case 'S':
            SearchVar = ele;
            break;
        case 'T':
            TrendingVar = ele;
            break;
        case 'N':
            NewArrivalVar = ele;
            break;
        case 'B':
            BestSellerVar = ele;
            break;
        case 'A':
            AlbumVar = ele;
            break;
        default:
            return '';
      }
    })

    if(MenuVal){

      let menuDecode = atob(MenuVal.split("=")[1])

      let key = menuDecode.split("/")[1].split(',')
      let val = menuDecode.split("/")[0].split(',')

      setIsBreadcumShow(true)

      productlisttype=[key,val]
    }

    if(SearchVar){
      productlisttype = SearchVar
    }

    if(TrendingVar){
      productlisttype = TrendingVar.split("=")[1]
    }
    if(NewArrivalVar){
      productlisttype = NewArrivalVar.split("=")[1]
    }
    if(BestSellerVar){
      productlisttype = BestSellerVar.split("=")[1]
    }
    if(AlbumVar){
      productlisttype = AlbumVar.split("=")[1]
    }
    
    setIsProdLoading(true)

    //  if(location?.state?.SearchVal === undefined){ 
      ProductListApi({},1,obj,productlisttype)
        .then((res) => {
          if (res) {
            console.log("productList",res);
            setProductListData(res?.pdList);
            setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount)
          }
          return res;
        })
        .then( async(res) => {
          let forWardResp;
          if (res) {
            await GetPriceListApi(1,{},{},res?.pdResp?.rd1[0]?.AutoCodeList,obj,productlisttype).then((resp)=>{
              if(resp){
               console.log("productPriceData",resp);

                setPriceListData(resp)
                forWardResp = resp;
              }
            })
          }
          return forWardResp
        }).then(async(forWardResp)=>{
          let forWardResp1;
          if(forWardResp){
            FilterListAPI(productlisttype).then((res)=>{
              setFilterData(res)
              forWardResp1 = res
            }).catch((err)=>console.log("err",err))
          }
          return forWardResp1
        }).finally(()=> {
          setIsProdLoading(false)
          setIsOnlyProdLoading(false)
        })
        .catch((err) => console.log("err", err))
      // }
  }, [location?.key])

  useEffect(() => {
    const finalProdWithPrice = productListData.map((product) => {
      const newPriceData = priceListData?.rd?.find(
        (pda) => pda.A == product.autocode
      );

      const newPriceData1 = priceListData?.rd1
        ?.filter((pda) => pda.A == product.autocode)
        .reduce((acc, obj) => acc + obj.S, 0);

      const newPriceData2 = priceListData?.rd2
        ?.filter((pda) => pda.A == product.autocode)
        .reduce((acc, obj) => acc + obj.S, 0);

        let pdImgList = [];

        if(product?.ImageCount > 0){
          for(let i = 1; i <= product?.ImageCount; i++){
            let imgString = storeInit?.DesignImageFol + product?.designno + "_" + i + "." + product?.ImageExtension
            pdImgList.push(imgString)
          }
        }
        else{
          pdImgList.push(imageNotFound)
        }

      let price = 0;
      let markup = 0;
      let metalrd = 0;
      let diard1 = 0;
      let csrd2 = 0;
      let updNWT = 0;
      let updGWT = 0;
      let updDWT = 0;
      let updDPCS = 0;
      let updCWT = 0;
      let updCPCS = 0;
      let ismrpbase;
      let mrpbaseprice;
      let images = pdImgList;

      if (newPriceData || newPriceData1 || newPriceData2) {
        price =
          ((newPriceData?.V ?? 0) / storeInit?.CurrencyRate ?? 0) +
          (newPriceData?.W ?? 0) +
          (newPriceData?.X ?? 0) +
          (newPriceData1 ?? 0) +
          (newPriceData2 ?? 0);
        metalrd =
          ((newPriceData?.V ?? 0) / storeInit?.CurrencyRate ?? 0) +
          (newPriceData?.W ?? 0) +
          (newPriceData?.X ?? 0);
        diard1 = newPriceData1 ?? 0;
        csrd2 = newPriceData2 ?? 0;
        markup = newPriceData?.AB;
        updNWT = newPriceData?.I ?? 0;
        updGWT = newPriceData?.N ?? 0;
        updDWT = newPriceData?.K ?? 0;
        updDPCS = newPriceData?.J ?? 0;
        updCWT = newPriceData?.M ?? 0;
        updCPCS = newPriceData?.L ?? 0;
        ismrpbase = newPriceData?.U;
        mrpbaseprice = newPriceData?.Z;
      }

      return {
        ...product,
        price,
        markup,
        metalrd,
        diard1,
        csrd2,
        updNWT,
        updGWT,
        updDWT,
        updDPCS,
        updCWT,
        updCPCS,
        ismrpbase,
        mrpbaseprice,
        images
      };
    });

    // console.log("finalProdWithPrice", finalProdWithPrice?.filter((ele)=>ele?.ImageCount > 0));
    setFinalProductListData(finalProdWithPrice);
  }, [productListData, priceListData]);

  const ProdCardImageFunc = (pd,j) => {
    let finalprodListimg;
    let pdImgList = [];

    if(pd?.ImageCount > 0){
      for(let i = 1; i <= pd?.ImageCount; i++){
        let imgString = storeInit?.DesignImageFol + pd?.designno + "_" + i + "." + pd?.ImageExtension
        pdImgList.push(imgString)
      }
    }
    else{
      finalprodListimg = imageNotFound;
    }
    if(pdImgList?.length > 0){
      finalprodListimg = pdImgList[j]
      if(j>0 && (!finalprodListimg || finalprodListimg == undefined)){
        finalprodListimg = pdImgList[0]
      }
    }
    return finalprodListimg
  }

  const decodeEntities = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  const PriceWithMarkupFunction = (pmu, pPrice, curr) => {
    if (pPrice <= 0) {
      return 0
    }
    else if (pmu <= 0) {
      return pPrice
    }
    else {
      let percentPMU = ((pmu / 100) / curr)
      return (Number(pPrice * (percentPMU ?? 0)) + Number(pPrice ?? 0))
    }
  }

  const handleCheckboxChange = (e,listname,val) =>{
    const { name, checked } = e.target;

    // console.log("output filterCheckedVal",{checked,type:listname,id:name.replace(/[a-zA-Z]/g, ''),value:val});

    setFilterChecked((prev) => ({
      ...prev,
      [name]: { checked, type: listname, id: name?.replace(/[a-zA-Z]/g, ''), value: val }
    }))
  }

  const FilterValueWithCheckedOnly = () => {
    let onlyTrueFilterValue = Object.values(filterChecked).filter(ele => ele.checked)

    const output = {};

    onlyTrueFilterValue.forEach(item => {
      if (!output[item.type]) {
        output[item.type] = '';
      }
      output[item.type] += `${item.id}, `;
    });

    for (const key in output) {
      output[key] = output[key].slice(0, -2);
    }

    return output
  }
  
  useEffect(()=>{
   let output = FilterValueWithCheckedOnly()
   let obj={mt:selectedMetalId,dia:selectedDiaId,cs:selectedCsId}
   
   if(location?.state?.SearchVal === undefined && Object.keys(filterChecked)?.length > 0){
     setIsOnlyProdLoading(true)
      ProductListApi(output,1,obj)
        .then((res) => {
          if (res) {
            setProductListData(res?.pdList);
            setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount)
          }
          return res;
        })
        .then( async(res) => {
          if (res) {
            await GetPriceListApi(1,{},output,res?.pdResp?.rd1[0]?.AutoCodeList,obj).then((resp)=>{
              if(resp){
                setPriceListData(resp)  
              }
            })
          }
          return res
        })
        // .then(async(res)=>{
        //   if(res){
        //     FilterListAPI().then((res)=>setFilterData(res)).catch((err)=>console.log("err",err))
        //   }
        // })
        .catch((err) => console.log("err", err)).finally((res)=>{setIsOnlyProdLoading(false)})
      }

  }, [filterChecked])


  const handelFilterClearAll = () => {
    if (Object.values(filterChecked).filter(ele => ele.checked)?.length > 0) { setFilterChecked({}) }
    setAccExpanded(false)
  }

  const handelPageChange = (event, value) => {
    let output = FilterValueWithCheckedOnly()
    let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId }
    setIsProdLoading(true)
    setCurrPage(value)
    setTimeout(() => {
      window.scroll({
        top: 0,
        behavior: 'smooth'
      })
    }, 100)
    ProductListApi(output, value, obj)
      .then((res) => {
        if (res) {
          setProductListData(res?.pdList);
          setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount)
        }
        return res;
      })
      .then(async (res) => {
        if (res) {
          await GetPriceListApi(value, {}, output, res?.pdResp?.rd1[0]?.AutoCodeList, obj).then((resp) => {
            if (resp) {
              setPriceListData(resp)
            }
          })
        }
        return res
      })
      .catch((err) => console.log("err", err)).finally(() => {
        setTimeout(() => {
          setIsProdLoading(false)
        }, 100);
      })
  }

  const handleCartandWish = (e, ele, type) => {
    console.log("event", e.target.checked, ele, type);
    let loginInfo = JSON.parse(localStorage.getItem("loginUserDetail"));

    let prodObj = {
      "autocode": ele?.autocode,
      "Metalid": ele?.MetalPurityid,
      "MetalColorId": ele?.MetalColorid,
      "DiaQCid": loginInfo?.cmboDiaQCid,
      "CsQCid": loginInfo?.cmboCSQCid,
      "Size": ele?.DefaultSize,
      "Unitcost": ele?.price,
      "markup": ele?.markup,
      "UnitCostWithmarkup": PriceWithMarkupFunction(ele?.markup, ele?.price, storeInit?.CurrencyRate),
      "Remark": ""
    }

    if (e.target.checked == true) {
      CartAndWishListAPI(type, prodObj).then((res) => {
        let cartC = res?.Data?.rd[0]?.Cartlistcount
        let wishC = res?.Data?.rd[0]?.Wishlistcount
        setWishCountVal(wishC)
        setCartCountVal(cartC);
      }).catch((err) => console.log("err", err))
    } else {
      RemoveCartAndWishAPI(type, ele?.autocode).then((res) => {
        let cartC = res?.Data?.rd[0]?.Cartlistcount
        let wishC = res?.Data?.rd[0]?.Wishlistcount
        setWishCountVal(wishC)
        setCartCountVal(cartC);
      }).catch((err) => console.log("err", err))
    }

    if (type === "Cart") {
      setCartArr((prev) => ({
        ...prev,
        [ele?.autocode]: e.target.checked
      }))
    }

    if (type === "Wish") {
      setWishArr((prev) => ({
        ...prev,
        [ele?.autocode]: e.target.checked
      }))
    }

  }

  useEffect(() => {
    if (productListData?.length === 0 || !productListData) {
      setFilterProdListEmpty(true)
    } else {
      setFilterProdListEmpty(false)
    }
  }, [productListData])


  const handelCustomCombo = (obj) => {

    let output = FilterValueWithCheckedOnly()
    
    if(location?.state?.SearchVal === undefined){
      setIsOnlyProdLoading(true)
      ProductListApi(output,currPage,obj)
          .then((res) => {
            if (res) {
              setProductListData(res?.pdList);
              setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount)
            }
            return res;
          })
          .then( async(res) => {
            if (res) {
              await GetPriceListApi(currPage,{},output,res?.pdResp?.rd1[0]?.AutoCodeList,obj).then((resp)=>{
                if(resp){
                  setPriceListData(resp)  
                }
              })
            }
            return res
          })
          .catch((err) => console.log("err", err))
          .finally(()=>{
            setTimeout(() => {
              localStorage.setItem("short_cutCombo_val",JSON?.stringify(obj))
              setIsOnlyProdLoading(false)
            }, 100);
          })
    }
  }

  useEffect(() => {

    let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId }

    let loginInfo = JSON.parse(localStorage.getItem("loginUserDetail"));

    localStorage.setItem("short_cutCombo_val", JSON?.stringify(obj))

    
    if(loginInfo?.MetalId !== selectedMetalId  || loginInfo?.cmboDiaQCid !== selectedDiaId || loginInfo?.cmboCSQCid !== selectedCsId){ 
      if(selectedMetalId !== "" || selectedDiaId !== "" || selectedCsId !== "") {
        handelCustomCombo(obj)
      }
    }


  }, [selectedMetalId, selectedDiaId, selectedCsId])

  const compressAndEncode = (inputString) => {
    try {
      const uint8Array = new TextEncoder().encode(inputString);

      const compressed = pako.deflate(uint8Array, { to: 'string' });


      return btoa(String.fromCharCode.apply(null, compressed));
    } catch (error) {
      console.error('Error compressing and encoding:', error);
      return null;
    }
  };

  const decodeAndDecompress = (encodedString) => {
    try {
      // Decode the Base64 string to binary data
      const binaryString = atob(encodedString);

      // Convert binary string to Uint8Array
      const uint8Array = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }

      // Decompress the data
      const decompressed = pako.inflate(uint8Array, { to: 'string' });

      // Convert decompressed data back to JSON object
      const jsonObject = JSON.parse(decompressed);

      return jsonObject;
    } catch (error) {
      console.error('Error decoding and decompressing:', error);
      return null;
    }
  };

  const handleMoveToDetail = (productData) => {
    let output = FilterValueWithCheckedOnly()
    let obj = {
      a: productData?.autocode,
      b: productData?.designno,
      m: productData?.metaltypeid,
      d: selectedDiaId,
      c: selectedCsId,
      f: output
    }
    console.log('ksjkfjkjdkjfkjsdk--', obj);
    // compressAndEncode(JSON.stringify(obj))

    decodeAndDecompress()

    let encodeObj = compressAndEncode(JSON.stringify(obj))

    navigate(`/d/${productData?.TitleLine.replace(/\s+/g, `_`)}${productData?.TitleLine?.length > 0 ? "_" : ""}${productData?.designno}?p=${encodeObj}`)

  }

  const handleImgRollover = (pd,i) =>{
    if(pd?.images?.length >=1){
      setRolloverImgPd((prev)=>{ return {...prev,[i]:pd?.images[1] }})
    }
  }


  const handleBreadcums = (mparams) => {

    let key = Object?.keys(mparams)
    let val = Object?.values(mparams)

    let KeyObj = {};
    let ValObj = {};

    key.forEach((value, index) => {
        let keyName = `FilterKey${index === 0 ? '' : index}`;
        KeyObj[keyName] = value;
    });

    val.forEach((value, index) => {
        let keyName = `FilterVal${index === 0 ? '' : index}`;
        ValObj[keyName] = value;
    });

    let finalData = {...KeyObj,...ValObj}

    const queryParameters = [
      finalData?.FilterKey && `${finalData.FilterVal}`,
      finalData?.FilterKey1 && `${finalData.FilterVal1}`,
      finalData?.FilterKey2 && `${finalData.FilterVal2}`,
    ].filter(Boolean).join('&');

    const otherparamUrl = Object.entries({
      b: finalData?.FilterKey,
      g: finalData?.FilterKey1,
      c: finalData?.FilterKey2,
    })
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => value)
      .filter(Boolean)
      .join('&');

      const url = `/p?V=${queryParameters}/K=${otherparamUrl}`;

      navigate(url);

    console.log("mparams",KeyObj,ValObj)

  }

  return (
    <div id="top">
      <div className="smr_bodyContain">
        <div className="smr_outerContain">
          <div className="smr_whiteInnerContain">
            {
            isProdLoading ? 
            // true ? 
            (
              <ProductListSkeleton />
            ) : (
              <>
                <div className="smr_prodSorting">
                  <div className="empty_sorting_div">
                    <span className="smr_breadcums_port " style={{marginLeft:'72px'}} onClick={()=>{navigate('/')}}>{'Home >'}{" "}</span>
                     { IsBreadCumShow && <div className="smr_breadcums_port">
                           {menuParams?.menuname && <span onClick={() => handleBreadcums({[menuParams?.FilterKey]:menuParams?.FilterVal})}>{menuParams?.menuname}</span>}

                           {menuParams?.FilterVal1 && <span 
                            onClick={() => handleBreadcums({[menuParams?.FilterKey]:menuParams?.FilterVal,[menuParams?.FilterKey1]:menuParams?.FilterVal1})}
                           >
                            {` > ${menuParams?.FilterVal1}`}
                            </span>}

                           {menuParams?.FilterVal2 && <span
                            onClick={() => handleBreadcums({[menuParams?.FilterKey]:menuParams?.FilterVal,[menuParams?.FilterKey1]:menuParams?.FilterVal1,[menuParams?.FilterKey2]:menuParams?.FilterVal2})}
                           > 
                           {` > ${menuParams?.FilterVal2}`}
                           </span>}
                        </div>
                     }
                  </div>

                      <div className="smr_main_sorting_div">
                        <div className="smr_metal_custom">
                          <label className="label">
                            Metal:&nbsp;
                          </label>
                          <select className="select" value={selectedMetalId} onChange={(e) => setSelectedMetalId(e.target.value)}>
                            {
                              metalTypeCombo?.map((metalele) => (
                                <option className="option" key={metalele?.Metalid} value={metalele?.Metalid}>{metalele?.metaltype.toUpperCase()}</option>
                              ))
                            }
                          </select>
                        </div>

                        <div className="smr_dia_custom">
                          <label className="label">
                            Diamond:&nbsp;
                          </label>
                          <select className="select" value={selectedDiaId} onChange={(e) => setSelectedDiaId(e.target.value)}>
                            {

                              diaQcCombo?.map((diaQc) => (
                                <option className="option" key={diaQc.ColorId} value={`${diaQc.Quality},${diaQc.color}`}> {`${diaQc.Quality.toUpperCase()},${diaQc.color.toLowerCase()}`}</option>
                              ))
                            }
                          </select>
                        </div>

                        {storeInit?.IsCsCustomization === 1 && <div className="smr_cs_custom">
                          <label className="label">
                            color stone:&nbsp;
                          </label>
                          <select className="select" value={selectedCsId} onChange={(e) => setSelectedCsId(e.target.value)}>
                            {
                              csQcCombo?.map((csCombo) => (
                                <option className="option" key={csCombo.ColorId} value={`${csCombo.Quality},${csCombo.color}`}> {`${csCombo.Quality.toUpperCase()},${csCombo.color.toLowerCase()}`}</option>
                              ))
                            }
                          </select>
                        </div>}

                        <div className="smr_sorting_custom">
                          <div className="container">
                            <label className="label">
                              Sort By:&nbsp;
                            </label>
                            <select className="select">
                              <option
                                className="option"
                                value="Recommended"
                              >
                                Recommended
                              </option>
                              <option className="option" value="New">
                                New
                              </option>
                              <option
                                className="option"
                                value="In Stock"
                              >
                                In stock
                              </option>
                              <option
                                className="option"
                                value="PRICE HIGH TO LOW"
                              >
                                Price High To Low
                              </option>
                              <option
                                className="option"
                                value="PRICE LOW TO HIGH"
                              >
                                Price Low To High
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="smr_mainPortion">
                      <div className="smr_filter_portion">
                        <div style={{ padding: "21px 71px" }}>
                          <span className="smr_filter_text">
                            <span>
                              {Object.values(filterChecked).filter(
                                (ele) => ele.checked
                              )?.length === 0
                                ? "Filters"
                                : `Product Found: ${afterFilterCount}`}
                            </span>
                            <span onClick={() => handelFilterClearAll()}>
                              {Object.values(filterChecked).filter(
                                (ele) => ele.checked
                              )?.length > 0
                                ? "Clear All"
                                : ""}
                            </span>
                          </span>
                          <div style={{ marginTop: "12px" }}>
                            {filterData?.map((ele) => (
                              <>
                                {!(ele?.id)?.includes("Range") && (
                                  <Accordion
                                    elevation={0}
                                    sx={{
                                      borderBottom: "1px solid #c7c8c9",
                                      borderRadius: 0,
                                      "&.MuiPaper-root.MuiAccordion-root:last-of-type":
                                      {
                                        borderBottomLeftRadius: "0px",
                                        borderBottomRightRadius: "0px",
                                      },
                                      "&.MuiPaper-root.MuiAccordion-root:before": {
                                        background: "none",
                                      },
                                    }}
                                  // expanded={accExpanded}
                                  // defaultExpanded={}
                                  >
                                    <AccordionSummary
                                      expandIcon={
                                        <ExpandMoreIcon sx={{ width: "20px" }} />
                                      }
                                      aria-controls="panel1-content"
                                      id="panel1-header"
                                      sx={{
                                        color: "#7f7d85",
                                        borderRadius: 0,

                                        "&.MuiAccordionSummary-root": {
                                          padding: 0,
                                        },

                                      }}
                                      className="filtercategoryLable"
                                    >
                                      {/* <span> */}
                                      {ele.Name}
                                      {/* </span> */}
                                    </AccordionSummary>
                                    <AccordionDetails
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "4px",
                                        minHeight: "fit-content",
                                        maxHeight: "300px",
                                        overflow: "auto",
                                      }}
                                    >
                                      {(JSON.parse(ele?.options) ?? []).map((opt) => (
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: "12px",
                                          }}
                                          key={opt?.id}
                                        >
                                          {/* <small
                                        style={{
                                          fontFamily: "TT Commons, sans-serif",
                                          color: "#7f7d85",
                                        }}
                                      >
                                        {opt.Name}
                                      </small> */}
                                      <FormControlLabel
                                      control={
                                      <Checkbox
                                        name={`${ele?.id}${opt?.id}`}
                                        // checked={
                                        //   filterChecked[`checkbox${index + 1}${i + 1}`]
                                        //     ? filterChecked[`checkbox${index + 1}${i + 1}`]?.checked
                                        //     : false
                                        // }
                                        checked={
                                          filterChecked[`${ele?.id}${opt?.id}`]?.checked ===
                                          undefined
                                            ? false
                                            : filterChecked[`${ele?.id}${opt?.id}`]?.checked
                                        }
                                        style={{
                                          color: "#7f7d85",
                                          padding: 0,
                                          width: "10px",
                                        }}
                                        onClick={(e) =>
                                          handleCheckboxChange(
                                            e,
                                            ele?.id,
                                            opt?.Name
                                          )
                                        }
                                        size="small"
                                        />
                                      }
                                      
                                      // sx={{
                                      //   display: "flex",
                                      //   justifyContent: "space-between", // Adjust spacing between checkbox and label
                                      //   width: "100%",
                                      //   flexDirection: "row-reverse", // Align items to the right
                                      //   fontFamily:'TT Commons Regular'
                                      // }}
                                      className="smr_mui_checkbox_label"
                                      label={opt.Name}
                                      />
                                      
                                    </div>
                                  ))}
                                </AccordionDetails>
                              </Accordion>
                            )}
                          </>
                        ))}
                      </div>
                    </div>
                  </div>
                  {
                    filterProdListEmpty ? 
                    <div style={{display:'flex',justifyContent:'center',width:'75%',alignItems:'center',height:'500px'}}>
                      <span className="smr_prod_datanotfound">
                        Products Not found !!!
                      </span>
                    </div>
                    :
                    <div className="smr_productList">
                    {isOnlyProdLoading ? (
                      <ProductListSkeleton fromPage={"Prodlist"} />
                    ) : (
                      <div className="smr_outer_portion">
                      {/* <div className="smr_breadcums_port">{`${menuParams?.menuname || ''}${menuParams?.FilterVal1 ? ` > ${menuParams?.FilterVal1}` : ''}${menuParams?.FilterVal2 ? ` > ${menuParams?.FilterVal2}` : ''}`}</div> */}
                      <div className="smr_inner_portion">
                        {finalProductListData?.map((productData,i) => (
                          <div className="smr_productCard">
                            <div className="cart_and_wishlist_icon">
                              {/* <Button className="smr_cart-icon"> */}
                                <Checkbox
                                  icon={
                                    <LocalMallOutlinedIcon
                                      sx={{
                                        fontSize: "22px",
                                        color: "#7d7f85",
                                        opacity: ".7",
                                      }}
                                    />
                                  }
                                  checkedIcon={
                                    <LocalMallIcon
                                      sx={{
                                        fontSize: "22px",
                                        color: "#009500",
                                      }}
                                    />
                                  }
                                  disableRipple={false}
                                  sx={{ padding: "10px" }}

                                          onChange={(e) => handleCartandWish(e, productData, "Cart")}
                                          checked={cartArr[productData?.autocode] ?? productData?.IsInCart === 1 ? true : false}
                                        />
                                        {/* Object.values(cartArr)?.length > 0 ? cartArr[productData?.autocode] : */}
                                        {/* </Button> */}
                                        {/* <Button className="smr_wish-icon"> */}
                                        <Checkbox
                                          icon={
                                            <FavoriteBorderIcon
                                              sx={{
                                                fontSize: "22px",
                                                color: "#7d7f85",
                                                opacity: ".7",
                                              }}
                                            />
                                          }
                                          checkedIcon={
                                            <FavoriteIcon
                                              sx={{
                                                fontSize: "22px",
                                                color: "#e31b23",
                                              }}
                                            />
                                          }
                                          disableRipple={false}
                                          sx={{ padding: "10px" }}

                                          onChange={(e) => handleCartandWish(e, productData, "Wish")}
                                          // checked={productData?.IsInWish}
                                          checked={wishArr[productData?.autocode] ?? productData?.IsInWish === 1 ? true : false}
                                        // Object.values(wishArr)?.length > 0 ? wishArr[productData?.autocode] :
                                        // onChange={(e) => handelWishList(e, products)}
                                        />
                                        {/* </Button> */}
                                      </div>

                                      <div className="smr_product_label">
                                        {productData?.IsInReadyStock == 1 && <span className="smr_instock">In Stock</span>}
                                        {productData?.IsBestSeller == 1 && <span className="smr_bestSeller">Best Seller</span>}
                                        {productData?.IsTrending == 1 && <span className="smr_intrending">Trending</span>}
                                        {productData?.IsNewArrival == 1 && <span className="smr_newarrival">New Arrival</span>}
                                      </div>
                                      <img
                                        className="smr_productCard_Image"

                              id={`smr_productCard_Image${productData?.autocode}`}
                              // src={productData?.DefaultImageName !== "" ? storeInit?.DesignImageFol+productData?.DesignFolderName+'/'+storeInit?.ImgMe+'/'+productData?.DefaultImageName : imageNotFound}
                              // src={ ProdCardImageFunc(productData,0)}
                              src={productData?.images?.length > 0 ? productData?.images[0] :  imageNotFound}
                              alt=""
                              onClick={()=>handleMoveToDetail(productData)}
                              onMouseEnter={()=>{handleImgRollover(productData,i)}}
                            />
                            <div className="smr_prod_Title" >
                              <span
                                className={
                                  productData?.TitleLine?.length > 30
                                    ? "smr_prod_title_with_width"
                                    : "smr_prod_title_with_no_width"
                                }
                              >
                                {productData?.TitleLine}{" "}
                                {productData?.TitleLine?.length > 0 && "-"}
                              </span>
                              <span className="smr_prod_designno">
                                {productData?.designno}
                              </span>
                            </div>
                            <div className="smr_prod_Allwt">
                              <div style={{display:'flex',justifyContent:'center',alignItems:'center',letterSpacing:'1px',gap:'3px'}}> 
                              {/* <span className="smr_por"> */}
                                <span className="smr_prod_wt">
                                  <span className="smr_keys">NWT:</span>
                                  <span className="smr_val">
                                    {productData?.updNWT.toFixed(3)}
                                  </span>
                                </span>
                                { (storeInit?.IsGrossWeight == 1 && Number(productData?.updGWT.toFixed(3)) !== 0) &&
                                  <>
                                  <span>|</span>
                                <span className="smr_prod_wt">
                                  <span className="smr_keys">GWT:</span>
                                  <span className="smr_val">
                                    {productData?.updGWT.toFixed(3)}
                                  </span>
                                </span>
                                </>
                                }
                              {/* </span> */}
                              {/* <span className="smr_por"> */}
                               { (storeInit?.IsDiamondWeight == 1 && Number(productData?.updDWT.toFixed(3)) !== 0) &&
                               <>
                               <span>|</span>
                                <span className="smr_prod_wt">
                                  <span className="smr_keys">DWT:</span>
                                  <span className="smr_val">
                                    {productData?.updDWT.toFixed(3)}{storeInit?.IsDiamondPcs === 1 ? `/${productData?.updDPCS}` : null}
                                  </span>
                                </span>
                               </>
                                }

                                          {(storeInit?.IsStoneWeight == 1 && Number(productData?.updCWT.toFixed(3)) !== 0) &&
                                            <>
                                              <span>|</span>
                                              <span className="smr_prod_wt">
                                                <span className="smr_keys">CWT:</span>
                                                <span className="smr_val">
                                                  {productData?.updCWT.toFixed(3)}{storeInit?.IsStonePcs === 1 ? `/${productData?.updCPCS}` : null}
                                                </span>
                                              </span>
                                            </>
                                          }
                                          {/* </span> */}
                                        </div>
                                      </div>
                                      <div className="smr_prod_mtcolr_price">
                                        <span className="smr_prod_metal_col">
                                          {findMetalColor(
                                            productData?.MetalColorid
                                          )?.[0]?.metalcolorname.toUpperCase()}
                                          -
                                          {
                                            findMetalType(selectedMetalId ?? productData?.MetalPurityid)[0]
                                              ?.metaltype
                                          }
                                        </span>
                                        <span>/</span>
                                        <span className="smr_price">
                                          <span
                                            className="smr_currencyFont"
                                            dangerouslySetInnerHTML={{
                                              __html: decodeEntities(
                                                storeInit?.Currencysymbol
                                              ),
                                            }}
                                          />
                                          <span className="smr_pricePort">
                                            {productData?.ismrpbase === 1
                                              ? productData?.mrpbaseprice
                                              : PriceWithMarkupFunction(
                                                productData?.markup,
                                                productData?.price,
                                                storeInit?.CurrencyRate
                                              )?.toFixed(2)}
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>}
                    </div>
                  </>
                )}
            {( storeInit?.IsProductListPagination == 1  && Math.ceil(afterFilterCount / storeInit.PageSize) > 1) && <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "5%",
              }}
              className="smr_pagination_portion"
            >
              <Pagination
                count={Math.ceil(afterFilterCount / storeInit.PageSize)}
                size="large"
                shape="circular"
                onChange={handelPageChange}
                showFirstButtongit 
                showLastButton
              />
            </div>}
            <Footer fromPage={"ProdList"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
