import {ChatContext, ChatContextType} from "context/ChatContextProvider.tsx";
import {LoginContext, LoginContextType} from "context/LoginContextProvider.tsx";
import {TimeContext, TimeContextType} from "context/TimeContextProvider.tsx";
import {useContext} from "react";

export function useTimeContext(): TimeContextType {
    const context = useContext(TimeContext);
    if (!context) {
        throw new Error('useTimeContext must be used within TimeContextProvider')
    }
    return context
}

export function useLoginContext(): LoginContextType {
    const context = useContext(LoginContext)
    if (!context) {
        throw new Error('useLoginContext must be used within LoginContextProvider')
    }
    return context
}

export function useChatContext(): ChatContextType {
    const context = useContext(ChatContext)
    if (!context) {
        throw new Error('useChatContext must be used within ChatContextProvider')
    }
    return context
}
