import {Group} from "/src/api/types.ts";
import {useAppSelector} from "/src/app/hooks.ts";
import RightBar from "/src/components/RightBar.jsx";
import SideBar from "/src/components/SideBar.jsx";
import TopBar from "/src/components/TopBar.jsx";
import {useChatContext} from "/src/context/hooks.ts";
import MessageContainer from "/src/features/chat/MessageContainer.jsx";
import MessageInput from "/src/features/chat/MessageInput.jsx";
import AddConversation from "/src/features/modal/AddConversation.jsx";
import Modal from "/src/widgets/Modal.jsx";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";


function Chat() {
    const {mode, tab, currentChat} = useAppSelector(state => ({
        ...state.view,
    }))
    const isLogin = useAppSelector(state => state.user.login.isLogin)
    const {submitNewGroup} = useChatContext();

    const navigate = useNavigate();
    const title = currentChat.id === -1
        ? "选择一个对话以开始聊天"
        : currentChat.entity.name;
    const label = currentChat.id === -1
        ? ""
        : (mode ? `${(currentChat.entity as Group).level} 级群聊`
            : "私聊")

    useEffect(() => {
        if (!isLogin) {
            navigate("/login");
        }
    }, [isLogin, navigate])

    return (
        <>
            <TopBar/>
            <div className="d-flex">
                <SideBar/>
                <div className="d-flex w-100">
                    <div className="col">
                        <div className="border-bottom d-flex justify-content-between align-items-center"
                             style={{height: "3.5rem"}}>
                            <h2 className="mb-0">{`「${title}」`}</h2>
                            <h2 className="mb-0 pe-3">{label}</h2>
                        </div>
                        <div className="overflow-auto" style={{
                            height: "calc(100vh - 20rem)",
                        }}>
                            <MessageContainer/>
                        </div>
                        <MessageInput disabled={currentChat.id === -1}/>
                    </div>
                    <div className="col-2 border-start">
                        <RightBar/>
                    </div>
                </div>
            </div>
            <Modal id={"addConversation"}
                   headerLabel={"添加好友 / 群聊"}
                   bodyComponent={
                       <AddConversation/>
                   }
                   footerComponent={
                       <>
                           {tab < 2 ||
                               <button className="btn btn-success"
                                       data-bs-dismiss="modal"
                                       onClick={submitNewGroup}
                               >添加</button>
                           }
                           <button className="btn btn-secondary" data-bs-dismiss="modal">取消
                           </button>
                       </>
                   }
            />
        </>
    )
}

export default Chat;
