import {ListElement} from "./ListElement/ListElement.jsx";
import "./List.css"

export function List({screenState, listData}){
    function capitalizeFirstLetter(string) {
        if (!string) return ''; // Handle empty or null strings
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    let listTitle = capitalizeFirstLetter(screenState);

    return (
        <div className = "list">
            <span className="list-title">
                {listTitle}
            </span>
            <hr className="divider" />
            <div>
                {listData.map((data, index) => (
                    <ListElement key={index} screenState={screenState} listElementData={data}/>
                ))}
            </div>
        </div>
    )
}