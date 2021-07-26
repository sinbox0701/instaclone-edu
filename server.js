require('dotenv').config();
import express from "express";
import logger from "morgan";
import {ApolloServer} from "apollo-server-express";
import {typeDefs,resolvers} from "./schema";
import { getUser } from "./User/User.utils";

const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req}) => {
        return {
            loggedInUser: await getUser(req.headers.token)
        }
    }
});

const PORT = process.env.PORT;

const app = express();
apollo.installSubscriptionHandlers(app); //이부분!
app.use(logger("tiny"));

apollo.applyMiddleware({app}); 
app.use("/static",express.static("uploads"));

app.listen(
    {port:PORT},
    () => {
        console.log(`Server is running on http://localhost:${PORT}/graphql`)
    }
);