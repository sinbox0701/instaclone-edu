import client from "../../client"
import { protectedResolver } from "../../User/User.utils"

export default {
    Query:{
        seeFeed: protectedResolver((_,__,{loggedInUser})=>{
            client.photo.findMany({
                where:{
                    OR:[
                        {
                            user:{
                                followers:{
                                    some:{
                                        id:loggedInUser.id
                                    }
                                }
                            }
                        },
                        {
                            userId:loggedInUser.id
                        }
                    ]
                },
                orderBy:{
                    createdAt:"desc"
                }
            });//find 조건 내가 올린 포토 or 내가 팔로우하는 사람 포토
        })
    }
}