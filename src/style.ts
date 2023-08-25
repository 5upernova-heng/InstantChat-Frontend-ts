const backgroundColors: string[] = [
    '#F44336', '#E91E63', '#9C27B0',
    '#673AB7', '#3F51B5', '#2196F3',
    '#03A9F4', '#00BCD4', '#009688',
    '#4CAF50', '#8BC34A', '#CDDC39',
    '#FFEB3B', '#FFC107', '#FF9800',
    '#FF5722', '#795548', '#607D8B',
]

export type SizeType = "sm" | "md" | "lg"
type SizeStyleMap = { [size in SizeType]: string }

const avatarSize: SizeStyleMap = {
    "sm": "3rem",
    "md": "4rem",
    "lg": "5rem",
}

const avatarFontSize: SizeStyleMap = {
    "sm": "1.8rem",
    "md": "2rem",
    "lg": "2.5rem",
}

export type UserType = "user" | "others"
type UserTypeMap = { [user in UserType]: string }

const messageAlignStyle: UserTypeMap = {
    "user": "flex-row-reverse",
    "others": "",
}

const roleBackgroundStyle: UserTypeMap = {
    "user": "bg-primary",
    "others": "bg-white",
}

const textColorStyle: UserTypeMap = {
    "user": "text-white",
    "others": "text-black",
}

const groupLevelLabel = ["Tiny", "Small", "Normal", "Large", "Tremendous"];

export type ButtonStyle = {
    label: string
    style: string
    isActive?: boolean
}

const groupLevelButtonStyle: ButtonStyle[] = groupLevelLabel.map((label: string) => {
    return {label, style: "btn btn-sm btn-outline-secondary"};
});

const parseButtonInfo = (style: ButtonStyle[], activeIndex: number) => {
    return style.map((button: ButtonStyle, index: number) => {
        button.isActive = index === activeIndex;
        return button;
    });
};

const groupSize = [10, 50, 100, 200, 500];


export default {
    // avatar
    backgroundColors,
    avatarSize,
    avatarFontSize,
    // message
    messageAlignStyle,
    roleBackgroundStyle,
    textColorStyle,
    // group
    groupSize,
    parseButtonInfo,
    groupLevelLabel,
    groupLevelButtonStyle,
}
