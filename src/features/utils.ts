import {getMembers} from "/src/api/groupApi.ts";
import {Group} from "/src/api/types.ts";
import Style from "/src/style.ts";
import {toast} from "react-toastify";

export function padTo2Digits(num: string | number) {
    return num.toString().padStart(2, '0');
}

export function formatDate(date: Date) {
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-') +
        ' ' +
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
        ].join(':')
    );
}

export function findById<T extends { id: number }>(array: T[], id: number): T {
    const result = array.find((e) => e.id === id)
    if (result)
        return result
    else
        throw new Error(`Can not find ${id} in array`)
}

export async function getGroupMembers(id: number, token: string) {
    const {code, msg, data} = await getMembers(id, token);
    if (code)
        return data;
    else {
        toast(msg);
        throw new Error(`Can not find members of by groupId ${id}`)
    }
}

export function getGroupSize(groups: Group[], groupId: number): number {
    const group = findById(groups, groupId)
    return Style.groupSize[group.level]
}
