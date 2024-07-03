
import React, { useEffect, useState } from 'react';
import { Layout, Typography, Button, Image, notification } from 'antd';
import { headerStyle, contentStyle, footerStyle} from '../styles/appStyle.js';
import logo from '../logo.png'; 
import CategorySelectionPage from './CategorySelectionPage.js';
import { LoginOutlined } from '@ant-design/icons';
import MenuComponent from './MenuComponent.js';
import { useTranslation } from 'react-i18next';
import '../styles/styles.css'; 


const { Title, Paragraph, Link} = Typography;
const { Header, Content, Footer, Sider } = Layout;

/**
 * Login component for the web application.
 * @component
 * @returns {React.JSX.Element} Rendered component.
 */
const LoginComponent = () => {

  const { t } = useTranslation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!localStorage.getItem("from", "login"))
    localStorage.setItem("from", "nothing");
  
  /**
   * Lifecycle hook for checking user authentication on component mount.
   * @function useEffect
   * @returns {void}
   */
  useEffect(() => {
    if (localStorage.getItem("from")==="nothing") {
      setIsLoggedIn(false);
    } else {
      if (localStorage.getItem("isLogged")==="true") {
        localStorage.setItem("from", "nothing");
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }
  }, []);


  /**
   * Handles login by redirecting the user to the authentication URL and
   * getting the user's data.
   * @function handleLogin
   * @async
   * @returns {void}
   */
  const handleLogin = async () => {
    console.log("User logged in");
    const redirectUrl = process.env.REACT_APP_BACKEND_BASE_URL + "/login";
    window.location.href = redirectUrl;
    
    localStorage.setItem("isLogged", "true");
    localStorage.setItem("from", "login");
  };



  return (
    <>
      {isLoggedIn ? (
        <CategorySelectionPage />
      ) : (
        <Layout style={{ minHeight: "100vh" }}>
          <MenuComponent user={null} mode='horizontal'></MenuComponent>
          <Header style={headerStyle}>
            <Layout id='header' style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white'}}>
              <Sider style={{flex:1, width: '20%', textAlign: 'center', lineHeight: '120px', color: '#fff', backgroundColor: 'white', paddingTop: '20px' }}>
                <Image
                  width={200}
                  src={logo}
                  style={{ paddingLeft: '10px',marginBottom: '20px' }}
                  alt='Logo image'
                />
              </Sider>
                <Content id='content' style={{ flex: 2, textAlign: 'left', paddingLeft: '20px', color: 'black', backgroundColor: 'white'}}>
                  <Title level={1} style={{ marginTop: '20px', fontWeight: 'bold' }}>Wiki Trivial</Title>
                  <Title level={2} style={{ marginTop: '5px'}}>{t('login.title')}</Title>
                </Content>
            </Layout>
          </Header>
          <Content style={contentStyle}>
            <Title level={1} style={{ color: '#004aad', margin: '0 auto' }}>{t('login.login')}</Title>
            <Paragraph style={{ fontSize: "20px", marginTop: '20px' }}> 
                  {t('login.info1')}
                  <Link href="https://www.wikidata.org/?uselang=es" target="_blank" style={{ fontSize: "20px" }}>Wikidata</Link>
                  {t('login.info2')}
            </Paragraph>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              onClick={() => handleLogin()}
              icon={<LoginOutlined/>}
              style={{ position: 'relative', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px' }}
              >
              {t('login.log_in')}
            </Button>
          </Content>
          <Footer style={footerStyle}> {t('footer.info')}<a href="https://www.icons8.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>Icons8</a></Footer>
        </Layout>
      )}
    </>
  );  
};

export default LoginComponent;