import axios from "axios"
import { checkToken, groupingServiceHostPrefix } from "."

export const getBoards = async () => {
    const token = await checkToken()
    const { data } = await axios.get(groupingServiceHostPrefix('/board'), {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return data.body
}

export const getBoard = () => {

}

export const createBoard = () => {

}

export const updateBoard = () => {

}

export const deleteBoard = () => {

}