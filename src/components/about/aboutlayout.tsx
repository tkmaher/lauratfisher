"use client";   
import Link from "next/link";
import ContactForm from "@/src/components/contact/contact";
import ImageSpread from "@/src/components/imageviewer";
import { useEffect, useState, useMemo } from "react";

export function AboutBox() {
    const [about, setAbout] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const newsAboutURL = new URL(
        "https://lauratfisher-worker.tomaszkkmaher.workers.dev/?page=about"
    );

    useEffect(() => {
        const fetchData = async () => {
        try {
          console.log("Fetching data from worker...");
          const response = await fetch(newsAboutURL);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const jsonData = await response.json();
          console.log("Fetched data:", jsonData);
          setAbout(jsonData["about"]);
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
            <h2>About Me</h2>
            {loading ? <div>Loading...</div> : <div>
                {error ? "Error fetching about!" : about}
            </div>}  
        </>
    );
};

export function Reel(props: {single: boolean}) {
    const ids = [
        {
            name: "2019 Reel",
            id: "347382835"
        },
        {
            name: "CHICAGO PD Clip",
            id: "212394362"
        },
        {
            name: "CONTAGION Clip",
            id: "212397154"
        },
        {
            name: "BODY/S Clip",
            id: "213584303"
        }
    ]
    function VimeoPlayer(props: {id: string}) {
        return (
            <>
                <div style={{padding:"56.31% 0 0 0", position:"relative"}}><iframe src={`https://player.vimeo.com/video/${props.id}?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479`} allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" style={{position:"absolute",top:"0",left:"0",width:"100%",height:"100%"}} title="LAURA T. FISHER - 2019 Reel"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
            </>
        )
    }

    return (
        <span className="about-item">
            { props.single && <h2>Reel</h2> }
            <div>
            {props.single ? 
                <VimeoPlayer id={"347382835"}/> :
                ids.map((item) =>
                    <div style={{border: "1px solid black", padding: "1em", marginBottom: "1em"}} key={item.id}>
                        <h2>{item.name}</h2>
                        <VimeoPlayer id={item.id}/>
                        <br/>
                    </div>
                )
                
            }
            </div>   
        </span>
    );
};

export function Icons() {
    return (
        <div style={{width: "100%", right: "0"}}>
                <a href="https://www.imdb.com/name/nm2078266/" target="_blank">
                    <img style={{float: "right"}} src="img/icons/imdb_icon.avif" width="50vw" alt="IMDB"/>
                </a>
                <a href="https://vimeo.com/lauratfisher" target="_blank">
                    <img style={{float: "right", marginRight: "1em"}} src="img/icons/vimeo_icon.avif" width="50vw" alt="Vimeo"/>
                </a>
        </div>
    )
}

export function Headshots() {
    const headshots = [ // to be fetched
        "headshot_filler.jpg",
        "headshot_filler.jpg",
        "headshot_filler.jpg"
    ]
    return (
        <span className="about-item">
            <h2>Headshots</h2>
            <ImageSpread imageURLs={headshots} scroll={true}/>
            
        </span>
    );

}

export function Resume() {
    
    return (
        <>
            <h2>Resume</h2>
            Height: 5"6 - 1/2<br/>
            Eye Color: Green<br/>
            Hair Color: Brown<br/><br/>
            Location: Chicago, IL<br/><br/>
            <Link href={"https://google.com"} style={{float: "right", textDecoration: "underline"}} target="_blank">Download full resume...</Link><br/>
            
        </>
    );

}

export function Connect() {
    return (
        <div className="about-mosaic" style={{border: "1px solid black", padding: "1em"}}>
            <span className="about-column">
                <img style={{width: "100%"}} src="https://en.eragroup.com/wp-content/uploads/2018/02/logo-placeholder.png"/>
                1234 Maple St
                <br/>
                Chicago, IL 60610
                <br/>
                (123) 456-7890
            </span>
            <span className="about-column">
                <ContactForm/> 
            </span>
        </div>
    );
}

export function AboutLayout() {
    return (
        <>
            <div className="about-mosaic">
                <div className="about-column">
                    <span className="about-item">
                        <AboutBox />
                    </span>
                    
                    <Headshots/>
                </div>
                <div className="about-column">
                    <Reel single={true} />
                    
                    <span className="about-item">
                        <Resume />
                    </span>
                </div>

            </div>
            
            <Connect/>
            <Icons/>
            
        </>
    );
}
