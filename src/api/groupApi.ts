import request from "api/request";
import {ApiResponse, Group, GroupLevel, User} from "api/types.ts";
import {apiRoot} from "config.json";


export async function creatGroup(groupname: string, level: GroupLevel, members: number[], token: string):
    Promise<ApiResponse<null>> {
    console.log("API Called: creatGroup\n", groupname, level, members);
    const {data} = await request.post(`${apiRoot}/group/create`, {
        groupname,
        level,
        members,
    }, {
        headers: {
            token: token,
        }
    });
    console.log("Result of creatGroup: ", data);
    return data;
}

export async function listGroups(token: string): Promise<ApiResponse<Group[]>> {
    console.log("API Called: listGroups\n");
    const {data} = await request.get(`${apiRoot}/group/list`, {
        headers: {
            token: token,
        },
    });
    console.log("Result of listGroups: ", data);
    return data;
}

export async function addMember(groupId: number, members: number[], token: string): Promise<ApiResponse<null>> {
    console.log("API Called: addMember\n", groupId, members);
    const {data} = await request.post(`${apiRoot}/group/addmember`, {
        groupId,
        members,
    }, {
        headers: {
            token: token,
        }
    });
    console.log("Result of addMember: ", data);
    return data;
}

export async function getMembers(groupId: number, token: string): Promise<ApiResponse<User[]>> {
    console.log("API Called: getMembers\n", groupId);
    const {data} = await request.get(`${apiRoot}/group/members`, {
        params: {groupId},
        headers: {
            token: token,
        }
    });
    console.log("Result of getMembers: ", data);
    return data;
}

export async function leaveGroupApi(groupId: number, token: string): Promise<ApiResponse<null>> {
    console.log("API Called: leaveGroup\n", groupId);
    const {data} = await request.post(`${apiRoot}/group/leave`, {
        groupId,
    }, {
        headers: {
            token: token,
        }
    });
    console.log("Result of leaveGroup: ", data);
    return data;
}

export async function listAllGroups(token: string): Promise<ApiResponse<Group[]>> {
    console.log("API Called: listAllGroups\n");
    const {data} = await request.get(`${apiRoot}/group/listall`, {
        headers: {
            token: token,
        }
    });
    console.log("Result of listAllGroups: ", data);
    return data;
}
