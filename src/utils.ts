var scrollbarWidth:number | undefined;

export function GetScrollbarWidth()
{
    if (scrollbarWidth === undefined) {
        // Create the measurement node
        var scrollDiv = document.createElement("div");
        scrollDiv.className = "scrollbar-measure";
        document.body.appendChild(scrollDiv);

        // Get the scrollbar width
        scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

        // Delete the DIV 
        document.body.removeChild(scrollDiv);
        console.log("Scrollbar width: "+scrollbarWidth);
    }
    return scrollbarWidth;
}

export type GtVoltageTier = {
    name:string;
    voltage:number;
}

export var voltageTier:GtVoltageTier[] = [
    {name: "LV", voltage: 32},
    {name: "MV", voltage: 128},
    {name: "HV", voltage: 512},
    {name: "EV", voltage: 2048},
    {name: "IV", voltage: 8192},
    {name: "LuV", voltage: 32768},
    {name: "ZPM", voltage: 131072},
    {name: "UV", voltage: 524288},
    {name: "UHV", voltage: 2097152},
    {name: "UEV", voltage: 8388608},
    {name: "UIV", voltage: 33554432},
    {name: "UMV", voltage: 134217728},
    {name: "UXV", voltage: 536870912},
    {name: "MAX", voltage: 2147483640}
  ];

export function formatAmount(amount: number): string {
    if (amount === 0) {
        return "0";
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