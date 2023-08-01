const settime = document.getElementById('time');
const setformate = document.getElementById('timeformate');
let alarmTime = "00:00", isAlarmSet = false;
ringtone = new Audio('./zen_notification.mp3');

function getTimeSegmentElements(segmentElement) {
  const segmentDisplay = segmentElement.querySelector('.segment-display');
  const segmentDisplayTop = segmentDisplay.querySelector('.segment-display__top');
  const segmentDisplayBottom = segmentDisplay.querySelector('.segment-display__bottom');
  const segmentOverlay = segmentDisplay.querySelector('.segment-overlay');
  const segmentOverlayTop = segmentOverlay.querySelector('.segment-overlay__top');
  const segmentOverlayBottom = segmentOverlay.querySelector('.segment-overlay__bottom');

  return {
    segmentDisplayTop,
    segmentDisplayBottom,
    segmentOverlay,
    segmentOverlayTop,
    segmentOverlayBottom,
  };
}

function updateSegmentValues(
  displayElement,
  overlayElement,
  value
) {
  displayElement.textContent = value;
  overlayElement.textContent = value;
}

function updateTimeSegment(segmentElement, timeValue) {
  const segmentElements = getTimeSegmentElements(segmentElement);
    if (
      parseInt(
        segmentElements.segmentDisplayTop.textContent,
        10
      ) === timeValue
    ) {
      return;
    }

  segmentElements.segmentOverlay.classList.add('flip');

  updateSegmentValues(
    segmentElements.segmentDisplayTop,
    segmentElements.segmentOverlayBottom,
    timeValue
  );

  function finishAnimation() {
    segmentElements.segmentOverlay.classList.remove('flip');
    updateSegmentValues(
      segmentElements.segmentDisplayBottom,
      segmentElements.segmentOverlayTop,
      timeValue
    );

    this.removeEventListener(
      'animationend',
      finishAnimation
    );
  }

  segmentElements.segmentOverlay.addEventListener(
    'animationend',
    finishAnimation
  );
}

function updateTimeSection(sectionID, timeValue) {
  const firstNumber = Math.floor(timeValue / 10) || 0;
  const secondNumber = timeValue % 10 || 0;
  const sectionElement = document.getElementById(sectionID);
  const timeSegments =
    sectionElement.querySelectorAll('.time-segment');

  updateTimeSegment(timeSegments[0], firstNumber);
  updateTimeSegment(timeSegments[1], secondNumber);
}

function getCurrentTime() {
   const nowTime = new Date();
   const hours = nowTime.getHours();
   const minutes = nowTime.getMinutes();
   const seconds = nowTime.getSeconds();

   return {
     hours,
     minutes,
     seconds
   };
}

function updateAllSegments() {
   const currentTimeBits = getCurrentTime();

   updateTimeSection('hours', currentTimeBits.hours);
   updateTimeSection('minutes', currentTimeBits.minutes);
   updateTimeSection('seconds', currentTimeBits.seconds);
}

const clockTimer = setInterval(() => {
   updateAllSegments();
}, 1000);

updateAllSegments();


const currentTime = document.querySelector("h1"),
content = document.querySelector(".content"),
selectMenu = document.querySelectorAll("select"),
setAlarmBtn = document.querySelector("button");


for (let i = 12; i > 0; i--) {
    i = i < 10 ? `0${i}` : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu[0].firstElementChild.insertAdjacentHTML("afterend", option);
}

for (let i = 59; i >= 0; i--) {
    i = i < 10 ? `0${i}` : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu[1].firstElementChild.insertAdjacentHTML("afterend", option);
}

for (let i = 2; i > 0; i--) {
    let ampm = i == 1 ? "AM" : "PM";
    let option = `<option value="${ampm}">${ampm}</option>`;
    selectMenu[2].firstElementChild.insertAdjacentHTML("afterend", option);
}

function setAlarm(){
 if(isAlarmSet){
   alarmTime= " ";
   ringtone.pause();
   content.classList.remove("disable");
   setAlarmBtn.innerText = "Zen Mode"
   return isAlarmSet= false;
 }
 let timeHour= selectMenu[0].value;
 let timeMinute= selectMenu[1].value;
 let ampm= selectMenu[2].value;

 if(ampm === 'PM' && timeHour !== '12') {
     timeHour= parseInt(timeHour) +12;
 }
 if(ampm === 'AM' && timeHour === '12') {
     timeHour= '00';
 }
 alarmTime= `${timeHour}:${timeMinute}`;
 content.classList.add("disable");
 setAlarmBtn.innerText= "Stop Zen Mode";
 isAlarmSet= true;
}

setAlarmBtn.addEventListener("click", setAlarm);

function checkAlarm() {
  if (isAlarmSet && alarmTime !== "") {
    const currentTime = getCurrentTime();
    const currentHours = currentTime.hours;
    const currentMinutes = currentTime.minutes;
    const currentAMPM = currentTime.ampm;

    const [alarmHours, alarmMinutes, alarmAMPM] = alarmTime.split(":");

    // Convert alarmHours to 24-hour format if needed
    let alarmHours24 = parseInt(alarmHours, 10);
    if (alarmAMPM === "PM" && alarmHours24 !== 12) {
      alarmHours24 += 12;
    }
    if (alarmAMPM === "AM" && alarmHours24 === 12) {
      alarmHours24 = 0;
    }

    // Check if the current time matches the alarm time
    if (
      currentHours === alarmHours24 &&
      currentMinutes === parseInt(alarmMinutes, 10) &&
      currentAMPM === alarmAMPM
    ) {
      ringtone.play();
    }
  }
}

setInterval(function () {
  updateAllSegments(); // Update the displayed time every second
  checkAlarm(); // Check the alarm every second
}, 1000);