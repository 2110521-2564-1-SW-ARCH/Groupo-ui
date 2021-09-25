import axios from "axios"
import { UserServiceHostPrefix } from "."

export const signUp = async (params: {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    agreement: boolean,
}) => {
    return await axios.post(UserServiceHostPrefix('/user/register'), { params })
}

export const login = async (email: string, password: string) => {
    return await axios.post(UserServiceHostPrefix('/user/register'), { email, password })
}

export const logout = async () => {

}