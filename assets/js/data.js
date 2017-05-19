//================================
// DATA
//================================
//unit constructor
function Pawn( tId, tName, tHealth, tBaseAttackPower, tCounterAttackPower ) 
{
	//assigned by parameters passed in
    this.id = tId;
    this.name = tName;
    this.health = tHealth;
    this.baseAttackPower = tBaseAttackPower;
    this.counterAttackPower = tCounterAttackPower;

    //current attack power starts as the base
    this.currentAttackPower = this.baseAttackPower;
}

//holds all the data for the game
var data =
{
	pawns: [],

	jarJar: new Pawn( 0, "Jar Jar", 100, 20, 50 ),
	greedo: new Pawn( 1, "Greedo", 50, 10, 10 ),
	hanSolo: new Pawn( 2, "Han Solo", 75, 15, 15),

	init: function()
	{
		this.pawns = [ this.jarJar, this.greedo, this.hanSolo ];
	}
}