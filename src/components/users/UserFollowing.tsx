import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import UserAvatar from "./UserAvatar";
import { USER_LIST_TYPE } from "../../types";

interface Props {
  user: USER_LIST_TYPE;
}

function UserFollowing({ user }: Props) {
  return (
    <Grid container item xs={8}>
      <Grid
        item
        style={{
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: "theme.palette.secondary",
          display: "flex",
          justifyContent: "space-between",
          lineHeight: "0",
          margin: "0 auto",
          width: "75%",
        }}
      >
        <Typography variant="h6" component="div">
          FOLLOWING
        </Typography>
      </Grid>
      <Grid
        container
        item
        rowSpacing={1}
        columnSpacing={1}
        sx={{
          margin: "10px auto",
          maxWidth: "75%",
        }}
      >
        {user?.following?.map((user: any, i: number) => (
          <Grid item key={i}>
            <Button href={`/${user}`}>
              <UserAvatar avatarSize="56px" name={user} />
            </Button>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

export default UserFollowing;
