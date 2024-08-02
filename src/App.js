import logo from './logo.svg';
import './App.css';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import ThemeRoutes from './ThemeRoutes';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

function App() {

  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
          <ThemeRoutes />
          <ToastContainer style={{zIndex : "99999999999999"}}/>
        </BrowserRouter>
      </RecoilRoot>
    </>
  );
}

export default App;
