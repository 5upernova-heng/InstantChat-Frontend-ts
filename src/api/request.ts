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
