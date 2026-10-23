// components/common/SEO.js
import React from 'react';
import Helmet from 'react-helmet';
import { SITE_NAME } from './constants';

const SITE_URL = 'https://lllspread.com';

const SEO = ({ title, description }) => {
    const canonicalUrl = `${SITE_URL}${window.location.pathname}`;
    const pageDescription = description || `This is the ${title} page of ${SITE_NAME}`;
    return (
        <Helmet>
            <title>{title} | {SITE_NAME}</title>
            <meta name="description" content={pageDescription} />
            <link rel="canonical" href={canonicalUrl} />
            <meta property="og:title" content={`${title} | ${SITE_NAME}`} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:url" content={canonicalUrl} />
        </Helmet>
    );
};

export default SEO;
