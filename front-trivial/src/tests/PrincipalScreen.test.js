import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PrincipalScreen from '../components/PrincipalScreen';
import axios from 'axios';

jest.mock('axios');

describe('PrincipalScreen tests', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: []
    });
  });

  test('renders component with initial loading state', () => {
    const categories = ['investigación', 'deporte', 'música']; 
    const user = { _json: { username: 'testuser' } }; 

    render(<PrincipalScreen category="deporte" categories={categories} user={user} />);

    expect(screen.getByText('Wiki Trivial')).toBeInTheDocument();
    expect(screen.getByText(/question.info2/i)).toBeInTheDocument();

    //sping loading driving
    expect(screen.getByText('question.load')).toBeInTheDocument();
  });

  test('fetches questions on screen', async () => {
    const categories = ['investigación', 'deporte', 'música']; 
    const user = { _json: { username: 'testuser' } };

    render(<PrincipalScreen category="deporte" categories={categories} user={user} />);

    await waitFor(() => {
        expect(screen.queryByText('question.load')).not.toBeInTheDocument();
    });
  });


  test('categories appears', async () => {
    const categories = ['investigación', 'deporte', 'música']; 
    const user = { _json: { username: 'testuser' } }; 

    render(<PrincipalScreen category="deporte" categories={categories} user={user} />);

    expect(screen.getByText('table.deporte')).toBeInTheDocument();
    expect(screen.getByText('table.música')).toBeInTheDocument();
    expect(screen.getByText('table.investigación')).toBeInTheDocument();

    await waitFor(() => {
        const sportTableButton = screen.getByText('table.deporte');
        expect(sportTableButton).toBeEnabled(); 
        fireEvent.click(sportTableButton);
        //voy a tener q cambiar el modal y ponerlo para poder hacer clic en el
    });
    


    // Confirma el cambio de categoría
    // fireEvent.click(screen.getByText('OK'));

    // // Verifica que se muestre la nueva categoría seleccionada
    // expect(screen.getByText('Pregunta de deporte')).toBeInTheDocument();
  });

//   test('changes category and reloads questions', async () => {
//     const categories = ['investigación', 'deporte', 'música']; // Simulación de categorías
//     const user = { _json: { username: 'testuser' } }; // Usuario simulado

//     render(<PrincipalScreen category="investigación" categories={categories} user={user} />);

//     // Simula el cambio de categoría
//     fireEvent.click(screen.getByText('Deporte'));

//     // Confirma el cambio de categoría
//     fireEvent.click(screen.getByText('OK'));

//     // Verifica que se muestre la nueva categoría seleccionada
//     expect(screen.getByText('Pregunta de deporte')).toBeInTheDocument();
//   });

//   test('sends answer and updates streak', async () => {
//     const categories = ['investigación', 'deporte', 'música']; // Simulación de categorías
//     const user = { _json: { username: 'testuser' } }; // Usuario simulado

//     render(<PrincipalScreen category="investigación" categories={categories} user={user} />);

//     // Simula la respuesta y la URL de referencia
//     fireEvent.change(screen.getByLabelText('Respuesta'), { target: { value: '2023' } });
//     fireEvent.change(screen.getByLabelText('URL de referencia'), { target: { value: 'https://example.com' } });

//     // Simula el envío de la respuesta
//     fireEvent.click(screen.getByText('Enviar'));

//     // Verifica que se actualice la racha de respuestas correctas
//     await waitFor(() => {
//       expect(screen.getByText('Ranking')).toHaveTextContent('1');
//     });
//   });


});
