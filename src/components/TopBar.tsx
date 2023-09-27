import {useAppDispatch, useAppSelector} from "/src/app/hooks.ts";
import {quitLogin} from "/src/features/userSlice.ts";
import Avatar from "/src/widgets/Avatar.jsx";
import {useNavigate} from "react-router-dom";


function TopBar() {
    const {loginAccount} = useAppSelector((state) => state.user.login);
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const {name} = loginAccount;
    return (
        <div className="d-flex border-bottom justify-content-between align-items-center px-3"
             style={{height: "5.5rem"}}
        >
            <div className="d-flex justify-content-evenly align-items-center gap-3">
                <img
                    style={{
                        width: "5rem",
                        height: "5rem",
                    }}
                    src="/react.svg"
                    alt="Logo"
                    className="d-inline-block"
                />
                <p className="fw-bold fs-2 mb-0">即时聊天</p>
            </div>
            <div className="d-flex justify-content-evenly align-items-center gap-3">
                <Avatar name={name} size={"md"}/>
                <h3 className="mb-0 fw-bold">{name}</h3>
                <button className="btn" onClick={() => {
                    dispatch(quitLogin());
                    navigate("/login");
                }}>
                    <i className="fa fa-2x fa-sign-out" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    )
}

export default TopBar;
