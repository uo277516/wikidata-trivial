import '../App.css';
import {Layout, Typography, Image, Input, Form, Button, Alert, Spin, Result, Radio, Modal, notification, Popconfirm,
   Card, Statistic, DatePicker
} from 'antd';
import logo from '../logo.png'; 
import React, { useEffect, useState } from 'react';
import { SmileOutlined,SolutionOutlined,FireOutlined } from '@ant-design/icons';
import { fetchQuestionsFootballers, fetchQuestionsResearchers, editEntity, fetchQuestionsGroups, checkProperties } from '../services/questionsService.js';
import { headerStyle, contentStyle, footerStyle, formStyle , popconfirmStyle} from '../styles/appStyle.js';
import QuestionCard from './QuestionCard.js';
import axios from 'axios';
import MenuComponent from './MenuComponent.js';
import TableComponent from './TableComponent.js';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import '../styles/styles.css'; 


//Layout y letras
const {Title, Paragraph, Link} = Typography;
const { Header, Footer, Sider, Content } = Layout;



let PrincipalScreen = (props) => {
  let {category, categories, user} = props;
  const { t } = useTranslation();


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

  //Para el datePicker
  const [answerIsYear, setAnswerIsYear] = useState(false);
  const minDate = dayjs(`1900-01-01`);
  const maxDate = dayjs(`2024-12-31`);

  

  const fetchStreaks = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/getStreaks/${user._json.username}`);
      setStreaks(response.data);
    } catch (error) {
      console.error('Error fetching streaks:', error);
      notification.error({message: t('streak.error'), description: t('streak.error.description'), placement: 'top'});
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
      notification.error({message: t('streak.error'), description: t('streak.error.description'), placement: 'top'});
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
      console.log("Loading questions of..." + selectedCategory);
      setLoading(true); 
      fetchFunction()
        .then( ({question, entity, relation, imagenUrl, labelEntity}) => {
          setQuestionSelected(question);
          setEntitySelected(entity);
          setRelationSelected(relation);
          setImagenUrl(imagenUrl);
          setLabelSelected(labelEntity);
          if (question.includes('año') || question.includes('year')) {
            setAnswerIsYear(true);
          } else {
            setAnswerIsYear(false);
          }
        })
        .catch(error => {
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
      console.log("Loading page... :P");
  }, []);
  

  const handleLoadingState = (loading) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[0] = loading;
      return newLoadings;
    });
    setLoadingSend(loading);
  };

  const handleSend = async (func) => {
    try {
      const values = await form.validateFields(); //validar campos
      if (values.respuesta && values.urldereferencia) {

        if (answerIsYear) {
          values.respuesta = values.respuesta.year();
        }
        
        //activar rueda enviar
        handleLoadingState(true);

        
        //---ENVIAR A LA API---
        //lo comento pa hacer pruebas, llamaria a este y no al siguiente
        try {
          await editEntity(selectedCategory, entitySelected, relationSelected.substring(1), values.respuesta, values.urldereferencia, user.oauth.token, user.oauth.token_secret);
          //await asyncTestFunction();
          notification.info({message: t('question.send'), 
            description: t('question.sendDescription'), placement: 'topRight'});
          setAnsweredQuestions(answeredQuestions + 1);
        } catch (error) {
          notification.error({message: t('question.noSend'), 
            description: t('question.noSendDescription'), placement: 'topRight'});
        }

        //Desactivar rueda
        handleLoadingState(false);

        //sumo respuestas y vacío
        form.resetFields();

        //variable
        await func();

        checkStreak();
      } else {
        console.error("One or more fields are incomplete.");
      }
    } catch (error) {
      notification.error({message: t('form.error'), description: t('form.error.description'), placement: 'top'});
      console.error('Error in form validation:', error);
    }
  }

  //manejar botón cuando envío
  const handleSendButton = async () => {
    handleSend(fetchQuestions);
  };

  const handleSendSameEntityButton = async () => {
    setLoading(true);
    handleSend(funcProperties);
  };  

  const funcProperties = async () => {
    try {
      const properties = await checkProperties(entitySelected, selectedCategory);
      if (properties) {
        console.log("entra?");
        setRelationSelected(properties[0]);
        setLoading(false);
      } else {
        notification.error({message: t('question.error.entity')
        , description: t('question.error.entityDescrip'), placement: 'top'});
        fetchQuestions();
      }
    } catch (error) {
      console.error('Error calling checkProperties:', error);
    }
  }; 


  //método para pruebas
  const asyncTestFunction = async () => {
    console.log("Initiating asynchronous operation...");
    await new Promise(resolve => setTimeout(resolve, 3000)); 
    console.log("Asynchronous operation completed.");
    // throw new Error("error de prueba");
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
    console.log("---");
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


  
 
  

  //Crear HTML de la página web 

  return (
    <Layout style={{ minHeight: "100vh" }}>

      {/* Menú */}
      <MenuComponent user={user} mode='horizontal'></MenuComponent>

      <Header style={headerStyle}>


      <Layout id='header' style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white'}}>
        
        {/* Info y logo */}
        <Sider style={{ width: '20%', textAlign: 'center', lineHeight: '120px', color: '#fff', backgroundColor: 'white', paddingTop: '20px' }}>
          <Image
            width={200}
            src={logo}
            style={{ paddingLeft: '10px',marginBottom: '20px' }}
          />
        </Sider>
        <Content id='content' style={{ flex: 1, textAlign: 'left', paddingLeft: '20px', color: 'black', backgroundColor: 'white'}}>
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
                    //onChange={(e) => handleCategoryChange(e.target.value)}
                    disabled={loading || loadingSend}>

                    {categories.map((category) => (
                      <Radio.Button key={category} value={category} onClick={() => handleCategoryChange(category)}>
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
                        { required: true, message: t('question.required') }
                      ]}
                      >
                      {answerIsYear ? (
                        <DatePicker 
                          placeholder={t('question.selectYear')} 
                          minDate={minDate}
                          maxDate={maxDate}
                          style={{ width: '300px' }} 
                          />
                      ) : (
                        <Input placeholder={t('question.answer')} />
                      )}
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
                      <Popconfirm
                        placement='rightTop'
                        title={t('question.popChangeEntity')}
                        description={t('question.popChangeEntityDescription', {labelSelected})}
                        onConfirm={handleSendSameEntityButton}
                        onCancel={handleSendButton}
                        okText={t('question.continueEntity')}
                        cancelText={t('question.changeEntity')}
                        overlayStyle={popconfirmStyle} 
                      >
                      <Button type="primary" htmlType="submit" 
                        style={{ marginRight: '20px'}} loading={loadings[0]}>
                        {t('question.buttonSend')}
                      </Button>
                      </Popconfirm>


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
      

      <Footer style={footerStyle}> {t('footer.info')}<a href="https://www.icons8.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>Icons8</a></Footer>
    </Layout>
  );
}

export default PrincipalScreen;