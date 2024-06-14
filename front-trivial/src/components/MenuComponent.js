import React, { useState } from 'react';
import { Button, Menu, notification } from 'antd';
import { MailOutlined, LogoutOutlined, LoginOutlined, TranslationOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import iconEnglish from '../icons8-circular-de-gran-bretaña-16.png';
import iconSpanish from '../icons8-circular-españa-16.png';

const MenuComponent = (props) => {
    let { user } = props; 
    const [current, setCurrent] = useState(null);

    const [language, setLanguage] = useState('es');
    const { t, i18n } = useTranslation();

    const href = user ? 'https://meta.wikimedia.org/wiki/Special:MyLanguage/User:' + user._json.username : '#';
    const labelLog = user ? t('menu.logout') : t('login.log_in');
    const iconLog = user ? React.createElement(LogoutOutlined) : React.createElement(LoginOutlined);

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
              <Button icon={React.createElement(TranslationOutlined)} type="link" style={{color: 'black'}} onClick={() => console.log("Language changed")}>
                  {t('menu.changeLanguage')}
              </Button>
          ),
          children: [
              {
                  key: 'language:1',
                  label: (
                      <Button type="link" onClick={() => changeLanguage('es')}>
                          <img src={iconSpanish} alt="icon" style={{ width: '16px', height: '16px' }} /> {t('menu.spanish')}
                      </Button>
                  )
              },
              {
                  key: 'language:2',
                  label: (
                      <Button type="link" onClick={() => changeLanguage('en')}>
                          <img src={iconEnglish} alt="icon" style={{ width: '16px', height: '16px' }} /> {t('menu.english')}
                      </Button>
                  )
              }
          ]
      }
    ];

    //ver perfil solo si usuario autenticado
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

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setLanguage(lang);
    };

    const log = () => {
        if (!user) {
          console.log("User logged in");
          handleLogin();
        } else {
          console.log('User logged out');
          localStorage.removeItem('user');
          const redirectUrl = process.env.REACT_APP_BACKEND_BASE_URL + "/logout";
          window.location.href = redirectUrl;
        }
    };

    const handleLogin = async () => {
      const redirectUrl = process.env.REACT_APP_BACKEND_BASE_URL + "/login";
      window.location.href = redirectUrl;
      const userData = await fetchUserData(); //datos del usuario
  
      if (userData===null) {
        notification.error({message: t('login.errorOAuth'), description: t('login.descErrorOAuth'), placement: 'top'});
      } else {
        localStorage.setItem('user', JSON.stringify(userData)); //almacenar datos en localStorage
      }
    };

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
                mode="horizontal"
                items={items}
                style={{ 
                    flex: 1, 
                    justifyContent: 'flex-end'
                }}
            />        
        </div>
    );
};

export default MenuComponent;
