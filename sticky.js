/*Setup*/
var fixableClassName = 'fixable', //Choose a class name for targeted elements
checksPerSecond = 60,
snapDistance = 0; 

/*Caching*/
var d = document,
unattendedScroll = false,
resized = false,
elements = d.getElementsByClassName(fixableClassName),
checkingDelay = 1000/checksPerSecond;

/*Initialization*/
for (var i = 0; i < elements.length; i++) {
	elements[i].style.position = 'absolute';
}

/*Check elements.clientHeight < viewport height*/

/*Variables*/
/*Scroll Management*/
window.addEventListener("load", function() { fixableManager(); /* console.log('loaded'); */ } );
window.addEventListener("scroll", fixableManager);
window.addEventListener("resize", function() { resized = true; fixableManager(); resized = false; }); 

/*Position Management*/
/*setInterval(fixableManager, checkingDelay);*/

function fixableManager() {
	if (true /*unattendedScroll*/) {
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].clientHeight > d.documentElement.clientHeight) {
				positionManager(elements[i]);
			}
			else {
				elements[i].style.position = 'fixed';
				elements[i].style.top = 0;
			}
		}
		/*unattendedScroll = false;*/
	}
	else {
		return 0;
	}
}

function bottomAboveViewportBottom(el) {
/*	console.log('bottomAboveViewportBottom says: ', (el.offsetTop + el.clientHeight) <= (window.scrollY + document.documentElement.clientHeight), 'and position absolute is: ', el.style.position === 'absolute');
*/	return (el.offsetTop + el.clientHeight) < (window.scrollY + d.documentElement.clientHeight);
}

function topBelowViewportTop(el) {
/*	console.log('topBelowViewportTop says: ', el.offsetTop >= window.scrollY, 'and position absolute is: ', el.style.position === 'absolute');
*/	return el.offsetTop > window.scrollY;
}

function positionManager(el) {
	/* Caching */
	var scrollPosition = window.scrollY,
	viewPortHeight = d.documentElement.clientHeight,
	documentHeight = d.documentElement.offsetHeight,
	elementHeight = el.clientHeight,
	elementPosition = el.offsetTop,
	elementCSSPosition = el.style.position,
	scrollDir = scrollDirection();

	if ( (elementPosition >= scrollPosition - snapDistance) && (scrollDir === 'up') && (elementCSSPosition === 'absolute') && !(scrollPosition < 0)) {
		el.style.position = 'fixed';
		el.style.top = 0;

		/*console.log(el, 'fixedTop');*/
	}
	else if ( ( (elementPosition + elementHeight) <= (scrollPosition + viewPortHeight + snapDistance) ) && (scrollDir === 'down') && (elementCSSPosition === 'absolute') && !(scrollPosition + viewPortHeight > documentHeight)) {
		el.style.position = 'fixed';
		el.style.top = -(elementHeight - viewPortHeight) + 'px';

		/*console.log(el, 'fixedBottom');*/
	}
	else if ( elementCSSPosition === 'fixed' && (directionChanged || (scrollPosition + viewPortHeight >= documentHeight) || (scrollPosition <= 0) || resized)) {
		el.style.position = 'absolute';
		
		if ( el.style.top === '0px' || (scrollPosition <= 0)) {
			if ( scrollPosition <= 0) {
				el.style.top = 0;
			}
			else { 
				el.style.top = scrollPosition + 'px'; 
			}

			/*console.log(el, 'absolutedFromTop');*/
		}
		else {
			if ( scrollPosition + viewPortHeight >= documentHeight ) {
				el.style.top = documentHeight - elementHeight + 'px';
			}
			else {
				el.style.top = ((scrollPosition + viewPortHeight) - elementHeight) + 'px';
			}

			/*console.log(el, 'absolutedFromBottom');*/
		}

	}
	else {
		//Do nothing

		/*console.log(el, 'nothingDone');*/
	}
}

var previousPosition = window.scrollY,
previousDirection = 'down',
directionChanged = true;

function scrollDirection() {
	var currentPosition = window.scrollY,
	currentDir; 

	if ( currentPosition > previousPosition ) {
		currentDir = 'down';	
	}
	else if ( currentPosition < previousPosition ) {
		currentDir = 'up';
	}
	else {
		currentDir = previousDirection;
	}

	if (currentDir != previousDirection) {
		directionChanged = true;
	}
	else {
		directionChanged = false;
	}

	previousDirection = currentDir;
	previousPosition = currentPosition;
	return currentDir;

}
