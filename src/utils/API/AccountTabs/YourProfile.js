import { CommonAPI } from "../CommonAPI/CommonAPI";

export const saveEditProfile = async(editedUserData, data, FrontEnd_RegNo) => {
    try {
        
        const combinedValue = JSON.stringify({
        firstname: `${editedUserData.defaddress_shippingfirstname}`, 
        lastname: `${editedUserData.defaddress_shippinglastname}`, 
        street: `${editedUserData.defaddress_state}`, 
        addressprofile: `${editedUserData.defaddress_shippingfirstname + ' ' + editedUserData.defaddress_shippinglastname}`, 
        city: `${editedUserData.city}`, 
        state: `${editedUserData.state}`, 
        country: `${editedUserData.defaddress_country}`, 
        zip: `${editedUserData.defaddress_zip}`, 
        mobileno: `${editedUserData.defaddress_shippingmobile}`, 
        FrontEnd_RegNo: `${FrontEnd_RegNo}`, 
        Customerid: `${editedUserData.id}`
    });
    
    const encodedCombinedValue = btoa(combinedValue);
    const body = {
        "con": `{\"id\":\"\",\"mode\":\"EDITPROFILE\",\"appuserid\":\"${data?.userid}\"}`,
        "f": "YourProfile (EditProfile)",
        p: encodedCombinedValue,
        dp: combinedValue,
    };
    const response = await CommonAPI(body);
    return response;

    } catch (error) {
        console.log(error);    
    }

}