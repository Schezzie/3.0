// Event listener for the "Scrape Data" button
document.getElementById("scrapeDataButton").addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const url = tabs[0].url;
        fetch('http://localhost:5000/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to scrape data');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'final.txt';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            alert("Upload the Downloaded Image to The search button to find out the dark patterns")
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error: ' + error.message); // Display the error in an alert
        });
    });
});
// document.getElementById("scrapeDataButton").addEventListener("click", function () {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         const url = tabs[0].url;
//         fetch('http://localhost:5000/scrape', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ url: url }),
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.error) {
//                 console.error('Error:', data.error);
//                 alert('Error: ' + data.error); // Display the error in an alert
//             } else {
//                 console.log("Scraping status:", data.status);

//                 // Filter predictions with a value of 1
//                 const filteredPredictions = data.predictions.filter(entry => entry.prediction === 1);

//                 // Display only the text for filtered predictions in a single alert
//                 const predictionsString = filteredPredictions.map(entry => `Text: ${entry.text}`).join('\n');

//                 alert('Scraping status: ' + data.status + '\n\nText for Predictions with value 1:\n' + predictionsString);
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             alert('Error: ' + error.message); // Display the error in an alert
//         });
//     });
// });

document.getElementById("summarizeButton").addEventListener("click", function () {
    // Redirect to the summarizing HTML site
    chrome.runtime.sendMessage({ action: "summarize" });
});
document.getElementById("policyCheckerButton").addEventListener("click", function () {
    // Inform the background script to open a new tab for the policy checker
    chrome.runtime.sendMessage({ action: "policyChecker" });
});
document.getElementById("predictButton").addEventListener("click", function () {
    // Inform the background script to open a new tab for the policy checker
    chrome.runtime.sendMessage({ action: "predictText" });
});
document.getElementById('highlight').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: highlightWords,
      });
    });
  });
  
  function highlightWords() {
    let words = ["Shipping Fee", "Handling Charge", "Tax Surcharge", "Processing Fee", "Restocking Fee", "Expedited Shipping Cost", "Customs Duty", "International Transaction Fee", "Convenience Fee", "Oversize Item Surcharge", "Priority Handling Fee", "Insurance Surcharge", "Signature Confirmation Fee", "Environmental Fee", "Gift Wrapping Charge", "Weekend Delivery Surcharge", "Remote Area Delivery Fee", "Peak Season Surcharge", "Same-Day Delivery Fee", "Subscription Renewal Charge", "Late Payment Penalty", "Credit Card Processing Fee", "Return Shipping Fee", "Premium Packaging Fee", "Membership Renewal Fee", "Upgrade Fee", "Installation Charge", "Re-stocking Fee", "Additional Handling Fee", "Express Processing Charge", "Cancellation Fee", "Data Protection Fee", "Exchange Rate Adjustment", "Non-refundable Deposit", "Customization Surcharge", "On-Demand Service Fee", "Reservation Fee", "Accessory Fee", "Priority Dispatch Charge", "Seasonal Surcharge", "Urgent Order Processing Fee", "International Surcharge", "Service Fee", "Fuel Surcharge", "Subscription Cancellation Fee", "Regulatory Compliance Fee", "Maintenance Fee", "Return Processing Fee", "Subscription Activation Fee", "Premium Service Charge","Delivery Charges"]; // replace with your list of words
    let bodyText = document.body.innerHTML;
    words.forEach(word => {
      let re = new RegExp(word, 'g');
      bodyText = bodyText.replace(re, '<mark>' + word + '</mark>');
    });
    document.body.innerHTML = bodyText;
  }

