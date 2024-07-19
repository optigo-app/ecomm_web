import React, { useEffect, useState } from 'react';
import './YourProfileDT.scss';
import { TextField, Modal,  CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { saveEditProfile } from '../../../../../../utils/API/AccountTabs/YourProfile';
import {defaultAddressStateDT} from './../../../Recoil/atom';
import { useRecoilValue } from 'recoil';
import { getAddressData } from '../../../../../../utils/API/AccountTabs/manageAddress';


export default function YourProfile() {
    
    const [userData, setUserData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedUserData, setEditedUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const defaultAddress = useRecoilValue(defaultAddressStateDT);
    const [addressPresentFlag, setAddressPresentFlag] = useState(false);

    useEffect(() => {
        const storedUserData = localStorage.getItem('loginUserDetail');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            if (defaultAddress) {
                const updatedUserData = {
                    ...parsedUserData,
                    defaddress_shippingfirstname: defaultAddress?.shippingfirstname,
                    defaddress_shippinglastname: defaultAddress?.shippinglastname,
                    defaddress_shippingmobile: defaultAddress?.shippingmobile,
                    defaddress_addressprofile: defaultAddress?.addressprofile,
                    defaddress_street: defaultAddress?.street,
                    defaddress_city: defaultAddress?.city,
                    defaddress_state: defaultAddress?.state,
                    defaddress_country: defaultAddress?.country,
                    defaddress_zip: defaultAddress?.zip,
                    IsDefault: defaultAddress?.isdefault
                };
                setUserData(updatedUserData);
            } else {
                setUserData(parsedUserData);
            }
        }
    }, [defaultAddress]);

    const handleEdit = () => {
        setEditedUserData({ ...userData });
        setEditMode(true);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setEditedUserData((prevData) => ({
            ...prevData,
            [id]: value,
        }));

        
        // Validate the field
        const errorsCopy = { ...errors };

        switch (id) {
            case 'defaddress_shippingfirstname':
                if (!value.trim()) {
                    errorsCopy.defaddress_shippingfirstname = 'First Name is required';
                } else if(value?.length < 3){
                    errorsCopy.defaddress_shippingfirstname = 'First Name is too short';
                } else if(value?.length > 25){
                    errorsCopy.defaddress_shippingfirstname = 'First Name is too long';
                } else if (!/^(?![\d\s!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`])[^\s][^\n]+$/.test(value.trim())) {
                    errorsCopy.defaddress_shippingfirstname = 'Invalid First Name';
                } else {
                    errorsCopy.defaddress_shippingfirstname = '';
                }
                break;
            case 'defaddress_shippinglastname':
                if (!value.trim()) {
                    errorsCopy.defaddress_shippinglastname = 'Last Name is required';
                } else if(value?.length < 3){
                    errorsCopy.defaddress_shippinglastname = 'Last Name is too short';
                } else if(value?.length > 25){
                    errorsCopy.defaddress_shippinglastname = 'Last Name is too long';
                } else if (!/^(?![\d\s!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`])[^\s][^\n]+$/.test(value.trim())) {
                    errorsCopy.defaddress_shippinglastname = 'Invalid Last Name';
                } else {
                    errorsCopy.defaddress_shippinglastname = '';
                }
                break;
            case 'defaddress_street':
                if (!value.trim()) {
                    errorsCopy.defaddress_street = 'Address is required';
                } else if(value?.length < 3){
                    errorsCopy.defaddress_street = 'Address is too short';
                } else if (!/^(?![\d\s!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`])[^\s][^\n]+$/.test(value.trim())) {
                    errorsCopy.defaddress_street = 'Invalid Address';
                } else {
                    errorsCopy.defaddress_street = '';
                }
                break;
            case 'defaddress_shippingmobile':
                if (!value.trim()) {
                    errorsCopy.defaddress_shippingmobile = 'Mobile No. is required';
                } else if (!/^\d{10}$/.test(value.trim())) {
                    errorsCopy.defaddress_shippingmobile = 'Enter Valid mobile number';
                } else {
                    errorsCopy.defaddress_shippingmobile = '';
                }
                break;
            default:
                break;
        }

        setErrors(errorsCopy);

    };



    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validate()) {
            
            setEditMode(false);
            try {
                setIsLoading(true);
                const storedData = localStorage.getItem('loginUserDetail');
                const data = JSON.parse(storedData);
                const storeInit = JSON.parse(localStorage.getItem('storeInit'));
                const { FrontEnd_RegNo } = storeInit;
                const response = await saveEditProfile(editedUserData, data, FrontEnd_RegNo, editedUserData);
                if (response?.Data?.rd[0]?.stat === 1) {
                    toast.success('Edit success');
                    setUserData(editedUserData);
                    localStorage.setItem('loginUserDetail', JSON.stringify(editedUserData));
                } else {
                    toast.error('Error in saving profile.');
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error('An error occurred. Please try again.');
            } finally {
                setIsLoading(false);
            }
        } else {
            toast.error('Please fill out form fields correctly.');
        }
    };


    const handleClose = () => {
        setEditMode(false);
    };

    const validate = () => {

        let tempErrors = {};

            // First Name validation
            if (!editedUserData.defaddress_shippingfirstname?.length) {
                tempErrors.defaddress_shippingfirstname = "First Name is required";
            } else if (editedUserData.defaddress_shippingfirstname.length < 3) {
                tempErrors.defaddress_shippingfirstname = "First Name is too short";
            } else if (editedUserData.defaddress_shippingfirstname.length > 25) {
                tempErrors.defaddress_shippingfirstname = "First Name is too long";
            }

            // Last Name validation
            if (!editedUserData.defaddress_shippinglastname?.length) {
                tempErrors.defaddress_shippinglastname = "Last Name is required";
            } else if (editedUserData.defaddress_shippinglastname.length < 3) {
                tempErrors.defaddress_shippinglastname = "Last Name is too short";
            } else if (editedUserData.defaddress_shippinglastname.length > 25) {
                tempErrors.defaddress_shippinglastname = "Last Name is too long";
            }

            // Mobile Number validation
            if (!editedUserData.defaddress_shippingmobile?.length) {
                tempErrors.defaddress_shippingmobile = "Mobile Number is required";
            } else if (editedUserData.defaddress_shippingmobile.length !== 10 || isNaN(editedUserData.defaddress_shippingmobile)) {
                tempErrors.defaddress_shippingmobile = "Mobile Number must contain exactly 10 digits";
            }

            // User ID validation
            if (!editedUserData.userid) {
                tempErrors.userid = "User ID is required";
            }

            // Street Address validation
            if (!editedUserData.defaddress_street) {
                tempErrors.defaddress_street = "Street Address is required";
            }

            setErrors(tempErrors);

            return Object.values(tempErrors).every(x => !x);

    };

    useEffect(() => {
        fetchAddress();
    }, [])

    const fetchAddress = async() => {
        try {
            const storedData = localStorage.getItem('loginUserDetail');
            const data = JSON.parse(storedData);
            const customerid = data?.id;
            
            const storeInit = JSON.parse(localStorage.getItem('storeInit'));
            const { FrontEnd_RegNo } = storeInit;
            
            const response = await getAddressData(FrontEnd_RegNo, customerid, data);
            if(response?.Data?.rd?.length > 0){
                setAddressPresentFlag(true);
            }    
        } catch (error) {
            console.log(error);
        }
        
    }

    return (
        <div className='smr_yourProfile'>
            <ToastContainer />

            {isLoading && (
                <div className="loader-overlay">
                    <CircularProgress className='loadingBarManage' />
                </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom:'20px' }}>
                { addressPresentFlag &&  <div className='userProfileMain' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    {userData && (
                        <>
                            <div className='mobileEditProfileDiv'>
                                <TextField
                                    autoFocus
                                    id="defaddress_shippingfirstname"
                                    label="First Name"
                                    variant="outlined"
                                    className='labgrowRegister'
                                    style={{ margin: '15px', color: 'black' }}
                                    value={userData?.defaddress_shippingfirstname}
                                    disabled={!editMode}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    id="defaddress_shippinglastname"
                                    label="Last Name"
                                    variant="outlined"
                                    className='labgrowRegister'
                                    style={{ margin: '15px' }}
                                    value={userData?.defaddress_shippinglastname}
                                    disabled={!editMode}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className='mobileEditProfileDiv'>
                                <TextField
                                    id="userid"
                                    label="Email"
                                    variant="outlined"
                                    className='labgrowRegister'
                                    style={{ margin: '15px' }}
                                    value={userData?.userid}
                                    disabled={!editMode}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    id="defaddress_shippingmobile"
                                    label="Mobile No."
                                    variant="outlined"
                                    className='labgrowRegister'
                                    style={{ margin: '15px' }}
                                    value={userData?.defaddress_shippingmobile}
                                    disabled={!editMode}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className='mobileEditProfileDiv'>
                                <TextField
                                    id="defaddress_street"
                                    label="Address"
                                    variant="outlined"
                                    className='labgrowRegister'
                                    style={{ margin: '15px' }}
                                    value={userData?.defaddress_street}
                                    disabled={!editMode}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </>
                    )}
                </div>}
                { addressPresentFlag &&  <div>
                    <button onClick={handleEdit} className='SmilingAddEditAddrwess' style={{ backgroundColor: 'lightgray', marginTop: '15px' }}>Edit Profile</button>
                </div>}
            </div>

            <Modal
                open={editMode}
                onClose={handleClose}
            >
                <div className='smilingEditProfilePopup' style={{ position: 'absolute', backgroundColor: 'white', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 450, boxShadow: 24, p: 4 }}>
                  
                    <form onSubmit={(event) => handleSubmit(event)} style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                        <h2 style={{ marginTop: '30px', textAlign: 'center' }}>Edit Profile</h2>
                        {editedUserData && (
                            <>
                                <TextField
                                    id="defaddress_shippingfirstname"
                                    label="First Name"
                                    variant="outlined"
                                    style={{ margin: '15px' }}
                                    value={editedUserData.defaddress_shippingfirstname !== "undefined" ? editedUserData.defaddress_shippingfirstname : ""}
                                    onChange={handleInputChange}
                                    error={!!errors.defaddress_shippingfirstname}
                                    helperText={errors.defaddress_shippingfirstname}
                                    required
                                />
                                <TextField
                                    id="defaddress_shippinglastname"
                                    label="Last Name"
                                    variant="outlined"
                                    style={{ margin: '15px' }}
                                    value={editedUserData.defaddress_shippinglastname !== "undefined" ? editedUserData.defaddress_shippinglastname : ""}
                                    onChange={handleInputChange}
                                    error={!!errors.defaddress_shippinglastname}
                                    helperText={errors.defaddress_shippinglastname}
                                    required
                                />
                                <TextField
                                    id="userid"
                                    label="Email"
                                    variant="outlined"
                                    style={{ margin: '15px' }}
                                    value={editedUserData.userid !== "undefined" ? editedUserData.userid : ""}
                                    onChange={handleInputChange}
                                    error={!!errors.userid}
                                    helperText={errors.userid}
                                    disabled
                                />
                                <TextField
                                    id="defaddress_shippingmobile"
                                    label="Mobile No."
                                    variant="outlined"
                                    style={{ margin: '15px' }}
                                    value={editedUserData.defaddress_shippingmobile !== "undefined" ? editedUserData.defaddress_shippingmobile : ""}
                                    onChange={handleInputChange}
                                    error={!!errors.defaddress_shippingmobile}
                                    helperText={errors.defaddress_shippingmobile}
                                    required
                                />
                                <TextField
                                    id="defaddress_street"
                                    label="Address"
                                    variant="outlined"
                                    style={{ margin: '15px' }}
                                    value={editedUserData.defaddress_street !== "undefined" ? editedUserData.defaddress_street : ""}
                                    onChange={handleInputChange}
                                    error={!!errors.defaddress_street}
                                    helperText={errors.defaddress_street}
                                    required
                                />
                            </>
                        )}
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '25px' }}>
                          <button type='submit' className='smr_SmilingAddEditAddrwess' style={{ backgroundColor: 'lightgray', marginInline: '5px' }}>Save</button>
                          <button onClick={() => setEditMode(false)} className='smr_SmilingAddEditAddrwess' style={{ backgroundColor: 'lightgray' }}>Cancel</button>
                      </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}