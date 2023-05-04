export function roundToDecimal(number: number, decimalPlaces: number) {
    return parseFloat(number.toFixed(decimalPlaces));
}
