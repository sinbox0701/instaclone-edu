import client from "../../client";
import { protectedResolver } from "../../User/User.utils";

export default {
    Query:{
        seeRoom:protectedResolver(async(_,{id},{loggedInUser})=>client.room.findFirst({
            where:{
                id,
                users:{
                    some:{
                        id:loggedInUser.id
                    }
                }
            }
        }))
    }
}