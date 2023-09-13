import {MessageType} from "/src/api/types.ts";
import {useAppDispatch, useAppSelector} from "/src/app/hooks.ts";
import {deleteNewMessage, fetchHistoryFriendMessages, fetchHistoryGroupMessages} from "/src/features/userSlice.ts";
import {switchChat, switchMode, updateChats} from "/src/features/viewSlice.ts";
import Avatar from "/src/widgets/Avatar.jsx";
import {Modal} from "bootstrap"
import {useCallback, useEffect} from "react";

function SideBar() {
    Modal;

    const {friends, groups} = useAppSelector(state => state.user)
    const {chats} = useAppSelector(state => state.view)
    const dispatch = useAppDispatch()

    const renderSideAvatars = useCallback(() => {
        return chats.map((chat, index) =>
            <div key={index} onClick={async () => {
                // always set mode before conversation
                if (chat.id)
                    dispatch(switchMode(chat.type))
                dispatch(switchChat(chat))
                chat.type === MessageType.single ? dispatch(fetchHistoryFriendMessages(chat.id))
                    : dispatch(fetchHistoryGroupMessages(chat.id))
                dispatch(deleteNewMessage({id: chat.id, type: chat.type}));
            }}>
                <Avatar name={chat.name}/>
            </div>
        )
    }, [chats, dispatch])


    useEffect(() => {
        dispatch(updateChats({friends, groups}))
    }, [dispatch, friends, groups])


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
