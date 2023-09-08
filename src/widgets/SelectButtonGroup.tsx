import {ButtonStyle} from "/src/style.ts";

type Props = {
    buttonsInfo: ButtonStyle[]
    changeSelect: (index: number) => void
}

const renderButtons = (buttonsInfo: ButtonStyle[], changeSelect: (index: number) => void) => {
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

const SelectButtonGroup = ({buttonsInfo, changeSelect}: Props) => {
    return (
        <div className="btn-group" role="group">
            {renderButtons(buttonsInfo, changeSelect)}
        </div>
    );
};


export default SelectButtonGroup;
