import React, { useEffect, useState } from 'react';
import { Layout, Typography, Radio, Button, Modal, Image } from 'antd';
import { headerStyle, contentStyle, footerStyle} from '../styles/appStyle.js';
import logo from '../logo.jpg'; 
import PrincipalScreen from './PrincipalScreen.js';
import LoginComponent from './LoginComponent.js';
import {SolutionOutlined } from '@ant-design/icons';
import '../css/styles.css'; // Importa tu archivo CSS aquí
import MenuComponent from './MenuComponent.js';
import TableComponent from './TableComponent.js';


const { Title, Paragraph, Link} = Typography;
const { Header, Content, Footer, Sider } = Layout;

const CategorySelectionPage = () => {
  const [change, setChange] = useState(true);
  const categories = ['investigación', 'deporte', 'música']; 
  const [selectedCategory, setSelectedCategory] = useState('investigación');
  const [user, setUser] = useState(null);
  const [seeStreaks, setSeeStreaks] = useState(false);



  const handleStartGame = (selectedCategory) => {
    Modal.confirm({
      title: 'Comenzar juego',
      content: `Estás a punto de comenzar el juego con la categoría "${selectedCategory}". ¿Estás seguro?`,
      onOk: () => {
        console.log(`Comenzando el juego con la categoría "${selectedCategory}"`);
        setChange(false);
      },
      onCancel: () => {}
    });
  };


  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const checkAuthentication = async () => {
    const userGet = localStorage.getItem("user");
    if (userGet !== null) {
      setUser(JSON.parse(userGet));
    }
  };

  useEffect(() => {    
    console.log("cada vez que recargo en seleccion dice patata :P");
    checkAuthentication();
  }, []);

  
  



  return (
    <>
      {user === null ? (
        <LoginComponent />
      ) : (
        <>
          {change ? (
            <Layout style={{ minHeight: "100vh" }}>
              <MenuComponent user={user}></MenuComponent>
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
                    <Title level={1} style={{ marginTop: '20px', fontSize: '5vh', fontWeight: 'bold' }}>Wiki Trivial</Title>
                    <Title level={2} style={{ marginTop: '5px', fontSize: '40px'}}>Juego de preguntas y respuestas</Title>
                  </Content>
                </Layout>
              </Header>
              <Content style={contentStyle}>
              <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '10px'
                  }}>
                <Title level={1} style={{ color: '#004aad', marginTop: '10px' }}>¡Bienvenid@, {user.displayName}!</Title>
                  <Modal
                        title="Clasificación de rachas de preguntas contestadas"
                        open={seeStreaks}
                        onCancel={() => setSeeStreaks(false)}
                        footer={null}
                        width={900}
                    >
                      <TableComponent user={user}></TableComponent>
                    </Modal>
                    <Button style={{marginRight:'60px'}} 
                      type="primary" icon={<SolutionOutlined />} size='large' onClick={()=>setSeeStreaks(true)}>
                      Ver clasificación
                    </Button>
                </div>
                <Paragraph style={{ fontSize: "20px"}}>
                  La información de las siguientes preguntas se ha recogido de
                  <Link href="https://www.wikidata.org/?uselang=es" target="_blank" style={{ fontSize: "20px" }}> Wikidata. </Link>
                  Las respuestas que usted proporcione se utilizarán para enriquecer la misma. Selecciona la categoría con la que quieres empezar a jugar.
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
                          {category}
                        </Radio.Button>
                      ))}
                    </Radio.Group>
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => handleStartGame(selectedCategory)}
                      style={{ marginTop: '20px' }}>
                      Comenzar juego
                    </Button>
                  </div>
  
                </Content>
              </Content>
              <Footer style={footerStyle}>Wiki Trivial</Footer>
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