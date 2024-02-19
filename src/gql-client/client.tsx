import { ApolloClient, InMemoryCache } from '@apollo/client/core'; 

export const gqlClient = new ApolloClient({
    uri: 'http://192.168.10.90:4000/graphql',
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
        },
        query: {
            fetchPolicy: 'no-cache',
        },
    },
})

