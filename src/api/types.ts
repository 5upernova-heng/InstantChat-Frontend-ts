export type Account = {
    username: string
    password: string
    name?: string
}

export enum GroupLevel { Tiny, Small, Normal, Large, Tremendous, }

export enum Action {accept = 1, reject}
