import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import MenuComponent from '../components/MenuComponent';


test('renders MenuComponent without crashing', () => {
  render(<MenuComponent />);
});

//i18ntext mocck for tests
jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: key => key }),
    withTranslation: () => Component => {
        Component.defaultProps = { ...Component.defaultProps, t: key => key };
        return Component;
    },
}));

describe('MenuComponent Tests', () => {
    test('changes language when language button is clicked', async () => {
      render(<MenuComponent />);

      expect(screen.getByText('menu.changeLanguage')).toBeInTheDocument();

      const consoleSpy = jest.spyOn(console, 'log');

      fireEvent.click(screen.getByText('menu.changeLanguage'));

      expect(consoleSpy).toHaveBeenCalledWith('Language changed');
    });


    test('log put functionality', async () => {
      const user = { _json: { username: 'testuser' } };

      const { getByText } = render(<MenuComponent user={user} />);
      
      expect(getByText('menu.logout')).toBeInTheDocument();

      const consoleSpy = jest.spyOn(console, 'log');

      fireEvent.click(getByText('menu.logout'));

      expect(consoleSpy).toHaveBeenCalledWith('User logged out');
    });


    test('log in functionality', async () => {
      const component = render(<MenuComponent user={null} />);
      
      expect(component.getByText('login.log_in')).toBeInTheDocument();

      const consoleSpy = jest.spyOn(console, 'log');

      fireEvent.click(component.getByText('login.log_in'));

      expect(consoleSpy).toHaveBeenCalledWith('User logged in');
    });


    test('shows error notification when login fails', async () => {
      jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Unauthorized'));

      render(<MenuComponent user={null} />);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      fireEvent.click(screen.getByText('login.log_in'));

      await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(screen.getByText('login.errorOAuth')).toBeInTheDocument();
      expect(screen.getByText('login.descErrorOAuth')).toBeInTheDocument();
  });
  

  test('displays profile link to Wikimedia in menu when user is logged in', () => {
    const user = { _json: { username: 'testuser' } };
    const { getByText } = render(<MenuComponent user={user} />);
    expect(getByText('menu.profile')).toBeInTheDocument();
  });


  test('redirects to Wikimedia profile page when profile link is clicked', () => {
    const user = { _json: { username: 'testuser' } };
    const { getByText } = render(<MenuComponent user={user} />);
    
    const profileLink = getByText('menu.profile');
    
    expect(profileLink).toBeInTheDocument();
    expect(profileLink.getAttribute('href')).toMatch(/https:\/\/meta\.wikimedia\.org\/wiki\/Special:MyLanguage\/User:testuser/);
    expect(profileLink.getAttribute('target')).toBe('_blank');
  });


  test('does not display profile option when user is null', () => {
    const { queryByText } = render(<MenuComponent user={null} />);
    const profileOption = queryByText('menu.profile');
    expect(profileOption).toBeNull();
  });

    
});