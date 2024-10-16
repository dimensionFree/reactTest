// components/common/SEO.js
import React from 'react';
import Helmet from 'react-helmet';
import { SITE_NAME } from './constants'; // 假设 constants.js 文件存放在 common 目录下

const SEO = ({ title, description }) => {
    return (
        <Helmet>
            <title>{title} | {SITE_NAME}</title>
            <meta name="description" content={description ? description : `This is the ${title} page of ${SITE_NAME}`} />
        </Helmet>
    );
};

export default SEO;
