import React, { useEffect, useState } from "react";
import DataTable from "../../utils/DataTable";
import CommonAPICallsService from "../../utils/CommonAPICallsService";

function RolesMaster() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRoles() {
            try {
                const res = await CommonAPICallsService.getMasterRoles();
                setRoles(res.data);
            } catch (err) {
                console.error("Error fetching roles:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchRoles();
    }, []);


    if (loading) return <div>Loading roles...</div>;

    const getRoleStyle = (roleId) => {
        const baseStyle = {
            display: "inline-block",
            padding: "4px 8px",
            borderRadius: "6px",
            transition: "all 0.2s ease-in-out",
            cursor: "pointer"
        };

        switch (roleId) {
            case 99:
                return { ...baseStyle, backgroundColor: "#ffe6e6", color: "red", fontWeight: "bold" };
            case 1:
                return { ...baseStyle, backgroundColor: "#e6ffe6", color: "green" };
            case 3:
                return { ...baseStyle, backgroundColor: "#fff8dc", color: "gold" };
            case 4:
                return { ...baseStyle, backgroundColor: "#fff0e0", color: "orange" };
            default:
                return { ...baseStyle, backgroundColor: "#f0f0f0", color: "#333" };
        }
    };

    const getRoleIcon = (roleId) => {
        switch (roleId) {
            case 99:
                return "👑";
            case 1:
                return "🛡️";
            case 3:
                return "⭐";
            case 4:
                return "⚡";
            default:
                return "👤";
        }
    };

    const columns = [
        {
            key: "roleId",
            label: "Role ID",
            render: (value) => (
                <span style={getRoleStyle(value)} className="role-badge">
                    {getRoleIcon(value)} {value}
                </span>
            )
        },
        {
            key: "roleName",
            label: "Role Name",
            render: (value, row) => (
                <span style={getRoleStyle(row.roleId)} className="role-badge">
                    {getRoleIcon(row.roleId)} {value}
                </span>
            )
        },
        {
            key: "isActive",
            label: "Active",
            render: (value) => (value ? "✅" : "❌"),
        },
    ];


    return <DataTable title="Roles Master" columns={columns} data={roles} />;
}

export default RolesMaster;
