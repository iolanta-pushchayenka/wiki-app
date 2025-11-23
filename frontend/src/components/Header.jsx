import styled from 'styled-components';

const HeaderWrapper = styled.header`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  border-size: 20px;
  background-color: white;
`;

const Title = styled.h1`
  font-size: 25px;
  margin: 0;
  color: black;
  
`;

export const SearchInput = styled.input`
  padding: 8px 12px;
  width: 200px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 14px;
  margin-right: 730px;

  &:focus {
    outline: none;
    border-color: #888;
  }
`;

export default function Header() {
  return (
    <HeaderWrapper>
      <Title>📝 My Wiki</Title>
      <SearchInput type="text" placeholder="Search..." />
    </HeaderWrapper>
  );
}
