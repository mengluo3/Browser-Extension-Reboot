  console.log("1");
  var onOff = document.getElementById("onOff");
  onOff.addEventListener('change', function() {
      if(this.checked) {
       // Keep the sticky note rendered
       console.log("2");
       fromPopup();
      } else {
        // Prevent the sticky note from being rendered.
      }
  });


  function clearStorage(){
    localStorage.clear();
  }