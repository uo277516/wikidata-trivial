import '../App.css';
import {Layout, Typography, Image, Input, Form, Button, Alert, Spin, Result, Radio, Modal, notification, Popconfirm,
   Card, Statistic, DatePicker, InputNumber
} from 'antd';
import logo from '../logo.png'; 
import React, { useEffect, useState } from 'react';
import { SmileOutlined,SolutionOutlined,FireOutlined } from '@ant-design/icons';
import { fetchQuestionsFootballers, fetchQuestionsResearchers, editEntity, fetchQuestionsGroups, checkProperties, searchEntityForValue , getEntityForValue} from '../services/questionsService.js';
import { headerStyle, contentStyle, footerStyle, formStyle , popconfirmStyle} from '../styles/appStyle.js';
import QuestionCard from './QuestionCard.js';
import axios from 'axios';
import MenuComponent from './MenuComponent.js';
import TableComponent from './TableComponent.js';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import '../styles/styles.css'; 


//layout ant letters
const {Title, Paragraph, Link} = Typography;
const { Header, Footer, Sider, Content } = Layout;


/**
 * PrincipalScreen component. It has all the funcionality for the game itself.
 * @param {Object} props - Component props.
 * @param {string} props.category - Selected category to do the questions about.
 * @param {string[]} props.categories - List of available categories.
 * @param {Object} props.user - User object containing user information.
 * @returns {React.JSX.Element} Rendered component.
 */
let PrincipalScreen = (props) => {
  let {category, categories, user} = props;
  const { t } = useTranslation();

  let [popOpen, setPopOpen] = useState(false);

  //state variables for maning the questions. Information of the questions
  const [answeredQuestions, setAnsweredQuestions] = useState(0); //for the number of answered questions
  let [questionSelected, setQuestionSelected] = useState(null);
  let [entitySelected, setEntitySelected] = useState(null);
  let [relationSelected, setRelationSelected] = useState(null);
  let [labelSelected, setLabelSelected] = useState(null);
  let [imagenUrl, setImagenUrl] = useState(null);

  const [api, contextHolder] = notification.useNotification();

  const [loading, setLoading] = useState(false); //check if the question is loading
  const [form] = Form.useForm();

  //to check give up
  const [msgChangeGiveUp, setMsgChangeGiveUp] = useState(null);
  const [titleChangeGiveUp, setTitleChangeGiveUp] = useState(null);
  const [giveup, setGiveUp] = useState(false); 

  const [questionError, setQuestionError] = useState(false); //when its a error on the questions

  //categories
  let  selCategory  = category;
  const [selectedCategory, setSelectedCategory] = useState(selCategory);

  //for the loading wheel
  const [loadings, setLoadings] = useState([]);
  const [loadingSend, setLoadingSend] = useState(false);

  //for the clasification
  const [streaks, setStreaks] = useState([])
  const [seeStreaks, setSeeStreaks] = useState(false);

  //for validation
  const [answerIsYear, setAnswerIsYear] = useState(false);
  const minDate = dayjs(`1900-01-01`);
  const maxDate = dayjs(`2024-12-31`);
  const [answerIsNumber, setAnswerIsNumber] = useState(false);
  

  /**
   * Fetches user's streaks for the selected category from the backend.
   * @async
   * @function fetchStreaks
   * @returns {Promise<void>}
   */
  const fetchStreaks = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/getStreaks/${user._json.username}`);
      setStreaks(response.data);
    } catch (error) {
      console.error('Error fetching streaks:', error);
      notification.error({message: t('streak.error'), description: t('streak.error.description'), placement: 'top'});
    }
  };

  /**
   * Saves user's streak for the selected category to the backend.
   * @async
   * @function saveStreak
   * @returns {Promise<void>}
   */
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


  /**
   * Lifecycle hook for fetching initial data on component mount.
   * @function useEffect
   * @returns {void}
   */
  useEffect(() => {
    fetchStreaks();
    if (answeredQuestions>0)
      saveStreak();
  }, []);


  /**
   * Checks user's streak and shows a notification if a new record is achieved.
   * @function checkStreak
   * @returns {void}
   */
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

  /**
   * Sets the selected category.
   * @function setSelCategory
   * @param {cc} - Category to change to.
   * @returns {void}
   */
  const setSelCategory = (cc) => {
    selCategory= cc;
  };
  

  /**
   * Fetches the questions based on the selected category.
   * @async
   * @function fetchQuestions
   * @returns {Promise<void>}
   */
  const fetchQuestions = () => {
    setAnswerIsNumber(false);  //eeverytime a new question is load 
    setAnswerIsYear(false);

    const categoryToFetchFunction = {
      investigación: fetchQuestionsResearchers,
      deporte: fetchQuestionsFootballers,
      música: fetchQuestionsGroups
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
          if (question.includes('año')) 
            setAnswerIsYear(true);
          if (question.includes('goles') || question.includes('altura')) 
            setAnswerIsNumber(true);
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
  
  /**
   * Lifecycle hook for fetching initial data on component mount.
   * @function useEffect
   * @returns {void}
   */
  useEffect(() => {
      fetchQuestions();
      console.log("Loading page... :P");
  }, []);
  

  /**
   * Handles the loading state.
   * @function handleLoadingState
   * @param {boolean} state - New loading state value.
   * @returns {void}
   */
  const handleLoadingState = (loading) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[0] = loading;
      return newLoadings;
    });
    setLoadingSend(loading);
  };

  /**
   * Opens the pop when it is sended the answer.
   * @function openPop
   * @async
   * @returns {void}
   */
  const openPop = async () => {
    try {
      const values = await form.validateFields(); 
      if (values.respuesta && values.urldereferencia) {
        setPopOpen(true);
      }
    } catch (error) {
      if (error.errorFields.length===0) {
        setPopOpen(true);
      }
      notification.error({message: t('form.error'), description: t('form.error.description'), placement: 'top'});
    }
  };

  /**
   * Handles the loading state of buttons and sends the user's response to the server.
   * @async
   * @function handleSend
   * @param {Function} func - Function to execute after sending the response.
   * @returns {Promise<void>}
   */
  const handleSend = async (func) => {
    try {
      const values = await form.validateFields(); 
      if (values.respuesta && values.urldereferencia) {
        if (answerIsYear) {
          values.respuesta = values.respuesta.year();
        }
        
        handleLoadingState(true);
        setPopOpen(false);

        // Example of API call (commented out for testing purposes)
        try {
          const entitiesAnswer = getEntityForValue(relationSelected);
          if (entitiesAnswer) {
            const selectedValue = await searchEntityForValue(values.respuesta, entitiesAnswer);
            console.log("Entity for the value"+selectedValue);
            if (selectedValue) {
              //await editEntity(selectedCategory, entitySelected, relationSelected.substring(1), selectedValue, values.urldereferencia, user.oauth.token, user.oauth.token_secret);
            } else {
              throw new Error(t('question.noSendFormat'));
            }
          } 
          //await editEntity(selectedCategory, entitySelected, relationSelected.substring(1), values.respuesta, values.urldereferencia, user.oauth.token, user.oauth.token_secret);
          await asyncTestFunction();
          notification.info({message: t('question.send'), 
            description: t('question.sendDescription'), placement: 'topRight'});
          setAnsweredQuestions(answeredQuestions + 1);
        } catch (error) {
          console.log(error.message);
          if (error.message===t('question.noSendFormat')) {
            notification.error({message: t('question.noSend'), 
              description: t('question.noSendFormat'), placement: 'topRight'});
          } else {
            notification.error({message: t('question.noSend'), 
              description: t('question.noSendDescription'), placement: 'topRight'});
          }
          
        }

        handleLoadingState(false);
        form.resetFields();
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

  /**
   * Handles the sending of responses when the user chooses to change the entity.
   * @async
   * @function handleSendButton
   * @returns {Promise<void>}
   */
  const handleSendButton = async () => {
    handleSend(fetchQuestions);
  };

  /**
   * Handles the sending of responses when the user chooses to get the questions of the same entity.
   * @async
   * @function handleSendSameEntityButton
   * @returns {Promise<void>}
   */
  const handleSendSameEntityButton = async () => {
    setLoading(true);
    handleSend(funcProperties);
  };  


  /**
   * Checks entity properties and updates the relation selected.
   * @async
   * @function funcProperties
   * @returns {Promise<void>}
   */
  const funcProperties = async () => {
    try {
      const properties = await checkProperties(entitySelected, selectedCategory);
      if (properties) {
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


  /**
   * Method for tests of send the answer
   * @async
   * @function asyncTestFunction
   * @returns {Promise<void>}
   */
  const asyncTestFunction = async () => {
    console.log("Initiating asynchronous operation...");
    await new Promise(resolve => setTimeout(resolve, 3000)); 
    console.log("Asynchronous operation completed.");
    // throw new Error("Test error");
  };
  
  

  /**
   * Handles the user giving up on a question.
   * @function handleGiveUp
   * @returns {void}
   */
  const handleGiveUp = () => {
    setTitleChangeGiveUp(t('question.giveup'))
    setMsgChangeGiveUp(t('question.msgGiveUp', { answeredQuestions }));
    if (answeredQuestions>0) {
      saveStreak();
      fetchStreaks();
    }
    setGiveUp(true);
  }

  /**
   * Handles the restart of the game.
   * @function handleRestart
   * @returns {void}
   */
  const handleRestart = () => {
    form.resetFields();
    setAnsweredQuestions(0);
    setGiveUp(false);
    fetchQuestions(selectedCategory);
  };

  /**
   * Sets the selected category and triggers confirmation modal to change category.
   * @function handleCategoryChange
   * @param {string} value - New selected category value.
   * @returns {void}
   */
  const handleCategoryChange = (value) => {
    Modal.confirm({
      title: t('question.changeCat'),
      content: t('question.changeCatContent'),
      onOk: () => {        
        setGiveUp(true);
        setSelectedCategory(value);
        setSelCategory(value);
        setTitleChangeGiveUp(t('question.youChangeCat'))
        setMsgChangeGiveUp(t('question.youChangeCatMsg', { answeredQuestions }));

        //save streak
        if (answeredQuestions>0) {
          saveStreak();
          fetchStreaks();
        }

        setQuestionError(false);
      },
      onCancel: () => {},
      footer: (_, { CancelBtn, OkBtn }) => (
        <>
          <CancelBtn/>
          <OkBtn/>
        </>
      ),
    });
  };


  /**
   * Handles key down when the answer is a number
   * @function handleKeyDown
   * @param {Event} e
   * @returns {void}
   */
  const handleKeyDown = (e) => {
    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
      e.preventDefault();
    }
  };



  return (
    <Layout style={{ minHeight: "100vh" }}>

      {/* Menu */}
      <MenuComponent user={user} mode='horizontal'></MenuComponent>

      <Header style={headerStyle}>


      <Layout id='header' style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white'}}>
        
        {/* Info and logo */}
        <Sider style={{ width: '20%', textAlign: 'center', lineHeight: '120px', color: '#fff', backgroundColor: 'white', paddingTop: '20px' }}>
          <Image
            width={200}
            src={logo}
            style={{ paddingLeft: '10px',marginBottom: '20px' }}
            alt='Logo image'
          />
        </Sider>
        <Content id='content' style={{ flex: 1, textAlign: 'left', paddingLeft: '20px', color: 'black', backgroundColor: 'white'}}>
          <Title level={1} style={{ marginTop: '20px' ,fontWeight: 'bold' }}>Wiki Trivial</Title>
          <Title level={2} style={{ marginTop: '5px'}}>{t('login.title')}</Title>
        </Content>
      </Layout>

         
          
      </Header>
      <Content style={contentStyle}>

        <Layout>

          <Content width="100%" style={contentStyle}>   

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
                  <Link href="https://www.wikidata.org/?uselang=es" target="_blank" style={{fontSize:"20px"}}>Wikidata</Link>
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
              
              <div id='form' style={{ paddingTop: '20px', display: 'flex', alignItems: 'flex-start' }}>
                <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: 700 , flex: 1}}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    disabled={loading || questionError || loadingSend}
                  >
                    <Form.Item 
                        style={formStyle}
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
                        ) : answerIsNumber ? (
                            <InputNumber 
                                placeholder={t('question.answer')} 
                                min={0} 
                                step={1}
                                onKeyDown={handleKeyDown} 
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
                      
                    <Popconfirm
                        placement='rightTop'
                        title={t('question.popChangeEntity')}
                        description={t('question.popChangeEntityDescription', {labelSelected})}
                        onConfirm={handleSendSameEntityButton}
                        onCancel={handleSendButton}
                        okText={t('question.continueEntity')}
                        cancelText={t('question.changeEntity')}
                        overlayStyle={popconfirmStyle} 
                        open={popOpen}
                    ></Popconfirm>
                    <Button type="primary" htmlType="submit" 
                      style={{ marginRight: '20px'}} loading={loadings[0]} onClick={openPop}>
                      {t('question.buttonSend')}
                    </Button>


                      <Popconfirm
                        title={t('question.popGiveUp')}
                        description={t('question.sureGiveUp')}
                        onConfirm={handleGiveUp}
                        okText={t('yes')}
                        cancelText={t('no')}
                      >
                        <Button id='btn_gu' type="primary">
                          {t('question.popGiveUp')}
                        </Button>
                        
                      </Popconfirm>
                      
                    </Form.Item>

                  </Form>

                  <Card id='card' bordered={true} style={{marginLeft: '80px'}}>
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