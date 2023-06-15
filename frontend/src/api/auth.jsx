import Client from "./Client"

export const createuser=async (userInfo)=>{
    try{
        const {data}=await  Client.post('/user/user-create',userInfo)
        return data;
    }
    catch (error){
        const {response}=error
        if(response?.data) return response.data
        return{error:error.message||error}

    }
}