import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import LinkIcon from "@mui/icons-material/Link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import UserAvatar from "./UserAvatar";
import { getAllUsers } from "../../data/users";
import { USER_LIST_TYPE } from "../../types";

interface Props {
  avatarSize: string;
  user: USER_LIST_TYPE;
}

function ProfileStatBar({ avatarSize, user }: Props) {
  const following = getAllUsers().filter((u) =>
    user.following?.includes(u.username)
  );

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [copied, setCopied] = useState(false);
  const copyUrlToClipboard = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
    setAnchorEl(null);
  };

  return (
    <Grid container item sx={{ marginTop: "10px" }}>
      <Grid container item xs={6} justifyContent="center" alignItems="center">
        <UserAvatar avatarSize={avatarSize} name={user.profile.name} />
        <Typography variant="h5" sx={{ margin: "0 10px" }}>
          {user.username}
        </Typography>
        <Button variant="outlined" size="small">
          Edit Profile
        </Button>
        <Grid item>
          <Button
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            size="small"
          >
            ...
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={copyUrlToClipboard}>
              <LinkIcon /> &nbsp; Copy profile link
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
      <Grid container item xs={6} justifyContent="center">
        <Button
          size="small"
          href={`${user.username}/recipes`}
        >{`${user.diary?.length} RECIPES`}</Button>
        <Button
          size="small"
          href={`${user.username}/recipes`}
        >{`${user.diary?.length} THIS YEAR`}</Button>
        <Button
          size="small"
          href={`${user.username}/following`}
        >{`${user.following?.length} FOLLOWING`}</Button>
        <Button size="small" href={`${user.username}/followers`}>
          {`${following.length} FOLLOWERS`}
        </Button>
      </Grid>
    </Grid>
  );
}

export default ProfileStatBar;
