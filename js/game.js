'use strict';

// Array that all questions are being pushed to from the constructor
Question.allQuestions = [];

var questionCounter = 0;
var downloadTimer = null;

// sound files
var correct = new Audio('sound/correct.mp3');
var gameover = new Audio('sound/gameover.mp3');
var ticktock = new Audio('sound/ticktock.mp3');
var outoftime = new Audio('sound/outoftime.mp3');
var winner = new Audio('sound/sparkle.mp3');
var soundsArray = [correct, gameover, ticktock, outoftime, winner];

// variables accessing elements in the HTML
var divQuestionEl = document.getElementById('question');
var divAnswerEl = document.getElementById('answers');
var divAnswerElAB = document.getElementById('answersAB');
var divAnswerElCD = document.getElementById('answersCD');
var nextQuestionDiv = document.getElementById('next-question');
var timerEl = document.getElementById('timer');
var divLevelIndicatorEl = document.getElementById('levelIndicator');
var endGameMsgEl = document.getElementById('endGameMsg');
var level = document.getElementById('level');
var divLogOutEl = document.getElementById('logout');
var rand = 0;

function User(username, password) {
  this.username = username;
  this.password = password;
  this.topScore = 0;
  User.allUsers.push(this);
}

// if page is refreshed set current user's score to 0 and save it to localStorage
// if currentUser's data exists in localStorage, retrieve it
User.currentUser = {name: '', score: 0, topScore: 0};
if(performance.navigation.type === 1 && localStorage.currentUser){
  checkSavedCurrentUser();
  returnUser();
  User.currentUser['score'] = 0;
  saveCurrentUser();
  questionCounter = 0;
}else if(performance.navigation.type === 0 && localStorage.currentUser){
  checkSavedCurrentUser();
  returnUser();
}

// Constructor function
function Question(question, answer, setOfAnswers, difficulty) {
  this.question = question;
  this.answer = answer;
  this.setOfAnswers = setOfAnswers;
  this.difficulty = difficulty;
  Question.allQuestions.push(this);
}

// New Instances of the constructor
new Question('What movie won best picture at the 2017 Academy Awards?', 'Moonlight', ['Moonlight', 'La La Land', 'Manchester by the Sea', 'Fences'], 3);
new Question('In the movie The Terminator, what is the name of the company that created Skynet?', 'Cyberdyne Systems', ['Cyberdyne Systems', 'Code Fellows', 'Multi-National United', 'Tetravaal'], 2);
new Question('Emma Watson is known for playing which character in Harry Potter?', 'Hermione Granger', ['Hermione Granger', 'Luna Lovegood', 'Bellatrix Lestrange', 'Nymphadora Lupin'], 1);
new Question('Bruce Banner turns into what fictional superhero when he becomes angry?', 'The Hulk', ['The Hulk', 'Batman', 'Ironman', 'Antman'], 2);
new Question('Which actor played Marty McFly in the 1980\'s sci-fi classic Back to the Future?', 'Michael J. Fox', ['Michael J. Fox', 'John Cusak', 'Tom Cruise', 'Michael Keaton'], 1);
new Question('Tyler Durden is a fictional character appearing as the central protagonist and antagonist in what 1999 american film?', 'Fight Club', ['Fight Club', 'The Matrix', 'The Green Mile', 'The Sixth Sense'], 1);
new Question('What is the stage name of the member of Public Enemy who would later have a reality dating show?', 'Flavor Flav', ['Flavor Flav', 'Chuck D', 'Ice Cube' , 'Ol\' Dirty Bastard'], 2);
new Question('Who interrupted Taylor Swift\'s acceptance speech at the 2009 Video Music Awards?', 'Kanye West', ['Kanye West', 'Blake Shelton', '2 Chains', 'Lil Wayne'], 1);
new Question('Who is the former drummer for Nirvana that went on to become the frontman for the Foo Fighters?', 'Dave Grohl', ['Dave Grohl', 'Kurt Cobain', 'Chris Stapleton', 'Johnny Cash'], 2);
new Question('Victoria Beckham was a member of which all girl English pop group formed in 1994?', 'The Spice Girls', ['The Spice Girls', 'Fifth Harmony', 'TLC', 'Destiny\'s Child'], 1);
new Question('Released in 1992, what is the best selling soundtrack album of all time?', 'The Bodyguard', ['The Bodyguard', 'Aladdin', 'Gladiator', 'Batman Returns'], 2);
new Question('"I\'d buy that for a dollar", is a catchphrase from what 1987 action movie set in Detroit, Michigan, in the near future?', 'Robocop', ['The Lost Boys', 'Lethal Weapon', 'Predator', 'Robocop'], 2);
new Question('As a protest to Hollywood\'s portrayal of Native Americans in film, Marlon Brando declined an Academy Award for his performance in what movie?', 'The Godfather', ['The Godfather', 'Dirty Dancing', 'Ishtar', 'Fatal Attraction'], 2);
new Question('In Disney\'s 1959 animated film Sleeping Beauty, who is Princess Aurora betrothed to?', 'Prince Phillip', ['Belle', 'Prince Phillip', 'Prince Naveen', 'Prince Charming'], 2);
new Question('Who produced and directed the American epic aviation war film "Hell\'s Angels", released in 1930?', 'Howard Hughes', ['Howard Hughes', 'William Powell', 'Leslie Howard', 'Fredric Marc'], 2);
new Question('What was John Candy\'s character\'s name in the 1987 comedy movie, "Planes, Trains, and Automobiles"?', 'Del Griffith', ['Del Griffith', 'Popeye', 'Frank Drebin', 'Barney Fife'], 3);
new Question('In what year did Nintendo release its first game console in North America?', '1985', ['1985', '1980', '2000', '1995'], 2);
new Question('American mobster Al Capone was sentenced to 11 years in federal prison for what crime?', 'Tax Evasion', ['Tax Evasion', 'Murder', 'Trafficking', 'Kidnapping'], 2);
new Question('How many people have walked on the moon?', 'Twelve', ['Twelve', 'One', 'Five', 'Fourteen'], 3);
new Question('What is the name for the monetary unit used in Thailand?', 'Baht', ['Kyat', 'Baht', 'Riel', 'Rupee'], 2);
new Question('The vehicle manufacturer Volvo was founded in what country?', 'Sweden', ['Finland', 'Norway', 'Sweden', 'Germany'], 2);
new Question('In which country did cheddar cheese originate?', 'England', ['England', 'Netherlands', 'United States', 'Ireland'], 3);
new Question('What is the name of the world’s fastest snake whose bite is almost 100% fatal?', 'Black Mamba', ['Black Mamba', 'King Cobra', 'Pit Viper', 'Sidewinder'], 2);
new Question('The llama is native to which continent?', 'South America', ['North America', 'South America', 'Africa', 'Australia'], 3);
new Question('The Great Red Spot is a giant storm located on which planet?', 'Jupiter', ['Saturn', 'Jupiter', 'Mars', 'Neptune'], 2);
new Question('In humans, what is the only internal organ capable of regenerating lost tissue?', 'Liver', ['Liver', 'Spleen', 'Pancreas', 'kidney'], 3);
new Question('What was the highest selling album of the 1980s in the United States?', 'Thriller', ['Thriller', 'Back in Black', 'Pretenders', 'Blizzard of Ozz'], 1);
new Question('What was the title of Kayne West\'s debut album release in 2004?','The College Dropout',['The College Dropout', 'The Life of Pablo', 'Yeezus', 'Graduation'], 3);
new Question('Who was the lead singer of the band Audioslave?','Chris Cornell',['Chris Cornell', 'Eddie Vedder', 'Sammy Hagar', 'Bruce Springsteen'], 2);
new Question('New Orleans is known as the birthplace of what type of music?','Jazz',['Jazz', 'Rock', 'Country', 'Hip Hop'], 1);
new Question('Which pop star sang the national anthem at the 50th Super Bowl?','Lady Gaga',['Lady Gaga', 'Justin Timberlake', 'Katy Perry', 'Taylor Swift'], 2);
new Question('Who was the lead singer of the rock band Queen?','Freddie Mercury',['Freddie Mercury', 'Mick Jagger', 'Steven Tyler', 'Bono'], 2);
new Question('Which music group has received the most Grammy Awards?','U2',['U2', 'Metallica', 'Rolling Stones', 'Aerosmith'], 2);
new Question('Which planet has the most moons?','Jupiter',['Jupiter', 'Uranus', 'Neptune', 'Saturn'], 2);
new Question('In computer science, what does "GUI" stand for?','Graphical user interface',['Graphical user interface', 'Global Unique Identifier', 'Gyroscopic Upper Stage', 'Gaming Under the Influence'], 2);
new Question('In what city was the coffee chain Starbucks founded?', 'Seattle', ['Seattle', 'New York', 'Portland', 'San Francisco'], 1);
new Question('In movie ratings, what do the letters PG stand for?', 'Parental Guidance', ['Parental Guidance', 'Pretty Good', 'Pretty Great', 'Positively Grand'], 1);
new Question('Who is credited with suggesting the word "hello" be used when answering the telephone?', 'Thomas Edison', ['Thomas Edison','Alexander Graham Bell','Nikola Tesla','Elisha Gray'], 3);
new Question('The Panama Canal is found in what country?', 'Panama', ['Panama', 'United States', 'Japan', 'France'], 1);
new Question('Who wrote the young adult vampire-romance novel "Twilight"?', 'Stephanie Meyer', ['Stephanie Meyer', 'JK Rowling', 'Roald Dahl', 'George RR Martin'], 2);
new Question('What is the largest species of terrestrial crab in the world?', 'Coconut Crab', ['Coconut Crab', 'Dungeness Crab', 'Hermit Crab', 'King Crab'], 3);
new Question('What is a group of whales called?', 'Pod', ['Pod', 'Clan', 'Gathering', 'Collection'], 2);
new Question('What is Michael J Fox\'s middle name?', 'Andrew', ['Andrew', 'Joseph', 'Joshua', 'Christopher'], 3);
new Question('What city is known as the windy city?', 'Chicago', ['Chicago', 'New York', 'Seattle', 'Boston'], 1);
new Question('How many hearts does an octopus have?', 'Three', ['One', 'Two', 'Three', 'Four'], 3);
new Question('An Alaskan Malamute is a type of what?', 'Dog', ['Dog', 'Cat', 'Squirrel', 'Whale'], 3);
new Question('In what city is the tallest building in the world located?', 'Dubai', ['Dubai', 'Shanghai', 'Tokyo', 'Seoul'], 3);
new Question('How many stripes are on the U.S. flag?', 'Thirteen', ['Fourteen', 'Thirteen', 'Fifteen', 'Eleven'], 2);
new Question('Who directed the original Star Wars in 1977?', 'George Lucas', ['George Lucas', 'Steven Spielberg', 'JJ Abrams', 'Han Solo'], 2);
new Question('What popular beverage once contained cocaine?', 'Coca-Cola', ['Coca-Cola', 'Pepsi', 'Mountain Dew', 'Cream Soda'], 1);
new Question('What is the first element on the periodic table?', 'Hydrogen', ['Hydrogen', 'Helium', 'Sodium', 'Nitrogen'], 3);
new Question('What is the main ingredient in guacamole?', 'Avocado', ['Avocado', 'Lettuce', 'Kiwi', 'Honeydew'], 1);
new Question('The state of Georgia is famous for what fruit?', 'Peach', ['Peach', 'Strawberry', 'Plum', 'Apple'], 1);
new Question('The Lone Star State is the nickname of what state?', 'Texas', ['Texas', 'California', 'Washington', 'New York'], 1);
new Question('Steve Jobs and Steve Wozniak founded what company in 1976?', 'Apple', ['Apple', 'Amazon', 'Microsoft', 'Code Fellows'], 1);
new Question('What country was Nintendo founded in?', 'Japan', ['Japan', 'United States', 'China', 'Germany'], 1);
new Question('What is the second largest country by land mass?', 'Canada', ['Russia', 'Canada', 'Australia', 'United States'], 1);
new Question('A panda\'s diet consists almost entirey of what?', 'Bamboo', ['Bamboo', 'Coconuts', 'Blackberries', 'Rodents'], 1);
new Question('What is the smallest state in the USA?', 'Rhode Island', ['Rhode Island', 'Delaware', 'Vermont', 'Maine'], 1);
new Question('Area 51 is located in what state?', 'Nevada', ['Nevada', 'California', 'Oregon', 'Washington'], 1);
new Question('What island does the Statue of Liberty stand on?', 'Liberty Island', ['Liberty Island', 'Ellis Island', 'Manhattan', 'Staten Island'], 1);
new Question('What language is spoken in Brazil?', 'Portuguese', ['Portuguese', 'Spanish', 'English', 'French'], 1);
new Question('What ingredient in bread causes it to rise?', 'Yeast', ['Yeast', 'Whey', 'Salt', 'Wheat'], 1);

// random number generator
function randomNumGenerator(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Fisher-Yates Shuffle gives us a random order of an array
function shuffle(array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// Main game question function
function gameQuestions() {
  divAnswerEl.addEventListener('click', answerButtonHandler);
  timerEl.removeAttribute('class', 'hidden-element');
  questionCounter += 1;
  countDownTimer();

  // pulling a random number from our array of questions
  if (questionCounter < 4) {
    do { rand = randomNumGenerator(0, Question.allQuestions.length - 1);
    } while (Question.allQuestions[rand].difficulty !== 1);
  } else if (questionCounter < 7) {
    do { rand = randomNumGenerator(0, Question.allQuestions.length - 1);
    } while (Question.allQuestions[rand].difficulty !== 2);
  } else {
    for (var x = Question.allQuestions.length - 1; x >= 0 ; x--) {
      if (Question.allQuestions[x].difficulty === 1 || Question.allQuestions[x].difficulty === 2) {
        Question.allQuestions.splice(x, 1);
      }
    }
    if (Question.allQuestions.length === 0) {
      endingGame();
    }
    rand = randomNumGenerator(0, Question.allQuestions.length - 1);
  }

  var q1 = Question.allQuestions[rand];
  var pEl = document.createElement('p');
  pEl.textContent = q1.question;

  //appending random question to an element in game.html
  divQuestionEl.appendChild(pEl);

  // shuffling the array of possible answer so that they appear in a random order and assigning to a variable
  var answerArray = shuffle(q1.setOfAnswers);

  // for loop to assign a letter to each question in the correct order
  for (var i = 0; i < answerArray.length; i++) {
    var letterIndex;
    if (i === 0) {
      letterIndex = ' ';
    } else if (i === 1) {
      letterIndex = ' ';
    } else if (i === 2) {
      letterIndex = ' ' ;
    } else {
      letterIndex = ' ';
    }

    // creating button elements for each letter/answer, assigning the value of an answer and appending to the element that holds the buttons/answers
    var button = document.createElement('button');
    button.setAttribute('class', 'answerButton');
    var span = document.createElement('span');
    span.textContent = letterIndex;
    button.setAttribute('name', answerArray[i]);
    button.innerHTML = answerArray[i];
    if (i === 0 || i === 1) {
      divAnswerElAB.appendChild(span);
      divAnswerElAB.appendChild(button);
    } else if (i === 2 || i === 3) {
      divAnswerElCD.appendChild(span);
      divAnswerElCD.appendChild(button);
    }
  }

  //remove previous level indicator
  if (divLevelIndicatorEl.childElementCount !== 0){
    removeLevelIndicator();
    levelIndicator();
  } else {
    //display current level
    levelIndicator();
  }
}

// Event Listener on div that holds questions
function answerButtonHandler(e) {
  var target = e.target.name;
  var correctAnswer = Question.allQuestions[rand].answer;
  var answerChoice = e.srcElement;
  var answerButtonEls = document.querySelectorAll('button.answerButton');
  if (!e.target.name) {
    return;
  }

  divAnswerEl.removeEventListener('click', answerButtonHandler);
  timerEl.setAttribute('class', 'hidden-element');
  if (correctAnswer === target) {
    answerChoice.setAttribute('id', 'correct');
    for (var i = 0; i < answerButtonEls.length; i++) {
      answerButtonEls[i].setAttribute('class', 'no-hover');
    }

    User.currentUser['score'] += 1;

    soundsArray[2].pause();
    soundsArray[0].play();

    resetCurrentUserTopScore();
    saveCurrentUser();
    Question.allQuestions.splice(rand, 1);
    clearCountDown();

    var nextQuestionBtn = document.createElement('button');
    nextQuestionBtn.innerHTML = 'Next Question';
    nextQuestionDiv.appendChild(nextQuestionBtn);
    nextQuestionBtn.addEventListener('click', nextQuestionHandler);

  } else {
    answerChoice.setAttribute('id', 'incorrect');
    for (var j = 0; j < answerButtonEls.length; j++) {
      answerButtonEls[j].setAttribute('class', 'no-hover');
      if (correctAnswer === answerButtonEls[j].name) {
        answerButtonEls[j].setAttribute('id', 'correct');
      }
    }
    clearCountDown();

    soundsArray[2].pause();
    soundsArray[1].play();

    // resetCurrentUserScore();
    resetCurrentUserTopScore();
    console.log('are you saving?');
    //if user's score is greater than top score, set a new top score
    if(User.currentUser['score'] > User.currentUser['topScore']){
      User.currentUser['topScore'] = User.currentUser['score'];
    }
    saveCurrentUser();
    updateCUToAllUser();

    //ending game
    timerEl.innerHTML = '';
    endGameMsgEl.innerHTML = '<h2>Incorrect - Game Over</h2>';
    window.setInterval(function() {
      endingGame();
    }, 3000);
  }
}

function nextQuestionHandler(){
  divQuestionEl.innerHTML = '';
  divAnswerElAB.innerHTML = '';
  divAnswerElCD.innerHTML = '';
  nextQuestionDiv.innerHTML = '';
  gameQuestions();
}

function checkSavedCurrentUser(){
  var retrieve = JSON.parse(localStorage.getItem('currentUser'));
  User.currentUser['name'] = retrieve.name;
  User.currentUser['topScore'] = retrieve.topScore;

}

function saveCurrentUser(){
  localStorage.setItem('currentUser', JSON.stringify(User.currentUser));
}

function endingGame(){
  //retrieve currentUser info
  checkSavedCurrentUser();

  // clear out div
  endGameMsgEl.innerHTML = '';
  divLevelIndicatorEl.innerHTML = '';
  divQuestionEl.innerHTML = '';
  divAnswerEl.innerHTML = '';
  clearCountDown();
  timerEl.style.display = 'none';

  //display current user's name & score
  var nameScore = document.createElement('h2');
  nameScore.textContent = User.currentUser['name'].charAt(0).toUpperCase() + User.currentUser['name'].slice(1) + ', your score is: ' + User.currentUser['score'];


  // display message to user
  var newHiH3 = document.createElement('h3');
  if (User.currentUser['score'] === 0) {
    newHiH3 = document.createElement('h3');
    newHiH3.textContent = 'Keep learning, grasshopper.';
  } else if (User.currentUser['score'] < 3) {
    newHiH3 = document.createElement('h3');
    newHiH3.textContent = 'You are a Trivia Student...keep learning.';
  } else if (User.currentUser['score'] < 5) {
    newHiH3 = document.createElement('h3');
    newHiH3.textContent = 'You are a Trivia Novice...keep learning.';
  } else if (User.currentUser['score'] < 7) {
    newHiH3 = document.createElement('h3');
    newHiH3.textContent = 'Well done, you are on your way to becoming a Trivia Wizard.';
  } else if (User.currentUser['score'] < 9) {
    newHiH3 = document.createElement('h3');
    newHiH3.textContent = 'You are a Trivia Master! Keep going to reach Trivia Wizard status!';
  } else if (User.currentUser['score'] > 8) {
    newHiH3 = document.createElement('h3');
    soundsArray[4].play();
    newHiH3.textContent = 'Congrats, you are a Trivia Wizard!';
  }
  divQuestionEl.appendChild(nameScore);
  divQuestionEl.appendChild(newHiH3);

  //display play again button
  var playAgainBtn = document.createElement('button');
  playAgainBtn.className = 'play-again';
  playAgainBtn.innerHTML = 'Play Again!';
  divQuestionEl.appendChild(playAgainBtn);
  playAgainBtn.addEventListener('click', pageReload);

  //save user info into localStorage
  saveCurrentUser();
}

function pageReload(){
  location.reload();
}

function countDownTimer(){
  var timeleft = 10;
  downloadTimer = setInterval(function() {
    document.getElementById('timer').innerHTML = --timeleft;

    soundsArray[2].play();
    if (timeleft <= 0){
      soundsArray[2].pause();
      soundsArray[3].play();

      clearInterval(downloadTimer);
      document.getElementById('timer').innerHTML = '';
      endingGame();
    }
  }, 1000);
}

function clearCountDown() {
  clearInterval(downloadTimer);
  timerEl.innerHTML = '';
}

// display level the user is on
function levelIndicator() {
  if (questionCounter < 4) {
    level.textContent = 'Question ' + questionCounter + ' - Level EASY';
    divLevelIndicatorEl.appendChild(level);
  } else if (questionCounter > 3 && questionCounter < 7) {
    level.textContent = 'Question ' + questionCounter + ' - Level MEDIUM';
    level.setAttribute('id', 'medium-difficulty');
    divLevelIndicatorEl.appendChild(level);
  } else {
    level.textContent = 'Question ' + questionCounter + ' - Level HARD';
    level.setAttribute('id', 'hard-difficulty');
    divLevelIndicatorEl.appendChild(level);
  }
}

function removeLevelIndicator(){
  level.remove;
}

function resetCurrentUserTopScore(){
  if(User.currentUser['score'] > User.currentUser['topScore']) {
    User.currentUser['topScore'] = User.currentUser['score'];
  }
}

function updateCUToAllUser(){
  User.allUsers = JSON.parse(localStorage.getItem('allUsers'));
  for(var x = 0; x < User.allUsers.length; x++) {
    if(User.allUsers[x].username === User.currentUser['name']) {
      User.allUsers[x].topScore = User.currentUser['topScore'];
      localStorage.setItem('allUsers', JSON.stringify(User.allUsers));
    }
  }
}

function dispalyLogoutBtn(){
  var logOutBtn = document.createElement('button');
  logOutBtn.innerHTML = 'Logout';
  divLogOutEl.appendChild(logOutBtn);
  logOutBtn.addEventListener('click', logOutHandler);
  logOutBtn.className = 'log-out';
}

function logOutHandler(e){
  e.preventDefault();
  //remove logout button
  divLogOutEl.innerHTML = '';
  //remove currentUser from localStorage
  localStorage.removeItem('currentUser');
  resetCurrentUserTopScore();
  updatingCurrentUserAllUserObject();

  //back to index.page
  window.location.href = 'index.html';
}

function returnUser() {
  //if currentUser exists in localStorage
  if (User.currentUser['name'].length > 0) {
    //don't display login form
    //instead display welcome back message
    dispalyLogoutBtn();
  }
}

function updatingCurrentUserAllUserObject(){
  for (var i in User.allUsers) {
    if (User.allUsers[i].name === User.currentUser['name']) {
      User.allUsers[i].topScore = User.currentUser['topScore'];
    }
  }
}

// calling the main game function on page load
gameQuestions();
