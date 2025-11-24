"use client";
import { useState } from "react";

export default function ProjectEditor({
    info,
  }: {
    info: {
      pid: number;
      projectname: string;
      imageURLs: string[];
      description: string;
      date: string;
      dimensions: string;
    };
  }) {
    const [updating, setUpdating] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const [description, setDescription] = useState(info.description);
    const [projectName, setProjectName] = useState(info.projectname);
    const [date, setDate] = useState(info.date);
    const [dimensions, setDimensions] = useState(info.dimensions);

    const [orderedList, setOrderedList] = useState(
        info.imageURLs.map(url => ({ type: "existing", value: url, file: new Blob(), fname: "" }))
    );

    const portfolioURL = new URL(
        ""
    );

    async function uploadImages() {

        const formData = new FormData();
        formData.append("pid", info.pid.toString());
    
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
        for (const url of info.imageURLs) {
            if (!orderedList.find((item) => item.value === url)) {
                deleted.push(url);
            }
        }
        formData.append("delete", JSON.stringify(deleted));

        console.log("deleted: ", deleted);
        console.log("order: ", orderedList);
    
        try {
            const response = await fetch(portfolioURL + "?password=" + localStorage.getItem("adminPassword"), {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error("Bad response");
            alert(projectName + " updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Error updating project images.");
        }

        setUpdating(false);
    }

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        e.stopPropagation();

        if (projectName.trim() === "") {
            alert("Project name cannot be empty.");
            return;
        }

        if (updating) {
            return;
        } else {
            setUpdating(true);
        }

        const projectData = {
            pid: info.pid,
            projectname: projectName,
            description: description,
            date: date,
            dimensions: dimensions
        };
        try {
            let response = await fetch(portfolioURL + "?password=" + localStorage.getItem("adminPassword"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(projectData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log("Response data: " + response);
        } catch (err) {
            console.error("Error updating project section:", err);
            alert("Error updating project section.");
        }

        uploadImages();
    }


    const handleFileChange = (event: any) => {
        const newItems: {type: string, value: any, file: Blob, fname: string}[] = [];
        for (let i = 0; i < event.target.files.length; i++) {
            let file = event.target.files[i];
            if (file) {
                newItems.push({
                    type: "new",
                    value: URL.createObjectURL(file),
                    file: file,
                    fname: ""
                })
            }
        }
    
        setOrderedList(old => [...old, ...newItems]);
    };
    

    function ImageRow(props: {url: string, index: number}) {
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
        

        return (
            <>
                <img style={{height: "50px", padding: "2px", margin: "5px"}} src={props.url}/>
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
            <div onClick={() => setIsOpen(!isOpen)}>
                <span style={{margin: "2px"}}>{projectName}</span>
                <span style={{float: "right", marginRight: "2px"}}>{isOpen ? "-" : "+"}</span>
            </div>
            {isOpen && (<div>
                <div>Name</div>
                <input type="text" name="name" value={projectName} onChange={(e) => setProjectName(e.target.value)} required/>
                <div>Date</div>
                <input type="text" name="date" value={date} onChange={(e) => {setDate(e.target.value)}}/>
                <div>Description</div>
                <textarea placeholder="(Supports Markdown)" name="description" style={{width: "100%", height: "100px"}} value={description} onChange={(e) => {setDescription(e.target.value)}}></textarea>
                <div>Dimensions</div>
                <input type="text" name="dimensions" value={dimensions} onChange={(e) => {setDimensions(e.target.value)}}/>
                <div>Images</div>
                {orderedList.length == 0 && <div>No images uploaded yet.</div>}
                {orderedList.map((url, index) => {
                    return (
                        <ImageRow key={index} url={url["value"]} index={index}/>
                    )
                })}
                <input type="file" accept="image/*" onChange={handleFileChange} multiple />
            </div>)}
            <button type="submit">{updating ? "Updating..." : "Save changes"}</button>
        </form>
    );
}