import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { DiaryEntries, Recipes, Users } from "@prisma/client";
import dayjs from "dayjs";

interface Props {
  diaryEntries: (DiaryEntries & { users: Users; recipes: Recipes })[];
}

function UserActivity({ diaryEntries }: Props) {
  const activity = diaryEntries.slice(0, 4);
  return (
    <Grid sx={{ marginTop: "10px" }}>
      <Grid
        container
        sx={{
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: "theme.palette.secondary",
          justifyContent: "space-between",
          margin: "10px 0",
          maxWidth: "50%",
        }}
      >
        <Grid>ACTIVITY</Grid>
      </Grid>
      <Stack spacing={1}>
        {activity?.map((diaryEntry, i) => (
          <Stack key={i} direction="row">
            <div>
              <Link href={`/${diaryEntry.users.username}`} underline="none">
                {diaryEntry.users.username}
              </Link>
              {" made "}
              <Link
                href={`/recipes/${diaryEntry.recipes.name.toLowerCase().replace(/ /g, "-")}`}
                underline="none"
              >
                {diaryEntry.recipes.name}
              </Link>
              {" on "}
              {dayjs(diaryEntry.date).format("dddd, MMMM Do YYYY")}
              {" and rated it "}
              <Rating readOnly precision={0.5} size="small" value={diaryEntry.rating.toNumber()} />
              {"."}
              {/* {dayjs(diaryEntry.date).fromNow()} */}
            </div>
          </Stack>
        ))}
      </Stack>
    </Grid>
  );
}

export default UserActivity;
