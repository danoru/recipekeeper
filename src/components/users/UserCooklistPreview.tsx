import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { Cooklist, Recipes } from "@prisma/client";

import { toSlug } from "../../data/helpers";

interface Props {
  cooklist: (Cooklist & { recipes: Recipes })[];
}

function UserCooklistPreview({ cooklist }: Props) {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 1,
          mb: 2,
        }}
      >
        <Typography
          variant="overline"
          sx={{
            fontSize: "0.65rem",
            letterSpacing: "0.14em",
            color: "text.disabled",
          }}
        >
          Cooklist
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {cooklist?.length ?? 0}
        </Typography>
      </Box>

      {cooklist?.length === 0 ? (
        <Typography variant="body2" color="text.disabled" sx={{ py: 2 }}>
          Nothing on the cooklist yet.
        </Typography>
      ) : (
        <Grid container spacing={0.5}>
          {cooklist.map((item, i) => (
            <TinyCard
              key={`cooklist-${i}`}
              image={item.recipes.image}
              link={`/recipes/${toSlug(item.recipes.name)}`}
              name={item.recipes.name}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
}

interface TinyCardProps {
  image: string;
  link: string;
  name: string;
}

function TinyCard({ image, link, name }: TinyCardProps) {
  return (
    <Tooltip title={name} placement="top" arrow>
      <Grid item sx={{ m: "2px" }}>
        <Link href={link} underline="none">
          <Card
            sx={{
              position: "relative",
              height: 105,
              width: 70,
              cursor: "pointer",
              overflow: "hidden",
              borderRadius: 1,
              "&:hover .overlay-border": {
                borderColor: "rgba(255,255,255,0.85)",
              },
              "&:hover .card-image": { filter: "brightness(0.65)" },
            }}
          >
            <CardMedia
              className="card-image"
              sx={{
                position: "absolute",
                inset: 0,
                filter: "brightness(0.45)",
                transition: "filter 0.25s ease",
              }}
            >
              <Image
                src={image}
                alt={name}
                fill
                style={{ objectFit: "cover" }}
              />
            </CardMedia>
            <Box
              className="overlay-border"
              sx={{
                position: "absolute",
                inset: "5px",
                border: "1.5px solid rgba(255,255,255,0.4)",
                borderRadius: 0.5,
                pointerEvents: "none",
                transition: "border-color 0.25s ease",
              }}
            />
          </Card>
        </Link>
      </Grid>
    </Tooltip>
  );
}

export default UserCooklistPreview;
