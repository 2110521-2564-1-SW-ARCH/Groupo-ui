import { Box, Container, Typography } from "@mui/material";
import BoardListItem from "../BoardListItem";

const MOCKING = [
  {
    title: "SE2",
    totalGroups: 14,
    totalMembers: 120,
    isGrouped: true,
  },
  {
    title: "Software Architecture",
    totalGroups: 7,
    totalMembers: 40,
    isGrouped: false,
  },
];

const BoardList = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 3 }}>
        <Typography variant="h5">My groups</Typography>
        <Box display="flex" flexDirection="column" mt={2} gap={1}>
          {MOCKING.map((board) => (
            <BoardListItem
              title={board.title}
              totalGroups={board.totalGroups}
              totalMembers={board.totalMembers}
              isGrouped={board.isGrouped}
            />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default BoardList;
