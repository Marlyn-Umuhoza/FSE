function generateProfileAvatar(name, id) {
  var colours = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];

  //enable these lines to split by initials of (F)irst name and (L)ast name
  // var nameSplit = name.split(" "),
  //   initials = nameSplit[0].charAt(0).toUpperCase() + nameSplit[1].charAt(0).toUpperCase();
  if (name != `null`){
    var initials = name[0].charAt(0).toUpperCase() + name[1].charAt(0).toUpperCase();
  }
  

  //Enable this line to get Full names
  //var initials = name;

  //Random color selection at runtime
  var charIndex = initials.charCodeAt(0) - 65,
    colourIndex = charIndex % 19;

  //decides where to draw the circle by the location of the passed in css id tag
  var canvas = document.getElementById(id);
  var context = canvas.getContext("2d");

  //draw operations
  context.fillStyle = colours[colourIndex];
  context.fillRect(0, 0, 40, 40);
  context.font = "15px Arial";
  context.textAlign = "center";
  context.fillStyle = "#FFF";
  context.fillText(initials, 40 / 2, 40 / 1.5);

}