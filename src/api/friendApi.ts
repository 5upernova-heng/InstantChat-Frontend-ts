import request from "api/request";
import {Action, ApiResponse, User} from "api/types.ts";
import {apiRoot} from "config.json";

export async function friendRequest(friendId: number, token: string): Promise<ApiResponse<null>> {
    console.log("API Called: friendRequest\n", friendId);
    const {data} = await request.post(`${apiRoot}/friend/request`, {
        friendId,
    }, {
        headers: {
            token: token,
        }
    });
    console.log("Result of friendRequest: ", data);
    return data;
}

export async function getRequest(token: string): Promise<ApiResponse<User[]>> {
    // console.log("API Called: getRequest\n");
    const {data} = await request.get(`${apiRoot}/friend/getRequest`, {
        headers: {
            token: token,
        }
    });
    // console.log("Result of getRequest: ", data);
    return data;
}


// action: 1 - accept; 2 - reject
export async function handleRequestApi(friendId: number, action: Action, token: string): Promise<ApiResponse<null>> {
    console.log("API Called: acceptRequest", friendId, action);
    const {data} = await request.post(`${apiRoot}/friend/accept`, {
        friendId,
        action,
    }, {
        headers: {
            token: token,
        }
    });
    console.log("Result of acceptRequest: ", data);
    return data;
}

export async function listFriends(token: string): Promise<ApiResponse<User[]>> {
    console.log("API Called: listFriends\n");
    const {data} = await request.get(`${apiRoot}/friend/list`, {
        headers: {
            token: token,
        }
    });
    console.log("Result of listFriends: ", data);
    return data;
}


export async function listAllUsers(token: string): Promise<ApiResponse<User[]>> {
    console.log("API Called: listAllUsers\n");
    const {data} = await request.get(`${apiRoot}/friend/listall`, {
        headers: {
            token: token
        }
    });
    console.log("Result of listAllUsers:", data);
    return data;
}

