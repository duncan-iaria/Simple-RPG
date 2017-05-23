//TODO: SPLICING THE ARRAYS IS MESSING UP THE IDs
//MAKE NEW ARRAY FOR GAME PLAY - BASE LOGIC OFF OF MASTER ARRAY
//start the game after everything on the page has loaded
$( window ).on( 'load', function()
{
	//setup game
	rpgGame.init();
	rpgGame.setViews( $( '#character-bank' ), $( '#current-player' ), $( '#current-enemy' ), $( '#enemy-bank' ), $( '#feedback-message' ) );

	//attatch the battle button
	$( '#attack-button' ).on( 'click', rpgGame.battle.bind( rpgGame ) );
});

//enums for keeping track of game state
var stateEnum =
{
	PLAYERSELECT: 1,
	OPPONENTSELECT: 2,
	BATTLE: 3,
};

var rpgGame =
{
	//game variables
	currentState: stateEnum.PLAYERSELECT,
	currentPlayer: null,
	currentOpponent: null,

	//view variables
	characterBankView: null,
	currentPlayerView: null,
	currentOpponentView: null,
	enemyBankView: null,
	feedbackMessageView: null,

	//game data
	currentPawns: null,

	init: function()
	{	
		//resets the game and views
		this.reset();

		var tempSpawnArea = $( '#character-bank' );
		//spawn each of the pawns (for selection purpose)
		$.each( data.pawns, function( tIndex, tValue )
		{	
			data.pawns[ tIndex ].spawn( tempSpawnArea );
		});

		//attach events
		$( '.unit-container' ).on( 'click', function()
		{
			rpgGame.onPawnClicked( this );
		});

		//get a copy of the base game pawns (so that this list can be managed and checked separetly)
		this.currentPawns = data.pawns.slice( 0 );
	},

	//reset all gamne variables back to their starting values
	reset: function()
	{
		this.currentState = stateEnum.PLAYERSELECT;
		this.currentPlayer = null;
		this.currentOpponent = null;
	
		if( this.currenPawns != null && this.currentPawns.length > 0 )
		{
			this.currentPawns.length = 0;
		}
	},

	setViews: function( tCharacterBankView, tCurrentPlayerView, tCurrentOpponentView, tEnemyBankView, tFeedbackMessageView )
	{
		this.characterBankView = tCharacterBankView;
		this.currentPlayerView = tCurrentPlayerView;
		this.currentOpponentView = tCurrentOpponentView;
		this.enemyBankView = tEnemyBankView;
		this.feedbackMessageView = tFeedbackMessageView;
	},

	onPawnClicked: function( tPawn )
	{
		switch( this.currentState )
		{
			case stateEnum.PLAYERSELECT:
				this.setCurrentPlayer( tPawn );
				break;

			case stateEnum.OPPONENTSELECT:
				this.setCurrentOpponent( tPawn );
				break;

			default:
				break;
		}
	},

	setCurrentPlayer: function( tPawn )
	{
		//set the game's current player to the one from the data
		var tempDataIndex = parseInt( $( tPawn ).attr( "data-id" ), 10 );

		this.currentPlayer = data.pawns[ tempDataIndex ];
		this.currentState = stateEnum.OPPONENTSELECT;

		//move all the pawns to the appropriate places
		this.enemyBankView.append( $( '.unit-container' ) );

		//move the selected one back (TODO: refactor this out?) 
		this.currentPlayerView.append( $( `#pawn${tempDataIndex}` ) );

		this.removeCharacterFromPawnList( this.currentPlayer );

		this.feedbackMessageView.html(  '<h1>Select Your Opponent</h1>' );
	},

	setCurrentOpponent: function( tPawn )
	{
		//this data index is from the base data - so it should link with the master list (not the current list)
		//because the current list indexes will shift as they get removed

		var tempDataIndex = parseInt( $( tPawn ).attr( "data-id" ), 10 );


		//if it's the same pawn as the player, don't allow it to be moved
		if( tempDataIndex == this.currentPlayer.id )
		{
			return;
		}

		this.currentOpponent = data.pawns[ tempDataIndex ];

		this.currentState = stateEnum.BATTLE;

		//move the selected enemy into the battle zone
		this.currentOpponentView.append( $( `#pawn${tempDataIndex}` ) );

		this.feedbackMessageView.html(  '<h1>ATTACK!</h1>' );
	},

	// BATTLE
	battle: function()
	{
		//if we're in battle mode - then fight!
		if( this.currentState == stateEnum.BATTLE && this.currentPlayer != undefined && this.currentOpponent != undefined )
		{
			//damage the opponent
			this.currentOpponent.takeDamage( this.currentPlayer.currentAttackPower );

			//show attack message
			this.feedbackMessageView.prepend( `<h1>${this.currentPlayer.name} did ${this.currentPlayer.currentAttackPower} damage to ${this.currentOpponent.name}!</h1>` ); 

			//increment player power
			this.currentPlayer.attack();

			//enemy is still alive
			if( this.currentOpponent.currentHealth > 0 )
			{
				this.currentPlayer.takeDamage( this.currentOpponent.counterAttackPower );

				this.feedbackMessageView.prepend( `<h1>${this.currentOpponent.name} countered for ${this.currentOpponent.counterAttackPower} damage to ${this.currentPlayer.name}!</h1>` ); 
				//if the current player's health is less than or 0, you lost ( and he died )
				if( this.currentPlayer.currentHealth <= 0 )
				{
					this.feedbackMessageView.prepend( `<h1>${this.currentPlayer.name} is now dead!` ); 
					this.onLose();
				}
			}
			//enemy is dead
			else
			{
				//remove the current enemy and set game back to enemy select
				this.currentOpponentView.empty();

				//remove the current pawn from the pawn list
				this.removeCharacterFromPawnList( this.currentOpponent );

				//if there are still pawns in the current pawn list, select a new opponent
				if( this.currentPawns.length > 0 )
				{
					this.currentState = stateEnum.OPPONENTSELECT;
				}
				else
				{
					this.onWin();
				}
			}
		}
	},

	removeCharacterFromPawnList: function( tPawn )
	{
		var tempIndex = this.currentPawns.indexOf( tPawn );

		if( tempIndex > - 1 )
		{
			this.currentPawns.splice( tempIndex, 1 );
		}
	},

	onWin: function()
	{
		var rightBtnActions = [ this.init.bind( this ), modal.closeModal.bind( modal, 1000 ) ];

		modal.openModal( $('body') , "YON WON!", "The Force is strong with you.", null, rightBtnActions, null, 0 );

		this.clearPawns();
	},

	onLose: function()
	{
		var rightBtnActions = [ this.init.bind( this ), modal.closeModal.bind( modal, 1000 ) ];

		modal.openModal( $('body') , "YON LOST!", "Mesa love Jar Jar Binks!", null, rightBtnActions, null, 0 );
		
		this.clearPawns();
	},

	//remove all the characters from the board
	clearPawns: function()
	{
		this.characterBankView.empty();
		this.currentPlayerView.empty();
		this.currentOpponentView.empty();
		this.enemyBankView.empty();
		this.feedbackMessageView.empty();
	},
};