import {Chat} from "/src/api/types.ts";
import {useChatContext} from "/src/context/hooks.ts";
import Avatar from "/src/widgets/Avatar.jsx";
import {Modal} from "bootstrap"
import {useEffect} from "react";

function SideBar() {
    Modal;

    const {
        friends, groups, setConversation, setMode,
        chats, setChats, deleteNewMessages
    } = useChatContext();


    useEffect(() => {
        // type 0 for user; 1 for group
        // the same as mode in ChatContext
        const newChats: Chat[] = []
        friends.map((friend) => newChats.push(
            {id: friend.id, type: 0, name: friend.name}
        ))
        groups.map((group) => newChats.push(
            {id: group.id, type: 1, name: group.name}
        ))
        setChats(newChats);
    }, [friends, groups])

    const renderSideAvatars = () => {
        return chats.map((chat, index) =>
            <div key={index} onClick={async () => {
                // always set mode before conversation
                setMode(chat.type);
                setConversation(chat.id);
                deleteNewMessages(chat.id, chat.type);
            }}>
                <Avatar name={chat.name}/>
            </div>
        )
    }

    return (<div className="d-flex flex-column align-items-center border-end gap-3 pt-2 p-2"
                 style={{
                     height: "calc(100vh - 6.5rem)",
                 }}
    >
        {renderSideAvatars()}
        <div
            data-bs-toggle="modal"
            data-bs-target={"#addConversation"}
        >
            <Avatar name="+" color="#ffffff" textColor="#000000"/>
        </div>
    </div>)
}

export default SideBar;
