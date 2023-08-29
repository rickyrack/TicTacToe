const lobbyCreateButton = document.querySelector(".play-create-lobby");
const lobbyJoinButton = document.querySelector(".play-join-lobby");
const lobbyCreateText = document.querySelector(".play-create-lobby-text");
const lobbyJoinForm = document.querySelector(".play-join-lobby-form");
const lobbyJoinLabel = document.querySelector(".play-join-lobby-label");
const lobbyJoinInput = document.querySelector(".play-join-lobby-input");
const lobbyJoinSubmit = document.querySelector(".play-join-lobby-submit");
const lobbyBackButton = document.querySelector(".play-lobby-back-button");

lobbyCreateText.style.display = "none";
lobbyJoinForm.style.display = "none";
lobbyBackButton.style.display = "none";

lobbyCreateButton.addEventListener("click", createLobby);
lobbyJoinButton.addEventListener("click", joinLobby);
lobbyBackButton.addEventListener("click", backLobby);

const lobbyButtonHandler = () => {
    lobbyCreateButton.style.display = "none";
    lobbyJoinButton.style.display = "none";
    lobbyBackButton.style.display = "block";
}

function createLobby() {
    lobbyButtonHandler();
    lobbyCreateText.style.display = "flex";
}

function joinLobby() {
    lobbyButtonHandler();
    lobbyJoinForm.style.display = "flex";
}

function backLobby() {
    lobbyCreateButton.style.display = "block";
    lobbyJoinButton.style.display = "block";
    lobbyCreateText.style.display = "none";
    lobbyJoinForm.style.display = "none";
    lobbyBackButton.style.display = "none";
}