import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import StarRating from "../../../src/review/StarRating";
import { USER_LIST_TYPE } from "../../../src/types";

interface Props {
  user: USER_LIST_TYPE;
}

function UserActivity({ user }: Props) {
  const username = user.username;
  const diaryEntries = user.diary;

  return (
    <Grid item xs={4} sx={{ marginTop: "10px" }}>
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
        <Grid item>ACTIVITY</Grid>
      </Grid>
      <Stack spacing={1}>
        {diaryEntries?.map((diaryEntry, i) => (
          <Stack key={i} direction="row">
            <div>
              <Link href={`/${username}`} underline="none">
                {username}
              </Link>
              {" made "}
              <Link
                href={`/recipe/${diaryEntry.recipe
                  .toLowerCase()
                  .replace(/ /g, "-")}`}
              >
                {diaryEntry.recipe}
              </Link>
              {" on "}
              {diaryEntry.date}
              {" and rated it "}
              {typeof diaryEntry.rating === "number" && (
                <StarRating rating={diaryEntry.rating} />
              )}
              {"."}
            </div>
          </Stack>
        ))}
      </Stack>
    </Grid>
  );
}

export default UserActivity;
