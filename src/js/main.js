
	this.__GAME_WIDTH = (window.innerWidth);
	this.__GAME_HEIGHT = (window.innerHeight);
	this.__PHASER_TYPE = (Phaser.AUTO);
	this.__PHASER_PARENT = ('game');
	this.__PHASER_SCALE_MODE = (Phaser.Scale.RESIZE);
	this.__PHASER_SCALE_AUTOCENTER = (Phaser.Scale.CENTER_BOTH);
	this.__physicsType = ('arcade');
	this.__gravity = 500;
	this.__movementSpeed = 400;
	this.__jumpHeight = 550;

	this.preload = function(){
		// Image layers from Tiled can't be exported to Phaser 3 (as yet)
		// So we add the background image separately
		this.load.image('background', 'assets/images/background.png');

		// Load the tileset image file, needed for the map to know what
		// tiles to draw on the screen
		this.load.image('tiles', 'assets/tilesets/platformPack_tilesheet.png');

		// Load the export Tiled JSON
		this.load.tilemapTiledJSON('map', 'assets/tilemaps/level1.json');
	}

	this.create = function(){
		// Enable user input via cursor keys
		this.cursors = this.input.keyboard.createCursorKeys();

		// Create a tile map, which is used to bring our level in Tiled
		// to our game world in Phaser
		const map = this.make.tilemap({
			key: 'map',
		});

		// Set `level` as `map` for later use
		level = map;

		// Add the tileset to the map so the images would load correctly in Phaser
		const tileset = map.addTilesetImage('kenney_simple_platformer', 'tiles', 66, 66, 1, 2);

		// Log the contents of `tileset`
		console.log(tileset);

		// Place the background image in our game world
		const backgroundImage = this.add.image ( 0, 0, 'background' ).setOrigin(0, 0).setScrollFactor(0);

		// Scale the image to better match our game's resolution
		backgroundImage.setScale(2, 0.8);

		// Add the platform layer as a static group, the player would be able
		// to jump on platforms like world collisions but they shouldn't move

		const platform = map.createStaticLayer ( 'platform', tileset, 0, 0 );

		// Add the collisionWall layer as a static group, the player would be able
		// to be blocked by invisible walls

		const collisionWall = map.createStaticLayer ( 'collisionWall', tileset, 0, 0 );

		// There are many ways to set collision between tiles and players
		// As we want players to collide with all of the platforms, we tell Phaser to
		// set collisions for every tile in our platform layer whose index isn't -1.
		// Tiled indices can only be >= 0, therefore we are colliding with all of
		// the platform layer
		platform.setCollisionByExclusion(-1, true);

		// As we want players to collide with all of the collision walls, we tell Phaser to
		// set collisions for every tile in our platform layer whose index isn't -1.
		// Tiled indices can only be >= 0, therefore we are colliding with all of
		// the platform layer
		collisionWall.setCollisionByExclusion(-1, true);

		// Add the player to the game world
		this.player = this.physics.add.sprite(90, 300, 'player');

		// Our Player will not Bounce from Items
		this.player.setBounce(0);
		this.physics.add.collider(this.player, platform);
		this.physics.add.collider(this.player, collisionWall);

		// Camera Follow
		this.cameraDolly = new Phaser.Geom.Point(this.player.x, this.player.y);
		this.cameras.main.startFollow(this.cameraDolly, false, 0.08, 0.08);
		this.cameras.main.setBounds(66, 66, platform.width * platform.scaleX, platform.height * platform.scaleY);
		this.cameras.main.setDeadzone(this.__GAME_WIDTH, this.__GAME_HEIGHT);
		this.cameras.main.roundPixels = true;
		this.cameras.main.setZoom(5.0);
	}

	this.update = function(__timestamp, __elapsed) {

		// Move the camera dolly in round pixels
		this.cameraDolly.x = Math.floor(this.player.x);
		this.cameraDolly.y = Math.floor(this.player.y);

		// Control the player with left or right keys
		if (this.cursors.left.isDown) {
			this.player.setVelocityX(-__movementSpeed);
		} else if (this.cursors.right.isDown) {
			this.player.setVelocityX(__movementSpeed);
		} else {
			// If no keys are pressed, the player keeps still
			this.player.setVelocityX(0);
		}

		// Player can jump while walking any direction by 
		// pressing the space bar or the 'UP' arrow
		if ( (this.cursors.space.isDown || this.cursors.up.isDown) && (this.player.body.onFloor()) ) {
			this.player.setVelocityY(-__jumpHeight);
		}

	}

	this.__config = {

		type: this.__PHASER_TYPE,
		parent: this.__PHASER_PARENT,
		width: this.__GAME_WIDTH,

		height: this.__GAME_HEIGHT,
		roundPixels: true,
		pixelArt: true,

		antialias: false,
		resolution: window.devicePixelRatio,

		scale: {
			mode: this.__PHASER_SCALE_MODE,
			autoCenter: this.__PHASER_SCALE_AUTOCENTER,
		},

		scene: {
			preload, create, update, 
		},

		physics: {
			default: __physicsType, 
			arcade: {
				gravity: {
					y: this.__gravity,
				},
			},
		}
	}

	this.__game = new Phaser.Game(this.__config);


