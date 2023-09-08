import Avatar from "/src/widgets/Avatar.jsx";

type Props = { name: string }

function UserCard({name}: Props) {
    return (
        <>
            <Avatar name={name} size="sm"/>
            <div className="d-flex align-items-center justify-content-center flex-grow-1">
                <h4 className="mb-0">{name}</h4>
            </div>
        </>
    )
}

export default UserCard;
