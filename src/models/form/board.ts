import * as yup from "yup";

export const createBoardFormConfig = {
    initialValues: {
        boardName: "",
        totalGroup: 2,
        tag: "",
        choices: []
    },
    validationSchema: yup.object({
        boardName: yup.string().required("Board name is requried"),
        totalGroup: yup.number().min(2, "There must be at least a total of 2 groups"),
        tag: yup
            .string()
            .required("Tag name is required"),
        choices: yup
            .array()
            .min(2, "There must be at least 2 choices")
    })
};