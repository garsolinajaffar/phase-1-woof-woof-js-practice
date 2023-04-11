const dogBar = document.querySelector('#dog-bar');
const dogInfo = document.querySelector('#dog-info');
const filterBtn = document.querySelector('#good-dog-filter');

let filtered = false;

// Fetch all the dog data from the server and add them to the dog bar
fetch('http://localhost:3000/pups')
  .then(response => response.json())
  .then(data => {
    data.forEach(pup => {
      const pupSpan = document.createElement('span');
      pupSpan.textContent = pup.name;
      pupSpan.addEventListener('click', () => displayDogInfo(pup));
      dogBar.appendChild(pupSpan);
    });
  });

// Display the info of the clicked pup in the dog info section
function displayDogInfo(pup) {
  dogInfo.innerHTML = `
    <img src="${pup.image}">
    <h2>${pup.name}</h2>
    <button>${pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
  `;
  // Add a click event listener to the Good Dog/Bad Dog button to toggle the pup's status
  const dogBtn = dogInfo.querySelector('button');
  dogBtn.addEventListener('click', () => {
    pup.isGoodDog = !pup.isGoodDog;
    dogBtn.textContent = pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
    updatePup(pup);
  });
}

// Update the pup's status in the server
function updatePup(pup) {
  fetch(`http://localhost:3000/pups/${pup.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      isGoodDog: pup.isGoodDog
    })
  });
}

// Add a click event listener to the Filter Good Dogs button to toggle the filter
filterBtn.addEventListener('click', () => {
  filtered = !filtered;
  filterBtn.textContent = filtered ? 'Filter good dogs: ON' : 'Filter good dogs: OFF';
  filterDogs();
});

// Filter the dogs in the dog bar based on the filter status
function filterDogs() {
  const pups = dogBar.querySelectorAll('span');
  pups.forEach(pup => {
    const id = pup.dataset.id;
    const isGoodDog = JSON.parse(pup.dataset.isGoodDog);
    if (filtered && !isGoodDog) {
      pup.style.display = 'none';
    } else {
      pup.style.display = 'inline-block';
    }
  });
}
