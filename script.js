window.addEventListener('DOMContentLoaded', (event) => {
  var questionElement = document.getElementById("question");
  var optionsElement = document.getElementById("options");
  var countdownElement = document.getElementById("countdown");
  
  // Timer countdown logic
  var timeleft = 10;
  var countdown = setInterval(function(){
    timeleft--;
    countdownElement.innerText = timeleft;
    
    if(timeleft <= 0) {
      clearInterval(countdown);
      skipToNextQuestion();
    }
  }, 1000);

  function skipToNextQuestion() {
    // Display notification
    var notification = document.getElementById("notification");
    if (notification) {
      notification.style.display = "block";
      
      // Hide notification after 5 seconds
      setTimeout(function() {
        notification.style.display = "none";
      }, 5000);
    }
    
    // Fetch next question data from the server
    try {
      fetch("https://edusen-1.melon234.repl.co/question", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: 'value' }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Response:', data.response);
        data = data.response
        questionElement.innerHTML = "<strong>Question " + data.id + ":</strong> " + data.qn;
        
        // Update options
        var optionsHtml = "";
        for (var i = 0; i < data.options.length; i++) {
          optionsHtml += "<div class='option'>" +
                          "<input type='radio' name='option' id='option" + (i + 1) + "'>" +
                          "<label for='option" + (i + 1) + "'>" + data.options[i] + "</label>" +
                        "</div>";
        }
        optionsElement.innerHTML = optionsHtml;
        
        countdownElement.innerText = "10";
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
          radio.checked = false;
        });
      })
      .catch(error => {
        console.error("Error fetching question:", error);
      });
    }catch(err) {
      console.log(err)
    }
    
  }
});
