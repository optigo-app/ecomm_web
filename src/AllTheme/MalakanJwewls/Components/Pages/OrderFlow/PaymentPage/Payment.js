import React, { useEffect, useState } from 'react';
import "./Payment.scss";
import { IoMdArrowRoundBack } from "react-icons/io";
import Footer from '../../Home/Footer/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { handlePaymentAPI } from '../../../../../../utils/API/OrderFlow/PlaceOrderAPI';
import { GetCountAPI } from '../../../../../../utils/API/GetCount/GetCountAPI';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import OrderRemarkModal from '../OrderRemark/OrderRemark';
import { handleOrderRemark } from '../../../../../../utils/API/OrderRemarkAPI/OrderRemarkAPI';
import Cookies from "js-cookie";
import { fetchEstimateTax } from '../../../../../../utils/API/OrderFlow/GetTax';
import { formatter } from '../../../../../../utils/Glob_Functions/GlobalFunction';
import { mala_CartCount, mala_loginState } from '../../../Recoil/atom';

const Payment = () => {
    const [isloding, setIsloding] = useState(false);
    const navigate = useNavigate();
    const [selectedAddrData, setSelectedAddrData] = useState();
    const [totalprice, setTotalPrice] = useState();
    const [totalpriceText, setTotalPriceText] = useState();
    const [finalTotal, setFinlTotal] = useState();
    const [CurrencyData, setCurrencyData] = useState();
    const [taxAmmount, setTaxAmount] = useState();

    const setCartCountVal = useSetRecoilState(mala_CartCount);

    const [open, setOpen] = useState(false);
    const [orderRemark, setOrderRemark] = useState();
    const [orderRemakdata, setOrderRemarkData] = useState();
    const islogin = useRecoilValue(mala_loginState)

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleRemarkChangeInternal = (e) => {
        setOrderRemark(e.target.value);
    };

    // const handleSaveInternal = () => {
    //     handleOrderRemarkFun(orderRemark);
    //     handleClose();
    // };

    
    const handleSaveInternal = () => {
        const trimmedRemark = orderRemark.trim();
    
        if (trimmedRemark && trimmedRemark !== "null") {
            handleOrderRemarkFun(trimmedRemark);
            handleClose();
        } else {
            toast.info("Please add a remark first!");
        }        
    };

    console.log('orderreamrk', orderRemark);

    const loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
    const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));

    useEffect(() => {
        const orderRemakdata = sessionStorage.getItem("orderRemark");
        const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
        const storedData = JSON.parse(sessionStorage.getItem("loginUserDetail"));
        setOrderRemarkData(orderRemakdata);
        if (storeInit?.IsB2BWebsite != 0) {
            setCurrencyData(storedData?.Currencysymbol)
        } else {
            setCurrencyData(storeInit?.Currencysymbol)
        }
    }, [])

    const handleBackNavigate = () => {
        navigate(-1);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const texData = await fetchEstimateTax();
                if (texData) {
                    setTaxAmount(texData[0]?.TaxAmount);
                }
            } catch (error) {
                console.error('Error fetching tax data:', error);
            }

            const selectedAddressData = JSON.parse(sessionStorage.getItem('selectedAddressId'));
            console.log('selectedAddressData', selectedAddressData);
            setSelectedAddrData(selectedAddressData);

            const totalPriceData = sessionStorage.getItem('TotalPriceData');
            if (totalPriceData) {
                const totalPriceNum = parseFloat(totalPriceData);
                const finalTotalPrice = totalPriceNum;
                setFinlTotal(finalTotalPrice);
            }
        };

        fetchData();
    }, []);


    const handlePay = async () => {
        const visiterId = Cookies.get('visiterId');
        setIsloding(true);
        const paymentResponse = await handlePaymentAPI(visiterId, islogin);
        console.log("paymentResponse", paymentResponse);
        if (paymentResponse?.Data?.rd[0]?.stat == 1) {
            let num = paymentResponse.Data?.rd[0]?.orderno
            sessionStorage.setItem('orderNumber', num);
            navigate('/Confirmation');
            setIsloding(false);
            sessionStorage.removeItem("orderRemark")

            GetCountAPI().then((res) => {
                console.log('responseCount', res);
                setCartCountVal(res?.cartcount)
            })

        } else {
            toast.error('Something went wrong!')
        }
    }

    const handleOrderRemarkChange = () => {

    }
    const handleOrderRemarkFun = async (trimmedRemark) => {
        try {
            const response = await handleOrderRemark(trimmedRemark);
            let resStatus = response?.Data?.rd[0]
            if (resStatus?.stat == 1) {
                // const updatedCartData = cartData.map(cart =>
                //     cart.id == data.id ? { ...cart, Remarks: resStatus?.design_remark } : cart
                // );
                setOrderRemarkData(resStatus?.orderremarks)
                sessionStorage.setItem('orderRemark', trimmedRemark)
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }


    const decodeEntities = (html) => {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    return (
        <div className='stam_paymentMainDiv'>
            <div className='mala_paymentSecondMainDiv'>
                <div className='mala_PaymentContainer'>
                    <div className='mala_paymentBackbtnDiv'>
                        <IoMdArrowRoundBack className='mala_paymentBackbtn' onClick={handleBackNavigate} />
                        <Link
                            className="mala_addorderRemarkbtn"
                            variant="body2"
                            onClick={handleOpen}
                        >
                            {orderRemakdata == "" ? "Add order Remark" : "Update order Remark"}
                        </Link>
                    </div>
                    <div className='mala_paymentDetailMainDiv'>
                        <div className='mala_paymentDetailLeftSideContent'>
                            <h2>Payment Card Method</h2>
                            <div className='mala_billingAddress'>
                                <h3>Billing Address</h3>
                                <p>Name : {selectedAddrData?.shippingfirstname} {selectedAddrData?.shippinglastname}</p>
                                <p>Address : {selectedAddrData?.street}</p>
                                <p>City : {selectedAddrData?.city}</p>
                                <p>State : {selectedAddrData?.state}</p>
                                <p>Mobile : {selectedAddrData?.shippingmobile}</p>
                                <p className='mala_orderRemakrPtag' style={{ maxWidth: '400px', wordWrap: 'break-word' }}>
                                    Order Remark : {orderRemakdata}
                                </p>
        
                            </div>
                        </div>
                        <div className='mala_paymentDetailRightSideContent'>
                            <h3>Order Summary</h3>
                            {/* <div className='mala_paymenttotalpricesummary'>
                                <p>Subtotal</p>
                                <p className='mala_PriceTotalTx'>
                                    <span className="mala_currencyFont">
                                        {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                                    </span>&nbsp;

                                    <span>{formatter(finalTotal)}</span>
                                </p>
                            </div>
                            <div className='mala_paymenttotalpricesummary'>
                                <p>Estimated Tax</p>
                                <p className='mala_PriceTotalTx'>
                                    <span className="mala_currencyFont">
                                        {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                                    </span>&nbsp;
                                    <span>{formatter(Number((taxAmmount)?.toFixed(3)))}</span>
                                </p>
                            </div>
                            <div className='mala_paymenttotalpricesummary'>
                                <p>Estimated Total</p>
                                <p className='mala_PriceTotalTx'>
                                    <span className="mala_currencyFont">
                                        {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                                    </span>&nbsp;
                                    <span>{formatter(Number((taxAmmount + finalTotal)?.toFixed(3)))}</span>
                                </p>
                            </div> */}

                            <div class="mala_order-summary">
                                <div class="mala_summary-item">
                                    <div class="mala_label">Subtotal</div>
                                    <div class="mala_value">
                                        <span className="mala_currencyFont">
                                            {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                                        </span>&nbsp;
                                        <span>{formatter(finalTotal)}</span>
                                    </div>
                                </div>
                                <div class="mala_summary-item">
                                    <div class="mala_label">Estimated Tax</div>
                                    <div class="mala_value">
                                        <span className="mala_currencyFont">
                                            {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                                        </span>&nbsp;
                                        <span>{formatter(Number((taxAmmount)?.toFixed(3)))}</span>
                                    </div>
                                </div>
                                <div class="mala_summary-item">
                                    <div class="mala_label">Estimated Total</div>
                                    <div class="mala_value">
                                        <span className="mala_currencyFont">
                                            {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                                        </span>&nbsp;
                                        <span>{formatter(Number((taxAmmount + finalTotal)?.toFixed(3)))}</span>
                                    </div>
                                </div>
                            </div>

                            <div className='mala_shippingAddress'>
                                <h3>Shipping Address</h3>
                                <p className='mala_paymentUserName'>{selectedAddrData?.shippingfirstname} {selectedAddrData?.shippinglastname}</p>
                                <p>{selectedAddrData?.street}</p>
                                <p>{selectedAddrData?.city}-{selectedAddrData?.zip}</p>
                                <p>{selectedAddrData?.state}</p>
                                <p>{selectedAddrData?.shippingmobile}</p>
                            </div>
                        </div>
                    </div>
                    <div className='mala_paymentButtonDiv'>
                        <button className='mala_payOnAccountBtn' onClick={handlePay} disabled={isloding}>
                            {isloding ? 'LOADING...' : 'PAY ON ACCOUNT'}
                            {isloding && <span className="loader"></span>}
                        </button>
                    </div>
                </div>
                <OrderRemarkModal
                    open={open}
                    onClose={handleClose}
                    remark={orderRemark}
                    onRemarkChange={handleRemarkChangeInternal}
                    onSave={handleSaveInternal}
                />
            </div>
        </div>
    )
}

export default Payment;