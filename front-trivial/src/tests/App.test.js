import { render, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
}));

test('renders app', () => {
  act(() => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  });
});
