import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent, useState } from "react";
import _ from "lodash";
import GroupsIcon from "@mui/icons-material/Groups";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { Search as SearchIcon } from "@mui/icons-material";
import { BoardResult } from "../../models/type/board";

const MOCK = {
  title: "Sofware Architecture",
  totalGroups: 7,
  totalMembers: 40,
  creator: "Duangdao W.",
  tag: "Skills",
  choices: ["Frontend", "Backend"],
};

const JoinBoardForm = () => {
  const [searchKey, setSearchKey] = useState("");
  const [boardResult, setBoardResult] = useState<BoardResult>();
  const [selectedChoice, setSelectedChoice] = useState("");

  const handleOnSearch = (e: FormEvent) => {
    e.preventDefault();
    setBoardResult(MOCK);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box component="form" onSubmit={handleOnSearch} sx={{ mt: 3 }}>
        <Typography variant="h5">Join a board</Typography>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={10}>
            <TextField
              name="search"
              fullWidth
              value={searchKey}
              onChange={(val) => {
                setSearchKey(val.target.value);
              }}
              id="search"
              label="Board ID"
              autoFocus
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton
              type="submit"
              aria-label="search"
              color="primary"
              size="large"
            >
              <SearchIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
      {boardResult && (
        <Box
          p={2}
          mt={4}
          display="flex"
          flexDirection="column"
          gap={2}
          border="1px solid #00000020"
          borderRadius={2}
        >
          <Typography variant="h5">{boardResult.title}</Typography>
          <Typography color="gray">
            Created by: {boardResult.creator}
          </Typography>
          <Grid container spacing={1}>
            <Grid
              item
              xs={4}
              display="flex"
              gap={1}
              color="gray"
              fontSize="10px"
            >
              <GroupsIcon />
              <Typography>{boardResult.totalGroups} groups</Typography>
            </Grid>
            <Grid
              item
              xs={4}
              display="flex"
              gap={1}
              color="gray"
              fontSize="10px"
            >
              <PermIdentityIcon />
              <Typography>{boardResult.totalMembers} joined</Typography>
            </Grid>
          </Grid>
          <FormControl fullWidth>
            <InputLabel id="choice-label">{boardResult.tag}</InputLabel>
            <Select
              id="choice"
              value={selectedChoice}
              label={boardResult.tag}
              onChange={(val) => setSelectedChoice(val.target.value)}
            >
              {boardResult.choices.map((choice) => (
                <MenuItem key={choice} value={choice}>
                  {choice}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained">Join</Button>
        </Box>
      )}
    </Container>
  );
};

export default JoinBoardForm;
