import { render } from '@testing-library/react';

import App from '../App/app';

test('renders app component', () => {
  const { getByRole } = render(<App />);
  expect(getByRole('main')).toBeInTheDocument();
});
