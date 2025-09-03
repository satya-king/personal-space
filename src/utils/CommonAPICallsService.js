import { GET_MASTER_ROLES, LOGOUT, PAYMENT_QR } from "./APIEndPoints";
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
}

export default new CommonAPICallsService();