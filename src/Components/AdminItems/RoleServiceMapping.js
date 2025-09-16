import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import CommonAPICallsService from "../../utils/CommonAPICallsService";

function RoleServiceMapping() {
    const [roles, setRoles] = useState([]);
    const [services, setServices] = useState([]);
    const [mappedServices, setMappedServices] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [availableServices, setAvailableServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);

    // fetch all roles on load
    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const res = await CommonAPICallsService.getMasterRoles();
            setRoles(res.data || []);
        } catch (err) {
            console.error("Error fetching roles:", err);
        }
    };

    const fetchMappedServices = async (roleId) => {
        try {
            const res = await CommonAPICallsService.getServicesByRole(roleId);
            setMappedServices(res.data || []);
        } catch (err) {
            console.error("Error fetching mapped services:", err);
        }
    };

    const handleRoleChange = (e) => {
        const roleId = e.target.value;
        setSelectedRole(roleId);
        if (roleId) {
            fetchMappedServices(roleId);
        } else {
            setMappedServices([]);
        }
    };

    const openMapServiceModal = async () => {
        try {
            const res = await CommonAPICallsService.getUnmappedServices(selectedRole);
            setAvailableServices(res.data || []);
            setSelectedServices([]);
            setShowModal(true);
        } catch (err) {
            console.error("Error fetching unmapped services:", err);
        }
    };

    const handleSaveMapping = async () => {
        try {
            await CommonAPICallsService.mapServicesToRole(selectedRole, selectedServices);
            await fetchMappedServices(selectedRole);
            setShowModal(false);
        } catch (err) {
            console.error("Error mapping services:", err);
        }
    };

    const handleDeleteMapping = async (serviceId) => {
        try {
            await CommonAPICallsService.deleteRoleServiceMapping(selectedRole, serviceId);
            await fetchMappedServices(selectedRole);
        } catch (err) {
            console.error("Error deleting mapping:", err);
        }
    };

    const toggleServiceSelection = (serviceId) => {
        setSelectedServices((prev) =>
            prev.includes(serviceId)
                ? prev.filter((id) => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    return (
        <div className="p-3">
            <h4>Role Service Mapping</h4>

            {/* Role Selection */}
            <Form.Group className="mb-3">
                <Form.Label>Select Role</Form.Label>
                <Form.Select value={selectedRole} onChange={handleRoleChange}>
                    <option value="">-- Select Role --</option>
                    {roles.map((role) => (
                        <option key={role.roleId} value={role.roleId}>
                            {role.roleName}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            {/* Assigned Services Table */}
            {selectedRole && (
                <div className="mt-3">
                    <h5>Assigned Services</h5>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Service ID</th>
                                <th>Service Name</th>
                                <th>Type</th>
                                <th>URL</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mappedServices.length > 0 ? (
                                mappedServices.map((svc) => (
                                    <tr key={svc.serviceId}>
                                        <td>{svc.serviceId}</td>
                                        <td>{svc.serviceName}</td>
                                        <td>{svc.serviceType === "M" ? "Menu" : "Tile"}</td>
                                        <td>{svc.serviceUrl}</td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => handleDeleteMapping(svc.serviceId)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        No services mapped
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Map Service Button */}
                    <Button variant="primary" onClick={openMapServiceModal}>
                        Map Service
                    </Button>
                </div>
            )}

            {/* Modal for mapping services */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Map Services to Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {availableServices.length > 0 ? (
                            availableServices.map((svc) => (
                                <Form.Check
                                    key={svc.serviceId}
                                    type="checkbox"
                                    label={`${svc.serviceName} (${svc.serviceType === "M" ? "Menu" : "Tile"})`}
                                    checked={selectedServices.includes(svc.serviceId)}
                                    onChange={() => toggleServiceSelection(svc.serviceId)}
                                />
                            ))
                        ) : (
                            <p>No available services to map</p>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleSaveMapping} disabled={selectedServices.length === 0}>
                        Save Mapping
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default RoleServiceMapping;
