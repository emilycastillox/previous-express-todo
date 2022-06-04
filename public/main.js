// var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("fa-trash");
var check = document.getElementsByClassName("fa-check");

Array.from(check).forEach(function(element) {
      element.addEventListener('click', function(e){
        e.preventDefault()
        const date = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        // msg is coming back undefined***
        console.log(msg)
        console.log(date)
        const complete = e.target.classList.contains('grey') ? true : false
      
        fetch('complete', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'date': date,
            'msg': msg,
            'completed': complete,
            // passing these keys names to the server
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
       });
});

// Array.from(thumbDown).forEach(function(element) {
//   // turn node list into array
//       element.addEventListener('click', function(){
//         //add event listener to each traschcan
        
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         //grab the name
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         // grab the message
//         const thumbDown = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//         fetch('messagesDown', {
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg,
//             'thumbUp':thumbDown
//             // calling on the same property with a different value
//           })
//         })
//         .then(response => {
//           if (response.ok) return response.json()
//         })
//         .then(data => {
//           console.log(data)
//           window.location.reload(true)
//         })
//       });
// });


Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(){
    const date = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    fetch('items', {
      // fetch the form name in the index.js
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'date': date,
        'msg': msg
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});