import './ListElement.css'
import React, {useState} from 'react';
import {SmallButton} from "../../SmallButton.jsx";
import {loadAssets} from "../../../utils/dataHelpers.js";

export function ListElement({screenState, listElementData, onClickFunc, isEditable, className}) {
    const [isHovered, setIsHovered] = useState(false);

    const images = loadAssets();
    console.log(images);

    const smallButtons = (editable) => {
        if (editable === true) {
            return(<>
                <SmallButton className="nested-button" type={"edit"}/>
                <SmallButton className="nested-button" type={"delete"}/>
            </>);
        }
    }

    return (
        <button
            className={`list-element ${className || ''}`} // <-- OVDE dodaješ prop className
            onClick={() => {onClickFunc()}}
            onMouseOver={() => setIsHovered(true)}
            onMouseOut={() => setIsHovered(false)}
        >
            <img className="list-image" alt="List Image"
                 src={isHovered ?  images[`${screenState}-inverted`] : images[`${screenState}`]}/>
            <div className="list-element-info">
                <span className="list-element-title">{listElementData.title}</span>
                <span className="list-element-detail">{listElementData.detail}</span>
                <span className="list-element-subline">{listElementData.subline}</span>
            </div>
            <div className="list-element-buttons">
                {smallButtons(isEditable)}
            </div>
        </button>
    );
}