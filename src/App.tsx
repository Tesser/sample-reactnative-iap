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
    EmitterSubscription,
} from 'react-native';
import {
    withIAPContext,
    initConnection,
    endConnection,
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
import { checkHandler, consumeHandler, purchaseHandler } from './handler/purchase.hander';

type SectionProps = PropsWithChildren<{
    title: string;
}>;


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

        let updateSub: EmitterSubscription | null = null;
        let failedSub: EmitterSubscription | null = null;
        const initializeSub = async () => {
            await initConnection();

            let lastReceipt = null;
            updateSub = purchaseUpdatedListener(async (purchase: Purchase) => {
                if (lastReceipt === purchase.transactionReceipt) return;
                lastReceipt = purchase.transactionReceipt;

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
            });

            let lastErrorCode = null;
            failedSub = purchaseErrorListener((error: PurchaseError) => {
                if (lastErrorCode === error.code) return;

                lastErrorCode = error.code
                console.log("**************************** event fail");
                console.log(error);
            });

        }
        initializeSub();
        return () => {
            updateSub.remove();
            failedSub.remove();
            updateSub = null;
            failedSub = null;

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
                        <Button onPress={purchaseHandler} title="Purchase">
                        </Button>
                    </Section>
                    <Section title="Test">
                        <Button onPress={checkHandler} title="Check" key="check_btn">
                        </Button>
                    </Section>
                    <Section title="Consume">
                        <Button onPress={consumeHandler} title="Consume" key="consume_btn">
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
