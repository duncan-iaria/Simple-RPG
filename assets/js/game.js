//TODO: SPLICING THE ARRAYS IS MESSING UP THE IDs
//MAKE NEW ARRAY FOR GAME PLAY - BASE LOGIC OFF OF MASTER ARRAY
//start the game after everything on the page has loaded
$( window ).on( 'load', function()
{
	//setup game
	rpgGame.init();
	rpgGame.setViews( $( '#character-bank' ), $( '#current-player' ), $( '#current-enemy' ), $( '#enemy-bank' ) );

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

	//game data
	currentPawns: null,

	init: function()
	{	
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

	setViews: function( tCharacterBankView, tCurrentPlayerView, tCurrentOpponentView, tEnemyBankView )
	{
		this.characterBankView = tCharacterBankView;
		this.currentPlayerView = tCurrentPlayerView;
		this.currentOpponentView = tCurrentOpponentView;
		this.enemyBankView = tEnemyBankView;
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

		console.log( tempDataIndex );

		this.currentPlayer = data.pawns[ tempDataIndex ];
		this.currentState = stateEnum.OPPONENTSELECT;

		//move all the pawns to the appropriate places
		this.enemyBankView.append( $( '.unit-container' ) );

		//move the selected one back (TODO: refactor this out?) 
		this.currentPlayerView.append( $( `#pawn${tempDataIndex}` ) );

		this.removeCharacterFromPawnList( this.currentPlayer );
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
	},

	// BATTLE
	battle: function()
	{
		//if we're in battle mode - then fight!
		if( this.currentState == stateEnum.BATTLE && this.currentPlayer != undefined && this.currentOpponent != undefined )
		{
			this.currentOpponent.takeDamage( this.currentPlayer.currentAttackPower );
			this.currentPlayer.attack()

			//enemy is still alive
			if( this.currentOpponent.health > 0 )
			{
				this.currentPlayer.takeDamage( this.currentOpponent.counterAttackPower );

				//if the current player's health is less than or 0, you lost ( and he died )
				if( this.currentPlayer.health <= 0 )
				{
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
		alert( "you win!" );
		this.clearPawns();
		this.init();
	},

	onLose: function()
	{
		alert( "you lose!" );
		this.clearPawns();
		this.init();
	},

	//remove all the characters from the board
	clearPawns: function()
	{
		this.characterBankView.empty();
		this.currentPlayerView.empty();
		this.currentOpponentView.empty();
		this.enemyBankView.empty();
	},
};