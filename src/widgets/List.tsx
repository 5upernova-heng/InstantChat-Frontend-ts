import Element = React.JSX.Element;

type Props<T> = {
    title: string
    data: T[]
    renderMethod: (item: T, index: number) => Element
}

function renderData<T>(title: string, data: T[], renderMethod: (item: T, index: number) => Element) {
    const fontStyle = "fw-bold fs-5 mb-0";

    if (data === undefined || data.length === 0)
        return (
            <p
                className={`${fontStyle} text-center`}
            >{`暂无${title}`}</p>
        );
    return data.map(renderMethod);
}

function List<T>({title, data, renderMethod}: Props<T>) {
    return (
        <>
            <div className="py-2 d-flex flex-column gap-3">{renderData<T>(title, data, renderMethod)}</div>
        </>
    );
}

export default List;
