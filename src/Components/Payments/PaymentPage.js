import React, { useState } from "react";
import QRCode from "react-qr-code";
import axios from "axios";
import { API_URL } from "../../APIURLs/Urls";
import "./payment.css";

function PaymentPage() {
    const [paymentLink, setPaymentLink] = useState(null);
    const [paymentLinkId, setPaymentLinkId] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePayNow = async () => {
        try {
            setLoading(true);
            setPaymentStatus("");

            const response = await axios.post(`${API_URL}/razorpay/create-payment-link`, {
                amount: 500, // fixed amount
                description: "Payment for Order #123",
                name: "Satya",
                email: "satya@gmail.com",
                contact: "9876543210"
            });

            if (response.data.error) {
                setPaymentStatus("FAILED TO CREATE LINK");
                return;
            }

            setPaymentLink(response.data.shortUrl);
            setPaymentLinkId(response.data.paymentLinkId);

            // start polling payment status
            pollPaymentStatus(response.data.paymentLinkId);

        } catch (error) {
            setPaymentStatus("FAILED");
            console.error("Error creating payment link:", error);
        } finally {
            setLoading(false);
        }
    };

    const pollPaymentStatus = (paymentLinkId) => {
        const interval = setInterval(async () => {
            try {
                const response = await axios.get(`${API_URL}/razorpay/status/${paymentLinkId}`);
                setPaymentStatus(response.data.status);

                if (response.data.status === "paid" || response.data.status === "expired") {
                    clearInterval(interval);
                }
            } catch (error) {
                console.error("Error fetching status:", error);
            }
        }, 5000);
    };

    return (
        <div className="payment-container">
            <div className="payment-card">
                <h1 className="payment-title">UPI Payment</h1>

                <button onClick={handlePayNow} disabled={loading} className="pay-button">
                    {loading ? "Creating Link..." : "Generate Payment Link"}
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

                {paymentStatus && (
                    <div
                        className={`payment-status ${paymentStatus === "paid" ? "success" : "failed"
                            }`}
                    >
                        Payment Status: {paymentStatus.toUpperCase()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PaymentPage;
