"use client";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useState, useEffect } from "react";

export function NavBar() {
    const [open, setOpen] = useState(true);
    const [mobile, setMobile] = useState(false);

    useEffect(() => {
        const MOBILE_BREAKPOINT = 768;
        if (typeof window !== 'undefined') {
            const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
            const onChange = () => {
              setOpen(window.innerWidth > MOBILE_BREAKPOINT);
              setMobile(window.innerWidth < MOBILE_BREAKPOINT);
            };
            mql.addEventListener("change", onChange);
            setOpen(window.innerWidth > MOBILE_BREAKPOINT);
            setMobile(window.innerWidth < MOBILE_BREAKPOINT);
            return () => {
              mql.removeEventListener("change", onChange);
            };
          }
    }, []);
    
    const menuItems = [
        {"href": "/", "text": "Home"},
        {"href": "/about", "text": "About"},
        {"href": "/gallery", "text": "Gallery"},
        {"href": "/resume", "text": "Resume"},
        {"href": "/videos", "text": "Videos"},
        {"href": "/news", "text": "News"},
        {"href": "/connect", "text": "Connect"},
    ];
    const pathName = usePathname();

    function MenuItem(props: { href: string; text: string; }) {
        return (
            <Link href={props.href} className="nav-item" style={{
                textDecoration: pathName == props.href ? "underline" : "none",
                display: open == true ? "block" : "none",
            }}
            onClick={() => {if (mobile) { menuOpener() }}}>
                {props.text}
            </Link>
        );
    }
    
    const menuOpener = () => {
        if (open) {
            document.getElementById("nav-item-opener")?.style.setProperty("filter", "invert(0%)");
            document.getElementById("column-body")?.style.setProperty("display", "block");
        } else {
            document.getElementById("nav-item-opener")?.style.setProperty("filter", "invert(100%)");
            document.getElementById("column-body")?.style.setProperty("display", "none");
        }
        setOpen(!open);
    }

    return (
        <div className="nav-bar-menu">
            <div id="nav-item-opener" onClick={menuOpener}>Menu...</div>
                    {menuItems.map((item) => {
                        return <MenuItem key={item["text"]}
                                        href={item["href"]} 
                                        text={item["text"]}/>;
            })}
        </div>
    );
    
}

export function Header() {

    return (
        <div className="column-header">
            <Link href="/">
                <div className="inverter"></div>
                <div className="nav-bar-title" >Laura T. Fisher</div>
                <div>SAG-AFTRA, AEA</div>
            </Link>
        </div>
    );
}