export async function getCurrencies() {
    const response = await fetch(
        'https://api.exchangerate.host/latest?base=USD&symbols=USD,EUR,PLN,GBP'
    );
    const data = await response.json();
    return data.rates;
}
