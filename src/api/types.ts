export type User = {
    username: string
    password?: string
    id: string
    name: string
}

export type Group = {
    id: number
    name: string
    level: GroupLevel
    totalMembers: number
}

export type Message = {
    id1: number // sender
    id2?: number // receiver, empty if it's a group message
    messageText: string
    messageTime: string
}

export type ApiResponse<DataType> = {
    code: number
    msg: string
    data: DataType
}

export enum GroupLevel { Tiny, Small, Normal, Large, Tremendous, }

export enum Action {accept = 1, reject}
