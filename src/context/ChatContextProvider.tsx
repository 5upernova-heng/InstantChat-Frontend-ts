import {Action, Group, GroupLevel, Message, MessageType, User} from "api/types.ts";
import {useLoginContext, useTimeContext} from "context/hooks.ts";
import {createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import {toast} from "react-toastify";
import {getRequest, handleRequestApi, listAllUsers, listFriends} from "../api/friendApi.js";
import {addMember, creatGroup, getMembers, leaveGroupApi, listAllGroups, listGroups} from "../api/groupApi.js";
import {friendHistoryMessage, groupHistoryMessage, newFriendMessages, newGroupMessages} from "../api/messageApi.js";
import STYLE from "../style.js";

type Props = {
    children: ReactNode
}

type NewMessage = {
    id: number // sender
    name: string
    type: MessageType
    messageText: string
    messageTime: string
}

export type ChatContextType = {
    // data
    friends: User[]
    groups: Group[]
    allUsers: User[]
    allGroups: Group[]
    messages: Message[]
    newMessages: NewMessage[]
    friendRequests: User[]
    loadMessages: () => Promise<void>
    findUserById: (id: number) => User
    findGroupById: (id: number) => Group
    findMembersById: (id: number) => Promise<User[]>
    handleRequest: (friendId: number, action: Action) => Promise<void>
    deleteNewMessages: (id: number, type: MessageType) => void
    // submit
    newGroup: Group
    changeSubmitGroup: (update: Partial<Group>) => void
    submitNewGroup: () => Promise<void>
    joinGroup: (groupId: number, members: number[]) => Promise<number>
    leaveGroup: (groupId: number) => Promise<void>
    getGroupSize: (groupId: number) => number
    // conversation
    mode: MessageType
    setMode: Dispatch<SetStateAction<MessageType>>
    conversation: number
    setConversation: Dispatch<SetStateAction<number>>
    chats: Array<User | Group>
    setChats: Dispatch<SetStateAction<Array<User | Group>>>
}


export const ChatContext = createContext<ChatContextType | null>(null);

function ChatContextProvider({children}: Props) {
    const emptyGroup: Group = {name: "", level: GroupLevel.Tiny, members: [], totalMembers: 0, id: -1};
    const {isLogin, loginAccount, token} = useLoginContext();
    const {formatDate, lastMsgTime, setLastMsgTime} = useTimeContext()
    const {id: userId} = loginAccount;

    // data
    const [friends, setFriends] = useState<User[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [allGroups, setAllGroups] = useState<Group[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessages, setNewMessages] = useState<NewMessage[]>([]);
    const [chats, setChats] = useState<Array<User | Group>>([]);
    const [friendRequests, setFriendRequests] = useState<User[]>([]);

    // conversation
    // which conversation should show on the page
    // Its value equals to the id of the user/group
    /*
    Always set mode before conversation.
     */
    const [conversation, setConversation] = useState<number>(-1);
    // 0: single user; 1. group
    const [mode, setMode] = useState<MessageType>(0);

    async function loadAllUsers() {
        const {code, data} = await listAllUsers(token);
        if (code === 1) setAllUsers(data);
    }

    async function loadAllGroups() {
        const {code, data} = await listAllGroups(token);
        if (code === 1) setAllGroups(data);
    }

    async function loadFriends() {
        const {code, data, msg} = await listFriends(token);
        if (code)
            setFriends(data);
        else
            toast(msg);
    }

    async function loadGroups() {
        const {code, data, msg} = await listGroups(token);
        if (code)
            setGroups(data);
        else
            toast(msg)
    }

    async function loadMessages() {
        if (conversation === -1) return;
        if (mode === 0) {
            // user
            const {code, data, msg} = await friendHistoryMessage(conversation, token);
            if (code) {
                setMessages(data['messageList']);
            } else {
                toast(msg);
            }
        }
        if (mode === 1) {
            // group
            const {code, data, msg} = await groupHistoryMessage(conversation, token);
            if (code) {
                setMessages(data['messageList']);
            } else {
                toast(msg);
            }
        }
    }

    async function loadFriendNewMessages() {
        const {code, data, msg} = await newFriendMessages(lastMsgTime, token);
        const newMsgTmp = newMessages;
        const existId: number[] = [];
        newMsgTmp.map((newMsg) => {
            if (newMsg.type === 0)
                existId.push(newMsg.id);
        })

        if (code) {
            data.map((friendMessage) => {
                    if (friendMessage.id1 !== loginAccount.id
                        && friendMessage.id1 !== conversation
                        && !existId.includes(friendMessage.id1)) {
                        newMsgTmp.push(
                            {
                                id: friendMessage.id1,
                                messageText: friendMessage.messageText,
                                type: MessageType.single,
                                messageTime: friendMessage.messageTime,
                                name: findUserById(friendMessage.id1)?.name,
                            }
                        )
                        existId.push(friendMessage.id1);
                    }
                }
            )
            setNewMessages(newMsgTmp);
        } else {
            toast(msg);
        }
    }

    async function loadGroupNewMessages() {
        const {code, data, msg} = await newGroupMessages(lastMsgTime, token);
        const newMsgTmp = newMessages;
        const existId: number[] = [];
        newMsgTmp.map((newMsg => {
            if (newMsg.type === 1)
                existId.push(newMsg.id);
        }))
        if (code) {
            data.map((GroupMessage) => {
                    if (GroupMessage.id2 !== loginAccount.id && GroupMessage.id1 !== conversation && !existId.includes(GroupMessage.id1)) {
                        newMsgTmp.push(
                            {
                                id: GroupMessage.id1,
                                messageText: GroupMessage.messageText,
                                type: MessageType.group,
                                messageTime: GroupMessage.messageTime,
                                name: findGroupById(GroupMessage.id1).name,
                            }
                        )
                        existId.push(GroupMessage.id1);
                    }
                }
            )
            setNewMessages(newMsgTmp);
        } else {
            toast(msg);
        }
    }

    function deleteNewMessages(id: number, type: MessageType) {
        const nowMsgTmp = newMessages;
        const newMsgTmp: NewMessage[] = [];
        nowMsgTmp.map((newMsg) => {
            if (newMsg.id !== id || newMsg.type !== type)
                newMsgTmp.push(newMsg);
            else
                setLastMsgTime(formatDate(new Date(newMsg.messageTime)));
        })
        setNewMessages(newMsgTmp);
    }

    // 定时任务
    async function fetchFriendRequest() {
        if (!isLogin) return;
        const {code, data} = await getRequest(token);
        if (code) {
            setFriendRequests(data)
        }
    }

    async function loadAllData() {
        await loadFriends();
        await loadGroups();
        await loadAllUsers();
        await loadAllGroups();
    }

    useEffect(() => {
        if (isLogin) {
            loadAllData().then(
                () => {
                    changeSubmitGroup({members: [userId]});
                    setMode(0);
                    // by default is the first friend;
                }
            )
        }
    }, [isLogin])

    useEffect(() => {
        loadMessages()
    }, [conversation])

    useEffect(() => {
        const interval = setInterval(() => {
            if (isLogin) {
                fetchFriendRequest();
                // loadMessages();
                loadFriendNewMessages();
                loadGroupNewMessages();
                console.log(newMessages);
                console.log("T");
            }
        }, 3000)
        return () => {
            clearInterval(interval);
        }
    })

    // submit
    const [newGroup, setNewGroup] = useState<Group>(emptyGroup);

    function changeSubmitGroup(updates: Partial<Group>) {
        const newData = {...newGroup, ...updates} as Group
        setNewGroup(newData);
    }

    async function submitNewGroup() {
        if (newGroup.name.trim() === "") {
            toast("群聊名称不能为空");
            return;
        }
        const {name, level, members} = newGroup
        const {code, msg} = await creatGroup(name, level, members, token);
        toast(msg);
        if (code) {
            await loadAllGroups()
            await loadGroups()
        }
    }

    async function handleRequest(friendId: number, action: Action) {
        const {code, msg} = await handleRequestApi(friendId, action, token);
        if (code) {
            toast("操作成功", {autoClose: 1000});
            await fetchFriendRequest();
            await loadFriends();
        } else {
            toast(msg);
        }
    }

    async function joinGroup(groupId: number, members: number[]) {
        const {code, msg} = await addMember(groupId, members, token);
        if (code) {
            toast(msg);
            await loadGroups();
            await loadAllGroups();
            return code
        } else {
            throw new Error(`Can not join group ${groupId}`)
        }
    }

    async function leaveGroup(groupId: number) {
        const {code, msg} = await leaveGroupApi(groupId, token);
        if (code) {
            toast(msg);
            setMode(0);
            setConversation(-1);
            loadGroups().then(
                () => loadAllGroups()
            );
        }
    }


    // utils
    function findUserById(id: number) {
        const result = allUsers.find((user) => user.id === id);
        if (result)
            return result
        else
            throw new Error(`Can not find ${id} in group`)
    }

    function findGroupById(id: number) {
        const result = allGroups.find((group) => group.id === id);
        if (result)
            return result
        else
            throw new Error(`Can not find ${id} in group`)
    }

    function getGroupSize(id: number) {
        const group = findGroupById(id);
        return STYLE.groupSize[group.level];
    }

    async function findMembersById(id: number) {
        const {code, msg, data} = await getMembers(id, token);
        if (code)
            return data;
        else {
            toast(msg);
            throw new Error(`Can not find members of by groupId ${id}`)
        }
    }


    return <ChatContext.Provider
        value={{
            // data
            friends,
            groups,
            allUsers,
            allGroups,
            messages,
            newMessages,
            friendRequests,
            loadMessages,
            findUserById,
            findGroupById,
            findMembersById,
            handleRequest,
            deleteNewMessages,
            // submit
            newGroup,
            changeSubmitGroup,
            submitNewGroup,
            joinGroup,
            leaveGroup,
            getGroupSize,
            // conversation
            mode,
            setMode,
            conversation,
            setConversation,
            chats,
            setChats,
        }}>
        {children}
    </ChatContext.Provider>
}

export default ChatContextProvider;
