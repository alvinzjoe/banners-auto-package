// Update the following if required
const clickarea = "adwrapper";
const myTimeline = new TimelineMax({paused:1, repeat:0, repeatDelay:5});
const animationDuration = 0.85;

// Do not touch anything below this line
var imagesLoaded=0;
const allImages=document.getElementsByTagName("img");
const totalImagesToLoad=allImages.length;

function init() {
    createTimeline();
    preloadImages();
};

function preloadImages() {
    for (var i = 0; i < allImages.length; i++) {
        var download = new Image();download.onload = function() {
            imagesLoaded++;checkTotalImagesLoaded();
        };
        download.src = allImages[i].src;
    }
};

function checkTotalImagesLoaded() {
    if (imagesLoaded == totalImagesToLoad) {
        playTimeline();
    }
};

function playTimeline() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("loader").style.animationIterationCount = 0;
    myTimeline.play(0);
};

window.addEventListener('load', init());
// Do not touch anything above this line


function createTimeline() {
    myTimeline.add("start")
        .to(["#content","#bg"], animationDuration/2, {autoAlpha: 1})
        // frame 1
        .to(["#car", "#volvo", "#terms"], animationDuration, {autoAlpha:1})
        // frame 2
        .to(["#copy1"], animationDuration, {autoAlpha:1})
      
        .to(["#booktestdrive2"], animationDuration, {autoAlpha:1})

        .add("finish");
};
