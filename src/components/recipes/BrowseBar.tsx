import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Link from "next/link";

function BrowseBar() {
  return (
    <Grid container style={{ justifyContent: "center" }}>
      <Grid item style={{ lineHeight: "3.5" }}>
        Browse By
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            value=""
            label="category"
          >
            <Link href="/recipes/category/beef">
              <MenuItem value="beef">Beef</MenuItem>
            </Link>
            <Link href="/recipes/category/chicken">
              <MenuItem value="chicken">Chicken</MenuItem>
            </Link>
            <Link href="/recipes/category/noodles">
              <MenuItem value="noodles">Noodles</MenuItem>
            </Link>
            <Link href="/recipes/category/pasta">
              <MenuItem value="pasta">Pasta</MenuItem>
            </Link>
            <Link href="/recipes/category/pork">
              <MenuItem value="pork">Pork</MenuItem>
            </Link>
            <Link href="/recipes/category/rice">
              <MenuItem value="rice">Rice & Grains</MenuItem>
            </Link>
            <Link href="/recipes/category/vegetables">
              <MenuItem value="vegetables">Vegetables</MenuItem>
            </Link>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="cuisine-label">Cuisine</InputLabel>
          <Select labelId="cuisine-label" id="cuisine" value="" label="cuisine">
            <Link href="/recipes/cuisine/african">
              <MenuItem value="african">African Cuisine</MenuItem>
            </Link>
            <Link href="/recipes/cuisine/asian">
              <MenuItem value="asian">Asian Cuisine</MenuItem>
            </Link>
            <Link href="/recipes/cuisine/european">
              <MenuItem value="european">European Cuisine</MenuItem>
            </Link>
            <Link href="/recipes/cuisine/northamerican">
              <MenuItem value="northamerican">North American Cuisine</MenuItem>
            </Link>
            <Link href="/recipes/cuisine/oceanic">
              <MenuItem value="oceanic">Oceanic Cuisine</MenuItem>
            </Link>
            <Link href="/recipes/cuisine/southamerica">
              <MenuItem value="southamerica">South American Cuisine</MenuItem>
            </Link>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="course-label">Course</InputLabel>
          <Select labelId="course-label" id="course" value="" label="course">
            <Link href="/recipes/course/breakfast">
              <MenuItem value="breakfast">Breakfast</MenuItem>
            </Link>
            <Link href="/recipes/course/main">
              <MenuItem value="main">Mains</MenuItem>
            </Link>
            <Link href="/recipes/course/appetizer">
              <MenuItem value="appetizer">Appetizers</MenuItem>
            </Link>
            <Link href="/recipes/course/side">
              <MenuItem value="side">Sides</MenuItem>
            </Link>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="method-label">Method</InputLabel>
          <Select labelId="method-label" id="method" value="" label="method">
            <Link href="/recipes/method/pressure-cooker">
              <MenuItem value="pressure-cooker">Pressure Cooker</MenuItem>
            </Link>
            <Link href="/recipes/method/slow-cooker">
              <MenuItem value="slow-cooker">Slow Cooker</MenuItem>
            </Link>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="diet-label">Diet</InputLabel>
          <Select labelId="diet-label" id="diet" value="" label="diet">
            <Link href="/recipes/diet/dairy-free">
              <MenuItem value="dairy-free">Dairy-free</MenuItem>
            </Link>
            <Link href="/recipes/diet/gluten-free">
              <MenuItem value="gluten-free">Gluten-free</MenuItem>
            </Link>
            <Link href="/recipes/diet/vegan">
              <MenuItem value="vegan">Vegan</MenuItem>
            </Link>
            <Link href="/recipes/diet/vegetarian">
              <MenuItem value="vegetarian">Vegetarian</MenuItem>
            </Link>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="rating-label">Rating</InputLabel>
          <Select labelId="rating-label" id="rating" value="" label="rating">
            <Link href="/recipes/highest">
              <MenuItem value="highest">Highest Rated</MenuItem>
            </Link>
            <Link href="/recipes/rating/lowest">
              <MenuItem value="lowest">Lowest Rated</MenuItem>
            </Link>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="popular-label">Popular</InputLabel>
          <Select labelId="popular-label" id="popular" value="" label="popular">
            <Link href="/recipes/popular">
              <MenuItem value="popular">All Time</MenuItem>
            </Link>
            <Link href="/recipes/popular/month">
              <MenuItem value="popthismonth">This Month</MenuItem>
            </Link>
            <Link href="/recipes/popular/week">
              <MenuItem value="popthisweek">This Week</MenuItem>
            </Link>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="other-label">Other</InputLabel>
          <Select labelId="other-label" id="other" value="" label="other">
            <Link href="/recipes/name">
              <MenuItem value="name">All Recipes</MenuItem>
            </Link>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default BrowseBar;
