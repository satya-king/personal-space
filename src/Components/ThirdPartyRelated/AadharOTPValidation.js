import React, { useState } from "react";
import Swal from "sweetalert2";
import { showNotification } from "../../utils/CommonFunctions";
import { useFormik } from "formik";
import "./Aadhar.css";
import CommonAPICallsService from "../../utils/CommonAPICallsService";

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
            submitOtpDetails(formik, setAadharDetails, setAadharAuth);
        },
    });

    const getOtpData = async () => {
        if (formik.values.aadhar !== "" && formik.values.aadhar.length === 12) {
            CommonAPICallsService.getAadharOtp(formik.values.aadhar)
                .then((res) => {
                    if (res && res.data?.SCODE === "01") {
                        formik.setFieldValue("trnxNo", res.data?.SDESC);
                        Swal.fire({ text: "OTP Sent Successfully", icon: "success" });
                    } else {
                        showNotification("warning", "Failed to send OTP, please try again");
                    }
                }
                )
                .catch(() => {
                    showNotification("error", "Something went wrong. Try again later.");
                });
        } else {
            showNotification("warning", "Enter 12 digit Aadhaar number");
        }
    };

    const submitOtpDetails = (formik, setAadharDetails, setAadharAuth) => {
        if (formik.values.aadhar !== "" && formik.values.aadharOtp !== "") {
            const params = {
                uid: formik.values?.aadhar,
                otp: formik.values.aadharOtp,
                trn: formik.values?.trnxNo,
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
                    CommonAPICallsService.validateAadharOtp(params)
                        .then((res) => {
                            if (res && res.data?.SCODE === "01") {
                                showNotification("success", "Authenticated Successfully !");
                                setAadharAuth(true);

                                let gender = "TRANSGENDER";
                                if (res.data?.SDESC?.gender === "M") gender = "MALE";
                                else if (res.data?.SDESC?.gender === "F") gender = "FEMALE";

                                setAadharDetails(res.data?.SDESC);
                                localStorage.setItem("uid", res.data?.SDESC.uid);

                                formik.setFieldValue("fullname", res.data?.SDESC.name);
                                formik.setFieldValue(
                                    "dob",
                                    (res.data?.SDESC?.dob ?? "")
                                        .split("-")
                                        .reverse()
                                        .join("/")
                                );
                                formik.setFieldValue("gender", gender);
                                formik.setFieldValue("relation", res.data?.SDESC?.co);
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
                    <div className="aadhaar-display">
                        <div className="aadhaar-header">
                            <img
                                src="/Aadhaar_Logo.png"
                                alt="Aadhaar Logo"
                                className="aadhaar-logo"
                            />
                            <h3>भारत सरकार / Government of India</h3>
                        </div>

                        <div className="aadhaar-body">
                            <div className="aadhaar-left">
                                <img
                                    src={`data:image/jpeg;base64,${aadharDetails.pht}`}
                                    alt="Aadhaar Profile"
                                    className="aadhaar-photo"
                                />
                            </div>
                            <div className="aadhaar-right">
                                <p><strong>Name:</strong> {aadharDetails.name}</p>
                                <p><strong>DOB:</strong> {aadharDetails.dob}</p>
                                <p><strong>Gender:</strong> {formik.values.gender}</p>
                                <p><strong>Address:</strong> {aadharDetails.house}, {aadharDetails.street}, {aadharDetails.loc}, {aadharDetails.vtc}, {aadharDetails.dist}, {aadharDetails.state} - {aadharDetails.pc}</p>
                            </div>
                        </div>

                        <div className="aadhaar-footer">
                            <h2>{aadharDetails.uid.replace(/(.{4})/g, "$1 ")}</h2>
                            <p>आधार - आम आदमी का अधिकार</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Aadhar;
