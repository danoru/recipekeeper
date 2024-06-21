import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Reviews, Users } from "@prisma/client";
import UserAvatar from "../users/UserAvatar";

interface Props {
  reviews: (Reviews & { users: Users })[];
}

function RecipeFriendRatings({ reviews }: Props) {
  return (
    <Grid container>
      <Grid
        item
        style={{
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: "theme.palette.secondary",
          display: "flex",
          justifyContent: "space-between",
          lineHeight: "0",
          marginTop: "2%",
          width: "100%",
        }}
      >
        <Typography variant="overline" component="div">
          ACTIVITY FROM FRIENDS
        </Typography>
      </Grid>
      <Grid
        container
        item
        rowSpacing={1}
        columnSpacing={2}
        sx={{
          margin: "10px 0",
        }}
      >
        {reviews?.map((entry: Reviews & { users: Users }, i: number) => {
          return (
            <ReviewCard
              key={i}
              username={entry.users.username}
              rating={entry.rating}
            />
          );
        })}
      </Grid>
    </Grid>
  );
}

function ReviewCard(props: any) {
  return (
    <Stack direction="column" alignItems="center">
      <Link href={`/${props.username}`} underline="none">
        <UserAvatar avatarSize="32px" name={props.username} />
      </Link>
      <Rating value={props.rating} size="small" readOnly />
    </Stack>
  );
}

export default RecipeFriendRatings;
