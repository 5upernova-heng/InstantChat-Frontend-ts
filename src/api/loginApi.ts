import request from "/src/api/request";
import {Account, ApiResponse, User} from "/src/api/types.ts";
import {apiRoot} from "/src/config.json";


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
