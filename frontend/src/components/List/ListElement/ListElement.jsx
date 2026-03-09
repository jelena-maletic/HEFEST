import './ListElement.css';
import React, { useState } from 'react';
import { SmallButton } from "../../SmallButton.jsx";
import { loadAssets } from "../../../utils/dataHelpers.js";
import {deleteElement, updateProjekat} from "../../../services/apiHelpers.js";
import CenteredOverlay from "../../CenteredOverlay/CenteredOverlay.jsx";
import DynamicForm from "../../DynamicForm.jsx";

export function ListElement({ screenState, listElementData, onClickFunc, isEditable, className, tag, selectedSchema }) {
    const [isHovered, setIsHovered] = useState(false);
    const [updateForm, setUpdateForm] = useState(false);

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
                            setIsHovered(false);
                            console.log("Edit kliknut za:", listElementData.id);
                            setUpdateForm(true)
                        }}
                    />
                    <SmallButton
                        className="nested-button"
                        type="delete"
                        onClickHandler={(e) => {
                            e.stopPropagation();
                            setIsHovered(false);
                            const r = deleteElement(tag, listElementData.id);
                            console.log("Delete kliknut za: ", listElementData.id, "  ", r);
                        }}
                    />
                </div>
            );
        }
        return null;
    };

    var image = isHovered ? images[`${screenState}-inverted`] : images[`${screenState}`];

    return (
        <>
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
                src={image}
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
            {updateForm && (
                <CenteredOverlay className="form-overlay" isVisible={updateForm} onClose={() => setUpdateForm(false)}>
                    <DynamicForm className="form"
                        schema={selectedSchema}
                        onClose={() => setUpdateForm(false)}
                        initialValues={listElementData}
                        onSubmit={(listElementData) => updateProjekat(tag, listElementData.id, listElementData)}
                    />
                </CenteredOverlay>
            )}
        </>
    );
}