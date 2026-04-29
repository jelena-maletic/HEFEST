import plus from "../assets/plus.svg";
import plusInverted from "../assets/plus-inverted.svg";
import trash from "../assets/trash.svg";
import trashInverted from "../assets/trash-inverted.svg";
import edit from "../assets/edit.svg";
import editInverted from "../assets/edit-inverted.svg";
import grid from "../assets/grid.svg";
import gridInverted from "../assets/grid-inverted.svg";
import list from "../assets/list.svg";
import listInverted from "../assets/list-inverted.svg";
import check from "../assets/check.svg";
import checkInverted from "../assets/check-inverted.svg";
import cross from "../assets/cross.svg";
import crossInverted from "../assets/cross-inverted.svg";
import {BUTTON_TYPES} from "../constants/smallButtonTypes.js";
import React from "react";
import pdf from "../assets/pdf.svg";
import pdfInverted from "../assets/pdf-inverted.svg";
import './SmallButton.css'
import {useDarkMode} from "./DarkModeContext.jsx";




export function SmallButton({type, onClickHandler}){

    const [isHovered, setIsHovered] = React.useState(false);
    const { isDark } = useDarkMode();

    const useInverted = isHovered !== isDark;

    const CONFIG_MAP = {
        [BUTTON_TYPES.ADD]: { icon: plus, invertedIcon: plusInverted },
        [BUTTON_TYPES.DELETE]: { icon: trash, invertedIcon: trashInverted },
        [BUTTON_TYPES.EDIT]: { icon: edit, invertedIcon: editInverted },
        [BUTTON_TYPES.GRID_VIEW]: {icon: grid, invertedIcon: gridInverted},
        [BUTTON_TYPES.LIST_VIEW]: {icon: list, invertedIcon: listInverted},
        [BUTTON_TYPES.CONFIRM]: {icon: check, invertedIcon: checkInverted},
        [BUTTON_TYPES.DENY]: {icon: cross, invertedIcon: crossInverted},
        [BUTTON_TYPES.PDF]: {icon: pdf, invertedIcon: pdfInverted}
    };

    const config = CONFIG_MAP[type];

    return(
        <button type="button" className="small-button" onClick={onClickHandler}
            onMouseOver={() => setIsHovered(true)}
            onMouseOut={() => setIsHovered(false)}>
            <img className="icon" src={useInverted ? config.invertedIcon : config.icon} alt="x"/>
        </button>
    )
}