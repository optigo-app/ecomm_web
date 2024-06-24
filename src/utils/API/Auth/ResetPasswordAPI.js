import { CommonAPI } from "../CommonAPI/CommonAPI";


export const ResetPasswordAPI = async ( email, hashedPassword) => {
    let response;

    try {

        const storeInit = JSON.parse(localStorage.getItem('storeInit'));
        const { FrontEnd_RegNo } = storeInit;
        const combinedValue = JSON.stringify({
            // userid: 'xoraxor802@fryshare.com', pass: `${hashedPassword}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: '0'
            userid: `${email}`, pass: `${hashedPassword}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: '0'
        });

        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            "con": `{\"id\":\"\",\"mode\":\"resetpassword\",\"appuserid\":\"${email}\"}`,
            "f": "ForgotPassword (handleSubmit)",
            "p": encodedCombinedValue
        }
        response = await CommonAPI(body);
    } catch (error) {
        console.error('Error:', error);
    }
    return response;
}