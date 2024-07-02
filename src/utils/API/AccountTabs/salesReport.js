import { CommonAPI } from "../CommonAPI/CommonAPI";

export const getSalesReportData = async(currencyRate, FrontEnd_RegNo, customerid, data) => {
    try {
        const combinedValue = JSON.stringify({
            CurrencyRate: "1",
            FrontEnd_RegNo: `${FrontEnd_RegNo}`,
            Customerid: `${customerid}`,
          });
          const encodedCombinedValue = btoa(combinedValue);
          const encodedCombinedValue2 = (combinedValue);
          const body = {
            con: `{\"id\":\"Store\",\"mode\":\"getsalereport\",\"appuserid\":\"${data.email1}\"}`,
            f: "zen (cartcount)",
            p: encodedCombinedValue,
            dp: encodedCombinedValue2,
          };
          const response = await CommonAPI(body);
          return response;
    } catch (error) {
        console.log(error);
    }   
}