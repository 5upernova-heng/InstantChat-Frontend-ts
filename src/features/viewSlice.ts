import {Chat, Group, MessageType, TabType, User} from "/src/api/types.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type State = {
    tab: TabType
    mode: MessageType
    currentChat: Chat
    chats: Chat[]
}

const emptyUser: User = {id: -1, name: "", username: ""}
const emptyChat: Chat = {id: -1, name: "", type: MessageType.single, entity: emptyUser}

const initialState: State = {
    tab: 0,
    mode: 0,
    currentChat: emptyChat,
    chats: []
}

export const viewSlice = createSlice({
    name: "view",
    initialState,
    reducers: {
        switchTab: (state, action: PayloadAction<TabType>) => {
            return {...state, tab: action.payload}
        },
        switchMode: (state, action: PayloadAction<MessageType>) => {
            return {...state, mode: action.payload}
        },
        switchChat: (state, action: PayloadAction<Chat>) => {
            return {...state, currentChat: action.payload}
        },
        updateChats: (state, action: PayloadAction<{ friends: User[], groups: Group[] }>) => {
            const {friends, groups} = action.payload;
            const newChats: Chat[] = []
            friends.map((friend) => {
                const chat = {
                    id: friend.id,
                    type: MessageType.single,
                    name: friend.name,
                    entity: friend
                }
                newChats.push(chat)
            })
            groups.map((group) => {
                const chat = {
                    id: group.id,
                    type: MessageType.group,
                    name: group.name,
                    entity: group
                }
                newChats.push(chat)
            })
            return {...state, chats: newChats}
        }
    }
})

export const {switchTab, switchMode, switchChat, updateChats} = viewSlice.actions

export default viewSlice.reducer
