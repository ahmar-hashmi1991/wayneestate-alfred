export const resolvers = {
    Query: {
        getAllFaqs: (_, __, {dataSources}) => {
            return dataSources.FaqDB.getAllFaqs();
        },
        getFaqById: (_, {_id}, {dataSources}) => {
            return dataSources.FaqDB.getFaqById(_id)
        }
    },
    Mutation: {
        
        createFaq: (_, {input}, {dataSources}) => {
            return dataSources.FaqDB.createFaq({input});
        },
        updateFaq: (_, {_id, input}, {dataSources}) => {
            return dataSources.FaqDB.updateFaq({_id, input});
        },
    }
}
