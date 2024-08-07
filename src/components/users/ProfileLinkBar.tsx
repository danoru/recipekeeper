import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Grid from "@mui/material/Grid";

interface Props {
  username: string;
}

function ProfileLinkBar({ username }: Props) {
  return (
    <Grid
      container
      item
      xs={12}
      style={{ justifyContent: "center", margin: "10px 0" }}
    >
      <ButtonGroup
        variant="outlined"
        aria-label="Button Group"
        sx={{ flexWrap: "wrap" }}
      >
        <Button href={`/${username}`}>Profile</Button>
        <Button href={`/${username}/activity`}>Activity</Button>
        {/* <Button href={`/${username}/activity`}>Activity</Button> */}
        <Button href={`/${username}/recipes`}>Recipes</Button>
        <Button href={`/${username}/recipes/diary`}>Diary</Button>
        <Button href={`/${username}/recipes/reviews`}>Reviews</Button>
        <Button href={`/${username}/cooklist`}>Cooklist</Button>
        {/* <Button disabled href={`/${username}/lists`}>
          Lists
        </Button> */}
        <Button href={`/${username}/likes`}>Likes</Button>
        {/* <Button disabled href={`/${username}/tags`}>
          Tags
        </Button> */}
        <Button href={`/${username}/following`}>Network</Button>
      </ButtonGroup>
    </Grid>
  );
}

export default ProfileLinkBar;
