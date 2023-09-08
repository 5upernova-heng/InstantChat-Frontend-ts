import {useLoginContext} from "/src/context/hooks.ts";
import Avatar from "/src/widgets/Avatar.jsx";


function TopBar() {
    const {loginAccount, quitLogin} = useLoginContext();
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
                    src="/src/assets/react.svg"
                    alt="Logo"
                    className="d-inline-block"
                />
                <p className="fw-bold fs-2 mb-0">即时聊天</p>
            </div>
            <div className="d-flex justify-content-evenly align-items-center gap-3">
                <Avatar name={name} size={"md"}/>
                <h3 className="mb-0 fw-bold">{name}</h3>
                <button className="btn" onClick={() => quitLogin()}>
                    <i className="fa fa-2x fa-sign-out" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    )
}

export default TopBar;
