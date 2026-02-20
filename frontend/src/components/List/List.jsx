import { ListElement } from "./ListElement/ListElement.jsx";
import { SmallButton } from "../SmallButton.jsx";
import "./List.css";
import { useState } from "react";

const noop = () => {};

export function List({
                         listTitle,
                         screenState,
                         listData,
                         onClick = noop,
                         isEditable,
                         numElements = 4,
                         dividerWidth = "60%"
                     }) {

    const [view, setView] = useState("list");

    const smallButton = (editable) => {
        if (editable === true) {
            return (
                <SmallButton
                    style={'padding:20px'}
                    type="add"
                    onClickHandler={() => {
                        const nextView = view === "grid" ? "list" : "grid";
                        setView(nextView);
                        console.log(nextView);
                    }
                    }
                />
            );
        }
    };

    return (
        <div className="list">
            <div className="list-header">
                <span className="list-title">
                    {listTitle}
                </span>

                <div className="add-button">
                    {smallButton(isEditable)}
                </div>
            </div>

            <hr className="divider" style={{ width: dividerWidth }} />

            <div className={`list-content ${view}`}>
                {listData.slice(0, numElements).map((data, index) => (
                    <ListElement
                        key={index}
                        screenState={screenState}
                        listElementData={data}
                        onClickFunc={() => onClick()}
                        isEditable={isEditable}
                        className={view === "grid" ? "grid-element" : "list-element"}
                    />
                ))}
            </div>
        </div>
    );
}