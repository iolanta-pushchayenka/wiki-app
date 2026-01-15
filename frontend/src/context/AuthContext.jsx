// import { createContext, useContext, useState, useEffect } from "react";
// import { jwtDecode } from "jwt-decode";


// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//     const [token, setToken] = useState(localStorage.getItem("token"));
//     const [userId, setUserId] = useState(null);

//     useEffect(() => {
//         if (token) {
//             try {
//                 const decoded = jwtDecode(token);
//                 setUserId(decoded.userId);
//             } catch (err) {

//                 logout();
//             }
//         } else {
//             setUserId(null);
//         }
//     }, [token]);


//     const login = (newToken) => {
//         localStorage.setItem("token", newToken);
//         setToken(newToken);
//     };

//     const logout = () => {
//         localStorage.removeItem("token");
//         setToken(null);
//         setUserId(null);
//     };

//     const isAuth = !!token;

//     return (
//         <AuthContext.Provider value={{ token, userId, isAuth, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }

// export const useAuth = () => useContext(AuthContext);
///////




// import { createContext, useContext, useState, useEffect } from "react";
// import { jwtDecode } from "jwt-decode";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//     const [token, setToken] = useState(localStorage.getItem("token"));
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         if (!token) {
//             setUser(null);
//             return;
//         }

//         try {
//             const decoded = jwtDecode(token);

//             setUser({
//                 userId: decoded.userId,
//                 email: decoded.email,
//                 role: decoded.role,
//             });
//         } catch (err) {
//             logout();
//         }
//     }, [token]);

//     const login = (newToken) => {
//         localStorage.setItem("token", newToken);
//         setToken(newToken);
//     };

//     const logout = () => {
//         localStorage.removeItem("token");
//         setToken(null);
//         setUser(null);
//     };

//     return (
//         <AuthContext.Provider
//             value={{
//                 token,
//                 isAuth: !!token,
//                 user,
//                 userId: user?.userId,
//                 role: user?.role,
//                 login,
//                 logout,
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// }

// export const useAuth = () => {
//     const ctx = useContext(AuthContext);
//     if (!ctx) {
//         throw new Error("useAuth must be used inside AuthProvider");
//     }
//     return ctx;
// };



//////////////

import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);

                setUser({
                    userId: decoded.userId,
                    email: decoded.email,
                    role: decoded.role,
                });
            } catch (err) {
                logout();
            }
        } else {
            setUser(null);
        }
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    const isAuth = !!token;

    return (
        <AuthContext.Provider
            value={{ token, user, isAuth, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
