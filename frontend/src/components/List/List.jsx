import { useEffect, useState, useCallback, useMemo } from "react";
import { ListElement } from "./ListElement/ListElement.jsx";
import { SmallButton } from "../SmallButton.jsx";
import { FilterPanel } from "./FilterPanel/FilterPanel.jsx";
import "./List.css";
import "./FilterPanel/FilterPanel.css";
import { createElement, fetchData, api } from "../../services/apiHelpers.js";
import { schemaMap } from "../../data/SchemaMap.jsx";
import DynamicForm from "../DynamicForm.jsx";
import CenteredOverlay from "../CenteredOverlay/CenteredOverlay.jsx";
import { useNotification } from "../NotificationContext.jsx";
import filterConfig from "../../data/filter-config.json";
import {getJmb, getRole} from "../../auth/auth.js";
import { Pagination } from 'antd';
import {adjustFilterTag} from "../../utils/dataHelpers.js";
import {useDarkMode} from "../DarkModeContext.jsx";

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
                         onSuccess,
                     }) {
    const notify = useNotification();

    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState({});
    const [viewState, setViewState] = useState("list");
    const [listData, setListData] = useState([]);
    const [activeTag, setActiveTag] = useState(initialTag);
    const [filterTag, setFilterTag] = useState({activeTag});
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 4; // Broj elemenata po stranici


    const [endpointOptionsCache, setEndpointOptionsCache] = useState({});

    const currentFilters = filterConfig[filterTag] || filterConfig[initialTag] || [];
    const selectedSchema = schemaMap[activeTag];

    const fetchFilterOptions = useCallback(async (endpoint) => {
        const response = await api.service(true).get(endpoint);
        return response.data;
    }, []);

    const reloadData = useCallback(async () => {
        const data = await fetchData(activeTag, filterByPoslovodja, filterByTehnicar, filterByMagacioner);
        setListData(data || []);
    }, [activeTag, filterByPoslovodja, filterByTehnicar, filterByMagacioner]);

    useEffect(() => {
        setFilterTag(adjustFilterTag(initialTag, activeTag));
    }, [activeTag, initialTag]);

    useEffect(() => {
        reloadData();
        setActiveFilters({});
        setSearchQuery("");
        setCurrentPage(1);
        setEndpointOptionsCache({});
        if (onSuccess) onSuccess(reloadData);
    }, [activeTag, onSuccess, reloadData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, activeFilters]);

    const handleFilterChange = (property, value) => {
        if (property === "tag_override") {
            setActiveTag(value);
        } else {
            setActiveFilters((prev) => ({ ...prev, [property]: value }));
        }
    };

    const handleClearFilters = () => {
        setActiveFilters({});
    };

    const handleOptionsLoaded = (property, options) => {
        setEndpointOptionsCache((prev) => ({ ...prev, [property]: options }));
    };

    const activeChips = useMemo(() => {
        return currentFilters
            .filter((f) => f.property !== "tag_override" && activeFilters[f.property])
            .map((filter) => {
                const value = activeFilters[filter.property];
                let displayLabel = value;

                if (filter.endpoint) {
                    const cached = endpointOptionsCache[filter.property] || [];
                    displayLabel = cached.find((o) => o.value === value)?.label ?? value;
                } else {
                    displayLabel =
                        filter.options?.find((o) => String(o.value) === String(value))?.label ?? value;
                }

                return { property: filter.property, filterLabel: filter.label, displayLabel };
            });
    }, [currentFilters, activeFilters, endpointOptionsCache]);

    const filteredData = useMemo(() => {
        return listData.filter((item) => {
            if (!(item.title ?? '').toLowerCase().includes(searchQuery.toLowerCase())) return false;

            for (const filter of currentFilters) {
                if (filter.property === "tag_override") continue;
                const selected = activeFilters[filter.property];
                if (selected && String(item[filter.property]) !== String(selected)) return false;
            }

            return true;
        });
    }, [listData, searchQuery, activeFilters, currentFilters]);

    const addButton = (editable) => {
        if (editable !== true) return null;
        return (
            <SmallButton
                type="add"
                onClickHandler={() => setShowForm(true)}
            />
        );
    };

    const viewButton = (state) => {
        const next = state === "list" ? "grid" : "list";
        return <SmallButton type={state} onClickHandler={() => setViewState(next)} />;
    };

    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="list">
            <div className="list-header">
                <span className="list-title">{listTitle}</span>
                <div className="header-actions">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Pretraži..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {currentFilters.length > 0 && (
                        <FilterPanel
                            filters={currentFilters}
                            activeFilters={activeFilters}
                            activeTag={activeTag}
                            onFilterChange={handleFilterChange}
                            onClear={handleClearFilters}
                            onOptionsLoaded={handleOptionsLoaded}
                            fetchOptions={fetchFilterOptions}
                        />
                    )}
                    <div className="small-buttons">
                        {viewButton(viewState)}
                        {addButton(isEditable)}
                    </div>
                </div>
            </div>

            {activeChips.length > 0 && (
                <div className="filter-chips-bar">
                    {activeChips.map((chip) => (
                        <span key={chip.property} className="filter-chip">
                            {chip.filterLabel}: {chip.displayLabel}
                            <button
                                className="filter-chip-remove"
                                onClick={() => handleFilterChange(chip.property, "")}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <hr className="divider" style={{ width: dividerWidth }} />

            <div className={`list-content ${viewState}`}>
                {filteredData.length === 0 ? (
                    searchQuery.length > 0 ?(
                    <div className="no-results-message">
                        Nema rezultata!
                    </div>) :(
                        <div className="no-results-message">
                            Prazna lista!
                        </div>
                    )

                ) : (
                    currentItems.map((data) => (
                        <ListElement
                            key={data.id}
                            screenState={screenState}
                            listElementData={data}
                            onClickFunc={(clickedData) => onClick(clickedData)}
                            isEditable={isEditable}
                            binaryChoice={binaryChoice}
                            className={viewState === "grid" ? "grid-element" : "list-element"}
                            tag={activeTag}
                            selectedSchema={selectedSchema}
                            onSuccess={reloadData}
                        />
                    ))
                )}
            </div>

            {filteredData.length > pageSize && (
                <div className="pagination-container" style={{ marginTop: '20px', paddingBottom: '20px' }}>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredData.length}
                        onChange={(page) => setCurrentPage(page)}
                        showSizeChanger={false}
                        align="center"
                    />
                </div>
            )}

            {showForm && (
                <CenteredOverlay
                    className="form-overlay"
                    isVisible={showForm}
                    onClose={() => setShowForm(false)}
                >
                    <DynamicForm
                        schema={selectedSchema}
                        onClose={() => setShowForm(false)}
                        onSubmit={async (data) => {
                            let finalData = { ...data };

                            const currentTag = activeTag;
                            const loggedInJmb = sessionStorage.getItem("jmb") || getJmb();

                            if (currentTag === "projekti") {
                                finalData.ulogovaniJmb = loggedInJmb;
                            }

                            if (currentTag === "moji_dnevni_zadaci") {
                                finalData.tehnicarJmb = loggedInJmb;
                                finalData.ulogovaniJmb = loggedInJmb;
                            }

                            if (currentTag === "dnevni_zadaci") {
                                finalData.ulogovaniJmb = loggedInJmb;
                            }

                            if (currentTag === "vozila" || currentTag === "radna-oprema" || currentTag === "materijal") {
                                finalData.ulogovaniJmb = loggedInJmb;
                                console.log("PROVJERA PAYLOADA:", finalData);
                            }

                            if (currentTag === "zaduzenja") {
                                finalData.magacionerJMB = loggedInJmb;
                                if (finalData.resursId) {
                                    finalData.resursId = Number(finalData.resursId);
                                }
                                finalData.razduzenaKolicina = finalData.razduzenaKolicina || 0;
                            }

                            if (currentTag === "zahtjevi") {
                                finalData = {
                                    opis: data.opis,
                                    kolicina: Number(data.kolicina),
                                    resursId: Number(data.resursId),
                                    magacionerJMB: data.magacionerJMB,
                                    poslovodjaJMB: loggedInJmb,
                                    stanjeZahtjeva: "neobradjen",
                                    datumSlanja: new Date().toISOString()
                                };
                            }

                            try {
                                const apiTag =
                                    currentTag === "moji_dnevni_zadaci" ? "dnevni_zadaci" : currentTag;
                                const responseStatus = await createElement(apiTag, finalData);

                                if (responseStatus >= 200 && responseStatus < 300) {
                                    notify.success("Element je uspješno dodat", "Podaci su sačuvani");
                                    await reloadData();
                                }
                            } catch (error) {
                                console.error("Greška pri kreiranju elementa:", error);
                                notify.error(
                                    "Neuspješno dodavanje elementa",
                                    "Došlo je do greške, pokušajte ponovo"
                                );
                            } finally {
                                setShowForm(false);
                            }
                        }}
                    />
                </CenteredOverlay>
            )}
        </div>
    );
}