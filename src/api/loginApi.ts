import request from "api/request";
import {Account, ApiResponse, User} from "api/types.ts";
import {apiRoot} from "config.json";


export async function login(account: Account): Promise<ApiResponse<{ user: User, jwt: string }>> {
    const {username, password} = account;
    console.log("API Called: login\n", account);
    const {data} = await request.post(`${apiRoot}/login`, {
        username,
        password,
    });
    console.log("Result of login: ", data);
    return data;
}
