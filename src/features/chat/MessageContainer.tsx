import {MessageType} from "/src/api/types.ts";
import {useChatContext, useLoginContext} from "/src/context/hooks.ts";
import {useViewContext} from "/src/pages/Chat.tsx";
import Message from "/src/widgets/Message.jsx";
import {useCallback, useEffect, useState} from "react";

type ParsedMessage = {
    id: number
    messageText: string
    messageTime: string
}

function MessageContainer() {
    const {loginAccount} = useLoginContext()
    const {findUserById, messages} = useChatContext();
    const {mode} = useViewContext()

    const [parsedMessage, setParsedMessage] = useState<ParsedMessage[]>([]);

    function parseNewMessage(): ParsedMessage[] {
        if (mode === MessageType.single)
            return messages.map((message) => {
                const {id1, messageText, messageTime} = message;
                return {
                    id: id1,
                    messageText,
                    messageTime
                }
            })
        if (mode === MessageType.group)
            return messages.map((message) => {
                const {id2, messageText, messageTime} = message;
                return {
                    id: id2,
                    messageText,
                    messageTime
                }
            })
        return []
    }

    useEffect(() => {
        setParsedMessage(parseNewMessage());
    }, [messages])

    const renderMessages = useCallback(() => {
        return parsedMessage.map((message, index) => {
            const {id, messageText, messageTime} = message;
            const role = id === loginAccount.id ? "user" : "others"
            const user = findUserById(id);
            return <Message key={index} role={role} time={messageTime} message={messageText} user={user}/>
        })
    }, [findUserById, loginAccount.id, parsedMessage])
    return (
        <div className="d-flex flex-column gap-3 py-3">
            {renderMessages()}
        </div>
    );
}

export default MessageContainer;
