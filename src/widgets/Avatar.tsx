import STYLE, {SizeType} from '/src/style.ts'
import "/src/styles/Avatar.css"

type Props = {
    name: string
    size?: SizeType,
    color?: string,
    textColor?: string,
    shadow?: boolean
}

function hashCodeColor(name: string) {
    let hash = 0;
    for (let i = 0, len = name.length; i < len; i++) {
        hash = (hash * 31) + name.charCodeAt(i);
    }
    const index = hash % STYLE.backgroundColors.length;
    return STYLE.backgroundColors[index];
}

function Avatar({name, size, color, textColor}: Props) {
    return (
        <div className="avatar d-flex justify-content-center align-items-center shadow" style={{
            backgroundColor: `${color || hashCodeColor(name)}`,
            height: STYLE.avatarSize[size || "md"],
            width: STYLE.avatarSize[size || "md"]
        }}>
            <p className="fw-bold mb-0"
               style={{
                   color: textColor || "white",
                   fontSize: size ? STYLE.avatarFontSize[size] : STYLE.avatarFontSize["md"]
               }}
            >
                {name[0]}
            </p>
        </div>
    )
}

export default Avatar;
