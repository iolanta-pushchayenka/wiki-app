// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, Link } from "react-router-dom";
// import Header from "../components/Header";
// import styled from "styled-components";
// import AttachmentList from "../components/AttachmentList";

// const Wrapper = styled.div`
//   max-width: 900px;
//   margin: 20px auto;
//   padding: 20px;
// `;

// const Warning = styled.div`
//   background: #fff3cd;
//   padding: 12px;
//   border-left: 4px solid #ffcc00;
//   margin-bottom: 20px;
//   border-radius: 4px;
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

// export default function VersionViewPage() {
//     const { wsId, articleId, versionNumber } = useParams();
//     const [version, setVersion] = useState(null);

//     useEffect(() => {
//         axios
//             .get(`http://localhost:3000/articles/${articleId}/versions/${versionNumber}`)
//             .then((res) => {
//                 setVersion(JSON.parse(JSON.stringify(res.data)));
//             })
//             .catch((err) => console.error(err));
//     }, [articleId, versionNumber]);

//     if (!version) return <p>Loading...</p>;

//     return (
//         <>
//             <Header />
//             <BackButton to={`/workspaces/${wsId}/articles/${articleId}/versions`}>
//                 ← Back to versions
//             </BackButton>

//             <Wrapper key={version.id}>
//                 <Warning>
//                     <strong>This is an old version (#{version.versionNumber}).</strong>
//                     <br />
//                     Editing is disabled.
//                 </Warning>

//                 <h2>{version.title}</h2>

//                 <div
//                     dangerouslySetInnerHTML={{ __html: version.content }}
//                     style={{ marginBottom: "30px" }}
//                 />

//                 <AttachmentList
//                     articleId={articleId}
//                     attachments={version.attachments ? JSON.parse(JSON.stringify(version.attachments)) : []}
//                     readonly={true}
//                 />

//             </Wrapper>
//         </>
//     );
// }


import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import styled from "styled-components";
import AttachmentList from "../components/AttachmentList";
import api from "../api/axios"; // ✅ ВАЖНО

const Wrapper = styled.div`
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
`;

const Warning = styled.div`
  background: #fff3cd;
  padding: 12px;
  border-left: 4px solid #ffcc00;
  margin-bottom: 20px;
  border-radius: 4px;
`;

const BackButton = styled(Link)`
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-decoration: none;
  color: black;
  font-size: 14px;
  width: fit-content;
  margin-left: 25px;

  &:hover {
    background-color: #f0f0f0;
  }
`;

export default function VersionViewPage() {
  const { wsId, articleId, versionNumber } = useParams();
  const [version, setVersion] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVersion() {
      try {
        const res = await api.get(
          `/articles/${articleId}/versions/${versionNumber}`
        );
        setVersion(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load version");
      }
    }

    fetchVersion();
  }, [articleId, versionNumber]);

  if (error) return <p>{error}</p>;
  if (!version) return <p>Loading...</p>;

  return (
    <>
      <Header />

      <BackButton to={`/workspaces/${wsId}/articles/${articleId}/versions`}>
        ← Back to versions
      </BackButton>

      <Wrapper>
        <Warning>
          <strong>This is version #{version.versionNumber}.</strong>
          <br />
          Editing is disabled.
        </Warning>

        <h2>{version.title}</h2>

        <div
          dangerouslySetInnerHTML={{ __html: version.content }}
          style={{ marginBottom: "30px" }}
        />

        <AttachmentList
          articleId={articleId}
          attachments={version.attachments || []}
          readonly={true}
        />
      </Wrapper>
    </>
  );
}
