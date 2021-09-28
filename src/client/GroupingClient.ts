import axios from "axios"
import { CreateBoardRequest, BoardInvitationRequest } from "groupo-shared-service/apiutils/messages"
import { getTokenHeader, groupingServiceHostPrefix } from "."
import { getProfile } from "./AuthClient"

export const getBoards = async () => {
    const header = await getTokenHeader()
    const { data } = await axios.get(groupingServiceHostPrefix('/board'), header)
    return data.body
}

export const getBoard = async (boardID: string) => {
    const header = await getTokenHeader()
    const { data } = await axios.get(groupingServiceHostPrefix(`/board/${boardID}`), header)
    return data.body
}

export const joinBoard = async (boardID: string) => {
    const header = await getTokenHeader()
    await axios.post(groupingServiceHostPrefix(`/board/${boardID}/join`), {}, header)
}

export const createBoard = async (params: CreateBoardRequest) => {
    const header = await getTokenHeader()
    await axios.post(groupingServiceHostPrefix('/board'), params, header)
    // console.log(data.body.boardID)
}

export const updateBoard = () => {

}

export const deleteBoard = () => {

}