// we use currency API to get the currency exchange rates and country code list is used to get the country code of the currency.
// Github se

const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies"; // Base URL of the currency API to fetch exchange rates

//querySelector
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button"); // iske bhi niche ek event listener bna rkha hai
const fromCurr = document.querySelector(".from select"); // get the selected currency code from the "from" dropdown
const toCurr = document.querySelector(".to select"); // get the selected currency code from the "to" dropdown
const msg = document.querySelector(".msg");

// isme sari country code list hai jise hum dropdown me show karenge individually and select me add krre.
// Loop through each dropdown one by one
for (let select of dropdowns) {

    // Loop through all country codes available in countryList object
    for (let currCode in countryList) {



        // Create a new HTML <option> element
        let newOption = document.createElement("option");

        // Set the visible text of the option in the dropdown
        newOption.innerText = currCode;

        // Set the value of the option (used to access the selected currency)
        newOption.value = currCode;

        //
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }

        // Add the newly created option inside the current dropdown
        select.append(newOption);

    } // ye uke liye jb dropdown me jis country ko select kre uska flag bhi aaye. iska function niche bna rkha
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    })
}
// simply jo hmane html file me jo 4 country ke options bnaye the, wo yha js se html me bnaye hai -> means unki jgh country_code file me jo saari country ke codes likhe hai jo aa gye dropdown me. bcoz itne sare counrty ke code ek hi file me likhne se code clean rhega and easy to maintain bhi rhega. and html me sirf 4 country ke options show krne ke liye likhe the, but yha js se saari country ke codes aa gye dropdown me.

const updateFlag = (elem) => { // elem ke andr select hai
    let currCode = elem.value; //get selected currency code
    let countryCode = countryList[currCode]; // get country code from countryList
    let newSrc = `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`;
    let img = elem.parentElement.querySelector("img"); // select image element inside the same parent as the select element
    img.src = newSrc; // update the flag image source to the new country flag based on the selected currency code
    //console.log(currCode, countryCode, newSrc);
};


// ab buutton click hone par form submit hone se pehle hum check kr rhe hai ki amount input field me value hai ya nahi, agar value nahi hai ya 1 se choti hai to hum usko 1 set kr rhe hai.
const updateExchangeRate = async() => {

    let amnt = document.querySelector(".amount input");
    let amntVal = amnt.value;
    if (amntVal === "" || amntVal < 1) {
        amntVal = 1;
        amnt.value = "1";
    }

    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
    // URL to fetch the currency exchange rate from the API, BASE_URL is the base URL of the API, fromCurr and toCurr are the selected currency codes from the dropdowns.
    let response = await fetch(URL); // fetch the data from the API using the constructed URL
    let data = await response.json(); // parse the response data as JSON
    // Get exchange rate of selected TO currency
    let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
    //console.log(rate); // log the fetched data to the console for debugging purposes
    let finalAmount = amntVal * rate; // calculate the final converted amount by multiplying the input amount with the exchange rate
    msg.innerText = `${amntVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`; // display the conversion result in the message element, rounding the final amount to 2 decimal places
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault(); // Prevent the default form submission behavior when the button is clicked
    updateExchangeRate(); // Call the updateExchangeRate function to fetch and display the currency conversion result
}); // Add an event listener to the button to trigger the updateExchangeRate function when clicked

window.addEventListener("load", () => {
    updateExchangeRate(); // Call the updateExchangeRate function jb window load ho jaye, so that the initial conversion is displayed when the page loads.
});