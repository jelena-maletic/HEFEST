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

    // Cache for options fetched from endpoints, used to resolve chip display labels
    const [endpointOptionsCache, setEndpointOptionsCache] = useState({});

    const currentFilters = filterConfig[activeTag] || filterConfig[initialTag] || [];
    const selectedSchema = schemaMap[activeTag];

    // Authenticated fetch for FilterPanel endpoint options.
    // Receives the endpoint string and returns the parsed data array.
    const fetchFilterOptions = useCallback(async (endpoint) => {
        const response = await api.service(true).get(endpoint);
        return response.data;
    }, []);

    // Stable fetch function — only recreated when its dependencies change
    const reloadData = useCallback(async () => {
        const data = await fetchData(activeTag, filterByPoslovodja, filterByTehnicar, filterByMagacioner);
        setListData(data || []);
    }, [activeTag, filterByPoslovodja, filterByTehnicar, filterByMagacioner]);

    // Sync activeTag when the prop changes from outside
    useEffect(() => {
        setActiveTag(initialTag);
    }, [initialTag]);

    // Single effect: fetch data and reset UI state whenever the active tag changes
    useEffect(() => {
        reloadData();
        setActiveFilters({});
        setSearchQuery("");
        setEndpointOptionsCache({});
        if (onSuccess) onSuccess(reloadData);
    }, [activeTag, reloadData]);

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

    // Build the list of active filter chips for display
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

    // Filter list data — memoized to avoid recomputing on every render
    const filteredData = useMemo(() => {
        return listData.filter((item) => {
            if (!item.title?.toLowerCase().includes(searchQuery.toLowerCase())) return false;

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

            {/* Active filter chips — shown between header and divider */}
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
                {filteredData.map((data) => (
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
                ))}
            </div>

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

                            if (activeTag === "moji_dnevni_zadaci") {
                                const loggedInJmb = sessionStorage.getItem("jmb");
                                finalData.tehnicarJmb = loggedInJmb;
                                finalData.ulogovaniJmb = loggedInJmb;
                            }

                            try {
                                const apiTag =
                                    activeTag === "moji_dnevni_zadaci" ? "dnevni_zadaci" : activeTag;
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