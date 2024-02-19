import React, { useState } from 'react';
import { Button, SafeAreaView, Text, View } from "react-native";
import { gql, useQuery } from "@apollo/client";
import { gqlClient } from '../gql-client/client';

const GetCharacters2 = () => {
    const [clickCount, setClickCount] = useState(0);
    let child: string = '';
    const GET_LOCATIONS = gql`
        query QueryAliveness {
            checkAliveness
    }
    `;

    const { loading, error, data } = useQuery(
        GET_LOCATIONS,
        {fetchPolicy: 'no-cache'}
    );
    if (loading) child = 'Loading ...';
    else if (error) child = `Error! ${error.message}`
    else if (data) child = data['checkAliveness'];
    else child = 'None';

    return (
        <View>
            <Button onPress={() => setClickCount(clickCount + 1)} title="Update">
            </Button>
            <Text>
                {child}
            </Text>
        </View>
    );
}

export default GetCharacters2;
