import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CreateQuote from './pages/CreateQuote.tsx';
import { BrowserRouter, Route, Routes } from "react-router";
import QuoteRequirement from './pages/QuoteRequirement.tsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavBar from './components/AppNavBar.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppNavBar />
      <div className='app-container'>
        <Routes>
          <Route path='/' element={<QuoteRequirement />}></Route>
          <Route path='/create-quote' element={<CreateQuote />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  </StrictMode>
);
