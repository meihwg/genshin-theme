import React from 'react';
import './footer.scss';

const Footer: React.FC = () => {
    return (
        <footer>
            <p>
               Developed by <a href="https://github.com/meihwg">meihwg</a>
            </p>
            <p>
                Using <a href="https://api.enka.network/#/">Enka.Network API</a>
            </p>
        </footer>
    );
};

export default Footer;
