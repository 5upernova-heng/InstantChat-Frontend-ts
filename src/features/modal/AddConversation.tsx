import {friendRequest} from "/src/api/friendApi";
import {Group, TabType, User} from "/src/api/types.ts";
import {useChatContext, useLoginContext, useViewContext} from "/src/context/hooks.ts";
import CreateGroupForm from "/src/features/modal/CreateGroupForm.tsx";
import List from "/src/widgets/List.tsx";
import UserCard from "/src/widgets/UserCard.tsx";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";

function AddConversation() {
    const [users, setUsers] = useState<User[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);

    const {tab, setTab} = useViewContext()
    const {token, isLogin, loginAccount} = useLoginContext();
    const {friends, groups: addedGroups, joinGroup, allUsers, allGroups} = useChatContext();

    const tabs = ["添加好友", "添加群聊", "创建群聊"];

    useEffect(() => {
        if (isLogin) {
            loadUsers();
        }
    }, [isLogin, allUsers])

    useEffect(() => {
        if (isLogin) {
            loadGroups();
        }
    }, [isLogin, allGroups])

    function loadUsers() {
        // delete self
        const filteredUsers = allUsers.filter((user) => friends.findIndex(
            (friend) => user.id === friend.id || user.id === loginAccount.id) === -1)
        setUsers(filteredUsers);
    }

    function loadGroups() {
        const filterGroups = allGroups.filter((group) => addedGroups.findIndex(
            (addedGroup) => addedGroup.id === group.id) === -1)
        setGroups(filterGroups);
    }

    async function addFriend(id: number) {
        const {code} = await friendRequest(id, token);
        if (code) toast("请求发送成功");
    }

    function renderTabs() {
        return (
            <div className="d-flex px-2 gap-3 align-items-end">
                {
                    tabs.map(
                        (t, index) => {
                            const selected = tab === index;
                            return (
                                <button key={index}
                                        className={`btn border-bottom-0 rounded-bottom-0 rounded-top p-2 ${selected && "border"}`}
                                        onClick={() => setTab(index)}>
                                    <p className={`mb-0 ${selected && "text-primary"}`}>
                                        {t}
                                    </p>
                                </button>);
                        })
                }
            </div>

        )
    }

    function renderUser(user: User, index: number) {
        return (
            <div key={index} className="px-3 d-flex align-items-center">
                <UserCard name={user.name}/>
                <button className="btn btn-sm btn-primary"
                        onClick={() => {
                            addFriend(user.id);
                        }}
                >
                    发送请求
                </button>
            </div>)
    }

    function renderGroup(group: Group, index: number) {
        return (
            <div key={index} className="px-3 d-flex align-items-center">
                <UserCard name={group.name}/>
                <button className="btn btn-sm btn-primary"
                        onClick={() => {
                            joinGroup(group.id, [loginAccount.id]);
                        }}>
                    加入群聊
                </button>
            </div>
        )
    }

    function render() {
        if (tab === TabType.addFriends)
            return <List title={"好友"} data={users} renderMethod={renderUser}/>
        if (tab === TabType.joinGroup)
            return <List title={"群聊"} data={groups} renderMethod={renderGroup}/>
        if (tab === TabType.createGroup)
            return <CreateGroupForm/>
        return <></>
    }


    return (
        <div>
            {renderTabs()}
            <div className={tab < 2 ? "border" : "border-top"}>
                {render()}
            </div>
        </div>
    )
}

export default AddConversation;
