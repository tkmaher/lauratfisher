"use client";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export function NavBar() {
    
    const menuItems = [
        {"href": "/", "text": "Home"},
        {"href": "/about", "text": "About"},
        {"href": "/bio", "text": "Bio"},
        {"href": "/gallery", "text": "Gallery"},
        {"href": "/resume", "text": "Resume"},
        {"href": "/videos", "text": "Videos"},
        {"href": "/news", "text": "News"},
        {"href": "/connect", "text": "Connect"},
    ];
    const pathName = usePathname();

    function MenuItem(props: { href: string; text: string; }) {
        return (
            <span className="nav-item" style={{
                textDecoration: pathName == props.href ? "underline" : "none",
                
            }}>
                <Link href={props.href}>{props.text}</Link>
            </span>
        );
    }
    
    return (
        <div className="nav-bar-menu">
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
            <div className="inverter"></div>
            <Link className="nav-bar-title" href="/">Laura T. Fisher</Link>
            <div>SAG-AFTRA, AEA</div>
        </div>
    );
}