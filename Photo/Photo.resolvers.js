import client from "../client"

export default {
    Photo: {
        user: ({userId}) => {
            return client.user.findUnique({where:{id:userId}})
        },
        hashtags:({id}) => client.hashtag.findMany({where:{
            photos:{
                some:{
                    id
                }
            }
        }})
    },
    Hashtag:{
        photos:({id},{page},{loggedInUser})=>{
            if(!loggedInUser){
                return false;
            }
            return client.hashtag.findUnique({
                where:{
                    id
                }
            }).photos({
                take:5,
                skip:(page-1)*5
            });
        },
        totalPhotos:({id})=>{
            return client.photo.count({
                where:{
                    hashtags:{
                        some:{
                            id
                        }
                    }
                }
            });
        }
    }
}