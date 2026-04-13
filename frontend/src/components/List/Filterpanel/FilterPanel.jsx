import { useState, useEffect, useRef } from "react";
import "./FilterPanel.css";
import {getJmb, getRole} from "../../../auth/auth.js";
import {getOptionFilterContext, optionFilter} from "../../../utils/dataHelpers.js";

export function FilterPanel({ filters, activeFilters, activeTag, onFilterChange, onClear, onOptionsLoaded, fetchOptions }) {
    const [isOpen, setIsOpen] = useState(false);
    const [endpointOptions, setEndpointOptions] = useState({});
    const [loadingKeys, setLoadingKeys] = useState({});
    const panelRef = useRef(null);
    const fetchedRef = useRef({});

    const activeCount = filters.reduce((count, filter) => {
        if (filter.property === "tag_override") {
            const defaultValue = filter.options?.[0]?.value ?? "";
            return activeTag !== defaultValue ? count + 1 : count;
        }
        const val = activeFilters[filter.property];
        return val && val !== "" ? count + 1 : count;
    }, 0);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        filters.forEach((filter) => {
            if (filter.endpoint && !fetchedRef.current[filter.property]) {
                fetchedRef.current[filter.property] = true;
                fetchEndpointOptions(filter);
            }
        });
    }, [isOpen]);

    const fetchEndpointOptions = async (filter) => {
        setLoadingKeys((prev) => ({ ...prev, [filter.property]: true }));
        try {
            let data;
            if (fetchOptions) {
                data = await fetchOptions(filter.endpoint);
            } else {
                const response = await fetch(filter.endpoint);
                data = await response.json();
            }

            const context = await getOptionFilterContext(activeTag, filter.property);

            const separator = filter.labelSeparator ?? " ";
            const seen = new Set();
            const options = (Array.isArray(data) ? data : [])
                .filter( (item) => {
                    return optionFilter(item, activeTag, filter.property, context);
                })
                .map((item) => ({
                    value: String(item[filter.valueKey]),
                    label: Array.isArray(filter.labelKeys)
                        ? filter.labelKeys.map((k) => item[k]).filter(Boolean).join(separator)
                        : item[filter.labelKey],
                }))
                .filter(({ value }) => {
                    if (seen.has(value)) return false;
                    seen.add(value);
                    return true;
                });
            setEndpointOptions((prev) => ({ ...prev, [filter.property]: options }));
            onOptionsLoaded?.(filter.property, options);
        } catch (error) {
            console.error(`Failed to fetch filter options for "${filter.property}":`, error);
            fetchedRef.current[filter.property] = false;
        } finally {
            setLoadingKeys((prev) => ({ ...prev, [filter.property]: false }));
        }
    };

    const getSelectValue = (filter) => {
        if (filter.property === "tag_override") return activeTag ?? filter.options?.[0]?.value ?? "";
        return activeFilters[filter.property] || "";
    };

    const handleChange = (filter, value) => {
        if (filter.property === "tag_override") {
            onFilterChange("tag_override", value);
        } else {
            onFilterChange(filter.property, value);
        }
    };

    const handleClear = () => {
        onClear();
        setIsOpen(false);
    };

    return (
        <div className="filter-panel-wrapper" ref={panelRef}>
            <button
                className={`filter-toggle-btn ${activeCount > 0 ? "has-filters" : ""}`}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <FilterIcon />
                Filteri
                {activeCount > 0 && (
                    <span className="filter-badge">{activeCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="filter-dropdown">
                    {filters.map((filter, index) => {
                        const isLoading = filter.endpoint && loadingKeys[filter.property];
                        const options = filter.endpoint
                            ? endpointOptions[filter.property] || []
                            : filter.options || [];

                        return (
                            <div key={index} className="filter-row">
                                <label className="filter-row-label">{filter.label}</label>
                                <div className="filter-row-control">
                                    <select
                                        className="filter-row-select"
                                        value={getSelectValue(filter)}
                                        onChange={(e) => handleChange(filter, e.target.value)}
                                        disabled={!!isLoading}
                                    >
                                        {isLoading ? (
                                            <option>Učitava se...</option>
                                        ) : (
                                            <>
                                                {filter.endpoint && (
                                                    <option value="">
                                                        {filter.allLabel || "Svi"}
                                                    </option>
                                                )}
                                                {options.map((opt, i) => (
                                                    <option key={i} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </>
                                        )}
                                    </select>
                                </div>
                            </div>
                        );
                    })}

                    <div className="filter-panel-footer">
                        <span className="filter-active-label">
                            {activeCount === 0
                                ? "Nema aktivnih filtera"
                                : `${activeCount} aktiv${activeCount > 1 ? "na" : "an"} filter${activeCount > 1 ? "a" : ""}`}
                        </span>
                        {activeCount > 0 &&
                        <button className="filter-clear-btn" onClick={handleClear}>
                            Obriši sve
                        </button>
                        }
                    </div>
                </div>
            )}
        </div>
    );
}

function FilterIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        >
            <line x1="2" y1="4" x2="14" y2="4" />
            <line x1="4" y1="8" x2="12" y2="8" />
            <line x1="6" y1="12" x2="10" y2="12" />
        </svg>
    );
}