import './ListElement.css';
import React, { useState } from 'react';
import { SmallButton } from "../../SmallButton.jsx";
import { loadAssets } from "../../../utils/dataHelpers.js";
import {deleteElement} from "../../../services/apiHelpers.js";

export function ListElement({ screenState, listElementData, onClickFunc, isEditable, className, tag}) {
    const [isHovered, setIsHovered] = useState(false);

    const images = loadAssets();

    console.log(listElementData);

    // Funkcija za prikaz akcionih dugmića (edit/delete)
    const renderActionButtons = (editable) => {
        if (editable === true) {
            return (
                <div className="list-element-buttons">
                    <SmallButton
                        className="nested-button"
                        type="edit"
                        onClickHandler={(e) => {
                            e.stopPropagation(); // Sprečava da klik na edit otvori glavni onClick
                            console.log("Edit kliknut za:", listElementData.id);
                        }}
                    />
                    <SmallButton
                        className="nested-button"
                        type="delete"
                        onClickHandler={(e) => {
                            e.stopPropagation();
                            const r = deleteElement(tag, listElementData.id);
                            console.log("Delete kliknut za: ", listElementData.id), "  ", r;
                        }}
                    />
                </div>
            );
        }
        return null;
    };

    return (
        /* PROMENJENO: Iz <button> u <div> da izbegnemo nesting grešku */
        <div
            className={`list-element ${className || ''} ${isHovered ? 'hovered' : ''}`}
            onClick={() => onClickFunc(listElementData)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ cursor: 'pointer' }} // Zadržavamo kursor ruke da korisnik zna da je klikabilno
        >
            <img
                className="list-image"
                alt="List Icon"
                src={isHovered ? images[`${screenState}-inverted`] : images[`${screenState}`]}
            />

            <div className="list-element-info">
                <span className="list-element-title">
                    {listElementData.title || "Bez naslova"}
                </span>
                <span className="list-element-detail">
                    {listElementData.detail}
                </span>
                <span className="list-element-subline">
                    {listElementData.subline}
                </span>
            </div>

            {/* Renderujemo dugmiće ako je isEditable true */}
            {renderActionButtons(isEditable)}
        </div>
    );
}