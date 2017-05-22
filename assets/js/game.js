//TODO: SPLICING THE ARRAYS IS MESSING UP THE IDs
//MAKE NEW ARRAY FOR GAME PLAY - BASE LOGIC OFF OF MASTER ARRAY
//start the game after everything on the page has loaded
$( window ).on( 'load', function()
{
	//setup game
	rpgGame.init( data );
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

	init: function( tData )
	{	
		//save a reference to the character bank for spawn purposes
		tempSpawnArea = $( "#character-bank" );

		//spawn each of the pawns (for selection purpose)
		$.each( tData.pawns, function( tIndex, tValue )
		{	
			tData.pawns[ tIndex ].spawn( tempSpawnArea );
		});

		//attach events
		$( '.unit-container' ).on( 'click', function()
		{
			rpgGame.onPawnClicked( this );
		});
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
		this.currentPlayer = data.pawns[ $( tPawn ).attr( "data-id" ) ];
		this.currentState = stateEnum.OPPONENTSELECT;

		//move all the pawns to the appropriate places
		this.enemyBankView.append( $( '.unit-container' ) );

		//move the selected one back (TODO: refactor this out?) 
		this.currentPlayerView.append( $( `#pawn${this.currentPlayer.id}` ) );

		this.removeCharacterFromPawnList( this.currentPlayer );
	},

	setCurrentOpponent: function( tPawn )
	{
		this.currentOpponent = data.pawns[ $(tPawn).attr( "data-id" ) ];
		this.currentState = stateEnum.BATTLE;

		//move the selected enemy into the battle zone
		this.currentOpponentView.append( $( `#pawn${this.currentOpponent.id}` ) );
	},

	// BATTLE
	battle: function()
	{
		//if we're in battle mode - then fight!
		console.log( this.currentState );

		if( this.currentState == stateEnum.BATTLE )
		{
			console.log( "we battlin now" );
			this.currentOpponent.takeDamage( this.currentPlayer.currentAttackPower );

			//enemy is still alive
			if( this.currentOpponent.health > 0 )
			{
				this.currentPlayer.takeDamage( this.currentOpponent.counterAttackPower );

			}
			//enemy is dead
			else
			{
				//remove the current enemy and set game back to enemy select
				this.currentOpponentView.empty();
				removeCharacterFromPawnList( this.currentOpponent );

				//remove the pawn from the game list
				//this.currentState = O
			}
		}

		console.log( "battle!" );
	},

	removeCharacterFromPawnList: function( tPawn )
	{
		var tempIndex = data.pawns.indexOf( tPawn );

		if( tempIndex > - 1 )
		{
			data.pawns.splice( tempIndex, 1 );
			console.log( data.pawns );
		}
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