import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SEC-TESTER home screen', () => {
  render(<App />);
  expect(screen.getAllByText(/CYBERPUNK SECURITY ASSESSMENT PLATFORM/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/BMAD METHOD COMPLIANT/i)).toBeInTheDocument();
});
