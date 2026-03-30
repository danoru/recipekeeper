import Avatar from "@mui/material/Avatar";

interface Props {
  avatarSize: string;
  name: string;
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    color += `00${((hash >> (i * 8)) & 0xff).toString(16)}`.slice(-2);
  }
  return color;
}

function getInitials(name: string): string {
  const parts = name.trim().toUpperCase().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "?";
  return parts.length === 1 ? parts[0][0] : `${parts[0][0]}${parts[parts.length - 1][0]}`;
}

function UserAvatar({ avatarSize, name }: Props) {
  const safeName = name?.trim() || "User";
  const bgcolor = stringToColor(safeName.toUpperCase());
  const initials = getInitials(safeName);

  return (
    <Avatar
      alt={safeName}
      sx={{
        bgcolor,
        height: avatarSize,
        width: avatarSize,
        fontSize: `calc(${avatarSize} * 0.4)`,
      }}
      title={safeName}
    >
      {initials}
    </Avatar>
  );
}

export default UserAvatar;
