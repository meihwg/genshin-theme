import React, { useEffect, useState } from 'react';
import './theme-maker.scss';

const NAMECARD_JSON_URL = "https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/namecards.json";

type NamecardData = {
    [key: string]: {
        icon: string;
    };
};

type ThemePreview = {
    [key: string]: string | null; // "0,0" -> namecardId ou null
};

const ThemeMaker: React.FC = () => {
    
    const [namecards, setNamecards] = useState<NamecardData>({});
    const [myNamecards, setMyNamecards] = useState<string[]>([]);
    const [themePreview, setThemePreview] = useState<ThemePreview>({});

    useEffect(() => {
        // Charger les namecards depuis l'API
        fetch(NAMECARD_JSON_URL)
            .then(res => res.json())
            .then((data: NamecardData) => setNamecards(data))
            .catch(err => console.error("Erreur de récupération des namecards:", err));
        
        // Charger mes namecards depuis le localStorage
        const savedNamecards = localStorage.getItem('myNamecards');
        if (savedNamecards) {
            setMyNamecards(JSON.parse(savedNamecards));
        }

        // Charger le thème de prévisualisation depuis le localStorage
        const savedTheme = localStorage.getItem('themePreview');
        if (savedTheme) {
            setThemePreview(JSON.parse(savedTheme));
        }
    }, []);

    const addToMyNamecards = (id: string) => {
        if (!myNamecards.includes(id)) {
            const updatedNamecards = [...myNamecards, id];
            setMyNamecards(updatedNamecards);
            localStorage.setItem('myNamecards', JSON.stringify(updatedNamecards));
        }
    };

    const removeFromMyNamecards = (id: string) => {
        const updatedNamecards = myNamecards.filter(namecardId => namecardId !== id);
        setMyNamecards(updatedNamecards);
        localStorage.setItem('myNamecards', JSON.stringify(updatedNamecards));
    };

    const handleDragStart = (e: React.DragEvent, namecardId: string) => {
        e.dataTransfer.setData('text/plain', namecardId);
    };

    const handleDrop = (e: React.DragEvent, cellKey: string) => {
        e.preventDefault();
        const namecardId = e.dataTransfer.getData('text/plain');
        
        const currentNamecard = themePreview[cellKey];
        const updatedTheme = { ...themePreview };
        
        // Si la case était déjà occupée, remettre l'ancienne namecard dans mes namecards
        if (currentNamecard && !myNamecards.includes(currentNamecard)) {
            const updatedMyNamecards = [...myNamecards, currentNamecard];
            setMyNamecards(updatedMyNamecards);
            localStorage.setItem('myNamecards', JSON.stringify(updatedMyNamecards));
        }
        
        // Placer la nouvelle namecard
        updatedTheme[cellKey] = namecardId;
        
        // Retirer la namecard de sa case d'origine si elle était déjà dans la prévisualisation
        Object.keys(updatedTheme).forEach(key => {
            if (key !== cellKey && updatedTheme[key] === namecardId) {
                updatedTheme[key] = null;
            }
        });
        
        setThemePreview(updatedTheme);
        localStorage.setItem('themePreview', JSON.stringify(updatedTheme));
        
        // Si la namecard était dans mes namecards, la retirer
        if (myNamecards.includes(namecardId)) {
            const updatedMyNamecards = myNamecards.filter(id => id !== namecardId);
            setMyNamecards(updatedMyNamecards);
            localStorage.setItem('myNamecards', JSON.stringify(updatedMyNamecards));
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleCellClick = (cellKey: string) => {
        const currentNamecard = themePreview[cellKey];
        if (currentNamecard) {
            // Retirer de la prévisualisation
            const updatedTheme = { ...themePreview };
            updatedTheme[cellKey] = null;
            setThemePreview(updatedTheme);
            localStorage.setItem('themePreview', JSON.stringify(updatedTheme));
            
            // Remettre dans mes namecards si pas déjà présente
            if (!myNamecards.includes(currentNamecard)) {
                const updatedMyNamecards = [...myNamecards, currentNamecard];
                setMyNamecards(updatedMyNamecards);
                localStorage.setItem('myNamecards', JSON.stringify(updatedMyNamecards));
            }
        }
    };

    const handleDropInMyNamecards = (e: React.DragEvent) => {
        e.preventDefault();
        const namecardId = e.dataTransfer.getData('text/plain');
        
        // Si la namecard était dans la prévisualisation, la retirer
        const updatedTheme = { ...themePreview };
        Object.keys(updatedTheme).forEach(key => {
            if (updatedTheme[key] === namecardId) {
                updatedTheme[key] = null;
            }
        });
        setThemePreview(updatedTheme);
        localStorage.setItem('themePreview', JSON.stringify(updatedTheme));
        
        // Ajouter à mes namecards si pas déjà présente
        if (!myNamecards.includes(namecardId)) {
            const updatedMyNamecards = [...myNamecards, namecardId];
            setMyNamecards(updatedMyNamecards);
            localStorage.setItem('myNamecards', JSON.stringify(updatedMyNamecards));
        }
    };

    const handleDragOverMyNamecards = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDropInMyNamecardsReorder = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');
        
        // Si c'est une namecard de la prévisualisation, la retirer d'abord
        const updatedTheme = { ...themePreview };
        Object.keys(updatedTheme).forEach(key => {
            if (updatedTheme[key] === draggedId) {
                updatedTheme[key] = null;
            }
        });
        setThemePreview(updatedTheme);
        localStorage.setItem('themePreview', JSON.stringify(updatedTheme));
        
        // Réorganiser mes namecards
        const currentIndex = myNamecards.indexOf(draggedId);
        if (currentIndex !== -1) {
            const updatedMyNamecards = [...myNamecards];
            updatedMyNamecards.splice(currentIndex, 1);
            updatedMyNamecards.splice(targetIndex, 0, draggedId);
            setMyNamecards(updatedMyNamecards);
            localStorage.setItem('myNamecards', JSON.stringify(updatedMyNamecards));
        } else {
            // Si la namecard n'était pas dans mes namecards, l'ajouter à la position cible
            const updatedMyNamecards = [...myNamecards];
            updatedMyNamecards.splice(targetIndex, 0, draggedId);
            setMyNamecards(updatedMyNamecards);
            localStorage.setItem('myNamecards', JSON.stringify(updatedMyNamecards));
        }
    };

    // Filtrer les namecards pour exclure celles qui sont dans mes namecards ou dans la prévisualisation
    const previewNamecardIds = Object.values(themePreview).filter(id => id !== null) as string[];
    const availableNamecards = Object.entries(namecards).filter(([id]) => 
        !myNamecards.includes(id) && !previewNamecardIds.includes(id)
    );
    
    // Filtrer mes namecards pour exclure celles qui sont dans la prévisualisation
    const myNamecardsFiltered = myNamecards.filter(id => !previewNamecardIds.includes(id));

    const renderTableCell = (row: number, col: number) => {
        const cellKey = `${row},${col}`;
        const namecardId = themePreview[cellKey];
        const namecard = namecardId ? namecards[namecardId] : null;

        return (
            <td
                key={cellKey}
                onDrop={(e) => handleDrop(e, cellKey)}
                onDragOver={handleDragOver}
                onClick={() => handleCellClick(cellKey)}
                className="namecard-item-td"
                title={namecard ? "Click to remove or drag and drop somewhere else" : "Drop a namecard here"}
            >
                {namecard && namecardId && (
                    <img
                        src={`https://enka.network/ui/${namecard.icon}.png`}
                        alt={namecard.icon}
                        className="namecard-item-image"
                        draggable
                        onDragStart={(e) => handleDragStart(e, namecardId)}
                    />
                )}
            </td>
        );
    };

    return <section className="theme-maker">
        <div className="theme-maker-container">
            <h2>Theme Profile Preview</h2>
            <div className="theme-maker-preview-container">
                <table>
                    <tbody>
                        <tr>
                            {renderTableCell(0, 0)}
                            {renderTableCell(0, 1)}
                            {renderTableCell(0, 2)}
                            {renderTableCell(0, 3)}
                        </tr>
                        <tr>
                            {renderTableCell(1, 0)}
                            {renderTableCell(1, 1)}
                            {renderTableCell(1, 2)}
                            {renderTableCell(1, 3)}
                        </tr>
                        <tr>
                            {renderTableCell(2, 0)}
                            {renderTableCell(2, 1)}
                            {renderTableCell(2, 2)}
                            {renderTableCell(2, 3)}
                        </tr>
                        <tr>
                            {renderTableCell(3, 0)}
                            {renderTableCell(3, 1)}
                            {renderTableCell(3, 2)}
                            {renderTableCell(3, 3)}
                        </tr>
                    </tbody>
                </table>
            </div>
            <h2>My Namecards</h2>
            <div 
                className="my-namecards-container"
                onDrop={handleDropInMyNamecards}
                onDragOver={handleDragOverMyNamecards}
            >
                {myNamecardsFiltered.map((id, index) => {
                    const namecard = namecards[id];
                    if (!namecard) return null;
                    
                    return (
                        <div 
                            key={id} 
                            className="namecard-item" 
                            onClick={() => removeFromMyNamecards(id)}
                            draggable
                            onDragStart={(e) => handleDragStart(e, id)}
                            onDrop={(e) => handleDropInMyNamecardsReorder(e, index)}
                            onDragOver={handleDragOverMyNamecards}
                        >
                            <img
                                src={`https://enka.network/ui/${namecard.icon}.png`}
                                alt={namecard.icon}
                                loading="lazy"
                                className="namecard-item-image"
                                title="Click to remove from my namecards, drag and drop to order or add to theme preview"
                            />
                        </div>
                    );
                })}
            </div>
            <h2>All Namecards</h2>
            <div className="all-theme-container">
                {availableNamecards.map(([id, { icon }]) => (
                    <div 
                        key={id} 
                        className="namecard-item" 
                        onClick={() => addToMyNamecards(id)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, id)}
                    >
                        <img
                            src={`https://enka.network/ui/${icon}.png`}
                            alt={icon}
                            loading="lazy"
                            className="namecard-item-image"
                            title="Click to add to my namecards"
                        />
                    </div>
                ))}
            </div>
        </div>
    </section>
};

export default ThemeMaker;
