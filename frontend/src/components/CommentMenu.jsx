import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const MenuButton = styled.button`
  color: black;
  padding: 6px 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
`;

const MenuList = styled.ul`
  position: absolute;
  top: 100%;
  right: 0;
  margin: 5px 0 0 0;
  padding: 0;
  list-style: none;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  min-width: 150px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.15);
  z-index: 20;
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
  }
`;

export default function CommentMenu({ commentId, onEdit, onDelete }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const close = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, []);

    const handleDelete = async () => {
        if (!window.confirm("Delete this comment?")) return;

        try {
            await api.delete(`/articles/comment/${commentId}`);
            toast.success("Comment deleted!");

            if (onDelete) onDelete(commentId);
        } catch (err) {
            console.error(err);
            toast.error("Delete failed");
        }
    };

    return (
        <div ref={menuRef} style={{ position: "relative", display: "inline-block" }}>
            <MenuButton onClick={(e) => { e.stopPropagation(); setIsOpen((p) => !p); }}>
                ︙
            </MenuButton>

            {isOpen && (
                <MenuList>
                    <MenuItemButton
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false); onEdit(); }}
                    >
                        Edit comment
                    </MenuItemButton>

                    <MenuItemButton
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false); handleDelete(); }}
                    >
                        Delete comment
                    </MenuItemButton>
                </MenuList>
            )}
        </div>
    );
}
