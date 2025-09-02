import { LOGOUT, PAYMENT_QR } from "./APIEndPoints";
import axiosInstance from "./axiosInstance";

class CommonAPICallsService {

    logout(refreshToken) {
        return axiosInstance.post(LOGOUT, {}, { params: { "refreshToken": refreshToken } });
    }

    getPaymentQR() {
        return axiosInstance.get(PAYMENT_QR);
    }
}

export default new CommonAPICallsService();