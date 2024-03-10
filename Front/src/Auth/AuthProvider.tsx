import { useContext, createContext, useState, useEffect } from "react";
import type { AuthResponse, User } from "../types/types";
import requestNewAccessToken from "./requestNewAccessToken";
import { API_URL } from "./constants";



const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => {},
    setAccessTokenAndRefreshToken: (
        _accessToken: string,
        _refreshToken: string
        ) => {},
    getRefreshToken: () => {},
    saveUser: (_userData: AuthResponse) => {},
    getUser: () => ({} as User | undefined),
    signout: () => {},
});
interface AuthProviderProps{
    children: React.ReactNode;
}
export function AuthProvider({children}: AuthProviderProps) {
    const [user, setUser] = useState<User | undefined>();
    const [accessToken, setAccessToken] = useState<string>("");
    const [refreshToken, setRefreshToken] = useState<string>("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsloading] = useState(true);

    function getAccessToken(){
        return accessToken;
    }
    function saveUser(userData: AuthResponse){
        setAccessTokenAndRefreshToken(
            userData.body.accessToken,
            userData.body.refreshToken,
            );
            setUser(userData.body.user);
            setIsAuthenticated(true);
    }
    function setAccessTokenAndRefreshToken(
        accessToken: string,
        refreshToken: string
        ){
            console.log("setAccessTokenAndRefreshToken", accessToken, refreshToken);
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            localStorage.setItem("token", JSON.stringify({refreshToken}));
        }
        function getRefreshToken(){
            if (!!refreshToken) {
                return refreshToken;
            }
            const token = localStorage.getItem("token");
            if (token) {
                const { refreshToken } = JSON.parse(token);
                setRefreshToken(refreshToken);
                return refreshToken;
            }
            return null;
        }
        async function getNewAccessToken(refreshToken: string) {
            const token = await requestNewAccessToken(refreshToken);
            if (token) {
                return token;
            }
        }
        function getUser(): User | undefined {
            return user;
        }
        function signout(){
            localStorage.removeItem("token");
            setAccessToken("");
            setRefreshToken("");
            setUser(undefined);
            setIsAuthenticated(false);
        }
        async function checkAuth(){
            try{
                if(accessToken){
                    //el usuario ya se autentico
                    const userInfo = await retrieveUserInfo(accessToken);
                    setUser(userInfo);
                    setAccessToken(accessToken);
                    setIsAuthenticated(true);
                    setIsloading(false);
                    }else{
                        const token = localStorage.getItem("token");
                        if(token) {
                            console.log("useEffect: token", token);
                            const refreshToken = JSON.parse(token).refreshToken;
                            getNewAccessToken(refreshToken)
                            .then(async (newToken) => {
                                const userInfo = await retrieveUserInfo(newToken!);
                                setUser(userInfo);
                                setAccessToken(newToken!);
                                setIsAuthenticated(true);
                                setIsloading(false);
                            })
                            .catch((error) => {
                                console.log(error);
                                setIsloading(false);
                            });
                        } else { 
                            setIsloading(false);
                        }
                    }
                } catch (error){
                    setIsloading(false);
                }
            }                 
    useEffect(() => {
        checkAuth();
    }, []);
    return ( 
<AuthContext.Provider value= {{
     isAuthenticated,
    getAccessToken,
    setAccessTokenAndRefreshToken,
    saveUser,
    getRefreshToken,
    getUser,
    signout}}>
{isLoading? <div>Cargando ...</div>: children}
</AuthContext.Provider>
);
}
    async function retrieveUserInfo(accessToken: string){
        try {
            const response = await fetch(`${API_URL}/user`,{
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            });
            if(response.ok){
                const json = await response.json();
                console.log(json);
                return json.body;
            }
        } catch (error) {}
    }
export const useAuth = () => useContext(AuthContext);