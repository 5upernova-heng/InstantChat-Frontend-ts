// 上方用于显示好友请求
// 下方用于显示成员信息

import {Group, MessageType, User} from "/src/api/types.ts";
import {useChatContext, useLoginContext} from "/src/context/hooks.ts";
import {useViewContext} from "/src/pages/Chat.tsx";
import Avatar from "/src/widgets/Avatar.jsx";
import UserCard from "/src/widgets/UserCard.jsx";
import {useEffect, useState} from "react";

function RightBar() {
    const {loginAccount} = useLoginContext();
    const {
        allUsers, findMembersById, chats, setChats, newMessages, friendRequests, handleRequest,
        findUserById, joinGroup, leaveGroup, getGroupSize, findGroupById, deleteNewMessages,
    } = useChatContext();
    const {mode, setMode, conversation, setConversation} = useViewContext()

    const [members, setMembers] = useState<User[]>([]);
    const [outsideUsers, setOutsideUsers] = useState<User[]>([]);

    const loadMember = async () => {
        if (mode === 0) {
            setMembers([]);
            setOutsideUsers([]);
            return;
        }
        const newMembers = await findMembersById(conversation);
        setMembers(newMembers);
        console.log(allUsers);
        console.log(newMembers);
        const outside = allUsers.filter((user) => {
            const index = newMembers.findIndex((member) => member.id === user.id);
            console.log(index)
            return index === -1;
        })
        console.log(outside);
        setOutsideUsers(outside);

    }
    useEffect(
        () => {
            loadMember();
        }, [conversation]
    )

    const jumpToChat = (entity: User | Group, type: MessageType) => {
        if (entity.id === loginAccount.id && type === MessageType.single)
            return;

        setMode(type);
        let flag = 0;
        chats.map((chat) => {
            if (chat.id === entity.id) {
                setConversation(chat.id);
                flag = 1;
            }
        });
        if (flag === 0) {
            const newChats = chats;
            newChats.push({id: entity.id, type: type, name: entity.name});
            setChats(newChats);
            setConversation(entity.id);
        }
        deleteNewMessages(entity.id, type);
    };

    const renderFriendRequest = () => {
        if (friendRequests.length === 0) return null;
        return (
            <>
                <h4 className="fw-bold text-center pt-2">您有新的好友请求</h4>
                <div className="d-flex flex-column gap-3">
                    {friendRequests.map((user, index) => (
                        <div key={index} className="px-2 d-flex align-items-center">
                            <UserCard name={user.name}/>
                            <div className="d-flex justify-content-evenly gap-2">
                                <button className="btn btn-sm btn-success shadow"
                                        onClick={() => handleRequest(user.id, 1)}
                                ><i className="fa fa-check" aria-hidden="true"></i>
                                </button>
                                <button className="btn btn-sm btn-danger shadow"
                                        onClick={() => handleRequest(user.id, 2)}
                                ><i className="fa fa-times" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <hr className="mb-0"/>
            </>
        );
    };

    const renderNewMessages = () => {
        if (newMessages.length === 0) return (
            <>
                <h4 className="fw-bold text-center pt-2">新的消息</h4>
                <h5 className="text-center">暂无新的消息</h5>
                <hr className="mb-0"/>
            </>
        );
        else return (
            <>
                <h4 className="fw-bold text-center pt-2">新的消息</h4>
                <div className="d-flex flex-column gap-3">
                    {newMessages.map((newMessage, index) => (
                        <div
                            key={index}
                            style={{cursor: "pointer"}}
                            className="px-2 d-flex align-items-center"
                            onClick={() => {
                                console.log(newMessage.id);
                                if (newMessage.type === MessageType.single)
                                    jumpToChat(findUserById(newMessage.id), 0);
                                else
                                    jumpToChat(findGroupById(newMessage.id), 1);
                            }}
                        >
                            <UserCard name={newMessage.name}/>
                        </div>
                    ))}
                </div>
                <hr className="mb-0"/>
            </>
        );
    };

    const renderMemberList = () => {
        if (mode === 0) return null;
        return (
            <>
                <h4 className="fw-bold text-center pt-2">成员列表</h4>
                <div className="d-flex flex-column gap-3">
                    {members.map((user, index) => (
                        <div key={index} style={{cursor: "pointer"}}
                             className="px-2 d-flex align-items-center" onClick={() => {
                            jumpToChat(user, 0);
                        }}>
                            <UserCard name={user.name}/>
                        </div>
                    ))}
                </div>
                <h5 className="text-end pe-3 text-secondary">{`${members.length}/${getGroupSize(conversation)}`}</h5>
                <div className="d-grid">
                    <button className="mt-lg-5 m-2 btn btn-danger"
                            onClick={() => {
                                leaveGroup(conversation);
                            }}
                    >退出群聊
                    </button>
                </div>
                <hr className="mb-0"/>
            </>
        );
    };

    const renderAddMemberList = () => {
        if (mode === 0 || outsideUsers.length === 0) return null;
        return (
            <>
                <h4 className="fw-bold text-center pt-2">邀请更多人加入群聊</h4>
                <div className="d-flex flex-column gap-3">
                    {outsideUsers.map((user, index) => (
                        <span key={index} style={{cursor: "pointer"}}
                              className="px-2 d-flex align-items-center" onClick={async () => {
                            const code = await joinGroup(conversation, [user.id]);
                            if (code) loadMember();
                        }}>
                            <Avatar name={user.name} size={"sm"}/>
                        </span>
                    ))}
                </div>
            </>
        );
    }

    return (
        <div>
            {renderFriendRequest()}
            {renderNewMessages()}
            {renderMemberList()}
            {renderAddMemberList()}
        </div>
    );
}

export default RightBar;
