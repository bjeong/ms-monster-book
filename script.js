//Base code adapted from "Cocktails A-Z" by Harold Sikkema
//Creating an array of each letter for navigation
let alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

/* page elements */
const navMenu = document.querySelector('nav#menu')
const mainContent = document.querySelector('main#content')

/* Construct a navigation menu from the array of letters above. */
alphabet.forEach(letter => {
  let menuItem = document.createElement('a')
  menuItem.classList.add('menuItem')
  menuItem.setAttribute('id', letter)
  menuItem.innerHTML = letter
  // add an event listener to monitor for clicks.
  menuItem.addEventListener('click', event => clickLetter(event))
  navMenu.appendChild(menuItem)
})

//Testing level filter


const clickLetter = (event) => {
  // use the id of the element to find out which letter was clicked
  let currentLetter = event.currentTarget.id;
  // Reset CSS class for all letters so that none are "selected"
  document.querySelectorAll('.menuItem').forEach(menuItem => {
    menuItem.classList.remove('selected')
  })
  document.querySelector('#' + currentLetter).classList.add('selected')
  // pass along the current letter to the getMonsters function
  getMonsters(currentLetter)
}

/* Fetches monster name and image based on letter clicked */
const getMonsters = (letter) => {
  // request to get all monsters containing the selected letter 
  // let endpointURL = 'https://api.maplestory.net/monsters/?minLevel=1&version=232&maxEntries=2000&nameText=' + letter
  /* cleaned up parameters adapted with help from Harold Sikkema*/
  let baseURL = 'https://api.maplestory.net/monsters/'
  let queryParams = '?' + new URLSearchParams({
    maxEntries: 9000,
    minLevel: 1,
    version: 232,
    // sortBy: "+level",
    nameText: letter
  })
  let endpointURL = baseURL + queryParams
  fetch(endpointURL)
    .then(response => response.json())
    .then(response => {
      console.log(response)
      displayMonsters(response.result, letter)

    })


    .catch(error => console.log(error))
}



const displayMonsters = (result, letter) => {
  // reset the main content div to clear away previous results.
  mainContent.innerHTML = ""
  if (result == null) {
    /* Notify user in case there are no monsters for the specified letter */
    mainContent.innerHTML = "No monsters found."
  }
  else {
    result.forEach(monster => {

      /* loop to check the first letter of each monster's name */
      /* added parameters to filter "junk" monsters */
      if (monster.name.charAt(0) == letter & monster.rewards.exp > 1 & monster.stats.attack > 1 & monster.stats.attack < 20000) {
        // console.log(monster.name.charAt(0))
        // console.log(monster.monsterId)

        /* store the monsterId to call later for icon*/
        let monsterId = monster.monsterId
        /* call dispayIcons function to show the monster's image*/
        displayIcons(monsterId)




      }
    })
  }
}

/* function used to get monster images */
const displayIcons = (monsterId) => {

  let endpointURL = 'https://api.maplestory.net/monster/' + monsterId
  fetch(endpointURL)
    .then(response => response.json())
    .then(response => {

      let div = document.createElement('div')
      div.classList.add('monster')
      /* storing the URL as a variable*/
      let monsterImg = 'https://api.maplestory.net/monster/' + monsterId + '/icon'

      /* change background hue based on level */
      const hue = (level) => (120 - level / 2)
      let h = hue(response.stats.level)

      div.style.background = `hsl(${h}, 50%, 70%)`

      div.innerHTML =
        `<img class="monstericon" src=${monsterImg}>
        <p class="name">${response.name}</p>
        <p class="stats"><img src='Weight.webp' class='staticon'>Level: ${response.stats.level}</p>
        <p class="maxHp"><img src='heart.png' class='staticon'>HP: ${response.stats.maxHp}</p>
        <p class="attack"><img src='sword.png' class='staticon'>Attack: ${response.stats.attack}</p>
        <p class="stats"><img src='exp.webp' class='staticon'>Exp: ${response.rewards.exp}</p>`


      mainContent.appendChild(div);

    })
}

