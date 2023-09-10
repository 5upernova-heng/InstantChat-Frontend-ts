import {listFriends} from "/src/api/friendApi.ts";
import {listGroups} from "/src/api/groupApi.ts";
import {loginApi} from "/src/api/loginApi.ts";
import {friendHistoryMessage, groupHistoryMessage} from "/src/api/messageApi.ts";
import {handleResponse} from "/src/api/request.ts";
import {Account, Group, Message, NewMessage, User} from "/src/api/types.ts";
import {AppDispatch} from "/src/app/store.ts";
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
    newMessages: NewMessage[]
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

export const fetchFriends = createAsyncThunk<User[], string, { dispatch: AppDispatch }>(
    'user/fetchFriends',
    async (token, thunkAPI) => {
        const response = await listFriends(token);
        return await handleResponse(thunkAPI.dispatch, response)
    }
)

export const fetchGroups = createAsyncThunk<Group[], string, { dispatch: AppDispatch }>(
    'user/fetchGroups',
    async (token, thunkAPI) => {
        const response = await listGroups(token)
        return await handleResponse(thunkAPI.dispatch, response);
    }
)

export const fetchHistoryFriendMessages = createAsyncThunk<{ userInfo: User[], messageList: Message[] }, {
    friendId: number,
    token: string
}, { dispatch: AppDispatch }>(
    'user/fetchHistoryFriendMessages',
    async ({friendId, token}, thunkAPI) => {
        const response = await friendHistoryMessage(friendId, token);
        return await handleResponse(thunkAPI.dispatch, response)
    }
)

export const fetchHistoryGroupMessages = createAsyncThunk<{ userInfo: User[], messageList: Message[] }, {
    groupId: number,
    token: string
}, { dispatch: AppDispatch }>(
    'user/fetchHistoryGroupMessages',
    async ({groupId, token}, thunkAPI) => {
        const response = await groupHistoryMessage(groupId, token)
        return await handleResponse(thunkAPI.dispatch, response)
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
                const newState = structuredClone<State>(state)
                newState.login.pending = true
                return newState
            })
            .addCase(tryLogin.fulfilled, (state, action) => {
                const newState = structuredClone<State>(state)
                const {response, loginTime} = action.payload
                const {user, jwt} = response;
                newState.login = {
                    ...state.login,
                    pending: false,
                    loginAccount: user,
                    token: jwt,
                    isLogin: true,
                    lastLoginTime: loginTime
                }
                return newState
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
    }
})

export const {pushErrors, quitLogin} = userSlice.actions
export default userSlice.reducer

