import './ListElement.css';
import React, { useState } from 'react';
import { SmallButton } from "../../SmallButton.jsx";
import { loadAssets } from "../../../utils/dataHelpers.js";
import {deleteElement, updateElement} from "../../../services/apiHelpers.js";
import CenteredOverlay from "../../CenteredOverlay/CenteredOverlay.jsx";
import DynamicForm from "../../DynamicForm.jsx";
import { useNotification } from "../../NotificationContext.jsx";

export function ListElement({ screenState, listElementData, onClickFunc, isEditable, className, tag, selectedSchema }) {
    const [isHovered, setIsHovered] = useState(false);
    const [updateForm, setUpdateForm] = useState(false);

    const images = loadAssets();
    const notify = useNotification();

    const renderActionButtons = (editable) => {
        if (editable === true) {
            return (
                <div className="list-element-buttons">
                    <SmallButton
                        className="nested-button"
                        type="edit"
                        onClickHandler={(e) => {
                            e.stopPropagation();
                            setIsHovered(false);
                            console.log("Edit kliknut za:", listElementData.id);
                            console.log(listElementData);
                            setUpdateForm(true)
                        }}
                    />
                    <SmallButton
                        className="nested-button"
                        type="delete"
                        onClickHandler={async (e) => {
                            e.stopPropagation();
                            setIsHovered(false);
                            try {
                                const responseStatus = await deleteElement(tag, listElementData.id);

                                if (responseStatus >= 200 && responseStatus < 300) {
                                    notify.success("Obrisano", "Element je uspješno uklonjen.");
                                }
                            } catch (error) {
                                console.error("Greška pri brisanju:", error);
                                notify.error("Greška", "Neuspješno brisanje elementa.");
                            }
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
            style={{ cursor: 'pointer' }}
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

            {renderActionButtons(isEditable)}
        </div>
            {updateForm && (
                <CenteredOverlay className="form-overlay" isVisible={updateForm} onClose={() => setUpdateForm(false)}>
                    <DynamicForm className="form"
                        schema={selectedSchema}
                        onClose={() => setUpdateForm(false)}
                        initialValues={listElementData}
                        onSubmit={(formData) => {
                            const r = updateElement(tag, listElementData.id, formData)
                            return r;
                        }}
                    />
                </CenteredOverlay>
            )}
        </>
    );
}