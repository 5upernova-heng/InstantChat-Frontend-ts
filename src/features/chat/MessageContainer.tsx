import {MessageType} from "/src/api/types.ts";
import {useAppSelector} from "/src/app/hooks.ts";
import {findById} from "/src/features/utils.ts";
import Message from "/src/widgets/Message.jsx";
import {useCallback, useEffect, useState} from "react";

type ParsedMessage = {
    id: number
    messageText: string
    messageTime: string
}

function MessageContainer() {
    const {mode} = useAppSelector(state => ({
        mode: state.view.mode,
    }))
    const loginAccount = useAppSelector(state => state.user.login.loginAccount)
    const {friends, messages} = useAppSelector(state => state.user)

    const [parsedMessage, setParsedMessage] = useState<ParsedMessage[]>([]);

    const parseNewMessage = useCallback(() => {
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
    }, [messages, mode])

    useEffect(() => {
        setParsedMessage(parseNewMessage());
    }, [messages, parseNewMessage])

    const renderMessages = useCallback(() => {
        return parsedMessage.map((message, index) => {
            const {id, messageText, messageTime} = message;
            const role = id === loginAccount.id ? "user" : "others"
            const user = findById(friends, id);
            return <Message key={index} role={role} time={messageTime} message={messageText} user={user}/>
        })
    }, [friends, loginAccount.id, parsedMessage])
    return (
        <div className="d-flex flex-column gap-3 py-3">
            {renderMessages()}
        </div>
    );
}

export default MessageContainer;
