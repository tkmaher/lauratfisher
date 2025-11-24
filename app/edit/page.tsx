"use client";
import { useState, useEffect } from "react";
import { MouseEvent } from 'react';
import Menu from "@/src/components/menu";
import ProjectEditor from "@/src/components/edit/projecteditor";
import { Navigate } from "react-router-dom";

export default function EditPage() {
    //structure:
    // 1. edit about section
    // 2. edit links section
    // 3. list of projects with collapsible edit forms + image upload

    const [links, setLinks] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [about, setAbout] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [password, setPassword] = useState("");   
    const [loggedIn, setLoggedIn] = useState(false);   

    const portfolioURL = new URL(
        ""
    );
    const deleteURL = new URL(
        ""
    );
    const aboutURL = new URL(
        ""
    );
    const loginURL = new URL(
        ""
    );

    useEffect(() => {
        // const fetchData = async () => {
        // try {
        //     let response = await fetch(aboutURL);
        //     if (!response.ok) {
        //         throw new Error(`HTTP error! status: ${response.status}`);
        //     }
        //     let jsonData = await response.json();
        //     console.log("Fetched data:", jsonData);
        //     setAbout(jsonData["about"]);
        //     let newLinks = [];
        //     for (const link of jsonData["links"]) {
        //         newLinks.push([link["text"], link["link"]]);
        //     }
        //     setLinks(newLinks);
        //     response = await fetch(portfolioURL);
        //     if (!response.ok) {
        //         throw new Error(`HTTP error! status: ${response.status}`);
        //     }
        //     jsonData = await response.json();
        //     console.log("Fetched data:", jsonData);
        //     setProjects(jsonData);
        // } catch (err) {
        //     console.error("Error fetching data:", err);
        //     setError(true);
        // } finally {
        //     if (!error) setLoading(false);
        // }
        // };

        // fetchData();
    }, []);

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        e.stopPropagation();

        const aboutData = {
            about: about,
            links: links.map(link => ({text: link[0], link: link[1]}))
        };
        try {
            let response = await fetch(aboutURL + "&password=" + localStorage.getItem("adminPassword"), {
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
            alert("Information section updated successfully!");
        } catch (err) {
            console.error("Error updating information section:", err);
            alert("Error updating information section.");
        }
    }

    async function handleDelete(index: number) {
        try {
            let response = await fetch(deleteURL + `${index}` + "&password=" + localStorage.getItem("adminPassword"), {
                method: "POST",
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log("Response data: " + response);
            alert("Project deleted successfully!");
        } catch (err) {
            console.error("Error deleting project:", err);
        }
    }

    const addUrl = (e : MouseEvent, text: string, url: string) => {
        e.preventDefault();
        
        if (text.length > 0 && url.length > 0) {
            if (!url.includes("http://") && !url.includes("https://")) {
                alert("Please enter a valid URL that starts with http:// or https://");
                return;
            }
            setLinks(prevLinks => [...prevLinks, [text, url]]);
        } else {
            alert("Please fill out both fields to add a new contact link.");
        }
    };

    const removeUrl = (e : MouseEvent, index: number | undefined) => {
        e.preventDefault();
        if (index !== undefined) {
            setLinks(prevLinks => prevLinks.filter((_, i) => i !== index));
        }
    }

    function ContactLink(props: {info: [string, string], empty: boolean, index?: number}) {
        const [text, setText] = useState<string>(props.info[0]);
        const [url, setUrl] = useState<string>(props.info[1]);
        return (
            <div>
                <label>
                    Platform:
                    <input type="text" name="platform" value={text} onChange={(e) => {setText(e.target.value)}}/>
                    URL:
                    <input type="text" name="url" value={url} onChange={(e) => {setUrl(e.target.value)}}/>
                    
                    {props.empty ? 
                        (<button type="button" style={{float: "right"}} onClick={(e) => addUrl(e, text, url)}>Add</button>) : 
                        (<button type="button" style={{float: "right"}} onClick={(e) => removeUrl(e, props.index)}>Remove</button>)
                    }
                </label>
                <br/>
                    
            </div>
        )
    }

    const updateProjects = (adding: boolean, index?: number) => {
        if (adding) {
            const newProject = {
                pid: projects.length > 0 ? projects[projects.length - 1].pid + 1 : 0,
                projectname: "New Project",
                imageURLs: [],
                description: "",
                date: "",
                dimensions: ""
            };
            setProjects(prevProjects => [...prevProjects, newProject]);
        } else {
            console.log(projects, index);
            if (confirm('Remove project?') && index != null) {
                setProjects(prevProjects => prevProjects.filter((_, i) => projects[i]["pid"] !== index));
                handleDelete(index);
            }
        }
    }

    const login = async (e: any) => {
        e.preventDefault();
        try {
            const newUrl = loginURL + "&password=" + password;
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
                setPassword("");
                alert("Login successful.");
                setLoggedIn(true);
            }
            
        } catch (err) {
            console.error("Error during login:", err);
        }
    };

    return (
        <div>
            <Menu/>
            <h1>Settings</h1>
            <form onSubmit={login}>
                <input type="text" name="password" placeholder="Password (for editing)" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
            {(loading) ? (
                error ? (
                <div>Error fetching portfolio!</div>
                ) : (
                (loggedIn) && <div>Loading...</div>
                )
            ) : (
                (loggedIn) && <>
                    <form onSubmit={handleSubmit}>
                        <h2>Edit information</h2>
                        <textarea placeholder="(Supports Markdown)" style={{width: "100%", height: "200px"}} value={about} onChange={(e) => {setAbout(e.target.value)}}></textarea>
                        <br/>
                        {links.map((info, index) => {
                            return <ContactLink key={index} info={info} empty={false} index={index}/>
                        })}
                        <ContactLink info={["", ""]} empty={true}/>
                        <button type="submit">Save changes</button>                     
                    </form>
                    <br/>
                    <br/>
                    <h2>Edit projects</h2>
                    {projects.map((project) => {
                        return <div key={project["pid"]}>
                            <ProjectEditor info={project}/>
                            <button type="button" onClick={() => updateProjects(false, project["pid"])}>Remove project</button>
                        </div>
                    })}
                    <br/>
                    <button type="button" onClick={() => updateProjects(true)}>Add new project...</button>   
                </>
                
            )}
        </div>
    )
}