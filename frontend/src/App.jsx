import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import ArticlePage from "./pages/ArticlePage";
import CreatePage from "./pages/CreatePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EditPage from "./pages/EditPage";
import NotificationToast from './components/NotificationToast';
import WorkspacesSidebar from "./components/WorkspacesSidebar";
import ArticleForm from "./components/ArticleForm";
import ArticleView from "./components/ArticleView";
import ArticleEdit from "./components/ArticleEdit";


function App() {

  return (
    <BrowserRouter>
    <NotificationToast />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/workspace/:wsId/article/:articleId" element={<ArticlePage />} />
        <Route path='/create' element={<CreatePage />} />
        <Route path="/workspace/:wsId/article/:articleId/edit" element={<ArticleEdit />} />
        <Route path="/workspace/:wsId/article/new" element={<ArticleForm/>} />
      </Routes>
    </BrowserRouter>

  )
}
export default App;

