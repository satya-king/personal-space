import React, { useEffect, useState } from "react";
import DataTable from "../../utils/DataTable";
import "../../utils/table.css";
import CommonAPICallsService from "../../utils/CommonAPICallsService";

function RolesMaster() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const response = CommonAPICallsService.getMasterRoles();
        response
            .then((res) => {
                setRoles(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching roles:", err);
                setLoading(false);
            });
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
