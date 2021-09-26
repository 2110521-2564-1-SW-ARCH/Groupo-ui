import { Box, Container, Typography, Grid } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { Link } from "react-router-dom";

import "./style.css";

type Props = {
  title: string;
  totalGroups: number;
  totalMembers: number;
  isGrouped: boolean;
};

const BoardListItem = ({
  title,
  totalGroups,
  totalMembers,
  isGrouped,
}: Props) => {
  return (
    <Box p={1} borderRadius={2} border="1px solid #00000020">
      <Box
        style={{
          borderLeft: "4px solid",
          borderLeftColor: isGrouped ? "#039BE5" : "#E53935",
        }}
        pl={1}
        display="flex"
        flexDirection="column"
        gap={0.5}
      >
        <Link to="/" className="title">
          <Typography variant="h5">{title}</Typography>
        </Link>
        <Grid container spacing={1}>
          <Grid item xs={4} display="flex" gap={1} color="gray" fontSize="10px">
            <GroupsIcon />
            <Typography>{totalGroups} groups</Typography>
          </Grid>
          <Grid item xs={4} display="flex" gap={1} color="gray" fontSize="10px">
            <PermIdentityIcon />
            <Typography>{totalMembers} joined</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default BoardListItem;
