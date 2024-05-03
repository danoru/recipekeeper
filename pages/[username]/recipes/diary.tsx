import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid";
import Head from "next/head";
import moment from "moment";
import ProfileLinkBar from "../../../src/components/users/ProfileLinkBar";
import StarRating from "../../../src/review/StarRating";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { getAllUsers } from "../../../src/data/users";
import { USER_LIST_TYPE, UserDiary } from "../../../src/types";
import { getAllRecipes } from "../../../src/data/recipes";

interface Props {
  user: USER_LIST_TYPE;
}

interface Params {
  params: {
    username: string;
  };
}

function RecipeDiary({ user }: Props) {
  const title = `${user.profile.name}'s Recipes • Savry`;
  const diaryEntries = user.diary;
  const entriesByMonth: { [month: string]: UserDiary[] } = {};
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
                    <TableCell>{entry.recipe}</TableCell>
                    <TableCell>
                      {entry.rating !== undefined && (
                        <StarRating rating={entry.rating} />
                      )}
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

  const recipes = getAllRecipes().filter((recipe) =>
    user?.diary?.some((entry) => entry.recipe === recipe.name)
  );

  return {
    props: {
      recipes,
      user,
    },
    revalidate: 1800,
  };
}

export default RecipeDiary;
