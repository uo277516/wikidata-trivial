import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import QuestionCard from '../components/QuestionCard';
import vars from '../vars';


describe('QuestionCard tests', () => {
  const mockProps = {
    imagenUrl: 'https://example.com/pepitogrillo.jpg',
    questionSelected: 'a question bla bla bla',
    entity: 'Q12345',
    label: 'Pepito Grillo',
    relationSelected: 'P69'
  };

  test('renders with image when imagenUrl is provided', () => {
    render(<QuestionCard {...mockProps} />);
    const imageElement = screen.getByAltText('card.image');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', mockProps.imagenUrl);
  });


  test('renders with default image when imagenUrl is not provided', () => {
    const propsWithoutImage = { ...mockProps, imagenUrl: null };
    render(<QuestionCard {...propsWithoutImage} />);
    const imageElement = screen.getByAltText('card.noImage');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', vars.fallback);
  });


  test('evertyhing renders ok', () => {
    render(<QuestionCard {...mockProps} />);
    const question = screen.getByText(mockProps.relationSelected);
    expect(question).toBeInTheDocument();
    const linkElement = screen.getByText('card.link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', `https://www.wikidata.org/wiki/${mockProps.entity}`);
    expect(linkElement).toHaveAttribute('target', '_blank');
  });


});
