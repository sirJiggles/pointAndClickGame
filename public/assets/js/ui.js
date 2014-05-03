/* UI javascript, will sort out later most of this is prototype stuff */



$(window).ready(function(){

	$('.inventory-toggle').click(function(evt){
		evt.preventDefault();
		$('.inventory').toggleClass('open');
		$(this).toggleClass('down');
	});

	var dragSrc = '';

	// draggable tests
	var invItems = document.querySelectorAll('.inventory li a');
	// attach events for draggables
	[].forEach.call(invItems, function(item) {
	  	item.addEventListener('dragstart', Drag.dragStart, false);
		item.addEventListener('dragover', Drag.dragOver, false);
		item.addEventListener('drop', Drag.drop, false);
	});

	//set up the click listener (point & click)
	$('#game-inner').click(function(evt){

		// get the location of the click
		var offset = $(this).offset(); 
		var newX = evt.pageX - offset.left,
			newY = evt.pageY - offset.top;
		// set the current active char to have a new target and be moving toward it
		core.currentChar.target = new core.Vector2D(newX, newY);
		core.currentChar.originalTarget = new core.Vector2D(newX, newY);
		core.currentChar.moving = true;
		core.currentChar.newTarget = true;

	});
	

});

// interface for dragging
var Drag = {

	dragStart: function(evt){
		evt.dataTransfer.effectAllowed = 'move';
  		evt.dataTransfer.setData('text/plain', this.text);
  		dragSrc = this;
	},
	dragEnd: function(){

	},
	dragOver: function(evt){
		// allows us to drop
		if(evt.preventDefault){
			evt.preventDefault();
		}
		evt.dataTransfer.dropEffect = 'move';
	},
	drop: function(evt){
		if(evt.preventDefault){
			evt.preventDefault();
		}

		// used for combining inv items
		if (dragSrc != this) {
			var data = evt.dataTransfer.getData('text/plain');

			// can combine loop with wire
			if( this.text == 'Loop' && data == 'Wire'){
				$(dragSrc).html('');
				$(this).html('');
				$(this).addClass('icon-key');
			}
	  	}
	  	return false;
  	}
}



