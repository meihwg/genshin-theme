import React from 'react';
import './header.scss';

// Import des composants de pages

import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
    const { t, i18n } = useTranslation();

    const switchTo = (lang: string) => i18n.changeLanguage(lang);

    return (
            <header>
                <div className="header-title">
                    <h1>Genshin Theme Profile Maker</h1>
                </div>
            </header>
    );
}

export default Header;
