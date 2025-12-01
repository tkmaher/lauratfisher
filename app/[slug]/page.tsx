import { notFound } from 'next/navigation';
import { AboutBox, Connect, Reel, Headshots, Resume } from "@/src/components/about/aboutlayout";
import Gallery from "@/src/components/gallery/gallery";
import News from "@/src/components/news/news";

export default async function Home({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return (
        <>
            { slug === "connect" && <Connect/>}
            { slug === "about" && 
                <div style={{border: "1px solid black", padding: "1em"}}>
                    <AboutBox/>
                </div>
            }
            { slug === "resume" && 
                <div style={{border: "1px solid black", padding: "1em"}}>
                    <Resume/>
                </div>
            }
            { slug === "videos" && 

                
                <Reel single={false}/>
            }
            { slug === "gallery" && 
                    <Gallery/>
            }
            { slug === "news" && 
                <News/>
            }
        </>
    );
}