import request from "api/request";
import {ApiResponse, Message, User} from "api/types.ts";
import {apiRoot} from "config.json";

export async function sendMessage(friendId: number, message: string, token: string): Promise<ApiResponse<null>> {
    console.log("API Called: sendMessage\n", friendId, message);
    const {data} = await request.post(`${apiRoot}/friend/sendmsg`, {
        friendId,
        message,
    }, {
        headers: {
            token: token,
        }
    });
    console.log("Result of sendMessage: ", data);
    return data;
}

export async function friendHistoryMessage(friendId: number, token: string):
    Promise<ApiResponse<{ userInfo: User[], messageList: Message[] }>> {
    // console.log("API Called: friendHistoryMessage\n", friendId);
    const {data} = await request.get(`${apiRoot}/friend/historymsg`, {
        params: {
            friendId
        },
        headers: {
            token: token,
        }
    });
    // console.log("Result of friendHistoryMessage: ", data);
    return data;
}

export async function sendGroupMessage(groupId: number, message: string, token: string): Promise<ApiResponse<null>> {
    console.log("API Called: sendGroupMessage\n", groupId, message);
    const {data} = await request.post(`${apiRoot}/group/sendmsg`, {
        groupId,
        message,
    }, {
        headers: {
            token: token,
        }
    });
    console.log("Result of sendGroupMessage: ", data);
    return data;
}

export async function groupHistoryMessage(groupId: number, token: string):
    Promise<ApiResponse<{ userInfo: User[], messageList: Message[] }>> {
    // console.log("API Called: groupHistoryMessage", groupId);
    const {data} = await request.get(`${apiRoot}/group/historymsg`, {
        params: {
            groupId
        },
        headers: {
            token: token,
        }
    });
    // console.log("Result of groupHistoryMessage: ", data);
    return data;
}

export async function newFriendMessages(time: string, token: string): Promise<ApiResponse<Message[]>> {
    // console.log("API Called: newFriendMessages", time);
    const {data} = await request.get(`${apiRoot}/friend/newMessage`, {
        params: {
            time,
        },
        headers: {
            token: token,
        }
    });
    // console.log("Result of newFriendMessages:", data);
    return data;

}

export async function newGroupMessages(time: string, token: string): Promise<ApiResponse<Message[]>> {
    // console.log("API Called: newGroupMessages", time);
    const {data} = await request.get(`${apiRoot}/group/newMessage`, {
        params: {
            time,
        },
        headers: {
            token: token,
        }
    });
    // console.log("Result of newGroupMessages:", data);
    return data;
}
