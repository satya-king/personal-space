import React, { useState } from "react";
import QRCode from "react-qr-code";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./payment.css";
import { API_URL } from "../../APIURLs/Urls";
import axiosInstance from "../../utils/axiosInstance";


function PaymentPage() {
    const [paymentLink, setPaymentLink] = useState(null);
    const [loading, setLoading] = useState(false);

    // read status from query params (after redirect)
    const query = new URLSearchParams(useLocation().search);
    const status = query.get("status");
    const paymentId = query.get("paymentId");

    const handlePayNow = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.post(
                `${API_URL}/razorpay/create-payment-link?amount=100&description=TestPayment&name=Satya&email=test@example.com&contact=9876543210`
            );
            setPaymentLink(response.data);
        } catch (err) {
            console.error("Error generating payment link", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-container">
            <div className="payment-card">
                <h1 className="payment-title">UPI Payment</h1>

                {!status && (
                    <>
                        <button
                            onClick={handlePayNow}
                            disabled={loading}
                            className={`pay-button ${loading ? "disabled" : ""}`}
                        >
                            {loading ? "Processing..." : "Generate Payment Link"}
                        </button>

                        {paymentLink && (
                            <div className="qr-section">
                                <h2 className="qr-title">Scan QR or Click to Pay</h2>
                                <div className="qr-box">
                                    <QRCode value={paymentLink} size={180} />
                                </div>
                                <a
                                    href={paymentLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="pay-button"
                                >
                                    Open Payment Page
                                </a>
                            </div>
                        )}
                    </>
                )}

                {status && (
                    <div
                        className={`payment-status ${status === "paid" ? "success" : "failed"}`}
                    >
                        Payment {status.toUpperCase()} <br />
                        Payment ID: {paymentId}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PaymentPage;
