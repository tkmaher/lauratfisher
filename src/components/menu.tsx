"use client";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export function NavBar() {
    
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
                
            }}>
                {props.text}
            </Link>
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
            <Link href="/">
                <div className="inverter"></div>
                <div className="nav-bar-title" >Laura T. Fisher</div>
                <div>SAG-AFTRA, AEA</div>
            </Link>
        </div>
    );
}