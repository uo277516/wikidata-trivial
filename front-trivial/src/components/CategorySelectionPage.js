import React from 'react';
import { Layout, Typography, Radio, Button, Modal } from 'antd';
import { headerStyle, contentStyle, footerStyle } from '../styles/appStyle.js';
import { useNavigate } from 'react-router-dom';


const { Title, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;

const CategorySelectionPage = () => {
  const navigate = useNavigate();

  const handleStartGame = (selectedCategory) => {
    Modal.confirm({
      title: 'Comenzar juego',
      content: `Estás a punto de comenzar el juego con la categoría "${selectedCategory}". ¿Estás seguro?`,
      onOk: () => {
        navigate(`/game/${selectedCategory}`);
        console.log(`Comenzando el juego con la categoría "${selectedCategory}"`);
      },
      onCancel: () => {}
    });
  };

  const categories = ['investigadores', 'futbolistas']; 
  const [selectedCategory, setSelectedCategory] = React.useState('investigadores');

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={headerStyle}>
        <Title level={1} style={{ color: 'white', margin: '0 auto' }}>Selección de Categoría</Title>
      </Header>
      <Content style={contentStyle}>
        <Content width="100%" style={contentStyle}>
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Radio.Group 
              value={selectedCategory} 
              onChange={(e) => handleCategoryChange(e)}>
              {categories.map((category) => (
                <Radio.Button key={category} value={category}>
                  {category}
                </Radio.Button>
              ))}
            </Radio.Group>
            <Paragraph style={{ fontSize: "20px", marginTop: '20px' }}>
              Selecciona la categoría con la que quieres jugar.
            </Paragraph>
            <Button 
              type="primary" 
              size="large" 
              onClick={() => handleStartGame(selectedCategory)} 
              style={{ marginTop: '50px' }}>
              Comenzar juego
            </Button>
          </div>
        </Content>
      </Content>
      <Footer style={footerStyle}>Wiki Trivial</Footer>    
    </Layout>
  );
};

export default CategorySelectionPage;