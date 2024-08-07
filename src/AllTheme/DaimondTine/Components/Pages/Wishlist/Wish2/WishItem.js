import React, { useEffect, useState } from 'react';
import "./dt_wishPageB2c.scss"
import noImageFound from "../../../Assets/image-not-found.jpg"
import { dt_CartCount, dt_WishCount } from '../../../Recoil/atom';
import { useSetRecoilState } from 'recoil';
import Cookies from "js-cookie";
import { GetCountAPI } from '../../../../../../utils/API/GetCount/GetCountAPI';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { formatter } from '../../../../../../utils/Glob_Functions/GlobalFunction';

const WishItem = ({
    item,
    itemInCart,
    updateCount,
    countDataUpdted,
    itemsLength,
    currency,
    decodeEntities,
    CartCardImageFunc,
    handleRemoveItem,
    handleWishlistToCart,
    handleMoveToDetail
}) => {

    const [storeInitData, setStoreInitData] = useState();
    const setWishlistCount = useSetRecoilState(dt_WishCount);
    const setCartCount = useSetRecoilState(dt_CartCount);
    const visiterId = Cookies.get('visiterId');
    const loginInfo = JSON.parse(localStorage.getItem("loginUserDetail"));

    useEffect(() => {
        const storeinitData = JSON.parse(localStorage.getItem('storeInit'));
        setStoreInitData(storeinitData)
    }, [])

    const handleWishlistToCartFun = async (item) => {
        const returnValue = await handleWishlistToCart(item);
        if (returnValue?.msg == "success") {
            toast.success("Wishlist items added in cart")
            GetCountAPI(visiterId).then((res) => {
                setCartCount(res?.cartcount);
            });
        }
    };

    const handleRemoveitem = async (item) => {
        const returnValue = await handleRemoveItem(item);
        if (returnValue?.msg == "success") {
            GetCountAPI(visiterId).then((res) => {
                setWishlistCount(res?.wishcount);
            })
        }
    };

    return (
        <tr>
            <td className="product" onClick={() => handleMoveToDetail(item)}>
                <img
                    src={item?.ImageCount !== 0 ? CartCardImageFunc(item) : noImageFound}
                    alt={item?.name}
                />
                 <div className="product-details">
                    <p>{item?.TitleLine}</p>
                </div>
            </td>
            <td className="price">
                {storeInitData?.IsPriceShow == 1 &&
                    <span>
                        <span
                            className="smr_currencyFont"
                        >
                            {loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode}
                        </span>
                        {" "}{formatter(item?.UnitCostWithMarkUp)}
                    </span>
                }
            </td>
            <td className="total">
                <div className='dt_Wl-CartbtnDiv'>
                    <button className='dt_Wl-Cartbtn' onClick={() => handleWishlistToCartFun(item)}>
                        {(item?.IsInCart != 1 ? "Add to cart +" : "in cart")}
                    </button>

                </div>
            </td>
            <td className="remove">
                <IconButton onClick={() => handleRemoveitem(item)}>
                    <CloseIcon />
                </IconButton>
            </td>
        </tr>
    );
};

export default WishItem;
