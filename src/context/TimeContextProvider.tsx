import {createContext, Dispatch, ReactNode, SetStateAction, useState} from "react";

export type TimeContextType = {
    lastMsgTime: string
    setLastMsgTime: Dispatch<SetStateAction<string>>
    formatDate: (date: Date) => string
}

export const TimeContext = createContext<TimeContextType | null>(null);

type Props = {
    children: ReactNode
}

function TimeContextProvider({children}: Props) {

    const [lastMsgTime, setLastMsgTime] = useState<string>("");

    function padTo2Digits(num: string | number) {
        return num.toString().padStart(2, '0');
    }

    function formatDate(date: Date) {
        return (
            [
                date.getFullYear(),
                padTo2Digits(date.getMonth() + 1),
                padTo2Digits(date.getDate()),
            ].join('-') +
            ' ' +
            [
                padTo2Digits(date.getHours()),
                padTo2Digits(date.getMinutes()),
                padTo2Digits(date.getSeconds()),
            ].join(':')
        );
    }

    return <TimeContext.Provider
        value={{
            lastMsgTime,
            setLastMsgTime,
            formatDate,
        }}>
        {children}
    </TimeContext.Provider>
}

export default TimeContextProvider;
