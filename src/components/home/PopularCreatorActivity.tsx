import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { CREATOR_LIST_TYPE, USER_LIST_TYPE } from "../../types";
import { findUserByUsername } from "../../data/users";

interface Props {
  creators: CREATOR_LIST_TYPE[];
  sessionUser: USER_LIST_TYPE;
}

function PopularCreatorActivity({ creators, sessionUser }: Props) {
  function getTopLikedCreators(followingList: string[]) {
    const creatorCount: { [key: string]: number } = {};

    followingList.forEach((username) => {
      const user = findUserByUsername(username);
      if (user && user.liked && user.liked.creators) {
        user.liked.creators.forEach((creator) => {
          if (creatorCount[creator]) {
            creatorCount[creator]++;
          } else {
            creatorCount[creator] = 1;
          }
        });
      }
    });

    const sortedCreators = Object.entries(creatorCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([creator]) => creator);
    return sortedCreators;
  }

  let topLikedCreators: string[] = [];

  if (sessionUser) {
    const followingList = sessionUser.following ?? [];
    topLikedCreators = getTopLikedCreators(followingList);
  }

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
          margin: "0 auto",
          width: "75%",
        }}
      >
        <Typography variant="overline" component="div">
          CREATORS POPULAR WITH FRIENDS
        </Typography>
      </Grid>
      <Grid
        container
        item
        rowSpacing={1}
        columnSpacing={2}
        sx={{
          margin: "10px auto",
          maxWidth: "75%",
        }}
      >
        {topLikedCreators.map((creatorName, i) => {
          const creator = creators.find((c) => c.link === creatorName);
          if (!creator) return null;
          return (
            <CreatorCard
              key={`card-${i}`}
              name={creator.name}
              image={creator.image}
              link={`creators/${creator.link}`}
              sx={{
                height: "100%",
                width: "100%",
              }}
            />
          );
        })}
      </Grid>
    </Grid>
  );
}

function CreatorCard(props: any) {
  return (
    <Grid item>
      <Link href={props.link} underline="none">
        <Card
          sx={{
            width: "250px",
            height: "250px",
            cursor: "pointer",
          }}
        >
          <CardMedia
            sx={{ height: 140 }}
            image={props.image}
            title={props.name}
          />
          <CardContent>
            <Typography variant="h6" component="div">
              {props.name}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}

export default PopularCreatorActivity;
