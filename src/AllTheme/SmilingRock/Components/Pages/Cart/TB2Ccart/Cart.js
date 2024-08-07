import React, { useEffect, useState } from 'react';
import useCart from '../../../../../../utils/Glob_Functions/Cart_Wishlist/Cart';
import CartList from './CartList';
import './smr2_cartb2c.scss';
import Footer from '../../Home/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';
import ConfirmationDialog from '../../ConfirmationDialog.js/ConfirmationDialog';
import { CartCount, loginState } from '../../../Recoil/atom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { GetCountAPI } from '../../../../../../utils/API/GetCount/GetCountAPI';
import Cookies from "js-cookie";

const CartPage = () => {
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
    handleMoveToDetail
  } = useCart();

  const navigate = useNavigate();

  const setCartCountVal = useSetRecoilState(CartCount)

  const handlePlaceOrder = () => {
    let priceData = cartData.reduce((total, item) => total + item.UnitCostWithmarkup, 0).toFixed(2)
    localStorage.setItem('TotalPriceData', priceData)
    navigate("/Delivery")
    window.scrollTo(0, 0);
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  const [dialogOpen, setDialogOpen] = useState(false);
  const [countstatus, setCountStatus] = useState();
  const visiterId = Cookies.get('visiterId');
  const islogin = useRecoilValue(loginState)

  useEffect(() => {
    const iswishUpdateStatus = localStorage.getItem('cartUpdation');
    setCountStatus(iswishUpdateStatus)
  }, [handleRemoveItem, handleRemoveAll])

  const handleRemoveAllDialog = () => {
    setDialogOpen(true);
  };

  const handleConfirmRemoveAll = () => {
    setDialogOpen(false);
    handleRemoveAll();
    setTimeout(() => {
      if (countstatus) {
        GetCountAPI(visiterId, islogin).then((res) => {
          console.log('responseCount', res);
          setCartCountVal(res?.cartcount);
        })
      }
    }, 500)
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };



  console.log('selected--', selectedItem);
  return (
    <div className='smr2_MainB2cBGDiv'>
      <div className='cartMainb2cPageDiv'>
        <div className="cartB2cBtnGroupMainDiv">
          <div className="smr2_B2ccart-title">My Cart</div>
          {!isloding && cartData.length != 0 &&
            <>
              <div className="smr2_B2ccartButton-group">
                <Link className='smr2_B2cReomoveAllCartbtn' href="#" variant="body2" onClick={handleRemoveAllDialog} >
                  Clear All
                </Link>
                <div className='smr2_b2cplaceOrderMobileMainbtnDiv'>
                  <button className="smr2_B2cplace-order-btnMobile" onClick={handlePlaceOrder}>Place Order</button>
                </div>
              </div>
              {/* <div className='smr2_B2cplaceOrderMainbtnDiv'>
                <button className="smr2_B2cplace-order-btn" onClick={handlePlaceOrder}>Place Order</button>
              </div> */}
            </>
          }
        </div>
        {!isloding ? (
          <>
            {cartData.length !== 0 ? (
              <div className="smr2_B2ccartMainPages">
                <div className="smr2_B2CcartSide">
                  <CartList
                    items={cartData}
                    CartCardImageFunc={CartCardImageFunc}
                    showRemark={showRemark}
                    productRemark={productRemark}
                    onSelect={handleSelectItem}
                    selectedItem={selectedItem}
                    selectedItems={selectedItems}
                    multiSelect={multiSelect}
                    onRemove={handleRemoveItem}
                    handleAddReamrk={handleAddReamrk}
                    handleRemarkChange={handleRemarkChange}
                    handleSave={handleSave}
                    handleCancel={handleCancel}
                  />
                </div>
              </div>
            ) :
              <div className='smr2_noWishlistData'>
                <p className='smr2_title'>No Item Found!</p>
                <p className='smr2_desc'>Please First Add To Cart Data</p>
                <button className='smr2_browseOurCollectionbtn'>Browse our collection</button>
              </div>
            }
          </>
        ) :
          // <CartPageSkeleton />
          <div></div>
        }

        <ConfirmationDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmRemoveAll}
          title="Confirm Remove All"
          content="Are you sure you want to clear all items?"
        />

        <Footer />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', paddingBlock: '30px' }}>
        <p style={{ margin: '0px', fontWeight: 500, color: 'white', cursor: 'pointer' }} onClick={scrollToTop}>BACK TO TOP</p>
      </div>
    </div>
  );
};

export default CartPage;
