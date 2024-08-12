
import React from "react";
import "./LabgrownDiamondInfo.scss";
import { storImagePath } from "../../../../../../../utils/Glob_Functions/GlobalFunction";

const LabgrownDiamondInfo = () => {
  const bgImage = `${storImagePath()}/Forevery/home/labgrownBanner/142.webp`;
  return (
    <div className="for_LabgrownDiamondInfo">
      <section
        className="Labgrown_Diamonds my-4 side_space"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <div className="banner-wrap w-90">
          <div className="main_wrap_title">
            <div className="title_head">Lab Grown Diamonds</div>
            <p className="paragraph">
              Lab-grown diamonds are a revolutionary new way to elevate every
              style. These are identical to natural diamonds in chemical makeup
              and optical properties. Diamonds are the result of advanced
              technology, offering a cost-effective and eco-friendly options for
              those seeking the beauty and brilliance of a diamond. Now enjoy
              the beauty of diamonds without compromising on their value.
            </p>
          </div>
          <div className="labgrown-mobile-content ">
            <div className="beauty-and-quality blocks ">
              <div className="lg-items-head ">
                <img
                  loading="lazy"
                  src={`${storImagePath()}/Forevery/home/labgrownBanner/lg-diamond.svg`}
                  alt="beauty and quality"
                />

                <div className="text-capitalize color-white font-reg font-nunito">
                  beauty and quality
                </div>
              </div>

              <p className="mini_para">
                Lab-grown diamonds offer the same excellent vibes as mined
                diamonds and are physically and optically identical.
              </p>
            </div>
            <div className="value blocks">
              <div className="lg-items-head ">
                <img
                  loading="lazy"
                  src={`${storImagePath()}/Forevery/home/labgrownBanner/lg-gem.svg`}
                  alt="value"
                />

                <div className="text-capitalize color-white font-reg font-nunito">
                  Valeur{" "}
                </div>
              </div>

              <p className="mini_para">
                Compared to natural diamonds of equivalent size and quality,
                Labgrown diamonds are a more affordable choice.
              </p>
            </div>
            <div className="eco-conscious blocks">
              <div className="lg-items-head ">
                <img
                  loading="lazy"
                  src={`${storImagePath()}/Forevery/home/labgrownBanner/lg-eco.svg`}
                  alt="eco-conscious"
                />

                <div className="text-capitalize color-white font-reg font-nunito">
                  Éco-conscient
                </div>
              </div>

              <p className="mini_para">
                Lab-grown diamonds are the eco-conscious choice considering that
                there is no mining required.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LabgrownDiamondInfo;
