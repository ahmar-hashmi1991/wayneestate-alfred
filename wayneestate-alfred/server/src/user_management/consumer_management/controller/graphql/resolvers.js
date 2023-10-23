export const resolvers = {
    Query: {
        getConsumerByID: (_, {_id}, { dataSources}) => {
           return dataSources.ConsumerDB.getConsumerByID({_id});
        },
        getAllConsumers: (_, __, {dataSources}) => {
            return dataSources.ConsumerDB.getAllConsumers();
        }

    },
    Mutation: {

        createConsumer: async (_, {input}, {dataSources}) => {
            let resultFromDB = await dataSources.ConsumerDB.createConsumer({input});
            return resultFromDB;
        },
        updateConsumer: async (_, {_id, input}, {dataSources}) => {
            let resultFromDB = await dataSources.ConsumerDB.updateConsumer(_id, input);
            return resultFromDB;
        }

    }
}

