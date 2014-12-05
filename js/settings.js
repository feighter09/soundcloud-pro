(function() {
  var DEFAULT_HIDDEN_TIME = 24

  chrome.storage.sync.get('hiddenTime', function(result) {
    if (result.hiddenTime) {
      $("#hiddenTime").val(result.hiddenTime)
    } else {
      console.log("hidden time not set, defaulting to " + DEFAULT_HIDDEN_TIME)
      $("#hiddenTime").val(DEFAULT_HIDDEN_TIME)
      chrome.storage.sync.set({'hiddenTime': DEFAULT_HIDDEN_TIME}, function () {})
    }
  })

  var button = $("#formButton")
  button.click(function(event) {
    var hiddenTime = $("#hiddenTime").val()
    chrome.storage.sync.set({'hiddenTime': hiddenTime}, function () {
      console.log("hidden time saved: " + hiddenTime + " hours")
    })
  })
})()