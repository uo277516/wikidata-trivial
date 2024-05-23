import '../App.css';
import {Layout, Typography, Image, Input, Form, Button, Alert, Spin, Result, Radio, Modal, notification, Popconfirm,
   Card, Statistic
} from 'antd';
import logo from '../logo.png'; 
import React, { useEffect, useState } from 'react';
import { SmileOutlined,SolutionOutlined,FireOutlined } from '@ant-design/icons';
//import { fetchQuestionsFootballers, fetchQuestionsResearchers, editEntity, fetchQuestionsGroups } from '../services/questionsService.js';
import { headerStyle, contentStyle, footerStyle, formStyle } from '../styles/appStyle.js';
import QuestionCard from './QuestionCard.js';
import axios from 'axios';
import MenuComponent from './MenuComponent.js';
import TableComponent from './TableComponent.js';
import { useTranslation } from 'react-i18next';



//Layout y letras
const {Title, Paragraph, Link} = Typography;
const { Header, Footer, Sider, Content } = Layout;



let PrincipalScreen = (props) => {
  let {category, categories, user} = props;
  const {i18n, t } = useTranslation();


  //cambiar question,entity,relation y imagenUrl a ITEM y que tenga esas propiedades
  const [answeredQuestions, setAnsweredQuestions] = useState(0); //Para el número de respuestas seguidas
  let [questionSelected, setQuestionSelected] = useState(null);
  let [entitySelected, setEntitySelected] = useState(null);
  let [relationSelected, setRelationSelected] = useState(null);
  let [labelSelected, setLabelSelected] = useState(null);

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


  //Para la clasificación
  const [streaks, setStreaks] = useState([])
  const [seeStreaks, setSeeStreaks] = useState(false);
  

  const fetchStreaks = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/getStreaks/${user._json.username}`);

      setStreaks(response.data);
      console.log(streaks);
    } catch (error) {
      console.error('Error fetching streaks:', error);
    }
  };

  const saveStreak = async () => {
    try {
      await axios.post('http://localhost:3001/saveStreak', {
        username: user._json.username,
        category: selectedCategory,
        streak: answeredQuestions,
      });
    } catch (error) {
      console.error('Error saving streak:', error);
    }
  };

  useEffect(() => {
    fetchStreaks();
    if (answeredQuestions>0)
      saveStreak();
  }, []);

  const [api, contextHolder] = notification.useNotification();
  const checkStreak = () => {
    fetchStreaks();
    const firstStreak = streaks.length > 0 ? streaks[0].streak : null;
    let placement='bottom';
    if (firstStreak<answeredQuestions+1) {
      api.success({
        message: t('question.record'),
        description: t('question.record.description', { firstStreak }), 
        placement,
      });
    }
  }

  


  //----

  const setSelCategory = (cc) => {
    selCategory= cc;
  };
  

  const fetchQuestions = () => {

    const categoryToFetchFunction = {
      investigación: fetchQuestionsResearchers,
      deporte: fetchQuestionsFootballers,
      música: fetchQuestionsGroups
      //mas categorias...
    };
  
    const fetchFunction = categoryToFetchFunction[selectedCategory];
  
    if (fetchFunction) {
      console.log("a cargar preguntas de..." + selectedCategory);
      setLoading(true); 
      fetchFunction()
        .then( ({question, entity, relation, imagenUrl, persona}) => {
          setQuestionSelected(question);
          setEntitySelected(entity);
          setRelationSelected(relation);
          setImagenUrl(imagenUrl);
          setLabelSelected(persona);
          console.log('Pregunta seleccionada:', question);
          console.log("La relacion es "+relation);
          console.log("La entidad es "+entity);
          console.log("y la imagen" + imagenUrl);
          console.log("nombre persona" + persona);
          
          
        })
        .catch(error => {
          //Cojo el error de que no se pudieron cargar por lo que sea, notifico y ademas en el Alert lo pongo
          //poner el questionerror a true y asi poner abajo o algo asi...
          notification.error({message: t('question.error'), description: t('question.error.description'), placement: 'top'});
          setQuestionError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.error('Category not valid', selectedCategory);
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

        notification.info({message: t('question.send'), 
          description: t('question.sendDescription'), placement: 'topRight'});

        //sumo respuestas y vacío
        setAnsweredQuestions(answeredQuestions + 1);
        form.resetFields();

        console.log(questionSelected, values.respuesta, values.urldereferencia);

        //vuelvo a cargar
        fetchQuestions(selCategory);

        checkStreak();
        
      } else {
        console.error("One or more fields are incomplete.");
      }
    } catch (error) {
      console.error('Error in form validation:', error);
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
    setTitleChangeGiveUp(t('question.giveup'))
    setMsgChangeGiveUp(t('question.msgGiveUp', { answeredQuestions }));
    //guardar racha
    if (answeredQuestions>0) {
      saveStreak();
      fetchStreaks();
    }
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
      title: t('question.changeCat'),
      content: t('question.changeCatContent'),
      onOk: () => {        
        setGiveUp(true);

        setSelectedCategory(value);

        //Para cogerlo para el fetch
        setSelCategory(value);

        setTitleChangeGiveUp(t('question.youChangeCat'))
        setMsgChangeGiveUp(t('question.youChangeCatMsg', { answeredQuestions }));

        //Guardar racha
        if (answeredQuestions>0) {
          saveStreak();
          fetchStreaks();
        }

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


  const validateAnswer = (rule, value) => {
    const isValidYear = /^(19[0-9][0-9]|20[0-1][0-9]|202[0-4])$/.test(value);  //expresion regular añoñs rango 1900-2024
    const answerIsYear = questionSelected.includes('año') || questionSelected.includes('year');
    console.log(answerIsYear);
    if (answerIsYear && !isValidYear) {
      return Promise.reject(t('question.yearNotValid'));
    }
    return Promise.resolve();
  };


  //-----------QUESTIONS----------
  const editEntity = async (selCategory, footballerId, property, value, referenceURL, token, token_secret) => {
    let endpoint=null;
    if (selCategory==="futbolistas") {
      endpoint='footballers';
    } else if (selCategory==="investigadores") {
      endpoint='researchers';
    } else if (selCategory==="raperos") {
      endpoint='rappers';
    }
    console.log(endpoint);
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/" + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ footballerId, property, value, referenceURL, token, token_secret })
      });
  
      if (!response.ok) {
        throw new Error('Failed to edit entity');
      }
  
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error editing entity:', error);
      throw error;
    }
  };
  
  
  
  const fetchData = async (entity, endpoint) => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/" + entity + endpoint);
      if (response.ok) {
        const jsonData = await response.json();
        return jsonData.results.bindings;
      } else {
        console.error("Error fetching data:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  
  //formar entidad de devolver con la pregunta la entidad y la relacion para poder mandar la edicion en front
  const generateQuestions = (data, labelPrefix, entityProperty, labelProperty, relation) => {
    if (!data) return [];
  
    console.log(data);
    
    return data.map((item) => ({
      question: `${labelPrefix} ${item[labelProperty]}?`,
      entity: item[entityProperty],
      relation,
      imagenUrl: item.imagenUrl,
      persona: item[labelProperty]
    }));
  };
  
  //metodo general para crear las preguntas pasando los parmetros
  const createQuestions = async (relations, messages, entitiesName, jsonName, jsonLabel) => {
    try {
      const random = Math.floor(Math.random() * relations.length); 
      const relationChosed = relations[random];
      const questionMsg = messages[random];
  
      const data = await fetchData(entitiesName, relationChosed);
  
      if (data) {
        const questions = generateQuestions(data, questionMsg, jsonName, jsonLabel, relationChosed);
        const randomNumber = Math.floor(Math.random() * questions.length);
        const { question, entity, relation, imagenUrl, persona } = questions[randomNumber];
        
  
        return { question, entity, relation, imagenUrl, persona };
      } else {
        throw new Error("Error fetching "+entitiesName+" data");
      }
    } catch (error) {
      console.error("Error fetching "+entitiesName+" questions:", error);
      throw error;
    }
  
  };
  
  //preguntas investigadores
  const fetchQuestionsResearchers = async () => {
    const relations = ["/P19", "/P69"];   //nacer, estudiar
    const messages = ["Dónde nació el/la investigador/a", "Dónde estudió el/la investigador/a"];
    return createQuestions(relations, messages, "researchers", 'investigador', 'investigadorLabel');
  };
  
  
  const fetchQuestionsFootballers = async () => {
    const relations = ["/P2048", "/P6509", "/P413"]; //altura, goles, posicion
    const messages = ["Cuál es la altura en centímetros de la/el futbolista", "Cuántos goles ha marcado a lo largo de su carrera el futbolista", "Cuál es una de las posiciones principales en las que suele desempeñarse en el campo de juego el futbolista"];
    return createQuestions(relations, messages, "footballers", 'futbolista', 'futbolistaLabel');
  };
  
  const fetchQuestionsGroups = async () => {
    const relations = ["/P571", "/P264"]; //fecha de fundacion (año)
    const messages = ["Cuál es el año en el que se fundó el grupo", "Cuál es el sello discográfico (o uno de ellos) del grupo"];
    return createQuestions(relations, messages, "groups", 'grupo', 'grupoLabel');
  };
  



  return (
    <Layout style={{ minHeight: "100vh" }}>

      {/* Menú */}
      <MenuComponent user={user}></MenuComponent>

      <Header style={headerStyle}>


      <Layout style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white'}}>
        
        {/* Info y logo */}
        <Sider style={{ width: '20%', textAlign: 'center', lineHeight: '120px', color: '#fff', backgroundColor: 'white', paddingTop: '20px' }}>
          <Image
            width={200}
            src={logo}
            style={{ paddingLeft: '10px',marginBottom: '20px' }}
          />
        </Sider>
        <Content style={{ flex: 1, textAlign: 'left', paddingLeft: '20px', color: 'black', backgroundColor: 'white'}}>
          <Title level={1} style={{ marginTop: '20px', fontSize: '5vh', fontWeight: 'bold' }}>Wiki Trivial</Title>
          <Title level={2} style={{ marginTop: '5px', fontSize: '40px'}}>{t('login.title')}</Title>
        </Content>
      </Layout>

         
          
      </Header>
      <Content style={contentStyle}>

        <Layout>

          
          <Content width="100%" style={contentStyle}>   {/*para poner las preguntas y eso*/}

            
          
            {!giveup && (
              <div style={{paddingTop: 0}}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '30px'
                  }}>
                  <Radio.Group 
                    value={selectedCategory} 
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    disabled={loading || loadingSend}>

                    {categories.map((category) => (
                      <Radio.Button key={category} value={category}>
                        {t(`table.${category}`)}
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginRight:'0.5vw' }}>
                    <Modal
                        title={t('cat.tableTitle')}
                        open={seeStreaks}
                        onCancel={() => setSeeStreaks(false)}
                        footer={null}
                        width={900}
                    >
                      <TableComponent user={user}></TableComponent>
                    </Modal>
                    <Button style={{marginLeft:'50px'}} 
                      type="primary" icon={<SolutionOutlined />} size='large' onClick={()=>setSeeStreaks(true)}>
                        {t('cat.buttonClasification')}
                      </Button>
                    
                  </div>

                </div>

                <Paragraph style={{fontSize:"20px"}}>
                {t('question.info', { selectedCategory: t(`table.${selectedCategory}`) })}
                  <Link href="https://www.wikidata.org/?uselang=es" target="_blank" style={{fontSize:"20px"}}> Wikidata. </Link>
                  {t('question.info2')}
                </Paragraph>


                {loading ? (
                    <Spin spinning={true} delay={500} style={{ marginBottom: "20px", width: 700, maxWidth:'100%' }}>
                        <Alert
                            style={{ marginBottom: "20px", width: 700, maxWidth:'100%'}}
                            type="info"
                            message={t('question.load')}
                            description={t('question.wait')}
                        />
                    </Spin>
                ) : (
                    questionError ? (
                        <Alert
                            style={{ marginBottom: "20px",width: 700, maxWidth:'100%' }}
                            type="error"
                            message={t('question.errorLoad', { selectedCategory })}
                            description={t('question.errorLoadDes')}
                        />
                    ) : (
                        questionSelected && (
                            <QuestionCard imagenUrl={imagenUrl} questionSelected={questionSelected} relationSelected={relationSelected}
                            label={labelSelected} entity={entitySelected}/>
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
                  {t('question.beginAgain')}
                </Button>,
              ]}
              />
              ): (              
              
              <div style={{ paddingTop: '20px', display: 'flex', alignItems: 'flex-start' }}>
                <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: 700 , flex: 1}}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    disabled={loading || questionError || loadingSend}
                  >
                    <Form.Item style={formStyle}
                      label={t('answer')}
                      name="respuesta"
                      rules={[
                        { required: true, message: t('question.required') },
                        { validator: (rule, value) => validateAnswer(rule,value) }, //validar
                      ]}
                    >
                      <Input placeholder={t('question.answer')}></Input>
                    </Form.Item>

                    <Form.Item style={formStyle}
                      label={t('question.url')}
                      name="urldereferencia"
                      rules={[
                        {required:true, message: t('question.urlRequired') },
                        { type: 'url', message: t('question.urlValid') }
                      ]}
                    >
                      <Input placeholder={t('question.urlExample')}></Input>
                    </Form.Item>

                    <Form.Item >
                      {contextHolder}
                      <Button type="primary" htmlType="submit" onClick={handleSendButton} 
                        style={{ marginRight: '20px'}} loading={loadings[0]}>
                        {t('question.buttonSend')}
                      </Button>
                      <Popconfirm
                        title={t('question.popGiveUp')}
                        description={t('question.sureGiveUp')}
                        onConfirm={handleGiveUp}
                        okText={t('yes')}
                        cancelText={t('no')}
                      >
                        <Button type="primary" style={{ backgroundColor: '#607d8b' }}>
                          {t('question.popGiveUp')}
                        </Button>
                        
                      </Popconfirm>
                      
                    </Form.Item>

                  </Form>

                  <Card bordered={true} style={{marginLeft: '80px', width: '13vw'}}>
                    <Statistic
                      title={t('question.ranking')}
                      value={answeredQuestions}
                      precision={0}
                      valueStyle={{ color: '#3f8600' }}
                      prefix={<FireOutlined />}
                    />
                  </Card>

                  

                </div>
            )}

            
            <Content style={{marginBottom:'13px'}} >
            </Content>
          </Content>
          
        </Layout>

        

      </Content>
      

      <Footer style={footerStyle}>Wiki Trivial</Footer>          
    </Layout>
  );
}

export default PrincipalScreen;