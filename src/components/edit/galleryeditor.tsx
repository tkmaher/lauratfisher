"use client";
import { useState } from "react";

export default function GalleryEditor(props: {
    info: {
      url: string,
      description: string
    }[];
  }) {
    const [updating, setUpdating] = useState(false);
    const [originalUrls, updateOriginalUrls] = useState(props.info);

    const [orderedList, setOrderedList] = useState(
        props.info.map((item) => ({ 
            type: "existing", 
            value: item.url, 
            file: new Blob(), 
            fname: "", 
            description: item.description
        }))
    );

    const galleryURL = new URL(
        "https://lauratfisher-worker.tomaszkkmaher.workers.dev/?page=gallery"
    );

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        e.stopPropagation();

        if (updating) {
            return;
        } else {
            setUpdating(true);
        }

       const formData = new FormData();
    
        // Tell backend which existing images remain + their order
        for (let i = 0; i < orderedList.length; i++) {
            if (orderedList[i]["type"] === "new") {
                formData.append(`file_${i}`, orderedList[i]["file"]);
                orderedList[i]["fname"] = `file_${i}`;
            }
        }
        formData.append("order", JSON.stringify(orderedList));
    
        // Tell backend which existing images were removed
        let deleted = []
        for (const originalItem of originalUrls) {
            if (!orderedList.find((item) => item.value === originalItem.url)) {
                deleted.push(originalItem.url);
            }
        }
        formData.append("delete", JSON.stringify(deleted));

        console.log("deleted: ", deleted);
        console.log("order: ", orderedList);
    
        try {
            const newUrl = new URL(galleryURL);
            const pw = localStorage.getItem("adminPassword");
            if (!pw) throw new TypeError("No password available.");
            newUrl.searchParams.append("password", pw);
            const response = await fetch(newUrl, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error("Bad response");
            alert("Gallery updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Error updating gallery.");
        }

        let newOriginal = [];
        for (let i = 0; i < orderedList.length; i++) {
            newOriginal.push({url: orderedList[i].value, description: orderedList[i].description});
        }
        updateOriginalUrls(newOriginal);
        
        setUpdating(false);
    }


    const handleFileChange = (event: any) => {
        const newItems: {type: string, value: any, file: Blob, fname: string, description: string}[] = [];
        for (let i = 0; i < event.target.files.length; i++) {
            let file = event.target.files[i];
            if (file) {
                newItems.push({
                    type: "new",
                    value: URL.createObjectURL(file),
                    file: file,
                    fname: "",
                    description: ""
                })
            }
        }
    
        setOrderedList(old => [...old, ...newItems]);
    };
    

    function ImageRow(props: {url: string, description: string, index: number}) {
        const [description, setDescription] = useState(props.description);
        function swapElts(i: number, j: number) {
            const updated = [...orderedList];
            const tmp = updated[i];
            updated[i] = updated[j];
            updated[j] = tmp;
            setOrderedList(updated);
        }
        
        function removeImage(index: number) {
            const item = orderedList[index];
            setOrderedList(orderedList.filter((_, i) => i !== index));
        }

        const changeDescription = (e: any) => {
            setDescription(e.target.value);
        }

        const exitDescription = () => {
            const updated = [...orderedList];
            updated[props.index].description = description;
            if (updated[props.index].type != "new") updated[props.index].type = "newDesc";
            setOrderedList(updated);
        }

        return (
            <>
                <img style={{height: "200px", padding: "2px", margin: "5px"}} src={props.url}/>
                <textarea placeholder="Description (supports Markdown)" name="description" style={{width: "100%", height: "100px"}} value={description} onBlur={exitDescription} onChange={changeDescription}></textarea>
                {props.index > 0 && <button type="button" onClick={(e) => {
                    e.preventDefault();
                    swapElts(props.index, props.index - 1);
                }}>Move Up</button>}
                {props.index < orderedList.length - 1 && <button type="button" onClick={(e) => {
                    e.preventDefault();
                    swapElts(props.index, props.index + 1);
                }}>Move Down</button>}
                <button type="button" onClick={(e) => {
                    e.preventDefault();
                    removeImage(props.index);
                }}>Remove</button>
            </>
        )
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                
                {orderedList.length == 0 && <div>No images uploaded yet.</div>}
                {orderedList.map((url, index) => {
                    return (
                        <ImageRow key={index} url={url.value} description={url.description} index={index}/>
                    )
                })}
                <input type="file" accept="image/*" onChange={handleFileChange} multiple />
            </div>
            <button type="submit">{updating ? "Updating..." : "Save changes"}</button>
        </form>
    );
}