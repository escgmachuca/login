import {useState} from "react";
import DefaultLayout from "../Layout/DefaultLayout"
import { useAuth } from "../Auth/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { API_URL } from "../Auth/constants";
import { AuthResponseError, AuthResponse } from "../types/types";

export default function Registrarse (){ 
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [dni, setDni] = useState("");
    const [errorResponse, setErrorResponse] = useState("");

    const auth = useAuth();
    const goTo = useNavigate();

    async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(username, password, name, dni);
        try {
            const response = await fetch(`${API_URL}/registrarse`, {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"},
                    body: JSON.stringify({username,name,dni,password}),
            });
         if (response.ok){
            const json = (await response.json()) as AuthResponse;
            console.log(json);
            setUsername("");
            setPassword("");
            setName("");
            goTo("/")
         } else { 
            const json = (await response.json()) as AuthResponseError;
            setErrorResponse(json.body.error);
         }
         }catch (error) { 
            console.log(error);
         }
         }
    if(auth.isAuthenticated){
        return <Navigate to="/Panel"/>;
    }
    return ( 
    <DefaultLayout>
        <form className="form" onSubmit={handleSubmit}>
     <h1> Registrarse</h1>
     { !!errorResponse && <div className="errorMessage"> {errorResponse } </div>}

     <label>Usuario</label>
     <input type="text" value={username} onChange={(e)=> setUsername(e.target.value)} />

     <label>Nombre y Apellido</label>
     <input type="text" value={name} onChange={(e)=> setName(e.target.value)} />

     <label>DNI</label>
     <input type="text" value={dni} onChange={(e)=> setDni(e.target.value)}/>

     
     <label>Contraseña</label>
     <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)}/>

     <button>Crear Usuario</button>
     </form>
     </DefaultLayout>
     );
 };