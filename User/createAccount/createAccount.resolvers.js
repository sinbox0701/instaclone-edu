import client from "../../client";
import bcrypt from "bcrypt";

export default{
    Mutation:{
        createAccount: async (_,args) => {
            const {
                firstName,
                lastName,
                username,
                email,
                password
            } = args;
            try{
                const existingUser = await client.user.findFirst({
                    where:{
                        OR:[
                            {username},
                            {email}
                        ]
                    }
                });
                if(existingUser){
                    throw new Error("이미 존재하는 사용자입니다!");
                }
                const uglyPassword = await bcrypt.hash(password,10);
                
                return client.user.create({
                    data:{
                        username,
                        email,
                        lastName,
                        firstName,
                        password:uglyPassword
                    }
                });
            }catch(e){
                return e;
            }
        },
    },
}