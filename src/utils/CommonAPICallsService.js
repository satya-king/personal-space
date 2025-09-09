import { GET_MASTER_ROLES, LOGOUT, PAYMENT_QR, SAVE_MASTER_ROLE, UPDATE_MASTER_ROLE } from "./APIEndPoints";
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
}

export default new CommonAPICallsService();