import Divider from "@mui/material/Divider";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/FavoriteOutlined";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MenuBookTwoToneIcon from "@mui/icons-material/MenuBookTwoTone";
import Paper from "@mui/material/Paper";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";
import OutdoorGrillOutlinedIcon from "@mui/icons-material/OutdoorGrillOutlined";

function RecipeActionBar() {
  return (
    <Paper sx={{ borderRadius: "1%", width: "15%" }}>
      <Stack direction="row" justifyContent="center">
        <Stack alignItems="center" padding="1vh 0" width="33%">
          <OutdoorGrillOutlinedIcon />
          <Typography variant="subtitle1">Watch</Typography>
        </Stack>
        <Stack alignItems="center" padding="1vh 0" width="33%">
          <FavoriteBorderIcon />
          <Typography variant="subtitle1">Like</Typography>
        </Stack>
        <Stack alignItems="center" padding="1vh 0" width="33%">
          <MenuBookTwoToneIcon />
          <Typography variant="subtitle1">Cooklist</Typography>
        </Stack>
      </Stack>
      <Divider />
      <Stack alignItems="center" padding="1vh 0">
        <Typography variant="subtitle1">Rate</Typography>
        <Rating />
      </Stack>
      <Divider />
      <Typography
        variant="subtitle1"
        style={{ padding: "1vh 0", textAlign: "center" }}
      >
        Review or Log
      </Typography>
      <Divider />
      <Typography
        variant="subtitle1"
        style={{ padding: "1vh 0", textAlign: "center" }}
      >
        Add to Lists
      </Typography>
      <Divider />
      <Typography
        variant="subtitle1"
        style={{ padding: "1vh 0", textAlign: "center" }}
      >
        View Recipe
      </Typography>
      <Divider />
      <Typography
        variant="subtitle1"
        style={{ padding: "1vh 0", textAlign: "center" }}
      >
        Share
      </Typography>
    </Paper>
  );
}

export default RecipeActionBar;
