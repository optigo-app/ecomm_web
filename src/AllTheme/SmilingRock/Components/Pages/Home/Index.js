import React, { useEffect } from 'react'
import './Index.modul.scss'
import { Storeinit } from '../../../../../utils/API/Storeinit/Storeinit';
import { companyLogo } from '../../Recoil/atom';
import { useRecoilState } from 'recoil';
import TopSection from './TopVideo/TopSection';
import TheDifference from './TheDifference/TheDifference';
import PromotionBaner1 from './PromotionBanner1/PromotionBaner1';
import DaimondEveyone from './DaimondEveyone/DaimondEveyone';
import ShopByCategory from './ShopByCategory/ShopByCategory';
import PromotionBanner2 from './PromotionBanner2/PromotionBanner2';
import PromoSetSection from './PromosetSection/PromoSetSection';
import SustainAbility from './SustainAbility/SustainAbility';
import BottomBanner from './BottomBanner/BottomBanner';
import Footer from './Footer/Footer';
import { GetMenuAPI } from '../../../../../utils/API/GetMenuAPI/GetMenuAPI';

function Home() {


  return (
    <div className='smiling_home_index_main'>
      <div className='smiling_home_index_Submain'>
        <TopSection />
        <TheDifference />
        <PromotionBaner1 />
        <DaimondEveyone />
        <ShopByCategory />
        <PromotionBanner2 />
        <PromoSetSection />
        <SustainAbility />
        <BottomBanner />
        <Footer />
        {/* <div className="main">
        <h1>SmilingRock</h1>
      </div>

      <div className='Submain'>
        <h1>Sub Main</h1>
      </div>

      <div className='Submain'>
        <h1>Sub Main 2</h1>
      </div> */}

      </div>
      <div>
        <p style={{
          paddingBlock: '30px',
          margin: '0px',
          textAlign: 'center',
          color: 'white',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '1px'
        }} onClick={() => window.scrollTo(0, 0)}>BACK TO TOP</p>
      </div>
    </div>
  )
}

export default Home;