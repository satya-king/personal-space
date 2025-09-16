import { API_URL } from "../APIURLs/Urls";

export const LOGOUT = API_URL + "/logout";

//ADMIN calls
export const GET_SAMPLE_ONE = API_URL + "/admin/authCheck";
// Roles
export const GET_MASTER_ROLES = API_URL + "/admin/get-master-roles";
export const SAVE_MASTER_ROLE = API_URL + "/admin/save-master-role";
export const UPDATE_MASTER_ROLE = API_URL + "/admin/update-master-role";
// Services
export const GET_ALL_SERVICES = API_URL + "/admin/get-all-services";
export const SAVE_NEW_SERVICE = API_URL + "/admin/save-new-service";
export const UPDATE_NEW_SERVICE = API_URL + "/admin/update-service";

// export const GET_MAPPED_SERVICES = API_URL + "/admin/get-services-by-role";
// export const GET_UNMAPPED_SERVICES = API_URL + "/admin/get-unmapped-services";
// export const MAP_SERVICES = API_URL + "/admin/map-role-services";
// export const DELETE_MAPPING = API_URL + "/admin/delete-role-service";

// Role ↔ Service mapping
export const GET_MAPPED_SERVICES = (roleId) => `${API_URL}/admin/${roleId}/services`;
export const GET_UNMAPPED_SERVICES = (roleId) => `${API_URL}/admin/${roleId}/unmapped-services`;
export const MAP_SERVICES = (roleId) => `${API_URL}/admin/${roleId}/map`;
export const DELETE_MAPPING = (roleId, serviceId) => `${API_URL}/admin/${roleId}/services/${serviceId}`;


export const GET_MASTER_SERVICES = API_URL + "/admin/get-enabled-services";



export const PAYMENT_QR = API_URL + "/api/payment/qr";

// AADHAR 
export const GET_AADHAR_OTP = API_URL + "/aadhar/aadharotp";
export const OTP_VALIDATION = API_URL + "/aadhar/getAadharDetails";

