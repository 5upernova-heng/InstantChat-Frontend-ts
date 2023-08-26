import request from "api/request";
import {Account} from "api/types.ts";
import {apiRoot} from "config.json";


export async function login(account: Account) {
    const {username, password} = account;
    console.log("API Called: login\n", account);
    const {data} = await request.post(`${apiRoot}/login`, {
        username,
        password,
    });
    console.log("Result of login: ", data);
    return data;
}
