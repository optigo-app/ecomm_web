import { CommonAPI } from "../CommonAPI/CommonAPI";

export const handleProductRemark = async (data, remarks, visiterId, islogin) => {
    try {
        const storeInit = JSON.parse(localStorage.getItem("storeInit")) || {};
        const { FrontEnd_RegNo } = storeInit;

        const storedData = localStorage.getItem("loginUserDetail");
        const loginUserDetail = JSON.parse(storedData);

        const customerId = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null  ? visiterId : loginUserDetail?.id ?? 0;
        const customerEmail = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null  ? visiterId : loginUserDetail?.userid ?? 0;

        const combinedValue = {
            CartId: `${data?.id}`,
            autocode: data.autocode,
            remarks: remarks,
            FrontEnd_RegNo: FrontEnd_RegNo,
            Customerid: customerId ?? 0,
        };

        const encodedCombinedValue = btoa(JSON.stringify(combinedValue));
        
        const body = {
            "con": `{\"id\":\"\",\"mode\":\"SAVEDESIGNREMARK\",\"appuserid\":\"${customerEmail ?? ''}\"}`,
            f: "Header (handleSingleRemarksSubmit)",
            p: encodedCombinedValue,
            dp:JSON.stringify(combinedValue),
        };

        const response = await CommonAPI(body);

        if (response?.Data?.rd[0]?.stat === 1) {
            return response;
        } else {
            throw new Error("Error: Failed to save design remark.");
        }
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};
