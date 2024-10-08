import React from 'react'
import './Styles.scss'
import { storImagePath } from '../../../../../../../utils/Glob_Functions/GlobalFunction'

const BrandsComponent = () => {
    return (
        <div id='brandsComponentID' >
            <div className='brandsCompoents'>
                <p className='elv_brand_title'>introducing our exclusive brands</p>
                <span className='elv_brand_subtitle'>Unveiling the Finest in Exclusive Brands</span>
            </div>
            <div className='brandsComponentClass'>
                <img className='affilitionImg' loading="lazy" src={`${storImagePath()}/images/HomePage/BrandsLogoImg/BrandsLogo06.png`} style={{ width: '8%' }} />
                <img className='affilitionImg' loading="lazy" src={`${storImagePath()}/images/HomePage/BrandsLogoImg/BrandsLogo05.png`} />
                <img className='affilitionImg' loading="lazy" src={`${storImagePath()}/images/HomePage/BrandsLogoImg/BrandsLogo04.png`} />
                <img className='affilitionImg' loading="lazy" src={`${storImagePath()}/images/HomePage/BrandsLogoImg/BrandsLogo02.png`} />
                <img className='affilitionImg' loading="lazy" src={`${storImagePath()}/images/HomePage/BrandsLogoImg/BrandsLogo03.png`} />
                <img className='affilitionImg' loading="lazy" src={`${storImagePath()}/images/HomePage/BrandsLogoImg/BrandsLogo01.png`} />
                {/* <img className='affilitionImg' loading="lazy" src={`${storImagePath()}/images/HomePage/BrandsLogoImg/BrandsLogo05.png`} style={{ width: '10%', objectFit: 'cover', marginRight:'90px' }} />
                <img className='affilitionImg' loading="lazy" src={`${storImagePath()}/images/HomePage/BrandsLogoImg/BrandsLogo06.png`} style={{ width: '10%', objectFit: 'cover', marginRight: '90px' }} />
                <img className='affilitionImg' loading="lazy" src={`${storImagePath()}/images/HomePage/BrandsLogoImg/BrandsLogo04.png`} style={{ width: '10%', objectFit: 'cover', marginRight: '90px' }} />
                <img className='affilitionImg' loading="lazy" src={`${storImagePath()}/images/HomePage/BrandsLogoImg/BrandsLogo02.png`} style={{ width: '10%', objectFit: 'cover', marginRight: '90px' }} />
                <img className='affilitionImg' loading="lazy" src={`${storImagePath()}/images/HomePage/BrandsLogoImg/BrandsLogo03.png`} style={{ width: '10%', objectFit: 'cover', marginRight: '90px' }} />
                <img className='affilitionImg' loading="lazy" src={`${storImagePath()}/images/HomePage/BrandsLogoImg/BrandsLogo01.png`} style={{ width: '10%', objectFit: 'cover'}} /> */}
            </div>
        </div>
    )
}

export default BrandsComponent