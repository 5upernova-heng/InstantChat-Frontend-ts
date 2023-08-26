import React, {ChangeEventHandler} from "react";

type Props = {
    name: string,
    icon?: React.ReactNode,
    type?: string,
    label: string,
    onChange: ChangeEventHandler<HTMLInputElement>,
    value?: string,
    error?: string,
};

function Input({name, icon, label, value, type, onChange, error}: Props) {
    return (
        <>
            <label className="fw-bold  mb-1" htmlFor={name}>
                {label}
            </label>
            <div className="input-group flex-nowrap">
                {icon && <span className="input-group-text">{icon}</span>}
                <input
                    id={name}
                    value={value}
                    name={name}
                    type={type}
                    onChange={onChange}
                    className="form-control"
                />
            </div>
            {error && (
                <div
                    style={{overflowWrap: "break-word", maxWidth: "400px"}}
                    className="alert alert-danger p-2"
                >
                    {error}
                </div>
            )}
        </>
    );
}


export default Input;
