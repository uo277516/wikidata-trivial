import React, { useEffect, useState } from 'react';
import { Layout, Typography, Radio, Button, Modal, Image } from 'antd';
import { headerStyle, contentStyle, footerStyle} from '../styles/appStyle.js';
import logo from '../logo.jpg'; 
import PrincipalScreen from './PrincipalScreen.js';
import LoginComponent from './LoginComponent.js';
import {SolutionOutlined } from '@ant-design/icons';
import '../styles/styles.css'; 
import MenuComponent from './MenuComponent.js';
import TableComponent from './TableComponent.js';
import { useTranslation } from 'react-i18next';



const { Title, Paragraph, Link} = Typography;
const { Header, Content, Footer, Sider } = Layout;


/**
 * Category selection component for the game.
 * 
 * @component
 * @returns {React.JSX.Element} Rendered component.
 */
const CategorySelectionPage = () => {
  const [change, setChange] = useState(true);
  const categories = ['investigación', 'deporte', 'música']; 
  const [selectedCategory, setSelectedCategory] = useState('investigación');
  const [user, setUser] = useState(null);
  const [seeStreaks, setSeeStreaks] = useState(false);
  const { t } = useTranslation();



  /**
   * Handles the start of the game by displaying a confirmation modal.
   * @function handleStartGame
   * @param {string} selectedCategory - The selected category
   * @returns {void}
   */
  const handleStartGame = (selectedCategory) => {
    Modal.info({
      title: t('cat.startButton'),
      content: (
        <>
          <p>{t('cat.modalStart1', { selectedCategory: t(`cat.${selectedCategory}`) })}</p>
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() =>  ok()} type="primary">
              OK
            </Button>
            <Button onClick={() =>  cancel()} style={{ marginLeft: 10 }}>
              {t('cancel')}
            </Button>
          </div>
        </>
      ),
      okButtonProps: { style: { display: 'none' } }, 
      cancelButtonProps: { style: { display: 'none' } }, 
    });
  };

  /**
   * Function that is executed when the start of the game is confirmed.
   * @function ok
   * @returns {void}
   */
  const ok = () => {
    setChange(false);
    cancel();
  }

  /**
   * Function that is executed when the game start modal is cancelled.
   * @function cancel
   * @returns {void}
   */
  const cancel = () => {
    Modal.destroyAll(); 
  };


  /**
   * Handles the change of the selected category.
   * @function handleCategoryChange
   * @param {Event} e - Category change event.
   * @returns {void}
   */
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };


  /**
   * Verify user authentication by getting the localStorage user.
   * @function checkAuthentication
   * @async
   * @return {void}
   */
  const checkAuthentication = async () => {
    const userGet = localStorage.getItem("user");
    if (userGet !== null) {
      setUser(JSON.parse(userGet));
    }
  };


  /**
   * Lifecycle hook for checking user on component mount.
   * @function useEffect
   * @returns {void}
   */
  useEffect(() => {    
    checkAuthentication();
  }, []);


  return (
    <>
      {user === null ? (
        <LoginComponent />
      ) : (
        <>
          {change ? (
            <Layout style={{ minHeight: "100vh" , backgroundColor: 'white'}}>
              <MenuComponent user={user} mode='horizontal'></MenuComponent>
              <Header  style={headerStyle}>
                <Layout id='header' style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white'}}>
                  <Sider style={{ flex: 1, width: '20%', textAlign: 'center', lineHeight: '120px', color: '#fff', backgroundColor: 'white', paddingTop: '20px' }}>
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
              <div id='login_div' style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '10px'
                  }}>
                <Title level={1} style={{ color: '#004aad', marginTop: '10px' }}>{t('cat.welcome')} {user.displayName}!</Title>
                  <Modal
                        title={t('cat.tableTitle')}
                        open={seeStreaks}
                        onCancel={() => setSeeStreaks(false)}
                        footer={null}
                        width={900}
                    >
                      <TableComponent user={user}></TableComponent>
                    </Modal>
                    <Button style={{marginRight:'60px'}} 
                      type="primary" icon={<SolutionOutlined />} size='large' onClick={()=>setSeeStreaks(true)}>
                      {t('cat.buttonClasification')}
                    </Button>
                </div>
                <Paragraph style={{ fontSize: "20px"}}>
                  {t('login.info1')}
                  <Link href="https://www.wikidata.org/?uselang=es" target="_blank" style={{ fontSize: "20px" }}>Wikidata</Link>
                  {t('cat.info')}
                </Paragraph>
                
                <Content width="100%" style={contentStyle}>
                  <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <Radio.Group
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e)}
                      style={{ display: 'block' }}>
                      {categories.map((category) => (
                        <Radio.Button key={category} value={category}
                          style={{ display: 'block', width: '40%', margin: '0 auto 10px' }}>
                          {t(`cat.${category}`)}
                        </Radio.Button>
                      ))}
                    </Radio.Group>
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => handleStartGame(selectedCategory)}
                      style={{ marginTop: '20px' }}>
                      {t('cat.startButton')}
                    </Button>
                  </div>
  
                </Content>
              </Content>
              <Footer style={footerStyle}> {t('footer.info')}<a href="https://www.icons8.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>Icons8</a></Footer>
            </Layout>
          ) : (
            <PrincipalScreen
              category={selectedCategory}
              categories={categories}
              user= {user} />
          )}
        </>
      )}
    </>
  )};
  
export default CategorySelectionPage;