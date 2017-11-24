"use strict";	
	let count = 1;
	let values = [];
	let arr = [];
	let turn;
	let i = 0;
	let j;
	let attr;
	let strictMode;
	let start;
	let end;
	let timerId;
	let t;	

	function randomInteger(min, max){
	  return Math.floor(min + Math.random() * (max + 1 - min));
	}

	function doTurn() {
		$(".count").text(count);
		for(j = 0; j < count; j++) {
			let rnd = randomInteger(1,4);
			arr.push(rnd);

			$(".sector").each(function() {
				if($(this).attr("data-id") == rnd) {
					let thatSector = $(this);
					if(j == 0) {
						start = 500;
						end = 800;
					} else {
						start = end + 500;
						end = start + 300;
					}					
					setTimeout(function() {						
						thatSector.addClass("shadowSector");
						$("#audioEl1").get(0).play();
					}, start);				
					setTimeout(function() {
						thatSector.removeClass("shadowSector");						
						turn = j == count ? true : false;
					}, end);
					return false;
				}
			});
		}		
		return arr;
	}

	function timer() {
		if(t > 0) {
			t-=1;
			$(".timer").text(t);			
		} else {
			return true;
		}		
		setTimeout(timer(), 1000);
	}

	$(".start").on("click", function() {
		let thatStart = $(this);
		//fake pressing the button
		thatStart.removeClass("shadowButton");
		setTimeout(function() {
			thatStart.addClass("shadowButton");
		}, 200);		
		//change the label and start the game
		if($(".startLabel").text() == "reset") {
			$(".startLabel").text("start");
			$(".count").text("--");
			clearTimeout(timerId);
			count = 1;
			turn = false;
			arr = [];
		} else {
			$(".startLabel").text("reset");
			timerId = setTimeout(function() {
				values = doTurn();
			}, 1000);
						
		}				 
	});

	$(".sector").on("click", function(event) {						
		if(turn) {
			event.target.classList.add("shadowSector");			
			setTimeout(function() {
				event.target.classList.remove("shadowSector");
			},200);		
			if(i < count) {
				attr = event.target.getAttribute("data-id");
				if(values[i] == attr) {
					$("#audioEl2").get(0).play();
					i+=1;
					if(i == count) {
						i = 0;
						turn = false;
						count++;
						arr = [];
						values = doTurn();
					}					
				} else {
					$("#error").get(0).play();
					setTimeout(function() {
						$("#error").get(0).pause();
						$("#error").get(0).currentTime = 0;
					},1000);
					$(".count").text("!!!");
					i = 0;
					turn = false;
					arr = [];
					if(strictMode) {						
						count = 1;
					}
					setTimeout(function() {
						values = doTurn();
					}, 1000);
					
				}				
			} else if(count == 20) {
				$(".win").show();
			}						
		}
	});

	$(".mode").on("click", function() {
		let thatMode = $(this);
		thatMode.removeClass("shadowButton");
		setTimeout(function() {
			thatMode.addClass("shadowButton");
		}, 200);
		$(".light").toggleClass("active");
		strictMode = $(".light").hasClass("active")? true : false;		
	});
