import {GroupLevel} from "/src/api/types.ts";
import {useChatContext, useLoginContext} from "/src/context/hooks.ts";
import MemberSelect from "/src/features/modal/MemberSelect.tsx";
import STYLE from "/src/style.ts";
import Input from "/src/widgets/Input.tsx";
import SelectButtonGroup from "/src/widgets/SelectButtonGroup.jsx";
import {toast} from "react-toastify";

function CreateGroupForm() {
    const {loginAccount} = useLoginContext();
    const {newGroup, changeSubmitGroup} = useChatContext();

    const {id: userId} = loginAccount;
    const {members, level} = newGroup;

    const changeName = (name: string) => {
        changeSubmitGroup({name: name});
    }
    const changeLevel = (level: GroupLevel) => {
        changeSubmitGroup({level});
    }

    const changeMembers = (id: number) => {
        if (id === userId) {
            toast("创建者必须在群里哦~");
            return;
        }
        if (members.includes(id)) {
            const index = members.indexOf(id);
            members.splice(index, 1);
        } else {
            members.push(id);
        }
        changeSubmitGroup({members});
    }

    return (
        <div>
            <div className="py-2"/>
            <Input onChange={(event) => {
                changeName(event.target.value);
            }} name={"groupName"} label={"群聊名称"}/>
            <p className="pt-2 fw-bold">选择成员</p>
            <MemberSelect members={members} toggleMember={changeMembers}/>
            <p className="pt-2 fw-bold">选择群聊等级</p>
            <div className="d-flex align-items-center justify-content-center">
                <SelectButtonGroup changeSelect={changeLevel} buttonsInfo={
                    STYLE.parseButtonInfo(STYLE.groupLevelButtonStyle, level)
                }/>
            </div>
        </div>
    )
}

export default CreateGroupForm;
