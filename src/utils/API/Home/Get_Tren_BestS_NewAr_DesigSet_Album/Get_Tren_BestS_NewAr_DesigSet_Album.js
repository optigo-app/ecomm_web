import { CommonAPI } from "../../CommonAPI/CommonAPI";

export const Get_Tren_BestS_NewAr_DesigSet_Album = async (mode) => {
    let response;
    try {
        const storeInit = JSON.parse(localStorage.getItem("storeInit")) ?? ""
        const userData = JSON.parse(localStorage.getItem("loginUserDetail")) ?? ""
        let userLogin = localStorage.getItem('LoginUser')


        const combinedValue = JSON.stringify({
            "FrontEnd_RegNo": `${storeInit?.FrontEnd_RegNo}`,
            "Customerid": `${userData?.id ?? 0}`,
            "PackageId": `${storeInit?.PackageId}`,
            "Laboursetid": `${storeInit?.pricemanagement_laboursetid}`,
            "diamondpricelistname": `${storeInit?.diamondpricelistname}`,
            "colorstonepricelistname": `${storeInit?.colorstonepricelistname}`,
            "SettingPriceUniqueNo": `${storeInit?.SettingPriceUniqueNo}`,
            "Metalid": `${storeInit?.MetalId}`,
            "DiaQCid": `${storeInit?.cmboDiaQCid}`,
            "CsQCid": `${storeInit?.cmboCSQCid}`,
        })

        const combinedValueLogin = JSON.stringify({
            "FrontEnd_RegNo": `${storeInit?.FrontEnd_RegNo}`,
            "Customerid": `${userData?.id ?? 0}`,
            "PackageId": `${userData?.PackageId}`,
            "Laboursetid": `${userData?.pricemanagement_laboursetid}`,
            "diamondpricelistname": `${userData?._diamondpricelistname}`,
            "colorstonepricelistname": `${userData?.colorstonepricelistname}`,
            "SettingPriceUniqueNo": `${userData?._SettingPriceUniqueNo}`,
            "Metalid": `${userData?.MetalId}`,
            "DiaQCid": `${userData?.cmboDiaQCid}`,
            "CsQCid": `${userData?.cmboCSQCid}`,
        })



        const email = localStorage.getItem("registerEmail") ?? ""

        const body = {
            "con": `{\"id\":\"\",\"mode\":\"${mode}\",\"appuserid\":\"${email}\"}`,
            "f": "zen (cartcount)",
            "dp": userLogin ? combinedValueLogin : combinedValue,
        }
        response = await CommonAPI(body);

    } catch (error) {
        console.error('Error:', error);
    }

    return response;

}