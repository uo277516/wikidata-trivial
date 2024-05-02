
import React, { useEffect, useState } from 'react';
import { Layout, Typography, Radio, Button, Modal, Image } from 'antd';
import { headerStyle, contentStyle, footerStyle, headerRightStyle, siderStyle, titleOneStyle, titleTwoStyle} from '../styles/appStyle.js';
import logo from '../logo.png'; 
import CategorySelectionPage from './CategorySelectionPage.js';


const { Title, Paragraph, Link} = Typography;
const { Header, Content, Footer, Sider } = Layout;


const LoginComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const handleLogin = async () => {
    const redirectUrl = process.env.REACT_APP_BACKEND_BASE_URL + "/login";
    window.location.href = redirectUrl;
  };

  const checkAuthentication = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/data.json");
      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsLoggedIn(false);
    }
    
  };

  return (
    <>
      {isLoggedIn ? (
        <CategorySelectionPage />
      ) : (
        <Layout style={{ minHeight: "100vh" }}>
          <Header style={headerStyle}>
            <Layout>
              <Sider width="20%" style={siderStyle}>
                <Image
                  width={200}
                  src={logo}
                />
              </Sider>
              <Content style={headerRightStyle}>
                <Title level={1} style={titleOneStyle}>Wiki Trivial</Title>
                <Title level={2} style={titleTwoStyle}>Juego de preguntas y respuestas</Title>
              </Content>
            </Layout>
          </Header>
          <Content style={contentStyle}>
            <Title level={1} style={{ color: '#004aad', margin: '0 auto' }}>Login</Title>
            <Paragraph style={{ fontSize: "20px", marginTop: '20px' }}>
              Para poder empezar a jugar, necesitas iniciar sesión en Wikidata con tu usuario.
            </Paragraph>
            <Button
              type="primary"
              size="large"
              onClick={() => handleLogin()}
              style={{ marginTop: '20px' }}
            >
              Log in
            </Button>
          </Content>
          <Footer style={footerStyle}>Wiki Trivial</Footer>
        </Layout>
      )}
    </>
  );  
};

export default LoginComponent;