

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import styled from "styled-components";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";



// const BackButton = styled(Link)`
//   padding: 6px 10px;
//   border: 1px solid #ccc;
//   border-radius: 4px;
//   text-decoration: none;
//   color: black;
//   font-size: 14px;
//   width: 10%;
//   margin-left: 25px;

//   &:hover {
//     background-color: #f0f0f0;
//   }
// `;

// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding: 40px;
//   max-width: 800px;
//   margin: 0 auto; /* по центру страницы */
// `;


// const Title = styled.h2`
//   margin-bottom: 20px;
//   color: #333;
// `;

// const Input = styled.input`
//   border: 2px solid #AFEEEE;
//   border-radius: 5px;
//   padding: 5px;
//   width: 20%;
//   font-size: 15px;
//   margin-bottom: 20px;
// `;

// const Button = styled.button`
//  background-color: #AFEEEE;
//   border: none;
//   border-radius: 5px;
//   padding: 10px 20px;
//   color: black;
//   font-size: 16px;
//   cursor: pointer;
//   margin-top: 20px;
//   margin-right: 550px;
// `;

// const modules = {
//   toolbar: [
//     [{ 'font': [] }],
//     [{ 'header': [1, 2, 3, false] }],
//     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//     [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//     [{ 'indent': '-1' }, { 'indent': '+1' }],
//     [{ 'color': [] }, { 'background': [] }],
//     ['link', 'image', 'video'],
//     ['clean']
//   ]
// };

// export default function ArticleEdit() {
//   const { wsId, articleId } = useParams();
//   const navigate = useNavigate();

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(true);

//   // ⭐ NEW — load article on mount
//   useEffect(() => {
//     async function loadArticle() {
//       try {
//         const res = await axios.get(
//           `http://localhost:3000/workspaces/${wsId}/articles/${articleId}`
//         );

//         setTitle(res.data.title);
//         setContent(res.data.content);
//         setLoading(false);

//       } catch (err) {
//         toast.error("Failed to load article");
//         console.error(err);
//       }
//     }

//     loadArticle();
//   }, [wsId, articleId]);

//   const handleUpdate = async (e) => {
//     e.preventDefault();

//     try {
//       await axios.put(
//         `http://localhost:3000/workspaces/${wsId}/articles/${articleId}`,
//         { title, content }
//       );

//       toast.success("Article updated!");
//       // setTimeout(() => navigate(`/workspaces/${wsId}`), 1200);

//     } catch (err) {
//       toast.error("Error updating article");
//       console.log(err);
//     }
//   };

//   if (loading) {
//     return (
//       <p style={{ textAlign: "center", marginTop: "100px" }}>
//         Uploading an article...
//       </p>
//     );
//   }

//   return (
//     <>

//     <BackButton to="/"> ← Back to workspaces </BackButton>

//       <Container>

//         <Title>Edit Article</Title>

//         <form onSubmit={handleUpdate} style={{ width: "100%" }}>
//           <Input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Title"
//           />

//           <ReactQuill
//             value={content}
//             onChange={setContent}
//             modules={modules}
//             style={{ height: "300px", marginBottom: "60px" }}
//           />

//           <Button type="submit">Save</Button>
//         </form>
//       </Container>

//       <ToastContainer position="top-center" autoClose={3000} />
//     </>
//   );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AttachmentUploader from "../components/AttachmentUploader";
import AttachmentList from "../components/AttachmentList";

// ---------- STYLES ----------

const BackButton = styled(Link)`
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-decoration: none;
  color: black;
  font-size: 14px;
  width: 10%;
  margin-left: 25px;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const Input = styled.input`
  border: 2px solid #AFEEEE;
  border-radius: 5px;
  padding: 5px;
  width: 40%;
  font-size: 15px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #AFEEEE;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  color: black;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
`;

const AttachmentsWrapper = styled.div`
  margin-top: 50px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 40px;
`;

const Column = styled.div`
  flex: 1;
  max-width: 50%;
`;

// -----------------------------------

export default function ArticleEdit() {
  const { wsId, articleId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load article on mount
  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await axios.get(
          `http://localhost:3000/workspaces/${wsId}/articles/${articleId}`
        );

        setTitle(res.data.title);
        setContent(res.data.content);
        setAttachments(res.data.attachments || []);

        setLoading(false);
      } catch (err) {
        toast.error("Failed to load article");
        console.error(err);
      }
    }

    loadArticle();
  }, [wsId, articleId]);

  // Save article changes
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:3000/workspaces/${wsId}/articles/${articleId}`,
        { title, content }
      );

      toast.success("Article updated!");

    } catch (err) {
      toast.error("Error updating article");
      console.error(err);
    }
  };

  // Add attachment to list after upload
  const handleAttachmentAdded = (attachment) => {
    setAttachments((prev) => [...prev, attachment]);
  };

  // Remove attachment from list
  const handleAttachmentDeleted = (attachmentId) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  };

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "100px" }}>
        Loading article...
      </p>
    );
  }

  return (
    <>
      <BackButton to="/"> ← Back to workspaces </BackButton>

      <Container>
        <Title>Edit Article</Title>

        <form onSubmit={handleUpdate} style={{ width: "100%" }}>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />

          <ReactQuill
            value={content}
            onChange={setContent}
            style={{ height: "300px", marginBottom: "60px" }}
          />

  <AttachmentsWrapper>

          <Column>
            <AttachmentUploader
              articleId={articleId}
              onUploaded={handleAttachmentAdded}
            />
          </Column>

          <Column>
            <AttachmentList
              articleId={articleId}
              attachments={attachments}
              onDelete={handleAttachmentDeleted}
            />
          </Column>

        </AttachmentsWrapper>
        
          <Button type="submit">Save</Button>
        </form>

      
      </Container>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}
