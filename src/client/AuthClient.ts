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
    const { data } = await axios.post(UserServiceHostPrefix('/user/login'), { email, password })
    if(data.status === 200) {
        localStorage.setItem("user", JSON.stringify(data.body));
    }
    return data.status;
}

export const logout = async () => {
    localStorage.removeItem("user");
}