import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Grid from "@mui/material/Grid";
import Head from "next/head";
import Link from "@mui/material/Link";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { getAllUsers } from "../../src/data/users";
import { Users } from "@prisma/client";

interface Props {
  users: Users[];
}

function Members({ users }: Props) {
  const filteredUsers = users.filter((user) => user.username !== "guest");

  return (
    <div>
      <Head>
        <title>Members • Savry</title>
      </Head>
      <Grid container justifyContent="center">
        <Grid item sx={{ textAlign: "center" }} xs={12}>
          <h2>Food lovers, critics and friends — find popular members.</h2>
        </Grid>
        <Grid item xs={8}>
          <Stack
            spacing={1}
            divider={<Divider orientation="horizontal" flexItem />}
          >
            {filteredUsers.map((user) => (
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
                  <Link href={`/${user.username}/recipes`} underline="none">
                    <Tooltip
                      title={`${user.username}'s Recipes`}
                      placement="top-start"
                    >
                      <OutdoorGrillIcon />
                    </Tooltip>
                  </Link>
                </div>
                <div style={{ width: "25%" }}>
                  <Link href={`/${user.username}/cooklist`} underline="none">
                    <Tooltip
                      title={`${user.username}'s Cooklist`}
                      placement="top-start"
                    >
                      <MenuBookIcon />
                    </Tooltip>
                  </Link>
                </div>
                <div style={{ width: "25%" }}>
                  <Link href={`/${user.username}/likes`} underline="none">
                    <Tooltip
                      title={`${user.username}'s Likes`}
                      placement="top-start"
                    >
                      <FavoriteIcon />
                    </Tooltip>
                  </Link>
                </div>
                <div style={{ width: "25%" }}>
                  <Button disabled>
                    <Add />
                  </Button>
                </div>
              </Stack>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
}

export async function getStaticProps() {
  const users = await getAllUsers();

  return {
    props: {
      users,
    },
    revalidate: 1800,
  };
}

export default Members;
