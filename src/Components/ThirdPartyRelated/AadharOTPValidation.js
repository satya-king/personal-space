import React, { useState } from "react";
import Swal from "sweetalert2";
import { showNotification } from "../../utils/CommonFunctions";
import { GET_AADHAR_OTP, OTP_VALIDATION } from "../../APIURLs/Urls";
import axiosInstance from "../../utils/axiosInstance";
import { useFormik } from "formik";
import "./Aadhar.css"; // ✅ custom CSS

function Aadhar() {
    const [aadharAuth, setAadharAuth] = useState(false);
    const [aadharDetails, setAadharDetails] = useState(null);

    const formik = useFormik({
        initialValues: {
            aadhar: "",
            aadharOtp: "",
            trnxNo: "",
            fullname: "",
            dob: "",
            gender: "",
            relation: "",
        },
        onSubmit: () => {
            submitOtptDetails(formik, setAadharDetails, setAadharAuth);
        },
    });

    const getOtpData = () => {
        if (formik.values.aadhar !== "" && formik.values.aadhar.length === 12) {
            axiosInstance
                .get(`${GET_AADHAR_OTP}${formik.values.aadhar}`)
                .then((res) => {
                    if (res && res.data?.SCODE === "01") {
                        formik.setFieldValue("trnxNo", res.data?.SDESC);
                        Swal.fire({
                            text: "OTP Sent Successfully",
                            icon: "success",
                        });
                    } else {
                        showNotification("warning", "Failed to send OTP, please try again");
                    }
                })
                .catch(() => {
                    showNotification("error", "Something went wrong. Try again later.");
                });
        } else {
            showNotification("warning", "Enter 12 digit Aadhaar number");
        }
    };

    const submitOtptDetails = (formik, setAadharDetails, setAadharAuth) => {
        if (formik.values.aadhar !== "" && formik.values.aadharOtp !== "") {
            const params = {
                aadharno: formik.values?.aadhar,
                otp: formik.values.aadharOtp,
                txnNo: formik.values?.trnxNo,
            };

            Swal.fire({
                text: "Are you sure want to Submit ?",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
            }).then((result) => {
                if (result.isConfirmed === true) {
                    axiosInstance
                        .post(OTP_VALIDATION, params)
                        .then((res) => {
                            if (res && res.data?.SCODE === "01") {
                                showNotification("success", "Authenticated Successfully !",).ten(
                                    function () {
                                        setAadharAuth(true);

                                        let gender = "TRANSGENDER";
                                        if (res.data?.SDESC?.gender === "M") {
                                            gender = "MALE";
                                        } else if (res.data?.SDESC?.gender === "F") {
                                            gender = "FEMALE";
                                        }

                                        setAadharDetails(res.data?.SDESC);
                                        localStorage.setItem("uid", res.data?.SDESC.uid);

                                        formik.setFieldValue("fullname", res.data?.SDESC.name);
                                        formik.setFieldValue(
                                            "dob",
                                            ((res.data?.SDESC?.dob) ?? "")
                                                .split("-")
                                                .reverse()
                                                .join("/")
                                        );
                                        formik.setFieldValue("gender", gender);
                                        formik.setFieldValue("relation", res.data?.SDESC?.co);
                                    }
                                );
                            } else if (res.data?.SCODE === "02") {
                                showNotification("error", "Invalid OTP, Please try again.");
                                setAadharAuth(false);
                            } else {
                                showNotification("warning", "Something went wrong, Please try again later.");
                            }
                        })
                        .catch(() => {
                            showNotification("error", "Network error while validating OTP");
                        });
                }
            });
        } else {
            showNotification("warning", "Enter Aadhaar number and OTP");
        }
    };

    return (
        <div className="aadhar-container">
            <div className="aadhar-card">
                <h2 className="title">Aadhaar OTP Validation</h2>

                <form onSubmit={formik.handleSubmit} className="aadhar-form">
                    <div className="form-group">
                        <label>Aadhaar Number</label>
                        <input
                            type="text"
                            name="aadhar"
                            maxLength="12"
                            placeholder="Enter 12-digit Aadhaar"
                            value={formik.values.aadhar}
                            onChange={formik.handleChange}
                        />
                        <button type="button" className="btn secondary" onClick={getOtpData}>
                            Get OTP
                        </button>
                    </div>

                    <div className="form-group">
                        <label>Enter OTP</label>
                        <input
                            type="text"
                            name="aadharOtp"
                            maxLength="6"
                            placeholder="Enter 6-digit OTP"
                            value={formik.values.aadharOtp}
                            onChange={formik.handleChange}
                        />
                        <button type="submit" className="btn primary">
                            Validate OTP
                        </button>
                    </div>
                </form>

                {aadharAuth && aadharDetails && (
                    <div className="aadhar-details">
                        <h3>Aadhaar Details</h3>
                        <p><strong>Name:</strong> {formik.values.fullname}</p>
                        <p><strong>DOB:</strong> {formik.values.dob}</p>
                        <p><strong>Gender:</strong> {formik.values.gender}</p>
                        <p><strong>Relation:</strong> {formik.values.relation}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Aadhar;
