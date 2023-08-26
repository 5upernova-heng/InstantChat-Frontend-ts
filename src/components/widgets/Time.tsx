import "/src/styles/Time.css"

function Time({timeStr}: { timeStr: string }) {
    const [date, time] = timeStr.split("T");

    return <div data-tooltip={date} className="timestamp">
        <p className="mb-2"><u>{time}</u></p>
    </div>
}

export default Time;
