import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import "./DataTable.css";

function DataTable({ title, columns, data }) {
    const [expanded, setExpanded] = useState(true);
    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
        let sortable = [...data];
        if (sortConfig.key) {
            sortable.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];
                if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
                if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }
        return sortable;
    }, [data, sortConfig]);

    const filteredData = useMemo(() => {
        if (!search) return sortedData;
        return sortedData.filter((row) =>
            Object.values(row)
                .join(" ")
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [sortedData, search]);

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
        XLSX.writeFile(workbook, `${title || "TableData"}.xlsx`);
    };

    const handleMouseDown = (e, th) => {
        const startX = e.clientX;
        const startWidth = th.offsetWidth;

        const handleMouseMove = (e) => {
            const newWidth = startWidth + (e.clientX - startX);
            th.style.width = `${newWidth}px`;
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <div className="table-container">
            <div className="table-header">
                <h2>{title}</h2>
                <div className="table-actions">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button onClick={() => setExpanded(!expanded)}>
                        {expanded ? "Collapse" : "Expand"}
                    </button>
                    <button onClick={exportToExcel}>Export Excel</button>
                </div>
            </div>

            {expanded && (
                <div className="table-wrapper">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        onClick={() => handleSort(col.key)}
                                        style={{
                                            borderLeft: "1px solid #4800ffff",
                                            width: col.width || "auto", // 👈 apply dynamic width
                                        }}
                                    >
                                        <div className="th-content">
                                            {col.label}
                                            {sortConfig.key === col.key &&
                                                (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
                                            <span
                                                className="resize-handle"
                                                style={{ borderLeft: "5px solid #ab9f9fff" }}
                                                onMouseDown={(e) =>
                                                    handleMouseDown(e, e.target.parentElement.parentElement)
                                                }
                                            />
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((row, i) => (
                                    <tr key={i}>
                                        {columns.map((col) => (
                                            <td
                                                key={col.key}
                                                style={{ width: col.width || "auto" }} // 👈 also apply to td
                                            >
                                                {col.render ? col.render(row[col.key], row) : row[col.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="no-data">
                                        No data found
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            )}
        </div>
    );
}

export default DataTable;
