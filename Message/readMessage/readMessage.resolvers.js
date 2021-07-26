import client from "../../client";
import { protectedResolver } from "../../User/User.utils";

export default {
    Mutation:{
        readMessage:protectedResolver(async(_,args,{loggedInUser})=>{
            const {id} = args;
            const message = await client.message.findFirst({
                where:{
                    id,
                    userId:{
                        not:loggedInUser.id
                    },
                    room:{
                        users:{
                            some:{
                                id:loggedInUser.id
                            }
                        }
                    }
                },
                select:{
                    id:true
                }
            });
            if(!message){
                return {
                    ok:false,
                    error:"메세지가 존재하지 않습니다!"
                };
            }
            await client.message.update({
                where:{
                    id
                },
                data:{
                    read:true
                }
            });
            return {
                ok:true
            }
        })
    }
}