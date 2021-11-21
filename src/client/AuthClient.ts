import axios from "axios"
import { getTokenHeader, userServiceHostPrefix } from "."
import { LoginRequest, RegisterRequest } from "groupo-shared-service/apiutils/messages"

export const signUp = async (params: RegisterRequest) => {
    await axios.post(userServiceHostPrefix('/profile/'), params);
    await login({ email: params.email, password: params.password });
}

export const login = async (params: LoginRequest) => {
    const { data } = await axios.post(userServiceHostPrefix('/auth/login/'), params)
    localStorage.setItem("user", JSON.stringify(data.body));
}

export const logout = async () => {
    // await axios.post(userServiceHostPrefix('/user/logout))
    localStorage.removeItem("user");
}

export const getProfile = () => {
    const currentToken = JSON.parse(localStorage.getItem("user")!);
    const accessTokenInformation = JSON.parse(atob(currentToken.accessToken.split(".")[1]));
    return accessTokenInformation.email
}

export const getProfileDeep = async () => {
    const header = await getTokenHeader()
    const { data } = await axios.get(userServiceHostPrefix(`/profile/`), header)
    return data.body
}

export const updateProfile = async (data: any) => {
    const header = await getTokenHeader()
    await axios.patch(userServiceHostPrefix('/profile/'), data, header)
}