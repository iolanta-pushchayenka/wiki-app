// import styled from "styled-components";
// import axios from "axios";

// const Box = styled.div`
//   background: #f0fafa;
//   border-radius: 10px;
//   display: inline-block;
//   max-width: 450px;
//   padding: 20px 30px;
// `;

// const Item = styled.div`
//   border-bottom: 1px solid #ddd;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 6px 0;

//   a {
//     text-decoration: none;
//     color: inherit;
//   }

//   button {
//     border: none;
//     background: transparent;
//     color: black;
//     cursor: pointer;
//     font-size: 14px;
//   }
// `;

// export default function AttachmentList({ articleId, attachments, onDelete, readonly = false }) {
//   const handleDelete = async (attachmentId) => {

//     if (readonly) return;

//     if (!window.confirm("Удалить вложение?")) return;

//     try {
//       await axios.delete(
//         `http://localhost:3000/articles/${articleId}/attachments/${attachmentId}`
//       );

//       if (onDelete) onDelete(attachmentId);


//     } catch (err) {
//       console.error(err);
//       alert("Ошибка при удалении файла");
//     }
//   };

//   if (!attachments || attachments.length === 0)
//     return <p>No attachments</p>;

//   return (
//     <Box>
//       <h4>Attachments</h4>
//       {attachments.map(att => (
//         <Item key={att.id}>
//           <a
//             href={`http://localhost:3000${att.url}`}
//             target="_blank"
//             rel="noreferrer"
//           >
//             📎 {att.originalName}
//           </a>
//           {!readonly && (<button type="button" onClick={() => handleDelete(att.id)}>✖</button>)}
//         </Item>
//       ))}
//     </Box>
//   );
// }


import styled from "styled-components";
import axios from "axios";

const Box = styled.div`
  background: #f0fafa;
  border-radius: 10px;
  display: inline-block;
  max-width: 450px;
  padding: 20px 30px;
`;

const Item = styled.div`
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    border: none;
    background: transparent;
    color: black;
    cursor: pointer;
    font-size: 14px;
  }
`;

export default function AttachmentList({ articleId, attachments, onDelete, readonly = false }) {
  const handleDelete = async (attachmentId) => {
    if (readonly) return;
    if (!window.confirm("Удалить вложение?")) return;

    try {
      await axios.delete(
        `http://localhost:3000/articles/${articleId}/attachments/${attachmentId}`
      );
      if (onDelete) onDelete(attachmentId);
    } catch (err) {
      console.error(err);
      alert("Ошибка при удалении файла");
    }
  };

  if (!attachments || attachments.length === 0)
    return <p>No attachments</p>;

  // Создаём глубокую копию для безопасного отображения
  const safeAttachments = JSON.parse(JSON.stringify(attachments));

  return (
    <Box>
      <h4>Attachments</h4>
      {safeAttachments.map(att => (
        <Item key={att.id}>
          <a
            href={`http://localhost:3000${att.url}`}
            target="_blank"
            rel="noreferrer"
          >
            📎 {att.originalName}
          </a>
          {!readonly && (
            <button type="button" onClick={() => handleDelete(att.id)}>✖</button>
          )}
        </Item>
      ))}
    </Box>
  );
}
