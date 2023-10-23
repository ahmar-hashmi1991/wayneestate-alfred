import { gql} from 'apollo-server-express';

export const typeDefs = gql`

  extend  type Query {
        "Get faq details using faqId"
        getFaqById(_id:ID!): Faq!
        "Get all Faqs"
        getAllFaqs: [Faq]
        

    }

    type Mutation {
        createFaq(input: FaqInput): FaqResponse
       
        updateFaq(_id:ID!,input:FaqInput): FaqResponse
        
    }

#Inputs 

    input FaqsInput {
        faqIndex: Int
        faqCategory: String
        faqQuestion: String
        faqAnswer: String
        faqIsActive: Boolean
         
    }

    input FaqInput {
        faqs: [FaqsInput]
    }

    type FaqResponse {
       
        
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated faq after a successful mutation"
        faq: Faq
    }

    
    type Review {
      
        "Reference to a product that is reviewed"
        product: Product
        "Reference to the business owner that created the review"
        boDetail: BoDetail
        "Full name of the reviewer"
        reviewFullName: String
        "Title of the review"
        reviewTitle: String
        "Review details"
        review: String
        "List of images for a review"
        reviewImages: [String]
        "List of videos for a review "
        reviewVideos: [String]
        "Ratings for a review "
        reviewRating: Int
        "Created date for a review"
        reviewCreatedAt: String
         
         
    }

    type Faqs {
       
        "index number for a faq"
        faqIndex: Int
        "Category for a Faq"
        faqCategory: String
        "Question part of a faq"
        faqQuestion: String
        "Answer part of a faq"
        faqAnswer: String
        "Flag to mark if a faq is active"
        faqIsActive: Boolean
        
         
    }
    type Faq {
        _id: ID!
        "Reference to a list of faqs"
        faqs: [Faqs]
         
         
    }


`;
