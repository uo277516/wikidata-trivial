import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
import MenuComponent from '../components/MenuComponent';
import userEvent from '@testing-library/user-event';


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

      const consoleSpy = jest.spyOn(console, 'log');

      fireEvent.click(screen.getByText('menu.changeLanguage'));

      //verifico q se llama a log out
      expect(consoleSpy).toHaveBeenCalledWith('Language changed');
    });

    //cierre de desión
    test('log put functionality', async () => {
      const user = { _json: { username: 'testuser' } };

      const { getByText } = render(<MenuComponent user={user} />);
      
      expect(getByText('menu.logout')).toBeInTheDocument();

      const consoleSpy = jest.spyOn(console, 'log');

      fireEvent.click(getByText('menu.logout'));

      //verifico q se llama a log out
      expect(consoleSpy).toHaveBeenCalledWith('User logged out');
    });

    //inicio de desión
    test('log in functionality', async () => {
      const component = render(<MenuComponent user={null} />);
      
      expect(component.getByText('login.log_in')).toBeInTheDocument();

      const consoleSpy = jest.spyOn(console, 'log');

      fireEvent.click(component.getByText('login.log_in'));

      //verifico q se llama a log in
      expect(consoleSpy).toHaveBeenCalledWith('User logged in');
    });
    
});