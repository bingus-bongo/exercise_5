/* For room.html */
// Requires elements to be loaded first
document.addEventListener('DOMContentLoaded', function() {
  const pathname = window.location.pathname;
  if (pathname.includes('/rooms/')) {
    chatroom();
  } else if (pathname.includes('/profile')){
    profile();
  }
});

function chatroom() {
  // Get room_id to use in functions
  const invite = document.querySelector('#invite-link');
  room_id = invite.getAttribute('href').split('/').pop();

  // Clear sample messages
  const chatbox = document.body.querySelector('.messages');
  chatbox.innerHTML = '';

  // Render room messages
  renderAllMessages();

  // Listen for chatting with submit button
  submitbutton = document.body.querySelector('form button');
  submitbutton.addEventListener('click', function(event){
    event.preventDefault()
    let message = document.body.querySelector('textarea').value;
    postMessage(message);
  });

  // Listen for clicks to change roomname
  display = document.body.querySelector('.display');
  display_a = document.body.querySelector('.display a');
  edit = document.body.querySelector('.edit');
  edit_a = document.body.querySelector('.edit a');

  display_a.addEventListener('click', function(event) {
    edit.classList.remove('hide');
    display.classList.add('hide');
  })

  edit_a.addEventListener('click', function(event) {
    room_input = document.body.querySelector('.edit input');
    new_room_name = room_input ? room_input.value: '';
    updateRoomName(new_room_name).then(update_name => {
      room_input.value = update_name;
      display_name = document.body.querySelector('.roomName');
      display_name.textContent = update_name;
    })
    display.classList.remove('hide');
    edit.classList.add('hide');
  })
}

function profile() {
  const update_name_button = document.querySelector('button.username');
  update_name_button.addEventListener('click', function(event) {
    const update_name_field = document.querySelector('input.username');
    const new_username = update_name_field ? update_name_field.value: '';
    updateUsername(new_username).then(updated_username => {
      update_name_field.value = updated_username;
    })
  })

  const update_password_button = document.querySelector('button.password');
  update_password_button.addEventListener('click', function(event) {
    const update_password_field = document.querySelector('input.password');
    const new_password = update_password_field ? update_password_field.value: '';
    updatePassword(new_password).then(updated_password => {
      update_password_field.value = updated_password;
    })
  })
}

// TODO: Fetch the list of existing chat messages.
// POST to the API when the user posts a new message.
// Automatically poll for new messages on a regular interval.
// Allow changing the name of a room
async function postMessage(message) {
  const url = `/rooms/${room_id}/new/message`;
  const text = {message: message};

  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': WATCH_PARTY_API_KEY,
    },
    body: JSON.stringify(text)
  })
}

async function getMessages() {
  const url = `/rooms/${room_id}/get/messages`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'api-key': WATCH_PARTY_API_KEY,
    },
  })

  const messages = response.json();
  return messages;
}

function startMessagePolling() {
  let latest_length = 0;
  const invite = document.querySelector('#invite-link');
  room_id = invite.getAttribute('href').split('/').pop();
  (async() => {
    const starting_messages = await getMessages();
    latest_length = starting_messages.length;

    setInterval(async() => {
      // console.log('Just checked');
      const messages = await getMessages();
      if (messages.length > latest_length) {
        renderNewMessage();
        latest_length += 1;
      }
    }, 100)
  })();
}

async function updateRoomName(new_room_name) {
  const url = `/rooms/${room_id}/namechange`;
  const text = {new_room_name: new_room_name};
  const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': WATCH_PARTY_API_KEY,
      },
      body: JSON.stringify(text)
    })
    if (response.ok) {
      return new_room_name;
    }
  }

// Helpers
function renderAllMessages() {
  // Get and render messages on the page
  const chatbox = document.body.querySelector('.messages');
  getMessages().then(messages => {
    messages.forEach(message => {
      console.log(message);
      new_message = document.createElement('message');
      new_author = document.createElement('author');
      new_author.innerHTML = message['name'];
      new_content = document.createElement('content');
      new_content.innerHTML = message['body'];
      new_message.appendChild(new_author);
      new_message.appendChild(new_content);
      chatbox.appendChild(new_message);
    })
  })
}

function renderNewMessage() {
const chatbox = document.body.querySelector('.messages');
getMessages().then(messages => {
  const new_message_obj = messages[messages.length - 1];
  new_message = document.createElement('message');
  new_author = document.createElement('author');
  new_author.innerHTML = new_message_obj['name'];
  new_content = document.createElement('content');
  new_content.innerHTML = new_message_obj['body'];
  new_message.appendChild(new_author);
  new_message.appendChild(new_content);
  chatbox.appendChild(new_message);
});
}

/* For profile.html */

// TODO: Allow updating the username and password

async function updateUsername(new_username) {
  const url = `/api/user/name`;
  const text = {new_username: new_username};
  const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': WATCH_PARTY_API_KEY,
      },
      body: JSON.stringify(text)
    })
    if (response.ok) {
      return new_username;
    }
  }

  async function updatePassword(new_password) {
    const url = `/api/user/password`;
    const text = {new_password: new_password};
    const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': WATCH_PARTY_API_KEY,
        },
        body: JSON.stringify(text)
      })
      if (response.ok) {
        return new_password;
      }
    }
