document.getElementById('proceedBtn').addEventListener('click', function () {
    // Get the original URL from the query parameter
    console.log('Proceed button clicked');
    const url = new URLSearchParams(window.location.search).get('url');
      // Navigate to the original URL
      console.log(url)
    window.location.href = url;

});

document.getElementById('abortBtn').addEventListener('click', function () {
    console.log('abortBtn button clicked');
    // Go back to the previous page if there is history, otherwise navigate to the main page
  
        chrome.tabs.update({ url: 'chrome://newtab/' });
   
});
