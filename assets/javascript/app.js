$(document).ready(function(){
  
  // event listeners
  $("#remaining-time").hide();
  $("#start").on('click', trivia.startGame);
  $(document).on('click' , '.option', trivia.guessChecker);
  
})
// instead of having a var for the variables and questions I found an easier way to put them all under the var trivia
var trivia = {
  
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  currentSet: 0,
  timer: 20,
  timerOn: false,
  timerId : '',
  // questions options and answers data
  questions: {
    q1: 'Who is Jon Snow',
    q2: 'Who kills Danerys?',
    q3: 'How does Ned die?',
    q4: 'Who betrays Rob Stark?',
    q5: "What is the Lanisters famous saying?",
    q6: 'Who sits on the Iron Throne in the end?',
    q7: "What is the Targaryens motto?"
  },
  options: {
    q1: ['A Tyrell', 'King of the South', 'No one', 'A bastard'],
    q2: ['Sansa', 'Eddard', 'Jon Snow', 'Tyrion'],
    q3: ['Leg cut off', 'Cut wound', 'Beheading', 'Stab wound'],
    q4: ['Edmure Tully', 'Sansa Stark', 'Tyrion Lanister', 'Walder Frey'],
    q5: ['Ours is the Fury','A Lanister always pays his debts','A Lanister always succeeds','A Lanister always wins'],
    q6: ['Tyrion','Jon Snow','Bran','Rickon'],
    q7: ['This is the way', 'Fire and blood', 'Blood before the dawn','Ice and Fire']
  },
  answers: {
    q1: 'A bastard',
    q2: 'Jon Snow',
    q3: 'Beheading',
    q4: 'Walder Frey',
    q5: 'A Lanister always pays his debts',
    q6: 'Bran',
    q7: 'Fire and blood'
  },
  // trivia functions
  //start game fucntions
  startGame: function(){
    // restarting game to base 0 
    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    //clears the trivia timer
    clearInterval(trivia.timerId);
    
    //shows the game along with the features of the game
    $('#game').show();
    
    //shows the results of the questions
    $('#results').html('');
    
    //shows the current timer in real time
    $('#timer').text(trivia.timer);
    
    //removes the begin button once the game starts
    $('#start').hide();
    //shows the remaing time left for the question
    $('#remaining-time').show();
    
    //asks the first question in the array
    trivia.nextQuestion();
    
  },
  // method to loop through the array and asks the following questions
  nextQuestion : function(){
    
    // sets the timer to 10 seconds for each question
    trivia.timer = 10;
    //removes the seconds left using the removeClass method
     $('#timer').removeClass('last-seconds');
     //dispalyes the time left 
    $('#timer').text(trivia.timer);
    
    //prevents the timer from speeding up
    if(!trivia.timerOn){
      //stating that the timer runs for 10 seconds
      trivia.timerId = setInterval(trivia.timerRunning, 1000);
    }
    
    //gets all the questions then indexes the current questions
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $('#question').text(questionContent);
    
    //function to shows the user the array of current options for the question
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];
    
    //shows all the options on the html page
    $.each(questionOptions, function(index, key){
      //appends the options to the button class on the html
      $('#options').append($('<button class="option btn btn-secondary btn-lg">'+key+'</button>'));
    })
    
  },
  // method to decrement counter and count unanswered if timer runs out
  timerRunning : function(){
    // if timer still has time left and there are still questions left to ask
    if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
      $('#timer').text(trivia.timer);
      trivia.timer--;
        if(trivia.timer === 4){
          $('#timer').addClass('last-seconds');
        }
    }
    //if the time available runs out then run this logic
    else if(trivia.timer === -1){
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3> You are too slow... '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
    }
    //once all the questions have been answered then show the results for the game
    else if(trivia.currentSet === Object.keys(trivia.questions).length){
      
      // adds results of game (correct, incorrect, unanswered) to the page
      $('#results')
        .html('<h3>Winter has come!</h3>'+
        '<p>Correct: '+ trivia.correct +'</p>'+
        '<p>Incorrect: '+ trivia.incorrect +'</p>'+
        '<p>Unaswered: '+ trivia.unanswered +'</p>'+
        '<p>Winter is coming, and the dead come with it...</p>');
      
      //once the game is over it hides the actual game
      $('#game').hide();
      
      // has the begin button at the bottom to start over
      $('#start').show();
    }
    
  },
  //method to evaluate the option clicked in gen to result
  guessChecker : function() {
    
    //timer ID for gameResult setTimeout
    var resultId;
    
    //the answer to the current question being asked
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
    
    //if the text of the option picked matches the answer of the current question, show correct
    if($(this).text() === currentAnswer){
      //turn button green for correct
      $(this).addClass('btn-success').removeClass('btn-info');
      
      trivia.correct++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>So far so good..</h3>');
    }
    // else the user picked the wrong option, show incorrect
    else{
      // turn button clicked red for incorrect
      $(this).addClass('btn-danger').removeClass('btn-info');
      
      trivia.incorrect++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Are you dumb? '+ currentAnswer +'</h3>');
    }
    
  },
  // method to remove previous question results and options
  guessResult : function(){
    
    //go on to the next question in array
    trivia.currentSet++;
    
    //remove the options and results
    $('.option').remove();
    $('#results h3').remove();
    
    //begin next question
    trivia.nextQuestion();
     
  }

}