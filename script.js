function goSomewhere(x){
	location = x;
}
function submit(){
	db.collection("users")
	.doc(localStorage.getItem("userToken"))
	.get()
	.then(function (snapshot){
		document.getElementById("button").innerText = "Uploading to Server..."
		var name = snapshot.data().username
		var projectsusermade = snapshot.data().projects
		var project = document.getElementById("project").value;
		var url = document.getElementById("url").value;
		if(!(name && project && url)){
			document.getElementById("button").innerText = "Submit"
			alert("Some of the inputs aren't filled!")
			return
		}
		db.collection("projects")
		.where("url","==",url)
		.get()
		.then(function(snapshot){
			if(snapshot.empty){
				var number = 0;
				db.collection("projects")
				.get()
				.then(function (snapshot){
					number = snapshot.docs.length;
					db.collection("projects")
					.add({
						name: name,
						project: project,
						url: url,
						winner: 0,
						number: number
					})
					.then(function (snapshot){
						document.getElementById("button").innerText = "Uploading Project to Your Account"
						projectsusermade.push(snapshot.id)
						db.collection("users")
						.doc(localStorage.getItem("userToken"))
						.update({
							projects: projectsusermade
						})
						document.getElementById("thecode").innerText = 	"Send \""+snapshot.id+"\" to Kenji"
						document.getElementById("button").innerText = "Done!"
					})
				})
			}else{
				alert("That url was already used")
				document.getElementById("button").innerText = "Submit"
			}
		})
	})
}
function gallery(){
	db.collection("projects")
	.get()
	.then(function (snapshot){
		console.log(snapshot.docs.length)
		for(i=snapshot.docs.length;i>= 0;i-=1){
			console.log(i)
			db.collection("projects")
			.where("number","==",i)
			.get()
			.then(function (snapshot){
				var h2 = document.createElement("h4");
				h2.innerText = snapshot.docs[0].data().project
				var h3 = document.createElement("h5");
				h3.innerText = snapshot.docs[0].data().name
        var name = snapshot.docs[0].data().name
        h3.style["cursor"] = "pointer";
				h3.setAttribute("onClick","goSomewhere(\"profile.html?username="+name+"\")")
				var p = document.createElement("p")
				p.innerText = "Click Here to Go To Project"
				var url = snapshot.docs[0].data().url
				p.style["cursor"] = "pointer";
				p.setAttribute("onClick","goSomewhere(\""+url+"\")")
				var hr = document.createElement("hr")
				document.getElementById("everything").appendChild(hr)
				document.getElementById("everything").appendChild(h2)
				document.getElementById("everything").appendChild(h3)
				document.getElementById("everything").appendChild(p)
				if(snapshot.docs[0].data().winner == 1){
					document.getElementById("everything1").appendChild(hr)
					document.getElementById("everything1").appendChild(h2)
					document.getElementById("everything1").appendChild(h3)
					document.getElementById("everything1").appendChild(p)
				}
			})
		}
	})
}
function signup(){
	var username = document.getElementById("username").value
	var password = CryptoJS.SHA256(document.getElementById("password").value).toString();
	db.collection("users")
	.where("username","==",username)
	.get()
	.then(function (snapshot){
		if(!(snapshot.empty)){
			alert("That username is already taken :(")
			return
		}
		db.collection("users")
		.add({
			username: username,
			password: password,
			projects: [],
		})
		.then(function (snapshot){
			localStorage.setItem("userToken",snapshot.id)
			location = "hub.html"
		})
	})
}
function login(){
	var username = document.getElementById("username").value
	var password = CryptoJS.SHA256(document.getElementById("password").value).toString();
	db.collection("users")
	.where("username","==",username)
	.get()
	.then(function (snapshot){
		if(snapshot.empty){
			alert("That user doesn't exist!")
			return
		}
		localStorage.setItem("userToken",snapshot.docs[0].id)
		location = "hub.html"
	})
}
function hub(){
	db.collection("users")
	.doc(localStorage.getItem("userToken"))
	.get()
	.then(function (snapshot){
		var greetings = ["Howdy ","Welcome Back ","Hello ","Hi ","Greetings "]
		document.getElementById("showname").innerText = greetings[Math.round(Math.random()*(greetings.length-1))]+snapshot.data().username+"!"
	})
}
function profile(){
  var url = new URL(location.href);
  var username = url.searchParams.get("username");
  db.collection("users")
  .where("username","==",username)
  .get()
  .then(function (snapshot){
    if(snapshot.empty){
      location = "hub.html"
    }
    document.getElementById("showname").innerText = snapshot.docs[0].data().username;
    var projects = snapshot.docs[0].data().projects
    for(i=0;i<projects.length;i++){
      db.collection("projects")
      .doc(snapshot.docs[0].data().projects[i])
      .get()
      .then(function (snapshot){
        var div = document.createElement("div");
        div.style["width"] = "20%";
        div.style["padding"] = "2.5%";
        div.style["margin"] = "2.5%";
        div.style["height"] = "200px";
        div.style["border"] = "solid 1px black";
        div.style["border-radius"] = "15px";
        var h3 = document.createElement("h3");
        h3.innerText = snapshot.data().project
        var p = document.createElement("p")
	  		p.innerText = "Click Here to Go To Project"
  			var url = snapshot.data().url
			  p.style["cursor"] = "pointer";				
        p.setAttribute("onClick","goSomewhere(\""+url+"\")")
        div.appendChild(h3)
        div.appendChild(p)
        document.getElementById("everything").appendChild(div)
      })
    }
  })
}