// 上方用于显示好友请求
// 下方用于显示成员信息

import {Action, Chat, Group, MessageType, User} from "/src/api/types.ts";
import {useAppDispatch, useAppSelector} from "/src/app/hooks.ts";
import {deleteNewMessage, fetchAllUsers, handleFriendRequest, joinGroup, leaveGroup} from "/src/features/userSlice.ts";
import {findById, getGroupMembers, getGroupSize} from "/src/features/utils.ts";
import {switchChat, switchMode, updateChats} from "/src/features/viewSlice.ts";
import Avatar from "/src/widgets/Avatar.jsx";
import UserCard from "/src/widgets/UserCard.jsx";
import {useCallback, useEffect, useState} from "react";

function RightBar() {
    const {loginAccount, token} = useAppSelector((state) => state.user.login)
    const {friends, groups, allUsers, newMessages, friendRequests} = useAppSelector(state => state.user)
    const {chats} = useAppSelector(state => state.view)
    const {mode, currentChat} = useAppSelector(state => ({...state.view}))
    const dispatch = useAppDispatch()

    const [members, setMembers] = useState<User[]>([]);
    // user that can be invited to the group
    const [outsideUsers, setOutsideUsers] = useState<User[]>([]);

    const loadMember = useCallback(async () => {
        if (mode === 0) {
            setMembers([]);
            setOutsideUsers([]);
            return;
        }
        dispatch(fetchAllUsers(token))
        const newMembers = await getGroupMembers(currentChat.id, token);
        setMembers(newMembers);
        const outside = allUsers.filter((user) => {
            const index = newMembers.findIndex((member) => member.id === user.id);
            return index === -1;
        })
        setOutsideUsers(outside);

    }, [allUsers, currentChat.id, dispatch, mode, token])
    useEffect(
        () => {
            loadMember().then();
        }, [currentChat, loadMember]
    )

    const jumpToChat = (dest: User | Group, type: MessageType) => {
        if (dest.id === loginAccount.id && type === MessageType.single)
            return;
        dispatch(switchMode(type));
        chats.map((chat) => {
            if (chat.id === dest.id) {
                dispatch(switchChat(chat));
                return
            }
        });
        const newChat: Chat = {
            id: dest.id,
            name: dest.name,
            type,
            entity: dest,
        }
        dispatch(updateChats({friends, groups}))
        dispatch(switchChat(newChat));
        dispatch(deleteNewMessage({id: dest.id, type}));
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
                                        onClick={() => dispatch(handleFriendRequest({user, action: Action.accept}))}
                                ><i className="fa fa-check" aria-hidden="true"></i>
                                </button>
                                <button className="btn btn-sm btn-danger shadow"
                                        onClick={() => dispatch(handleFriendRequest({user, action: Action.reject}))}
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
                                if (newMessage.type === MessageType.single)
                                    jumpToChat(findById(friends, newMessage.id), MessageType.single);
                                else
                                    jumpToChat(findById(groups, newMessage.id), MessageType.group);
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
                <h5 className="text-end pe-3 text-secondary">
                    {`${members.length}/${getGroupSize(groups, currentChat.id)}`}
                </h5>
                <div className="d-grid">
                    <button className="mt-lg-5 m-2 btn btn-danger"
                            onClick={() => {
                                dispatch(leaveGroup(currentChat.id));
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
                              className="px-2 d-flex align-items-center" onClick={
                            async () => {
                                dispatch(joinGroup({group: currentChat.entity as Group, members: [user.id]}));
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
