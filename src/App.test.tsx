import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders publishing tool header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Publishing Tool/i);
  expect(headerElement).toBeInTheDocument();
});
