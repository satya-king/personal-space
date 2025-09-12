import { GET_AADHAR_OTP, GET_MASTER_ROLES, LOGOUT, OTP_VALIDATION, PAYMENT_QR, SAVE_MASTER_ROLE, UPDATE_MASTER_ROLE } from "./APIEndPoints";
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


    getAadharOtp(aadharNumber) {
        return axiosInstance.get(GET_AADHAR_OTP, { params: { aadharNo: aadharNumber } });
    }
    validateAadharOtp(params) {
        return axiosInstance.post(OTP_VALIDATION, params);
    }
}

export default new CommonAPICallsService();