const diffSwitch = document.querySelector(".play-bot-diff");
diffSwitch.addEventListener('click', setDiff);
diffSwitch.style.color = 'yellow';

function setDiff() {
    if(diffSwitch.textContent === "Easy") {
        diffSwitch.textContent = "Medium";
        diffSwitch.style.color = 'yellow';
    }
    else if(diffSwitch.textContent === "Medium") {
        diffSwitch.textContent = "Hard";
        diffSwitch.style.color = 'red';
    }
    else if(diffSwitch.textContent === "Hard") {
        diffSwitch.textContent = "Easy";
        diffSwitch.style.color = 'lightgreen';
    }
}