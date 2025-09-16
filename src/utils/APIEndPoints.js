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

export const GET_MASTER_SERVICES = API_URL + "/admin/get-enabled-services";



export const PAYMENT_QR = API_URL + "/api/payment/qr";

// AADHAR 
export const GET_AADHAR_OTP = API_URL + "/aadhar/aadharotp";
export const OTP_VALIDATION = API_URL + "/aadhar/getAadharDetails";

