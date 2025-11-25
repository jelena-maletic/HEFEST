import {ListElement} from "./ListElement/ListElement.jsx";
import {SmallButton} from "../SmallButton.jsx";
import "./List.css"
import {BUTTON_TYPES} from "../../constants/smallButtonTypes.js";

export function List({listTitle, screenState, listData}){
    // function capitalizeFirstLetter(string) {
    //     if (!string) return ''; // Handle empty or null strings
    //     return string.charAt(0).toUpperCase() + string.slice(1);
    // }

    // let listTitle = capitalizeFirstLetter(screenState);

    return (
        <div className = "list">
            <div className = "list-header">
                <span className="list-title">
                    {listTitle}
                </span>
                <div className="add-button">
                    <SmallButton style={'padding:20px'} type="add"/>
                </div>
            </div>
            <hr className="divider" />
            <div>
                {listData.map((data, index) => (
                    <ListElement key={index} screenState={screenState} listElementData={data}/>
                ))}
            </div>
        </div>
    )
}