import { getCurrentLocalTime } from "../../../utility"

export const resolvers = {
    Query: {
        getAllCategories: (_, __, { dataSources }) => {
            return dataSources.CategoryDB.getAllCategories()
        },
        getCategoryById: (_, { _id }, { dataSources }) => {
            return dataSources.CategoryDB.getCategoryById({ _id })
        },

        getAllSubCategories: (_, __, { dataSources }) => {
            return dataSources.SubCategoryDB.getAllSubCategories()
        },
        getSubCategoryById: (_, { _id, offset, limit  }, { dataSources }) => {
            return dataSources.SubCategoryDB.getSubCategoryById({ _id}, offset, limit)
        },
        getSubSubCatForSubCat: (_, { _id }, { dataSources }) => {
            return dataSources.SubSubCategoryDB.getSubSubCatForSubCat({ _id })
        },

        getAllSubSubCatForAllSubCats: async (_, __, { dataSources }) => {
            return await dataSources.SubSubCategoryDB.getAllSubSubCatForAllSubCats()
        },

        getAllSubSubCategories: (_, __, { dataSources }) => {
            return dataSources.SubSubCategoryDB.getAllSubSubCategories()
        },
        getSubSubCategoryById: (_, { _id, offset, limit }, { dataSources }) => {
            return dataSources.SubSubCategoryDB.getSubSubCategoryById({ _id }, offset, limit)
        },


        getAllProductGroups: (_, __, { dataSources }) => {
            return dataSources.ProductGroupDB.getAllProductGroups()
        },
        getProductGroupById: (_, { _id }, { dataSources }) => {
            return dataSources.ProductGroupDB.getProductGroupById({ _id })
        },


        getAllProducts: (_, __, { dataSources }) => {
            return dataSources.ProductDB.getAllProducts()
        },
        getProductById: (_, { _id }, { dataSources }) => {
            return dataSources.ProductDB.getProductById({ _id })
        },
        getSkusForAlfredSkuPage: async (_, {skuCode,skuName}, { dataSources }) => {
            return await dataSources.SkuDB.getSkusForAlfredSkuPage(skuCode,skuName)
        },
        getAllSkus: async (_, {offset,limit}, { dataSources }) => {
            return await dataSources.SkuDB.getAllSkus(offset,limit)
        },
        getAllSkusWithHookTag: async (_, {offset,limit}, { dataSources }) => {
            const tagIDs = await dataSources.TagTypeConstantDB.getAllTagIDsWithHookTagCoupons();
            return await dataSources.SkuDB.getAllSkusWithHookTag(offset, limit, tagIDs);
        },
        getSkuById: async (_, { _id }, { dataSources }) => {
            return await dataSources.SkuDB.getSkuById(_id)
        },
        getSkuBySkuCode: async (_, { skuCode }, { dataSources }) => {
            return await dataSources.SkuDB.getSkuBySkuCode(skuCode)
        },
        getSkuQuantityById: (_, { _id }, { dataSources }) => {
            return dataSources.SkuDB.getSkuQuantityById(_id);
        },
        getAllSkusByTagID: async (_, { tag, offset, limit }, { dataSources }) => {
            return await dataSources.SkuDB.getAllSkusByTagID(tag, offset, limit);
        },
        getAllSkuCodes: async (_, __, { dataSources}) => {
            return await dataSources.SkuDB.getAllSkuCodes();
        },
        getAllActiveSkuCodes: async (_, __, { dataSources}) => {
            return await dataSources.SkuDB.getAllActiveSkuCodes();
        },
        searchSku: async(_, { keyword, offset, limit }, {dataSources}) => {
            return await dataSources.SkuDB.searchSku(keyword, offset, limit);
        },
        autocompleteSku: async(_, { keyword }, {dataSources}) => {
            return await dataSources.SkuDB.autocompleteSku(keyword);
        },
        getDifferentProductCounts: async(_, __, {dataSources}) => {
            let categoryCount = await dataSources.CategoryDB.getCategoryCount();
            let productCount = await dataSources.ProductDB.getProductCount();
            let productGroupCount = await dataSources.ProductGroupDB.getProductGroupCount();
            let skuCount = await dataSources.SkuDB.getSkuCount();
            let subCategoryCount = await dataSources.SubCategoryDB.getSubCategoryCount();
            let subSubCategoryCount = await dataSources.SubSubCategoryDB.getSubSubCategoryCount();

            return {
                categoryCount,
                productCount,
                productGroupCount,
                skuCount,
                subCategoryCount,
                subSubCategoryCount
            };
        }
    },
    Mutation: {

        createCategory: async (_, { input }, { dataSources, authToken }) => {
            let userInput = JSON.parse(JSON.stringify(input));
            let resultFromDB = await dataSources.CategoryDB.createCategory(input, userInput);

            // We do not wait for category to get created on Unicommerce (This isn't our priority). 
            let resultFromUnicom = await dataSources.UnicomProductAPI.createCategory(userInput, authToken);

            console.log(getCurrentLocalTime(), ": ResultFromDB >> ", resultFromDB);
            console.log(getCurrentLocalTime(), ": ResultFromUnicom >> ", resultFromUnicom);

            resultFromDB.successUnicommerce = resultFromUnicom?.success;

            if (!resultFromUnicom?.success)
                resultFromDB.error = resultFromUnicom?.errors[0]?.description;

            return resultFromDB;

        },
        createSubCategory: (_, { input }, { dataSources }) => {
            return dataSources.SubCategoryDB.createSubCategory({ input });
        },
        createSubSubCategory: (_, { input }, { dataSources }) => {
            return dataSources.SubSubCategoryDB.createSubSubCategory({ input });
        },
        createProductGroup: (_, { input }, { dataSources }) => {
            return dataSources.ProductGroupDB.createProductGroup({ input });
        },
        createMultiplePGs:  (_, { input }, { dataSources }) => {
            return dataSources.ProductGroupDB.createMultiplePGs({ input });
        },
        createProduct: (_, { input }, { dataSources }) => {
            return dataSources.ProductDB.createProduct({ input });
        },
        createMultipleProduct: (_, {input}, {dataSources}) => {
            return dataSources.ProductDB.createMultipleProduct({input});
        },
        createSku: async (_, { input }, { dataSources, authToken }) => {

            let userInput = JSON.parse(JSON.stringify(input));
            let resultFromDB = await dataSources.SkuDB.createSku(input, userInput);

            let resultFromUnicom = await dataSources.UnicomProductAPI.createProduct(userInput, authToken);
            console.log(getCurrentLocalTime(), ": result From Unicom  >", resultFromUnicom);

            resultFromDB.successUnicommerce = resultFromUnicom?.success;
            resultFromDB.messageFromUnicommerce = resultFromUnicom?.message;

            return resultFromDB;
        },
        createMultipleSKUs: async (_, {input}, {dataSources, authToken}) => {
            
            let userInput = JSON.parse(JSON.stringify(input));
            let resultFromDB = await dataSources.SkuDB.createMultipleSKUs(input, userInput);

            let resultFromUnicom = await dataSources.UnicomProductAPI.createMultipleProduct(userInput, authToken);
            console.log(getCurrentLocalTime(), ": result From Unicom  >", resultFromUnicom);

            resultFromDB.successUnicommerce = resultFromUnicom?.success;
            resultFromDB.messageFromUnicommerce = resultFromUnicom?.message;

            return resultFromDB;

        },
        updateCategory: async (_, { _id, input }, { dataSources, authToken }) => {
            let userInput = JSON.parse(JSON.stringify(input));
            let resultFromDB = await dataSources.CategoryDB.updateCategory(_id, input, userInput);

            let resultFromUnicom = await dataSources.UnicomProductAPI.updateCategory(userInput, authToken);

            console.log(getCurrentLocalTime(), ": ResultFromDB >> ", resultFromDB);
            console.log(getCurrentLocalTime(), ": ResultFromUnicom >> ", resultFromUnicom);

            resultFromDB.successUnicommerce = resultFromUnicom?.success;
            resultFromDB.messageFromUnicommerce = resultFromUnicom?.message;


            return resultFromDB;

        },
        updateSubCategory: (_, { _id, input }, { dataSources }) => {
            return dataSources.SubCategoryDB.updateSubCategory({ _id, input });
        },
        updateSubSubCategory: (_, { _id, input }, { dataSources }) => {
            return dataSources.SubSubCategoryDB.updateSubSubCategory({ _id, input });
        },
        updateProductGroup: (_, { _id, input }, { dataSources }) => {
            return dataSources.ProductGroupDB.updateProductGroup({ _id, input });
        },
        updateProduct: (_, { _id, input }, { dataSources }) => {
            return dataSources.ProductDB.updateProduct({ _id, input });
        },
        updateSku: async (_, {input }, { dataSources, authToken }) => {

            // let userInput = JSON.parse(JSON.stringify(input));
            let resultFromDB = await dataSources.SkuDB.updateSku(input);

            // console.log(getCurrentLocalTime(), "Inside updateSKU > ");
             let resultFromUnicom = await dataSources.UnicomProductAPI.updateProduct(input, authToken);

            console.log(getCurrentLocalTime(), ": ResultFromUnicom >> ", resultFromUnicom);
            resultFromDB.successUnicommerce = resultFromUnicom?.success;
            resultFromDB.messageFromUnicommerce = resultFromUnicom?.message;

            return resultFromDB;
        },
        updateMultiplePGs:  (_, {input }, { dataSources }) => {
            return  dataSources.ProductGroupDB.updateMultiplePGs(input);
        },
        updateMultipleProduct:  (_, {input }, { dataSources }) => {
            return  dataSources.ProductDB.updateMultipleProduct(input);
        },
        updateMultipleSKUs: async (_, {input}, {dataSources, authToken}) => {
            
            // let userInput = JSON.parse(JSON.stringify(input));
            // console.log(getCurrentLocalTime(), "Input from updateMultipleSKUs >> ", input);
            let resultFromDB = await dataSources.SkuDB.updateMultipleSKUs(input);

            const resultFromUnicom = await dataSources.UnicomProductAPI.updateMultipleProduct(input, authToken);
            console.log(getCurrentLocalTime(), ": ResultFromUnicom >> ", resultFromUnicom);
            resultFromDB.successUnicommerce = resultFromUnicom?.success;
            resultFromDB.messageFromUnicommerce = resultFromUnicom?.message;

            return resultFromDB;
        },
        updateMultipleSKUsWithCentralOfferPrice: (_, { input }, {dataSources}) => {
            return dataSources.SkuDB.updateMultipleSKUsWithCentralOfferPrice(input);
        },

        updateSkuQuantity: (_, { skuCode, quantity }, { dataSources }) => {
            return dataSources.SkuDB.updateSkuQuantity(skuCode, quantity);
        },
        updateMultipleSKUsSpecialDiscountPercentage: (_, {input}, { dataSources }) => {
            return dataSources.SkuDB.updateMultipleSKUsSpecialDiscountPercentage(input);
        },
        changeSkuInventory: async (_, { _id, quantity }, { dataSources }) => {
            return await dataSources.SkuDB.changeSkuInventory(_id, quantity);
        }    
    }
}
