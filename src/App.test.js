import { render, screen } from '@testing-library/react';
import App from './App';

test('首页仅显示登录入口，不显示注册入口', () => {
  render(<App />);
  expect(screen.getByRole('link', { name: /^sign in$/i })).toBeInTheDocument();
  expect(screen.queryByText(/sign up/i)).not.toBeInTheDocument();
});
