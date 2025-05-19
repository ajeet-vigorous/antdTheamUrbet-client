let xcards = null;
let opencards = 0;
let cardmarkup = `<div class="gamecards">`;
let resetGameInterval = null;
let xwinner = null;
$(document).ready(function(){


	// Pickup Coins
	$(".coin").click(function(){
 	   $('.coin').removeClass('active active-chip');
		$(this).addClass('active active-chip');
		if ($('.check-display').is(":visible")) {
		  playSound('click');
		}
	});
	
	// Place the coin on number
	$(".num").click(function(e){
 	  if (e.originalEvent) {
	  	if( !$('.coin').hasClass('active') )
	  	{
	  		flashalert( "Please select a chip" ,'error')
	  		return;
	  	}
   	    createBetSlip($(this).parents('.number'));
 	  }
	});
    fetchUserCoins();

})

function createBetSlip(runner) {
   if(!disabled(runner)) {
    $.ajax({
      url : "/api-v1/vud7/" + $('#game').data('id') + "/place_bet",
      type : "POST",
      dataType: 'json',
      data : {
        runner: runner.data('runner'),
        stake: $(".coin.active").data('value'),
      },
      success: function(data) {
      	if( data.status == false )
      	{
      		flashalert( data.message,'error');
      		return;
      	}
		flashalert( "Bet Placed",'success');

        $('.available_coins').html(data.bet_slip.user.available_coins)
        var coin_placed = runner.data('coin-placed');
        coin_placed += $(".coin.active").data('value');
        runner.data('coin-placed', coin_placed);
        runner.find('.coin-placed').html(coin_placed);
        $('.total_liability').html(data.bet_slip.user.total_liability);
         
      },
      error: function(response) {
      	if(response.status == 401)
      		window.location.href = "/login.html";
      		
        flashalert(response.responseJSON.error,'error');
      }
    });
  } else {
    flashalert('Bets are Closed','error')
  }
};

function disabled(elelment) {
  return elelment.hasClass('request-disabled') || elelment.hasClass('disabled')
}


function flashalert(message,type) {
	if(type == 'success')
		toastr.success(message)
	else
		toastr.error(message)
  //$(".flash-box").removeClass('hide');
  //$(".msg").text(message);
  //setTimeout(function() {
  //  $(".flash-box").addClass('hide');
  //}, 3000);
}


function fetchUserMatchDetails(match_id) {
  effective_match_id = match_id || $('#game').data('id')
  if(effective_match_id) {
    $.ajax({
      url : "/api-v1/vud7/"+effective_match_id+"/match_detail" ,
      global: false,
      type : "GET",
      dataType: 'json',
      success: function(data) {
          $('.available_coins').html(data.user.available_coins)
         $('.total_liability').html(data.user.total_liability);

        if (match_id != null){
          $.each(data.runners, function(index, stat){
            runner = $('.runner_' + stat.runner)
            runner.data('coin-placed', stat.coins)
            runner.find('.coin-placed').html(stat.coins)
          })
        }
      },
      error: function(response) {
      	if(response.status == 401)
      		window.location.href = "/login.html";
      		
        flashalert(response.responseJSON.error,'error');
      }
    });
  }
}

function fetchUserCoins() {
  $.ajax({
    url : "/api-v1/verify",
    type : "GET",
    dataType: 'json',
    global: false,
    success: function(data){
      $('.available_coins').html(data.chips)
      $.get('/api-v1/vud7/last_winners',function(data){
  	        showLastWinners(data);
      })
    },
    error: function(response) {
    	if(response.status == 401)
      		window.location.href = "/login.html";
    	flashalert(response.responseJSON.error,'error');
    }
  });
}

 

function addcards() {
	console.log("xcards",xcards)
	resetGameInterval = setInterval(function(){
	   if(opencards == 0)
		$("#hand").append(getrandomcard(xwinner,60));
	   
	  
	   if(opencards == 1){
	   	   $('.bet_status').text(`Winner (${xwinner})`);
	       setTimeout(function(){
	       	  $("div.gamecards").remove();
			   xcards = null;
			   xwinner = null;
	           clearInterval(resetGameInterval)
			   opencards = 0;
	       },7500)
	      
	   }
       opencards++;
	},1500)
}


function processSingleDigitGame(obj) {
	
 
   disableBetting();
  fetchUserMatchDetails(null);
  $('#game').data('new_id', obj.new_game_id);
  $('#game').data('last_n_winners', obj.last_n_winners);
   
  xcards = obj.cards;
  xwinner = obj.winner_place;
  addcards();
  //audio.play();
  // if ($('.check-display').is(":visible")) {
  //   playSound('takeCardsOutPackage1');
  // }
}


function updateBettingPanel(obj) {
  if (!$('#game').data('id') && obj.match_id ) {
    fetchUserMatchDetails(obj.match_id);
  }
  $('#game').data('id', obj.match_id);
    $('.match_id').html('#'+obj.match_id);
  if (obj.bet_open) {
    enableBetting()
  } else {
    disableBetting();
    $('.game-history-button').addClass('disabled');
    // document.getElementById('open-Modal').style.pointerEvents = 'none';
  }
  $('#countdown').find('span').html(obj.counter);
}

function enableBetting() {
  enableBettingPanel()
  $('.bet_status').text('Bet Open');
  $('#countdown').removeClass('flash-color');
  $('.number-btn').addClass('number')
  $('.suspended').css('display','none')

  $('.game-history-button').removeClass('disabled');
  //document.getElementById('open-Modal').style.pointerEvents = 'auto';
}

function enableBettingPanel() {
  $('.number, .coin').removeClass('disabled')
}


function disableBetting() {
  
  
  if(xwinner == null)
	$('.bet_status').html('Bet Closed')
	
	
  $('#countdown').addClass('flash-color')
  
  $('.number-btn').removeClass('number')
  $('.suspended').css('display','flex')
  disableBettingPanel()
}

function disableBettingPanel() {
  $('.number, .coin').addClass('disabled')
}

function disableBettingOnPageLoading() {
  if(!$('#game').data('id')){
    disableBetting();
  }
}

function showLastWinners( winners )
{
	if(winners == undefined || winners.length == 0)
		return;
	let html = '';
	winners.map((item,index) => {
		html += `<div class="last-number-btn ${item}">
	    	    	<span class="last-number-btn-txt match_winnings">${item}</span>
		    	</div>`
	})
	$('#lastwinner').html(html);
}



 
function getrandomcard(opencards,pos) {
	 let markup = cardmarkup;
	 markup += `<img class="card card-img" style="left: ${pos}px;" src="https://urbet.in/assets/images/cards/${opencards}.png" /></div>`;
	 return markup;
}


