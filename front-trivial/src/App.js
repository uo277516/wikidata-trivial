import './App.css';
import {Layout, Typography, Image, Input, Form, Button, Alert, Spin, Result, Radio, Modal, notification} from 'antd';
import logo from './logo.png'; 
import React, { useEffect, useState } from 'react';
import RedirectButton from './components/RedirectButton';
//import OAuthLoginContainer from './components/OAuthLoginContainer';
import { SmileOutlined } from '@ant-design/icons';
import { fetchQuestionsFootballers, fetchQuestionsResearchers } from './services/questionsService.js';
import { headerStyle, contentStyle, headerRightStyle, siderStyle, footerStyle, titleOneStyle, titleTwoStyle, formStyle } from './styles/appStyle.js';


const {Title, Paragraph, Link} = Typography;
const { Header, Footer, Sider, Content } = Layout;


let App = () => {

 
  const [answeredQuestions, setAnsweredQuestions] = useState(0); //Para el número de respuestas seguidas
  let [questionSelected, setQuestionSelected] = useState(null);
  const [loading, setLoading] = useState(false); //controlar si se está cargando la pregunta
  const [form] = Form.useForm();
  const [giveup, setGiveUp] = useState(false); //para rendirse, empieza en false (no te rindes)

  //Categorias
  const [selectedCategory, setSelectedCategory] = useState("investigadores");
  const categories = ['investigadores', 'geografía', 'futbolistas']; 

  let selCategory = "investigadores";

  const [msgChangeGiveUp, setMsgChangeGiveUp] = useState(null);

  const setSelCategory = (cc) => {
    selCategory= cc;
  };

  
  

  const fetchQuestions = () => {
    const categoryToFetchFunction = {
      investigadores: fetchQuestionsResearchers,
      //geografía: fetchQuestionsGeography, 
      futbolistas: fetchQuestionsFootballers,
      //mas categorias...
    };
  
    const fetchFunction = categoryToFetchFunction[selectedCategory];
  
    if (fetchFunction) {
      console.log("a cargar preguntas de..." + selectedCategory);
      setLoading(true); 
      fetchFunction()
        .then(question => {
          setQuestionSelected(question);
          console.log('Pregunta seleccionada:', question);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error al obtener la pregunta:', error);
        });
    } else {
      console.error('Categoría no válida:', selectedCategory);
    }
  };
  


  //para que no saliera dos veces quite StrictMode en index.js, supuestamente cuando lo lanzas funciona
  //de momento lo quito, aunque salta warning dependencias
  useEffect(() => {
      //si recargo vuelve a investigadores
      setSelCategory("investigadores");
      setSelectedCategory("investigadores");
      fetchQuestions();
  }, []);
  
  

  //manejar botón cuando envío
  const handleSendButton = async () => {
    try {
      const values = await form.validateFields(); //validar campos
      if (values.respuesta && values.urldereferencia) {
        //sumo respuestas y vacío
        setAnsweredQuestions(answeredQuestions + 1);
        form.resetFields();

        //aqui deberia enviar a la api y tal
        //....
        console.log("la pregunta es "+questionSelected);
        console.log("la respuesta "+values.respuesta);
        console.log("y la referencia "+values.urldereferencia);

        //vuelvo a cargar
        fetchQuestions(selCategory);
      } else {
        console.error("Alguno o varios campos están sin completar");
      }
    } catch (error) {
      console.error('Error en la validación del formulario:', error);
    }
  };

  

  //botón de rendirse
  const handleGiveUp = () => {
    //modal para qe esté seguro?¿
    setMsgChangeGiveUp("Número de respuestas acterdas seguidas: "+answeredQuestions);
    setGiveUp(true);
  }

  const handleRestart = () => {
    form.resetFields();
    setAnsweredQuestions(0);
    setGiveUp(false);
    fetchQuestions(selCategory);
  };

  //Categorias
  const handleCategoryChange = (value) => {
    //Avisar que se cambia de categoría para que salte mensaje
    //si le da a que si quiere cambiar, hace todo esto. Si no, nada
    Modal.confirm({
      title: 'Vas a rendirte',
      content: 'Estás a punto de rendirte. Si te rindes, tu racha de preguntas acertadas seguidas volverá a 0.',
      onOk: () => {
        console.log(answeredQuestions);
        
        setGiveUp(true);

        setSelectedCategory(value);

        //Para cogerlo para el fetch
        setSelCategory(value);
        console.log(selCategory);

        setMsgChangeGiveUp("Has cambiado de categoría, y por lo tanto tu racha de preguntas empieza de 0. Número de respuestas acertadas seguidas: "+answeredQuestions);
        console.log(answeredQuestions);

      },
      onCancel: () => {
        
      },
      footer: (_, { CancelBtn, OkBtn }) => (
        <>
          <CancelBtn/>
          <OkBtn/>
        </>
      ),
    });
    

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

            
          
            {!giveup && (
              <div>
                <Radio.Group value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
                  {categories.map((category) => (
                    <Radio.Button key={category} value={category}>
                      {category}
                    </Radio.Button>
                  ))}
                </Radio.Group>

                <Paragraph style={{fontSize:"20px"}}>
                  La información de las siguientes preguntas sobre {selectedCategory} se ha recogido de 
                  <Link href="https://www.wikidata.org/?uselang=es" target="_blank" style={{fontSize:"20px"}}> Wikidata. </Link>
                  Las respuestas que usted proporcione se utilizarán para enriquecer la misma.
                </Paragraph>


                {loading ? ( 
                  <Spin spinning={true} delay={500} style={{ marginBottom: "20px", width: 700 }}>
                    <Alert style={{ marginBottom: "20px", width: 700 }}
                      type="info"
                      message="Cargando pregunta..."
                      description="Por favor espere. Se está cargando la pregunta."
                    />
                  </Spin>
                ) : (
                  questionSelected && ( //pregunta
                    <Paragraph style={{ fontSize: '20px', marginBottom: '25px', marginTop: '50px' }}>
                      {questionSelected}
                    </Paragraph>
                  )
                )}

              </div>
            )}
              
            

            {giveup ? (
              <Result
              icon={<SmileOutlined />}
              title="¡Te has rendido!"
              subTitle={msgChangeGiveUp}
              extra={[
                <Button type="primary" key="console" onClick={handleRestart}>
                  Volver a empezar
                </Button>,
              ]}
              />
              ): (              

              <Form
                  form={form}
                  name="basic"
                  style={{ maxWidth: 700 }}
                  initialValues={{ remember: true }}
                  autoComplete="off"
                  disabled={loading}
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
                    <Button type="primary" htmlType="submit" onClick={handleSendButton} 
                      style={{ marginRight: '20px'}}>
                      Enviar respuesta
                    </Button>
                    <Button type="primary" onClick={handleGiveUp}
                      style={{ backgroundColor: '#607d8b' }}>
                      Rendirse
                    </Button>
                  </Form.Item>

                </Form>
            )}


            <Content >
            {!giveup && answeredQuestions > 0 && (
              <Alert
                message={`¡Llevas ${answeredQuestions} preguntas contestadas seguidas!`}
                type="success"
                showIcon
                style={{ width: 700, textAlign: 'center' }} 
              />
            )}
            </Content>
            <RedirectButton></RedirectButton>
              {/* lo comento de momento xq no va
              
              <OAuthLoginContainer></OAuthLoginContainer>
            */}
          </Content>
          
        </Layout>

        

      </Content>

      <Footer style={footerStyle}>Wiki Trivial</Footer>    
    </Layout>
  );
}

export default App;
