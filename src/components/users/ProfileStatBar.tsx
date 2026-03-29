"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import LinkIcon from "@mui/icons-material/Link";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import UserAvatar from "./UserAvatar";
import { DiaryEntries, Following, Users } from "@prisma/client";
import { followUser, unfollowUser } from "../../data/users";
import dayjs from "dayjs";

interface Props {
  avatarSize: string;
  diaryEntries: DiaryEntries[];
  followers: Following[];
  following: Following[];
  sessionUser: any | null;
  user: Users;
}

function ProfileStatBar({
  avatarSize,
  diaryEntries,
  following,
  followers,
  sessionUser,
  user,
}: Props) {
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username;

  // ── Menu ────────────────────────────────────────────────────────────────
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  function handleMenuOpen(e: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(e.currentTarget);
  }
  function handleMenuClose() {
    setAnchorEl(null);
  }

  const [copied, setCopied] = useState(false);
  function copyUrlToClipboard() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
    handleMenuClose();
  }

  // ── Follow state ─────────────────────────────────────────────────────────
  const isSessionUser = sessionUser?.username === user.username;
  const initiallyFollowing = followers.some(
    (f) =>
      f.userId === sessionUser?.id && f.followingUsername === user.username,
  );
  const [isFollowing, setIsFollowing] = useState(initiallyFollowing);
  const [hoveringFollow, setHoveringFollow] = useState(false);

  async function handleFollow() {
    if (!sessionUser) return;
    if (isFollowing) {
      await unfollowUser(sessionUser.id, user.username);
      setIsFollowing(false);
    } else {
      await followUser(sessionUser.id, user.username);
      setIsFollowing(true);
    }
  }

  // ── Stats ────────────────────────────────────────────────────────────────
  const currentYear = dayjs().year();
  const recipesThisYear = diaryEntries.filter(
    (e) => dayjs(e.date).year() === currentYear,
  ).length;

  const stats = [
    {
      label: "recipes",
      value: diaryEntries.length,
      href: `/${user.username}/recipes`,
    },
    {
      label: `in ${currentYear}`,
      value: recipesThisYear,
      href: `/${user.username}/recipes`,
    },
    {
      label: "following",
      value: following?.length ?? 0,
      href: `/${user.username}/following`,
    },
    {
      label: "followers",
      value: followers?.length ?? 0,
      href: `/${user.username}/followers`,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 3,
        mt: 1.5,
      }}
    >
      {/* ── Identity ── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <UserAvatar avatarSize={avatarSize} name={fullName} />

        <Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 400,
              lineHeight: 1.2,
            }}
          >
            {user.username}
          </Typography>
          {fullName !== user.username && (
            <Typography variant="caption" color="text.secondary">
              {fullName}
            </Typography>
          )}
        </Box>

        {/* Action button */}
        {sessionUser &&
          (isSessionUser ? (
            <Button variant="outlined" size="small" href="/settings">
              Edit Profile
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="small"
              onClick={handleFollow}
              onMouseEnter={() => setHoveringFollow(true)}
              onMouseLeave={() => setHoveringFollow(false)}
              color={isFollowing && hoveringFollow ? "error" : "primary"}
            >
              {isFollowing
                ? hoveringFollow
                  ? "Unfollow"
                  : "Following"
                : "Follow"}
            </Button>
          ))}

        {/* ⋯ menu */}
        <IconButton
          size="small"
          onClick={handleMenuOpen}
          aria-controls={menuOpen ? "profile-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? "true" : undefined}
          sx={{ color: "text.disabled" }}
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          slotProps={{ paper: { sx: { minWidth: 160 } } }}
        >
          {/* Only show Settings to the session user */}
          {isSessionUser && (
            <MenuItem
              component={Link}
              href="/settings"
              onClick={handleMenuClose}
              underline="none"
            >
              <ListItemIcon>
                <SettingsOutlinedIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
          )}
          {isSessionUser && <Divider />}
          <MenuItem onClick={copyUrlToClipboard}>
            <ListItemIcon>
              <LinkIcon fontSize="small" />
            </ListItemIcon>
            {copied ? "Copied!" : "Copy profile link"}
          </MenuItem>
        </Menu>
      </Box>

      {/* ── Stats ── */}
      <Box sx={{ display: "flex", gap: { xs: 2, sm: 3 } }}>
        {stats.map(({ label, value, href }) => (
          <Box
            key={label}
            component={Link}
            href={href}
            underline="none"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "text.primary",
              "&:hover .stat-value": { color: "primary.main" },
            }}
          >
            <Typography
              className="stat-value"
              sx={{
                fontSize: "1.1rem",
                fontWeight: 500,
                lineHeight: 1,
                transition: "color 0.15s",
              }}
            >
              {value}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ letterSpacing: "0.06em" }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default ProfileStatBar;
