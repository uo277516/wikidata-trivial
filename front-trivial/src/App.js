import './App.css';
import {Layout, Typography, Image, Input, Form, Button, Alert, Spin, Result, Radio, Modal, message} from 'antd';
import logo from './logo.png'; 
import React, { useEffect, useState } from 'react';
import RedirectButton from './components/RedirectButton';
import OAuthLoginContainer from './components/OAuthLoginContainer';
import { SmileOutlined } from '@ant-design/icons';
const {Title, Paragraph, Link} = Typography;
const { Header, Footer, Sider, Content } = Layout;

let hasCalledPatatita = false;

let App = () => {

 
  const [answeredQuestions, setAnsweredQuestions] = useState(0); //Para el número de respuestas seguidas
  let [questionSelected, setQuestionSelected] = useState(null);
  const [loading, setLoading] = useState(false); //controlar si se está cargando la pregunta
  const [form] = Form.useForm();
  const [giveup, setGiveUp] = useState(false); //para rendirse, empieza en false (no te rindes)

  //Categorias
  const [selectedCategory, setSelectedCategory] = useState("investigadores");
  const categories = ['investigadores', 'geografía', 'deportistas']; 

  let selCategory = "investigadores";

  const [msgChangeGiveUp, setMsgChangeGiveUp] = useState(null);

  const setSelCategory = (cc) => {
    selCategory= cc;
  };

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


  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/researchers" + endpoint);
      if (response.ok) {
        const jsonData = await response.json();
        return jsonData.results.bindings;
      } else {
        console.error("Error fetching data:", response.statusText);
        //aqui algo para que salga pantalla? lo de abajo no está probado
        message.error('Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.');
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error('Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.');
      return null;
    }
  };

  const fetchQuestionsResearchers = async () => {
    setLoading(true); //empieza a cargar
    const investigatorDataBorn = await fetchData("/P19");
    const investigatorDataStudy = await fetchData("/P69");

    if (investigatorDataBorn && investigatorDataStudy) {
      const bornQuestions = investigatorDataBorn.map((item) => `¿Dónde nació el investigador ${item.investigadorLabel}?`);
      const studyQuestions = investigatorDataStudy.map((item) => `¿Dónde estudió el investigador ${item.investigadorLabel}?`);

      const questionsArray = [...bornQuestions, ...studyQuestions];
      const randomNumber = Math.floor(Math.random() * questionsArray.length+1);
      const question = questionsArray[randomNumber];
      setQuestionSelected(question);

      console.log(question);
      console.log(questionSelected);
      setLoading(false); //carga
    }
  };

  const fetchQuestions = () => {
    console.log("a cargar preguntas de..." + selectedCategory);
    if (selectedCategory==="investigadores") {
      fetchQuestionsResearchers();
    } else if (selectedCategory==="geografía") {
      //aqui iria llamada otro metodo
      console.log("preguntas geografía");
    } else if (selectedCategory==="deportistas") {
      //aqui iria llamada otro metodo
      console.log("preguntas deportistas");
    }
    //if..con los demas
  };

   useEffect(() => {
    if (!hasCalledPatatita) {
      fetchQuestions();
      console.log("holi!")
      hasCalledPatatita=true;
    }
  }, []);

  
  

  //manejar botón cuando envío
  const handleSendButton = async () => {
    try {
      const values = await form.validateFields(); //validar campos
      if (values.respuesta && values.urldereferencia) {
        //sumo respuestas y vacío
        setAnsweredQuestions(answeredQuestions + 1);
        form.resetFields();

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
    setMsgChangeGiveUp("");
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
        handleRestart();
        setGiveUp(true);

        setSelectedCategory(value);

        //Para cogerlo para el fetch
        setSelCategory(value);
        console.log(selCategory);

        setMsgChangeGiveUp("Has cambiado de categoría, y por lo tanto tu racha de preguntas empieza de 0.")
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
                      message="Cargando pregunta"
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
              subTitle={`${msgChangeGiveUp} Número de preguntas acertadas seguidas: ${answeredQuestions}`}
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
              {/* lo comento de momento xq no va
              <RedirectButton></RedirectButton>
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
