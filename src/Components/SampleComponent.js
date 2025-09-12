import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API_URL } from '../APIURLs/Urls';
import CommonAPICallsService from '../utils/CommonAPICallsService';



function SampleComponent() {
    const [sample, setSample] = useState("")
    useEffect(() => {
        console.log("in Use Effect ");
        handleSampleGet()
    }, [])

    const handleSampleGet = async () => {
        try {
            const response = await CommonAPICallsService.getSampleOne();

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