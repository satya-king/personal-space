import React from "react";

const FakeDashboard = React.lazy(() => import("../InitialComponents/FakeDashboard"));
const ToDoList = React.lazy(() => import("../Components/ToDoList"));
const PaymentPage = React.lazy(() => import("../Components/Payments/PaymentPage"));
const PaymentByScanning = React.lazy(() => import("../Components/Payments/PaymentByScanning"));
const SampleComponent = React.lazy(() => import("../Components/SampleComponent"));
const AadharOTPValidation = React.lazy(() => import("../Components/ThirdPartyRelated/AadharOTPValidation"));
const RolesMaster = React.lazy(() => import("../Components/AdminItems/RolesMaster"));
const ServiceMaster = React.lazy(() => import("../Components/AdminItems/ServiceMaster"));
const RoleServiceMapping = React.lazy(() => import("../Components/AdminItems/RoleServiceMapping"));
const SampleWebFlux = React.lazy(() => import("../Components/SampleWebFlux"));

const routes = [
    {
        path: "/home",
        element: <FakeDashboard />,
        private: true,
    },
    {
        path: "/toDoList",
        element: <ToDoList />,
        private: true,
    },
    {
        path: "/PaymentPage",
        element: <PaymentPage />,
        private: true,
    },
    {
        path: "/PaymentByScanning",
        element: <PaymentByScanning />,
        private: true,
    },
    {
        path: "/rateLimiterSample",
        element: <SampleComponent />,
        private: true,
    },
    {
        path: "/AadharOTPValidation",
        element: <AadharOTPValidation />,
        private: true,
    },
    {
        path: "/RolesMaster",
        element: <RolesMaster />,
        private: true,
        role: "ADMIN", // optional role restriction
    },
    {
        path: "/ServiceMaster",
        element: <ServiceMaster />,
        private: true,
        role: "ADMIN", // optional role restriction
    },
    {
        path: "/RoleServiceMapping",
        element: <RoleServiceMapping />,
        private: true,
        role: "ADMIN", // optional role restriction
    },
    {
        path: "/SampleWebFlux",
        element: <SampleWebFlux />,
        private: true,
    },
];

export default routes;
