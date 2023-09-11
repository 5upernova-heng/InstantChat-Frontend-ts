import {listFriends} from "/src/api/friendApi.ts";
import {listGroups} from "/src/api/groupApi.ts";
import {loginApi} from "/src/api/loginApi.ts";
import {friendHistoryMessage, groupHistoryMessage, newFriendMessages, newGroupMessages} from "/src/api/messageApi.ts";
import {handleResponse} from "/src/api/request.ts";
import {Account, Group, Message, MessageType, Notification, User} from "/src/api/types.ts";
import {AppDispatch, RootState} from "/src/app/store.ts";
import {formatDate} from "/src/features/utils.ts";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


type LoginState = {
    token: string
    isLogin: boolean
    pending: boolean
    loginAccount: User
    lastLoginTime: string
}

type State = {
    login: LoginState
    errors: string[]
    friends: User[]
    groups: Group[]
    messages: Message[]
    newMessages: Notification[]
    friendRequests: User[]
}

const initialState: State = {
    login: {
        isLogin: false,
        token: "",
        pending: false,
        loginAccount: {username: "", id: -1, name: ""},
        lastLoginTime: "1970-01-01 00:00:00"
    },
    errors: [],
    friends: [],
    groups: [],
    messages: [],
    newMessages: [],
    friendRequests: [],
}

export const tryLogin = createAsyncThunk<{
    response: { user: User, jwt: string },
    loginTime: string
}, Account, { dispatch: AppDispatch }>(
    'user/tryLogin',
    async (account, thunkAPI) => {
        const response = await loginApi(account)
        return {
            response: await handleResponse(thunkAPI.dispatch, response),
            loginTime: formatDate(new Date())
        }

    })

export const fetchFriends = createAsyncThunk<User[], string, { state: RootState, dispatch: AppDispatch }>(
    'user/fetchFriends',
    async (_, thunkAPI) => {
        const {token} = thunkAPI.getState().user.login;
        const response = await listFriends(token);
        return await handleResponse(thunkAPI.dispatch, response)
    }
)

export const fetchGroups = createAsyncThunk<Group[], string, { state: RootState, dispatch: AppDispatch }>(
    'user/fetchGroups',
    async (_, thunkAPI) => {
        const {token} = thunkAPI.getState().user.login;
        const response = await listGroups(token);
        return await handleResponse(thunkAPI.dispatch, response)
    }
)

export const fetchHistoryFriendMessages = createAsyncThunk<{ userInfo: User[], messageList: Message[] },
    number,
    { state: RootState, dispatch: AppDispatch }>(
    'user/fetchHistoryFriendMessages',
    async (friendId, thunkAPI) => {
        const {token} = thunkAPI.getState().user.login;
        const response = await friendHistoryMessage(friendId, token);
        return await handleResponse(thunkAPI.dispatch, response)
    }
)

export const fetchHistoryGroupMessages = createAsyncThunk<{ userInfo: User[], messageList: Message[] },
    number,
    { state: RootState, dispatch: AppDispatch }>(
    'user/fetchHistoryGroupMessages',
    async (groupId, thunkAPI) => {
        const {token} = thunkAPI.getState().user.login;
        const response = await groupHistoryMessage(groupId, token)
        return await handleResponse(thunkAPI.dispatch, response)
    }
)

export const fetchNewMessages = createAsyncThunk<Message[][], void,
    { state: RootState, dispatch: AppDispatch }>(
    'user/fetchNewMessages',
    async (_, thunkAPI) => {
        const {lastLoginTime, token} = thunkAPI.getState().user.login
        const friendResponse = await newFriendMessages(lastLoginTime, token);
        const groupResponse = await newGroupMessages(lastLoginTime, token);
        return Promise.all([
                handleResponse(thunkAPI.dispatch, friendResponse),
                handleResponse(thunkAPI.dispatch, groupResponse)
            ]
        )
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        pushErrors: (state, action: PayloadAction<string>) => {
            state.errors.push(action.payload);
        },
        quitLogin: (state) => ({
            ...state,
            login: {
                ...state.login,
                loginAccount: initialState.login.loginAccount,
                token: "",
                isLogin: false,
            }
        }),
    },
    extraReducers: builder => {
        builder
            .addCase(tryLogin.pending, (state) => {
                return {
                    ...state,
                    login: {
                        ...state.login,
                        pending: true
                    }
                }
            })
            .addCase(tryLogin.fulfilled, (state, action) => {
                const {response, loginTime} = action.payload
                const {user, jwt} = response
                return {
                    ...state,
                    login: {
                        ...state.login,
                        pending: false,
                        loginAccount: user,
                        token: jwt,
                        isLogin: true,
                        lastLoginTime: loginTime
                    }
                }
            })
            .addCase(fetchFriends.fulfilled, (state, action) => {
                return {...state, friends: action.payload}
            })
            .addCase(fetchGroups.fulfilled, (state, action) => {
                return {...state, groups: action.payload}
            })
            .addCase(fetchHistoryFriendMessages.fulfilled, (state, action) => {
                return {...state, messages: action.payload.messageList}
            })
            .addCase(fetchHistoryGroupMessages.fulfilled, (state, action) => {
                return {...state, messages: action.payload.messageList}
            })
            .addCase(fetchNewMessages.fulfilled, (state, action) => {
                // Merge two kinds of messages into one by time order
                const messages: Notification[] = action.payload.flat()
                    .sort((a, b) => {
                        const timeA = new Date(a.messageTime).getTime();
                        const timeB = new Date(b.messageTime).getTime();
                        return timeB - timeA;
                    })
                    .map((message) => {
                        const {id1, type, messageText, messageTime} = message
                        let sender;
                        if (type === MessageType.single)
                            sender = state.friends.find((user) => user.id === id1)
                        if (message.type === MessageType.group)
                            sender = state.groups.find((group) => group.id === message.id1)
                        if (sender && type) {
                            return {
                                id: id1,
                                messageText,
                                type,
                                messageTime,
                                name: sender.name
                            }
                        } else {
                            throw new Error(`Can not find ${id1}`)
                        }
                    })
                return {...state, newMessages: messages}
            })
    }
})

export const {pushErrors, quitLogin} = userSlice.actions
export default userSlice.reducer

