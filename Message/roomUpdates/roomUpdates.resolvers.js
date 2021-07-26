import { withFilter } from "apollo-server";
import client from "../../client";
import { NEW_MESSAGE } from "../../constant";
import pubsub from "../../pubsub";

export default {
    Subscription:{
        roomUpdates:{
            subscribe: async (root,args,context,info) => {
                const {id} = args;
                const room = await client.room.findFirst({
                    where:{
                        id,
                        users:{
                            some:{
                                id:context.loggedInUser.id
                            }
                        }
                    },
                    select:{
                        id:true
                    }
                });
                if(!room){
                    throw new Error("방이 없습니다.");
                }
                return withFilter(
                    () => pubsub.asyncIterator(NEW_MESSAGE),
                    async ({roomUpdates},{id},{loggedInUser}) => {
                        if(roomUpdates.roomId === id){
                            const room = await client.room.findFirst({
                                where:{
                                    id,
                                    users:{
                                        some:{
                                            id:loggedInUser.id
                                        }
                                    }
                                },
                                select:{
                                    id:true
                                }
                            });
                            if(!room){
                                return false;
                            }
                            return true
                        }
                    }//filtering 조건
                )(root,args,context,info);
            }
        }
    }
}