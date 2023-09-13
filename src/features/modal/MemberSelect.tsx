import {User} from "/src/api/types.ts";
import {useAppSelector} from "/src/app/hooks.ts";

type Props = {
    members: number[]
    toggleMember: (index: number) => void
}

function MemberSelect({members, toggleMember}: Props) {
    const {allUsers: users} = useAppSelector(state => state.user)

    function renderUsers(users: User[]) {
        return users.map((user, index) => {
            return (
                <span
                    style={{
                        cursor: "pointer",
                    }}
                    key={index}
                    onClick={() => {
                        toggleMember(user.id);
                    }}
                    className={`${
                        members.includes(user.id)
                            ? "bg-primary"
                            : "bg-secondary"
                    } d-inline-block mx-1 my-1 border px-2 py-1 rounded rounded-pill opacity-75`}
                >
                    <p className="mb-0 fs-6 text-white">{user.name}</p>
                </span>
            );
        });
    }

    return (
        <div className="d-flex justify-content-center">
            <div>
                <div
                    className="p-1 rounded border"
                    style={{
                        whiteSpace: "nowrap",
                        wordBreak: "keep-all",
                        overflow: "auto",
                    }}
                >
                    {renderUsers(users)}
                </div>
            </div>
        </div>
    );
}

export default MemberSelect
