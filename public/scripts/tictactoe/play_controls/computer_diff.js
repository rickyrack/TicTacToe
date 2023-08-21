const diffSwitch = document.querySelector(".play-bot-diff");
diffSwitch.addEventListener('click', setDiff);

function setDiff() {
    if(diffSwitch.textContent === "Easy") {
        diffSwitch.textContent = "Medium";
    }
    else if(diffSwitch.textContent === "Medium") {
        diffSwitch.textContent = "Hard";
    }
    else if(diffSwitch.textContent === "Hard") {
        diffSwitch.textContent = "Easy"
    }
}