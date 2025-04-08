import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API_URL } from '../APIURLs/Urls';



function SampleComponent() {
    const [sample, setSample] = useState("")
    useEffect(() => {
        console.log("in Use Effect ");
        handlePayNow()
    }, [])

    const handlePayNow = async () => {
        try {
            const response = await axios.get(`${API_URL}/authCheck`, {
                withCredentials: true,
            });


            console.log("response == ", response);
            setSample(response?.data)

        } catch (error) {
            console.error('Error:', error);
        }
    };




    return (
        <div>
            satya {sample}
        </div>
    )
}

export default SampleComponent