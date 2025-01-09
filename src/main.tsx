import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CreateQuote from './pages/CreateQuote.tsx';
import { BrowserRouter, Route, Routes } from "react-router";
import QuoteRequirement from './pages/QuoteRequirement.tsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<QuoteRequirement />}></Route>
        <Route path='/create-quote' element={<CreateQuote />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
