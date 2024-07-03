import React from 'react';
import { render, fireEvent, waitFor , screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginComponent from '../components/LoginComponent';

jest.mock('axios');

describe('LoginComponent tests', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });


  it('renders correctly when not logged in', () => {
    render(<LoginComponent />);
    expect(screen.getByText('Wiki Trivial')).toBeInTheDocument();
    expect(screen.getByText('login.title')).toBeInTheDocument();
    //login button
    expect(screen.getAllByText('login.log_in')[1]).toBeInTheDocument(); //because the 0 is the butotn in the menu
    expect(screen.getByText('menu.changeLanguage')).toBeInTheDocument();

  });


  it('renders cat page when logged in', async () => {
    const user = JSON.stringify({ _json: { username: 'testuser' } });
    localStorage.setItem('user', user);

    render(<LoginComponent />);
    //when login displays the other page
    expect(screen.queryByText('info.log_in')).not.toBeInTheDocument();
  });


  it('checks authentication correctly', async () => {
    const user = JSON.stringify({ _json: { username: 'testuser' } });
    localStorage.setItem('user', user);

    render(<LoginComponent />);

    expect(localStorage.getItem('user')).not.toBeNull();
  });


  it('handles login failure', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Unable to login'));


    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<LoginComponent />);
    const loginButton = screen.getAllByText('login.log_in')[1];
    fireEvent.click(loginButton);

    expect(consoleErrorSpy).toHaveBeenCalled();
  });


  it('handles login correctly', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(<LoginComponent />);

    const loginButton = screen.getAllByText('login.log_in')[1];
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('User logged in');
    });
  });
});
