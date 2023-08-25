import React from "react";

type Props = {
    title: string
    data: []
    renderMethod: () => React.ReactNode
}

function List({title, data, renderMethod}: Props) {
    const fontStyle = "fw-bold fs-5 mb-0";

    const renderData = () => {
        if (data === undefined || data.length === 0)
            return (
                <p
                    className={`${fontStyle} text-center`}
                >{`暂无${title}`}</p>
            );
        return data.map(renderMethod);
    };
    return (
        <>
            <div className="py-2 d-flex flex-column gap-3">{renderData()}</div>
        </>
    );
}

export default List;
