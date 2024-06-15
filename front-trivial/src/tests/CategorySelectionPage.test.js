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
    console.log(okButton);
    fireEvent.click(okButton);

    expect(screen.queryByText('cat.welcome!')).not.toBeInTheDocument();
  });

//   it('shows classification table when button is clicked', async () => {
//     const mockUser = { displayName: 'Test User' };
//     localStorage.setItem('user', JSON.stringify(mockUser));

//     render(<CategorySelectionPage />);

//     // Simular clic en el botón de clasificación
//     const classificationButton = screen.getByText('Ver clasificación');
//     fireEvent.click(classificationButton);

//     // Verificar que se muestra la tabla de clasificación en un modal
//     expect(await screen.findByText('Tabla de Clasificación')).toBeInTheDocument();
//   });

//   it('checks authentication and sets user state correctly', async () => {
//     const mockUser = { displayName: 'Test User' };
//     localStorage.setItem('user', JSON.stringify(mockUser));

//     render(<CategorySelectionPage />);

//     // Verificar que la función de verificación de autenticación se llamó y estableció el estado de usuario correctamente
//     await waitFor(() => {
//       expect(localStorage.getItem('user')).toEqual(JSON.stringify(mockUser));
//     });
//   });
});
