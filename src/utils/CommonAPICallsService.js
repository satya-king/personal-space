import { GET_AADHAR_OTP, GET_ALL_SERVICES, GET_MASTER_ROLES, GET_MASTER_SERVICES, GET_SAMPLE_ONE, LOGOUT, OTP_VALIDATION, PAYMENT_QR, SAVE_MASTER_ROLE, SAVE_NEW_SERVICE, UPDATE_MASTER_ROLE, UPDATE_NEW_SERVICE } from "./APIEndPoints";
import axiosInstance from "./axiosInstance";

class CommonAPICallsService {

    logout(refreshToken) {
        return axiosInstance.post(LOGOUT, {}, { params: { "refreshToken": refreshToken } });
    }

    getPaymentQR() {
        return axiosInstance.get(PAYMENT_QR);
    }


    getMasterRoles() {
        return axiosInstance.get(GET_MASTER_ROLES);
    }
    saveNewRole(data) {
        return axiosInstance.post(SAVE_MASTER_ROLE, data);
    }
    updateRole(roleId, data) {
        return axiosInstance.put(UPDATE_MASTER_ROLE, data, { params: { roleId: roleId } });
    }

    getAllServices() {
        return axiosInstance.get(GET_ALL_SERVICES);
    }
    createService(formData) {
        return axiosInstance.post(SAVE_NEW_SERVICE, formData);
    }
    updateService(serviceId, formData) {
        return axiosInstance.put(UPDATE_NEW_SERVICE + "/" + serviceId, formData);
    }
    getRoleServices() {
        return axiosInstance.get(GET_MASTER_SERVICES);
    }


    getAadharOtp(aadharNumber) {
        return axiosInstance.get(GET_AADHAR_OTP, { params: { aadharNo: aadharNumber } });
    }
    validateAadharOtp(params) {
        return axiosInstance.post(OTP_VALIDATION, params);
    }


    getSampleOne() {
        return axiosInstance.get(GET_SAMPLE_ONE);
    }

}

export default new CommonAPICallsService();