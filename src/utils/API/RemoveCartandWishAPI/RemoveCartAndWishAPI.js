import { CommonAPI } from "../CommonAPI/CommonAPI";

export const RemoveCartAndWishAPI = async(type,autocode,visiterId,isFromStock = false) => {

    const UserEmail = localStorage.getItem("registerEmail");
    const storeInit = JSON.parse(localStorage.getItem("storeInit"));
    const loginUserDetail = JSON.parse(localStorage.getItem("loginUserDetail"));

    const islogin = JSON.parse(localStorage.getItem("LoginUser")) ?? false;

    const customerId = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null  ? visiterId : loginUserDetail.id ?? 0;
    const customerEmail = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null  ? visiterId : loginUserDetail?.userid ?? "";

  let removeApiObj = {
    "ForEvt": `${type}`,
    "FrontEnd_RegNo": `${storeInit?.FrontEnd_RegNo}`,
    "Customerid": `${customerId ?? 0}`,
    "autocode": `${autocode}`,
    // "StockId":`${}`,
    "Cartidlist": "",
    "isdelete_all": 0,
  }
  let removeApiObj1 = {
    "ForEvt": `${type}`,
    "FrontEnd_RegNo": `${storeInit?.FrontEnd_RegNo}`,
    "Customerid": `${customerId ?? 0}`,
    // "autocode": `${autocode}`,
    "StockId":`${autocode}`,
    "Cartidlist": "",
    "isdelete_all": 0,
  }

  let DataObj = isFromStock == true ? removeApiObj1 : removeApiObj

  let body = {
    con: `{\"id\":\"Store\",\"mode\":\"removeFromCartList\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
    f: " (removeFromCartList)",
    p: btoa(DataObj),
    dp: JSON.stringify(DataObj),
  };

  let cartAndWishResp;
    await CommonAPI(body).then((res) => {
        cartAndWishResp =  res;
    });

    return cartAndWishResp;
};

// {
//     "ForEvt": "Cart",
//     "FrontEnd_RegNo": "80kgizbiduw5e7gg",
//     "Customerid": 17286,
//     "autocode": "00125873",
//     "Cartidlist": "",
//     "isdelete_all": 0
// }
