



import { CommonAPI } from "../CommonAPI/CommonAPI";


export const CurrencyComboAPI = async (finalID) => {
    let response;
    try {
        const storedEmail = localStorage.getItem('registerEmail') || '';
        const storeInit = JSON.parse(localStorage.getItem('storeInit'));
        const loginUserDetail = JSON.parse(localStorage.getItem('loginUserDetail')) || '0';
        const { FrontEnd_RegNo } = storeInit;
        const combinedValue = JSON.stringify({
            FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: `${finalID}`
        });

        const encodedCombinedValue = btoa(combinedValue);
        let body = {
            "con": `{\"id\":\"Store\",\"mode\":\"CURRENCYCOMBO\",\"appuserid\":\"${storedEmail}\"}`,
            "f": "on-index(home)-call (CURRENCYCOMBO)",
            "p": encodedCombinedValue,
            "dp": combinedValue,

        }
        
        response = await CommonAPI(body);

    } catch (error) {
        console.error('Error:', error);
    }
    return response;

}