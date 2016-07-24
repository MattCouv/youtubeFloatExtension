/*
this script is to create ui  on top of the actual ui of youtube
that allows users to watch videos without leaving the page switch beetween videos quickly
it is not meant to be a replacement of the current ui it is an imrpovement

TODO :
  - add closed popup button
  - add overlay controles when minimized(maximize, stop)
  - add the hability to cue videos
 */

// some global variables
var isMinimized = false
var player = false
var done = false

// adds a script to have acces to the youtube iframeapi
var tag = document.createElement('script')
tag.src = "https://www.youtube.com/iframe_api"
var firstScriptTag = document.getElementsByTagName('script')[0]
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

// builds the popup
var popup = document.createElement('div')
popup.style.position = 'fixed'
popup.id = 'popup'
// creates the overlay for the mnimized menu
var popupOverlay = document.createElement('div')
popupOverlay.id = 'overlay'
popupOverlay.style.position = 'absolute'
popupOverlay.style.zIndex = '200'
popupOverlay.style.width = '100%'
popupOverlay.style.height = '100%'
popupOverlay.style.display = 'none'
popupOverlay.style.background = 'red'

// set the building block for the iframe
var iframePopup = document.createElement('div')
iframePopup.id = 'iframePopup'
popup.appendChild(popupOverlay)
popup.appendChild(iframePopup)
document.body.appendChild(popup);

// selects every link to youtube videos and adds eventListeners to each
// this allows the script to work on any page of youtube.com domain
var videos = document.querySelectorAll("a[href^='/watch?']");
Array.prototype.forEach.call(videos,function(v){
  v.addEventListener('click',function(e){
    e.preventDefault()
    maximizeVideo()
    popup.style.display = 'block';
    var url = this.href.split('=')
    var videoId = url[1]
    player.loadVideoById({videoId:videoId})
  })
})

// Builds the ifrmae from the element with id iframePopup
function onYouTubeIframeAPIReady() {
  player = new YT.Player('iframePopup', {
    width: '100%',
    height: '100%',
    playerVars: { 'autoplay': 1 },
    events: {
      'onReady': onPlayerReady
    }
  });
}

// Plays the video when player and video are ready
function onPlayerReady(event) {
  player.playVideo();
}

// stops the video and the download
function stopVideo() {
  player.stopVideo();
}

// pauses the video but allow downloading
function pauseVideo() {
  player.pauseVideo()
}

// minimizes the popup
function minimizeVideo(){
  popup.style.width = '640px'
  popup.style.height = '360px'
  popup.style.left = 'auto'
  popup.style.top = 'auto'
  popup.style.bottom = '10px'
  popup.style.right = '10px'
  popup.style.margin = '0';
  isMinimized = false
}

// Reset the popup size and position
function maximizeVideo(){
  if(!isMinimized){
    popup.style.width = '1280px'
    popup.style.height = '720px'
    popup.style.position = 'fixed';
    popup.style.margin = 'auto';
    popup.style.left = 0;
    popup.style.right = 0;
    popup.style.top = 0;
    popup.style.bottom = 0;
    isMinimized = true
  }
}

// Event listener to minimize the popup or to expand it if already minimized
document.addEventListener('click',function(event){
  var player2 = document.getElementById('player2');
  if( event.target !== player2 && player.getPlayerState() !== undefined){
    if(event.target == popupOverlay ){
      maximizeVideo();
      return false;
    }
    minimizeVideo()
  }
})
// Event listener to show the popup overlay menu when the popup is minimized
popup.addEventListener('mouseenter', function(e){
  if(!isMinimized){
    popupOverlay.style.display = 'block'
  }
})
// Event listener to hide the overlaymenu when popup is minimized
popup.addEventListener('mouseleave', function(e){
  popupOverlay.style.display = 'none'
})