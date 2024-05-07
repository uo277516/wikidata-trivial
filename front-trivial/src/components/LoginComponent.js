
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
    const userData = await fetchUserData(); //datos del usuario
    localStorage.setItem('user', JSON.stringify(userData)); //almacenar datos en localStorage
  };

  const checkAuthentication = async () => {
    try {
      const authenticated = await isAuthenticated(); //usuario autenticado
      setIsLoggedIn(authenticated);
      if (authenticated) {
        const userData = await fetchUserData(); //datos del usuario
        localStorage.setItem('user', JSON.stringify(userData)); //almacenar datos en localStorage
      }
    } catch (error) {
      console.error('Error al verificar la autenticación:', error);
      setIsLoggedIn(false);
    }
    
  };
  
  const isAuthenticated = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/checkAuth");
      if (response.ok) {
        const data = await response.json();
        return data.authenticated; //true si lo está, false si no
      } else {
        return false; //no ok devuelve error
      }
    } catch (error) {
      console.error('Error al verificar la autenticación:', error);
      return false; //si error false tb
    }
  };
  
  const fetchUserData = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/data.json");
      if (response.ok) {
        return await response.json();
      } else {
        console.error('Error al obtener los datos del usuario:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      return null;
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
                  La información de las siguientes preguntas se ha recogido de
                  <Link href="https://www.wikidata.org/?uselang=es" target="_blank" style={{ fontSize: "20px" }}> Wikidata. </Link>
                  Las respuestas que usted proporcione se utilizarán para enriquecer la misma. Para poder empezar a jugar, necesitas iniciar sesión en la plataforma con tu usuario.
            </Paragraph>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              onClick={() => handleLogin()}
              style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px' }}
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