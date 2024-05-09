import '../App.css';
import {Layout, Typography, Image, Input, Form, Button, Alert, Spin, Result, Radio, Modal, notification, Popconfirm} from 'antd';
import logo from '../logo.png'; 
import React, { useEffect, useState } from 'react';
import { SmileOutlined } from '@ant-design/icons';
import { fetchQuestionsFootballers, fetchQuestionsResearchers, editEntity } from '../services/questionsService.js';
import { headerStyle, contentStyle, footerStyle, formStyle } from '../styles/appStyle.js';
//Layout y letras
const {Title, Paragraph, Link} = Typography;
const { Header, Footer, Sider, Content } = Layout;


let PrincipalScreen = (props) => {
  let {category, categories, user} = props;

 //cambiar question,entity,relation y imagenUrl a ITEM y que tenga esas propiedades
  const [answeredQuestions, setAnsweredQuestions] = useState(0); //Para el número de respuestas seguidas
  let [questionSelected, setQuestionSelected] = useState(null);
  let [entitySelected, setEntitySelected] = useState(null);
  let [relationSelected, setRelationSelected] = useState(null);
  let [imagenUrl, setImagenUrl] = useState(null);

  const [loading, setLoading] = useState(false); //controlar si se está cargando la pregunta
  const [form] = Form.useForm();
  const [giveup, setGiveUp] = useState(false); //para rendirse, empieza en false (no te rindes)
  const [questionError, setQuestionError] = useState(false); //para cuando las preguntas no cargan

  //Categorias
  let  selCategory  = category;
  const [selectedCategory, setSelectedCategory] = useState(selCategory);


  const [msgChangeGiveUp, setMsgChangeGiveUp] = useState(null);
  const [titleChangeGiveUp, setTitleChangeGiveUp] = useState(null);

  //Para la rueda de enviar
  const [loadings, setLoadings] = useState([]);
  const [loadingSend, setLoadingSend] = useState(false);




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
        .then( ({question, entity, relation, imagenUrl}) => {
          setQuestionSelected(question);
          setEntitySelected(entity);
          setRelationSelected(relation);
          setImagenUrl(imagenUrl);
          console.log('Pregunta seleccionada:', question);
          console.log("La relacion es "+relation);
          console.log("La entidad es "+entity);
          console.log("y la imagen" + imagenUrl);
          
        })
        .catch(error => {
          //Cojo el error de que no se pudieron cargar por lo que sea, notifico y ademas en el Alert lo pongo
          //poner el questionerror a true y asi poner abajo o algo asi...
          notification.error({message: 'Error al cargar preguntas.', description: 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.', placement: 'top'});
          console.error('Error al obtener la pregunta:', error);
          setQuestionError(true);
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
      fetchQuestions();
      console.log("cada vez que recargo dice patata :P");
  }, []);
  

  const handleLoadingState = (loading) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[0] = loading;
      return newLoadings;
    });
    setLoadingSend(loading);
  };


  //manejar botón cuando envío
  const handleSendButton = async () => {
    try {
      const values = await form.validateFields(); //validar campos
      if (values.respuesta && values.urldereferencia) {
        
        //activar rueda enviar
        handleLoadingState(true);
        
        //---ENVIAR A LA API---
        //lo comento pa hacer pruebas, llamaria a este y no al siguiente
        //editEntity(selCategory, entitySelected, relationSelected.substring(1), values.respuesta, values.urldereferencia, user.oauth.token, user.oauth.token_secret);
        await asyncTestFunction();

        //Desactivar rueda
        handleLoadingState(false);

        notification.success({message: 'Respuesta enviada.', description: 'Su respuesta se ha añadido a Wikidata.', placement: 'topRight'});

        //sumo respuestas y vacío
        setAnsweredQuestions(answeredQuestions + 1);
        form.resetFields();

        console.log(questionSelected, values.respuesta, values.urldereferencia);

        //vuelvo a cargar
        fetchQuestions(selCategory);
        
      } else {
        console.error("Alguno o varios campos están sin completar");
      }
    } catch (error) {
      console.error('Error en la validación del formulario:', error);
    }
  };

  //método para pruebas
  const asyncTestFunction = async () => {
    console.log("Iniciando operación asíncrona...");
    await new Promise(resolve => setTimeout(resolve, 3000)); 
    console.log("Operación asíncrona completada.");
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
    fetchQuestions(selectedCategory);
  };

  //Categorias
  const handleCategoryChange = (value) => {
    //Avisar que se cambia de categoría para que salte mensaje
    //si le da a que si quiere cambiar, hace todo esto. Si no, nada
    Modal.confirm({
      title: 'Vas a cambiar de categoría',
      content: 'Al cambiar de categoría, tu racha de preguntas acertadas seguidas volverá a 0.',
      onOk: () => {        
        setGiveUp(true);

        setSelectedCategory(value);

        //Para cogerlo para el fetch
        setSelCategory(value);
        console.log("Cambiando a la categoría... "+selCategory);

        setTitleChangeGiveUp("Has cambiado de categoría.")
        setMsgChangeGiveUp("Tu racha de preguntas empezará de 0 de nuevo. Número de respuestas acertadas seguidas: "+answeredQuestions);

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


      <Layout style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white'}}>
        <Sider style={{ width: '20%', textAlign: 'center', lineHeight: '120px', color: '#fff', backgroundColor: 'white', paddingTop: '20px' }}>
          <Image
            width={200}
            src={logo}
            style={{ paddingLeft: '10px',marginBottom: '20px' }}
          />
        </Sider>
        <Content style={{ flex: 1, textAlign: 'left', paddingLeft: '20px', color: 'black', backgroundColor: 'white'}}>
          <Title level={1} style={{ marginTop: '20px', fontSize: '50px', fontWeight: 'bold' }}>Wiki Trivial</Title>
          <Title level={2} style={{ marginTop: '5px', fontSize: '40px'}}>Juego de preguntas y respuestas</Title>
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
                  disabled={loading || loadingSend}>

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
                            message={"Error al cargar las preguntas sobre "+selectedCategory+"."}
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
                  disabled={loading || questionError || loadingSend}
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
                      style={{ marginRight: '20px'}} loading={loadings[0]}>
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
          </Content>
          
        </Layout>

        

      </Content>

      <Footer style={footerStyle}>Wiki Trivial</Footer>    
    </Layout>
  );
}

export default PrincipalScreen;