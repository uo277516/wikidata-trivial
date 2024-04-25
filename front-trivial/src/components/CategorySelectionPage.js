import React, { useEffect, useState } from 'react';
import { Layout, Typography, Radio, Button, Modal, Image } from 'antd';
import { headerStyle, contentStyle, footerStyle, headerRightStyle, siderStyle, titleOneStyle, titleTwoStyle} from '../styles/appStyle.js';
import logo from '../logo.png'; 
import PrincipalScreen from './PrincipalScreen.js';

const { Title, Paragraph, Link} = Typography;
const { Header, Content, Footer, Sider } = Layout;

const CategorySelectionPage = () => {
  const [change, setChange] = useState(true);
  const categories = ['investigadores', 'futbolistas']; 
  const [selectedCategory, setSelectedCategory] = useState('investigadores');

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



  return (
    <>
      {change ? (
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
            <Title level={1} style={{ color: '#004aad', margin: '0 auto' }}>Selección de Categoría</Title>
            <Paragraph style={{ fontSize: "20px", marginTop: '20px' }}>
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
        <PrincipalScreen category={selectedCategory} categories={categories} />
      )}
    </>
  );  
};

export default CategorySelectionPage;