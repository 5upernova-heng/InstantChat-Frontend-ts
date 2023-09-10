import {User} from "/src/api/types.ts";
import {createSlice} from "@reduxjs/toolkit";

type State = {
    value: User[]
}

const initialState: State = {
    value: []
}

export const friendSlice = createSlice({
    name: 'friends',
    initialState,
    reducers: {
        fetchFromServer: () => {
        },
    }
})
