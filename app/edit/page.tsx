"use client";
import { useState, useEffect } from "react";
import { MouseEvent } from 'react';
import GalleryEditor from "@/src/components/edit/galleryeditor";

export default function EditPage() {

    const [links, setLinks] = useState<any[]>([]);
    const [gallery, setGallery] = useState<{"url": string, "description": string}[]>([]);
    const [about, setAbout] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [password, setPassword] = useState("");   
    const [loggedIn, setLoggedIn] = useState(false);   

    const galleryURL = new URL(
        "https://lauratfisher-worker.tomaszkkmaher.workers.dev/?page=gallery"
    );
    const newsAboutURL = new URL(
        "https://lauratfisher-worker.tomaszkkmaher.workers.dev/?page=about"
    );
    const loginURL = new URL(
        "https://lauratfisher-worker.tomaszkkmaher.workers.dev/?page=login"
    );

    useEffect(() => {
        const fetchData = async () => {
        try {
            let response = await fetch(newsAboutURL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let jsonData = await response.json();
            console.log("Fetched data:", jsonData);
            setAbout(jsonData["about"]);
            let newLinks = [];
            for (const link of jsonData["links"]) {
                newLinks.push([link["title"], link["description"], link["link"], link["date"] || ""]);
            }
            setLinks(newLinks);
            response = await fetch(galleryURL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            jsonData = await response.json();
            console.log("Fetched data:", jsonData);
            setGallery(jsonData);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(true);
        } finally {
            if (!error) setLoading(false);
        }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        e.stopPropagation();

        const aboutData = {
            about: about,
            links: links.map(link => ({
                title: link[0],
                description: link[1],
                link: link[2],
                date: link[3]
            }))
        };
        console.log("Sending about data: ", aboutData)
        try {
            const newUrl = new URL(newsAboutURL);
            newUrl.searchParams.append("password", password);
            let response = await fetch(newUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(aboutData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log("Response data: " + response);
            alert("About section updated successfully!");
        } catch (err) {
            console.error("Error updating about section:", err);
            alert("Error updating about section.");
        }
    }

    const addUrl = (e : MouseEvent, title: string, description: string, url: string) => {
        e.preventDefault();
        
        if (title.length > 0 && url.length > 0) {
            if (!url.includes("http://") && !url.includes("https://")) {
                alert("Please enter a valid URL that starts with http:// or https://");
                return;
            }
            setLinks(prevLinks => [...prevLinks, [title, description, url]]);
        } else {
            alert("Please fill out URL and title fields to add a new link.");
        }
    };

    const removeUrl = (e : MouseEvent, index: number | undefined) => {
        e.preventDefault();
        if (index !== undefined) {
            setLinks(prevLinks => prevLinks.filter((_, i) => i !== index));
        }
    }

    function NewsLink(props: {info: [string, string, string, string], empty: boolean, index?: number}) {
        const [info, setInfo] = useState<string[]>(props.info);

        useEffect(() => {
            setInfo(props.info);
        }, [props.info]);

        const update = (e: any, i: number) => {
            let newInfo = [...info];
            newInfo[i] = e.target.value;
            setInfo(newInfo);
        };

        const propagate = () => {
            if (props.index != null) {
                let newLinkList = [...links];
                newLinkList[props.index] = info;
                setLinks(newLinkList);
            }
        }

        return (
            <div>
                <label>
                    <input type="text" name="title" placeholder="Title" value={info[0]} onBlur={propagate} onChange={(e) => update(e, 0)}/>
                    <input type="text" name="description" placeholder="Description" value={info[1]} onBlur={propagate} onChange={(e) => update(e, 1)}/>
                    <input type="text" name="url" value={info[2]} placeholder="URL" onBlur={propagate} onChange={(e) => update(e, 2)}/>
                    <input
                        type="date"
                        value={info[3] || ""}
                        onChange={(e) => update(e, 3)}
                        onBlur={propagate}
                    />
                    {props.empty ? 
                        (<button type="button" style={{float: "right"}} onClick={(e) => addUrl(e, info[0], info[1], info[2])}>Add</button>) : 
                        (<button type="button" style={{float: "right"}} onClick={(e) => removeUrl(e, props.index)}>Remove</button>)
                    }
                </label>
                <br/>
                <br/>
                <br/>
                    
            </div>
        )
    }

    const login = async (e: any) => {
        e.preventDefault();
        try {
            const newUrl = new URL(loginURL);
            newUrl.searchParams.append("password", password);
            console.log("Logging in with URL:", newUrl);
            let response = await fetch(newUrl, {
                method: "POST",
            });
            if (!response.ok) {
                alert("Login failed. Please check your password.");
                setLoggedIn(false);
                localStorage.removeItem("adminPassword");
            } else {
                localStorage.setItem("adminPassword", password);
                alert("Login successful.");
                setLoggedIn(true);
            }
            
        } catch (err) {
            console.error("Error during login:", err);
        }
    };

    return (
        <div>
            { (!loggedIn) && <form onSubmit={login}>
                    <input type="text" name="password" placeholder="Password (for editing)" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Login</button>
                </form>
            }
            {(loading) ? (
                error ? (
                <div>Error fetching portfolio!</div>
                ) : (
                (loggedIn) && <div>Loading...</div>
                )
            ) : (
                (loggedIn) && <>
                    <form onSubmit={handleSubmit}>
                        <h2>Edit about section...</h2>
                        <textarea placeholder="(Supports Markdown)" style={{width: "100%", height: "200px"}} value={about} onChange={(e) => {setAbout(e.target.value)}}></textarea>
                        <br/>
                        <br/>
                        <h2>Edit news...</h2>
                        {links.map((info, index) => {
                            return <NewsLink key={index} info={info} empty={false} index={index}/>
                        })}
                        <NewsLink info={["", "", "", ""]} empty={true}/>
                        <button type="submit">Save changes</button>                     
                    </form>
                    <br/>
                    <br/>
                    <h2>Edit Gallery...</h2>
                    <GalleryEditor info={gallery} />
                    <br/>
                </>
            )}
        </div>
    )
}