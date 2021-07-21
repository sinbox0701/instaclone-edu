import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
    try{
        if(!token){
            return null;
        }
        const {id} = await jwt.verify(token,process.env.SECRET_KEY);
        const user = await client.user.findUnique({ where: { id } });
        if(user){
            return user;
        }else{
            return null;
        }
    }catch{
        return null; 
    }
};

export const protectedResolver = (ourResolver) => (// 우리가 하는 mutation과 query를 가로채서 로그인 안했으면 --> ok:false, error 응답
    root,
    args,
    context,
    info
) => {
    if(!context.loggedInUser){
        const query = info.operation.operation === "query";
        if(query){
            return null;
        }
        else{
            return {
                ok:false,
                error:"로그인 하셈"
            };
        }
    }
    return ourResolver(root,args,context,info);
}
