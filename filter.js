(function() {
  if ( !supportsHtml5Storage() ) {
    alert("SoundCloud Pro requires local storage, which is not supported by the current browser")
    return
  }

  initLocalStorage()
  waitUntilStreamLoads(function() {
    filterStream()
    addVoteButtons()
    observeStreamChanges()
  })

  function filterStream() {
    var filterList = getDownVotes()
    for (var i = 0; i < filterList.length; i++) {      
      var query = "div[aria-label='" + filterList[i] + "']"
      if ($(query)[0] === undefined) { continue } // sound in filter list is not displayed "yet"
      var wholeDiv = $(query)[0].parentElement.parentElement
      var soundHeader = findChildWithClassName($(query)[0], "sound__header")
      var playButton = soundHeader.children[0].children[1].children[0].children[0]

      var observer = new WebKitMutationObserver(function(mutations) {
        console.log(mutations)
        for (var i = 0; i < mutations.length; i++) {
          if (mutations[i].target.title == "Pause") {   // a down voted song just started playing
            $(".skipControl__next")[0].click()          // skip it
          }
        }
      })
      var config = { attributes: true, childList: true, characterData: true }
      observer.observe(playButton, config)

      wholeDiv.hidden = true
    }
  }

  function addVoteButtons() {
    var streamEntries = document.getElementsByClassName("soundList__item")
    for (var i = 0; i < streamEntries.length; i++) {
      addVoteButtonsToStreamEntry(streamEntries[i])
    }
  }

  function observeStreamChanges() {
    var streamDiv = document.getElementsByClassName("stream")[0]
    var streamList = streamDiv.children[1].children[0].children[0]

    var observer = new WebKitMutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var streamEntry = mutations[i].addedNodes[0]
        addVoteButtonsToStreamEntry(streamEntry)
      }

      filterStream()
    })
    var config = { attributes: true, childList: true, characterData: true }
    observer.observe(streamList, config)
  }

  function upVoteSound(sound) {
    console.log("Up voting sound: " + sound)
    addUpVote(sound)
    removeDownVote(sound)
  }

  function downVoteSound(sound) {
    console.log("Down voting sound: " + sound)
    addDownVote(sound)
    removeUpVote(sound)
    filterStream()
  }

  /* Convenience Functions */

  function supportsHtml5Storage() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  }

  function initLocalStorage() {
    // if (localStorage.upVotes === undefined) {
      localStorage.upVotes = JSON.stringify([])
    // }
    // if (localStorage.downVotes === undefined) {
      localStorage.downVotes = JSON.stringify([])
    // }
  }

  function waitUntilStreamLoads(callback) {
    var streamDiv = document.getElementsByClassName("stream")[0]
    if (streamDiv === undefined) {
      setTimeout(function() { waitUntilStreamLoads(callback) }, 50)
      return
    }

    var streamList = streamDiv.children[1].children[0]
    var observer = new WebKitMutationObserver(function(mutations) {
      observer.disconnect()
      callback()
    })
    var config = { attributes: true, childList: true, characterData: true }
    observer.observe(streamList, config)
  }

  function addVoteButtonsToStreamEntry(streamEntry) {    
    var upVoteBtn = document.createElement("button")
    upVoteBtn.innerHTML = "Thumbs Up"
    upVoteBtn.addEventListener("click", function(event) {
      upVoteSound( getTitleFromButton(this) )
    })

    var downVoteBtn = document.createElement("button")
    downVoteBtn.innerHTML = "Thumbs Down"
    downVoteBtn.addEventListener("click", function(event) {
      downVoteSound( getTitleFromButton(this) )
    })

    var footer = findFooter(streamEntry)
    footer.appendChild(upVoteBtn)
    footer.appendChild(downVoteBtn)
  }

  function findFooter(soundDiv) {
    var parent = soundDiv.children[0].children[0]
    var halfWay = findChildWithClassName(parent, "sound__footer")
    return halfWay.children[0].children[0].children[0]
  }

  function findChildWithClassName(parent, className) {
    for (var i = 0; i < parent.children.length; i++) {
      var child = parent.children[i]
      if (child.classList.contains(className)) {
        return child
      }
    }

    return null
  }

  function getTitleFromButton(button) {
    var titleDiv = button.parentElement.parentElement.parentElement.parentElement.parentElement
    return titleDiv.getAttribute("aria-label")
  }

  /* Local Storage Retrieval */

  function getDownVotes() {
    return JSON.parse(localStorage.downVotes)
  }

  function addDownVote(downVote) {
    var newDownVotes = getDownVotes()
    newDownVotes.push(downVote)
    localStorage.downVotes = JSON.stringify( newDownVotes )
  }

  function removeDownVote(downVote) {
    var index = getDownVotes().indexOf(downVote)
    if (index != -1) {
      var newDownVotes = getDownVotes().splice(index, 1)
      localStorage.downVotes = JSON.stringify(newDownVotes)
    }
  }

  function getUpVotes() {
    return JSON.parse(localStorage.upVotes)
  }

  function addUpVote(upVote) {
    var newUpVotes = getUpVotes()
    newUpVotes.push(upVote)
    localStorage.upVotes = JSON.stringify( upVote )
  }

  function removeUpVote(upVote) {
    var index = getUpVotes().indexOf(upVote)
    if (index != -1) {
      var newUpVotes = getUpVotes().splice(index, 1)
      localStorage.upVotes = JSON.stringify(newUpVotes)
    }
  }
})()
