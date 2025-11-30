"use client";
import { useEffect, useState } from "react";
import ImageSpread from "@/src/components/imageviewer"

export default function Gallery() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const galleryURL = new URL(
        "https://lauratfisher-worker.tomaszkkmaher.workers.dev/?page=gallery"
    );

    const [urls, setUrls] = useState([]);
    const [descriptions, setDescriptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await fetch(galleryURL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonData = await response.json();
            setUrls(jsonData.map((item: {url: string, description: string}) => item.url));
            setDescriptions(jsonData.map((item: {url: string, description: string}) => item.description));
            console.log(urls);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(true);
        } finally {
            if (!error) setLoading(false);
        }
        };

        fetchData();
    }, []);

    return (
        <>
            <h2>Gallery</h2>
            {!loading && <div>
                {error ? "Error fetching gallery!" : 
                    <ImageSpread imageURLs={urls} scroll={false} descriptions={descriptions}/>
                }
            </div>}  
        </>
    );
};