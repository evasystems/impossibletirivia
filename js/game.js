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
new Question('.at is the top-level domain for what country?', 'Austria', [ 'Austria', 'Angola', 'Australia', 'Argentina'], 2);
new Question('.rs is the top-level domain for what country?', 'Serbia', [ 'Serbia', 'Russia', 'Rwanda', 'Romania'], 2);
new Question('A panda\'s diet consists almost entirey of what?', 'Bamboo', ['Bamboo', 'Coconuts', 'Blackberries', 'Rodents'], 1);
new Question('Abel Magwitch is a character from which Charles Dickens novel?', 'Great Expectations', [ 'Great Expectations', 'Nicholas Nickleby', 'Oliver Twist', 'The Pickwick Papers'], 3);
new Question('Alan Reed is known for providing the voice of which character?', 'Fred Flintstone', [ 'Fred Flintstone', 'Bugs Bunny', 'Fangface', 'G.I. Joe'], 2);
new Question('American mobster Al Capone was sentenced to 11 years in federal prison for what crime?', 'Tax Evasion', ['Tax Evasion', 'Murder', 'Trafficking', 'Kidnapping'], 2);
new Question('An Alaskan Malamute is a type of what?', 'Dog', ['Dog', 'Cat', 'Squirrel', 'Whale'], 3);
new Question('Aperture Science CEO Cave Johnson is voiced by which American actor?', 'J.K. Simmons', [ 'J.K. Simmons', 'Nolan North', 'John Patrick Lowrie', 'Christopher Lloyd'], 1);
new Question('Area 51 is located in what state?', 'Nevada', ['Nevada', 'California', 'Oregon', 'Washington'], 1);
new Question('As a protest to Hollywood\'s portrayal of Native Americans in film, Marlon Brando declined an Academy Award for his performance in what movie?', 'The Godfather', ['The Godfather', 'Dirty Dancing', 'Ishtar', 'Fatal Attraction'], 2);
new Question('Brian May was the guitarist for which band?', 'Queen', [ 'Queen', 'Pink Floyd', 'The Doors', 'Rolling Stones'], 1);
new Question('Bruce Banner turns into what fictional superhero when he becomes angry?', 'The Hulk', ['The Hulk', 'Batman', 'Ironman', 'Antman'], 2);
new Question('By what name was the author Eric Blair better known?', 'George Orwell', [ 'George Orwell', 'Ernest Hemingway', 'Ray Bradbury', 'Aldous Huxley'], 2);
new Question('Electronic artists Boys Noize and Skrillex have collaborated and released tracks under what name?', 'Dog Blood', [ 'Dog Blood', 'Jack Ü', 'Noisia', 'What So Not'], 3);
new Question('Ellie Goulding\'s earliest album was named?', 'Lights', [ 'Lights', 'Halcyon Days', 'Bright Lights', 'Halcyon'], 2);
new Question('Emma Watson is known for playing which character in Harry Potter?', 'Hermione Granger', ['Hermione Granger', 'Luna Lovegood', 'Bellatrix Lestrange', 'Nymphadora Lupin'], 1);
new Question('From what show is the character \'James Doakes\'? ', 'Dexter', [ 'Dexter', 'Boardwalk Empire', 'Marvel\'s Daredevil', 'The Walking Dead'], 2);
new Question('From which country did the song \'Gangnam Style\' originate from?', 'South Korea', [ 'South Korea', 'China', 'Japan', 'North Korea'], 1);
new Question('Grant Gustin plays which superhero on the CW show of the same name?', 'The Flash', [ 'The Flash', 'Daredevil', 'Black Canary', 'The Arrow'], 1);
new Question('Guy\'s Grocery Games is hosted by which presenter?', 'Guy Fieri', [ 'Guy Fieri', 'Guy Ritchie', 'Guy Martin', 'Ainsley Harriott'], 1);
new Question('How long was Ken Jennings win streak on Jeopardy?', '74', [ '74', '88', '49', '62'], 2);
new Question('How many Chaos Emeralds can you collect in the first Sonic The Hedgehog?', 'Six', [ 'Six', 'Five', 'Eight', 'Seven'], 2);
new Question('How many Harry Potter books are there?', '7', [ '7', '5', '6', '8'], 1);
new Question('How many Hz does the video standard PAL support?', '50', [ '50', '60', '59', '25'], 3);
new Question('How many books are in the Chronicles of Narnia series?', '7', [ '7', '6', '5', '8'], 2);
new Question('How many controllers could a Nintendo GameCube have plugged in at one time?', '4', [ '4', '2', '6', '8'], 2);
new Question('How many flagship monsters appear in Monster Hunter Gernerations?', '4', [ '4', '2', '1', '3'], 1);
new Question('How many hearts does an octopus have?', 'Three', ['One', 'Two', 'Three', 'Four'], 3);
new Question('How many members are there in the band Nirvana?', 'Three', [ 'Three', 'Two', 'Five', 'Four'], 1);
new Question('How many normal endings are there in Cry Of Fear\'s campaign mode?', '4', [ '4', '5', '3', '6'], 2);
new Question('How many people have walked on the moon?', 'Twelve', ['Twelve', 'One', 'Five', 'Fourteen'], 3);
new Question('How many seasons did \'Stargate SG-1\' have?', '10', [ '10', '12', '7', '3'], 1);
new Question('How many seasons did the Sci-Fi television show \'Stargate Atlantis\' have?', '5', [ '5', '7', '10', '2'], 1);
new Question('How many seasons did the Sci-Fi television show \'Stargate Universe\' have?', '2', [ '2', '3', '10', '5'], 1);
new Question('How many seasons did the TV show \'Donkey Kong Country\' last?', '2', [ '2', '5', '4', '1'], 2);
new Question('How many stripes are on the U.S. flag?', 'Thirteen', ['Fourteen', 'Thirteen', 'Fifteen', 'Eleven'], 2);
new Question('How many studio albums have the duo Daft Punk released?', '4', [ '4', '5', '2', '1'], 1);
new Question('How many times do you fight Gilgamesh in \'Final Fantasy 5\'?', '6', [ '6', '4', '3', '5'], 1);
new Question('How many unique items does \'Borderlands 2\' claim to have?', '87 Bazillion ', [ '87 Bazillion ', '87 Trillion', '87 Million', '87 Gazillion '], 2);
new Question('How many values can a single byte represent?', '256', [ '256', '1024', '8', '1'], 1);
new Question('How many voice channels does the Nintendo Entertainment System support natively?', '5', [ '5', '4', '6', '3'], 3);
new Question('If you were to code software in this language you\'d only be able to type 0\'s and 1\'s.', 'Binary', [ 'Binary', 'C++', 'Python', 'JavaScript'], 1);
new Question('In Disney\'s 1959 animated film Sleeping Beauty, who is Princess Aurora betrothed to?', 'Prince Phillip', ['Belle', 'Prince Phillip', 'Prince Naveen', 'Prince Charming'], 2);
new Question('In \'It\'s Always Sunny in Philadelphia\' what was the name of Frank\'s wrestling persona?', 'The Trash Man', [ 'The Trash Man', 'The Maniac', 'Day Man', 'Bird of War'], 3);
new Question('In computer science, what does "GUI" stand for?','Graphical user interface',['Graphical user interface', 'Global Unique Identifier', 'Gyroscopic Upper Stage', 'Gaming Under the Influence'], 2);
new Question('In humans, what is the only internal organ capable of regenerating lost tissue?', 'Liver', ['Liver', 'Spleen', 'Pancreas', 'kidney'], 3);
new Question('In movie ratings, what do the letters PG stand for?', 'Parental Guidance', ['Parental Guidance', 'Pretty Good', 'Pretty Great', 'Positively Grand'], 1);
new Question('In the 1979 British film \'Quadrophenia\' what is the name of the main protagonist?', 'Jimmy Cooper', [ 'Jimmy Cooper', 'Pete Townshend', 'Franc Roddam', 'Archie Bunker'], 2);
new Question('In the movie The Terminator, what is the name of the company that created Skynet?', 'Cyberdyne Systems', ['Cyberdyne Systems', 'Code Fellows', 'Multi-National United', 'Tetravaal'], 2);
new Question('In the server hosting industry IaaS stands for...', 'Infrastructure as a Service', [ 'Infrastructure as a Service', 'Infrastructure as a Server', 'Internet and a Server', 'Internet as a Service'], 2);
new Question('In what city is the tallest building in the world located?', 'Dubai', ['Dubai', 'Shanghai', 'Tokyo', 'Seoul'], 3);
new Question('In what city was the coffee chain Starbucks founded?', 'Seattle', ['Seattle', 'New York', 'Portland', 'San Francisco'], 1);
new Question('In what film was the Michael Jackson song \'Will You Be There\' featured?', 'Free Willy', [ 'Free Willy', 'Bad Boys', 'Men in Black', 'Sleepless in Seattle'], 2);
new Question('In what year did Clint Eastwood star as Inspector Harry Callahan in the film \'Dirty Harry\'?', '1971', [ '1971', '1969', '1983', '1975'], 3);
new Question('In what year did Nintendo release its first game console in North America?', '1985', ['1985', '1980', '2000', '1995'], 2);
new Question('In what year did \'The Big Bang Theory\' debut on CBS?', '2007', [ '2007', '2009', '2008', '2006'], 2);
new Question('In what year was Garry\'s Mod released as a standalone title on Valve\'s Steam distribution service?', '2006', [ '2006', '2003', '2007', '2004'], 1);
new Question('In what year was Hearthstone released?', '2014', [ '2014', '2013', '2012', '2011'], 1);
new Question('In what year was \'Metal Gear Solid\' released in North America?', '1998', [ '1998', '1987', '2001', '2004'], 1);
new Question('In what year was \'Super Mario Sunshine\' released?', '2002', [ '2002', '2003', '2000', '2004'], 2);
new Question('In what year was the movie \'Police Academy\' released?', '1984', [ '1984', '1983', '1986', '1985'], 2);
new Question('In which African country was the 2006 film \'Blood Diamond\' mostly set in?', 'Sierra Leone', [ 'Sierra Leone', 'Liberia', 'Burkina Faso', 'Central African Republic'], 2);
new Question('In which British seaside town was the BBC sitcom \'Fawlty Towers\' set?', 'Torquay', [ 'Torquay', 'Great Yarmouth', 'Blackpool', 'Bournemouth'], 1);
new Question('In which city did American rap producer DJ Khaled originate from?', 'Miami', [ 'Miami', 'New York', 'Atlanta', 'Detroit'], 2);
new Question('In which classic novel is there a character named Homer Simpson?', 'The Day of the Locust', [ 'The Day of the Locust', 'A Separate Peace', 'Catch-22', 'Of Mice and Men'], 3);
new Question('In which country did cheddar cheese originate?', 'England', ['England', 'Netherlands', 'United States', 'Ireland'], 3);
new Question('In which game did the Konami Code make its first appearance?', 'Gradius', [ 'Gradius', 'Dance Dance Revolution', 'Contra', 'Castlevania'], 2);
new Question('In which location does Dark Sun Gwyndolin reside in \'Dark Souls\'?', 'Anor Londo', [ 'Anor Londo', 'Blighttown', 'Kiln of the first flame', 'Firelink Shrine'], 2);
new Question('In which mall does \'Dead Rising\' take place?', 'Willamette Parkview Mall', [ 'Willamette Parkview Mall', 'Central Square Shopping Center', 'Liberty Mall', 'Twin Pines Mall'], 1);
new Question('In which year did \'Caravan Palace\' release their first album?', '2008', [ '2008', '2004', '2015', '2000'], 2);
new Question('In which year did the British television series \'The Bill\' end?', '2010', [ '2010', '2007', '2001', '2012'], 2);
new Question('In which year was the Megadeth album \'Peace Sells... but Who\'s Buying?\' released?', '1986', [ '1986', '1987', '1979', '1983'], 2);
new Question('Laserjet and inkjet printers are both examples of what type of printer?', 'Non-impact printer', [ 'Non-impact printer', 'Daisywheel printer', 'Dot matrix printer', 'Impact printer'], 2);
new Question('Leonardo Di Caprio won his first Best Actor Oscar for his performance in which film?', 'The Revenant', [ 'The Revenant', 'Inception', 'Shutter Island', 'The Wolf Of Wall Street'], 2);
new Question('New Orleans is known as the birthplace of what type of music?','Jazz',['Jazz', 'Rock', 'Country', 'Hip Hop'], 1);
new Question('Nvidia\'s headquarters are based in which Silicon Valley city?', 'Santa Clara', [ 'Santa Clara', 'Palo Alto', 'Cupertino', 'Mountain View'], 2);
new Question('On which computer hardware device is the BIOS chip located?', 'Motherboard', [ 'Motherboard', 'Graphics Processing Unit', 'Central Processing Unit', 'Hard Disk Drive'], 2);
new Question('On which planet does the game Freedom Planet (2014) take place?', 'Avalice', [ 'Avalice', 'Galaxytrail', 'Shang Mu', 'Freedom'], 2);
new Question('Pete Townshend collaborated with which famous guitarist for an event at Brixton Academy in 1985?', 'David Gilmour', [ 'David Gilmour', 'Jimmy Page', 'Mark Knopfler', 'Eric Clapton'], 3);
new Question('Released in 1992, what is the best selling soundtrack album of all time?', 'The Bodyguard', ['The Bodyguard', 'Aladdin', 'Gladiator', 'Batman Returns'], 2);
new Question('Ringo Starr of The Beatles mainly played what instrument?', 'Drums', [ 'Drums', 'Guitar', 'Piano', 'Bass'], 1);
new Question('Steve Jobs and Steve Wozniak founded what company in 1976?', 'Apple', ['Apple', 'Amazon', 'Microsoft', 'Code Fellows'], 1);
new Question('The 2016 song \'Starboy\' by Canadian singer The Weeknd features which prominent electronic artist?', 'Daft Punk', [ 'Daft Punk', 'DJ Shadow', 'Disclosure', 'deadmau5'], 1);
new Question('The Great Red Spot is a giant storm located on which planet?', 'Jupiter', ['Saturn', 'Jupiter', 'Mars', 'Neptune'], 2);
new Question('The Harvard architecture for micro-controllers added which additional bus?', 'Instruction', [ 'Instruction', 'Address', 'Control', 'Data'], 3);
new Question('The Lone Star State is the nickname of what state?', 'Texas', ['Texas', 'California', 'Washington', 'New York'], 1);
new Question('The Panama Canal is found in what country?', 'Panama', ['Panama', 'United States', 'Japan', 'France'], 1);
new Question('The Queen song `A Kind Of Magic` is featured in which 1986 film?', 'Highlander', [ 'Highlander', 'Howard the Duck', 'Flash Gordon', 'Labyrinth'], 1);
new Question('The \'K\' in \'K-Pop\' stands for which word?', 'Korean', [ 'Korean', 'Kazakhstan', 'Kenyan', 'Kuwaiti'], 1);
new Question('The \'Psycho\' series of videos on YouTube was created by which of the following?', 'RiDGiD STUDiOS', [ 'RiDGiD STUDiOS', 'VeganGainz', 'Billy Familia', 'Dan Bell'], 1);
new Question('The book \'Fahrenheit 451\' was written by whom?', 'Ray Bradbury', [ 'Ray Bradbury', 'Wolfgang Amadeus Mozart', 'R. L. Stine', 'Stephen King'], 2);
new Question('The book \'The Little Prince\' was written by...', 'Antoine de Saint-Exupéry', [ 'Antoine de Saint-Exupéry', 'Jane Austen', 'F. Scott Fitzgerald', 'Miguel de Cervantes Saavedra'], 2);
new Question('The heavy metal band Black Sabbath hail from which English city?', 'Birmingham', [ 'Birmingham', 'London', 'Manchester', 'Newcastle-Upon-Tyne'], 3);
new Question('The internet domain .fm is the country-code top-level domain for which Pacific Ocean island nation?', 'Micronesia', [ 'Micronesia', 'Marshall Islands', 'Fiji', 'Tuvalu'], 3);
new Question('The key of sharps does the key of G# minor contain?', '5', [ '5', '0', '7', '3'], 3);
new Question('The llama is native to which continent?', 'South America', ['North America', 'South America', 'Africa', 'Australia'], 3);
new Question('The map featured in Arma 3 named \'Altis\' is based off of what Greek island?', 'Lemnos', [ 'Lemnos', 'Ithaca', 'Naxos', 'Anafi'], 3);
new Question('The name of technology company HP stands for what?', 'Hewlett-Packard', [ 'Hewlett-Packard', 'Howard Packmann', 'Hellman-Pohl', 'Husker-Pollosk'], 2);
new Question('The novel \'Jane Eyre\' was written by what author? ', 'Charlotte Brontë', [ 'Charlotte Brontë', 'Jane Austen', 'Emily Brontë', 'Louisa May Alcott'], 3);
new Question('The novel \'Of Mice And Men\' was written by what author? ', 'John Steinbeck ', [ 'John Steinbeck ', 'Harper Lee', 'Mark Twain ', 'George Orwell'], 2);
new Question('The programming language \'Swift\' was created to replace what other programming language?', 'Objective-C', [ 'Objective-C', 'C++', 'C#', 'Ruby'], 1);
new Question('The song \'Twin Size Mattress\' was written by which band?', 'The Front Bottoms', [ 'The Front Bottoms', 'Twenty One Pilots', 'The Wonder Years', 'The Smith Street Band'], 2);
new Question('The state of Georgia is famous for what fruit?', 'Peach', ['Peach', 'Strawberry', 'Plum', 'Apple'], 1);
new Question('The vehicle manufacturer Volvo was founded in what country?', 'Sweden', ['Finland', 'Norway', 'Sweden', 'Germany'], 2);
new Question('This mobile OS held the largest market share in 2012.', 'iOS', [ 'iOS', 'Symbian', 'BlackBerry', 'Android'], 1);
new Question('Tyler Durden is a fictional character appearing as the central protagonist and antagonist in what 1999 american film?', 'Fight Club', ['Fight Club', 'The Matrix', 'The Green Mile', 'The Sixth Sense'], 1);
new Question('Under what pseudonym did Stephen King publish five novels between 1977 and 1984?', 'Richard Bachman', [ 'Richard Bachman', 'Mark Twain', 'J. D. Robb', 'Lewis Carroll'], 1);
new Question('Victoria Beckham was a member of which all girl English pop group formed in 1994?', 'The Spice Girls', ['The Spice Girls', 'Fifth Harmony', 'TLC', 'Destiny\'s Child'], 1);
new Question('What French artist/band is known for playing on the midi instrument \'Launchpad\'?', 'Madeon', [ 'Madeon', 'David Guetta', 'Daft Punk ', 'Disclosure'], 2);
new Question('What NBC sitcom once saw two of its characters try to pitch NBC on a sitcom about nothing?', 'Seinfeld', [ 'Seinfeld', 'Friends', 'Frasier', 'Becker'], 1);
new Question('What Pokémon\'s Base Stat Total does not change when it evolves?', 'Scyther', [ 'Scyther', 'Larvesta', 'Sneasel', 'Pikachu'], 3);
new Question('What album did The Lumineers release in 2016?', 'Cleopatra', [ 'Cleopatra', 'Tracks From The Attic', 'Winter', 'The Lumineers'], 1);
new Question('What amount of bits commonly equals one byte?', '8', [ '8', '1', '2', '64'], 1);
new Question('What animal is featured in \'Bloons TD Battles\'?', 'Monkeys', [ 'Monkeys', 'Alligators', 'Pigeons', 'Lizards'], 2);
new Question('What breed of dog is \'Scooby Doo\'?', 'Great Dane', [ 'Great Dane', 'Doberman Pinscher', 'Boxer', 'Pit bull'], 2);
new Question('What breed of dog is \'Scooby Doo\'?', 'Great Dane', [ 'Great Dane', 'Pit bull', 'Boxer', 'Doberman Pinscher'], 2);
new Question('What breed of dog was Marley in the film \'Marley & Me\' 2008?', 'Labrador Retriever', [ 'Labrador Retriever', 'Dalmatian', 'Golden Retriever', 'Shiba Inu'], 1);
new Question('What character in the Winnie the Pooh films was added by Disney and does not appear in the original books?', 'Gopher', [ 'Gopher', 'Rabbit', 'Heffalumps', 'Tigger'], 2);
new Question('What city is known as the windy city?', 'Chicago', ['Chicago', 'New York', 'Seattle', 'Boston'], 1);
new Question('What company created and developed the game \'Overwatch\'?', 'Blizzard Entertainment', [ 'Blizzard Entertainment', 'Hi-Rez Studios', 'Valve', 'Gearbox Software'], 1);
new Question('What country is Cory in the House set in?', 'The United States of America', [ 'The United States of America', 'England', 'Venezuala', 'Canada'], 1);
new Question('What country was Nintendo founded in?', 'Japan', ['Japan', 'United States', 'China', 'Germany'], 1);
new Question('What did the name of the Tor Anonymity Network orignially stand for?', 'The Onion Router', [ 'The Onion Router', 'The Orange Router', 'The Only Router', 'The Ominous Router'], 2);
new Question('What does GHz stand for?', 'Gigahertz', [ 'Gigahertz', 'Gigahatz', 'Gigahotz', 'Gigahetz'], 1);
new Question('What does \'LCD\' stand for?', 'Liquid Crystal Display', [ 'Liquid Crystal Display', 'Long Continuous Design', 'Language Control Design', 'Last Common Difference'], 2);
new Question('What does the International System of Quantities refer 1024 bytes as?', 'Kibibyte', [ 'Kibibyte', 'Kylobyte', 'Kelobyte', 'Kilobyte'], 3);
new Question('What does the \'MP\' stand for in MP3?', 'Moving Picture', [ 'Moving Picture', 'Music Player', 'Multi Pass', 'Micro Point'], 1);
new Question('What does the term GPU stand for?', 'Graphics Processing Unit', [ 'Graphics Processing Unit', 'Graphical Proprietary Unit', 'Graphite Producing Unit', 'Gaming Processor Unit'], 2);
new Question('What five letter word is the motto of the IBM Computer company?', 'Think', [ 'Think', 'Logic', 'Click', 'Pixel'], 2);
new Question('What household item make the characters of \'Steins; Gate\' travel through time?', 'Microwave', [ 'Microwave', 'Computer', 'Refrigerator', 'Televison'], 1);
new Question('What ingredient in bread causes it to rise?', 'Yeast', ['Yeast', 'Whey', 'Salt', 'Wheat'], 1);
new Question('What internet protocol was documented in RFC 1459?', 'IRC', [ 'IRC', 'FTP', 'HTTPS', 'HTTP'], 3);
new Question('What is Gabe Newell\'s favorite class in Team Fortress 2?', 'Spy', [ 'Spy', 'Medic', 'Heavy', 'Pyro'], 1);
new Question('What is Hermione Granger\'s middle name?', 'Jean', [ 'Jean', 'Emma', 'Jo', 'Jane'], 3);
new Question('What is Meg\'s full name in \'Family Guy\'?', 'Megatron Griffin', [ 'Megatron Griffin', 'Neil Griffin', 'Megan Griffin', 'Who\Cares Griffin'], 2);
new Question('What is Michael J Fox\'s middle name?', 'Andrew', ['Andrew', 'Joseph', 'Joshua', 'Christopher'], 3);
new Question('What is Pikachu\'s National PokéDex Number?', '#025', [ '#025', '#001', '#109', '#031'], 1);
new Question('What is Ron Weasley\'s middle name?', 'Bilius', [ 'Bilius', 'John', 'Arthur', 'Dominic'], 3);
new Question('What is a group of whales called?', 'Pod', ['Pod', 'Clan', 'Gathering', 'Collection'], 2);
new Question('What is known as \'the brain\' of the Computer?', 'Central Processing Unit', [ 'Central Processing Unit', 'Graphics Processing Unit', 'Keyboard', 'Motherboard'], 2);
new Question('What is not a default game mode in Counter-Strike (2000)?', 'Arms Race', [ 'Arms Race', 'Bomb Defusal', 'Assassination', 'Hostage Rescue'], 2);
new Question('What is not a wind instrument?', 'Viola', [ 'Viola', 'Oboe', 'Trombone', 'Duduk'], 1);
new Question('What is rapper Drake\'s real name?', 'Aubrey Graham', [ 'Aubrey Graham', 'Shaun Carter', 'Dwayne Carter', 'Andre Young'], 2);
new Question('What is the British term for a 64th note?', 'Hemidemisemiquaver', [ 'Hemidemisemiquaver', 'Semihemidemisemiquaver', 'Semiquaver', 'Demisemiquaver'], 3);
new Question('What is the Klingon\'s afterlife called?', 'Sto-vo-kor', [ 'Sto-vo-kor', 'Valhalla', 'New Jersey', 'Karon\'gahk'], 3);
new Question('What is the browser game Kantai Collection heavily inspired by?', 'Second World War', [ 'Second World War', 'An Anime', 'World of Warcraft', 'Manga'], 2);
new Question('What is the first element on the periodic table?', 'Hydrogen', ['Hydrogen', 'Helium', 'Sodium', 'Nitrogen'], 3);
new Question('What is the first weapon you acquire in Half-Life?', 'A crowbar', [ 'A crowbar', 'Your fists', 'A pistol', 'The H.E.V suit'], 1);
new Question('What is the fourth book of the Old Testament?', 'Numbers', [ 'Numbers', 'Leviticus', 'Genesis', 'Exodus'], 2);
new Question('What is the homeworld of the Elites from Halo?', 'Sanghelios', [ 'Sanghelios', 'Te', 'Eayn', 'Doisac'], 1);
new Question('What is the largest species of terrestrial crab in the world?', 'Coconut Crab', ['Coconut Crab', 'Dungeness Crab', 'Hermit Crab', 'King Crab'], 3);
new Question('What is the main CPU is the Sega Mega Drive / Sega Genesis?', 'Motorola 68000', [ 'Motorola 68000', 'Intel 8088', 'Yamaha YM2612', 'Zilog Z80'], 2);
new Question('What is the main character of Metal Gear Solid 2?', 'Raiden', [ 'Raiden', 'Big Boss', 'Venom Snake', 'Solidus Snake'], 2);
new Question('What is the main ingredient in guacamole?', 'Avocado', ['Avocado', 'Lettuce', 'Kiwi', 'Honeydew'], 1);
new Question('What is the main ship used by Commander Shepard in the Mass Effect Franchise called?', 'Normandy', [ 'Normandy', 'Osiris', 'Endeavour', 'Infinity'], 1);
new Question('What is the most preferred image format used for logos in the Wikimedia database?', '.svg', [ '.svg', '.png', '.gif', '.jpeg'], 1);
new Question('What is the name for the monetary unit used in Thailand?', 'Baht', ['Kyat', 'Baht', 'Riel', 'Rupee'], 2);
new Question('What is the name given to layer 4 of the Open Systems Interconnection (ISO) model?', 'Transport', [ 'Transport', 'Data link', 'Network', 'Session'], 3);
new Question('What is the name of Chris\'s brother in \'Everybody Hates Chris\'?', 'Drew', [ 'Drew', 'Greg', 'Jerome', 'Joe'], 1);
new Question('What is the name of Eragon\'s dragon in \'Eragon\'?', 'Saphira', [ 'Saphira', 'Arya', 'Glaedr', 'Thorn'], 2);
new Question('What is the name of Finnish DJ Darude\'s hit single released in October 1999?', 'Sandstorm', [ 'Sandstorm', 'Dust Devil', 'Sirocco', 'Khamsin'], 1);
new Question('What is the name of French electronic music producer Madeon\'s 2015 debut studio album?', 'Adventure', [ 'Adventure', 'The City', 'Pop Culture', 'Icarus'], 2);
new Question('What is the name of James Dean\'s character in the 1955 movie \'Rebel Without a Caus\'?', 'Jim Stark', [ 'Jim Stark', 'Jim Kane', 'Frank Stark', 'Ned Stark'], 2);
new Question('What is the name of Sherlock Holmes\'s brother?', 'Mycroft Holmes', [ 'Mycroft Holmes', 'Herbie Hancock Holmes', 'Mederi Holmes', 'Martin Holmes'], 1);
new Question('What is the name of the 2016 mixtape released by Venezuelan electronic producer Arca?', 'Entrañas', [ 'Entrañas', 'Xen', 'Sheep', '&&&&&&'], 3);
new Question('What is the name of the album released in 2014 by American band Maroon 5?', 'V', [ 'V', 'IV', 'X', 'III'], 1);
new Question('What is the name of the default theme that is installed with Windows XP?', 'Luna', [ 'Luna', 'Whistler', 'Bliss', 'Neptune'], 2);
new Question('What is the name of the dog that played Toto in the 1939 film \'The Wizard of Oz\'?', 'Terry', [ 'Terry', 'Teddy', 'Tommy', 'Toto'], 2);
new Question('What is the name of the largest planet in Kerbal Space Program?', 'Jool', [ 'Jool', 'Eeloo', 'Minmus', 'Kerbol'], 1);
new Question('What is the name of the main antagonists in Battlestar Galactica?', 'The Cylons', [ 'The Cylons', 'The Collective', 'The Federation', 'The Rebels'], 2);
new Question('What is the name of the main character from the music video of \'Shelter\' by Porter Robinson and A-1 Studios?', 'Rin', [ 'Rin', 'Rem', 'Ren', 'Ram'], 2);
new Question('What is the name of the main character in \'The Flash\' TV series?', 'Barry Allen', [ 'Barry Allen', 'Bart Allen', 'Bruce Wayne', 'Oliver Queen'], 1);
new Question('What is the name of the planet that the Doctor from television series \'Doctor Who\' comes from?', 'Gallifrey', [ 'Gallifrey', 'Mondas', 'Sontar', 'Skaro'], 1);
new Question('What is the name of the protagonist of J.D. Salinger\'s novel Catcher in the Rye?', 'Holden Caulfield', [ 'Holden Caulfield', 'Jay Gatsby', 'Randall Flagg', 'Fletcher Christian'], 1);
new Question('What is the name of the queen\'s pet in A Bug\'s Life?', 'Aphie', [ 'Aphie', 'Dot', 'Hopper', 'Flik'], 2);
new Question('What is the name of the song by Beyoncé and Alejandro Fernández released in 2007?', 'Amor Gitano', [ 'Amor Gitano', 'La ultima vez', 'Rocket', 'Hasta Dondes Estes'], 3);
new Question('What is the name of the three headed dog in Harry Potter and the Sorcerer\'s Stone?', 'Fluffy', [ 'Fluffy', 'Spot', 'Poofy', 'Spike'], 1);
new Question('What is the name of the world that the MMO \'RuneScape\' takes place in?', 'Gielinor', [ 'Gielinor', 'Glindor', 'Zaros', 'Azeroth'], 1);
new Question('What is the name of the world’s fastest snake whose bite is almost 100% fatal?', 'Black Mamba', ['Black Mamba', 'King Cobra', 'Pit Viper', 'Sidewinder'], 2);
new Question('What is the real name of Canadian electronic music producer deadmau5?', 'Joel Zimmerman', [ 'Joel Zimmerman', 'Sonny Moore', 'Thomas Wesley Pentz', 'Adam Richard Wiles'], 2);
new Question('What is the real name of the Scout in \'Team Fortress 2\'?', 'Jeremy', [ 'Jeremy', 'John', 'Lance', 'Walter'], 2);
new Question('What is the second largest country by land mass?', 'Canada', ['Russia', 'Canada', 'Australia', 'United States'], 1);
new Question('What is the smallest state in the USA?', 'Rhode Island', ['Rhode Island', 'Delaware', 'Vermont', 'Maine'], 1);
new Question('What is the stage name of the member of Public Enemy who would later have a reality dating show?', 'Flavor Flav', ['Flavor Flav', 'Chuck D', 'Ice Cube' , 'Ol\' Dirty Bastard'], 2);
new Question('What is the subtitle for Gran Turismo 3?', 'A-Spec', [ 'A-Spec', 'Championship', 'Drive', 'Nitro'], 2);
new Question('What is the surname of the character Daryl in AMC\'s show The Walking Dead?', 'Dixon', [ 'Dixon', 'Dickinson', 'Grimes', 'Dicketson'], 2);
new Question('What is the world\'s first video game console?', 'Magnavox Odyssey', [ 'Magnavox Odyssey', 'Atari 2600', 'Coleco Telstar', 'Nintendo Color TV Game'], 2);
new Question('What island does the Statue of Liberty stand on?', 'Liberty Island', ['Liberty Island', 'Ellis Island', 'Manhattan', 'Staten Island'], 1);
new Question('What language is spoken in Brazil?', 'Portuguese', ['Portuguese', 'Spanish', 'English', 'French'], 1);
new Question('What movie won best picture at the 2017 Academy Awards?', 'Moonlight', ['Moonlight', 'La La Land', 'Manchester by the Sea', 'Fences'], 3);
new Question('What popular beverage once contained cocaine?', 'Coca-Cola', ['Coca-Cola', 'Pepsi', 'Mountain Dew', 'Cream Soda'], 1);
new Question('What port does HTTP run on?', '80', [ '80', '53', '23', '443'], 3);
new Question('What position does Harry Potter play in Quidditch?', 'Seeker', [ 'Seeker', 'Keeper', 'Chaser', 'Beater'], 2);
new Question('What programming language was used to create the game \'Minecraft\'?', 'Java', [ 'Java', 'Python', 'C++', 'HTML 5'], 3);
new Question('What was Daft Punk\'s first studio album?', 'Homework', [ 'Homework', 'Random Access Memories', 'Human After All', 'Discovery'], 1);
new Question('What was David Bowie\'s real surname?', 'Jones', [ 'Jones', 'Johnson', 'Carter', 'Edwards'], 2);
new Question('What was John Candy\'s character\'s name in the 1987 comedy movie, "Planes, Trains, and Automobiles"?', 'Del Griffith', ['Del Griffith', 'Popeye', 'Frank Drebin', 'Barney Fife'], 3);
new Question('What was Nickelodeon\'s original name?', 'Pinwheel', [ 'Pinwheel', 'Splat!', 'MTVKids', 'KidsTV'], 2);
new Question('What was Rage Against the Machine\'s debut album?', 'Rage Against the Machine', [ 'Rage Against the Machine', 'Bombtrack', 'Evil Empire', 'The Battle Of Los Angeles'], 1);
new Question('What was the callsign of Commander William Adama in Battlestar Galactica (2004)?', 'Husker', [ 'Husker', 'Apollo', 'Starbuck', 'Crashdown'], 3);
new Question('What was the first Android version specifically optimized for tablets?', 'Honeycomb', [ 'Honeycomb', 'Eclair', 'Marshmellow', 'Froyo'], 2);
new Question('What was the first commerically available computer processor?', 'Intel 4004', [ 'Intel 4004', 'Intel 486SX', 'AMD AM386', 'TMS 1000'], 2);
new Question('What was the first company to use the term \'Golden Master\'?', 'Apple', [ 'Apple', 'Microsoft', 'Google', 'IBM'], 3);
new Question('What was the first ever entry written for the SCP Foundation collaborative writing project?', 'SCP-173', [ 'SCP-173', 'SCP-001', 'SCP-1459', 'SCP-999'], 1);
new Question('What was the first weapon pack for \'PAYDAY 2\'?', 'The Gage Weapon Pack #1', [ 'The Gage Weapon Pack #1', 'The Overkill Pack', 'The Gage Chivalry Pack', 'The Gage Historical Pack'], 2);
new Question('What was the highest selling album of the 1980s in the United States?', 'Thriller', ['Thriller', 'Back in Black', 'Pretenders', 'Blizzard of Ozz'], 1);
new Question('What was the name given to Android 4.3?', 'Jelly Bean', [ 'Jelly Bean', 'Froyo', 'Nutella', 'Lollipop'], 2);
new Question('What was the name of Pink Floyd\'s first studio album?', 'The Piper at the Gates of Dawn', [ 'The Piper at the Gates of Dawn', 'More', 'Atom Heart Mother', 'Ummagumma'], 2);
new Question('What was the name of Ross\' pet monkey on \'Friends\'?', 'Marcel', [ 'Marcel', 'George', 'Jojo', 'Champ'], 2);
new Question('What was the name of the Secret Organization in the Hotline Miami series? ', '50 Blessings', [ '50 Blessings', 'American Blessings', '50 Saints', 'USSR\'s Blessings'], 2);
new Question('What was the name of the first MMORPG to popularize the genre?', 'Ultima Online', [ 'Ultima Online', 'World of Warcraft', 'Meridian 59', 'Guild Wars'], 2);
new Question('What was the name of the hero in the 80s animated video game \'Dragon\'s Lair\'?', 'Dirk the Daring', [ 'Dirk the Daring', 'Sir Toby Belch', 'Guy of Gisbourne', 'Arthur'], 3);
new Question('What was the name of the security vulnerability found in Bash in 2014?', 'Shellshock', [ 'Shellshock', 'Stagefright', 'Heartbleed', 'Bashbug'], 3);
new Question('What was the name of the the first episode of Doctor Who to air in 1963?', 'An Unearthly Child', [ 'An Unearthly Child', 'The Edge of Destruction', 'The Daleks', 'The Aztecs'], 1);
new Question('What was the title of ABBA`s first UK hit single?', 'Waterloo', [ 'Waterloo', 'Fernando', 'Mamma Mia', 'Dancing Queen'], 2);
new Question('What was the title of Kayne West\'s debut album release in 2004?','The College Dropout',['The College Dropout', 'The Life of Pablo', 'Yeezus', 'Graduation'], 3);
new Question('What year did the television company BBC officially launch the channel BBC One?', '1936', [ '1936', '1932', '1955', '1948'], 2);
new Question('What year was Min Yoongi from South Korea boy band \'BTS\' born in?', '1993', [ '1993', '1994', '1995', '1992'], 3);
new Question('What year was the game \'Overwatch\' revealed?', '2014', [ '2014', '2008', '2015', '2011'], 1);
new Question('What\'s Dr. Doofenshmirtz first name?', 'Heinz', [ 'Heinz', 'Hank', 'Heidi', 'Hans'], 3);
new Question('What\'s the most common time signature for rock songs?', '4/4', [ '4/4', '2/4', '8/12', '1/2'], 2);
new Question('When did Tame Impala release their second album?', '2012', [ '2012', '2010', '2015', '1967'], 2);
new Question('When did The Beatles release the LP \'Please Please Me\'?', '1963', [ '1963', '1969', '1970', '1960'], 2);
new Question('When did the TV show Rick and Morty first air on Adult Swim?', '2013', [ '2013', '2014', '2015', '2016'], 1);
new Question('When did the online streaming service \'Mixer\' launch?', '2016', [ '2016', '2011', '2013', '2009'], 2);
new Question('When was Gangnam Style uploaded to YouTube?', '2012', [ '2012', '2014', '2011', '2013'], 1);
new Question('When was the game \'Roblox\' released?', '2006', [ '2006', '2002', '2003', '2007'], 2);
new Question('When was the programming language \'C#\' released?', '2000', [ '2000', '2001', '1998', '1999'], 2);
new Question('Where did the British Boy Band \'Bros\' come from?', 'Camberley', [ 'Camberley', 'Aldershot', 'Bagshot', 'Guildford'], 2);
new Question('Where does the Mac part of the name Fleetwood Mac come from?', 'John McVie', [ 'John McVie', 'David Tennant', 'Christine McVie', 'Mac McAnally'], 1);
new Question('Which American family band had a 1986 top 10 hit with the song \'Crush On You\'?', 'The Jets', [ 'The Jets', 'The Cover Girls', 'The Jacksons', 'DeBarge'], 2);
new Question('Which Beatle led the way across the zebra crossing on the Abbey Road album cover?', 'John', [ 'John', 'Paul', 'Ringo', 'George'], 2);
new Question('Which British writer wrote for both Doctor Who and Sherlock?', 'Steven Moffatt', [ 'Steven Moffatt', 'Russell T Davies', 'Toby Whithouse', 'Phil Ford'], 2);
new Question('Which Canadian reggae musician had a 1993 hit with the song \'Informer\'?', 'Snow', [ 'Snow', 'Rain', 'Hail', 'Sleet'], 1);
new Question('Which Disney character sings the song \'A Dream is a Wish Your Heart Makes\'?', 'Cinderella', [ 'Cinderella', 'Belle', 'Pocahontas', 'Snow White'], 1);
new Question('Which Elton John hit starts with the line \'When are you gonna come down\'?', 'Goodbye Yellow Brick Road', [ 'Goodbye Yellow Brick Road', 'Bennie and the Jets', 'Rocket Man', 'Crocodile Rock'], 3);
new Question('Which Game Development company made No Man\'s Sky?', 'Hello Games', [ 'Hello Games', 'Dovetail Games', 'Valve', 'Blizzard Entertainment'], 2);
new Question('Which Nirvana album had a naked baby on the cover?', 'Nevermind', [ 'Nevermind', 'Incesticide', 'Bleach', 'In Utero'], 1);
new Question('Which Overwatch character says the line \'Heroes never die!\'?', 'Mercy', [ 'Mercy', 'Reaper', 'Ana', 'Sonic'], 2);
new Question('Which Queen song was covered by Brittany Murphy in the 2006 film \'Happy Feet\'?', 'Somebody to Love', [ 'Somebody to Love', 'Under Pressure', 'Bohemian Rhapsody', 'Flash'], 2);
new Question('Which RAID array type is associated with data mirroring?', 'RAID 1', [ 'RAID 1', 'RAID 10', 'RAID 0', 'RAID 5'], 3);
new Question('Which WWF wrestler had the nickname \'The Ayatollah of Rock \'N\' Rolla\'?', 'Chris Jericho', [ 'Chris Jericho', 'Shawn Michaels', 'Scott Hall', 'Marty Jannetty'], 2);
new Question('Which actor played Marty McFly in the 1980\'s sci-fi classic Back to the Future?', 'Michael J. Fox', ['Michael J. Fox', 'John Cusak', 'Tom Cruise', 'Michael Keaton'], 1);
new Question('Which actor portrays \'Walter White\' in the series \'Breaking Bad\'?', 'Bryan Cranston', [ 'Bryan Cranston', 'Aaron Paul', 'RJ Mitte', 'Andrew Lincoln'], 1);
new Question('Which actress portrayed Dr. Grace Augustine in the James Cameron movie \'Avatar\'?', 'Sigourney Weaver', [ 'Sigourney Weaver', 'Melissa Beckett', 'Alyssa Monroe ', 'Jessica Chastain'], 3);
new Question('Which album was released by Kanye West in 2013?', 'Yeezus', [ 'Yeezus', 'Watch the Throne', 'My Beautiful Dark Twisted Fantasy', 'The Life of Pablo'], 3);
new Question('Which animated movie was first to feature a celebrity as a voice actor?', 'Aladdin', [ 'Aladdin', 'The Hunchback of Notre Dame', 'Toy Story', 'James and the Giant Peach'], 1);
new Question('Which artist collaborated with American DJ Dillon Francis to release the song 2016 \'Need You\'?', 'NGHTMRE', [ 'NGHTMRE', 'LOUDPVCK', 'DVBBS', 'KRNE'], 2);
new Question('Which artist composed the original soundtrack for \'Watch Dogs 2\'?', 'Hudson Mohawke', [ 'Hudson Mohawke', 'Flying Lotus', 'Rustie', 'Machinedrum'], 3);
new Question('Which band is the longest active band in the world with no breaks or line-up changes?', 'U2', [ 'U2', 'Rush', 'Rolling Stones', 'Radiohead'], 3);
new Question('Which band recorded the album \'Parallel Lines\'?', 'Blondie', [ 'Blondie', 'Coldplay', 'The Police', 'Paramore'], 1);
new Question('Which band released the album \'Sonic Highways\' in 2014?', 'Foo Fighters', [ 'Foo Fighters', 'Coldplay', 'The Flaming Lips', 'Nickelback'], 2);
new Question('Which brass instrument has the lowest pitch in an orchestra?', 'Tuba', [ 'Tuba', 'Saxophone', 'Trombone', 'Trumpet'], 1);
new Question('Which character does voice actress Tara Strong NOT voice?', 'Bubbles (2016)', [ 'Bubbles (2016)', 'Timmy Turner', 'Harley Quinn', 'Twilight Sparkle'], 2);
new Question('Which character was played by Dustin Diamond in the sitcom \'Saved by the Bell\'?', 'Screech', [ 'Screech', 'A.C. Slater', 'Zack', 'Mr. Belding'], 1);
new Question('Which classical composer wrote the \'Moonlight Sonata\'?', 'Ludvig Van Beethoven', [ 'Ludvig Van Beethoven', 'Chief Keef', 'Wolfgang Amadeus Mozart', 'Johannes Brahms'], 1);
new Question('Which company has exclusive rights to air episodes of the \'The Grand Tour\'?', 'Amazon', [ 'Amazon', 'CCTV', 'BBC', 'Netflix'], 1);
new Question('Which computer language would you associate Django framework with?', 'Python', [ 'Python', 'C++', 'C#', 'Java'], 1);
new Question('Which country does the YouTuber \'SinowBeats\' originate from?', 'Scotland', [ 'Scotland', 'England', 'Germany', 'Sweden'], 3);
new Question('Which country does the electronic music duo \'The Knife\' originate from?', 'Sweden', [ 'Sweden', 'Finland', 'Norway', 'Denmark'], 2);
new Question('Which country does the power metal band \'Sabaton\' originate from?', 'Sweden', [ 'Sweden', 'United States', 'Finland', 'Germany'], 2);
new Question('Which country is singer Kyary Pamyu Pamyu from?', 'Japan', [ 'Japan', 'South Korea', 'Vietnam', 'China'], 2);
new Question('Which data structure does FILO apply to?', 'Stack', [ 'Stack', 'Queue', 'Heap', 'Tree'], 3);
new Question('Which famous spy novelist wrote the childrens\' story \'Chitty-Chitty-Bang-Bang\'?', 'Ian Fleming', [ 'Ian Fleming', 'John Buchan', 'Graham Greene', 'Joseph Conrad'], 1);
new Question('Which famous spy novelist wrote the childrens\' story \'Chitty-Chitty-Bang-Bang\'?', 'Ian Fleming', [ 'Ian Fleming', 'Joseph Conrad', 'Graham Greene', 'John Buchan'], 1);
new Question('Which former Star Trek actor directed Three Men and a Baby 1987?', 'Leonard Nimoy', [ 'Leonard Nimoy', 'George Takei', 'William Shatner', 'James Doohan'], 2);
new Question('Which franchise does the creature \'Slowpoke\' originate from?', 'Pokemon', [ 'Pokemon', 'Sonic The Hedgehog', 'Dragon Ball', 'Yugioh'], 1);
new Question('Which game did NOT get financed via Crowdfunding?', 'Enter the Gungeon', [ 'Enter the Gungeon', 'Undertale', 'Tower Unite', 'Town of Salem'], 1);
new Question('Which game is NOT part of the Science Adventure series by 5pb. and Nitroplus?', 'Occultic; Nine', [ 'Occultic; Nine', 'Steins; Gate', 'Robotics; Notes', 'Chaos; Child'], 2);
new Question('Which internet company began life as an online bookstore called \'Cadabra\'?', 'Amazon', [ 'Amazon', 'Overstock', 'eBay', 'Shopify'], 2);
new Question('Which member of \'The Beatles\' narrated episodes of \'Thomas the Tank Engine\'?', 'Ringo Starr', [ 'Ringo Starr', 'George Harrison', 'Paul McCartney', 'John Lennon'], 2);
new Question('Which member of the English band \'The xx\' released their solo album \'In Colour\' in 2015?', 'Jamie xx', [ 'Jamie xx', 'Oliver Sim', 'Baria Qureshi', 'Romy Madley Croft'], 3);
new Question('Which member of the Foo Fighters was previously the drummer for Nirvana?', 'Dave Grohl', [ 'Dave Grohl', 'Nate Mendel', 'Taylor Hawkins', 'Chris Shiflett'], 1);
new Question('Which music group has received the most Grammy Awards?','U2',['U2', 'Metallica', 'Rolling Stones', 'Aerosmith'], 2);
new Question('Which of the following authors was not born in England? ', 'Arthur Conan Doyle', [ 'Arthur Conan Doyle', 'H G Wells', 'Arthur C Clarke', 'Graham Greene'], 2);
new Question('Which of the following characters is NOT a female marriage candidate in the game Stardew Valley?', 'Caroline', [ 'Caroline', 'Haley', 'Abigail', 'Leah'], 1);
new Question('Which of the following commercial vehicles from Grand Theft Auto IV did NOT reappear in Grand Theft Auto V?', 'Steed', [ 'Steed', 'Pony', 'Benson', 'Mule'], 3);
new Question('Which of the following created and directed the Katamari Damacy series?', 'Keita Takahashi', [ 'Keita Takahashi', 'Shinji Mikami', 'Hideki Kamiya', 'Shu Takumi'], 2);
new Question('Which of the following is NOT a real song from the band Thousand Foot Krutch?', 'Limitless Fury', [ 'Limitless Fury', 'Down', 'Let The Sparks Fly', 'Give Up The Ghost'], 3);
new Question('Which of the following is NOT a work done by Shakespeare?', 'Trial of Temperance', [ 'Trial of Temperance', 'Measure For Measure', 'Titus Andronicus', 'Cymbeline'], 3);
new Question('Which of the following is a personal computer made by the Japanese company Fujitsu?', 'FM-7', [ 'FM-7', 'MSX', 'Xmillennium ', 'PC-9801'], 2);
new Question('Which of the following is not a playable race in the MMORPG Guild Wars 2? ', 'Tengu', [ 'Tengu', 'Sylvari', 'Asura ', 'Charr'], 2);
new Question('Which of the following languages is used as a scripting language in the Unity 3D game engine?', 'C#', [ 'C#', 'Java', 'Objective-C', 'C++'], 2);
new Question('Which of the following movies was not based on a novel by Stephen King? ', 'The Thing', [ 'The Thing', 'Misery', 'The Green Mile', 'Carrie'], 1);
new Question('Which of the following was the author of \'Username Evie\'?', 'Joe Sugg', [ 'Joe Sugg', 'Zoe Sugg', 'Joe Weller', 'Alfie Deyes'], 2);
new Question('Which of the following won the first season of American Idol in 2002?', 'Kelly Clarkson', [ 'Kelly Clarkson', 'Justin Guarini', 'Ruben Studdard', 'Chris Daughtry'], 1);
new Question('Which of these Bojack Horseman characters is a human?', 'Todd Chavez', [ 'Todd Chavez', 'Lennie Turtletaub', 'Princess Carolyn', 'Tom Jumbo-Grumbo'], 1);
new Question('Which of these Disney shows is classified as an anime?', 'Stitch!', [ 'Stitch!', 'The Emperor\'s New School', 'Cory in the House', 'Hannah Montana'], 1);
new Question('Which of these Pokémon cannot learn Surf?', 'Arbok', [ 'Arbok', 'Nidoking', 'Tauros', 'Linoone'], 3);
new Question('Which of these Starbound races has a Wild West culture?', 'Novakid', [ 'Novakid', 'Avian', 'Human', 'Hylotl'], 1);
new Question('Which of these actors/actresses is NOT a part of the cast for the 2016 movie \'Suicide Squad\'?', 'Scarlett Johansson', [ 'Scarlett Johansson', 'Jared Leto', 'Will Smith', 'Margot Robbie'], 1);
new Question('Which of these artists do NOT originate from France?', 'The Chemical Brothers', [ 'The Chemical Brothers', 'Air', 'Daft Punk', 'Justice'], 2);
new Question('Which of these artists has NOT been a member of dancehall group Major Lazer?', 'Skrillex', [ 'Skrillex', 'Jillionaire', 'Diplo', 'Walshy Fire'], 2);
new Question('Which of these bands is the oldest?', 'Pink Floyd', [ 'Pink Floyd', 'Red Hot Chili Peppers', 'AC/DC', 'Metallica'], 2);
new Question('Which of these book series is by James Patterson?', 'Maximum Ride', [ 'Maximum Ride', 'The Legend of Xanth', 'The Bartemaeus Trilogy', 'Harry Potter'], 2);
new Question('Which of these characters in \'Stranger Things\' has the power of Telekinesis?', 'Eleven', [ 'Eleven', 'Lucas', 'Mike', 'Karen'], 1);
new Question('Which of these characters in \'Undertale\' can the player NOT go on a date with?', 'Toriel', [ 'Toriel', 'Alphys', 'Undyne', 'Papyrus'], 3);
new Question('Which of these characters was NOT planned to be playable for Super Smash Bros. 64?', 'Peach', [ 'Peach', 'King Dedede', 'Mewtwo', 'Bowser'], 2);
new Question('Which of these does Charlie NOT read in The Perks of Being a Wallflower?', 'The Grapes of Wrath', [ 'The Grapes of Wrath', 'The Great Gatsby', 'Hamlet', 'Peter Pan'], 3);
new Question('Which of these in the Star Trek series is NOT Klingon food?', 'Hors d\'oeuvre', [ 'Hors d\'oeuvre', 'Racht', 'Gagh', 'Bloodwine'], 3);
new Question('Which of these is NOT a playable character in the 2016 video game Overwatch?', 'Invoker', [ 'Invoker', 'Mercy', 'Winston', 'Zenyatta'], 1);
new Question('Which of these is NOT a player class in Team Fortress 2?', 'Healer', [ 'Healer', 'Pyro', 'Demoman', 'Spy'], 1);
new Question('Which of these is NOT a song by Pegboard Nerds?', 'WiFi Tears', [ 'WiFi Tears', 'Swamp Thing', 'Emoji', 'BAMF'], 2);
new Question('Which of these is NOT an album released by The Beatles?', 'The Wall', [ 'The Wall', 'Magical Mystery Tour', 'Abbey Road', 'Revolver'], 2);
new Question('Which of these is NOT the name of a team leader in Pokémon GO?', 'Leif', [ 'Leif', 'Blanche', 'Spark', 'Candela'], 2);
new Question('Which of these is not an Ed Sheeran album?', '-', [ '-', '÷', '+', 'X'], 2);
new Question('Which of these is the name of a song by Tears for Fears?', 'Shout', [ 'Shout', 'Yell', 'Scream', 'Shriek'], 1);
new Question('Which of these languages was NOT included in the 2016 song \'Don\'t Mind\' by Kent Jones?', 'Portuguese', [ 'Portuguese', 'Japanese', 'Spanish', 'French'], 2);
new Question('Which of these names was an actual codename for a cancelled Microsoft project?', 'Neptune', [ 'Neptune', 'Enceladus', 'Saturn', 'Pollux'], 3);
new Question('Which of these people was NOT a founder of Apple Inc?', 'Jonathan Ive', [ 'Jonathan Ive', 'Steve Wozniak', 'Ronald Wayne', 'Steve Jobs'], 2);
new Question('Which of these songs is not by Tatsuro Yamashita?', 'Lucky Lady Feel So Good ', [ 'Lucky Lady Feel So Good ', 'Let\'s Dance Baby', 'Merry-Go Round', 'Love Talkin'], 3);
new Question('Which of these television shows makes everyone look under their chair?', 'Oprah', [ 'Oprah', 'Larry Rubert', 'Saturday Night Live', 'Jimmy Fallon'], 2);
new Question('Which of these weapon classes DO NOT appear in the first Monster Hunter game?', 'Bow ', [ 'Bow ', 'Heavy Bowgun', 'Hammer', 'Light Bowgun'], 3);
new Question('Which one of these Pink Floyd albums were also a movie?', 'The Wall', [ 'The Wall', 'Animals', 'The Dark Side of the Moon', 'Wish You Were Here'], 2);
new Question('Which one of these Rammstein songs has two official music videos?', 'Du Riechst So Gut', [ 'Du Riechst So Gut', 'Mein Teil', 'Benzin', 'Du Hast'], 2);
new Question('Which operating system was released first?', 'Mac OS', [ 'Mac OS', 'OS/2', 'Windows', 'Linux'], 2);
new Question('Which operation in \'Tom Clancy\'s Rainbow Six Siege\' introduced the \'Skyscraper\' map?', 'Red Crow', [ 'Red Crow', 'Dust Line', 'Skull Rain', 'Velvet Shell'], 2);
new Question('Which planet has the most moons?','Jupiter',['Jupiter', 'Uranus', 'Neptune', 'Saturn'], 2);
new Question('Which pop star sang the national anthem at the 50th Super Bowl?','Lady Gaga',['Lady Gaga', 'Justin Timberlake', 'Katy Perry', 'Taylor Swift'], 2);
new Question('Which popular rock band has a one-armed drummer?', 'Def Leppard', [ 'Def Leppard', 'Lynyrd Skynyrd', 'Foreigner', 'The Beatles'], 2);
new Question('Which programming language was developed by Sun Microsystems in 1995?', 'Java', [ 'Java', 'Solaris OS', 'C++', 'Python'], 2);
new Question('Which race enjoys a glass of warm baghol in \'Star Trek\'?', 'Klingon', [ 'Klingon', 'Vulcan', 'Botha', 'Human'], 3);
new Question('Which rap group released the album \'Straight Outta Compton\'?', 'N.W.A', [ 'N.W.A', 'Run-D.M.C.', 'Beastie Boys', 'Wu-Tang Clan'], 1);
new Question('Which rapper had an album that went double platinum with no features?', 'J. Cole', [ 'J. Cole', 'Big Sean', 'Drake', 'Kendrick Lamar'], 2);
new Question('Which rock band released the album \'The Bends\' in March 1995?', 'Radiohead', [ 'Radiohead', 'U2', 'Coldplay', 'Nirvana'], 2);
new Question('Which singer was featured in Swedish producer Avicii\'s song \'Wake Me Up\'?', 'Aloe Blacc', [ 'Aloe Blacc', 'John Legend', 'CeeLo Green', 'Pharrell Williams'], 2);
new Question('Which song in Drake\'s \'Views\' features Future?', 'Grammys', [ 'Grammys', 'Too Good', 'Pop Style', 'Faithful'], 2);
new Question('Which song is not by TheFatRat?', 'Ascent', [ 'Ascent', 'Monody', 'Infinite Power!', 'Windfall'], 2);
new Question('Which track by \'Massive Attack\' is used for the theme of \'House\'? ', 'Teardrop', [ 'Teardrop', 'Protection', 'Angel', 'Black Milk'], 2);
new Question('Which water-type Pokémon starter was introduced in the 4th generation of the series?', 'Piplup', [ 'Piplup', 'Oshawott', 'Totodile', 'Mudkip'], 1);
new Question('Which year was the album \'Floral Shoppe\' by Macintosh Plus released?', '2011', [ '2011', '2014', '2012', '2013'], 3);
new Question('Who co-founded the YouTube Let\'s Play channel \'Game Grumps\' alongside Newgrounds animator Egoraptor?', 'JonTron', [ 'JonTron', 'Pewdiepie', 'Tobuscus', 'Markiplier'], 2);
new Question('Who directed \'E.T. the Extra-Terrestrial\' 1982?', 'Steven Spielberg', [ 'Steven Spielberg', 'James Cameron', 'Tim Burton', 'Stanley Kubrick'], 1);
new Question('Who directed the original Star Wars in 1977?', 'George Lucas', ['George Lucas', 'Steven Spielberg', 'JJ Abrams', 'Han Solo'], 2);
new Question('Who had a 1973 hit with the song \'Hocus Pocus\'?', 'Focus', [ 'Focus', 'AC/DC', 'Pilot', 'Rush'], 2);
new Question('Who had a 1981 hit with the song \'Japanese Boy\'?', 'Aneka', [ 'Aneka', 'Sandra', 'Madonna', 'Toyah'], 3);
new Question('Who had a 1983 hit with the song \'Africa\'?', 'Toto', [ 'Toto', 'Steely Dan', 'Foreigner', 'Journey'], 1);
new Question('Who interrupted Taylor Swift\'s acceptance speech at the 2009 Video Music Awards?', 'Kanye West', ['Kanye West', 'Blake Shelton', '2 Chains', 'Lil Wayne'], 1);
new Question('Who is a pioneer of \'Minimal Music\' in 1960s?', 'Steve Reich', [ 'Steve Reich', 'Wolfgang Amadeus Mozart', 'Sigur Rós', 'Brian Eno'], 3);
new Question('Who is credited with suggesting the word "hello" be used when answering the telephone?', 'Thomas Edison', ['Thomas Edison','Alexander Graham Bell','Nikola Tesla','Elisha Gray'], 3);
new Question('Who is the best selling artist of all time?', 'The Beatles', [ 'The Beatles', 'Elvis Presley', 'Michael Jackson', 'Elton John'], 2);
new Question('Who is the creator of Touhou project?', 'Zun', [ 'Zun', 'Tasofro', 'Jun', 'Twilight Frontier'], 1);
new Question('Who is the director of the 1991 film \'Silence of the Lambs\'?', 'Jonathan Demme', [ 'Jonathan Demme', 'Frank Darabont', 'Stanley Kubrick', 'Michael Bay'], 2);
new Question('Who is the former drummer for Nirvana that went on to become the frontman for the Foo Fighters?', 'Dave Grohl', ['Dave Grohl', 'Kurt Cobain', 'Chris Stapleton', 'Johnny Cash'], 2);
new Question('Who is the founder of Team Fortress 2\'s fictional company \'Mann Co\'?', 'Zepheniah Mann', [ 'Zepheniah Mann', 'Cave Johnson', 'Saxton Hale', 'Wallace Breem'], 1);
new Question('Who is the frontman of Muse?', 'Matt Bellamy', [ 'Matt Bellamy', 'Jonny Greenwood', 'Thom Yorke', 'Dominic Howard'], 2);
new Question('Who is the lead singer of Bastille?', 'Dan Smith', [ 'Dan Smith', 'Chris Wood', 'Will Farquarson', 'Kyle Simmons'], 2);
new Question('Who is the lead singer of Green Day?', 'Billie Joe Armstrong', [ 'Billie Joe Armstrong', 'Tré Cool', 'Sean Hughes', 'Mike Dirnt'], 1);
new Question('Who is the lead singer of Pearl Jam?', 'Eddie Vedder', [ 'Eddie Vedder', 'Stone Gossard', 'Kurt Cobain', 'Ozzy Osbourne'], 1);
new Question('Who is the lead singer of Silverchair?', 'Daniel Johns', [ 'Daniel Johns', 'Chris Joannou', 'Ben Gillies', ''], 2);
new Question('Who is the lead singer of the British pop rock band Coldplay?', 'Chris Martin', [ 'Chris Martin', 'Jonny Buckland', 'Guy Berryman', 'Will Champion'], 1);
new Question('Who is the lead singer of the band Coldplay?', 'Chris Martin', [ 'Chris Martin', 'Chris Wallace', 'Chris Isaak', 'Chris Connelly'], 1);
new Question('Who is the leader of Team Instinct in Pokémon Go?', 'Spark', [ 'Spark', 'Blanche', 'Willow', 'Candela'], 1);
new Question('Who is the main character in \'The Stanley Parable\'?', 'Stanley', [ 'Stanley', 'The Narrator', 'The Boss', 'The Adventure Line'], 1);
new Question('Who is the main character in the show \'Burn Notice\'?', 'Michael Westen', [ 'Michael Westen', 'Sam Axe', 'Madeline Westen', 'Fiona Glenanne'], 1);
new Question('Who is the main character in the video game \'Just Cause 3\'?', 'Rico Rodriguez', [ 'Rico Rodriguez', 'Marcus Holloway', 'Tom Sheldon', 'Mario Frigo'], 2);
new Question('Who is the main character of \'Metal Gear Solid 3\'?', 'Naked Snake', [ 'Naked Snake', 'Venom Snake', 'Liquid Snake', 'Solid Snake'], 2);
new Question('Who is the original author of the realtime physics engine called PhysX?', 'NovodeX', [ 'NovodeX', 'Nvidia', 'Ageia', 'AMD'], 3);
new Question('Who is the primary lyricist for Canadian progressive rock band Rush?', 'Neil Peart', [ 'Neil Peart', 'Geddy Lee', 'John Rutsey', 'Alex Lifeson'], 2);
new Question('Who is the star of the AMC series Breaking Bad?', 'Walter White', [ 'Walter White', 'Jesse Pinkman', 'Saul Goodman', 'Skyler White'], 1);
new Question('Who performed \'I Took A Pill In Ibiza\'?', 'Mike Posner', [ 'Mike Posner', 'Avicii', 'Robbie Williams', 'Harry Styles'], 1);
new Question('Who played Agent Fox Mulder in the TV sci-fi drama \'The X-Files\'?', 'David Duchovny', [ 'David Duchovny', 'Mitch Pileggi', 'Robert Patrick', 'Gillian Anderson'], 1);
new Question('Who played Batman in the 1997 film \'Batman and Robin\'?', 'George Clooney', [ 'George Clooney', 'Val Kilmer', 'Michael Keaton', 'Christian Bale'], 2);
new Question('Who played Sgt. Gordon Elias in \'Platoon\' 1986?', 'Willem Dafoe', [ 'Willem Dafoe', 'Johnny Depp', 'Matt Damon', 'Charlie Sheen'], 2);
new Question('Who played the sun baby in the original run of Teletubbies?', 'Jessica Smith', [ 'Jessica Smith', 'Lisa Brockwell', 'Sue Monroe', 'Pui Fan Lee'], 3);
new Question('Who plays \'Bruce Wayne\' in the 2008 movie \'The Dark Knight\'?', 'Christian Bale', [ 'Christian Bale', 'Ron Dean', 'Michael Caine', 'Heath Ledger'], 2);
new Question('Who produced and directed the American epic aviation war film "Hell\'s Angels", released in 1930?', 'Howard Hughes', ['Howard Hughes', 'William Powell', 'Leslie Howard', 'Fredric Marc'], 2);
new Question('Who recorded the 1975 album \'Captain Fantastic and the Brown Dirt Cowboy\'?', 'Elton John', [ 'Elton John', 'Billy Joel', 'John Denver', 'Joe Cocker'], 3);
new Question('Who sang the theme song for the TV show \'Rawhide\'?', 'Frankie Laine', [ 'Frankie Laine', 'Slim Whitman', ' Tennessee Ernie Ford', 'Guy Mitchell'], 2);
new Question('Who starred as Bruce Wayne and Batman in Tim Burton\'s 1989 movie \'Batman\'?', 'Michael Keaton', [ 'Michael Keaton', 'George Clooney', 'Adam West', 'Val Kilmer'], 1);
new Question('Who voices Max Payne in the 2001 game \'Max Payne\'?', 'James McCaffrey', [ 'James McCaffrey', 'Sam Lake', 'Troy Baker', 'Hideo Kojima'], 2);
new Question('Who was not in the band \'The Smiths\'?', 'Martin Chambers', [ 'Martin Chambers', 'Mike Joyce', 'Andy Rourke', 'Morrissey'], 3);
new Question('Who was the first ever actor to play \'The Doctor\' on \'Doctor Who\'?', 'William Hartnell', [ 'William Hartnell', 'Tom Baker', 'Peter Capaldi', 'David Tennant'], 1);
new Question('Who was the first female protagonist in a video game?', 'Samus Aran', [ 'Samus Aran', 'Chell', 'Alis Landale', 'Lara Croft'], 2);
new Question('Who was the lead singer and frontman of rock band R.E.M?', 'Michael Stipe', [ 'Michael Stipe', 'George Michael', 'Thom Yorke', 'Chris Martin'], 2);
new Question('Who was the lead singer of the band Audioslave?','Chris Cornell',['Chris Cornell', 'Eddie Vedder', 'Sammy Hagar', 'Bruce Springsteen'], 2);
new Question('Who was the lead singer of the rock band Queen?','Freddie Mercury',['Freddie Mercury', 'Mick Jagger', 'Steven Tyler', 'Bono'], 2);
new Question('Who was the star of the TV series \'24\'?', 'Kiefer Sutherland', [ 'Kiefer Sutherland', 'Hugh Laurie', 'Kevin Bacon', 'Rob Lowe'], 2);
new Question('Who was the winner of \'Big Brother\' Season 10?', 'Dan Gheesling', [ 'Dan Gheesling', 'Ryan Sutfin', 'Chris Mundorf', 'Bryce Kranyik'], 3);
new Question('Who was the winner of the 2016 WWE Royal Rumble?', 'Triple H', [ 'Triple H', 'AJ Styles', 'Dean Ambrose', 'Roman Reigns'], 2);
new Question('Who won Big Brother 2014 UK?', 'Helen Wood', [ 'Helen Wood', 'Pavandeep "Pav" Paul', 'Pauline Bennett', 'Christopher Hall'], 1);
new Question('Who won the 1989 Drum Corps International championships?', 'Santa Clara Vanguard', [ 'Santa Clara Vanguard', 'The Bluecoats', 'The Academy', 'Blue Devils'], 3);
new Question('Who wrote \'Harry Potter\'?', 'J.K. Rowling', [ 'J.K. Rowling', 'Terry Pratchett', 'Daniel Radcliffe', 'J.R.R. Tolkien'], 1);
new Question('Who wrote the 1967 horror novel \'Rosemary\'s Baby\'?', 'Ira Levin', [ 'Ira Levin', 'Stephen King', 'Robert Bloch', 'Mary Shelley'], 2);
new Question('Who wrote the \'A Song of Ice And Fire\' fantasy novel series?', 'George R. R. Martin', [ 'George R. R. Martin', 'George Eliot', 'George Lucas', 'George Orwell'], 2);
new Question('Who wrote the children\'s story \'The Little Match Girl\'?', 'Hans Christian Andersen', [ 'Hans Christian Andersen', 'Oscar Wilde', 'Charles Dickens', 'Lewis Carroll'], 2);
new Question('Who wrote the novel \'Fear And Loathing In Las Vegas\'?', 'Hunter S. Thompson', [ 'Hunter S. Thompson', 'F. Scott Fitzgerald', 'William S. Burroughs', 'Henry Miller'], 1);
new Question('Who wrote the novel \'Moby-Dick\'?', 'Herman Melville', [ 'Herman Melville', 'J. R. R. Tolkien', 'William Shakespeare', 'William Golding'], 3);
new Question('Who wrote the song \'You Know You Like It\'?', 'AlunaGeorge', [ 'AlunaGeorge', 'Major Lazer', 'Steve Aoki', 'DJ Snake'], 3);
new Question('Who wrote the young adult novel \'The Fault in Our Stars\'?', 'John Green', [ 'John Green', 'Stephen Chbosky', 'Stephenie Meyer', 'Suzanne Collins'], 1);
new Question('Who wrote the young adult vampire-romance novel "Twilight"?', 'Stephanie Meyer', ['Stephanie Meyer', 'JK Rowling', 'Roald Dahl', 'George RR Martin'], 2);
new Question('Whose signature guitar technique is called the \'windmill\'?', 'Pete Townshend', [ 'Pete Townshend', 'Jimmy Page', 'Eddie Van Halen', 'Jimi Hendrix'], 1);
new Question('\'Green Eggs And Ham\' is a book by which author?', 'Dr. Seuss', [ 'Dr. Seuss', 'Roald Dahl', 'A.A. Milne', 'Beatrix Potter'], 1);
new Question('\'Lift Your Spirit\' is an album by which artist?', 'Aloe Blacc', [ 'Aloe Blacc', 'Lena Meyer-Landrut', 'Stevie Wonder', 'Taylor Swift'], 2);
new Question('\'Make You Feel My Love\' was originally written and performed by which singer-songwriter?', 'Bob Dylan', [ 'Bob Dylan', 'Billy Joel', 'Adele', 'Elvis'], 2);

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
