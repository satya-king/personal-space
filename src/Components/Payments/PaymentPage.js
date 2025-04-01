import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import axios from 'axios';
import { API_URL } from '../../APIURLs/Urls';

function PaymentPage() {
    const [qrCode, setQrCode] = useState(null);
    const [upiId, setUpiId] = useState('satya0003@ybl');
    const [paymentStatus, setPaymentStatus] = useState('');

    const handlePayNow = async () => {
        try {
            const response = await axios.post(API_URL + '/api/payment/generate', { upiId });
            setQrCode(response.data.qrCode);
            checkPaymentStatus(response.data.transactionId);
        } catch (error) {
            console.error('Error generating QR Code:', error);
        }
    };

    const checkPaymentStatus = (transactionId) => {
        const interval = setInterval(async () => {
            try {
                const response = await axios.get(API_URL+`/api/payment/status/${transactionId}`);
                setPaymentStatus(response.data.status);

                if (response.data.status === 'SUCCESS' || response.data.status === 'FAILED') {
                    clearInterval(interval);
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
            }
        }, 5000); // Poll every 5 seconds
    };

    return React.createElement(
        'div',
        { className: 'p-8' },
        React.createElement('h1', { className: 'text-2xl font-bold mb-4' }, 'UPI Payment'),

        React.createElement('label', { className: 'block mb-2' }, 'Enter UPI ID (optional for QR payment):'),
        React.createElement('input', {
            type: 'text',
            value: upiId,
            onChange: (e) => setUpiId(e.target.value),
            className: 'border rounded p-2 w-full mb-4',
        }),

        React.createElement('button', {
            onClick: handlePayNow,
            className: 'bg-blue-500 text-white px-4 py-2 rounded',
        }, 'Pay Now'),

        qrCode ? React.createElement(
            'div',
            { className: 'mt-6' },
            React.createElement('h2', { className: 'text-xl' }, 'Scan this QR Code to Pay:'),
            React.createElement(QRCode, { value: qrCode })
        ) : null,

        paymentStatus ? React.createElement(
            'div',
            { className: `mt-6 text-xl ${paymentStatus === 'SUCCESS' ? 'text-green-500' : 'text-red-500'}` },
            `Payment Status: ${paymentStatus}`
        ) : null
    );
}

export default PaymentPage;
