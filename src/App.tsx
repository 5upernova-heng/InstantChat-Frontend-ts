import ChatContextProvider from "/src/context/ChatContextProvider.jsx";
import LoginContextProvider from "/src/context/LoginContextProvider.jsx";
import TimeContextProvider from "/src/context/TimeContextProvider.jsx";
import Chat from "/src/pages/Chat.tsx";
import Login from "/src/pages/Login.tsx";
import Register from "/src/pages/Register.tsx";
import "/src/styles/App.css"
import {useState} from "react";
import {Navigate, Route, Routes} from "react-router-dom";


function App() {
    const [isLogin, setLogin] = useState(false);
    const defaultPage = <Navigate to={isLogin ? "/chat" : "/login"}/>
    const rootPageRoute = <Route path={"/"} element={defaultPage}/>
    const renderRoutes = () => {
        return <Routes>
            {rootPageRoute}
            <Route path={"/chat"} element={<Chat/>}/>
            <Route path={"/login"} element={<Login/>}/>
            <Route path={"/register"} element={<Register/>}/>
        </Routes>
    }
    return (<>
        <div className="background"></div>
        <TimeContextProvider>
            <LoginContextProvider isLogin={isLogin} setLogin={setLogin}>
                <ChatContextProvider>
                    {renderRoutes()}
                </ChatContextProvider>
            </LoginContextProvider>
        </TimeContextProvider>
    </>)
}

export default App
