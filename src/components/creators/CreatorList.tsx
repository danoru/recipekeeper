import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Creators } from "@prisma/client";

import CreatorCard from "../cards/CreatorCard";

interface Props {
  creators: Creators[];
  header: string;
  style?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "caption"
    | "button"
    | "overline"
    | undefined;
}
function CreatorList({ creators, header, style }: Props) {
  const styledHeader = header.toUpperCase();
  const typographyStyle = style || "h6";

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
        <Typography component="div" variant={typographyStyle}>
          {styledHeader}
        </Typography>
      </Grid>
      <Grid
        container
        item
        columnSpacing={2}
        rowSpacing={1}
        sx={{
          margin: "10px auto",
          maxWidth: "75%",
        }}
      >
        {creators.map((creator: any, i: number) => (
          <CreatorCard
            key={`card-${i}`}
            image={creator.image}
            link={`creators/${creator.link}`}
            name={creator.name}
          />
        ))}
      </Grid>
    </Grid>
  );
}

export default CreatorList;
