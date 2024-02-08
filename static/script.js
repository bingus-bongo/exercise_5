/* For room.html */
// Requires elements to be loaded first
document.addEventListener('DOMContentLoaded', function() {
  // Get room_id to use in functions
  const invite = document.querySelector('#invite-link');
  room_id = invite.getAttribute('href').split('/').pop();

  // Clear sample messages
  const chatbox = document.body.querySelector('.messages');
  chatbox.innerHTML = '';

  // Listen for chatting with submit button
  submitbutton = document.body.querySelector('form button');

  submitbutton.addEventListener('click', function(event){
    let message = document.body.querySelector('textarea').value;
    postMessage(message);
  });

  // Get and render messages on the page
  const messages = getMessages();
  console.log(messages);
});

// TODO: Fetch the list of existing chat messages.
// POST to the API when the user posts a new message.
// Automatically poll for new messages on a regular interval.
// Allow changing the name of a room
function postMessage(message) {
  const url = `/rooms/${room_id}/new/message`;
  const text = {message: message};

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api_key': WATCH_PARTY_API_KEY,
    },
    body: JSON.stringify(text)
  })
  return;
}

function getMessages() {
  console.log(WATCH_PARTY_API_KEY);
  const url = `/rooms/${room_id}/get/messages`;
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'api_key': WATCH_PARTY_API_KEY,
    },
  })
}

function startMessagePolling() {
  return;
}

function updateRoomName() {
  return;
}

/* For profile.html */

// TODO: Allow updating the username and password
