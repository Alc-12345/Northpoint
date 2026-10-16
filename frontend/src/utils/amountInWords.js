const units = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];
function words(number) {
  if (number < 20) return units[number];
  if (number < 100)
    return (
      tens[Math.floor(number / 10)] +
      (number % 10 ? " " + units[number % 10] : "")
    );
  for (const [value, label] of [
    [10000000, "Crore"],
    [100000, "Lakh"],
    [1000, "Thousand"],
    [100, "Hundred"],
  ]) {
    if (number >= value)
      return (
        words(Math.floor(number / value)) +
        " " +
        label +
        (number % value ? " " + words(number % value) : "")
      );
  }
}
export function amountInWords(amount) {
  const paise = Math.round(Number(amount) * 100);
  if (!Number.isSafeInteger(paise) || paise < 0)
    throw new Error("Invalid amount for amount in words");
  const rupees = Math.floor(paise / 100),
    fraction = paise % 100;
  return `${words(rupees)} ${rupees === 1 ? "Rupee" : "Rupees"}${fraction ? " and " + words(fraction) + " " + (fraction === 1 ? "Paisa" : "Paise") : ""} Only`;
}
