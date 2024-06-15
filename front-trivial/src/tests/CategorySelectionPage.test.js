import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CategorySelectionPage from '../components/CategorySelectionPage';


describe('CategorySelectionPage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });
  

  it('renders LoginComponent when user is not logged in', () => {
    render(<CategorySelectionPage />);
    expect(screen.getByText('Wiki Trivial')).toBeInTheDocument();
    expect(screen.getByText('login.title')).toBeInTheDocument();
  });

  it('renders PrincipalScreen when user is logged in and change state is true', async () => {
    const mockUser = JSON.stringify({ _json: { username: 'testuser' } });
    localStorage.setItem('user', mockUser);

    render(<CategorySelectionPage />);

    //it shows the content of categorySelectionPage
    expect(await screen.getByText('cat.buttonClasification')).toBeInTheDocument();
  });

  it('handles category change and start game', async () => {
    const mockUser = JSON.stringify({ _json: { username: 'testuser' } });
    localStorage.setItem('user', mockUser);

    const {getAllByText} = render(<CategorySelectionPage />);

    const sportRadio = screen.getByText('cat.deporte');
    fireEvent.click(sportRadio);

    const startButton = screen.getByText('cat.startButton');
    fireEvent.click(startButton);

    //start game modal
    await waitFor(() => {
        expect(getAllByText('OK')[1]).toBeInTheDocument();
    });

    const okButton = getAllByText('OK')[1];
    fireEvent.click(okButton);

    expect(screen.queryByText('cat.welcome!')).not.toBeInTheDocument();
  });

  it('shows clasification table when button is clicked', async () => {
    const mockUser = JSON.stringify({ _json: { username: 'testuser' } });
    localStorage.setItem('user', mockUser);

    render(<CategorySelectionPage />);

    const catButton = screen.getByRole('button', { name: 'solution cat.buttonClasification' });
    fireEvent.click(catButton);

    expect(await screen.findByText('table.category')).toBeInTheDocument();
  });

});
