// import React, { useState, useRef } from "react";
// import axios from "axios";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import styled from "styled-components";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useParams, useSearchParams, Link } from "react-router-dom";

// const Button = styled.button`
//   background-color: #AFEEEE;
//   border: none;
//   border-radius: 5px;
//   padding: 10px 20px;
//   color: black;
//   font-size: 16px;
//   cursor: pointer;
//   margin-top: 20px;
// `;

// const FormWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding: 40px;
//   width: 100%;
//   margin-top: 40px;
// `;

// const FormContainer = styled.form`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   width: 600px;
// `;


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

// const Input = styled.input`
//   border: 2px solid #AFEEEE;
//   border-radius: 5px;
//   padding: 10px;
//   width: 50%;
//   font-size: 16px;
//   margin-bottom: 20px;
// `;

// function ArticleForm({ onCreated }) {
//   const { wsId } = useParams();
//   const [searchParams] = useSearchParams();

//   const defaultTitle = searchParams.get("title") || "";

//   const [title, setTitle] = useState(defaultTitle);
//   const [content, setContent] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const toastId = useRef(null);

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setIsSubmitting(true);
//   //   setLoading(true);

//   //   const plainContent = content.replace(/<[^>]*>/g, "").trim();

//   //   if (!title.trim() || !plainContent) {
//   //     toast.error("Please fill the title and content");
//   //     setIsSubmitting(false);
//   //     setLoading(false);
//   //     return;
//   //   }

//   //   try {
//   //     const res = await axios.post(
//   //       `http://localhost:3000/workspaces/${wsId}/articles`,
//   //       {
//   //         title: title.trim(),
//   //         content
//   //       }
//   //     );

//   //     toast.success("Article created!");

//   //     setTitle("");
//   //     setContent("");

//   //     if (onCreated) onCreated(res.data);
//   //   } catch (err) {
//   //     console.error(err);
//   //     toast.error("Error when saving");
//   //   } finally {
//   //     setLoading(false);
//   //     setIsSubmitting(false);
//   //   }
//   // };


// //   const handleSubmit = async (e) => {
// //   e.preventDefault();
// //   setIsSubmitting(true);
// //   setLoading(true);

// //   const plainContent = content.replace(/<[^>]*>/g, "").trim();

// //   if (!title.trim() || !plainContent) {
// //     toast.error("Please fill the title and content");
// //     setIsSubmitting(false);
// //     setLoading(false);
// //     return;
// //   }

// //   try {
// //     const res = await axios.post(
// //       `http://localhost:3000/workspaces/${wsId}/articles`,
// //       {
// //         title: title.trim(),
// //         content
// //       }
// //     );

// //     // res.data = { article, version }
// //     const { article, version } = res.data;

// //     // Объединяем в формат, удобный для списка статей
// //     const articleWithLatest = { ...article, latestVersion: version };

// //     toast.success("Article created!");

// //     setTitle("");
// //     setContent("");

// //     if (onCreated) onCreated(articleWithLatest); // передаём готовый объект
// //   } catch (err) {
// //     console.error(err);
// //     toast.error("Error when saving");
// //   } finally {
// //     setLoading(false);
// //     setIsSubmitting(false);
// //   }
// // };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setIsSubmitting(true);
//   setLoading(true);

//   const plainContent = content.replace(/<[^>]*>/g, "").trim();

//   if (!title.trim() || !plainContent) {
//     toast.error("Please fill the title and content");
//     setIsSubmitting(false);
//     setLoading(false);
//     return;
//   }

//   try {
//     const res = await axios.post(
//       `http://localhost:3000/workspaces/${wsId}/articles`,
//       { title: title.trim(), content }
//     );

//     // res.data = { article, version }
//     const { article, version } = res.data;

//     // Создаём корректный объект, который ожидает список статей
//     const articleForList = {
//       ...article,
//       ArticleVersions: [version], // Вставляем версию в массив
//       latestVersion: version
//     };

//     toast.success("Article created!");
//     setTitle("");
//     setContent("");

//     if (onCreated) onCreated(articleForList); // передаём готовый объект
//   } catch (err) {
//     console.error(err);
//     toast.error("Error when saving");
//   } finally {
//     setLoading(false);
//     setIsSubmitting(false);
//   }
// };

//   return (
//     <>

//       <BackButton to="/"> ← Back to workspaces </BackButton>

//       <FormWrapper>
//         <h2>Create your article</h2>

//         <FormContainer onSubmit={handleSubmit}>
//           <Input
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Enter title..."
//           />

//           <ReactQuill
//             value={content}
//             onChange={setContent}
//             style={{
//               height: "350px",
//               marginBottom: "60px",
//               width: "100%"
//             }}
//           />



//           <Button type="submit" disabled={isSubmitting}>
//             {loading ? "Saving..." : "Add Article"}
//           </Button>
//         </FormContainer>
//       </FormWrapper>

//       <ToastContainer position="top-center" autoClose={3000} />
//     </>
//   );
// }

// export default ArticleForm;




import React, { useState, useRef } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useSearchParams, Link } from "react-router-dom";

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

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  width: 100%;
  margin-top: 40px;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 600px;
`;

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

const Input = styled.input`
  border: 2px solid #AFEEEE;
  border-radius: 5px;
  padding: 10px;
  width: 50%;
  font-size: 16px;
  margin-bottom: 20px;
`;

function ArticleForm({ onCreated }) {
  const { wsId } = useParams();
  const [searchParams] = useSearchParams();
  const defaultTitle = searchParams.get("title") || "";

  const [title, setTitle] = useState(defaultTitle);
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoading(true);

    const plainContent = content.replace(/<[^>]*>/g, "").trim();

    if (!title.trim() || !plainContent) {
      toast.error("Please fill the title and content");
      setIsSubmitting(false);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:3000/workspaces/${wsId}/articles`,
        { title: title.trim(), content }
      );

      const { article, version } = res.data;

// Формируем объект для списка статей в Sidebar
const articleForList = {
  ...article,
  ArticleVersions: version ? [version] : [], // всегда массив
  latestVersion: version || null
};

toast.success("Article created!");
setTitle("");
setContent("");

// Передаём в родительский компонент
if (onCreated) onCreated(articleForList);

    } catch (err) {
      console.error(err);
      toast.error("Error when saving");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <BackButton to="/"> ← Back to workspaces </BackButton>

      <FormWrapper>
        <h2>Create your article</h2>

        <FormContainer onSubmit={handleSubmit}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title..."
          />

          <ReactQuill
            value={content}
            onChange={setContent}
            style={{ height: "350px", marginBottom: "60px", width: "100%" }}
          />

          <Button type="submit" disabled={isSubmitting}>
            {loading ? "Saving..." : "Add Article"}
          </Button>
        </FormContainer>
      </FormWrapper>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default ArticleForm;
