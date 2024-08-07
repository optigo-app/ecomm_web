import React, { useEffect, useState } from 'react'
import './PaymentPage.modul.scss';
import { useNavigate } from 'react-router-dom';
import { OrderFlowCrumbs } from '../../Cart/OrderFlowCrumbs';
import CircularProgress from '@mui/material/CircularProgress';
import { handlePaymentAPI } from '../../../../../../utils/API/OrderFlow/PlaceOrderAPI';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { el_CartCount, el_loginState } from '../../../Recoil/atom';
import { GetCountAPI } from '../../../../../../utils/API/GetCount/GetCountAPI';
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import { Box } from '@mui/material';
import { storImagePath } from '../../../../../../utils/Glob_Functions/GlobalFunction';
import { fetchEstimateTax } from '../../../../../../utils/API/OrderFlow/GetTax';

const PaymentPage = () => {

    const [selectedAddrData, setSelectedAddrData] = useState();
    const [totalprice, setTotalPrice] = useState();
    const [totalPriceText, setTotalPriceText] = useState();
    // const [finalTotal, setFinalTotal] = useState();
    const [CurrencyData, setCurrencyData] = useState();
    const [isLoading, setIsloding] = useState(false);
    const [cartString, setCartString] = useState();
    const [taxAmmount, setTaxAmount] = useState();
    const islogin = useRecoilValue(el_loginState)
    const [finalTotal, setFinlTotal] = useState();

    const navigate = useNavigate();
    const handleBackButton = (e) => {
        e.preventDefault();
        navigate(-1)
    }

    const setCartCountVal = useSetRecoilState(el_CartCount);

    // useEffect(() => {
    //     const selectedAddressData = JSON.parse(localStorage.getItem('selectedAddressId'));
    //     console.log('selectedAddressData', selectedAddressData);
    //     setSelectedAddrData(selectedAddressData)

    //     const totalPriceData = JSON.parse(localStorage.getItem('totalProdPrice'));
    //     if (totalPriceData) {
    //         const totalPriceNum = parseFloat(totalPriceData?.total);
    //         const newPrice = totalPriceNum * 0.03;
    //         setTotalPriceText(newPrice.toFixed(0));
    //         setTotalPrice(totalPriceNum);
    //         const finalTotalPrice = totalPriceNum + newPrice;
    //         setFinalTotal(finalTotalPrice.toFixed(0));
    //     }
    // }, [])


    useEffect(() => {
        const fetchData = async () => {
            try {
                const texData = await fetchEstimateTax();
                if (texData) {
                    setTaxAmount(texData[0]?.TaxAmount);
                }
            } catch (error) {
                console.error("Error fetching tax data:", error);
            }

            const selectedAddressData = JSON.parse(
                localStorage.getItem("selectedAddressId")
            );
            console.log("selectedAddressData", selectedAddressData);
            setSelectedAddrData(selectedAddressData);

            const totalPriceData = JSON.parse(localStorage.getItem('totalProdPrice'))
            if (totalPriceData) {
                const totalPriceNum = parseFloat(totalPriceData?.total);
                console.log('totalPriceNum: ', totalPriceNum);
                const finalTotalPrice = totalPriceNum;
                setFinlTotal(finalTotalPrice);
            }
        };

        fetchData();
    }, []);



    // useEffect(() => {
    //     const getCartData = localStorage.getItem('iscartData');
    //     setCartString(getCartData)
    // }, [])

    useEffect(() => {
        const getCartData = localStorage.getItem('isCartData');
        console.log('getCartData: ', getCartData);
        const storeInit = JSON.parse(localStorage.getItem("storeInit"));
        const storedData = JSON.parse(localStorage.getItem("loginUserDetail"));
        if (storeInit?.IsB2BWebsite != 0) {
            setCurrencyData(storedData?.CurrencyCode)
        } else {
            setCurrencyData(storeInit?.CurrencyCode)
        }
    }, [])

    const decodeEntities = (html) => {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    const handlePay = async () => {
        const visiterId = Cookies.get('visiterId');
        setIsloding(true);
        const paymentResponse = await handlePaymentAPI(visiterId, islogin);
        console.log("paymentResponse", paymentResponse);
        if (paymentResponse?.Data?.rd[0]?.stat == 1) {
            let num = paymentResponse.Data?.rd[0]?.orderno
            localStorage.setItem('orderNumber', num);
            setIsloding(false);
            navigate('/Confirmation');
            localStorage.removeItem("orderRemark")

            GetCountAPI().then((res) => {
                console.log('responseCount', res);
                setCartCountVal(res?.cartcount)
            })

            if (cartString) {
                localStorage.removeItem("iscartData")
            }

        } else {
            toast.error('Something went wrong!')
        }

    }

    // browse our collection
    const handelMenu = () => {
        let menudata = JSON.parse(localStorage.getItem('menuparams'));
        if (menudata) {
            console.log('otherparamsUrl--', menudata);
            const queryParameters1 = [
                menudata?.FilterKey && `${menudata?.FilterVal}`,
                menudata?.FilterKey1 && `${menudata?.FilterVal1}`,
                menudata?.FilterKey2 && `${menudata?.FilterVal2}`,
            ].filter(Boolean).join('/');

            const queryParameters = [
                menudata?.FilterKey && `${menudata?.FilterVal}`,
                menudata?.FilterKey1 && `${menudata?.FilterVal1}`,
                menudata?.FilterKey2 && `${menudata?.FilterVal2}`,
            ].filter(Boolean).join(',');

            const otherparamUrl = Object.entries({
                b: menudata?.FilterKey,
                g: menudata?.FilterKey1,
                c: menudata?.FilterKey2,
            })
                .filter(([key, value]) => value !== undefined)
                .map(([key, value]) => value)
                .filter(Boolean)
                .join(',');

            // const paginationParam = [
            //   `page=${menudata.page ?? 1}`,
            //   `size=${menudata.size ?? 50}`
            // ].join('&');

            let menuEncoded = `${queryParameters}/${otherparamUrl}`;
            const url = `/p/${menudata?.menuname}/${queryParameters1}/?M=${btoa(
                menuEncoded
            )}`;
            navigate(url)
        } else {
            navigate("/")
        }
    }
    return (
        <>
            <>
                {isLoading && (
                    <div style={{
                        width: " 100%",
                        height: "100%",
                        position: "fixed",
                        zIndex: '100',
                        background: '#83838333',
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', }}>
                            <CircularProgress sx={{ color: '#2e2d2d' }} />
                        </Box>
                    </div>
                )}
                <div className="elv_payment_Main_div">
                    <div className="elv_payment_lists_div">
                        <div className="elv_payment_lists_header">
                            <div className="elv_payment_lists_header_breadcrumb">
                                <div className="elv_payment_lists_name">
                                    <div className="elv_payment_details">
                                        <span className="elv_payment_details_1">
                                            payment
                                            {/* <OrderFlowCrumbs param1={"My cart"} param2={'delivery'} param3={'payment'} /> */}
                                        </span>
                                    </div>
                                </div>
                                <div className="elv_payment_lists_header_logo">
                                    <span>
                                        <p className="elv_payment_ptitle">
                                            <img
                                                className="elv_payment_logo"
                                                src={`${storImagePath()}/images/HomePage/MainBanner/featuresImage.png`}
                                                alt="Logo"
                                            />
                                        </p>
                                    </span>
                                </div>
                            </div>
                            <div className="elv_filteration_block_div">
                                <div className="elv_payblock_rows">
                                    <div className="elv_payblock_rows_1" onClick={handleBackButton}>
                                        <span className="elv_back_title" >
                                            <span>Back</span>
                                        </span>
                                    </div>
                                    {/* {cartString ? (
                                        <> */}
                                    <div className="elv_payblock_rows_2" >

                                    </div>
                                    <div className="elv_payblock_rows_3" >

                                    </div>
                                    <div className="elv_payblock_rows_4" >

                                    </div>
                                    <div className="elv_payblock_rows_5" onClick={handlePay}>
                                        <span className="elv_continue_title">
                                            continue
                                        </span>
                                    </div>
                                    {/* </>
                                    ) : ('')} */}

                                </div>
                            </div>
                            {/* {cartString ? (
                                <> */}
                            <div className='elv_PaymentContainer'>
                                <div className='elv_paymentDetailMainDiv'>
                                    <div className='elv_paymentDetailLeftSideContent'>
                                        <h2 style={{ marginBottom: '3rem' }}>Payment Card Method</h2>
                                        <div className='elv_billingAddress'>
                                            <h3>Billing Address  :</h3>
                                            <div className='elv_billAdd_text'>
                                                <p className='elv_bill_add_text'>Name : {selectedAddrData?.shippingfirstname} {selectedAddrData?.shippinglastname}</p>
                                                <p className='elv_bill_add_text'>Address : {selectedAddrData?.street}</p>
                                                <p className='elv_bill_add_text'>City : {selectedAddrData?.city}</p>
                                                <p className='elv_bill_add_text'>State : {selectedAddrData?.state},{selectedAddrData?.country}</p>
                                                <p className='elv_bill_add_text'>Mobile : {selectedAddrData?.shippingmobile}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='elv_paymentDetailRightSideContent'>
                                        <h3>Order Summary</h3>
                                        <div className='elv_payment_div'>
                                            <div className='elv_paymenttotalpricesummary'>
                                                <p className='elv_payment_total_title'>Subtotal</p>
                                                <p>
                                                    <span
                                                        className="elv_currencyFont"
                                                        style={{ paddingRight: '2.5px' }}
                                                        dangerouslySetInnerHTML={{
                                                            __html: decodeEntities(
                                                                CurrencyData
                                                            ),
                                                        }}
                                                    />
                                                    <span className='elv_subtotal_price'> {finalTotal}</span>
                                                </p>
                                            </div>
                                            <div className='elv_paymenttotalpricesummary'>
                                                <p className='elv_payment_total_title'>Estimated Tax</p>
                                                <p>
                                                    <span
                                                        className="elv_currencyFont"
                                                        style={{ paddingRight: '2.5px' }}
                                                        dangerouslySetInnerHTML={{
                                                            __html: decodeEntities(
                                                                CurrencyData
                                                            ),
                                                        }}
                                                    />
                                                    <span className='elv_estimate_tax'> {taxAmmount}</span>
                                                </p>
                                            </div>
                                            <div className='elv_payment_total_border'></div>
                                            <div className='elv_paymenttotalpricesummary'>
                                                <p className='elv_payment_total_title'>Estimated Total</p>
                                                <p>
                                                    <span
                                                        className="elv_currencyFont"
                                                        style={{ paddingRight: '2.5px' }}
                                                        dangerouslySetInnerHTML={{
                                                            __html: decodeEntities(
                                                                CurrencyData
                                                            ),
                                                        }}
                                                    />
                                                    <span className='elv_estimate_total'> {(taxAmmount + finalTotal)}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className='elv_shippingAddress'>
                                            <h3 className='elv_payment_shipp_title'>Shipping Address : </h3>
                                            <p className='elv_paymentUserName'>{selectedAddrData?.shippingfirstname} {selectedAddrData?.shippinglastname}</p>
                                            <p>{selectedAddrData?.street}</p>
                                            <p>{selectedAddrData?.city}-{selectedAddrData?.zip}</p>
                                            <p>{selectedAddrData?.state}</p>
                                            <p>{selectedAddrData?.shippingmobile}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='elv_paymentButtonDiv'>
                                    {/* <button className='elv_payOnAccountBtn' onClick={handlePay} disabled={isloding}>
                                    {isloding ? 'LOADING...' : 'PAY ON ACCOUNT'}
                                    {isloding && <span className="loader"></span>}
                                </button> */}
                                </div>
                            </div>
                            {/* </>
                            ) : */}
                            {/* <div className='elv_noCartlistData'>
                                <p className='elv_title'>No Data Found!</p>
                                <p className='elv_desc'>Please First Add Product in Cart</p>
                                <button className='elv_browseOurCollectionbtn' onClick={handelMenu}>Browse our collection</button>
                            </div> */}
                            {/* } */}

                        </div>

                    </div>
                </div>
            </>

        </>
    )
}

export default PaymentPage