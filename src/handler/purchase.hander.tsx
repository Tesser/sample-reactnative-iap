
import { RequestPurchaseAndroid, RequestPurchaseIOS, getAvailablePurchases, getProducts, requestPurchase } from 'react-native-iap';
import { getCharacters } from '../request/request.iap';
import { Platform } from 'react-native';

const ITEM_ID_1 = 'test_item_20240112';
const ITEM_ID_2 = 'test_item_20240109';

export const purchaseHandler = async () => {
    try {
        const products = await getProducts({ skus: [ITEM_ID_1] });
        const skus = products.map(x => x["productId"]);
        console.log('****************** products');
        console.log(products);

        let purchases
        // requested skus must be one at a time
        if (Platform.OS === 'android') {
            purchases = await requestPurchase({ skus } as RequestPurchaseAndroid);
        } else { // if (Platform.OS === 'ios') {
            purchases = await requestPurchase({ sku: skus[0] } as RequestPurchaseIOS);
            throw new Error('Not impl for ios yet error');
        }
        console.log("purchase: ", purchases);


    } catch (error) {
        console.error(error);
    }
    console.log("purchase completed!!")
}

export const checkHandler = async () => {
    console.log("check");
    try {
        const res = await getCharacters('voided', 'test', 'test');
        console.log("voided: ", res);
    } catch (error) {
        console.error(error);
    }

    try {
        const purchases = await getAvailablePurchases();
        console.log("purchases: ", purchases);
    } catch (error) {
        console.error(error)
    }
}

export const consumeHandler = () => {
    console.log("consume!!")
}
