import React, { useEffect, useState } from "react";
import "./smrMo_wishlist.scss";
import WishlistData from "./WishlistData";
import SkeletonLoader from "./WishlistSkelton";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import ConfirmationDialog from "../ConfirmationMoDialog/ConfirmationMoDialog";
import { smrMA_CartCount, smrMA_WishCount } from "../../Recoil/atom";
import Usewishlist from "../../../../../../utils/Glob_Functions/Cart_Wishlist/Wishlist";
import { GetCountAPI } from "../../../../../../utils/API/GetCount/GetCountAPI";
import { IoArrowBack } from "react-icons/io5";

const Wishlist = () => {
  const {
    isWLLoading,
    wishlistData,
    CurrencyData,
    updateCount,
    countDataUpdted,
    itemInCart,
    decodeEntities,
    WishCardImageFunc,
    handleRemoveItem,
    handleRemoveAll,
    handleWishlistToCart,
    handleAddtoCartAll,
    handleMoveToDetail,
    handelMenu
  } = Usewishlist();

  const [dialogOpen, setDialogOpen] = useState(false);
  const setWishCountVal = useSetRecoilState(smrMA_WishCount)
  const setCartCountVal = useSetRecoilState(smrMA_CartCount)
  const [countstatus, setCountStatus] = useState();
  const navigation = useNavigate();

  useEffect(() => {
    const iswishUpdateStatus = localStorage.getItem('wishUpdation');
    setCountStatus(iswishUpdateStatus)
  }, [handleRemoveAll])

  const handleRemoveAllDialog = () => {
    setDialogOpen(true);
  };


  const handleConfirmRemoveAll = () => {
    setDialogOpen(false);
    handleRemoveAll();
    setTimeout(() => {
      if (countstatus) {
        GetCountAPI().then((res) => {
          console.log('responseCount', res);
          setWishCountVal(res?.wishcount);
        })
      }
    }, 500)
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };


  const handleAddtoCartAllfun = () => {
    handleAddtoCartAll();
    setTimeout(() => {
      if (countstatus) {
        GetCountAPI().then((res) => {
          console.log('responseCount', res);
          setCartCountVal(res?.cartcount);
        })
      }
    }, 500)
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  console.log("cartdataCount--", wishlistData);

  return (
    <div className="smrMA_MainWlDiv">
      <p className="SmiCartListTitle">
        <IoArrowBack style={{ height: '25px', width: '25px', marginRight: '10px' }} onClick={() => navigation(-1)} />My Wishlist
      </p>
      <div className="smrMo_WlBtnGroupMainDiv">
        {/* <div className="WlBtnGroupMainDiv">
          <div className="smr_Wl-title">My Wishlist</div>
          {wishlistData?.length != 0 &&
            <>
              <div className="smrMo_WlButton-group">
                <Link
                  className="smrMo_ReomoveAllWLbtn"
                  href="#"
                  variant="body2"
                  onClick={handleRemoveAllDialog}
                >
                  CLEAR ALL
                </Link>
                <button className='smrMo_WlClearAllBtn' onClick={handleRemoveAll}>CLEAR ALL</button>
                <button className="smrMo_WlAddToCartBtn" onClick={handleAddtoCartAllfun}>ADD TO CART ALL</button>
                <button className='smrMo_WlBtn'>SHOW PRODUCT LIST</button>
              </div>
            </>
          }

        </div> */}
        {!isWLLoading ? (
          <WishlistData
            isloding={isWLLoading}
            items={wishlistData}
            updateCount={updateCount}
            countDataUpdted={countDataUpdted}
            curr={CurrencyData}
            itemInCart={itemInCart}
            decodeEntities={decodeEntities}
            WishCardImageFunc={WishCardImageFunc}
            handleRemoveItem={handleRemoveItem}
            handleWishlistToCart={handleWishlistToCart}
            handleMoveToDetail={handleMoveToDetail}
            handelMenu={handelMenu}
          />
        ) : (
          <div style={{ marginTop: '10px' }}>
            <SkeletonLoader />
          </div>
        )}
        <ConfirmationDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmRemoveAll}
          title="Remove Item"
          content="Are you sure you want to remove all Item?"
        />
        {wishlistData?.length !== 0 &&
          <div className='smrMo_WlButton-group'>
            <button fullWidth className='smrMo_ReomoveAllWLbtn' onClick={handleRemoveAllDialog}>Clear All</button>
            <button fullWidth className='smrMo_WlAddToCartBtn' onClick={handleAddtoCartAllfun}>Add To Cart All</button>
          </div>
        }
      </div>
    </div>
  );
};

export default Wishlist;
