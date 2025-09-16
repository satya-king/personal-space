import { DELETE_MAPPING, GET_AADHAR_OTP, GET_ALL_SERVICES, GET_MAPPED_SERVICES, GET_MASTER_ROLES, GET_MASTER_SERVICES, GET_SAMPLE_ONE, GET_UNMAPPED_SERVICES, LOGOUT, MAP_SERVICES, OTP_VALIDATION, PAYMENT_QR, SAVE_MASTER_ROLE, SAVE_NEW_SERVICE, UPDATE_MASTER_ROLE, UPDATE_NEW_SERVICE } from "./APIEndPoints";
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

    getServicesByRole(roleId) {
        return axiosInstance.get(GET_MAPPED_SERVICES(roleId));
    }

    getUnmappedServices(roleId) {
        return axiosInstance.get(GET_UNMAPPED_SERVICES(roleId));
    }

    mapServicesToRole(roleId, serviceIds) {
        return axiosInstance.post(MAP_SERVICES(roleId), { serviceIds });
    }

    deleteRoleServiceMapping(roleId, serviceId) {
        return axiosInstance.delete(DELETE_MAPPING(roleId, serviceId));
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