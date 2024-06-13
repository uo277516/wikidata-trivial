import React, { useState } from 'react';
import {MailOutlined, LogoutOutlined, LoginOutlined, TranslationOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import iconEnglish from '../icons8-circular-de-gran-bretaña-16.png'
import iconSpanish from '../icons8-circular-españa-16.png'



const MenuComponent = (props) => {
    let {user} = props; 
    const [current, setCurrent] = useState(null);

    const [language, setLanguage] = useState('es');
    const { t, i18n } = useTranslation();

    const href = user ? 'https://meta.wikimedia.org/wiki/Special:MyLanguage/User:' + user._json.username : '#';
    const labelLog = user ? t('menu.logout') : t('login.log_in');
    const iconLog = user ? React.createElement(LogoutOutlined) : React.createElement(LoginOutlined);

    
    
    const items = [
        {
          key: 'perfil',
          label: (
              <a href={href} target="_blank" rel="noopener noreferrer">
              {t('menu.profile')}
              </a>
          ),
          icon: React.createElement(MailOutlined),
        },
        {
          label: labelLog,
          key: 'logout',
          icon: iconLog
        },
        {
          label: t('menu.changeLanguage'),
          key: 'language',
          icon: React.createElement(TranslationOutlined),
          children: [
            { label: t('menu.spanish'), key: 'language:1', icon: <img src={iconSpanish} alt="icon" style={{ width: '16px', height: '16px' }} />, },
            { label: t('menu.english'), key: 'language:2' , icon: <img src={iconEnglish} alt="icon" style={{ width: '16px', height: '16px' }} />, },
          ],
        }

      ];

  

  const onClick = (e) => {
    setCurrent(null);

    if (e.key==="logout") {
        logOut();
    } 
    else if (e.key==="language:1") {
      i18n.changeLanguage('es');
      setLanguage('es');
    } else if (e.key==="language:2") {
      i18n.changeLanguage('en');
      setLanguage('en');
    }
  };

  const logOut = () => {
    localStorage.removeItem('user');
    const redirectUrl = process.env.REACT_APP_BACKEND_BASE_URL + "/logout";
    window.location.href = redirectUrl;
  };

  



    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: 'white', width: '100%' }}>
            <Menu
                onClick={onClick}
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
