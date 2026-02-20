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
import {BUTTON_TYPES} from "../constants/smallButtonTypes.js";
import React from "react";
import './SmallButton.css'




export function SmallButton({type, onClickHandler}){

    const [isHovered, setIsHovered] = React.useState(false);

    const CONFIG_MAP = {
        [BUTTON_TYPES.ADD]: { icon: plus, invertedIcon: plusInverted },
        [BUTTON_TYPES.DELETE]: { icon: trash, invertedIcon: trashInverted },
        [BUTTON_TYPES.EDIT]: { icon: edit, invertedIcon: editInverted },
        [BUTTON_TYPES.GRID_VIEW]: {icon: grid, invertedIcon: gridInverted},
        [BUTTON_TYPES.LIST_VIEW]: {icon: list, invertedIcon: listInverted}
    };

    const config = CONFIG_MAP[type];

    return(
        <button className="small-button" onClick={onClickHandler}
            onMouseOver={() => setIsHovered(true)}
            onMouseOut={() => setIsHovered(false)}>
            <img className="icon" src={isHovered ? config.invertedIcon : config.icon} alt="x"/>
        </button>
    )
}