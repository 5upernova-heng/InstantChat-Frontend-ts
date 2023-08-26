import {MessageType} from "/src/api/types.ts";
import Message from "/src/components/widgets/Message.jsx";
import {useChatContext, useLoginContext} from "/src/context/hooks.ts";
import {useEffect, useState} from "react";

type ParsedMessage = {
    id: number
    messageText: string
    messageTime: string
}

function MessageContainer() {
    const {loginAccount} = useLoginContext()
    const {findUserById, mode, messages} = useChatContext();

    const [parsedMessage, setParsedMessage] = useState<ParsedMessage[]>([]);

    function newMessage(): ParsedMessage[] {
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
        setParsedMessage(newMessage());
    }, [messages])

    const renderMessages = () => {
        return parsedMessage.map((message, index) => {
            const {id, messageText, messageTime} = message;
            const role = id === loginAccount.id ? "user" : "others"
            const user = findUserById(id);
            return <Message key={index} role={role} time={messageTime} message={messageText} user={user}/>
        })
    }
    return (
        <div className="d-flex flex-column gap-3 py-3">
            {renderMessages()}
        </div>
    );
}

export default MessageContainer;
