import React, { useState } from 'react';
import {MailOutlined, LogoutOutlined, LoginOutlined, TranslationOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useTranslation } from 'react-i18next';



const MenuComponent = (props) => {
    let {user} = props; 
    const href = user ? 'https://meta.wikimedia.org/wiki/Special:MyLanguage/User:' + user._json.username : '#';
    const labelLog = user ? 'Cerrar sesión' : 'Iniciar sesión';
    const iconLog = user ? React.createElement(LogoutOutlined) : React.createElement(LoginOutlined);
    
    const items = [
        {
          key: 'perfil',
          label: (
              <a href={href} target="_blank" rel="noopener noreferrer">
              Perfil de Wikimedia
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
          label: 'Cambiar idioma',
          key: 'language',
          icon: React.createElement(TranslationOutlined),
          children: [
            { label: 'Español', key: 'language:1' },
            { label: 'Inglés', key: 'language:2' },
          ],
        }

      ];

  const [current, setCurrent] = useState(null);

  const [language, setLanguage] = useState('es');
  const { t, i18n } = useTranslation();

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
