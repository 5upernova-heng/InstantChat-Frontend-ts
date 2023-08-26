import Element = React.JSX.Element;

type Props<T> = {
    title: string
    data: T[]
    renderMethod: (item: T, index: number) => Element
}

function List<T>({title, data, renderMethod}: Props<T>) {
    const fontStyle = "fw-bold fs-5 mb-0";

    function renderData() {
        if (data === undefined || data.length === 0)
            return (
                <p
                    className={`${fontStyle} text-center`}
                >{`暂无${title}`}</p>
            );
        return data.map(renderMethod);
    }

    return (
        <>
            <div className="py-2 d-flex flex-column gap-3">{renderData()}</div>
        </>
    );
}

export default List;
