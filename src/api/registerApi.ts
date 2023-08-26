import request from "api/request";
import {Account} from "api/types.ts";
import {apiRoot} from "config.json";

export async function register(account: Account) {
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
