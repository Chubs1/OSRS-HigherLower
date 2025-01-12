/*
    chanceOfHard is from 0-1 the percent it will try to do hard mode
    range is how far the price can be so if price is 100, range = 0.1 : 90 < newPrice < 110
    minimumPrice is the minimum price it will try to do hard mode

    also while picking new item it keeps a log of the past 10 in usedItems
*/

const tempItemIDs = [];
let items = [];
const currentItems = [];
const usedItems = [];
let score = 0;
let bestScore = getScore();

const difficulty = [
  {
    chanceOfHard: 0,
    range: 0.1,
    minimumPrice: 1000
  },
  {
    chanceOfHard: 0.5,
    range: 0.2,
    minimumPrice: 1000
  },
  {
    chanceOfHard: 1,
    range: 0.2,
    minimumPrice: 1000
  }
];
// 0 = easy, 1 = medium, 2 = hard
// game was meant for medium
let selectedDifficulty = 1;

function getScore() {
  var name = "bestScore=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return 0; // Return a default value if the score is not found
}

const pickNewItem = (chance = 0, range = 0.1, minimumPrice = 1000) => {
  if (Math.random() < chance && currentItems[2].itemPrice >= minimumPrice) {
    const low = currentItems[2].itemPrice - range * currentItems[2].itemPrice;
    const high = currentItems[2].itemPrice + range * currentItems[2].itemPrice;
    const hardMode = items.filter(
      (item) =>
        item.itemPrice >= low &&
        item.itemPrice <= high &&
        !usedItems.includes(item)
    );

    const randomPickHard = Math.floor(Math.random() * hardMode.length);
    currentItems.push(hardMode[randomPickHard]);
    usedItems.push(hardMode[randomPickHard]);
  } else {
    const easyMode = items.filter((item) => !usedItems.includes(item));
    const randomPick = Math.floor(Math.random() * items.length);
    currentItems.push(easyMode[randomPick]);
    usedItems.push(easyMode[randomPick]);
  }
  if (currentItems.length > 3) {
    currentItems.shift();
  }
  if (usedItems.length > 10) {
    usedItems.shift();
  }
};

const loadWebsite = () => {
  score = 0;
  pickNewItem();
  pickNewItem();
  pickNewItem();
    
  document.querySelector("#app").innerHTML = `
  <div class="lds-dual-ring"></div>
    <span id="left">
    <h2 id="bestScoreText">Best Score: ${bestScore}</h2>

        <span class="content">
            <img src="${currentItems[0].itemURL}">
            <h2 id="leftItemName">${currentItems[0].itemName.replace(
              /_/g,
              " "
            )} <br> (${currentItems[0].itemPrice.toLocaleString()} GP)</h2>
        </span>

    
    
    </span>
    <span id="center">
  
            <h2>            
                ${currentItems[1].itemName.replace(/_/g, " ")}
                <br>
                Is <br> 
                Worth
            </h2> 

        <div id="buttons">
            <button class="buttons" id="more">More</button>
            <h4>or</h4>
            <button class="buttons" id="less">Less</button>
        </div>

            <h2 id="than">        
                Than
                <br> 
                ${currentItems[0].itemName.replace(/_/g, " ")}
            </h2> 
   
    </span>
    <span id="right">
    <h2 id="scoreText">Score: ${score}</h2>

        <span class="content">

         
            <div class="arrows" id="moreArrow"></div>
            <img src="${currentItems[1].itemURL}">
            <h2 id="rightItemName">${currentItems[1].itemName.replace(
              /_/g,
              " "
            )}</h2>
            <div class="arrows" id="lessArrow"></div>
        
            </div>
        </span>

    </span>
   
`;

  const leftItemName = document.querySelector("#leftItemName");
  const rightItemName = document.querySelector("#rightItemName");
  const moreButton = document.querySelector("#more");
  const lessButton = document.querySelector("#less");
  const leftContent = document.querySelector("#left .content");
  const rightContent = document.querySelector("#right .content");
  const moreArrow = document.querySelector("#moreArrow");
  const lessArrow = document.querySelector("#lessArrow");
  const leftImage = document.querySelector("#left .content img");
  const rightImage = document.querySelector("#right .content img");
  const centerText = document.querySelector("#center h2");
  const left = document.querySelector("#left");
  const center = document.querySelector("#center");
  const right = document.querySelector("#right")
  const scoreText = document.querySelector("#scoreText");
  const bestScoreText = document.querySelector("#bestScoreText");
  const thanText = document.querySelector("#than");
  let loaded = 0
            
  left.style.display = 'none'
  center.style.display = 'none'
  right.style.display = 'none'

  leftImage.addEventListener('load', () => {
        loaded++
        if(loaded == 2){
            left.style.display = 'flex'
            center.style.display = 'flex'
            right.style.display = 'flex'
            document.querySelector(".lds-dual-ring").style.display = 'none'

          }
  })
    rightImage.addEventListener('load', () => {
        loaded++
        if(loaded == 2){
            left.style.display = 'flex'
            center.style.display = 'flex'
            right.style.display = 'flex'
            document.querySelector(".lds-dual-ring").style.display = 'none'
          }
    })
  

  moreButton.addEventListener("mouseover", () => {
    if(!moreButton.disabled){
    moreArrow.classList.add("moreHover");
    }
  });
  moreButton.addEventListener("mouseout", () => {
    moreArrow.classList.remove("moreHover");
  });
  lessButton.addEventListener("mouseover", () => {
    if(!lessButton.disabled){
    lessArrow.classList.add("lessHover");
    }
  });
  lessButton.addEventListener("mouseout", () => {
    lessArrow.classList.remove("lessHover");
  });

  leftImage.onerror = () => {
    leftImage.src = "./error.jpg";
  };

  rightImage.onerror = () => {
    rightImage.src = "./error.jpg";
  };

  const easeOutQuad = (t) => {
    return 1 - Math.pow(2.2, -10 * t);
  };

  const revealCoins = (arrow, arrowClick) => {
    arrow.classList.remove(`${arrowClick}`);
    rightImage.setAttribute("src", "./coins.png");
    let startTime;
    let i = 1;
    const animate = (currentTime) => {
      if (!startTime) {
        startTime = currentTime;
      }
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (COINSTAY - 1000), 1);
      const easedProgress = easeOutQuad(progress);
      const currentValue = Math.floor(
        (easedProgress + 0.0001) * currentItems[1].itemPrice
      );
      lessArrow.innerHTML = `<h1>${currentValue.toLocaleString()}</h1>`;
      if (currentValue >= currentItems[1].itemPrice) {
        lessArrow.innerHTML = `<h1>${currentItems[1].itemPrice.toLocaleString()}</h1>`;
      }
      if (elapsed < COINSTAY - 1000) {
        requestAnimationFrame(animate);
      } else {
        lessArrow.innerHTML = `<h1>${currentItems[1].itemPrice.toLocaleString()}</h1>`;
      }
    };
    requestAnimationFrame(animate);
  };

  const backToItem = () => {
    rightImage.setAttribute("src", `${currentItems[1].itemURL}`);
    rightItemName.innerHTML = `${currentItems[1].itemName.replace(
      /_/g,
      " "
    )} <br> (${currentItems[1].itemPrice.toLocaleString()} GP)`;
    lessArrow.innerHTML = ``;
  };

  const reset = (clickClass) => {
    rightContent.classList.remove(`${clickClass}`);
  };

  const toggleReveal = (time, callback = () => {}, args = [false]) => {
    setTimeout(() => {
      rightContent.classList.toggle("revealY");
      callback(...args);
    }, time);
  };

  const COINTOCENTER = 1000;
  const COINSTAY = 2750;
  const ITEMCENTER = 1000;
  const ITEMMOVE = 1000;

  const correctAnimation = () => {
    setTimeout(() => {
      score++;
      if (score > bestScore) {
        bestScore++;
        document.cookie = `bestScore=${bestScore}; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/`;
        bestScoreText.textContent = `Best Score : ${bestScore}`;
      }

      scoreText.textContent = `Score: ${score}`;
      rightContent.classList.toggle("revealX");
      leftContent.classList.toggle("revealX");
    }, COINTOCENTER + COINSTAY + ITEMCENTER + ITEMMOVE);

    setTimeout(() => {
      leftContent.classList.toggle("revealX");
      // new item
      leftImage.setAttribute("src", `${currentItems[2].itemURL}`);
      leftContent.classList.toggle("revealNewItem");

      leftItemName.textContent = `${currentItems[2].itemName.replace(
        /_/g,
        " "
      )}`;

      setTimeout(() => {
        rightContent.classList.toggle("revealX");
        leftContent.classList.toggle("revealNewItem");
        leftImage.setAttribute("src", `${currentItems[1].itemURL}`);
        leftItemName.innerHTML = `${currentItems[1].itemName.replace(
          /_/g,
          " "
        )} <br> (${currentItems[1].itemPrice.toLocaleString()} GP)`;
        rightImage.setAttribute("src", `${currentItems[2].itemURL}`);
        rightItemName.textContent = `${currentItems[2].itemName.replace(
          /_/g,
          " "
        )}`;
        pickNewItem(
          difficulty[selectedDifficulty].chanceOfHard,
          difficulty[selectedDifficulty].range,
          difficulty[selectedDifficulty].minimumPrice
        );
        centerText.innerHTML = `
                ${currentItems[1].itemName.replace(/_/g, " ")}
                <br>
                Is <br> 
                Worth
                `;
        thanText.innerHTML = `        
                    Than
                    <br> 
                    ${currentItems[0].itemName.replace(/_/g, " ")}
                 `;
        moreButton.disabled = false;
        lessButton.disabled = false;
      }, 1500);
    }, COINTOCENTER + COINSTAY + ITEMCENTER + ITEMMOVE + 700);
  };

  moreButton.addEventListener("click", () => {
    moreButton.disabled = true;
    lessButton.disabled = true;
    const computedStyle = getComputedStyle(moreArrow);
    const backgroundPosition = computedStyle.backgroundPosition;

    moreArrow.classList.remove("moreHover");
    moreArrow.classList.add("moreArrowClick");

    moreArrow.style.backgroundPosition = backgroundPosition;

    rightContent.classList.add("moreClick");
    rightContent.classList.remove("lessClick");

    // this takes the item from the top and puts it back to the center
    toggleReveal(COINTOCENTER, revealCoins, [moreArrow, "moreArrowClick"]);
    // takes the coins away maybe fiddle with this to make it longer
    toggleReveal(COINTOCENTER + COINSTAY);
    // puts the item back in the center
    toggleReveal(COINTOCENTER + COINSTAY + ITEMCENTER, backToItem);

    if (currentItems[0].itemPrice <= currentItems[1].itemPrice) {
      toggleReveal(COINTOCENTER + COINSTAY + ITEMCENTER + ITEMMOVE, reset, [
        "moreClick"
      ]);
      correctAnimation();
    } else {
      setTimeout(() => {
        center.innerHTML = `<button class="buttons" id="resetButton">Again?</button>`;
        document
          .querySelector("#resetButton")
          .addEventListener("click", loadStart);
      }, COINTOCENTER + COINSTAY + ITEMCENTER + 1500);
    }
  });

  lessButton.addEventListener("click", () => {
    moreButton.disabled = true;
    lessButton.disabled = true;

    const computedStyle = getComputedStyle(lessArrow);
    const backgroundPosition = computedStyle.backgroundPosition;

    lessArrow.classList.remove("lessHover");
    lessArrow.classList.add("lessArrowClick");
    lessArrow.style.backgroundPosition = backgroundPosition;

    rightContent.classList.add("lessClick");
    rightContent.classList.remove("moreClick");

    toggleReveal(COINTOCENTER, revealCoins, [lessArrow, "lessArrowClick"]);
    toggleReveal(COINTOCENTER + COINSTAY);
    toggleReveal(COINTOCENTER + COINSTAY + ITEMCENTER, backToItem);

    if (currentItems[0].itemPrice >= currentItems[1].itemPrice) {
      toggleReveal(COINTOCENTER + COINSTAY + ITEMCENTER + ITEMMOVE, reset, [
        "lessClick"
      ]);
      correctAnimation();
    } else {
      setTimeout(() => {
        center.innerHTML = `<button class="buttons" id="resetButton">Again?</button>`;
        document
          .querySelector("#resetButton")
          .addEventListener("click", loadStart);
      }, COINTOCENTER + COINSTAY + ITEMCENTER + 1500);
    }
  });
};

const loadStart = () => {
  document.querySelector("#app").innerHTML = `
    <div id="difficultyButtons">
    <button class="buttons easyButton difficultyButton">Easy</button>
    <button class="buttons mediumButton difficultyButton selectedMedium">Medium</button>
    <button class="buttons hardButton difficultyButton">Hard</button>
    <button class="buttons startButton">Play</button>
    </div>
  
`;
  document
    .querySelector(".buttons.startButton")
    .addEventListener("click", loadWebsite);
  const easyButton = document.querySelector(".buttons.easyButton");
  const mediumButton = document.querySelector(".buttons.mediumButton");
  const hardButton = document.querySelector(".buttons.hardButton");
  easyButton.addEventListener("click", () => {
    easyButton.classList.add("selectedEasy");
    mediumButton.classList.remove("selectedMedium");
    hardButton.classList.remove("selectedHard");

    selectedDifficulty = 0;
    console.log("easy mode");
  });
  mediumButton.addEventListener("click", () => {
    easyButton.classList.remove("selectedEasy");
    mediumButton.classList.add("selectedMedium");
    hardButton.classList.remove("selectedHard");

    selectedDifficulty = 1;
    console.log("medium mode");
  });
  hardButton.addEventListener("click", () => {
    easyButton.classList.remove("selectedEasy");
    mediumButton.classList.remove("selectedMedium");
    hardButton.classList.add("selectedHard");

    selectedDifficulty = 2;
    console.log("hard mode");
  });
};

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://prices.runescape.wiki/api/v1/osrs/mapping")
    .then((data) => data.json())
    .then((response) => {
      response.forEach((item) => {
        tempItemIDs.push({
          itemName: item.name.replace(/ /g, "_"),
          itemID: item.id
        });
      });
      return fetch("https://prices.runescape.wiki/api/v1/osrs/1h");
    })
    .then((data) => data.json())
    .then((response) => {
      tempItemIDs.forEach((item) => {
        item.itemURL = `https://oldschool.runescape.wiki/images/${item.itemName}_detail.png?44ad6`;
        item.itemPrice = response.data[item.itemID]?.avgLowPrice;
        if (!item.itemPrice) {
          item.itemPrice = response.data[item.itemID]?.avgHighPrice;
        }
      });
      items = tempItemIDs.filter(
        (item) => item.itemPrice != null || item.itemPrice != undefined
      );

      loadStart();
    })
    .catch((error) => {
      console.error(error);
    });
});
