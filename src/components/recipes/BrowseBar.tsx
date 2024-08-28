import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Link from "@mui/material/Link";

function BrowseBar() {
  return (
    <Grid container item xs={12} style={{ justifyContent: "center" }}>
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
            <Link href="/recipes/category/beef" underline="none">
              <MenuItem value="beef">Beef</MenuItem>
            </Link>
            <Link href="/recipes/category/chicken" underline="none">
              <MenuItem value="chicken">Chicken</MenuItem>
            </Link>
            <Link href="/recipes/category/noodles" underline="none">
              <MenuItem value="noodles">Noodles</MenuItem>
            </Link>
            <Link href="/recipes/category/pasta" underline="none">
              <MenuItem value="pasta">Pasta</MenuItem>
            </Link>
            <Link href="/recipes/category/pork" underline="none">
              <MenuItem value="pork">Pork</MenuItem>
            </Link>
            <Link href="/recipes/category/rice" underline="none">
              <MenuItem value="rice">Rice & Grains</MenuItem>
            </Link>
            <Link href="/recipes/category/soup" underline="none">
              <MenuItem value="soup">Soup</MenuItem>
            </Link>
            <Link href="/recipes/category/vegetables" underline="none">
              <MenuItem value="vegetables">Vegetables</MenuItem>
            </Link>
            <Link href="/recipes/category/other" underline="none">
              <MenuItem value="other">Other</MenuItem>
            </Link>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="cuisine-label">Cuisine</InputLabel>
          <Select labelId="cuisine-label" id="cuisine" value="" label="cuisine">
            <Link href="/recipes/cuisine/african" underline="none">
              <MenuItem value="african">African Cuisine</MenuItem>
            </Link>
            <Link href="/recipes/cuisine/asian" underline="none">
              <MenuItem value="asian">Asian Cuisine</MenuItem>
            </Link>
            <Link href="/recipes/cuisine/carribean" underline="none">
              <MenuItem value="carribean">Carribean Cuisine</MenuItem>
            </Link>
            <Link href="/recipes/cuisine/central-american" underline="none">
              <MenuItem value="central-american">
                Central American Cuisine
              </MenuItem>
            </Link>
            <Link href="/recipes/cuisine/european" underline="none">
              <MenuItem value="european">European Cuisine</MenuItem>
            </Link>
            <Link href="/recipes/cuisine/middle-eastern" underline="none">
              <MenuItem value="middle-eastern">Middle Eastern Cuisine</MenuItem>
            </Link>
            <Link href="/recipes/cuisine/north-american" underline="none">
              <MenuItem value="north-american">North American Cuisine</MenuItem>
            </Link>
            <Link href="/recipes/cuisine/oceanic" underline="none">
              <MenuItem value="oceanic">Oceanic Cuisine</MenuItem>
            </Link>
            <Link href="/recipes/cuisine/south-america" underline="none">
              <MenuItem value="south-america">South American Cuisine</MenuItem>
            </Link>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="course-label">Course</InputLabel>
          <Select labelId="course-label" id="course" value="" label="course">
            <Link href="/recipes/course/appetizers" underline="none">
              <MenuItem value="appetizers">Appetizers</MenuItem>
            </Link>
            <Link href="/recipes/course/breakfast" underline="none">
              <MenuItem value="breakfast">Breakfast</MenuItem>
            </Link>
            <Link href="/recipes/course/desserts" underline="none">
              <MenuItem value="desserts">Desserts</MenuItem>
            </Link>
            <Link href="/recipes/course/mains" underline="none">
              <MenuItem value="mains">Mains</MenuItem>
            </Link>
            <Link href="/recipes/course/side" underline="none">
              <MenuItem value="sides">Sides</MenuItem>
            </Link>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="method-label">Method</InputLabel>
          <Select labelId="method-label" id="method" value="" label="method">
            <Link href="/recipes/method/air-fryer" underline="none">
              <MenuItem value="air-fryer">Air Fryer</MenuItem>
            </Link>
            <Link href="/recipes/method/one-pot" underline="none">
              <MenuItem value="one-pot">One Pot</MenuItem>
            </Link>
            <Link href="/recipes/method/pressure-cooker" underline="none">
              <MenuItem value="pressure-cooker">Pressure Cooker</MenuItem>
            </Link>
            <Link href="/recipes/method/slow-cooker" underline="none">
              <MenuItem value="slow-cooker">Slow Cooker</MenuItem>
            </Link>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="diet-label">Diet</InputLabel>
          <Select labelId="diet-label" id="diet" value="" label="diet">
            <Link href="/recipes/diet/dairy-free" underline="none">
              <MenuItem value="dairy-free">Dairy Free</MenuItem>
            </Link>
            <Link href="/recipes/diet/gluten-free" underline="none">
              <MenuItem value="gluten-free">Gluten Free</MenuItem>
            </Link>
            <Link href="/recipes/diet/paleo" underline="none">
              <MenuItem value="paleo">Paleo</MenuItem>
            </Link>
            <Link href="/recipes/diet/vegan" underline="none">
              <MenuItem value="vegan">Vegan</MenuItem>
            </Link>
            <Link href="/recipes/diet/vegetarian" underline="none">
              <MenuItem value="vegetarian">Vegetarian</MenuItem>
            </Link>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="rating-label">Rating</InputLabel>
          <Select labelId="rating-label" id="rating" value="" label="rating">
            <Link href="/recipes/highest" underline="none">
              <MenuItem value="highest">Highest Rated</MenuItem>
            </Link>
            <Link href="/recipes/rating/lowest" underline="none">
              <MenuItem value="lowest">Lowest Rated</MenuItem>
            </Link>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="popular-label">Popular</InputLabel>
          <Select labelId="popular-label" id="popular" value="" label="popular">
            <Link href="/recipes/popular" underline="none">
              <MenuItem value="popular">All Time</MenuItem>
            </Link>
            <Link href="/recipes/popular/month" underline="none">
              <MenuItem value="popthismonth">This Month</MenuItem>
            </Link>
            <Link href="/recipes/popular/week" underline="none">
              <MenuItem value="popthisweek">This Week</MenuItem>
            </Link>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="other-label">Other</InputLabel>
          <Select labelId="other-label" id="other" value="" label="other">
            <Link href="/recipes/all" underline="none">
              <MenuItem value="all">All Recipes</MenuItem>
            </Link>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default BrowseBar;
