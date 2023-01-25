export function formatPrice(pennies:number): string {
    return (pennies).toLocaleString("en-GB", {
      style: "currency",
      currency: "GBP"
    });
  }