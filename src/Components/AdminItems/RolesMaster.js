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

    const columns = [
        { key: "roleId", label: "Role ID" },
        { key: "roleName", label: "Role Name" },
        {
            key: "isActive",
            label: "Active",
            render: (value) => (value ? "✅" : "❌"),
        },
    ];

    return <DataTable title="Roles Master" columns={columns} data={roles} />;
}

export default RolesMaster;
