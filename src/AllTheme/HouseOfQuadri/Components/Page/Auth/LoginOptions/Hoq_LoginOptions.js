import React from "react";
import "./Hoq_LoginOption.modul.scss";
import { useNavigate, useLocation } from "react-router";

import { FaMobileAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

const LoginOption = () => {
  const navigation = useNavigate();
  const location = useLocation();

  const search = location?.search;
  const redirectEmailUrl = `/ContinueWithEmail/${search}`;

  const redirectMobileUrl = `/ContimueWithMobile/${search}`;

  return (
    <div className="Hoq_Loginoption">
      <div className="loginDailog">
        <div>
          <p className="loginDiTile">Log in or sign up in seconds</p>
          <p
            style={{
              textAlign: "center",
              color: "#7d7f85",
            }}
          >
            Use your email or mobile no to continue with the organization.
          </p>
          <div className="smilingLoginOptionMain">
            <div
              className="loginMail"
              onClick={() => navigation(redirectEmailUrl)}
            >
              <IoMdMail style={{ height: "25px", width: "25px" }} />
              <p
                style={{
                  margin: "0px",
                  fontSize: "20px",
                  fontWeight: 500,
                  paddingLeft: "25px",
                }}
              >
                Continue with email
              </p>
            </div>
            <div
              className="loginMobile"
              onClick={() => navigation(redirectMobileUrl)}
            >
              <FaMobileAlt
                style={{ height: "25px", width: "25px", marginRight: "10px" }}
              />
              <p
                style={{
                  margin: "0px",
                  fontSize: "20px",
                  fontWeight: 500,
                  paddingLeft: "25px",
                }}
              >
                Log in with mobile
              </p>
            </div>
          </div>
          <p
            className="hoq_agree"
            style={{
              marginTop: "40px",
              fontSize: "14px",
              color: "#7d7f85",
              textAlign: "center",
            }}
          >
            By continuing, you agree to our Terms of Use. Read our Privacy
            Policy.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBlock: "30px",
        }}
      >
        <p
          style={{
            margin: "0px",
            fontWeight: 500,
            width: "100px",
            color: "white",
            cursor: "pointer",
          }}
          onClick={() => window.scrollTo(0, 0)}
        >
          BACK TO TOP
        </p>
      </div>
    </div>
  );
};

export default LoginOption;
