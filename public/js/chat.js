const socket = io();

const messageWindow = document.querySelector(".message");
const msgBox = document.querySelector(".message_box");
const msgInput = document.querySelector(".text");
const input = document.querySelector("#message");
const submitBtn = document.querySelector(".submit_btn");
const sendLocationBtn = document.querySelector(".send_location");
const usersBox = document.querySelector(".users-box");
const roomBox = document.querySelector(".room-name");

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on("message", (message) => {
  createMsg(message);
});

/* const moment = moment(message.createdAt).format("h:mm a"); */

// -------------------- Render functions

const autoscroll = () => {
  /* const newMessage = msgBox.lastElementChild;

  const newMessageStyles = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  const visibleHeight = msgBox.offsetHeight;

  const containerHeight = msgBox.scrollHeight;

  const scrollOffset = msgBox.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    msgBox.scrollTop = msgBox.scrollHeight;
  }

  console.log(newMessageMargin); */
  const newMessage = msgBox.lastElementChild;
  const newMessageHeight = newMessage.offsetHeight;
  const visibleHeight = msgBox.offsetHeight;
  const containerHeight = msgBox.scrollHeight;
  console.log(visibleHeight);
  console.log(containerHeight);
  const scrollOffset = msgBox.scrollTop + visibleHeight;
  console.log(scrollOffset);
  if (containerHeight - newMessageHeight - 15 <= scrollOffset) {
    msgBox.scrollTop = msgBox.scrollHeight;
  }
};

const createMsg = function (message) {
  const html = `
          <div class="message-singl">
          <div class="secondary-info">
              <p class="username">${message.username}</p>
              <p class="created-at">${moment(message.createdAt).format("h:mm a")}</p>
            </div>
            <p class="msg-text">${message.text}</p>
          </div>
  `;

  msgBox.insertAdjacentHTML("beforeend", html);
  autoscroll();
};

const createLinkMsg = function (message) {
  const html = `
  <div class="message-singl">
  <div class="secondary-info">
  <p class="username">${message.username}</p>
  <p class="created-at">${moment(message.createdAt).format("h:mm a")}</p>
  </div>
  <a class="msg-text" href='${message.url}'>My current location!</a>
  </div>
  `;

  msgBox.insertAdjacentHTML("beforeend", html);
  autoscroll();
};

const renderInfo = (room, users) => {
  usersBox.innerHTML = " ";

  roomBox.textContent = room;

  const usersHtml = users
    .map((user) => {
      return `<p class="username-inf">${user.username}</p>`;
    })
    .join(" ");

  usersBox.insertAdjacentHTML("beforeend", usersHtml);
};

msgInput.addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit("sendMessage", msgInput.elements["message"].value, (err) => {
    submitBtn.setAttribute("disabled", "disabled");
    input.value = "";
    input.focus();
    submitBtn.removeAttribute("disabled");

    if (err) {
      return console.log(err);
    }
    console.log("Message was delivered");
  });
});

sendLocationBtn.addEventListener("click", (e) => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }
  sendLocationBtn.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      (response) => {
        sendLocationBtn.removeAttribute("disabled");
        console.log(response);
      }
    );
  });
});

//----------------------Location messagers

socket.on("locationMessage", (location) => {
  createLinkMsg(location);
});

socket.on("roomData", ({ room, users }) => {
  renderInfo(room, users);
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

/* const countWindow = document.querySelector(".count");
const incBtn = document.querySelector(".inc-count");

socket.on("countUpdated", (count) => {
  console.log("Count has been updated");
  countWindow.textContent = `this is the count: ${count}`;
});

incBtn.addEventListener("click", () => {
  socket.emit("increment");
  console.log("click");
}); */
