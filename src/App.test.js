import { render, screen } from '@testing-library/react';
import App from './App';

test('首页仅显示登录入口，不显示注册入口', () => {
  render(<App />);
  expect(screen.getByRole('link', { name: /^sign in$/i })).toBeInTheDocument();
  expect(screen.queryByText(/sign up/i)).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'サイトの更新履歴' })).toHaveAttribute('href', '/changelog');
  expect(screen.getByRole('navigation').querySelector('a[href="/changelog"]')).toBeNull();
  expect(screen.getByRole('navigation').querySelector('a[href="/article/read/c16bd235375769906386ff107b0b7dc7"]')).toHaveTextContent('Geo Lab');
});
