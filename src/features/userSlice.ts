import {getRequest, handleRequestApi, listAllUsers, listFriends} from "/src/api/friendApi.ts";
import {addMember, createGroup, leaveGroupApi, listAllGroups, listGroups} from "/src/api/groupApi.ts";
import {loginApi} from "/src/api/loginApi.ts";
import {friendHistoryMessage, groupHistoryMessage, newFriendMessages, newGroupMessages} from "/src/api/messageApi.ts";
import {handleResponse} from "/src/api/request.ts";
import {Account, Action, Group, Message, MessageType, Notification, User} from "/src/api/types.ts";
import {AppDispatch, RootState} from "/src/app/store.ts";
import {formatDate} from "/src/features/utils.ts";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


type LoginState = {
    token: string
    isLogin: boolean
    pending: boolean
    loginAccount: User
    lastViewMessageTime: string
}

type State = {
    login: LoginState
    errors: string[]
    friends: User[]
    groups: Group[]
    allUsers: User[],
    allGroups: Group[],
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
        lastViewMessageTime: "1970-01-01 00:00:00"
    },
    errors: [],
    friends: [],
    groups: [],
    allUsers: [],
    allGroups: [],
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

export const fetchFriends = createAsyncThunk<User[], void, { state: RootState, dispatch: AppDispatch }>(
    'user/fetchFriends',
    async (_, thunkAPI) => {
        const {token} = thunkAPI.getState().user.login;
        const response = await listFriends(token);
        return await handleResponse(thunkAPI.dispatch, response)
    }
)

export const fetchGroups = createAsyncThunk<Group[], void, { state: RootState, dispatch: AppDispatch }>(
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
        const {lastViewMessageTime, token} = thunkAPI.getState().user.login
        const friendResponse = await newFriendMessages(lastViewMessageTime, token);
        const groupResponse = await newGroupMessages(lastViewMessageTime, token);
        return Promise.all([
                handleResponse(thunkAPI.dispatch, friendResponse),
                handleResponse(thunkAPI.dispatch, groupResponse)
            ]
        )
    }
)

export const fetchFriendRequests = createAsyncThunk<User[], void, { state: RootState, dispatch: AppDispatch }>(
    'user/fetchFriendRequest',
    async (_, thunkAPI) => {
        const {token} = thunkAPI.getState().user.login;
        const response = await getRequest(token);
        return handleResponse(thunkAPI.dispatch, response)

    }
)

export const handleFriendRequest = createAsyncThunk<void, {
    user: User, action: Action
}, { state: RootState, dispatch: AppDispatch }>(
    'user/handleFriendRequest',
    async ({user, action}, thunkAPI) => {
        const response = await handleRequestApi(user.id, action, thunkAPI.getState().user.login.token);
        await handleResponse(thunkAPI.dispatch, response)
        thunkAPI.dispatch(fetchFriends)
    }
)

export const joinGroup = createAsyncThunk<void,
    { group: Group, members: number[] },
    { state: RootState, dispatch: AppDispatch }>(
    'user/joinGroup',
    async ({group, members}, thunkAPI) => {
        const token = thunkAPI.getState().user.login.token
        const response = await addMember(group.id, members, token);
        await handleResponse(thunkAPI.dispatch, response)
        thunkAPI.dispatch(fetchGroups())
    }
)

export const leaveGroup = createAsyncThunk<void, number, { state: RootState, dispatch: AppDispatch }>(
    'user/leaveGroup',
    async (groupId, thunkAPI) => {
        const token = thunkAPI.getState().user.login.token;
        const response = await leaveGroupApi(groupId, token);
        await handleResponse(thunkAPI.dispatch, response)
        thunkAPI.dispatch(fetchGroups())
    }
)

export const createNewGroup = createAsyncThunk<void, Group, { state: RootState, dispatch: AppDispatch }>(
    'user/createNewGroup',
    async (group, thunkAPI) => {
        const token = thunkAPI.getState().user.login.token;
        const response = await createGroup(group, token);
        await handleResponse(thunkAPI.dispatch, response)
        thunkAPI.dispatch(fetchGroups())
        thunkAPI.dispatch(fetchAllUsers(token))
    }
)

export const fetchAllUsers = createAsyncThunk<User[], string, { dispatch: AppDispatch }>(
    'user/fetchAllUsers',
    async (token, thunkAPI) => {
        const response = await listAllUsers(token);
        return handleResponse(thunkAPI.dispatch, response)
    }
)

export const fetchAllGroups = createAsyncThunk<Group[], string, { dispatch: AppDispatch }>(
    'user/fetchAllGroups',
    async (token, thunkAPI) => {
        const response = await listAllGroups(token);
        return handleResponse(thunkAPI.dispatch, response)
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
        deleteNewMessage: (state, action: PayloadAction<{ id: number, type: MessageType }>) => {
            const {id, type} = action.payload
            const filtered = state.newMessages.filter((message) => !(message.id === id && message.type === type))
            return {...state, newMessages: filtered}
        }
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
                        lastViewMessageTime: loginTime
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
            .addCase(fetchFriendRequests.fulfilled, (state, action) => {
                return {...state, friendRequests: action.payload}
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                return {...state, allUsers: action.payload}
            })
            .addCase(fetchAllGroups.fulfilled, (state, action) => {
                return {...state, allGroups: action.payload}
            })
    }
})

export const {pushErrors, quitLogin, deleteNewMessage} = userSlice.actions
export default userSlice.reducer

