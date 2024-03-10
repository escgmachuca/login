import React, { MouseEvent } from "react";
import { useAuth } from "../Auth/AuthProvider";
import { Link } from "react-router-dom";
import { API_URL } from "../Auth/constants";

interface PortalLayoutProps {
    children?: React.ReactNode;
}
export default function PortalLayout({children}: PortalLayoutProps){
    const auth = useAuth();
    async function handleSignOut(e: MouseEvent<HTMLAnchorElement>){
        e.preventDefault();
        
        try{
            const response = await fetch(`${API_URL}/signout`,{
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.getRefreshToken()}`,
                },
            });
            if(response.ok){
                auth.signOut();
            }
        } catch (error) { 
        }

    }

    return (
    <>
    <header>
    <nav>
    <ul>
    <li>
    <Link to="/dashboard">Panel</Link>
    </li>
    <li>
        <Link to="me">Perfil</Link>
    </li>
    <li>
        <Link to="/me">{auth.getUser()?.username ?? ""}</Link>
    </li>
    <li>
        <a href="#" onClick={handleSignOut}>
            Deslogear
        </a>
    </li> 
    </ul>
    </nav>
    </header>
    <main>{children}</main>
    </>
    );
}