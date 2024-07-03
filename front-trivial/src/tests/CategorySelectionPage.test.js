import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CategorySelectionPage from '../components/CategorySelectionPage';
import LoginComponent from '../components/LoginComponent';
import PrincipalScreen from '../components/PrincipalScreen';

describe('CategorySelectionPage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });
  

  it('renders LoginComponent when user is not logged in', () => {
    render(<CategorySelectionPage/>);
    expect(screen.getByText('Wiki Trivial')).toBeInTheDocument();
    expect(screen.getByText('login.title')).toBeInTheDocument();
  });

  it('renders CategorySelectionPage when user is logged in', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({ user: { displayName: 'testuser' } }),
      })
    );

    render(<CategorySelectionPage/>);
    expect(screen.getAllByText('login.log_in')[0]).toBeInTheDocument();
  });


  it('shows clasification table when button is clicked', async () => {
    const categories = ['investigación', 'deporte', 'música']; 
    const user = { _json: { username: 'testuser' } }; 

    render(<PrincipalScreen category="deporte" categories={categories} user={user} />);

    const catButton = screen.getByRole('button', { name: 'solution cat.buttonClasification' });
    fireEvent.click(catButton);

    expect(await screen.findByText('table.category')).toBeInTheDocument();
  });

});
