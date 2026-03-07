import {ListElement} from "./ListElement/ListElement.jsx";
import {SmallButton} from "../SmallButton.jsx";
import "./List.css";
import {useEffect, useState} from "react";
import {createElement, fetchData} from "../../services/apiHelpers.js";
import { schemaMap } from "../../data/SchemaMap.jsx";
import DynamicForm from "../DynamicForm.jsx";
import CenteredOverlay from "../CenteredOverlay/CenteredOverlay.jsx";

const noop = (data) => {};

export function List({
                         listTitle,
                         screenState,
                         onClick = noop,
                         isEditable,
                         numElements = 8,
                         dividerWidth = "60%",
                         tag
                     }) {

    const [showForm, setShowForm] = useState(false);

    const selectedSchema = schemaMap[tag];

    const addButton = (editable) => {
        if(editable === true){
            return(
                <SmallButton
                    style={'padding:20px'}
                    type="add"
                    onClickHandler={() => setShowForm(true)}
                />
            )
        }
    }

    const [viewState, setViewState] = useState("list");

    const [listData, setListData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const data = await fetchData(tag);
            setListData(data || []); // Update state with the actual array
        };

        getData();
    }, [tag]);

    const viewButton = (viewState) => {
        if(viewState === "list"){
            console.log("viewState: ", viewState);
            return(<SmallButton style={'padding:20px'} type={viewState} onClickHandler={() => setViewState("grid")}/>)
        }
        else if(viewState === "grid"){
            console.log("viewState: ", viewState);
            return(<SmallButton style={'padding:20px'} type={viewState} onClickHandler={() => setViewState("list")}/>)
        }
    }

    //
    // const element = (numElements, index, data)=>{
    //     if(index < numElements){
    //         return (<ListElement key={index} screenState={screenState} listElementData={data} onClickFunc={() => onClick()} isEditable={isEditable}/>)
    //     }
    // }

    return (
        <div className="list">
            <div className="list-header">
                <span className="list-title">
                    {listTitle}
                </span>
                <div className="small-buttons">
                    {viewButton(viewState)}
                    {addButton(isEditable)}
                </div>
            </div>

            <hr className="divider" style={{ width: dividerWidth }} />

            <div className={`list-content ${viewState}`}>
                {listData.slice(0, numElements).map((data, index) => (
                    <ListElement
                        key={index}
                        screenState={screenState}
                        listElementData={data}
                        //onClickFunc={() => onClick()}
                        onClickFunc={(clickedData) => onClick(clickedData)}
                        isEditable={isEditable}
                        className={viewState === "grid" ? "grid-element" : "list-element"}
                        tag = {tag}
                        selectedSchema={selectedSchema}
                    />
                ))}
            </div>

            {showForm && (
                <CenteredOverlay isVisible={showForm} onClose={() => setShowForm(false)}>
                    <DynamicForm
                        schema={selectedSchema}
                        onClose={() => setShowForm(false)}
                        onSubmit={(data) => createElement(tag, data)}
                    />
                </CenteredOverlay>
            )}

        </div>
    );
}