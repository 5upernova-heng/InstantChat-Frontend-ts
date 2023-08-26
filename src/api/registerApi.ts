import request from "/src/api/request";
import {ApiResponse, RegisterForm} from "/src/api/types.ts";
import {apiRoot} from "/src/config.json";

export async function register(account: RegisterForm): Promise<ApiResponse<null>> {
    const {username, name, password} = account;
    console.log("API Called: register\n", account);
    const {data} = await request.post(`${apiRoot}/register`, {
        username,
        name,
        password,
    });
    console.log("Result of register: ", data);
    return data;
}
