// chrome.webNavigation.onBeforeNavigate.addListener(async function (details) {
//     const url = details.url;

//     if (!url || url.toLowerCase().startsWith('chrome://newtab/') || url.length <= 5) {
//         return;
//     }
    
//     // Check if the current tab is a new tab page
//     chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
//         if (tabs && tabs[0] && tabs[0].url) {
//             const tabUrl = tabs[0].url;
//             if (tabUrl.toLowerCase().startsWith('chrome://newtab/')) {
//                 return;
//             }
            
//             // Rest of your code for further processing
//         }
//     });
    
//         // Continue with phishing detection
//         try {
//             // Fetch the URL content and send it to your Flask API
//             const response = await fetch('http://127.0.0.1:5000/checkUrl', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ url: url }),
//             });

//             const data = await response.json();
//             const result = data.prediction === 'bad' ? 'This is a Phishing Site' : 'This is not a Phishing Site';

//             if (data.prediction === 'bad') {
//                 // Show the intermediate warning page
//                 const warningPage = chrome.runtime.getURL('warning.html') + `?url=${encodeURIComponent(url)}`;
//                 chrome.tabs.update({ url: warningPage });
//             }
//         } catch (error) {
//             console.error('Error during prediction:', error);
//             // Handle the error
//         }
//     });

// chrome.webNavigation.onCompleted.addListener(async function (details) {
//     const url = details.url;



//     // Continue with phishing detection
//     try {
//         // Fetch the URL content and send it to your Flask API
//         const response = await fetch('http://127.0.0.1:5000/checkUrl', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ url: url }),
//         });

//         const data = await response.json();
//         const result = data.prediction === 'bad' ? 'This is a Phishing Site' : 'This is not a Phishing Site';

//         if (data.prediction === 'bad') {
//             // Show the intermediate warning page
//             const warningPage = chrome.runtime.getURL('warning.html') + `?url=${encodeURIComponent(url)}`;
//             chrome.tabs.update({ url: warningPage });
//         }
//     } catch (error) {
//         console.error('Error during prediction:', error);
//         // Handle the error
//     }
// });

// chrome.webNavigation.onBeforeNavigate.addListener(async function (details) {
//     const url = details.url;

//     if (!url || url.toLowerCase().startsWith('chrome://newtab/')) {
//         return;
//     }
    
//             // Continue with phishing detection
//             try {
//                 // Fetch the URL content and send it to your Flask API
//                 const response = await fetch('http://127.0.0.1:5000/checkUrl', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ url: url }),
//                 });

//                 const data = await response.json();
//                 const result = data.prediction === 'bad' ? 'This is a Phishing Site' : 'This is not a Phishing Site';

//                 if (data.prediction === 'bad') {
//                     // Show the intermediate warning page
//                     const warningPage = chrome.runtime.getURL('warning.html') + `?url=${encodeURIComponent(url)}`;
//                     chrome.tabs.update({ url: warningPage });
//                 } else {
//                     // If prediction is good, log it or take other actions
//                     console.log('Good prediction:', result);
//                 }
//             } catch (error) {
//                 console.error('Error during prediction:', error);
//                 // Handle the error
//             }
        
    
// });

// Maintain a set to keep track of tab IDs for which prediction is performed
const predictedTabs = new Set();

chrome.webNavigation.onCommitted.addListener(async function (details) {
    const url = details.url;
    const tabId = details.tabId;
    // console.log(predictedTabs)

     // Check if the URL is the new tab page or a blank URL
       // Check if the URL is the new tab page, a blank URL, or the Chrome homepage
       if (
        url.toLowerCase().startsWith('chrome://newtab/') ||
        url === '' ||  // Check if the URL is empty
        url.toLowerCase().startsWith('chrome://homepage/')
    ) {
        // Handle new tab opening, blank URL, or Chrome homepage
        predictedTabs.delete(tabId); // Clear the record for this tab
        return;
    }


    // Check if the URL is the new tab page
    if (url.toLowerCase().startsWith('chrome://newtab/')
    || url==='chrome://newtab/') {
        // Handle new tab opening
        predictedTabs.delete(tabId); // Clear the record for this tab
        return;
    }

    // Check if prediction is already performed for this tab
    if (predictedTabs.has(tabId)) {
        return;
    }
   
    // Continue with phishing detection
    try {
        // Fetch the URL content and send it to your Flask API
        const response = await fetch('http://127.0.0.1:5000/checkUrl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url }),
        });

        const data = await response.json();
        const result = data.prediction === 'bad' ? 'This is a Phishing Site' : 'This is not a Phishing Site';

        if (data.prediction === 'bad') {
            // Show the intermediate warning page
            const warningPage = chrome.runtime.getURL('warning.html') + `?url=${encodeURIComponent(url)}`;
            predictedTabs.add(tabId); // Mark this tab as predicted
            chrome.tabs.update({ url: warningPage });
        } else {
            // If prediction is good, log it or take other actions
            console.log('Good prediction:', result);
        }
    } catch (error) {
        console.error('Error during prediction:', error);
        // Handle the error
    }

});
