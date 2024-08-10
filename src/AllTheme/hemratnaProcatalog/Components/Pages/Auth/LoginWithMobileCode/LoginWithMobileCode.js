import React, { useEffect, useState } from 'react'
import './LoginWithMobileCode.modul.scss';
import { useNavigate } from 'react-router-dom';

const LoginWithMobileCode = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);

  const handleCode = (e) => {
    setCode(e.target.value);
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimeLeft(prevTimer => prevTimer - 1)
    }, 1000)
    if (timeLeft === 0) {
      clearInterval(countdownInterval);
    }
    return () => clearInterval(countdownInterval);
  }, [timeLeft]);

  const loginCredsdata = JSON.parse(sessionStorage.getItem('loginCreds'))

  useEffect(() => {
    if (loginCredsdata && loginCredsdata.length > 0) {
      setMobile(loginCredsdata[0]?.mobile)
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length > 0) {
      navigate(`/`);
    }
  }

  return (
    <>
      <div className='hem_LoginWithMobileCodeMain_div'>
        <div className='hem_LoginWithMobileCode_div'>
          <div className='hem_LoginWithMobileCode_layout'>
            <button onClick={() => navigate('/')} className='hem_LoginWithMobileCode_close_btn'>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="m4 4 8 8m-8 0 8-8" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
                </path>
              </svg>
            </button>
            <div className='hem_LoginWithMobileCode_back_btn_div'>
              <button onClick={() => navigate('/signin')} className='hem_LoginWithMobileCode_back_btn'>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M15.45 17.97 9.5 12.01a.25.25 0 0 1 0-.36l5.87-5.87a.75.75 0 0 0-1.06-1.06l-5.87 5.87c-.69.68-.69 1.8 0 2.48l5.96 5.96a.75.75 0 0 0 1.06-1.06z">
                  </path>
                </svg>
              </button>
              <h3 className='hem_LoginWithMobileCode_title'>Let us know it's you</h3>
            </div>
            <div>
              <h4 className='hem_LoginWithMobileCode_mess'>Last step! To secure your account, enter the code we just sent to
                <span className='hem_LoginWithMobileCode_email_data'>{mobile}</span>
              </h4>
            </div>
            <div>
              <form onSubmit={handleSubmit}>
                <div className="hem_LoginWithMobileCode_input_div">
                  <label className="hem_LoginWithMobileCode_inp_label">Code</label>
                  <input type="text" placeholder='Enter code' className="hem_LoginWithMobileCode_input" value={code} onChange={handleCode} required />
                </div>
                <div>
                  <button className='hem_LoginWithMobileCode_submit_btn'>
                    <span>Continue</span>
                  </button>
                </div>
              </form>
            </div>
            <div>
              <div className='hem_LoginWithMobileCode_resend_code'>
                <span>
                  Didn't get the code?
                  {timeLeft === 0 ? (
                    <>
                      <span onClick={() => setTimeLeft(120)} className='hem_LoginWithMobileCode_resend_code_span'>Resend Code</span>
                    </>
                  ) : (
                    <>
                      <span className='hem_LoginWithMobileCode_resend_code_span_timer'>{formatTime(timeLeft)}</span>
                    </>
                  )}

                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginWithMobileCode