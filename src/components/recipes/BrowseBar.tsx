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
            <MenuItem value="beef">
              <Link href="/recipes/category/beef">Beef</Link>
            </MenuItem>
            <MenuItem value="chicken">
              <Link href="/recipes/category/chicken">Chicken</Link>
            </MenuItem>
            <MenuItem value="noodles">
              <Link href="/recipes/category/noodles">Noodles</Link>
            </MenuItem>
            <MenuItem value="pasta">
              <Link href="/recipes/category/pasta">Pasta</Link>
            </MenuItem>
            <MenuItem value="pork">
              <Link href="/recipes/category/pork">Pork</Link>
            </MenuItem>
            <MenuItem value="rice">
              <Link href="/recipes/category/rice">Rice & Grains</Link>
            </MenuItem>
            <MenuItem value="vegetables">
              <Link href="/recipes/category/vegetables">Vegetables</Link>
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="cuisine-label">Cuisine</InputLabel>
          <Select labelId="cuisine-label" id="cuisine" value="" label="cuisine">
            <MenuItem value="african">
              <Link href="/recipes/cuisine/african">African Cuisine</Link>
            </MenuItem>
            <MenuItem value="asian">
              <Link href="/recipes/cuisine/asian">Asian Cuisine</Link>
            </MenuItem>
            <MenuItem value="european">
              <Link href="/recipes/cuisine/european">European Cuisine</Link>
            </MenuItem>
            <MenuItem value="northamerican">
              <Link href="/recipes/cuisine/northamerican">
                North American Cuisine
              </Link>
            </MenuItem>
            <MenuItem value="oceanic">
              <Link href="/recipes/cuisine/oceanic">Oceanic Cuisine</Link>
            </MenuItem>
            <MenuItem value="southamerica">
              <Link href="/recipes/cuisine/southamerica">
                South American Cuisine
              </Link>
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="course-label">Course</InputLabel>
          <Select labelId="course-label" id="course" value="" label="course">
            <MenuItem value="breakfast">
              <Link href="/recipes/course/breakfast">Breakfast</Link>
            </MenuItem>
            <MenuItem value="main">
              <Link href="/recipes/course/main">Mains</Link>
            </MenuItem>
            <MenuItem value="appetizer">
              <Link href="/recipes/course/appetizer">Appetizers</Link>
            </MenuItem>
            <MenuItem value="side">
              <Link href="/recipes/course/side">Sides</Link>
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="method-label">Method</InputLabel>
          <Select labelId="method-label" id="method" value="" label="method">
            <MenuItem value="pressure-cooker">
              <Link href="/recipes/method/pressure-cooker">
                Pressure Cooker
              </Link>
            </MenuItem>
            <MenuItem value="slow-cooker">
              <Link href="/recipes/method/slow-cooker">Slow Cooker</Link>
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="diet-label">Diet</InputLabel>
          <Select labelId="diet-label" id="diet" value="" label="diet">
            <MenuItem value="dairy-free">
              <Link href="/recipes/diet/dairy-free">Dairy-free</Link>
            </MenuItem>
            <MenuItem value="gluten-free">
              <Link href="/recipes/diet/gluten-free">Gluten-free</Link>
            </MenuItem>
            <MenuItem value="vegan">
              <Link href="/recipes/diet/vegan">Vegan</Link>
            </MenuItem>
            <MenuItem value="vegetarian">
              <Link href="/recipes/diet/vegetarian">Vegetarian</Link>
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="rating-label">Rating</InputLabel>
          <Select labelId="rating-label" id="rating" value="" label="rating">
            <MenuItem value="highest">
              <Link href="/recipes/highest">Highest Rated</Link>
            </MenuItem>
            <MenuItem value="lowest">
              <Link href="/recipes/rating/lowest">Lowest Rated</Link>
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="popular-label">Popular</InputLabel>
          <Select labelId="popular-label" id="popular" value="" label="popular">
            <MenuItem value="popular">
              <Link href="/recipes/popular">All Time</Link>
            </MenuItem>
            <MenuItem value="popthismonth">
              <Link href="/recipes/popular/month">This Month</Link>
            </MenuItem>
            <MenuItem value="popthisweek">
              <Link href="/recipes/popular/week">This Week</Link>
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="other-label">Other</InputLabel>
          <Select labelId="other-label" id="other" value="" label="other">
            <MenuItem value="name">
              <Link href="/recipes/name">All Recipes</Link>
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default BrowseBar;
