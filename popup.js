document.getElementById('clickMe').addEventListener('click', () => {
  alert('You clicked the button!');
});

document.addEventListener("keydown", (e) => {
    document.querySelector("#key").innerHTML = "e.code = " + e.code + " and e.key = " + e.key
});

