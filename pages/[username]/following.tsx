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
import { getAllUsers } from "../../src/data/users";
import { USER_LIST_TYPE } from "../../src/types";

interface Props {
  user: USER_LIST_TYPE;
}

interface Params {
  params: {
    username: string;
  };
}

function UserFollowing(props: Props) {
  const { user } = props;
  const title = `${user.profile.name}'s Friends • Savry`;
  const following = getAllUsers().filter((u) =>
    user.following?.includes(u.username)
  );

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
            {following.map((user) => (
              <Stack
                key={user.username}
                direction="row"
                sx={{ alignItems: "center", paddingLeft: "10px" }}
              >
                <div style={{ width: "25%" }}>
                  <Link href={`/${user.username}`} underline="none">
                    {user.username}
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
  const users = getAllUsers();
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
  const user = getAllUsers().find((user) => user.username === username);

  return {
    props: {
      user,
    },
    revalidate: 1800,
  };
}

export default UserFollowing;
