import LoginFormGroup from "/src/components/login/LoginFormGroup.jsx";
import {Link} from "react-router-dom";

function Login() {
    return (
        <div>
            <div className="card rounded-4 shadow-lg bg-light position-absolute top-50 start-50 translate-middle p-5">
                <img
                    src="/src/assets/react.svg"
                    alt="Logo"
                    width="100"
                    height="100"
                    className="mx-auto d-block mb-3"
                />
                <h3 className="text-center fw-bold mb-4">即时聊天系统</h3>
                <div className="p-4"/>
                <LoginFormGroup/>
                <div className="pt-4">
                    <Link to={"/register"}>
                        <p className="text-center mb-0">
                            注册
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login;
