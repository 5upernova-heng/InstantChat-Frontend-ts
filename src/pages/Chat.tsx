import MessageContainer from "/src/components/chat/MessageContainer.jsx";
import MessageInput from "/src/components/chat/MessageInput.jsx";
import AddConversation from "/src/components/modal/AddConversation.jsx";
import RightBar from "/src/components/RightBar.jsx";
import SideBar from "/src/components/SideBar.jsx";
import TopBar from "/src/components/TopBar.jsx";
import Modal from "/src/components/widgets/Modal.jsx";
import {useChatContext, useLoginContext} from "/src/context/hooks.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import STYLE from "../style.js";


function Chat() {
    // which tab is modal in
    const [tab, setTab] = useState(0);

    const {isLogin} = useLoginContext();
    const {submitNewGroup, conversation, mode, findUserById, findGroupById} = useChatContext();

    const navigate = useNavigate();
    const title = conversation === -1
        ? "选择一个对话以开始聊天"
        : (mode ? findGroupById(conversation).name
                : findUserById(conversation).name
        );
    const label = conversation === -1
        ? ""
        : (mode ? `${STYLE.groupLevelLabel[findGroupById(conversation).level]} 级群聊`
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
                        <MessageInput disabled={conversation === -1}/>
                    </div>
                    <div className="col-2 border-start">
                        <RightBar/>
                    </div>
                </div>
            </div>
            <Modal id={"addConversation"}
                   headerLabel={"添加好友 / 群聊"}
                   bodyComponent={
                       <AddConversation tab={tab} setTab={setTab}/>
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