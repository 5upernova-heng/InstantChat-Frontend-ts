import {ButtonStyle} from "/src/style.ts";

type Props = {
    buttonsInfo: ButtonStyle[]
    changeSelect: (index: number) => void
}

const SelectButtonGroup = ({buttonsInfo, changeSelect}: Props) => {
    const renderButtons = () => {
        return buttonsInfo.map((button, index) => {
            return (
                <button
                    key={index}
                    onClick={() => changeSelect(index)}
                    className={`btn ${button.style} ${
                        button.isActive ? "active" : ""
                    }`}
                    type="button"
                >
                    {button.label}
                </button>
            );
        });
    };
    return (
        <div className="btn-group" role="group">
            {renderButtons()}
        </div>
    );
};


export default SelectButtonGroup;
