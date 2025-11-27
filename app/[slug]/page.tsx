import { notFound } from 'next/navigation';
import { AboutBox, Connect, Reel, Headshots, Resume } from "@/src/components/about/aboutlayout";

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
        </>
    );
}