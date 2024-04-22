import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import LinkIcon from "@mui/icons-material/Link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import UserAvatar from "./UserAvatar";

interface Props {
  avatarSize: string;
  username: string;
  name: string;
}

function ProfileStatBar(props: Props) {
  const { avatarSize, username, name } = props;

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
        <UserAvatar avatarSize={avatarSize} name={name} />
        <Typography variant="h5" sx={{ margin: "0 10px" }}>
          {username}
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
        <Button size="small"># Recipes</Button>
        <Button size="small"># This Year</Button>
        <Button size="small"># Following</Button>
        <Button size="small"># Followers</Button>
      </Grid>
    </Grid>
  );
}

export default ProfileStatBar;
