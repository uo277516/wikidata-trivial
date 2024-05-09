
import React, { useEffect, useState } from 'react';
import { Layout, Typography, Button, Image } from 'antd';
import { headerStyle, contentStyle, footerStyle} from '../styles/appStyle.js';
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
    if (localStorage.getItem("user")) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
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
            <Layout style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white'}}>
              <Sider style={{ width: '20%', textAlign: 'center', lineHeight: '120px', color: '#fff', backgroundColor: 'white', paddingTop: '20px' }}>
                <Image
                  width={200}
                  src={logo}
                  style={{ paddingLeft: '10px',marginBottom: '20px' }}
                />
              </Sider>
                <Content style={{ flex: 1, textAlign: 'left', paddingLeft: '20px', color: 'black', backgroundColor: 'white'}}>
                  <Title level={1} style={{ marginTop: '20px', fontSize: '50px', fontWeight: 'bold' }}>Wiki Trivial</Title>
                  <Title level={2} style={{ marginTop: '5px', fontSize: '40px'}}>Juego de preguntas y respuestas</Title>
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
              style={{ position: 'relative', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px' }}
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