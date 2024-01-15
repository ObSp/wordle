let dict = document.getElementById("dict").innerHTML.split("\n")
let possibleanswers = document.getElementById('possible-words').innerHTML.split("\n")

let answerfields = document.getElementsByTagName('input')
let resultfield = document.getElementById('result-text')
let usrmessagefield = document.getElementById('user-msg')
let tellcorrect = document.getElementById('tell-correct')


let openmenu = document.getElementById('open-menu')
let menubar = document.getElementById('menu-bar')
let showwebsites = document.getElementById('website-menu-hover')
let websitemenu = document.getElementById('websites-show')

let correctdisplay = document.getElementById('full-word-display')


let yellowwords = document.getElementById('yellow-words')
let yellowwordlist = []


for (let i = 0; i <answerfields.length; i++) {answerfields[i].disabled = true; answerfields[i].value = null}

let currentanswerfield = answerfields[0]
currentanswerfield.disabled = false
currentanswerfield.focus()

let currentanswerindex = 0

let randomword = possibleanswers[Math.floor(Math.random()*possibleanswers.length)]
console.log("Random word generated is: "+randomword)

let LetterColors = {
    Correct: "#30d361",
    InWord: "#a0c4aa",
    Wrong: "#ce1d53",
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function GetLetterColor(letter, index) {
    if (randomword[index] == letter) return "Correct"
    if (randomword.includes(letter)) return "InWord"
    return "Wrong"
}

function DetermineCorrect(word) {
    let splitword = word.split("")
    let wordcolors = []
    let index = 0
    word.split("").forEach(char => {
        let lettercolor = GetLetterColor(char, index)
        wordcolors.push(lettercolor)
        index += 1
    })
    return wordcolors
}

function DisplayMessage(message, type, time) {
    usrmessagefield.innerHTML = "<span class='"+type+"'>"+message+"</span>"
    sleep(time).then(() => {
        usrmessagefield.innerHTML = ""
    })
}

document.onkeydown = function(key){
    if (key.key!="Enter") return;

    if (currentanswerfield.value.length < 5) {DisplayMessage("Must be 5 letters long", "Wrong", 2000); return}

    if (!dict.includes(currentanswerfield.value)&&!possibleanswers.includes(currentanswerfield.value)) {DisplayMessage("Not a real word", "Wrong", 2000); return}

    if (randomword == currentanswerfield.value) {
        for (let i = 0; i <answerfields.length; i++) answerfields[i].hidden = true
        tellcorrect.hidden = false
        tellcorrect.style.color = "#30d361"
        tellcorrect.innerHTML = "Correct! The word was <b><i>"+randomword+"</i></b>!"
        return
    }

    let colors = DetermineCorrect(currentanswerfield.value)
    let splitword = currentanswerfield.value.split("")
    console.log(splitword)
    let coloredtext = ""
    colors.forEach((color, index) => {
        coloredtext += "<span class='"+color+"'>"+splitword[index]+"</span>"
    });
    let fullword = correctdisplay.innerHTML.split("") // list of characters that the user has guessed correct
    colors.forEach((color, index) => { // run a forEach loop through colors to detect any correct colors
        if (color == "Correct"){
            fullword[index] = randomword[index]
        }  else if (color == "InWord" && !yellowwordlist.includes(splitword[index])) {
            yellowwordlist.push(splitword[index])
            yellowwords.innerHTML += splitword[index]+", "
        }
    })
    correctdisplay.innerHTML = ""
    fullword.forEach(char => {
        correctdisplay.innerHTML += char
    })
    currentanswerfield.disabled = true
    //currentanswerfield.value = coloredtext
    let newp = document.createElement("p")
    newp.innerHTML = coloredtext
    newp.id = "list-item"
    document.getElementById("aside-list").appendChild(newp)
    currentanswerfield.hidden = true
    currentanswerindex +=1
    currentanswerfield = answerfields[currentanswerindex]
    if (!currentanswerfield) {
        DisplayMessage("Max tries reached, please reload the page", "Wrong", 2000000) 
        tellcorrect.hidden = false
        tellcorrect.innerHTML = "The correct word was <b><i>"+randomword+"</i></b>"
        return
    }
    currentanswerfield.disabled = false
    currentanswerfield.focus()
}


openmenu.onclick = function(){
    menubar.hidden = !menubar.hidden    
}


showwebsites.onclick = function() {
    websitemenu.hidden = !websitemenu.hidden
}

showwebsites.onmouseenter = function() {
    websitemenu.hidden = !websitemenu.hidden
}

websitemenu.onmouseleave = function() {
    websitemenu.hidden = true
}

menubar.onmouseleave = function() {
    if (showwebsites.hidden == true) menubar.hidden = true
}

openmenu.onmouseenter = function() {
    menubar.hidden = false
}