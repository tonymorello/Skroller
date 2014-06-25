(function( $ ){
	
	$.fn.skroller = function(options) {
		
		this.each(function(e){
			skroller(this, options);
		});
		
		
		function skroller(element, options){
			
			var options			= options || {};
			
			var height			= options.height			|| 200;
			var maxHeight		= options.maxHeight			|| false;
			var barWidth		= options.barWidth			|| 10;
			var barColor		= options.barColor			|| '#2C96DE';
			var barOpacity		= options.barOpacity		|| 1;
			var barMinHeight	= options.barMinHeight		|| 20;
			var barHide			= options.barHide			|| false;
			var barHideDelay	= options.barHideDelay		|| 0.5; // in seconds
			var railOff			= options.railOff			|| false;
			var railHide		= options.railHide			|| barHide;
			var railColor		= options.railColor			|| barColor;
			var railOpacity		= options.railOpacity		|| barOpacity/5;
			var railPadding		= options.railPadding		|| barWidth+10;
			var style			= options.style				|| 'smooth'; // round, smooth, square, numeric value
			var frameClass		= options.frameClass		|| 'skroller';
			
			if(options.railPadding===0) railPadding = 0;
			
			var target		= $(element);
			var targetH 	= $(element).height();
			var targetW 	= $(element).width();
			var targetId	= $(element).attr('id') || randomId();
			var frameId		= 'sk_'+targetId;
			
			var frame,
				rail,
				scrollbar,
				bar_height,
				borderRadius,
				speed;
			
			
			
			// convert delay to milliseconds
			var delay = barHideDelay*1000;
			
			// determine if maxHeight option is set
			if(maxHeight){
				if(targetH<=maxHeight) height = targetH;
			}
			
			// Calculate how much of the target element will overflow
			var offset		= targetH - height;
			// Set the mouse state to 'up' for future use
			var mouse_state = 'up';
			
			var has_scrollbar = false;
			
			// determine scrollbar style
			switch(style) {
				case 'square':
					borderRadius = 0;
					break;
				case 'round':
					borderRadius = barWidth/2;
					break;
				case 'smooth':
					borderRadius = (barWidth/2)/2;
					break;
				default:
					borderRadius = style;
					break;
			}
			
			initialize();
			
			buildFrame();
			
			createStructure();
			
			detectContentChange();
			
			
			////////////////////////////////////////// FUNCTIONS
			
			
			// 0. CREATE STRUCTURE
			function createStructure(){
				// determine whether the content needs a scrollbar
				if(targetH>height){
					has_scrollbar = true;
					buildRail();
					buildScrollbar();
					calculateSpeed();
					scrollAction();
					scrollbarHideAnimation();
					enableMouseWheel();
					clickOnRail();
				}
			}
			
			
			// 1. INITIALIZE
			function initialize(){
				
				// format target element to fit the script requirements
				target.css({
					'position'	: 'absolute',
					'top'		: 0,
					'left'		: 0
				});
				
				target.css('width', '-='+railPadding)
				
			}
			
			// 2. FRAME
			function buildFrame(){
				
				// wrap target with scroller's frame and assign unique ID
				$(element).wrap('<div class="'+frameClass+'" id="'+frameId+'"></div>');
				// set shortcut handle to frame
				frame = $('#'+frameId);
				// style frame
				frame.css({
					'display'		: 'inline-block',
					'height' 		: height,
					'width'			: targetW,
					'overflow' 		: 'hidden',
					'position'		: 'relative'
				});
				
			}
			
			// 3. RAIL
			function buildRail(){
				// attach rail to frame
				frame.append('<div class="sk_rail"></div>');
				// set shortcut handle to rail
				rail = $('#'+frameId+' .sk_rail');
				// style rail
				
				railOpacity = (railOff==true) ? 0 : railOpacity;
				
				rail.css({
					'display'			: 'inline-block',
					'position'			: 'absolute',
					'top'				: 0,
					'right'				: 0,
					'bottom'			: 0,
					'width'				: barWidth,
					'background-color'	: railColor,
					'border-radius'		: borderRadius,
					'opacity'			: railOpacity
				});
				
			}
			
			// 4. SCROLL BAR
			function buildScrollbar(){
				
				// attach scrollbar to frame
				frame.append('<div class="scrollbar"></div>');
				// set shortcut handle to scroll bar
				scrollbar = $('#'+frameId+' .scrollbar');
				// calculate scrollbar height		
				bar_height = height - offset;
				// force minimum scroll bar height
				if(bar_height<=barMinHeight) bar_height = barMinHeight;
				// style scroll bar
				scrollbar.css({
					'display' 			: 'inline-block',
					'position' 			: 'absolute',
					'top'				: 0,
					'right'				: 0,
					'height'			: bar_height,
					'width'				: barWidth,
					'background-color'	: barColor,
					'border-radius'		: borderRadius,
					'opacity'			: barOpacity
					
				});
				
			}
			
			// 5. CALCULATE SPEED
			function calculateSpeed(){
				
				// adjust scrolling speed factor to match rail length
				speed = offset/(height-barMinHeight);
				// set minimum speed to 1
				if(speed<1) speed = 1;
				
			}
			
			function scrollAction(){
				
				// 6. CLICK ON THE SCROLLBAR
				// initiate 'mousedown' event
				scrollbar.on('mousedown', function(e){
					
					e.preventDefault();
					
					// determine pointer starting position
					var startY = e.pageY;
					// determine scroll bar starting position
					var barOffset = parseInt(scrollbar.css('top'));
					
					// 7. DRAG THE SCROLL BAR
					// initiate 'mousemove' event while 'mousedown' event is still on
					$(document).on('mousemove', function(e){
						
						// register mouse state
						mouse_state = 'down';
						
						// update pointer position
						var currentY = e.pageY + barOffset;
						// update scroll bar position
						var position = currentY - startY;
						// stop scroll bar at the end of the rail
						if(position >= (height-bar_height)) position = height-bar_height;
						// stop the scrollbar at the beginning of the rail
						if(position <= 0) position = 0;
						
						//if(position >= offset) position = offset; // might be not needed... lol... fried brain
						
						// determine target element absolute position
						var target_position = 0-(position*speed);
						
						// move scrollbar
						scrollbar.css('top', position);
						// move target
						target.css('top', target_position);
										
					});
					
					// 8. RELEASE MOUSE BUTTON
					// initiate 'mouseup' event
					$(document).on('mouseup', function(e){
						
						// register mouse state
						mouse_state = 'up'
						
						// set 'mousedown' event to off and terminate the drag action
						$(document).off('mousemove');
					});
					
				});
				
			}
			
			// 9. DETECT CONTENT CHANGE
			function detectContentChange(){
				
				frame.on('mousemove', function(e){
					// get current target element total height
					targetH = target.height();
					// get current offset value
					var checkOffset	= targetH - height;
					
					// evaluate if the content changed
					if(checkOffset != offset){
						
						if(has_scrollbar == false){
							createStructure();
						}
						
						//assign new value to offset
						offset = checkOffset;
						// calculate new scrollbar height
						bar_height = height - offset;
						// force minimum scroll bar height
						if(bar_height<=barMinHeight) bar_height = barMinHeight;
						// style scroll bar
						if(barHide)	scrollbar.css('height', bar_height);
						else scrollbar.animate({'height': bar_height}, 'fast');
						// adjust scrolling speed factor to match rail length to new offset
						speed = offset/(height-barMinHeight);
						// set minimum speed to 1
						if(speed<1) speed = 1;
						
					}
				});
				
			}
			
			// 10. SCROLLBAR HIDE ANIMATION
			function scrollbarHideAnimation(){
				
				if(barHide == true){
					scrollbar.hide();
					if(railHide) rail.hide();
					frame.on('mouseenter', function(e){
						on_frame = true;
						scrollbar.clearQueue();
						scrollbar.fadeIn('fast');
						if(railHide){
							rail.clearQueue();
							rail.fadeIn('fast');
						}
					});
					frame.on('mouseleave', function(e){
						on_frame = false;
						if(mouse_state=='up'){
							scrollbar.clearQueue();
							scrollbar.delay(delay).fadeOut('fast');
							if(railHide){
								rail.clearQueue();
								rail.delay(delay).fadeOut('fast');
							}
						}
					});
					$(document).on('mouseup', function(e){
						if(on_frame==false){
							scrollbar.clearQueue();
							scrollbar.delay(delay).fadeOut('fast');
							if(railHide){
								rail.clearQueue();
								rail.delay(delay).fadeOut('fast');
							}
						}
					});
				}
				
			}
			
			// 11. HANDLE MOUSE WHEEL SCROLL
			function enableMouseWheel(){
				
				element = document.getElementById(frameId);
				
				var minDeltaY;
				
				element.onwheel = function(e) {

					if (minDeltaY > Math.abs(e.deltaY) || !minDeltaY) {
						minDeltaY = Math.abs(e.deltaY);
					}
					
					var normalized = e.deltaY / minDeltaY;
					
					var currentTargetPosition = parseInt(target.css('top'));
					var calculateFuturePosition = currentTargetPosition - normalized;
					var maxNormalizedValue = offset + currentTargetPosition;
										
					if(normalized>maxNormalizedValue) normalized=maxNormalizedValue;
					if(normalized<currentTargetPosition) normalized=maxNormalizedValue;
					
					if(calculateFuturePosition<0-offset) normalized = 0;
					if(calculateFuturePosition>0) normalized = 0;
										
					target.css('top', '-='+normalized);
					var scrollbarNewPosition = (currentTargetPosition-currentTargetPosition-currentTargetPosition)/speed;
					
					scrollbar.css('top', scrollbarNewPosition);
					
					if(e.stopPropagation) e.stopPropagation();
					e.cancelBubble = true;
				
					if(e.preventDefault) e.preventDefault();
					e.returnValue = false;
				};
				
				element.onmousewheel = function(e) {
					if (!e) e = window.event;
					e.deltaY = -e.wheelDelta;
					element.onwheel(e);
				};
				
			}
			
			// 10. HANDLE CLICKS ON THE RAIL
			function clickOnRail(){
				
				rail.on('click', function(e){
					
					var railOffset = rail.offset();
					
					
					
					// update pointer position
					var currentY = e.pageY - railOffset.top;
					// update scroll bar position
					var position = currentY - (bar_height/2);
					// stop scroll bar at the end of the rail
					if(position >= (height-bar_height)) position = height-bar_height;
					// stop the scrollbar at the beginning of the rail
					if(position <= 0) position = 0;
					
					// determine target element absolute position
					var target_position = 0-(position*speed);
					
					// move scrollbar
					scrollbar.css('top', position);
					// move target
					target.css('top', target_position);
					
				});
				
			}
			
			
			
			
				
			
			
			
		}
		
		function randomId(){
			var text = '';
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			for( var i=0; i < 5; i++ )
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			return text;
		}
		
	}
	
})( jQuery );