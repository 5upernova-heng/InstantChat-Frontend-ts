import request from "/src/api/request";
import {Account, ApiResponse, User} from "/src/api/types.ts";
import {apiRoot} from "/src/config.json";


export async function loginApi(account: Account): Promise<ApiResponse<{ user: User, jwt: string }>> {
    const {username, password} = account;
    console.log("API Called: loginApi\n", account);
    const {data} = await request.post(`${apiRoot}/login`, {
        username,
        password,
    });
    console.log("Result of loginApi: ", data);
    return data;
}
