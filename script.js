let elements = {};
let speedMode = 0; // 0=KMH,1=MPH,2=Knots

function setSpeed(speed){
    let displaySpeed;
    switch(speedMode){
        case 1: displaySpeed = `${Math.round(speed*2.236936)} MPH`; break;
        case 2: displaySpeed = `${Math.round(speed*1.943844)} Knots`; break;
        default: displaySpeed = `${Math.round(speed*3.6)} KMH`;
    }
    elements.speed.innerText = displaySpeed;
}

function setRPM(rpm){
    const bar = elements.rpmBar;
    const width = Math.min(Math.max(rpm,0),1)*100; // max 100px
    bar.setAttribute('width', width);
    elements.rpmText.innerText = `${Math.round(rpm*8000)} RPM`;
}

document.addEventListener('DOMContentLoaded', ()=>{
    elements = {
        speed: document.getElementById('speed'),
        rpmBar: document.getElementById('rpm-bar'),
        rpmText: document.getElementById('rpm-text')
    };
});
