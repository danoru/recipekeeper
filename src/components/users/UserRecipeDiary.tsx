import React from "react";
import Grid from "@mui/material/Grid";
import moment from "moment";
import Typography from "@mui/material/Typography";
import { USER_LIST_TYPE, UserDiary } from "../../types";

interface Props {
  user: USER_LIST_TYPE;
}

function UserRecipeDiary({ user }: Props) {
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
    <Grid item>
      <Grid
        container
        sx={{
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: "theme.palette.secondary",
          justifyContent: "space-between",
          margin: "10px 0",
          maxWidth: "50%",
        }}
      >
        <Grid item>DIARY</Grid>
      </Grid>
      {Object.entries(entriesByMonth).map(([month, entries]) => (
        <div key={month}>
          <Typography variant="h6">{month}</Typography>
          {entries.slice(0, 10).map((entry, index) => (
            <Grid container key={index} spacing={2}>
              <Grid item xs={2}></Grid>
              <Grid item xs={2}>
                <Typography>{moment(entry.date).format("D")}</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>{entry.recipe}</Typography>
              </Grid>
            </Grid>
          ))}
        </div>
      ))}
    </Grid>
  );
}

export default UserRecipeDiary;
