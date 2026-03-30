import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { DiaryEntries, Recipes } from "@prisma/client";
import dayjs from "dayjs";
import Head from "next/head";
import superjson from "superjson";

import StarRating from "@/components/ui/StarRating";
import ProfileLinkBar from "@/components/users/ProfileLinkBar";
import { getUserDiaryEntries } from "@/data/diary";
import { findUserByUsername, getAllUsers } from "@/data/users";

interface Props {
  user: any;
  diaryEntries: (DiaryEntries & { recipes: Recipes })[];
}

export default function RecipeDiary({ user, diaryEntries }: Props) {
  const title = `${user.username}'s Diary • Savry`;

  // Group entries by month label
  const entriesByMonth: Record<string, (DiaryEntries & { recipes: Recipes })[]> = {};
  diaryEntries.forEach((entry) => {
    const month = dayjs(entry.date).format("MMM");
    if (!entriesByMonth[month]) entriesByMonth[month] = [];
    entriesByMonth[month].push(entry);
  });

  const headerSx = {
    fontSize: "0.625rem",
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#4a4744",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    py: 1.25,
  };

  const cellSx = {
    fontSize: "0.8125rem",
    color: "text.secondary",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    py: 1.25,
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Box
        component="main"
        sx={{
          maxWidth: "1080px",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          pt: 4,
          pb: 12,
        }}
      >
        <ProfileLinkBar username={user.username} />

        <Box sx={{ mt: 4 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["Month", "Day", "Recipe", "Rating", "Remade", "Review", ""].map((h) => (
                    <TableCell key={h} sx={headerSx}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(entriesByMonth).map(([month, entries]) =>
                  entries.map((entry, idx) => (
                    <TableRow key={`${month}-${idx}`} sx={{ "&:hover": { bgcolor: "#1a1a1a" } }}>
                      <TableCell sx={{ ...cellSx, color: "text.disabled", width: 60 }}>
                        {idx === 0 ? month : ""}
                      </TableCell>
                      <TableCell sx={{ ...cellSx, width: 40 }}>
                        {dayjs(entry.date).format("d")}
                      </TableCell>
                      <TableCell sx={cellSx}>
                        <Typography sx={{ fontSize: "0.875rem", color: "text.primary" }}>
                          {entry.recipes.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={cellSx}>
                        <StarRating rating={Number(entry.rating)} size="sm" />
                      </TableCell>
                      <TableCell sx={{ ...cellSx, textAlign: "center" }}>
                        {entry.hasCookedBefore && (
                          <Tooltip title="Remade">
                            <ChangeCircleIcon
                              sx={{
                                fontSize: 16,
                                color: "primary.main",
                                opacity: 0.7,
                              }}
                            />
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell sx={{ ...cellSx, maxWidth: 280 }}>
                        {entry.comment ?? (
                          <Typography sx={{ fontSize: "0.75rem", color: "text.disabled" }}>
                            N/A
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ ...cellSx, width: 40 }}>
                        <IconButton
                          size="small"
                          sx={{
                            color: "text.disabled",
                            "&:hover": { color: "text.primary" },
                          }}
                        >
                          <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}

export async function getStaticPaths() {
  const users = await getAllUsers();
  return {
    paths: users.map((u) => ({ params: { username: u.username } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { username: string } }) {
  const { username } = params;
  const user = await findUserByUsername(username);
  if (!user) return { notFound: true };

  const diaryEntries = await getUserDiaryEntries(user.id);

  return {
    props: superjson.serialize({ diaryEntries, user }).json,
    revalidate: 1800,
  };
}
