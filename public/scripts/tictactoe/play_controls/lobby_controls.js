import { joinRoom } from "../online/gameController.js";
import { handleNewGame } from "./new_game.js";

const lobbyCreateButton = document.querySelector(".play-create-lobby");
const lobbyJoinButton = document.querySelector(".play-join-lobby");
const lobbyCreateText = document.querySelector(".play-create-lobby-text");
const lobbyJoinForm = document.querySelector(".play-join-lobby-form");
const lobbyJoinLabel = document.querySelector(".play-join-lobby-label");
const lobbyJoinInput = document.querySelector(".play-join-lobby-input");
const lobbyJoinSubmit = document.querySelector(".play-join-lobby-submit");
const lobbyBackButton = document.querySelector(".play-lobby-back-button");
const lobbyOppDiv = document.querySelector(".play-lobby-opp");
const lobbyOppDivText = lobbyOppDiv.querySelector("p");
const botDiffDiv = document.querySelector(".play-bot-buttons");
const basicButtonsDiv = document.querySelector(".play-basic");
const lobbyCopyText = document.querySelector(".play-copied-text");

// does not exist until createLobby runs
let lobbyCopyButton;

lobbyCreateText.style.display = "none";
lobbyJoinForm.style.display = "none";
lobbyBackButton.style.display = "none";
lobbyOppDiv.style.display = "none";
lobbyCopyText.style.display = "none";

lobbyCreateButton.addEventListener("click", createLobby);
lobbyJoinButton.addEventListener("click", joinLobby);
lobbyBackButton.addEventListener("click", backLobby);
lobbyJoinForm.addEventListener("submit", handleSubmit);

const lobbyButtonHandler = () => {
    lobbyCreateButton.style.display = "none";
    lobbyJoinButton.style.display = "none";
    lobbyBackButton.style.display = "block";
    botDiffDiv.style.display = "none";
    lobbyOppDiv.style.display = "flex";
    basicButtonsDiv.style.display = "none";

    handleNewGame(true);
}

function createLobby() {
    lobbyButtonHandler();
    lobbyCreateText.style.display = "flex";

    const uid = new ShortUniqueId();
    const roomId = uid();
    joinRoom(roomId, 'create');

    lobbyCreateText.innerHTML = 
    `<p>Room: ${roomId}&nbsp</p>
    <button class="play-create-lobby-copy">
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="lightgrey"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
    </button>`;
    lobbyCopyButton = document.querySelector(".play-create-lobby-copy");
    lobbyCopyButton.addEventListener("click", copyRoomId);

    lobbyOppDivText.textContent = "Waiting for player";
    lobbyOppDivText.classList.add("lobby-loading");
}

function joinLobby() {
    lobbyButtonHandler();
    lobbyJoinForm.style.display = "flex";

    lobbyOppDivText.textContent = "Join a lobby!";
}

function backLobby() {
    lobbyCreateButton.style.display = "block";
    lobbyJoinButton.style.display = "block";
    lobbyCreateText.style.display = "none";
    lobbyJoinForm.style.display = "none";
    botDiffDiv.style.display = "flex";
    lobbyOppDiv.style.display = "none";
    lobbyBackButton.style.display = "none";
    basicButtonsDiv.style.display = "flex";
    lobbyCopyText.style.display = "none";

    lobbyCopyButton = undefined;

    lobbyJoinInput.value = "";
    lobbyOppDivText.textContent = "";
    lobbyOppDivText.classList.remove("lobby-loading");

    handleNewGame(false);
}

function copyRoomId() {
    lobbyCopyText.classList.remove("copied-fade-out");
    navigator.clipboard.writeText(lobbyCreateText.innerText.split(': ')[1].slice(0, 6));

    lobbyCopyText.style.display = "block";
    lobbyCopyText.classList.add("copied-fade-out");
}

function handleSubmit(e) {
    e.preventDefault();
    const joinId = lobbyJoinInput.value;
    joinRoom(joinId, 'join');
}

export function badRoom(reason) {
    if(reason === 'room full') {
        lobbyOppDivText.textContent = "Lobby is full!";
    }
    else {
        lobbyOppDivText.textContent = "Invalid Lobby Code!";
    }
}