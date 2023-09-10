import {MessageType, TabType} from "/src/api/types.ts";
import {createContext, Dispatch, ReactNode, SetStateAction, useState} from "react";

export type ViewContextType = {
    tab: TabType
    setTab: Dispatch<TabType>
    mode: MessageType
    setMode: Dispatch<SetStateAction<MessageType>>
    conversation: number
    setConversation: Dispatch<SetStateAction<number>>
}

export const ViewContext = createContext<ViewContextType | null>(null)

type Props = {
    children: ReactNode
}

function ViewContextProvider({children}: Props) {
    // which tab is modal in
    const [tab, setTab] = useState<TabType>(0);
    // conversation
    // which conversation should show on the page
    // Its value equals to the id of the user/group
    /*
    Always set mode before conversation.
     */
    const [mode, setMode] = useState<MessageType>(0);
    const [conversation, setConversation] = useState<number>(-1);
    return <ViewContext.Provider value={{tab, setTab, mode, setMode, conversation, setConversation}}>
        {children}
    </ViewContext.Provider>
}

export default ViewContextProvider

