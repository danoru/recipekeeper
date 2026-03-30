import { Box, Card, CardMedia, Grid, Link, Tooltip } from "@mui/material";
import Image from "next/image";

interface TinyCardProps {
  image: string;
  link: string;
  name: string;
}

export default function TinyCard({ image, link, name }: TinyCardProps) {
  return (
    <Tooltip arrow placement="top" title={name}>
      <Grid sx={{ m: "2px" }}>
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
              <Image fill alt={name} src={image} style={{ objectFit: "cover" }} />
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
