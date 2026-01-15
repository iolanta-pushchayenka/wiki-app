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
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RequireAdmin from "./components/RequireAdmin";
import UserManagement from "./components/UserManagement";

function App() {

  return (
    <BrowserRouter>
      <NotificationToast />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path='/' element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/workspace/:wsId/article/:articleId" element={<ProtectedRoute><ArticlePage /></ProtectedRoute>} />
        <Route path='/create' element={<ProtectedRoute><CreatePage /></ProtectedRoute>} />
        <Route path="/workspace/:wsId/article/:articleId/edit" element={<ProtectedRoute><ArticleEdit /></ProtectedRoute>} />
        <Route path="/workspace/:wsId/article/new" element={<ProtectedRoute><ArticleForm /></ProtectedRoute>} />
        <Route path="/workspaces/:wsId/articles/:articleId/versions" element={<ProtectedRoute><VersionsListPage /></ProtectedRoute>} />
        <Route path="/workspaces/:wsId/articles/:articleId/versions/:versionNumber" element={<ProtectedRoute><VersionViewPage /></ProtectedRoute>} />
        <Route path="/users" element={<RequireAdmin><UserManagement /></RequireAdmin>}
/>

      </Routes>
    </BrowserRouter>

  )
}
export default App;

