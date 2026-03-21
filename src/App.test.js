import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the profile selection screen', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Numele copilului')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /adaug/i })).toBeInTheDocument();
});
