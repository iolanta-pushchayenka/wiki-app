import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import ArticlePage from "./pages/ArticlePage";
import CreatePage from "./pages/CreatePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EditPage from "./pages/EditPage";
import NotificationToast from './components/NotificationToast';
import WorkspacesSidebar from "./components/WorkspacesSidebar";
import ArticleForm from "./components/ArticleForm";
import ArticleEdit from "./components/ArticleEdit";
import VersionsListPage from "./pages/VersionsListPage";
import VersionViewPage from "./pages/VersionViewPage";


function App() {

  return (
    <BrowserRouter>
      <NotificationToast />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/workspace/:wsId/article/:articleId" element={<ArticlePage />} />
        <Route path='/create' element={<CreatePage />} />
        <Route path="/workspace/:wsId/article/:articleId/edit" element={<ArticleEdit />} />
        <Route path="/workspace/:wsId/article/new" element={<ArticleForm />} />
        <Route path="/workspaces/:wsId/articles/:articleId/versions" element={<VersionsListPage />} />
        <Route path="/workspaces/:wsId/articles/:articleId/versions/:versionNumber" element={<VersionViewPage />} />
      </Routes>
    </BrowserRouter>

  )
}
export default App;

