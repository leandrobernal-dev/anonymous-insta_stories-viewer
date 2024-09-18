"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function Home({ params }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`/api/${params.username}`).then((data) => {
            console.log(data.data);
            setData(data.data);
        });
    }, []);
    return (
        <div>
            {params.username}
            {data && <video src={data.videoUrl}></video>}
        </div>
    );
}
