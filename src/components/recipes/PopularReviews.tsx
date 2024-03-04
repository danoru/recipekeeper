import Grid from "@mui/material/Grid";

function PopularReviews() {
  return (
    <Grid
      container
      item
      xs={8}
      style={{
        borderBottom: "1px solid black",
        justifyContent: "space-between",
        lineHeight: "0",
        margin: "0 auto",
        width: "75%",
      }}
    >
      <p>POPULAR REVIEWS THIS WEEK</p>
    </Grid>
  );
}

export default PopularReviews;
