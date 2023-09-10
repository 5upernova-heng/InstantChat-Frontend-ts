import {loginApi} from "/src/api/loginApi.js";
import {Account, User} from "/src/api/types.ts";
import {useTimeContext} from "/src/context/hooks.ts";
import {createContext, Dispatch, ReactNode, SetStateAction, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

export type LoginContextType = {
    token: string
    isLogin: boolean
    tryLogin: (account: Account) => Promise<void>
    quitLogin: () => void
    loginAccount: User
}
export const LoginContext = createContext<LoginContextType | null>(null);

type Props = {
    children: ReactNode
    isLogin: boolean,
    setLogin: Dispatch<SetStateAction<boolean>>
}

function LoginContextProvider({children, isLogin, setLogin}: Props) {
    const {setLastMsgTime, formatDate} = useTimeContext()

    const emptyAccount = {username: "", password: "", name: "", id: 0};
    const [loginAccount, setAccount] = useState<User>(emptyAccount);
    const [token, setToken] = useState<string>("");
    const navigate = useNavigate();

    const tryLogin = async (account: Account) => {
        const {code, data} = await loginApi(account);
        if (code) {
            const {jwt, user} = data;
            setToken(jwt);
            setAccount({
                username: user.username,
                password: user.password,
                name: user.name,
                id: user.id,
            });
            setLogin(true);
            toast(`登录成功。您好，${user.name}!`, {
                autoClose: 1000,
            });
            setLastMsgTime(formatDate(new Date()));
            navigate("/chat");
        } else {
            toast("登录失败，请检查用户名和密码是否正确");
        }
    };
    const quitLogin = () => {
        setLogin(false);
        setToken("");
        setAccount(emptyAccount);
    };
    return (
        <LoginContext.Provider
            value={{
                token,
                isLogin,
                tryLogin,
                quitLogin,
                loginAccount,
            }}
        >
            {children}
        </LoginContext.Provider>
    );
}

export default LoginContextProvider;
