import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
import MenuComponent from '../components/MenuComponent';

test('renders MenuComponent without crashing', () => {
  render(<MenuComponent />);
});

//mock de i18next para los tests
jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: key => key }),
    withTranslation: () => Component => {
        Component.defaultProps = { ...Component.defaultProps, t: key => key };
        return Component;
    },
}));

describe('MenuComponent Tests', () => {
    //menu cambiar idioma
    test('changes language when language button is clicked', async () => {
        render(<MenuComponent />);

        expect(screen.getByText('menu.changeLanguage')).toBeInTheDocument();

        fireEvent.click(screen.getByText('menu.changeLanguage'));
    });

    //inicio de desión
    test('log in and log out functionality', async () => {
      const user = { _json: { username: 'testuser' } };

      const { getByText } = render(<MenuComponent user={user} />);
      
      expect(getByText('menu.logout')).toBeInTheDocument();

      fireEvent.click(getByText('menu.logout'));

    });

    //cierre de desión
    test('log in and log out functionality', async () => {
  
      const component = render(<MenuComponent user={null} />);
      
      expect(component.getByText('login.log_in')).toBeInTheDocument();
    });
    
});