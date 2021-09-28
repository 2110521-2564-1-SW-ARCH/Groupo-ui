import axios from "axios"
import { getTokenHeader, groupingServiceHostPrefix } from "."

export const getBoards = async () => {
    const header = await getTokenHeader()
    const { data } = await axios.get(groupingServiceHostPrefix('/board'), header)
    return data.body
}

export const getBoard = () => {

}

export const createBoard = async () => {
    
}

export const updateBoard = () => {

}

export const deleteBoard = () => {

}