import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import axios from "axios";
import { API_URL } from "../../APIURLs/Urls";
import "./payment.css";

function PaymentByScanning() {
  const [upiId, setUpiId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [upiData, setUpiData] = useState(null); // backend-provided QR details

  // 🔹 Fetch static QR from backend on page load
  useEffect(() => {
    const fetchUPI = async () => {
      try {
        const response = await axios.get(API_URL + "/api/payment/qr");
        setUpiData(response.data);
      } catch (error) {
        console.error("Error fetching UPI QR:", error);
      }
    };
    fetchUPI();
  }, []);

  const handlePayRequest = async () => {
    if (!upiId) {
      alert("Please enter your UPI ID to request payment.");
      return;
    }
    try {
      setLoading(true);
      setPaymentStatus("");

      // 🔹 Send collect request
      const response = await axios.post(API_URL + "/api/payment/request", {
        upiId, // payer UPI ID
        amount: upiData.amount,
        receiver: upiData.receiver,
      });

      checkPaymentStatus(response.data.transactionId);
    } catch (error) {
      setPaymentStatus("FAILED");
      console.error("Error requesting payment:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = (transactionId) => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(
          API_URL + `/api/payment/status/${transactionId}`
        );
        setPaymentStatus(response.data.status);

        if (
          response.data.status === "SUCCESS" ||
          response.data.status === "FAILED"
        ) {
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    }, 5000);
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h1 className="payment-title">UPI Payment</h1>

        {/* QR Section */}
        {upiData && (
          <div className="qr-section">
            <h2 className="qr-title">Scan this QR Code to Pay</h2>
            <div className="qr-box">
              <QRCode value={upiData.upiString} size={180} />
            </div>
            <p className="note">
              Pay ₹{upiData.amount} to {upiData.receiverName}
            </p>
          </div>
        )}

        {/* Optional UPI ID input
        <label className="payment-label">Enter your UPI ID:</label>
        <input
          type="text"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          placeholder="example@upi"
          className="payment-input"
        /> */}

        {/* <button
          onClick={handlePayRequest}
          disabled={loading}
          className={`pay-button ${loading ? "disabled" : ""}`}
        >
          {loading ? "Requesting..." : "Pay with UPI App"}
        </button> */}

        {/* Payment Status */}
        {paymentStatus && (
          <div
            className={`payment-status ${
              paymentStatus === "SUCCESS" ? "success" : "failed"
            }`}
          >
            Payment Status: {paymentStatus}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentByScanning;
