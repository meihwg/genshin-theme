import React from 'react';
import './footer.scss';

const Footer: React.FC = () => {
    return (
        <footer>
            <p>
               Developed by <a href="https://github.com/meihwg" target="_blank">Mei</a>
            </p>
            <p>
                Check out the <a href="https://github.com/meihwg/genshin-theme" target="_blank">GitHub repository</a>
            </p>
            <p>
                This website uses the <a href="https://api.enka.network/#/" target="_blank">Enka.Network API</a>
            </p>
        </footer>
    );
};

export default Footer;
