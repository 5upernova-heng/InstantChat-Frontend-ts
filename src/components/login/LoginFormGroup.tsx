import {Account} from "api/types.ts";
import Input from "components/widgets/Input";
import {useLoginContext} from "context/hooks.ts";
import Joi from "joi";
import {ChangeEvent, useState} from "react";

function LoginFormGroup() {
    const [account, setAccount] = useState<Account>({username: "", password: ""});
    const [errors, setErrors] = useState<{ [errorField: string]: string }>({});
    const {tryLogin} = useLoginContext()
    const schema = Joi.object({
        username: Joi.string().min(3).max(20).required(),
        password: Joi.string()
            .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
            .required(),
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {value, name} = event.target;
        if (name !== "username" && name !== "password") return
        account[name] = value;
        setAccount(account);
    };

    const handleSubmit = () => {
        const {error} = schema.validate(account, {abortEarly: false});
        const newErrors = error
            ? error.details.reduce<{ [errorName: string]: string }>((allErrors, error) => {
                allErrors[error.path[0]] = error.message;
                return allErrors;
            }, {})
            : {};
        setErrors(newErrors);
        if (error) return;
        tryLogin(account);
    };
    return (
        <div style={{minWidth: "400px"}}>
            <Input
                name="username"
                icon={<i className="fa fa-user" aria-hidden="true"></i>}
                label="用户名"
                error={errors.username}
                onChange={handleChange}
            />
            <div className="py-4"></div>
            <Input
                name="password"
                icon={<i className="fa fa-lock" aria-hidden="true"></i>}
                label="密码"
                type="password"
                error={errors.password}
                onChange={handleChange}
            />
            <div className="mt-5 d-flex justify-content-evenly align-items-center">
                <button
                    className="btn btn-primary shadow"
                    onClick={() => handleSubmit()}
                    onKeyDown={(e) => {
                        if (e.key === "enter") {
                            handleSubmit();
                        }
                    }}
                >
                    登录
                </button>
            </div>
        </div>
    );
}

export default LoginFormGroup;
