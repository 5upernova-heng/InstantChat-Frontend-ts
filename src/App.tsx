import "/src/styles/App.css"
import ChatContextProvider from "context/ChatContextProvider.jsx";
import LoginContextProvider from "context/LoginContextProvider.jsx";
import TimeContextProvider from "context/TimeContextProvider.jsx";
import Login from "pages/Login.tsx";
import Register from "pages/Register.tsx";
import {useState} from "react";
import {Navigate, Route, Routes} from "react-router-dom";


function App() {
    const [isLogin, setLogin] = useState(false);
    const defaultPage = <Navigate to={isLogin ? "/chat" : "/login"}/>
    const rootPageRoute = <Route path={"/"} element={defaultPage}/>
    const renderRoutes = () => {
        return <Routes>
            {rootPageRoute}
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
