import {ListElement} from "./ListElement/ListElement.jsx";
import {SmallButton} from "../SmallButton.jsx";
import "./List.css";
import {useEffect, useState} from "react";
import {createElement, fetchData} from "../../services/apiHelpers.js";
import { schemaMap } from "../../data/SchemaMap.jsx";
import DynamicForm from "../DynamicForm.jsx";
import CenteredOverlay from "../CenteredOverlay/CenteredOverlay.jsx";
import { NotificationProvider, useNotification } from "../NotificationContext.jsx";

const noop = () => {};



export function List({
                         listTitle,
                         screenState,
                         onClick = noop,
                         isEditable,
                         dividerWidth = "60%",
                         tag,
                         filterByPoslovodja
                     }) {

    const notify = useNotification();
    console.log("notify object:", notify);
    const [showForm, setShowForm] = useState(false);

    const selectedSchema = schemaMap[tag];

    const reloadData = async () => {
        const data = await fetchData(tag, filterByPoslovodja);
        setListData(data || []);
    };

    useEffect(() => {
        reloadData();
    }, [tag]);

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
            const data = await fetchData(tag, filterByPoslovodja);
            setListData(data || []);
        };

        getData();
    }, [tag]);

    const viewButton = (viewState) => {
        if(viewState === "list"){
            return(<SmallButton style={'padding:20px'} type={viewState} onClickHandler={() => setViewState("grid")}/>)
        }
        else if(viewState === "grid"){
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
                {listData.map((data, index) => (
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
                        onSuccess={reloadData}
                    />
                ))}
            </div>

            {showForm && (
                <CenteredOverlay className="form-overlay" isVisible={showForm} onClose={() => setShowForm(false)}>
                    <DynamicForm
                        schema={selectedSchema}
                        onClose={() => setShowForm(false)}
                        //onSubmit={(data) => createProjekat(data)}
                        onSubmit={async (data) => {
                            console.log("Podaci iz forme koji idu ka servisu:", data);

                            //var response = await createElement(tag, data);
                            //console.log("Podaci iz forme koji idu:", response);
                            try {
                                const responseStatus = await createElement(tag, data);
                                console.log("Response status:", responseStatus);

                                if (responseStatus >= 200 && responseStatus < 300) {
                                     notify.success("Element je uspješno dodat", "Podaci su sačuvani");
                                    await reloadData();
                                }

                                setShowForm(false);
                            } catch (error) {
                                console.error("Greška pri kreiranju elementa:", error);
                                notify.error("Neuspješno dodavanje elementa", "Došlo je do greške, pokušajte ponovo")
                            }

                            setShowForm(false);
                        }}
                    />
                </CenteredOverlay>
            )}

        </div>
    );
}