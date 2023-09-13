import {MessageType, TabType} from "/src/api/types.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type State = {
    tab: TabType
    mode: MessageType
    conversation: number
}

const initialState: State = {
    tab: 0,
    mode: 0,
    conversation: -1
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
        switchConversation: (state, action: PayloadAction<number>) => {
            return {...state, conversation: action.payload}
        }
    }
})

export const {switchTab, switchMode, switchConversation} = viewSlice.actions

export default viewSlice.reducer
