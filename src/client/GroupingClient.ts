import axios from "axios"
import { CreateBoardRequest } from "groupo-shared-service/apiutils/messages"
import { getTokenHeader, groupingServiceHostPrefix } from "."

export const getBoards = async () => {
    const header = await getTokenHeader()
    const { data } = await axios.get(groupingServiceHostPrefix('/board/'), header)
    return data.body
}

export const getBoard = async (boardID: string) => {
    const header = await getTokenHeader()
    const { data } = await axios.get(groupingServiceHostPrefix(`/board/${boardID}/`), header)
    return data.body
}

export const getMemberTags = async (boardID: string): Promise<string[]> => {
    const header = await getTokenHeader()
    const { data } = await axios.get(groupingServiceHostPrefix(`/board/${boardID}/member/tags`), header)
    return data.body || []
}

export const updateMemberTags = async (boardID: string, tags: string[]) => {
    const header = await getTokenHeader()
    await axios.put(groupingServiceHostPrefix(`/board/${boardID}/member/tags`), tags, header)
}

export const joinBoard = async (boardID: string) => {
    const header = await getTokenHeader()
    await axios.post(groupingServiceHostPrefix(`/board/${boardID}/join/`), {}, header)
}

export const createBoard = async (params: any) => {
    const header = await getTokenHeader()
    await axios.post(groupingServiceHostPrefix('/board/'), params, header)
    // console.log(data.body.boardID)
}

// export const deleteBoard = async (boardID: string) => {
//     const header = await getTokenHeader()
//     await axios.put(groupingServiceHostPrefix(`/board/delete/${boardID}/`), header)
// }