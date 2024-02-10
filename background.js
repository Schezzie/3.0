chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "summarize") {
      fetch('http://localhost:5000/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: request.text }),  // Pass the selected text to the server
      })
      .then(response => response.json())
      .then(data => {
        console.log("Summary:", data.summary);
        sendResponse({ summary: data.summary });
      })
      .catch(error => {
        console.error('Error:', error);
        sendResponse({ summary: 'Error occurred during summarization.' });
      });
      return true; // This ensures that the sendResponse is asynchronous
    }
    // Add other actions as needed
  });
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "summarize") {
        // Open a new tab only when summarization is requested
        chrome.tabs.create({ url: 'http://localhost:5000' });
    }
    else if (request.action === "policyChecker") {
      // Open a new tab for the policy checker
      chrome.tabs.create({ url: 'http://localhost:5000/compare' });
  }
  else if (request.action === "predict") {
    const reviewText = encodeURIComponent(request.review); // Encode review text
    const rating = encodeURIComponent(request.rating); // Encode rating
    const predictionUrl = `http://localhost:5000/predict`;

    // Open a new tab for the prediction URL
    chrome.tabs.create({ url: predictionUrl });
}
    // Add other actions as needed
}); 
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: highlightWords,
  });
});

function highlightWords() {
let words = ["Shipping Fee","GST","Delivery Charges","Handling Charge","Restaurant Charges","Tax Surcharge", "Processing Fee", "Restocking Fee", "Expedited Shipping Cost", "Customs Duty", "International Transaction Fee", "Convenience Fee", "Oversize Item Surcharge", "Priority Handling Fee", "Insurance Surcharge", "Signature Confirmation Fee", "Environmental Fee", "Gift Wrapping Charge", "Weekend Delivery Surcharge", "Remote Area Delivery Fee", "Peak Season Surcharge", "Same-Day Delivery Fee", "Subscription Renewal Charge", "Late Payment Penalty", "Credit Card Processing Fee", "Return Shipping Fee", "Premium Packaging Fee", "Membership Renewal Fee", "Upgrade Fee", "Installation Charge", "Re-stocking Fee", "Additional Handling Fee", "Express Processing Charge", "Cancellation Fee", "Data Protection Fee", "Exchange Rate Adjustment", "Non-refundable Deposit", "Customization Surcharge", "On-Demand Service Fee", "Reservation Fee", "Accessory Fee", "Priority Dispatch Charge", "Seasonal Surcharge", "Urgent Order Processing Fee", "International Surcharge", "Service Fee", "Fuel Surcharge", "Subscription Cancellation Fee", "Regulatory Compliance Fee", "Maintenance Fee", "Return Processing Fee", "Subscription Activation Fee", "Premium Service Charge","Handling", "Tax", "Fee", "Charge", "Duty", "Customs", "Processing", "Surcharge", "Import", "Export",
  "Delivery", "Tariff", "Service", "Excise", "Packaging", "Environmental", "Local", "Sales", "Gift",
  "Transaction", "Registration", "Road", "Facility", "Contribution", "Donation", "Postage", "Reservation",
  "VAT", "GST", "Overnight", "Convenience", "Social", "Responsibility", "Climate", "Action", "Eco", "Levy",
  "Carbon", "Offset", "State", "Cost", "Shipping", "Freight", "Handling", "Insurance", "Warehousing",
  "Inventory", "Restocking", "Fulfillment", "Distribution", "Express", "Priority", "Tracking", "Expedited",
  "Processing", "Expedite", "Rush", "Handling", "Customs", "Excise", "Inspection", "Verification", "Compliance",
  "Duty-free", "Tax-free", "VAT-free", "Taxation", "Deduction", "Surcharge", "Convenience fee", "Premium",
  "Expedited service", "Upgrade", "Priority handling", "Same-day delivery", "Next-day delivery",
  "Scheduled delivery", "Weekend delivery", "Holiday delivery", "International shipping", "Import tax",
  "Export tax", "Foreign transaction fee", "Cross-border fee", "Currency conversion fee", "Handling fee",
  "Restocking fee", "Exchange fee", "Return shipping fee", "Environmental fee", "Green fee", "Carbon offset fee",
  "Donation fee", "Charity contribution", "Service charge", "Repair fee", "Maintenance fee", "Upgrade fee",
  "Membership fee", "Subscription fee"
]

// replace with your list of words
  let bodyText = document.body.innerHTML;
  words.forEach(word => {
    let re = new RegExp(word, 'g');
    bodyText = bodyText.replace(re, '<mark>' + word + '</mark>');
  });
  document.body.innerHTML = bodyText;
}


  