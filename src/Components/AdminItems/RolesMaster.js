import React, { useEffect, useState } from "react";
import DataTable from "../../utils/DataTable";
import CommonAPICallsService from "../../utils/CommonAPICallsService";
import { getRoleIcon, getRoleStyle } from "../../utils/CommonFunctions";
import { Button, Modal, Form } from "react-bootstrap";

function RolesMaster() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({
        roleId: "",
        roleName: "",
        isActive: true,
        displayOrder: "",
    });

    // fetch roles
    useEffect(() => {
        fetchRoles();
    }, []);

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

    // open modal for add
    // open modal for add
    const handleAdd = () => {
        const maxDisplayOrder = roles.length > 0
            ? Math.max(...roles.map(r => r.displayOrder || 0))
            : 0;

        setFormData({
            roleName: "",
            isActive: true,
            displayOrder: maxDisplayOrder + 1, // only based on displayOrder
        });
        setIsEdit(false);
        setShowModal(true);
    };


    // open modal for edit
    const handleEdit = (role) => {
        setFormData({ ...role });
        setIsEdit(true);
        setShowModal(true);
    };

    // save role
    const handleSave = async () => {
        try {
            if (isEdit) {
                await CommonAPICallsService.updateRole(formData.roleId, formData);
            } else {
                const { roleId, ...payload } = formData;
                await CommonAPICallsService.saveNewRole(payload);
            }
            await fetchRoles();
            setShowModal(false);
        } catch (err) {
            console.error("Error saving role:", err);
        }
    };

    if (loading) return <div>Loading roles...</div>;

    const columns = [
        {
            key: "displayOrder",
            label: "Sl.No",
            width: "5%",
            render: (value) => value,
        },
        {
            key: "roleId",
            label: "Role ID",
            width: "10%",
            render: (value) => (
                <span style={getRoleStyle(value)} className="role-badge">
                    {getRoleIcon(value)} {value}
                </span>
            ),
        },
        {
            key: "roleName",
            label: "Role Name",
            width: "40%",
            render: (value, row) => (
                <span style={getRoleStyle(row.roleId)} className="role-badge">
                    {getRoleIcon(row.roleId)} {value}
                </span>
            ),
        },
        {
            key: "isActive",
            label: "Active",
            width: "8%",
            render: (value) => (value ? "✅" : "❌"),
        },
        {
            key: "actions",
            label: "Actions",
            width: "10%",
            render: (_, row) => (
                <Button size="sm" variant="warning" onClick={() => handleEdit(row)}>
                    Edit
                </Button>
            ),
        },
    ];


    return (
        <div className="roles-master-container p-3">
            {/* Header with Add button */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Roles Master</h4>
                <Button variant="primary" onClick={handleAdd}>Add Role</Button>
            </div>

            {/* Data Table */}
            <DataTable title="" columns={columns} data={roles} />

            {/* Modal */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? "Edit Role" : "Add Role"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {isEdit && (
                            <Form.Group className="mb-3">
                                <Form.Label>Role ID</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formData.roleId}
                                    disabled
                                />
                            </Form.Group>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Role Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.roleName}
                                onChange={(e) =>
                                    setFormData({ ...formData, roleName: e.target.value })
                                }
                                placeholder="Enter Role Name"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Display Order</Form.Label>
                            <Form.Control
                                type="number"
                                disabled={true}
                                value={formData.displayOrder}
                                onChange={(e) =>
                                    setFormData({ ...formData, displayOrder: Number(e.target.value) })
                                }
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Check
                                type="checkbox"
                                label="Active"
                                checked={formData.isActive}
                                onChange={(e) =>
                                    setFormData({ ...formData, isActive: e.target.checked })
                                }
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleSave}>
                        {isEdit ? "Update Role" : "Save Role"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default RolesMaster;
