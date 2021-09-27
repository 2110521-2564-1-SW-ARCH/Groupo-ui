import { Box, Container, Typography } from "@mui/material";
import { BoardResponse } from "groupo-shared-service/apiutils/messages";
import { useEffect, useState } from "react";
import { getBoards } from "../../client/GroupingClient";
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
  const [boards, setBoards] = useState<Array<BoardResponse>>([])

  useEffect(() => {
    (async () => {
      const res = await getBoards();
      setBoards(res)
    })();
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 3 }}>
        <Typography variant="h5">My groups</Typography>
        <Box display="flex" flexDirection="column" mt={2} gap={1}>
          {boards.map((board) => (
            <BoardListItem
              title={board.name}
              totalGroups={board.totalGroup}
              totalMembers={board.totalMember}
              isGrouped={board.isAssign}
            />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default BoardList;
