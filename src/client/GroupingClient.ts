import axios from "axios"
import { CreateBoardRequest } from "groupo-shared-service/apiutils/messages"
import { getTokenHeader, groupingServiceHostPrefix } from "."

export const getBoards = async () => {
    const header = await getTokenHeader()
    const { data } = await axios.get(groupingServiceHostPrefix('/board'), header)
    return data.body
}

export const getBoard = () => {

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