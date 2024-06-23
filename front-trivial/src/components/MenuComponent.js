import React, { useState } from 'react';
import { Button, Menu, notification, Modal } from 'antd';
import { MailOutlined, LogoutOutlined, LoginOutlined, TranslationOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import iconEnglish from '../icons8-circular-de-gran-bretaña-16.png';
import iconSpanish from '../icons8-circular-españa-16.png';
import '../styles/styles.css'; 


/**
 * Menu component for the application.
 * 
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.user - User data.
 * @param {string} props.mode - Menu mode (horizontal or vertical).
 * @returns {React.JSX.Element} Rendered component.
 */
const MenuComponent = ({user, mode}) => {
    const [language, setLanguage] = useState('es');
    const { t, i18n } = useTranslation();
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

    const href = user ? 'https://meta.wikimedia.org/wiki/Special:MyLanguage/User:' + user._json.username : '#';
    const labelLog = user ? t('menu.logout') : t('login.log_in');
    const iconLog = user ? React.createElement(LogoutOutlined) : React.createElement(LoginOutlined);


    //items of the menu (options)
    let items = [
      {
          key: 'logout',
          label: (
              <Button icon={iconLog} type="link" style={{color: 'black'}} onClick={() => log()}>
                  {labelLog}
              </Button>
          )
      },
      {
          key: 'language',
          label: (
              <Button icon={React.createElement(TranslationOutlined)} type="link" style={{color: 'black'}}>
                  {t('menu.changeLanguage')}
              </Button>
          ),
          children: [
              {
                  key: 'language:1',
                  label: (
                      <Button id='btn-Lan1' type="link" onClick={() => changeLanguage('es')}>
                          <img src={iconSpanish} alt="icon" style={{ width: '16px', height: '16px' }} /> {t('menu.spanish')}
                      </Button>
                  )
              },
              {
                  key: 'language:2',
                  label: (
                      <Button id='btn-Lan2' type="link" onClick={() => changeLanguage('en')}>
                          <img src={iconEnglish} alt="icon" style={{ width: '16px', height: '16px' }} /> {t('menu.english')}
                      </Button>
                  )
              }
          ]
      }
    ];

    //show profile only if user is authenticated
    if (user) {
        items.unshift({
            key: 'perfil',
            label: (
                <a href={href} target="_blank" rel="noopener noreferrer">
                    {t('menu.profile')}
                </a>
            ),
            icon: React.createElement(MailOutlined),
        });
    };

    /**
    * Changes the application language.
    * @function changeLanguage
    * @param {string} lang - Language code to change to (es or en).
    * @returns {void}
    */
    const changeLanguage = (lang) => {
        console.log("Language changed to "+lang);
        if (i18n) {
            i18n.changeLanguage(lang);
            setLanguage(lang);
        }
    };


    /**
    * Handles user login or logout.
    * @function log
    * @returns {void}
    */
    const log = () => {
        if (!user) {
          console.log("User logged in");
          handleLogin();
        } else {
          console.log('User logged out');
          setIsLogoutModalVisible(true);
        }
    };


    /**
    * Handles user logout confirmation.
    * @function handleLogout
    * @returns {void}
    */
    const handleLogout = () => {
        localStorage.removeItem('user');
        const redirectUrl = process.env.REACT_APP_BACKEND_BASE_URL + "/logout";
        window.location.href = redirectUrl;
    };


    /**
    * Handles user login by redirecting to the authentication URL and
    * fetching user data.
    * @function handleLogin
    * @async
    * @returns {Promise<Void>}
    */
    const handleLogin = async () => {
      const redirectUrl = process.env.REACT_APP_BACKEND_BASE_URL + "/login";
      window.location.href = redirectUrl;
      const userData = await fetchUserData(); 
  
      if (userData===null) {
        notification.error({message: t('login.errorOAuth'), description: t('login.descErrorOAuth'), placement: 'top'});
      } else {
        localStorage.setItem('user', JSON.stringify(userData)); 
      }
    };


    /**
    * Fetches user data from the backend.
    * @function fetchUserData
    * @async
    * @returns {Object|null} User data or null in case of an error.
    */
    const fetchUserData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/data.json");
        if (response.ok) {
          return await response.json();
        } else {
          console.error('Error fetching user data', response.statusText);
          return null;
        }
      } catch (error) {
        console.error('Error fetching the data of the user', error);
        return null;
      }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: 'white', width: '100%' }}>
            <Menu
                selectedKeys={[]}
                mode={mode}
                items={items}
                style={{ 
                    flex: 1, 
                    justifyContent: 'flex-end'
                }}
            />        
            <Modal
                title={
                    <span>
                        <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                        {t('logout.confirmTitle')}
                    </span>
                }
                open={isLogoutModalVisible}
                onOk={handleLogout}
                onCancel={() => setIsLogoutModalVisible(false)}
                okText="OK"
                cancelText={t('cancel')}
            >
                <p>{t('logout.confirmMessage')}</p>
            </Modal>
        </div>
    );
};

export default MenuComponent;
