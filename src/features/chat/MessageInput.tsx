import {sendGroupMessage, sendMessage} from "/src/api/messageApi.js";
import {useChatContext, useLoginContext} from "/src/context/hooks.ts";
import "/src/styles/MessageInput.css"
import {useState} from "react";
import {toast} from "react-toastify";

type Props = { disabled: boolean }

function MessageInput({disabled}: Props) {
    const {token} = useLoginContext();
    const {mode, conversation, loadMessages} = useChatContext();
    const [message, setMessage] = useState("");

    const handleSubmit = async () => {
        if (mode === 0) {
            // user
            const {code, msg} = await sendMessage(conversation, message, token)
            if (code) {
                loadMessages()
                setMessage("");
            } else
                toast(msg);
            return;
        }
        if (mode === 1) {
            const {code, msg} = await sendGroupMessage(conversation, message, token)
            if (code) {
                loadMessages()
                setMessage("");
            } else
                toast(msg);
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-start gap-3"
             style={{
                 height: "10rem"
             }}
        >
            <div style={{width: "50%"}}>
                <textarea className="message-input" autoFocus={true}
                          value={message}
                          onChange={(event) => setMessage(event.target.value)}
                />
            </div>
            <button disabled={disabled} className="btn btn-lg rounded-3 btn-primary shadow"
                    onClick={() => {
                        handleSubmit()
                    }}
            >发送
            </button>
        </div>
    )
}


export default MessageInput;
