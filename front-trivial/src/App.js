import './App.css';
import {Layout, Flex, Typography, Image} from 'antd';
import logo from './logo.png'; 
import React, { useEffect, useState } from 'react';


let App = () => {


  const {Text, Title, Paragraph, Link} = Typography;
  const { Header, Footer, Sider, Content } = Layout;

  const headerStyle = {
    textAlign: 'center',
    color: 'white',
    height: 250,
    paddingInline: 0,
    lineHeight: '64px',
    backgroundColor: 'white'
  };
  const contentStyle = {
    textAlign: 'left',
    paddingLeft: '20px',
    minHeight: 120,
    lineHeight: '120px',
    color: 'black',
    backgroundColor: 'white', //color de fondo de donde tengo todo lo que ye la app
  };
  const headerRightStyle = {
    textAlign: 'left',
    paddingLeft: '0px',
    minHeight: 120,
    lineHeight: '120px',
    color: 'black',
    backgroundColor: 'white',
    paddingTop: '30px'
  };
  const siderStyle = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: 'white',
    paddingTop: '20px'
  };
  const footerStyle = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4096ff',
  };
  const questionsStyle = {

  };
  const titleOneStyle = {
    marginTop: '20px', 
    fontSize: '50px' ,
    fontWeight: 'bold'
  };
  const titleTwoStyle = {
    marginTop: '5px', 
    fontSize: '40px' 
  };


  const [investigatorLabels, setInvestigatorLabels] = useState([]);


  const fetchData = async () => {
    try {
      let response = await fetch(
        process.env.REACT_APP_BACKEND_BASE_URL + "/P19",
        {
            method: "GET"
        });

      if (response.ok) {
          let jsonData = await response.json();
          const labels = jsonData.map(item => item.investigatorLabel);
          setInvestigatorLabels(labels);
          console.log(jsonData);
      } else {
          let responseBody = await response.json();
          let serverErrors = responseBody.errors;
          serverErrors.forEach(e => {
              console.log("Error: " + e.msg)
          })
      }
    } catch (error) {
        console.error("Error fetching data:",error);
    }
    };
  
  useEffect(() => {
    fetchData();
  }, []);





  return (
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

        <Layout>
          <Content width="60%" style={contentStyle}>   {/*para poner las preguntas y eso*/}
          
            <Paragraph style={{fontSize:"20px"}}>
              La información de las siguientes preguntas se ha recogido de 
              <Link href="https://www.wikidata.org/?uselang=es" target="_blank" style={{fontSize:"20px"}}> Wikidata. </Link>
              Las respuestas que usted proporcione se utilizarán para enriquecer la misma.
            </Paragraph>

            <Content style={{ textAlign: 'left', paddingLeft: '20px', minHeight: 120, lineHeight: '120px', color: 'black', backgroundColor: 'white' }}>
              {investigatorLabels.map((label, index) => (
                <Paragraph key={index}>{label}</Paragraph>
              ))}
            </Content>

          
          </Content>
          <Sider width="40%" style={siderStyle}>      {/*para poner lo de la racha*/}
            
          </Sider>
        </Layout>

        

      </Content>

      <Footer style={footerStyle}>Wiki Trivial</Footer>    
    </Layout>
  );
}

export default App;
