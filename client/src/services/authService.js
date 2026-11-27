import api from "./api";

// #region REGISTER
export const registerUser= async(userData)=>{

    const response = await api.post("/auth/register",userData);
    return response.data;    
};
//#endregion

//#region LOGIN
export const loginUser= async(userData)=>{
    const response = await api.post("/auth/login",userData);
    return response.data;    
}
//#endregion

export const getUserprofile = async()=>{
    const response = await api.get("/user/profile");
    return response.data;
}