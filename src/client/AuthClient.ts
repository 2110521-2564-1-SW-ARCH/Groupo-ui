import axios from "axios"
import { userServiceHostPrefix } from "."
import { LoginRequest, RegisterRequest } from "groupo-shared-service/apiutils/messages"

export const signUp = async (params: RegisterRequest) => {
    await axios.post(userServiceHostPrefix('/profile'), params);
    await login({ email: params.email, password: params.password });
}

export const login = async (params: LoginRequest) => {
    const { data } = await axios.post(userServiceHostPrefix('/auth/login'), params)
    localStorage.setItem("user", JSON.stringify(data.body));
}

export const logout = async () => {
    // await axios.post(userServiceHostPrefix('/user/logout))
    localStorage.removeItem("user");
}

export const getProfile = async () => {
    
}