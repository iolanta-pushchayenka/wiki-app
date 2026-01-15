import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../context/AuthContext";



const MenuButton = styled.button`
  color: white;
  padding: 8px 10px;
  border-color: #f8f9fa;
  border-radius: 5px;
  cursor: pointer;
  background: transparent;
  color: black;
`;

const MenuList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  margin: 5px 0 0 0;
  padding: 0;
  list-style: none;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  min-width: 180px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.15);
`;


const MenuItemButton = styled.button`
  background: none;
  border: none;
  padding: 8px 12px;
  width: 100%;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: #AFEEEE;
    color: black;
  }
`;

export default function ArticleMenu({ articleId, wsId, onDelete, articleUserId, currentUserId, currentUserRole  }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const canDeleteOrEdit =
  Number(articleUserId) === Number(currentUserId) ||
  currentUserRole === "admin";

if (!canDeleteOrEdit) return null;


  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete the article?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/articles/${articleId}`);
      toast.success('Article deleted');

      if (onDelete) onDelete(articleId);


    } catch (err) {
      console.error(err);
      alert('Error when saving');
    }
  };

  return (
    <div ref={menuRef} style={{ position: "relative", display: "inline-block" }}>
      <MenuButton onClick={(e) => { e.stopPropagation(); setIsOpen(prev => !prev); }}>︙</MenuButton>

      {isOpen && (
        <MenuList>
          <MenuItemButton
            onClick={(e) => { e.stopPropagation(); 
            setIsOpen(false);  
            navigate(`/workspace/${wsId}/article/${articleId}/edit`); }}
          >
            Edit article
          </MenuItemButton>
          <MenuItemButton
            onClick={async (e) => { e.stopPropagation(); 
            setIsOpen(false);     
            await handleDelete(); }}>
            Delete Article
          </MenuItemButton>

          <ToastContainer position="top-center" autoClose={4000} />
        </MenuList>
      )}
    </div>
  );
}

