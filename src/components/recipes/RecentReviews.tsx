import Grid from "@mui/material/Grid";

function RecentReviews() {
  return (
    <Grid
      container
      item
      xs={12}
      style={{
        borderBottom: "1px solid black",
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
