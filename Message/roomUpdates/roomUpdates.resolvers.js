import { withFilter } from "apollo-server";
import client from "../../client";
import { NEW_MESSAGE } from "../../constant";
import pubsub from "../../pubsub";

export default {
    Subscription:{
        roomUpdates:{
            subscribe: async (root,args,context,info) => {
                const {id} = args;
                const room = await client.room.findUnique({
                    where:{
                        id
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
                    ({roomUpdates},{id}) => {
                        return roomUpdates.roomId === id;
                    }//filtering 조건
                )(root,args,context,info);
            }
        }
    }
}