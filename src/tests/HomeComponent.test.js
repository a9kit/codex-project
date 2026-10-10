import { render, screen } from '@testing-library/react';
import HomeComponent from '../components/HomeComponent';

test('renders learn react link', () => {
  render(<HomeComponent />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
