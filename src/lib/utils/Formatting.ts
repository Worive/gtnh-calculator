export function formatAmount(amount: number): string {
    if (amount === 0) {
        return '0';
    }

    let suffix = '';
    let divisor = 1;

    if (amount >= 1e11) {
        suffix = 'G';
        divisor = 1e9;
    } else if (amount >= 1e8) {
        suffix = 'M';
        divisor = 1e6;
    } else if (amount >= 1e6) {
        suffix = 'K';
        divisor = 1000;
    }

    const dividedAmount = amount / divisor;
    const maxLength = 6 - suffix.length;
    const integerPart = Math.floor(dividedAmount).toString();
    const availableDecimals = Math.max(0, maxLength - integerPart.length - 1); // -1 for decimal point
    const div = Math.pow(10, availableDecimals);

    return (Math.round(dividedAmount * div) / div).toString() + suffix;
}
