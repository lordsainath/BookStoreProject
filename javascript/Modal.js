export function createModal(orderId) {
    const divElement = document.createElement('div');
    divElement.innerHTML = `
       <div style="width: 100%;position: fixed;top: 0;display: flex;justify-content: center;align-items: center;height: 100%;background-color: rgba(0, 0, 0, 0.8);"
        class="bg-black/50">
        <div class=""
            style="padding: 25px;display: flex;flex-direction: column;align-items: center;gap: 20px;background-color: white;border-radius: 20px;width: 25%;">
            <p
                style="text-align: center;background-color: yellowgreen; width: fit-content; padding: 20px;border-radius: 50%;">
                <i style="color: green;" class="fa-solid fa-check"></i></p>
            <h1 style="font-size: 25px; font-weight: 500; text-align: center;">Order Placed!</h1>
            <p>Thank you for your purchase. Your order <span id="orderId" style="color: #4f46e5;">${orderId}</span>
                has been confirmed</p>
            <button id="redirect" style="padding: 5px 10px;border-radius: 10px;width: 100%;cursor:pointer" class="bg-[#272e3f] text-white">Back to
                Home</button>
        </div>


    </div>
       `
    document.body.appendChild(divElement)

    const redirectBtn = document.getElementById('redirect');
    redirectBtn.addEventListener("click", () => {
        window.location.href = "books.html"
    })

    setTimeout(() => {
        window.location.href = "books.html"
    }, 5000)
}