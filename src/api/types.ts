export type Account = {
    username: string
    password: string
}

export type RegisterForm = {
    username: string
    name: string
    password: string
    passwordConfirm: string
}

export type User = {
    username: string
    password?: string
    id: number
    name: string
}

export type Group = {
    id: number
    name: string
    level: GroupLevel
    members: number[]
    totalMembers: number
}

export enum MessageType {single, group}

export enum TabType {addFriends, joinGroup, createGroup}

export type Message = {
    id1: number // sender
    id2: number // receiver, empty if it's a group message
    type?: MessageType
    messageText: string
    messageTime: string
}

export type Notification = {
    id: number // sender
    name: string
    type: MessageType
    messageText: string
    messageTime: string
}

export type Chat = {
    id: number
    type: MessageType
    name: string
    entity: User | Group
}

export type ApiResponse<DataType> = {
    code: number
    msg: string
    data: DataType
}

export enum GroupLevel { Tiny, Small, Normal, Large, Tremendous, }

export enum Action {accept = 1, reject}
