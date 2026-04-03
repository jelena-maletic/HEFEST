import './ListElement.css';
import React, {useState} from 'react';
import {SmallButton} from "../../SmallButton.jsx";
import {loadAssets} from "../../../utils/dataHelpers.js";
import {deleteElement, updateElement, updateZahtjevStatus, api } from "../../../services/apiHelpers.js";
import CenteredOverlay from "../../CenteredOverlay/CenteredOverlay.jsx";
import DynamicForm from "../../DynamicForm.jsx";
import {useNotification} from "../../NotificationContext.jsx";
import ConfirmationDialog from "../../ConfirmationDialog.jsx";
import {updateZadatakStatus} from "../../../services/apiHelpers.js";
import { FilePdfOutlined } from '@ant-design/icons';
import {BUTTON_TYPES} from "../../../constants/smallButtonTypes.js";
import { Tooltip } from 'antd';

export function ListElement({
                                screenState,
                                listElementData,
                                onClickFunc,
                                isEditable,
                                binaryChoice,
                                className,
                                tag,
                                selectedSchema,
                                onSuccess
                            }) {
    const [isHovered, setIsHovered] = useState(false);
    const [updateForm, setUpdateForm] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const statusClass = listElementData.statusColor ? `status-${listElementData.statusColor}` : '';
    const truncateText = (text, maxLength) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    const titleLimit = 25;
    const detailLimit = 30;
    const sublineLimit = 40;

    const images = loadAssets();
    const notify = useNotification();

    const renderActionButtons = (editable, binaryChoice) => {

        const isIzvjestaj = tag && (tag.includes("izvjestaj") || tag.includes("izvjestaji"));
        //if (editable === true) {
            return (

                <div className="list-element-buttons">

                    {isIzvjestaj && (
                        <Tooltip title="Generiši PDF" color="#BFBFBF" mouseEnterDelay={0.1}>
                            <div className="pdf-button-wrapper">
                                <SmallButton
                                    type={BUTTON_TYPES.PDF}
                                    onClickHandler={handleDownloadPdf}
                                />
                            </div>
                        </Tooltip>
                    )}

                    {editable === true && (
                        <>
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
                        onClickHandler={(e) => {
                            e.stopPropagation();
                            setIsHovered(false);
                            setShowConfirm(true);
                        }}
                    />
                        </>
                    )}
                </div>
            );

        //}
        if (binaryChoice === true) {
            return (<div className="list-element-buttons">
                <SmallButton
                    className="nested-button"
                    type="confirm"
                    onClickHandler={ async (e) => {
                        /*e.stopPropagation();
                        console.log(listElementData);
                        updateZahtjevStatus(listElementData.id, "odobren");
                        onSuccess && onSuccess();*/
                        e.stopPropagation();
                        try {
                            await updateZahtjevStatus(listElementData.id, "odobren");
                            notify.success("Status ažuriran");
                            if (onSuccess) await onSuccess();
                        } catch (error) {
                            notify.error("Greška pri ažuriranju ", error);
                        }
                    }
                    }
                />
                <SmallButton
                    className="nested-button"
                    type="deny"
                    onClickHandler={ async (e) => {
                        e.stopPropagation();
                        try {
                            await updateZahtjevStatus(listElementData.id, "neodobren"); // Dodaj await
                            notify.success("Status ažuriran");
                            if (onSuccess) await onSuccess();
                        } catch (error) {
                            notify.error("Greška pri ažuriranju", error);
                        }
                    }}
                />
            </div>)
        }
        return null;
    };

    const handleStatusChange = async (e) => {
        const noviStatus = e.target.checked;

        try {
            await updateZadatakStatus(listElementData.id, noviStatus);

            notify.success("Status ažuriran", `Zadatak je označen kao ${noviStatus ? 'završen' : 'u toku'}.`);

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Greška pri ažuriranju statusa:", error);
            notify.error("Greška", "Nije moguće ažurirati status zadatka.");
        }
    };

    const handleDownloadPdf = async (e) => {
        e.stopPropagation();

        const id = listElementData.idIzvjestaja;

        if (!id) {
            console.error("Podaci elementa:", listElementData);
            notify.error("Greška", "ID izvještaja nije pronađen.");
            return;
        }

        try {
            const tip = tag.includes("dnevni") ? "dnevni_izvjestaji" : "sumarni_izvjestaji";

            const response = await api.service(true).get(`/${tip}/${id}/pdf`, {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;

            link.setAttribute('download', `${tip}_${id}.pdf`);

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);

            notify.success("Uspjeh", "Izvještaj se preuzima.");
        } catch (error) {
            console.error("Greška pri downloadu:", error);

            if (error.response && error.response.status === 403) {
                notify.error("Pristup odbijen", "Provjerite sesiju ili dozvole.");
            } else {
                notify.error("Greška", "Nije moguće generisati PDF.");
            }
        }
    };

    var image = isHovered ? images[`${screenState}-inverted`] : images[`${screenState}`];

    const apiTag = tag === "moji_dnevni_zadaci" ? "dnevni_zadaci" : tag;
    const isCompleted = apiTag === "dnevni_zadaci" && listElementData.zavrsen;

    const isTehnicar = tag && tag.includes("tehnicari");
    const isActiveTehnicar = isTehnicar && !!(listElementData.isAktivan || listElementData.aktivan);

    return (
        <>
            <div
                className={`list-element ${className || ''} ${isHovered ? 'hovered' : ''} 
                        ${isCompleted ? 'completed' : ''} 
                        ${isActiveTehnicar ? 'active-technician' : ''}
                        ${statusClass}`}
                onClick={() => onClickFunc(listElementData)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="list-image-wrapper">
                    <img

                        className={`list-image ${apiTag === "dnevni_zadaci" ? 'interactive-icon' : ''}`}
                        alt="List Icon"
                        src={image}
                        onClick={(e) => {
                            if (apiTag === "dnevni_zadaci") {
                                e.stopPropagation();
                                handleStatusChange({target: {checked: !listElementData.zavrsen}});
                            }
                        }}

                        title={apiTag === "dnevni_zadaci" ? (isCompleted ? "Vrati u tok" : "Označi kao završeno") : ""}
                    />
                </div>

                <div className="list-element-info">
                <span className="list-element-title">
               {truncateText(listElementData.title || "Bez naslova", titleLimit)}
        </span>
                    <span className="list-element-detail">
            {truncateText(listElementData.detail, detailLimit)}
        </span>
                    <span className="list-element-subline">
           {truncateText(listElementData.subline, sublineLimit)}
        </span>
                </div>

                {renderActionButtons(isEditable, binaryChoice)}
            </div>
            {updateForm && (
                <CenteredOverlay className="form-overlay" isVisible={updateForm} onClose={() => setUpdateForm(false)}>
                    <DynamicForm className="form"
                                 schema={selectedSchema}
                                 onClose={() => setUpdateForm(false)}
                                 initialValues={listElementData}
                                 onSubmit={async (formData) => {
                                     try {

                                         const response = await updateElement(tag, listElementData.id, formData);

                                         notify.success("Uspješno ažuriranje", "Podaci su uspješno izmijenjeni.", response);

                                         setUpdateForm(false);
                                         onSuccess && onSuccess();
                                     } catch (error) {
                                         console.error("Greška pri ažuriranju:", error);
                                         notify.error("Neuspješno ažuriranje", "Došlo je do greške, pokušajte ponovo.");
                                     }
                                 }}
                    />
                </CenteredOverlay>
            )}
            <ConfirmationDialog
                isVisible={showConfirm}
                title="Potvrda brisanja"
                message="Da li ste sigurni da želite obrisati ovaj element?"
                confirmText="Obriši"
                cancelText="Otkaži"
                onCancel={() => setShowConfirm(false)}
                onConfirm={async () => {
                    try {
                        const apiTag = tag === "moji_dnevni_zadaci" ? "dnevni_zadaci" : tag;
                        const responseStatus = await deleteElement(apiTag, listElementData.id);

                        if (responseStatus >= 200 && responseStatus < 300) {
                            notify.success("Obrisano", "Element je uspješno uklonjen.");
                            onSuccess && onSuccess();
                        }

                    } catch (error) {
                        console.error("Greška pri brisanju:", error);
                        notify.error("Greška", "Neuspješno brisanje elementa.");
                    } finally {
                        setShowConfirm(false);
                    }
                }}
            />
        </>

    );
}