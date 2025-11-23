import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import ArticlePage from "./pages/ArticlePage";
import CreatePage from "./pages/CreatePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EditPage from "./pages/EditPage";
import NotificationToast from './components/NotificationToast';

function App() {

  return (
    <BrowserRouter>
    <NotificationToast />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/article/:id' element={<ArticlePage />} />
        <Route path='/create' element={<CreatePage />} />
        <Route path="/edit/:id" element={<EditPage />} />
      </Routes>
    </BrowserRouter>

  )
}
export default App;

