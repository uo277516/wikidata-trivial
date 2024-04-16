import './App.css';
import {Layout, Typography, Image, Input, Form, Button, Alert, Spin} from 'antd';
import logo from './logo.png'; 
import React, { useEffect, useState } from 'react';
import RedirectButton from './components/RedirectButton';
import OAuthLoginContainer from './components/OAuthLoginContainer';
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

  const [questionSelected, setQuestionSelected] = useState(null);
  const [loading, setLoading] = useState(false); //controlar si se está cargando la pregunta


  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/researchers" + endpoint);
      if (response.ok) {
        const jsonData = await response.json();
        return jsonData.results.bindings;
      } else {
        console.error("Error fetching data:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const fetchQuestions = async () => {
    setLoading(true); //empieza a cargar
    const investigatorDataBorn = await fetchData("/P19");
    const investigatorDataStudy = await fetchData("/P69");

    if (investigatorDataBorn && investigatorDataStudy) {
      const bornQuestions = investigatorDataBorn.map((item) => `¿Dónde nació el investigador ${item.investigadorLabel}?`);
      const studyQuestions = investigatorDataStudy.map((item) => `¿Dónde estudió el investigador ${item.investigadorLabel}?`);

      const questionsArray = [...bornQuestions, ...studyQuestions];
      setQuestionSelected(getRandomItem(questionsArray));
      setLoading(false); //carga
    }
  };

  const getRandomItem = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  const handleSendButton = () => {
    fetchQuestions();
  };

  useEffect(() => {
    fetchQuestions();
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
            
            <Content >
              
            {loading ? ( 
              <Spin spinning={true} delay={500} style={{ marginBottom: "20px", width: 700 }}>
                <Alert style={{ marginBottom: "20px", width: 700 }}
                  type="info"
                  message="Cargando pregunta"
                  description="Por favor espere. Se está cargando la pregunta."
                />
              </Spin>
            ) : (
              questionSelected && ( // Mostrar la pregunta si está seleccionada
                <Paragraph style={{ fontSize: '20px', marginBottom: '25px', marginTop: '50px' }}>
                  {questionSelected}
                </Paragraph>
              )
            )}
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
                    <Button type="primary" htmlType="submit" onClick={handleSendButton}>
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
                style={{ width: 700, textAlign: 'center' }} 
              />
            )}
          </Content>

              <RedirectButton></RedirectButton>
              <OAuthLoginContainer></OAuthLoginContainer>
          </Content>
          
        </Layout>

        

      </Content>

      <Footer style={footerStyle}>Wiki Trivial</Footer>    
    </Layout>
  );
}

export default App;
