import { Box, Container, Typography } from "@mui/material";
import { BoardResponse } from "groupo-shared-service/apiutils/messages";
import { useEffect, useState } from "react";
import { getBoards } from "../../client/GroupingClient";
import { BoardItem } from "../../models/type/board";
import BoardListItem from "../BoardListItem";

const BoardList = () => {
	const [boards, setBoards] = useState<Array<BoardItem>>([])

	useEffect(() => {
		(async () => {
			const res = await getBoards();
			const boards: Array<BoardItem> = res.map((board: BoardResponse) => {
				return {
					boardID: board.boardID,
					name: board.name,
					totalGroup: board.totalGroup,
					totalMember: board.totalMember,
					isAssign: board.isAssign,
				}
			})
			setBoards(boards)
		})();
		console.log("boards =",boards);
	}, []);

	return (
		<Container component="main" maxWidth="xs">
			<Box sx={{ mt: 3 }}>
				<Typography variant="h5">My groups</Typography>
				<Box display="flex" flexDirection="column" mt={2} gap={1}>
					{boards.map((board: BoardItem) => (
						<BoardListItem board={board} key={board.boardID}/>
					))}
				</Box>
			</Box>
		</Container>
	);
};

export default BoardList;
