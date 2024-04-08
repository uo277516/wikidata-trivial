import './App.css';
import {Layout, Typography, Image, Input, Form, Button, Alert} from 'antd';
import logo from './logo.png'; 
import React, { useEffect, useState } from 'react';
const {Title, Paragraph, Link} = Typography;
const { Header, Footer, Sider, Content } = Layout;

let App = () => {

  //Para el número de respuestas seguidas
  const [answeredQuestions, setAnsweredQuestions] = useState(0); 


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
  
  const titleOneStyle = {
    marginTop: '20px', 
    fontSize: '50px' ,
    fontWeight: 'bold'
  };
  const titleTwoStyle = {
    marginTop: '5px', 
    fontSize: '40px' 
  };
  const formStyle= {
    marginBottom: '35px',
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



  //Manejar el número de respuestas seguidas
  const handleFormSubmit = async (values) => {
    if (values.respuesta && values.urldereferencia) {
      setAnsweredQuestions(answeredQuestions + 1);
    } else {
      console.error("Alguno o varios campos están sin completar");
    }
  };


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
          <Content width="100%" style={contentStyle}>   {/*para poner las preguntas y eso*/}
          
            <Paragraph style={{fontSize:"20px"}}>
              La información de las siguientes preguntas se ha recogido de 
              <Link href="https://www.wikidata.org/?uselang=es" target="_blank" style={{fontSize:"20px"}}> Wikidata. </Link>
              Las respuestas que usted proporcione se utilizarán para enriquecer la misma.
            </Paragraph>

               {/*para poner lo de las preguntas, lo de arriba es prueba de como seria ya con la base de datos pero no va
            <Content style={{ textAlign: 'left', paddingLeft: '20px', minHeight: 120, lineHeight: '120px', color: 'black', backgroundColor: 'white' }}>
              {investigatorLabels.map((label, index) => (
                <Paragraph key={index}>{label}</Paragraph>
              ))}
            </Content>
                */}
            
            <Content >
              
                <Paragraph style={{fontSize:"20px", marginBottom:"25px", marginTop:"50px"}}> ¿Ejemplo de pregunta? </Paragraph>
                <Form
                
                  name="basic"
                  style={{ maxWidth: 700 }}
                  initialValues={{ remember: true }}
                  autoComplete="off"
                  onFinish={handleFormSubmit}
                >
                  <Form.Item style={formStyle}
                    label="Respuesta"
                    name="respuesta"
                    rules={[{required:true, message: 'Debes de introducir la respuesta a la pregunta' }]}
                  >
                    <Input placeholder='Aquí va tu respuesta'></Input>
                  </Form.Item>

                  <Form.Item style={formStyle}
                    label="URL de referencia"
                    name="urldereferencia"
                    rules={[
                      {required:true, message: 'Debes de introducir una URL' },
                      { type: 'url', message: 'Por favor, introduce una URL válida' }
                    ]}
                  >
                    <Input placeholder='https://ejemplodeurl.com'></Input>
                  </Form.Item>

                  <Form.Item >
                    <Button type="primary" htmlType="submit">
                      Enviar respuesta
                    </Button>
                  </Form.Item>

                </Form>


            </Content>

            <Content >
            {answeredQuestions > 0 && (
              <Alert
                message={`¡Llevas ${answeredQuestions} preguntas contestadas seguidas!`}
                type="success"
                showIcon
                style={{ width: 700 }} 
              />
            )}
          </Content>

          
          </Content>
          
        </Layout>

        

      </Content>

      <Footer style={footerStyle}>Wiki Trivial</Footer>    
    </Layout>
  );
}

export default App;
