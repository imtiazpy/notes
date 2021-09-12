const addTitle = document.getElementById("addTitle");
const addText = document.getElementById("addText");
const saveNoteButton = document.getElementById("save-button");

let userImg
let userName
let userEmail
let seed

fetch("https://randomuser.me/api/").then(res => res.json()).then(data => {
	userName = data.results[0].name
	userImg = data.results[0].picture.medium
	userEmail = data.results[0].email
	seed = data.info.seed

	displayUserInfo(userImg, userName, userEmail, seed)
})



function displayUserInfo(userImg, userName, userEmail, seed) {
	document.getElementById("user-info").innerHTML =
		`
    		<div class="card mb-3" style="max-width: 540px;">
    			<div class="row g-0">
    			  	<div class="col-md-4">
    			    	<img src="${userImg}" class="img-fluid rounded-start" alt="...">
    			  	</div>
    			  	<div class="col-md-8">
    			    	<div class="card-body">
    			      		<h5 class="card-title">${userName.first} ${userName.last}</h5>
    			      		<p class="card-text">${userEmail}</p>
    			      		<p class="card-text">${seed}</p>
    			    	</div>
    			  	</div>
    			</div>
    		</div>
  
  		`;
}



class NoteTemplate {
	constructor(title, body) {
		this.title = title;
		this.body = body;
	}
}


const getFromLocal = () => {
	let notesArray = [];
	const allNotes = localStorage.getItem('notes');
	if (allNotes) {
		notesArray = JSON.parse(allNotes)
	}
	return notesArray;
}

//function for saving note
saveNoteButton.addEventListener("click", function () {
	let notesArray = getFromLocal();
	const alertDiv = document.getElementById("alert-user");

	let title = addTitle.value;
	let body = addText.value;
	const singleNote = new NoteTemplate(title, body);

	if (!singleNote.title || !singleNote.body) {
		alertDiv.innerHTML = `
			<div class="alert alert-warning"  role="alert">
        		Please enter a title and body texts both...
			</div>
		`;
		return;
	} else {
		alertDiv.innerHTML = "";
		notesArray.push(singleNote);

		localStorage.setItem("notes", JSON.stringify(notesArray));
		document.getElementById("display-notes").innerHTML = "";
		showNotes();
		addTitle.value = "";
		addText.value = "";
	}
});




//function for displaying notes
const showNotes = () => {
	let notesArray = getFromLocal()
	let noteCount = notesArray.length;
	const notesDiv = document.getElementById("display-notes");

	if (!notesArray) {
		document.getElementById("display-message").innerText = "No notes to display";
	} else {
		document.getElementById("display-message").innerText = "Your notes...";
	}

	notesArray.forEach((element, index) => {
		notesDiv.innerHTML += `

 			<div class="single-card">
 			    <div class="col" style="max-height: 250px; overflow: scroll; scroll-behavior: smooth; overflow-x: auto;">
 			       	<div class="card text-dark bg-info">
 			         <div class="card-body">
 			           <h4
 			             class="card-title text-center edit-content"
 			             onclick="contentEdit(this.id)"
 			             onblur="editNote(${index},this.id)"
 			             id="title${index}"
 			           >
 			             ${element.title}
 			           </h4>
 			           <hr />
 			           <p
 			             class="card-text"
 			             style="text-align: justify"
 			             onclick="contentEdit(this.id)"
 			             onblur="editNote(${index},this.id)"
 			             id="body${index}"
 			           >
 			             ${element.body}
 			           </p>
 			         </div>
 			       </div>
 			       	<div class="d-flex justify-content-center">
						<button class="btn btn-outline-warning w-100" onclick="deleteItem(${index})">Done</button>
					</div>
 			     </div>
 			</div>
		`;
	});

	document.getElementById("notes-count").innerText = noteCount;

};

showNotes();


// function for deleting item
const deleteItem = (index) => {
	let notesArray = getFromLocal()
	const filtered = notesArray.filter(e => e !== notesArray[index]);
	notesArray = filtered;
	// console.log(notesArray)
	localStorage.setItem('notes', JSON.stringify(notesArray))
	location.reload()
}

//function for make notes editable
function contentEdit(id) {
	const content = document.getElementById(id);
	content.setAttribute("contenteditable", "true");
}

function editNote(index, id) {
	const content = document.getElementById(id);
	editText(index, id, id.includes('title') ? 'title' : 'body')
	content.removeAttribute("contenteditable")
}

const editText = (index, id, toEdit) => {
	const changedText = document.getElementById(id).innerText;
	let notesArray = getFromLocal();

	if (toEdit === "title") {
		notesArray[index].title = changedText;
	}
	if (toEdit === "body") {
		notesArray[index].body = changedText;
	}
	localStorage.setItem("notes", JSON.stringify(notesArray));
};

document.getElementById("search-btn").addEventListener("click", (e) => {
	const searchedKey = document.getElementById("searched-keyword").value.toLowerCase();

	filterNotes(searchedKey);
	e.preventDefault();
});

//function for filtering notes on keyword input in search field..
function inputChange(event) {
	const searchedKey = event.target.value.toLowerCase();
	filterNotes(searchedKey);
}

const filterNotes = (searchedKey) => {
	const notes = document.getElementsByClassName("single-card");
	for (let i = 0; i < notes.length; i++) {
		const element = notes[i];

		if (element.innerText.toLowerCase().includes(searchedKey)) {
			element.style.display = "block";
		} else {
			element.style.display = "none";
		}
	}
};

