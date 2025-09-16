import React, { useEffect, useState } from "react";
import DataTable from "../../utils/DataTable";
import CommonAPICallsService from "../../utils/CommonAPICallsService";
import { Button, Modal, Form } from "react-bootstrap";

function ServiceMaster() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({
        serviceId: "",
        parentId: 0,
        serviceName: "",
        serviceType: "M",
        serviceUrl: "#",
        isActive: true,
        displayOrder: 1,
    });

    // Fetch all services
    useEffect(() => {
        fetchServices();
    }, []);

    async function fetchServices() {
        try {
            const res = await CommonAPICallsService.getAllServices();
            setServices(res.data);
        } catch (err) {
            console.error("Error fetching services:", err);
        } finally {
            setLoading(false);
        }
    }

    // open modal for add
    const handleAdd = () => {
        const maxDisplayOrder =
            services.length > 0
                ? Math.max(...services.map((s) => s.displayOrder || 0))
                : 0;

        setFormData({
            parentId: 0,
            serviceName: "",
            serviceType: "M",
            serviceUrl: "#",
            isActive: true,
            displayOrder: maxDisplayOrder + 1,
        });
        setIsEdit(false);
        setShowModal(true);
    };

    // open modal for edit
    const handleEdit = (service) => {
        setFormData({ ...service });
        setIsEdit(true);
        setShowModal(true);
    };

    // save service
    const handleSave = async () => {
        try {
            if (formData.serviceType === "M") {
                formData.serviceUrl = "#"; // enforce rule for Menu
            }

            if (isEdit) {
                await CommonAPICallsService.updateService(formData.serviceId, formData);
            } else {
                const { serviceId, ...payload } = formData;
                await CommonAPICallsService.createService(payload);
            }
            await fetchServices();
            setShowModal(false);
        } catch (err) {
            console.error("Error saving service:", err);
        }
    };

    if (loading) return <div>Loading services...</div>;

    // only parent menus (parentId = 0)
    const parentOptions = services.filter((s) => s.parentId === 0);

    // Build lookup map (serviceId -> serviceName)
    const serviceNameMap = services.reduce((acc, svc) => {
        acc[svc.serviceId] = svc.serviceName;
        return acc;
    }, {});

    const columns = [
        { key: "displayOrder", label: "Sl.No", width: "5%" },
        { key: "serviceId", label: "Service ID", width: "8%" },
        {
            key: "parentId",
            label: "Parent",
            width: "15%",
            render: (value) => {
                if (value === 0) {
                    return <strong style={{ color: 'green' }}>— Root —</strong>;
                }
                return serviceNameMap[value] || value;
            },
        },
        {
            key: "serviceName",
            label: "Service Name",
            width: "25%",
            render: (value, row) => (
                <span style={{ fontWeight: row.serviceType === "M" ? "bold" : "normal" }}>
                    {value}
                </span>
            ),
        },
        {
            key: "serviceType",
            label: "Type",
            width: "8%",
            render: (val) => (val === "M" ? "Menu" : "Tile"),
        },
        {
            key: "serviceUrl",
            label: "URL",
            width: "20%",
            render: (value) => (
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                >
                    {value}
                </a>
            ),
        },
        {
            key: "isActive",
            label: "Active",
            width: "8%",
            render: (val) => (val ? "✅" : "❌"),
        },
        {
            key: "actions",
            label: "Actions",
            width: "12%",
            render: (_, row) => (
                <Button size="sm" variant="warning" onClick={() => handleEdit(row)}>
                    Edit
                </Button>
            ),
        },
    ];




    return (
        <div className="service-master-container p-3">
            {/* Header with Add button */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Service Master</h4>
                <Button variant="primary" onClick={handleAdd}>
                    Add Service
                </Button>
            </div>

            {/* Data Table */}
            <DataTable title="" columns={columns} data={services} />

            {/* Modal */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? "Edit Service" : "Add Service"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {isEdit && (
                            <Form.Group className="mb-3">
                                <Form.Label>Service ID</Form.Label>
                                <Form.Control type="number" value={formData.serviceId} disabled />
                            </Form.Group>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Service Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.serviceName}
                                onChange={(e) =>
                                    setFormData({ ...formData, serviceName: e.target.value })
                                }
                                placeholder="Enter Service Name"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Parent</Form.Label>
                            <Form.Select
                                value={formData.parentId}
                                onChange={(e) =>
                                    setFormData({ ...formData, parentId: Number(e.target.value) })
                                }
                            >
                                <option value={0}>Root (No Parent)</option>
                                {parentOptions.map((p) => (
                                    <option key={p.serviceId} value={p.serviceId}>
                                        {p.serviceName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Service Type</Form.Label>
                            <Form.Select
                                value={formData.serviceType}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                        ...formData,
                                        serviceType: value,
                                        serviceUrl: value === "M" ? "#" : "",
                                    });
                                }}
                            >
                                <option value="M">Menu</option>
                                <option value="T">Tile</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Service URL</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.serviceUrl}
                                onChange={(e) =>
                                    setFormData({ ...formData, serviceUrl: e.target.value })
                                }
                                disabled={formData.serviceType === "M"}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Display Order</Form.Label>
                            <Form.Control type="number" disabled value={formData.displayOrder} />
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
                        {isEdit ? "Update Service" : "Save Service"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ServiceMaster;
