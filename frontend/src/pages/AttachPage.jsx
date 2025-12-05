import AttachmentUploader from '../components/AttachmentUploader';
import AttachmentList from '../components/AttachmentList';
import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    gap: 20px;
`;

export default function AttachPage({ article, setArticle, id }) {

  const attachments = article.attachments || [];

  const handleAttachmentAdded = (attachment) => {
    setArticle(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), attachment]
    }));
  };

  const handleAttachmentDeleted = (attachmentId) => {
    setArticle(prev => ({
      ...prev,
      attachments: prev.attachments.filter(a => a.id !== attachmentId)
    }));
  };

  return (
    <Wrapper>
      <AttachmentUploader
        articleId={id}
        onUploaded={handleAttachmentAdded}
      />

      <AttachmentList
        articleId={id}
        attachments={attachments}
        onDelete={handleAttachmentDeleted}
      />
    </Wrapper>
  );
}
