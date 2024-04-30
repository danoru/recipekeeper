import Grid from "@mui/material/Grid";

function RecentReviews() {
  return (
    <Grid
      container
      item
      xs={12}
      style={{
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        borderBottomColor: "theme.palette.secondary",
        justifyContent: "space-between",
        lineHeight: "0",
        margin: "0 auto",
        width: "75%",
      }}
    >
      <p>JUST REVIEWED ...</p>
    </Grid>
  );
}

export default RecentReviews;
