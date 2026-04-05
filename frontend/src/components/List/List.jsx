import {ListElement} from "./ListElement/ListElement.jsx";
import {SmallButton} from "../SmallButton.jsx";
import "./List.css";
import {useEffect, useState} from "react";
import {createElement, fetchData} from "../../services/apiHelpers.js";
import { schemaMap } from "../../data/SchemaMap.jsx";
import DynamicForm from "../DynamicForm.jsx";
import CenteredOverlay from "../CenteredOverlay/CenteredOverlay.jsx";
import { NotificationProvider, useNotification } from "../NotificationContext.jsx";
import filterConfig from "../../data/filter-config.json";

const noop = () => {};

export function List({
                         listTitle,
                         screenState,
                         onClick = noop,
                         isEditable,
                         binaryChoice,
                         dividerWidth = "60%",
                         tag: initialTag,
                         filterByPoslovodja,
                         filterByTehnicar,
                         filterByMagacioner,
                         onSuccess
                     }) {

    const notify = useNotification();
    console.log("notify object:", notify);

    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState({});
    const [viewState, setViewState] = useState("list");
    const [listData, setListData] = useState([]);
    const [activeTag, setActiveTag] = useState(initialTag);

    const currentFilters = filterConfig[activeTag] || filterConfig[initialTag] || [];;

    const selectedSchema = schemaMap[activeTag];

    const reloadData = async () => {
        const data = await fetchData(activeTag, filterByPoslovodja, filterByTehnicar, filterByMagacioner);
        setListData(data || []);
    };

    const handleFilterChange = (property, value) => {
        if (property === "tag_override") {
            setActiveTag(value); // This triggers the reloadData useEffect
        } else {
            setActiveFilters(prev => ({ ...prev, [property]: value }));
        }
    };

    useEffect(() => {
        setActiveTag(initialTag);
    }, [initialTag]);

    useEffect(() => {
        if (onSuccess) onSuccess(reloadData);
        reloadData();

        setActiveFilters({});
        setSearchQuery("");
    }, [activeTag]);


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


    useEffect(() => {
        const getData = async () => {
            const data = await fetchData(activeTag, filterByPoslovodja, filterByTehnicar, filterByMagacioner);
            setListData(data || []);
        };

        getData();
    }, [activeTag]);

    useEffect(() => {
        reloadData();
    }, [activeTag]);

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

    const filteredData = listData.filter((item) =>{
        const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        for (let filter of currentFilters) {
            if (filter.property === "tag_override") continue;

            const selectedValue = activeFilters[filter.property];
            if (selectedValue !== undefined && selectedValue !== "") {
                if (String(item[filter.property]) !== String(selectedValue)) {
                    return false;
                }
            }
        }

        return true;
    });

    return (
        <div className="list">
            <div className="list-header">
                <span className="list-title">
                    {listTitle}
                </span>
                <div className="header-actions">
                    {currentFilters.length > 0 && (
                        <div className="modular-filters">
                            {currentFilters.map((filter, index) => (
                                <select
                                    key={index}
                                    className="custom-filter-select"
                                    value={filter.property === "tag_override" ? activeTag : (activeFilters[filter.property] || "")}
                                    onChange={(e) => handleFilterChange(filter.property, e.target.value)}
                                    title={filter.label}
                                >
                                    {filter.options.map((opt, optIndex) => (
                                        <option key={optIndex} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            ))}
                        </div>
                    )}
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Pretraži..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="small-buttons">
                        {viewButton(viewState)}
                        {addButton(isEditable)}
                    </div>
                </div>
            </div>

            <hr className="divider" style={{ width: dividerWidth }} />

            <div className={`list-content ${viewState}`}>
                {filteredData.map((data, index) => (
                    <ListElement
                        key={index}
                        screenState={screenState}
                        listElementData={data}
                        onClickFunc={(clickedData) => onClick(clickedData)}
                        isEditable={isEditable}
                        binaryChoice={binaryChoice}
                        className={viewState === "grid" ? "grid-element" : "list-element"}
                        tag = {activeTag}
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

                            let finalData = { ...data };

                            if (activeTag === "moji_dnevni_zadaci") {
                                const loggedInJmb = sessionStorage.getItem("jmb");
                                finalData.tehnicarJmb = loggedInJmb;
                                finalData.ulogovaniJmb = loggedInJmb;
                            }
                            try {
                                const apiTag = activeTag === "moji_dnevni_zadaci" ? "dnevni_zadaci" : activeTag;
                                const responseStatus = await createElement(apiTag, finalData);
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