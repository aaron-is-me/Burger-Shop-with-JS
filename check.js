document.addEventListener("DOMContentLoaded", () => {
    const summaryLine = document.querySelector(".summary-line");
    const totalLine = document.querySelector(".total-line");
    const paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]');

    const updateSummary = () => {
        // Load cart data from localStorage
        const savedCart = localStorage.getItem("cart");
        if (!savedCart) return;

        const cart = JSON.parse(savedCart);

        // Fetch product data
        fetch("products.json")
            .then(response => response.json())
            .then(products => {
                const total = cart.reduce((sum, item) => {
                    const product = products.find(p => p.id == item.product_id);
                    return product ? sum + product.price * item.quantity : sum;
                }, 0);

                // Determine the selected payment method
                const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

                let prepaidAmount = 0;
                let finalAmount = total;

                if (selectedPaymentMethod === 'cod') {
                    prepaidAmount = total * 0.30;
                    finalAmount = total - prepaidAmount;
                    // Update the HTML to show 10% prepaid details and final amount
                    summaryLine.innerHTML = `
                        <p>SUBTOTAL</p>
                        <p>$${total.toFixed(2)}</p>
                    `;
                    totalLine.innerHTML = `
                        <p>Need to Pay 30% At First: $${prepaidAmount.toFixed(2)} </p>
                        <p>ITEM RECEIVE:</p>
                        <p>$${finalAmount.toFixed(2)}</p>
                    `;
                } else {
                    // Update the HTML to only show the subtotal and total amount without 10% prepaid details
                    summaryLine.innerHTML = `
                        <p>SUBTOTAL</p>
                        <p>$${total.toFixed(2)}</p>
                    `;
                    totalLine.innerHTML = `
                        <p>Total</p>
                        <p>$${total.toFixed(2)}</p>
                    `;
                }
            });
    };

    // Update payment details when payment method changes
    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', updateSummary);
    });

    // Initialize summary and total on page load
    updateSummary();
});
