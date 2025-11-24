"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const workerURL = new URL(
    "https://google.com"
  );

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     console.log("Fetching data from worker...");
    //     const response = await fetch(workerURL);
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     const jsonData = await response.json();
    //     console.log("Fetched data:", jsonData);
    //     setLinks(jsonData["links"]);
    //   } catch (err) {
    //     console.error("Error fetching data:", err);
    //     setError(true);
    //   } finally {
    //     if (!error) setLoading(false);
    //   }
    // };

    // fetchData();
  }, []);

  function AboutLink(props: { linkInfo: {id: number, link: string, text: string} }) {
    return (
      <>
        <Link href={props.linkInfo.link} target="_blank" rel="noopener noreferrer">
          {props.linkInfo.text}
        </Link>
        <br/>
      </>
    )
  }

  return (
      <div className="about-mosaic">
      </div>
  );
}
