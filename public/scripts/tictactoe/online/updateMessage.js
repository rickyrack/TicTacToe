const onlineMsgDiv = document.querySelector(".play-online-message");

onlineMsgDiv.style.display = "none";

export const waitForTurn = () => {
    onlineMsgDiv.style.display = "block";
    onlineMsgDiv.innerHTML = "<p>It's not your turn!</p>"
    onlineMsgDiv.classList.add("online-msg-fade-out");
}

export const clearUpdateMsg = () => {
    onlineMsgDiv.style.display = "none";
    onlineMsgDiv.classList.remove("online-msg-fade-out");
}