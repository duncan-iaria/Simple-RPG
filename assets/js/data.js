//================================
// DATA
//================================
//unit constructor
function Pawn( tId, tName, tHealth, tBaseAttackPower, tCounterAttackPower ) 
{
	//assigned by parameters passed in
    this.id = tId;
    this.name = tName;
    this.maxHealth = tHealth;
    this.baseAttackPower = tBaseAttackPower;
    this.counterAttackPower = tCounterAttackPower;

    //current attack power starts as the base
    this.currentAttackPower = this.baseAttackPower;
    this.currentHealth = this.maxHealth;

    this.view = 
	`<div id="pawn${this.id}" class="unit-container">
		<img class="unit-image" src="assets/images/${this.id}.jpg"/>
		<div class="unit-stats-container">
			<div id="health${this.id}" class="unit-health"><p>${this.currentHealth}</p></div>
		</div>
		<div class="unit-name">${this.name}</div>
	</div>`

    //actions
    this.spawn = function( tTarget )
    {
    	tTarget.append( this.view );

    	//add a data attribute to this pawns html
    	$( `#pawn${this.id}` ).attr( 'data-id', this.id );

        //make sure the attack power is the base value
        this.reset();
    },

    this.takeDamage = function( tAmt )
    {
        this.currentHealth -= tAmt;
        this.updateHealthView();
    },

    //for when the player attacks, increment the player's damage
    this.attack = function()
    {
        this.currentAttackPower += this.baseAttackPower;
    },

    //update the health value of this pawn
    this.updateHealthView = function()
    {
        $( `#health${this.id}` ).text( this.currentHealth.toString() );
    },

    //return to base attack power after round
    this.reset = function()
    {
        this.currentAttackPower = this.baseAttackPower;
        this.currentHealth = this.maxHealth;
    }
};

//holds all the data for the game
var data =
{
	pawns: [],

	jarJar: new Pawn( 0, "Jar Jar", 100, 20, 30 ),
	greedo: new Pawn( 1, "Greedo", 50, 10, 10 ),
	hanSolo: new Pawn( 2, "Han Solo", 75, 15, 15 ),
    maceWindu: new Pawn( 3, "Mace Windu", 120, 20, 5 ),

	init: function()
	{
		this.pawns = [ this.jarJar, this.greedo, this.hanSolo, this.maceWindu ];
	}
}

data.init();