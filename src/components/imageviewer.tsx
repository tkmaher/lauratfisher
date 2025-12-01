"use client";
import { useState, useEffect, useEffectEvent } from "react";

function ImageViewer(props: { imageSrcs: string[], descriptions?: string[], initialIndex: number}) {
  const len = props.imageSrcs.length;

  return (
      <>
          {props.imageSrcs.map((src, index) => (
                  <div className="overlay-image"
                    key={index}
                    id={"img-"+{index}}

                    style={{ left: index === (props.initialIndex) ? '50%' : 
                      ((props.initialIndex === 0 && index === len - 1) 
                          || index < props.initialIndex 
                          && !(index === 0 && props.initialIndex === len - 1)) ? '-150%' 
                      : '150%',
                      opacity: index === (props.initialIndex) ? 1 : 0,
                      textAlign: "left",
                      fontSize: "1.5em"
                    }}

                  >
                    <img src={src} alt={`Image ${index + 1}`}/>
                    {props.descriptions && props.descriptions[index]}
                  </div>
              ))
          }
          
      </>
  );
}

export default function ImageSpread(props: { imageURLs: string[], scroll: boolean, descriptions?: string[] }) {
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerindex, setViewerIndex] = useState(0);
  
    const numPics = props.imageURLs.length;
  
    useEffect(() => {
      const handleKeyDown = (event: any) => {
        
        if (event.key === "Escape") {
          setViewerOpen(false);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          forwardScroll();
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          backwardScroll();
        }
      };
  
      document.addEventListener("keydown", handleKeyDown);
  
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, []);
  
    const forwardScroll = useEffectEvent(() => {
      console.log(viewerindex);
      setViewerIndex((viewerindex + 1) % numPics);
      console.log("right");
    });
  
    const backwardScroll = useEffectEvent(() => {
      setViewerIndex(((viewerindex - 1 + numPics) % numPics));
      console.log("left");
    });
  
    return (
      <div>
      {viewerOpen && 
          <>
            <button className="img-closer" style={{left: "10px"}} onClick={() => setViewerOpen(false)}>X</button>
            <button className="img-scroller" style={{right: "10px"}} onClick={forwardScroll}>&gt;</button>
            <button className="img-scroller" style={{left: "10px"}} onClick={backwardScroll}>&lt;</button>
            <div className="img-overlay" onClick={() => setViewerOpen(false)}>
              <ImageViewer imageSrcs={props.imageURLs} descriptions={props.descriptions} initialIndex={viewerindex}/>
            </div>
          </>
        }
        {props.scroll ?
          <div className="image-row-container">
            {props.imageURLs.map((image, index) => (
                <img className="image-row-container-img" onClick={() => {setViewerIndex(index); setViewerOpen(true)}} key={index} src={image} alt={`Image ${index + 1}`} />
            )) }
          </div> :
          <div>
            {props.imageURLs.map((image, index) => (
                <div className="img-row-box" onClick={() => {setViewerIndex(index); setViewerOpen(true)}} key={index} style={{backgroundImage: "url(" + image + ")"}}>
                  {props.descriptions && <div className="img-row-box-title">{props.descriptions[index]}</div>}
                </div>
            )) }
          </div> 
        }
      </div>
    );
}