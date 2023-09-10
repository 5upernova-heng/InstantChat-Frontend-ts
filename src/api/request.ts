import {ApiResponse} from "/src/api/types.ts";
import {AppDispatch} from "/src/app/store.ts";
import {pushErrors} from "/src/features/userSlice.ts";
import axios from "axios";

axios.interceptors.response.use(
    (config) => {
        config.headers["Access-Control-Allow-Origin"] = "*";
        return config;
    },
    (error) => {
        const expectedError =
            error.response &&
            error.response.status >= 400 &&
            error.response.status < 500;
        if (!expectedError) {
            console.error(`An unexpected error occurred: ${error}`);
        }
        return Promise.reject(error);
    }
);

export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
};

export function handleResponse<T>(dispatch: AppDispatch, response: ApiResponse<T>): Promise<T> {
    const {code, data, msg} = response;
    if (code === 0) {
        dispatch(pushErrors(msg))
        return new Promise((_, reject) => {
            reject()
        })
    } else {
        return new Promise(resolve => resolve(data))
    }
}
