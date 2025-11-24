"use client";   
import Link from "next/link";
import ContactForm from "@/src/components/contact/contact";
import Head from "next/head";
import ImageSpread from "@/src/components/imageviewer";

export default function AboutLayout(props: {about: string}) {
    // resume, headshots

    function AboutBox() {
        return (
            <span className="about-item">
                <h2>About Me</h2>
                <div>
                    lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </div>   
            </span>
        );
    };

    function Reel() {
        return (
            <span className="about-item">
                <h2>Reel</h2>
                <div>
                <div style={{padding:"56.31% 0 0 0", position:"relative"}}><iframe src="https://player.vimeo.com/video/347382835?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" style={{position:"absolute",top:"0",left:"0",width:"100%",height:"100%"}} title="LAURA T. FISHER - 2019 Reel"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
                </div>   
            </span>
        );
    };

    function Icons() {
        return (
            <div style={{width: "100%", height: "10vh", right: "0"}}>
                <span className="about-item" style={{width: "50%", padding: "0", float: "right", textAlign: "right"}}>
                    <a href="https://www.imdb.com/name/nm2078266/" target="_blank">
                        <img style={{float: "right"}} src="imdb_icon.avif" width="15%" height="15%" alt="IMDB"/>
                    </a>
                    <a href="https://vimeo.com/lauratfisher" target="_blank">
                        <img style={{float: "right", marginRight: "1em"}} src="vimeo_icon.avif" width="15%" height="15%" alt="Vimeo"/>
                    </a>
                </span>
            </div>
        )
    }

    function Headshots() {
        const headshots = [ // to be fetched
            "headshot_filler.jpg",
            "headshot_filler.jpg",
            "headshot_filler.jpg"
        ]
        return (
            <span className="about-item">
                <h2>Headshots</h2>
                <ImageSpread imageURLs={headshots}/>
                
            </span>
        );
    
    }

    function Resume() {
        
        return (
            <span className="about-item">
                <h2>Resume</h2>
                Height: 5"6 - 1/2<br/>
                Eye Color: Green<br/>
                Hair Color: Brown<br/><br/>
                Location: Chicago, IL<br/><br/>
                <Link href={"https://google.com"} target="_blank">Download full resume...</Link><br/>
                
            </span>
        );
    
    }

    function Contact() {
        return (
            <div className="about-mosaic" style={{border: "1px solid black", padding: "1em"}}>
                <span className="about-column">
                    <img style={{width: "75%"}} src="talent_logo.avif"/>
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

    return (
        <>
            <div className="about-mosaic">
                <div className="about-column">
                    <AboutBox />
                    <Headshots/>
                </div>
                <div className="about-column">
                    <Reel />
                    <Resume/>
                </div>

            </div>
            
            <Contact/>
            <Icons/>
            
        </>
    );
}
