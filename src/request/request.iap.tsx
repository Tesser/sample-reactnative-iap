export async function getCharacters(
    queryType: 'get' | 'ack' | 'consume' | 'list' | 'voided',
    productId: string,
    token: string,
) {
    let results = await fetch('http://192.168.10.90:4000/graphql', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NzQyZjZlOTQ4NTRlNTcwYTI3MTgyZjkwNzA3ZjY0YiIsImVtYWlsIjoibHR5aXowN0BrYWthby5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcwNTMwNTAzOSwiZXhwIjoxNzA3ODk3MDM5fQ.m6T51KDzOO7FY7wtYeZs1-AEPcPdBPEp4UZ5Isnb9c8"
        },
        body: JSON.stringify({
            query: `
                query Query($testInput: String!, $productId: String!, $token: String!) {
                    getIapReceipt(testInput: $testInput, productId: $productId, token: $token)
                }
            `,
            variables: {
                testInput: queryType,
                productId,
                token,
            }
        }),
    })
    return await results.json();
}
