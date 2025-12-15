import {ListElement} from "./ListElement/ListElement.jsx";
import {SmallButton} from "../SmallButton.jsx";
import "./List.css"

const noop = () => {};

export function List({listTitle, screenState, listData, onClick = noop, isEditable, numElements = 4, dividerWidth = "40%"}) {

    const smallButton = (editable) => {
        if(editable === true){
            return(<SmallButton style={'padding:20px'} type="add"/>)
        }
    }


    const element = (numElements, index, data)=>{
        if(index < numElements){
            return (<ListElement key={index} screenState={screenState} listElementData={data} onClickFunc={() => onClick()} isEditable={isEditable}/>)
        }
    }

    return (
        <div className = "list">
            <div className = "list-header">
                <span className="list-title">
                    {listTitle}
                </span>
                <div className="add-button">
                    {smallButton(isEditable)}
                </div>
            </div>
            <hr className="divider" style={{width: dividerWidth}} />
            <div className="list-content">
                {listData.map((data, index) => (
                    element(numElements, index, data)
                ))}
            </div>
        </div>
    )
}