import userReducer from "/src/features/userSlice.ts"
import {configureStore} from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        user: userReducer,
    }
})
export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
