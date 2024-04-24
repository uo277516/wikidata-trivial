import './App.css';
import {Layout, Typography, Image, Input, Form, Button, Alert, Spin, Result, Radio, Modal, notification, Popconfirm} from 'antd';
import logo from './logo.png'; 
import React, { useEffect, useState } from 'react';
import RedirectButton from './components/RedirectButton';
//import OAuthLoginContainer from './components/OAuthLoginContainer';
import { SmileOutlined } from '@ant-design/icons';
import { fetchQuestionsFootballers, fetchQuestionsResearchers } from './services/questionsService.js';
import { headerStyle, contentStyle, headerRightStyle, siderStyle, footerStyle, titleOneStyle, titleTwoStyle, formStyle } from './styles/appStyle.js';

//Layout y letras
const {Title, Paragraph, Link} = Typography;
const { Header, Footer, Sider, Content } = Layout;


let App = () => {

 
  const [answeredQuestions, setAnsweredQuestions] = useState(0); //Para el número de respuestas seguidas
  let [questionSelected, setQuestionSelected] = useState(null);
  const [loading, setLoading] = useState(false); //controlar si se está cargando la pregunta
  const [form] = Form.useForm();
  const [giveup, setGiveUp] = useState(false); //para rendirse, empieza en false (no te rindes)
  const [questionError, setQuestionError] = useState(false); //para cuando las preguntas no cargan

  //Categorias
  const [selectedCategory, setSelectedCategory] = useState("investigadores");
  const categories = ['investigadores', 'futbolistas']; 

  let selCategory = "investigadores";

  const [msgChangeGiveUp, setMsgChangeGiveUp] = useState(null);
  const [titleChangeGiveUp, setTitleChangeGiveUp] = useState(null);


  const setSelCategory = (cc) => {
    selCategory= cc;
  };

  
  

  const fetchQuestions = () => {

    const categoryToFetchFunction = {
      investigadores: fetchQuestionsResearchers,
      futbolistas: fetchQuestionsFootballers,
      //mas categorias...
    };
  
    const fetchFunction = categoryToFetchFunction[selectedCategory];
  
    if (fetchFunction) {
      console.log("a cargar preguntas de..." + selectedCategory);
      setLoading(true); 
      fetchFunction()
        .then( ({question, relation}) => {
          setQuestionSelected(question);
          console.log('Pregunta seleccionada:', question);
          console.log("la relacion es "+relation);
          
        })
        .catch(error => {
          //Cojo el error de que no se pudieron cargar por lo que sea, notifico y ademas en el Alert lo pongo
          //poner el questionerror a true y asi poner abajo o algo asi...
          notification.error({message: 'Error al cargar preguntas.', description: 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.', placement: 'top'});
          console.error('Error al obtener la pregunta:', error);
          setQuestionError(true);
          console.log("a ver? " + questionError);
        })
        .finally(() => {
          setLoading(false);
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
      console.log("cada vez que recargo dice patata :P");
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
        //pero aqui necesito entidad (QXXX) y propiedad (PXXX);
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
    setTitleChangeGiveUp("Te has rendido.")
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
      title: 'Vas a cambiar de categoría',
      content: 'Al cambiar de categoría, tu racha de preguntas acertadas seguidas volverá a 0.',
      onOk: () => {
        console.log(answeredQuestions);
        
        setGiveUp(true);

        setSelectedCategory(value);

        //Para cogerlo para el fetch
        setSelCategory(value);
        console.log(selCategory);

        setTitleChangeGiveUp("Has cambiado de categoría.")
        setMsgChangeGiveUp("Tu racha de preguntas empezará de 0 de nuevo. Número de respuestas acertadas seguidas: "+answeredQuestions);
        console.log(answeredQuestions);

        //por si habia algun problema con las preguntas de otra categoria que no cargaban, se vuelve a poner a false
        setQuestionError(false);

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
                <Radio.Group 
                  value={selectedCategory} 
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  disabled={loading}>

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
                        <Alert
                            style={{ marginBottom: "20px", width: 700 }}
                            type="info"
                            message="Cargando pregunta..."
                            description="Por favor espere. Se está cargando la pregunta."
                        />
                    </Spin>
                ) : (
                    questionError ? (
                        <Alert
                            style={{ marginBottom: "20px", width: 700 }}
                            type="error"
                            message={"Error al cargar las preguntas sobre "+selCategory+"."}
                            description="Ha ocurrido un error al cargar la pregunta. Por favor, inténtelo de nuevo más tarde o pruebe con otra categoría."
                        />
                    ) : (
                        questionSelected && (
                            <Paragraph style={{ fontSize: '20px', marginBottom: '25px', marginTop: '50px' }}>
                                {questionSelected}
                            </Paragraph>
                        )
                    )
                )}


              </div>
            )}
              
            

            {giveup ? (
              <Result
              icon={<SmileOutlined />}
              title={titleChangeGiveUp}
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
                  disabled={loading || questionError}
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
                    <Popconfirm
                      title="Rendirse"
                      description="¿Estás seguro de rendirte?"
                      onConfirm={handleGiveUp}
                      okText="Si"
                      cancelText="No"
                    >
                      <Button type="primary" style={{ backgroundColor: '#607d8b' }}>
                        Rendirse
                      </Button>
                    </Popconfirm>
                    
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
