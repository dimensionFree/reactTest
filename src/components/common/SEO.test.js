import React from 'react';
import { render, waitFor } from '@testing-library/react';
import SEO from './SEO';

describe('SEO', () => {
    const originalUrl = window.location.href;

    afterEach(() => {
        window.history.replaceState({}, '', originalUrl);
    });

    test('文章页使用自己的规范网址和摘要', async () => {
        window.history.replaceState({}, '', '/article/read/article-123');
        render(<SEO title="测试文章" description="文章摘要" />);

        await waitFor(() => {
            expect(document.title).toBe('测试文章 | 意識低い拡散！');
            expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
                'href', 'https://lllspread.com/article/read/article-123'
            );
            expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
                'content', '文章摘要'
            );
            expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
                'content', 'https://lllspread.com/article/read/article-123'
            );
        });
    });

    test('关于页使用自己的规范网址', async () => {
        window.history.replaceState({}, '', '/about');
        render(<SEO title="关于我" description="个人介绍" />);

        await waitFor(() => {
            expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
                'href', 'https://lllspread.com/about'
            );
        });
    });
});
