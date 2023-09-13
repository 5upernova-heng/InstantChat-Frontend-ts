import {useAppSelector} from "/src/app/hooks.ts";
import Chat from "/src/pages/Chat.tsx";
import Login from "/src/pages/Login.tsx";
import Register from "/src/pages/Register.tsx";
import "/src/styles/App.css"
import {useCallback, useEffect} from "react";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";


function App() {
    const {isLogin} = useAppSelector((state) => state.user.login)
    const navigate = useNavigate()
    useEffect(() => {
        if (isLogin && document.location.pathname === "/login")
            navigate("/chat")
        if (!isLogin && document.location.pathname === "/chat")
            navigate("/login")

    }, [navigate, document.location.pathname, isLogin])
    const renderRoutes = useCallback(() => {
        const defaultPage = <Navigate to={isLogin ? "/chat" : "/login"}/>
        const rootPageRoute = <Route path={"/"} element={defaultPage}/>
        return <Routes>
            {rootPageRoute}
            <Route path={"/chat"} element={<Chat/>}/>
            <Route path={"/login"} element={<Login/>}/>
            <Route path={"/register"} element={<Register/>}/>
        </Routes>
    }, [isLogin])
    return (<>
        <div className="background"></div>
        {renderRoutes()}
    </>)
}

export default App
