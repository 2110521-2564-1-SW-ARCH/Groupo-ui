export const UserServiceHostPrefix = (url: string) => {
    return `${process.env.REACT_APP_USER_SERVICE_HOST}${url}`
}