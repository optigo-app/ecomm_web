import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { green } from '@mui/material/colors';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Grid, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import RemarkModal from './RemarkModal';
import { GetCountAPI } from '../../../../../../utils/API/GetCount/GetCountAPI';
import { CartCount } from '../../../Recoil/atom';
import { useSetRecoilState } from 'recoil';
import noImageFound from "../../../Assets/image-not-found.jpg"

const CartItem = ({
  item,
  CartCardImageFunc,
  onSelect,
  isSelected,
  selectedItem,
  isActive,
  multiSelect,
  onRemove,
  itemLength,
  showRemark,
  productRemark,
  handleAddRemark,
  handleRemarkChange,
  handleSave,
  handleCancel,
}) => {
  const [open, setOpen] = useState(false);
  const [remark, setRemark] = useState(item.Remarks || '');
  const [isSelectedItems, setIsSelectedItems] = useState();
  const [countstatus, setCountStatus] = useState();
  const setCartCountVal = useSetRecoilState(CartCount)

  useEffect(() => {
    const isCartUpdateStatus = localStorage.getItem('cartUpdation');
    setCountStatus(isCartUpdateStatus)
  }, [onRemove])

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRemarkChangeInternal = (e) => {
    setRemark(e.target.value);
    handleRemarkChange(e);
  };

  const handleSaveInternal = () => {
    handleSave(item, remark);
    handleClose();
  };

  useEffect(() => {
    handleIsSelected()
  }, [isSelected])

  const handleIsSelected = () => {
    let isselected = selectedItem?.id == item?.id
    console.log('isselectedItems', isselected);
    setIsSelectedItems()
  }

  const handleRemoveItem = () => {
    onRemove(item)
    setTimeout(() => {
      if (countstatus) {
        GetCountAPI().then((res) => {
          console.log('responseCount', res);
          setCartCountVal(res?.cartcount);
        })
      }
    }, 500)
  }
  const isLargeScreen = useMediaQuery('(min-width:1800px)');
  const ismediumScreen = useMediaQuery('(min-width:1780px)');

  return (
    <Grid
      item
      xs={12}
      sm={itemLength <= 2 ? 6 : 6}
      md={itemLength <= 2 ? 6 : 6}
      lg={itemLength <= 2 ? 6 : 4}
      xxl={itemLength <= 2 ? 6 : 3}
      className='smr_cartListCardGrid'>
      <Card className='smr_cartListCard'
        sx={{
          boxShadow: selectedItem?.id == item?.id && 'rgb(175 130 56 / 68%) 1px 1px 1px 0px, rgb(175 130 56 / 68%) 0px 0px 0px 1px !important',
          // border: selectedItem?.id == item?.id && '1px solid #af8238',
          maxWidth: 450,
          width:isLargeScreen && itemLength <= 3 ? '390px' : '100%'
        }}
        onClick={() => onSelect(item)}
      >
        <Box className="smr_mui_CartBox" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', position: 'relative' }}>
          <CardMedia
            component="img"
            image={item?.ImageCount != 0 ? CartCardImageFunc(item) : noImageFound}
            alt={item?.TitleLine}
            className='smr_cartListImage'
          />
          <div>
            <CardContent className='smr_cartcontentData'>
              <Typography variant="body2" className='smr_DesignNoTExt'>
                {item?.designno}
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div style={{ marginBottom: '10px' }}>
                  <Typography variant="body2" className='smr_card-ContentData'>
                    NWT: {item?.MetalWeight}
                  </Typography>
                  <Typography variant="body2" className='smr_card-ContentData'>
                    CWT: {item?.totalCSWt} / {item?.totalcolorstonepcs}
                  </Typography>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <Typography variant="body2" className='smr_card-ContentData'>
                    GWT: {item?.totalGrossweight}
                  </Typography>
                  <Typography variant="body2" className='smr_card-ContentData'>
                    DWT: {item?.totalDiaWt} / {item?.totaldiamondpcs}
                  </Typography>
                </div>
              </div>
              <Box className="smr_cartbtngroupReRm" sx={{ position: 'absolute', bottom: '5px', right: '5px' }}>
                {item?.Remarks !== "" &&
                  <Typography variant="body2" className='smr_card-ContentData'>
                    Remark: {item?.Remarks || productRemark}
                  </Typography>
                }
                <Link className='smr_ItemRemarkbtn' onClick={(e) => { e.stopPropagation(); handleOpen(); }} variant="body2">
                  {item?.Remarks ? "Update Remark" : "Add Remark"}
                </Link>
                <Link className='smr_ReomoveCartbtn' href="#" variant="body2" onClick={() => handleRemoveItem(item)} >
                  Remove
                </Link>
              </Box>
            </CardContent>
          </div>
        </Box>
        {isSelected && multiSelect && <CheckCircleIcon sx={{ color: green[500], position: 'absolute', top: 30, left: 8 }} />}
      </Card>
      <RemarkModal
        open={open}
        onClose={handleClose}
        remark={remark}
        onRemarkChange={handleRemarkChangeInternal}
        onSave={handleSaveInternal}
      />
    </Grid>
  );
};

export default CartItem;
