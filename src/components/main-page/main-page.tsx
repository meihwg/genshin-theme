import React from 'react';
import './main-page.scss';

import Header from '../header/header';
import Footer from '../footer/footer';
import ThemeMaker from '../pages/theme-maker/theme-maker';

const MainPage: React.FC = () => {
    return (
        <>
            <Header />
            <ThemeMaker />
            <Footer />
        </>
    );
}

export default MainPage;