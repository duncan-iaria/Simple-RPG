//================================
// MODAL - by duncan iaria
// this controls the modal window that appears
//================================

//================================
// START
//================================
//initialize the modal
// window.addEventListener( "load", function()
// {
// 	//pass in all the html elements (that need to be controlled/updated)
// 	modal.init
// 	(
// 		document.querySelector( "#modal-yes" ),
// 		document.querySelector( "#modal-no" ),
// 		document.querySelector( "#modal-bg-id" ),
// 		document.querySelector( "#modal-id" ),
// 		document.querySelector( "#modal-label" ),
// 		document.querySelector( "#modal-text" ),
// 		document.querySelector( "#modal-img" )
// 	);
// });

var modal = 
{
	//buttons
	rightButton: null,
	leftButton: null,

	//elements
	modalBg: null,
	modal: null,
	modalLabel: null,
	modalText: null,
	modalImg: null,

	//view
	modalView: 
	`<section id="modal-bg-id" class="modal-bg">
		<div id="modal-id" class="modal">
			<div class="modal-label-container">
				<h1 id="modal-label">Ready to Play?</h1>
				<hr/>
			</div>

			<div class="modal-img-container">
				<img id="modal-img" src="assets/images/0.jpg"/>
			</div>

			<div class="modal-text-container">
				<p id="modal-text">Press any key to guess a letter</p>
			</div>
			<button id="modal-no" class="modal-btn btn-no">Scared</button>
			<button id="modal-yes" class="modal-btn btn-yes">Ready</button>
		</div>
	</section>`,

	//methods
	init: function( tRightButton, tLeftButton, tModalBg, tModal, tModalLabel, tModalText, tModalImg )
	{
		//sav references to all the html element we'll be using
		this.rightButton = tRightButton;
		this.leftButton = tLeftButton;
		this.modalBg = tModalBg;
		this.modal = tModal;
		this.modalLabel = tModalLabel;
		this.modalText = tModalText;
		this.modalImg = tModalImg;

		//pack the events for rightButton in an array so it can be passed all at once in the function below
		//var rightButtonEvents = [ this.closeModal.bind( this, 750 ), /*add init game here */ ];

		//open the modatl
		//this.openModal( "Ready to Play?", "Press a button to guess a letter!", null, rightButtonEvents, null, 0 );
	},

	//opens the modal with the passed parameters
	openModal: function( tTarget, tLabelMessage, tMessage, tImage, tRightBtnActionsArr, tLeftBtnActionsArr, tTransitionTime )
	{
		//sets the transition to match the tTransitionTime parameter
		//this is essential so that the modal appears when the bg transition is over

		//a jquery thing - place it
		tTarget.prepend( this.modalView );

		//grab the elements
		this.init
		(
			document.querySelector( "#modal-yes" ),
			document.querySelector( "#modal-no" ),
			document.querySelector( "#modal-bg-id" ),
			document.querySelector( "#modal-id" ),
			document.querySelector( "#modal-label" ),
			document.querySelector( "#modal-text" ),
			document.querySelector( "#modal-img" ) 
		);


		this.modalBg.style.transition = `all ${tTransitionTime/1000}s`;
		this.modalBg.style.opacity = 1;

		//set modal label/text/img
		this.modalLabel.textContent = tLabelMessage;
		this.modalText.textContent = tMessage;

		//display image if it exists
		if( tImage != null )
		{
			this.modalImg.src = tImage;
			this.modalImg.style.display = "inline-block"; 
		}
		//do not display the image - as one is not assigned
		else
		{
			this.modalImg.style.display = "none";
		}

		//attach the events to the right button if there are events
		//otherwise, don't display the button at all
		if( tRightBtnActionsArr != null )
		{
			this.attatchEvents( this.rightButton, "click", tRightBtnActionsArr );
			this.rightButton.style.display = "inline-block";
		}
		else
		{
			this.rightButton.style.display = "none";
		}

		//attatch the events to the left button if there are events
		//otherwise, dont display the button at all
		if( tLeftBtnActionsArr != null )
		{
			this.attatchEvents( this.leftButton, "click", tLeftBtnActionsArr );
			this.leftButton.style.display = "inline-block";
		}
		else
		{
			this.leftButton.style.display = "none";
		}

		//turn the actual modal on after the transition time has concluded
		setTimeout( this.showModal.bind( this ), tTransitionTime );

		//debugger
	},

	//hook up an array of events to a target DOM element
	attatchEvents: function( tTarget, tEventType, tEventsArr )
	{
		if( tEventsArr != null )
		{
			//make sure it's not am empty array
			if( tEventsArr.length > 0 )
			{
				for( var i = tEventsArr.length; i >= 0; --i )
				{
					tTarget.addEventListener( tEventType, tEventsArr[i] );	
				}
			}
		}
	},

	//remove an event listener from an html element (for resetting purposess)
	detatchEvents: function( tTarget, tEventType, tEventListener )
	{
		if( tTarget != null )
		{
			tTarget.removeEventListener( tEventType, tEventListener );
		}
	},

	//turn the actual modal on (no the bg, but the modal itself)
	showModal: function()
	{
		this.modal.style.display = "block";
	},

	//close the modal (detach all event listeners, start bg transition)
	closeModal: function( tTransitionTime )
	{	
		//remove the event listeners (so new ones can be assigned)
		this.detatchEvents( this.leftButton, "click", this.closeModal );
		this.detatchEvents( this.rightButton, "click", this.closeModal );

		//this sets the css transition duration ( /1000 so convert from ms to secs )
		this.modalBg.style.transition = `all ${tTransitionTime / 1000}s`;

		//turn actual modal off
		this.modal.style.display = "none";

		//start background fadeout
		this.modalBg.style.opacity = 0;

		setTimeout( this.removeModal.bind(this), tTransitionTime );
	},

	removeModal: function()
	{
		$( '#modal-bg-id' ).remove();
	}
}