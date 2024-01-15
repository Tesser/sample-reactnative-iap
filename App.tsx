/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Button,
} from 'react-native';
import {
    withIAPContext,
    initConnection,
    endConnection,
    getProducts,
    getAvailablePurchases,
    requestPurchase,
    purchaseUpdatedListener,
    Purchase,
    purchaseErrorListener,
    PurchaseError,
} from 'react-native-iap';

import {
    Colors,
    Header,
} from 'react-native/Libraries/NewAppScreen';
import { getCharacters } from './request/request.iap';

type SectionProps = PropsWithChildren<{
    title: string;
}>;

function deepEqual(x: any, y: any): boolean {
  const ok = Object.keys, tx = typeof x, ty = typeof y;
  return x && y && tx === 'object' && tx === ty ? (
    ok(x).length === ok(y).length &&
      ok(x).every(key => deepEqual(x[key], y[key]))
  ) : (x === y);
}

const purchaseHandler = async () => {


    try {
        const products = await getProducts({ skus: ["test_item_20240112"] });
        const sku = products[0]["productId"];

        const purchases = await requestPurchase({ skus: [sku] });
        console.log("purchase: ", purchases[0]);


    } catch (error) {
        console.error(error);
    }
    console.log("purchased!!")
}
const checkHandler = async () => {
    const res = await getCharacters('voided', 'test', 'test');
    console.log("voided: ", res);

    try {
        const purchases = await getAvailablePurchases();
        console.log("purchases: ", purchases);
    } catch (error) {
        console.error(error)
    }
}
const consumeHandler = () => {
    console.log("consume!!")
    consumeHandler();
}


function Section({ children, title }: SectionProps): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        color: isDarkMode ? Colors.light : Colors.dark,
                    },
                ]}>
                {children}
            </Text>
        </View>
    );
}

function App(): React.JSX.Element {

    useEffect(() => {
        const initialize = async () => {
            await initConnection();
            let prevPurchase: Purchase;
            const updateSub = purchaseUpdatedListener(async (purchase: Purchase) => {
                await new Promise(f => setTimeout(f, 0));
                if (
                    JSON.stringify(purchase) !== JSON.stringify(prevPurchase)
                ) {
                    prevPurchase = purchase;
                    console.log("**************************** event update");
                    console.log(purchase);
                    try {
                        if (purchase.purchaseToken == null) throw new Error('No token error');
                        const res = await getCharacters(
                            'consume',
                            purchase.productId,
                            purchase.purchaseToken,
                        );
                        console.log(res);
                    } catch( error) {
                        console.error(error);
                    }
                }
            });
            const failSub = purchaseErrorListener((error: PurchaseError) => {
                console.log("**************************** event fail");
                console.log(error);
            });
        }
        initialize();
        return () => {
            endConnection();
            console.log('end connection!!!!!!!!!!!!!!!!!!!!!!');
        }
    }, []);

    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle}>
                <Header />
                <View
                    style={{
                        backgroundColor: isDarkMode ? Colors.black : Colors.white,
                    }}>
                    <Section title="Step One">
                        Edit <Text style={styles.highlight}>App.tsx</Text> to change this
                        screen and then come back to see your edits.
                    </Section>
                    <Section title="Purchase">
                        <Button onPress={purchaseHandler} title="purchase">
                        </Button>
                    </Section>
                    <Section title="Test">
                        <Button onPress={checkHandler} title="Check">
                        </Button>
                    </Section>
                    <Section title="Consume">
                        <Button onPress={consumeHandler} title="Consume">
                        </Button>
                    </Section>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 16,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});

export default withIAPContext(App);
