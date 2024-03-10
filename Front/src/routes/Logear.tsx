import { Navigate, useNavigate } from "react-router-dom";
import DefaultLayout from "../Layout/DefaultLayout";
import {useState} from "react";
import { useAuth } from "../Auth/AuthProvider";
import { API_URL } from "../Auth/constants";
import type { AuthResponse, AuthResponseError } from "../types/types";

export default function Logear (){ 
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const auth = useAuth();
    const [errorResponse, setErrorResponse] = useState("");
    const goTo = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/logear`, {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });
         if (response.ok){
            console.log("Logeado Satisfactorio");
            setErrorResponse("");
            const json = (await response.json()) as AuthResponse;
            
            if(json.body.accessToken && json.body.refreshToken) {
                auth.saveUser(json);
            }
            goTo("/Panel");
              } else {
                console.log("Algo Salió Mal"); 
                const json = await response.json() as AuthResponseError;
                setErrorResponse(json.body.error);
                return;
        }
        } catch (error){
            console.log(error);

        }
    }
    
    if(auth.isAuthenticated){
        return <Navigate to="/Panel"/>
    }
    return( <DefaultLayout>
        <form className="form" onSubmit={handleSubmit}>
     <h1> Ingresar</h1>
     { !!errorResponse && <div className="errorMessage"> {errorResponse } </div>}
     <label>Usuario</label>
     <input type="text" value={username} onChange={(e)=> setUsername(e.target.value)} />

     <label>Contraseña</label>
     <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)}/>

     <button>Entrar</button>
     </form>
     </DefaultLayout>
     );
}