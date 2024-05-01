import React, { useEffect, useState } from 'react';
import { Layout, Typography, Radio, Button, Modal, Image } from 'antd';
import { headerStyle, contentStyle, footerStyle, headerRightStyle, siderStyle, titleOneStyle, titleTwoStyle} from '../styles/appStyle.js';
import logo from '../logo.png'; 
import PrincipalScreen from './PrincipalScreen.js';
import CategorySelectionPage from './CategorySelectionPage.js';
import { redirect } from 'react-router';

const { Title, Paragraph, Link} = Typography;
const { Header, Content, Footer, Sider } = Layout;

const LoginComponent = () => {
  
  const [login, setLogin] = useState(false); 

  const handleLogin = async () => {


    const redirectUrl = process.env.REACT_APP_BACKEND_BASE_URL + "/login";
    window.location.href = redirectUrl;
    setTimeout(3000);
    setLogin(true);
  };


  return (
    <>
      {login ? (
        <CategorySelectionPage/>
      ) : (
        <Content>
            <h3>Necesitas logearte</h3>
            <Button onClick={handleLogin}>Login!!</Button>
        </Content>
      )}
    </>
  );  
};

export default LoginComponent;