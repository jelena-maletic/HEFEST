import './ListElement.css'
import React, {useState} from 'react';
import {SmallButton} from "../../SmallButton.jsx";

export function ListElement({screenState, listElementData, onClickFunc}) {
    const [isHovered, setIsHovered] = useState(false);
    const imagesLong = import.meta.glob('../../../assets/*.svg', {
        eager: true
    });

    const images = Object.entries(imagesLong).reduce((acc, [path, module]) => {
        let name = path.split('/').pop().replace(/\.svg/, '');
        acc[name] = module.default;
        return acc;
    }, {});

    return (
        <button className="list-element" onClick={() => {onClickFunc()}}
                onMouseOver={() => setIsHovered(true)}
                onMouseOut={() => setIsHovered(false)}>
            <img className="list-image" alt="List Image"
                 src={isHovered ?  images[`${screenState}-inverted`] : images[`${screenState}`]}/>
            <div className="list-element-info">
                <span className="list-element-title">{listElementData.title}</span>
                <span className="list-element-detail">{listElementData.detail}</span>
                <span className="list-element-subline">{listElementData.subline}</span>
            </div>
            <div className="list-element-buttons">
                <SmallButton className="nested-button" type={"edit"}/>
                <SmallButton className="nested-button" type={"delete"}/>
            </div>
        </button>)
}