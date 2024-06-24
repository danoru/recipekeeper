import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid";
import Head from "next/head";
import moment from "moment";
import ProfileLinkBar from "../../../src/components/users/ProfileLinkBar";
import Rating from "@mui/material/Rating";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { findUserByUsername, getAllUsers } from "../../../src/data/users";
import { DiaryEntries, Recipes, Users } from "@prisma/client";
import { getUserDiaryEntries } from "../../../src/data/diary";

interface Props {
  user: Users;
  diaryEntries: (DiaryEntries & { recipes: Recipes })[];
}

interface Params {
  params: {
    username: string;
  };
}

function RecipeDiary({ user, diaryEntries }: Props) {
  const title = `${user.username}'s Recipes • Savry`;

  const entriesByMonth: {
    [month: string]: (DiaryEntries & { recipes: Recipes })[];
  } = {};
  diaryEntries?.forEach((entry) => {
    const date = moment(entry.date);
    const month = date.format("MMM");
    if (!entriesByMonth[month]) {
      entriesByMonth[month] = [];
    }
    entriesByMonth[month].push(entry);
  });

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid container>
        <ProfileLinkBar username={user.username} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>MONTH</TableCell>
                <TableCell>DAY</TableCell>
                <TableCell>RECIPES</TableCell>
                <TableCell>RATING</TableCell>
                <TableCell>REMADE</TableCell>
                <TableCell>REVIEW</TableCell>
                <TableCell>EDIT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(entriesByMonth).map(([month, entries]) =>
                entries.slice(0, 10).map((entry, index) => (
                  <TableRow key={`${month}-${index}`}>
                    <TableCell>{month}</TableCell>
                    <TableCell>{moment(entry.date).format("D")}</TableCell>
                    <TableCell>{entry.recipes.name}</TableCell>
                    <TableCell>
                      <Rating
                        value={entry.rating.toNumber()}
                        precision={0.5}
                        readOnly
                      />
                    </TableCell>
                    <TableCell>
                      {entry.hasCookedBefore ? <ChangeCircleIcon /> : ""}
                    </TableCell>
                    <TableCell>{entry.comment || "N/A"}</TableCell>
                    <TableCell>
                      <EditIcon />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
  let diaryEntries: DiaryEntries[] = [];

  if (user) {
    diaryEntries = await getUserDiaryEntries(user.id);
  }

  return {
    props: {
      diaryEntries,
      user,
    },
    revalidate: 1800,
  };
}

export default RecipeDiary;
