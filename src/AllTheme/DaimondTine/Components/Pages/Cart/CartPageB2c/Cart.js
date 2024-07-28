import React, { useEffect, useState } from 'react';
import useCart from '../../../../../../utils/Glob_Functions/Cart_Wishlist/Cart';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import "./dt_cartPageB2c.scss"
import CartItem from './CartItem';
import { dt_loginState } from '../../../Recoil/atom';

function Cart(props) {
  const {
    isloding,
    ispriceloding,
    cartData,
    selectedItem,
    selectedItems,
    multiSelect,
    openModal,
    showRemark,
    productRemark,
    qtyCount,
    sizeCombo,
    CurrencyData,
    countData,
    mrpbasedPriceFlag,
    openMobileModal,
    handlecloseMobileModal,
    CartCardImageFunc,
    handleSelectItem,
    handleIncrement,
    handleDecrement,
    handleMultiSelectToggle,
    handleOpenModal,
    handleCloseModal,
    handleRemarkChange,
    handleSave,
    handleCancel,
    handleAddReamrk,
    handleRemoveItem,
    handleRemoveAll,
    handleUpdateCart,
    handleCancelUpdateCart,
    handleMetalTypeChange,
    handleMetalColorChange,
    handleDiamondChange,
    handleColorStoneChange,
    handleSizeChange,
    decodeEntities,
    handleMoveToDetail,
    handelMenu
  } = useCart();

  const islogin = useRecoilValue(dt_loginState);
  const [storeInitData, setStoreInitData] = useState();
  const navigate = useNavigate();
  const loginInfo = JSON.parse(localStorage.getItem("loginUserDetail"));
  const [totalPrice, setTotalPrice] = useState();

  useEffect(() => {
    const storeinitData = JSON.parse(localStorage.getItem('storeInit'));
    setStoreInitData(storeinitData)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (cartData) {
        let priceData = cartData?.reduce((total, item) => total + item?.FinalCost, 0);
        setTotalPrice(priceData)
      }
    }, 300);
  }, [])

  const handlePlaceOrder = () => {
    let storeInit = JSON.parse(localStorage.getItem("storeInit"));
    if (storeInit?.IsB2BWebsite == 0 && islogin == false) {
      navigate('/LoginOption')
    } else {
      navigate("/Delivery")
      let priceData = cartData?.reduce((total, item) => total + item?.FinalCost, 0);
      localStorage.setItem('TotalPriceData', priceData)
    }
    window.scrollTo(0, 0);
  }


  return (
    <div className='dt_MainCartDiv'>
      <div
        className="bg-imageCart"
        style={{
          backgroundImage:
            'url("https://cdnfs.optigoapps.com/content-global3/diamondtin5643NL1BPEHKUDJMT/diamondtin/images/HomePage/MainBanner/Images/TopBanner1.png")'
        }}
      >
        <div className="overlay" />
        <div className="text-container">
          <div className="textContainerData">
            <div style={{ textAlign: "center" }}>
              <p
                className="designCounttext"
                style={{
                  fontSize: 30,
                  fontWeight: 400,
                  letterSpacing: 1,
                  textTransform: "capitalize"
                }}
              >
                Shopping Cart <br />
              </p>
              <span style={{ color: "rgb(175, 133, 56)", fontSize: 18 }}>Shop</span>
            </div>
          </div>
        </div>
      </div>

      {cartData?.length != 0 ? (
        <div className="cart">
          <div className="cart-items">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cartData.map(item => (
                  <CartItem
                    key={item.id}
                    cartData={item}
                    isloding={isloding}
                    qtyCount={qtyCount}
                    CurrencyData={CurrencyData}
                    CartCardImageFunc={CartCardImageFunc}
                    decodeEntities={decodeEntities}
                    handleIncrement={handleIncrement}
                    handleDecrement={handleDecrement}
                    onRemoveItem={handleRemoveItem}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="cart-totals">
            <div className="card-body">
              <h5 className="card-title">Card totals</h5>
              <hr className="border-line" />

              <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                <p className="card-subtitle">Subtotal</p>
                <p className="card-subtitle" style={{ fontWeight: "500", fontSize: "18px" }}>
                  <span style={{ fontFamily: "sans-serif" }}>
                    {decodeEntities(CurrencyData?.Currencysymbol)}
                  </span>
                  {cartData.reduce((total, product) => total + parseFloat(product?.FinalUnitCost || 0), 0).toFixed(2)}
                </p>
              </div>

              <hr className="border-lines" />

              <div>
                <p className="">Shipping</p>
                <p className="addinfotext">Free Shipping</p>
                <p className="addinfotext">Shipping to <span style={{ color: 'black', fontWeight: '500' }}>Delhi</span><br />
                  Estimate for Your Country
                </p>
                {(storeInitData?.IsB2BWebsite == 1 && (islogin == "false" || islogin == "f")) &&
                  <a href="/Delivery" class="btn btn-link addressLink" role="button">Change address</a>
                }
              </div>

              <hr className="border-lines" />

              <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                <p className="card-total">Total</p>
                <p className="card-total" style={{ fontWeight: "500", fontSize: "18px" }}>
                  {storeInitData?.IsPriceShow == 1 &&
                    <span>
                      {loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode}
                      {" "}{totalPrice}
                    </span>

                  }
                </p>
              </div>

              {/* <div>
                        <h4>Have a gift card?</h4>
                        <div>
                          <input style={{ width: '100%', border: '1px solid rgb(239 239 239)', padding: '10px', background: '#f9f9f9' }} type="text" placeholder="Enter your code..." />
                          <div>
                            <button style={{ border: '1px solid #a5a5a5', padding: '5px' }}>Apply</button>
                          </div>
                        </div>
                      </div> */}
              <div className="btn-checkout my-3">
                <button className="CheckoutBtn" onClick={handlePlaceOrder}>PROCEED TO CHECKOUT</button>
              </div>
            </div>
          </div>
        </div>
      ) :
        <div>
          <div style={{ display: "flex", flexDirection: "column", marginInline: "20%" }}>
            <p
              className="my-5"
              style={{
                fontSize: 16,
                fontWeight: 500,
                border: "1px dashed rgb(217, 217, 217)",
                width: "100%",
                padding: 10,
                color: "rgb(167, 167, 167)"
              }}
            >
              Your cart is currently empty.
            </p>
            <button className="dt_browseBtnMore">Return to Shop</button>
          </div>

        </div>
      }
    </div>
  );
}

export default Cart;
