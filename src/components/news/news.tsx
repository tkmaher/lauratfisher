"use client";
import { useEffect, useState } from "react";
import ImageSpread from "@/src/components/imageviewer"

function NewsLink(props: {newsItem: {title: string, description: string, link: string, image: string, date: string}}) {
    return (
        <a href={props.newsItem.link} target="_blank">
            <div className="news-box">
                <div className="news-img" style={{backgroundImage: "url(" + props.newsItem.image + ")"}}/>
                <div style={{flex: "1 auto"}}>
                    <div style={{float: "right"}}>{props.newsItem.date}</div>
                    <h2>{props.newsItem.title}</h2>
                    <div>{props.newsItem.description}</div>
                </div>
            </div>
        </a>
    )
}

export default function News() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const newsAboutURL = new URL(
        "https://lauratfisher-worker.tomaszkkmaher.workers.dev/?page=about"
    );

    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await fetch(newsAboutURL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonData = await response.json();
            setNews(jsonData["links"]);
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
            {loading ? "Loading..." : <div>
                {error ? "Error fetching gallery!" : 
                    news.map((item, index) => (
                        <NewsLink key={index} newsItem={item}/>
                    ))
                }
            </div>}  
        </>
    );
};