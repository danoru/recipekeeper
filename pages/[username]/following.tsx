import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Divider from "@mui/material/Divider";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Grid from "@mui/material/Grid";
import Head from "next/head";
import Link from "@mui/material/Link";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";
import ProfileLinkBar from "../../src/components/users/ProfileLinkBar";
import Stack from "@mui/material/Stack";
import {
  findUserByUsername,
  getAllUsers,
  getFollowing,
} from "../../src/data/users";
import { Users, Following } from "@prisma/client";

interface Props {
  user: Users;
  following: (Following & { users: Users })[];
}

interface Params {
  params: {
    username: string;
  };
}

function UserFollowing({ user, following }: Props) {
  const title = `${user.username}'s Friends • Savry`;

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid container>
        <Grid item xs={12}>
          <ProfileLinkBar username={user.username} />
        </Grid>
        <Grid item xs={12}>
          <ButtonGroup
            variant="outlined"
            aria-label="Button Group"
            sx={{ flexWrap: "wrap" }}
          >
            <Button href="following">Following</Button>
            <Button href="followers">Followers</Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={12}>
          <Stack
            spacing={1}
            divider={<Divider orientation="horizontal" flexItem />}
          >
            {following?.map((following) => (
              <Stack
                key={following.users.username}
                direction="row"
                sx={{ alignItems: "center", paddingLeft: "10px" }}
              >
                <div style={{ width: "25%" }}>
                  <Link href={`/${following.users.username}`} underline="none">
                    {following.users.username}
                  </Link>
                </div>
                <div style={{ width: "25%" }}>
                  <OutdoorGrillIcon />
                </div>
                <div style={{ width: "25%" }}>
                  <MenuBookIcon />
                </div>
                <div style={{ width: "25%" }}>
                  <FavoriteIcon />
                </div>
              </Stack>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
}

export async function getStaticPaths() {
  const users = await getAllUsers();
  const paths = users.map((user) => ({
    params: { username: user.username },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: Params) {
  const { username } = params;
  const user = await findUserByUsername(username);
  let following;

  if (user) {
    following = await getFollowing(user.id);
  }

  return {
    props: {
      user,
    },
    revalidate: 1800,
  };
}

export default UserFollowing;
