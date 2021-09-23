import styled from 'styled-components';

export const NavItem = styled.div`
  width: 36px;
  height: 36px;
  margin-top: 3px;
  border-radius: 50%;

  &:hover {
    background-color: #ddd;
    cursor: pointer;
  }

  .dropdown {
    display: table;
    text-align: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;

    div:first-child {
      display: table-cell;
      vertical-align: middle;
      height: 100%;
    }
  }

  .dropdown-menu {
    min-width: 150px;
    li {
      margin-bottom: 0;
      padding: 0;
      box-shadow: none;
      border-radius: 0;
    }
  }
`;

export const FeedLayout = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const TabLayout = styled.div`
  overflow: hidden;
  width: 500px;
`;

export const HeaderTab = styled.div`
  position: fixed;
  width: 500px;
`;

export const FormContainer = styled.div`
  padding: 15px 20px 0px 20px;
  flex: 1;
`;

export const NewsFeedLayout = styled.div`
  ul {
    width: 500px;
    padding: 0px;

    li {
      list-style-type: none;
      margin-bottom: 20px;
      border-radius: 10px;
      padding: 10px;
      box-shadow: 0 0 5px 0 rgb(0 0 0 / 8%);
    }
  }
`;

export const HeaderFeed = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const FirstSection = styled.div`
  display: flex;

  img {
    width: 36px;
    height: 36px;
    margin-top: 3px;
    border-radius: 50%;
  }
`;

export const TypeOfContent = styled.div`
  p {
    color: green;
    marginbottom: 0px;
  }
`;

export const Hours = styled.div`
  display: flex;
`;

export const BodyFeed = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;

  b {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  img {
    border-radius: 20px;
  }
`;

export const Attachments = styled.div`
  a {
    display: flex;
  }

  &:hover {
    background: rgba(10, 30, 65, 0.08);
    cursor: pointer;
  }
`;

export const AttachmentsIcon = styled.div`
  width: 100px;
  border-radius: 4px;
  font-size: 36px;
  padding: 20px;
  text-align: center;
  color: #6569df;
  background: rgba(10, 30, 65, 0.08);
`;

export const AttachmentsTitle = styled.div`
  padding: 20px 30px;
  font-size: 24px;
  color: black;
  align-items: center;
`;
