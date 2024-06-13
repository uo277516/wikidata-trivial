import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import MenuComponent from './MenuComponent';

describe('Prueba para cambiar el idioma a inglés', () => {
  it('cambia el idioma a inglés cuando se selecciona', () => {
    act(() => {
      render(<MenuComponent />);
    });
    
    const { getByText } = render(<MenuComponent />);
    
    // Verificar que el idioma inicial es español
    expect(getByText('Cambiar Idioma')).toBeInTheDocument();
    
    // Simular clic en el botón de cambio de idioma a inglés
    act(() => {
      fireEvent.click(getByText('Inglés'));
    });
    
    // Verificar que el idioma ha cambiado a inglés
    expect(getByText('Cambiar Idioma')).toBeInTheDocument();
  });
});
