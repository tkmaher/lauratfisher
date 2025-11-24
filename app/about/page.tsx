"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import AboutLayout from "@/src/components/about/aboutlayout";

export default function About() {
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const workerURL = new URL(
    "https://google.com"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
      //   console.log("Fetching data from worker...");
      //   const response = await fetch(workerURL);
      //   if (!response.ok) {
      //     throw new Error(`HTTP error! status: ${response.status}`);
      //   }
      //   const jsonData = await response.json();
      //   console.log("Fetched data:", jsonData);
      //   setAbout(jsonData["about"]);
      // } catch (err) {
      //   console.error("Error fetching data:", err);
      //   setError(true);
      } finally {
        if (!error) setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div>
        {loading ? (
          error ? (
            <div>Error fetching portfolio!</div>
          ) : (
            <div>Loading...</div>
          )
        ) : (
          <AboutLayout about={about}/>
        )}
      </div>
    </>
  );
}
