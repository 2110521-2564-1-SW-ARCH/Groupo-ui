import axios from "axios";
import { RefreshRequest } from "groupo-shared-service/apiutils/messages";

export const getTokenHeader = async () => {
    const currentToken = JSON.parse(localStorage.getItem("user")!);
    const accessTokenInformation = JSON.parse(atob(currentToken.accessToken.split(".")[1]));
    if (accessTokenInformation.exp * 1000 < Date.now()) {
        const params: RefreshRequest = { refreshToken: currentToken.refreshToken }
        const { data } = await axios.post(userServiceHostPrefix('/auth/refresh'), params)
        localStorage.setItem("user", JSON.stringify(data.body));
    }
    const token = JSON.parse(localStorage.getItem("user")!).accessToken
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
}

export const userServiceHostPrefix = (url: string) => {
    return `${process.env.REACT_APP_USER_SERVICE_HOST}${url}`
}

export const groupingServiceHostPrefix = (url: string) => {
    return `${process.env.REACT_APP_GROUPING_SERVICE_HOST}${url}`
}