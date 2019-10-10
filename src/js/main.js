
	this.__GAME_WIDTH = ( window.innerWidth );
	this.__GAME_HEIGHT = ( window.innerHeight );
	this.__PHASER_TYPE = ( Phaser.CANVAS );
	this.__PHASER_PARENT = ( 'game' );
	this.__PHASER_SCALE_MODE = ( Phaser.Scale.RESIZE );
	this.__PHASER_SCALE_AUTOCENTER = ( Phaser.Scale.CENTER_BOTH );
	this.__physicsType = ( 'arcade' );
	this.__gravity = ( 500 );
	this.__lag = 0;
	this.__fps = 60; // physics checks 60 times / frame
	this.__frameduration = 1000 / this.fps;

	this.preload = function ( )

	{

		// Image layers from Tiled can't be exported to Phaser 3 (as yet)
		// So we add the background image separately

		this.load.image ( 'background', 'assets/images/background.png' );

		// Load the tileset image file, needed for the map to know what
		// tiles to draw on the screen

		this.load.image ( 'tiles', 'assets/tilesets/platformPack_tilesheet.png' );

		// Load the export Tiled JSON

		this.load.tilemapTiledJSON ( 'map', 'assets/tilemaps/level1B.json' );

	}

	this.create = function ( )

	{

		// Enable user input via cursor keys

		this.cursors = this.input.keyboard.createCursorKeys ( );

		// Create a tile map, which is used to bring our level in Tiled
		// to our game world in Phaser

		const map = this.make.tilemap ({

			key : 'map', 

		});

		// Set `level` as `map` for later use

		level = map;

		// Add the tileset to the map so the images would load correctly in Phaser

		const tileset = map.addTilesetImage ( 'kenney_simple_platformer', 'tiles', 66, 66, 1, 2 );

		// Log the contents of `tileset`

		console.log ( tileset );

		// Place the background image in our game world

		const backgroundImage = this.add.image

		(

			0, 0, 'background'

		).setOrigin ( 0, 0 ).setScrollFactor ( 0 );

		// Scale the image to better match our game's resolution

		backgroundImage.setScale ( 2, 0.8 );

		// Add the platform layer as a static group, the player would be able
		// to jump on platforms like world collisions but they shouldn't move

		const platform = map.createStaticLayer

		(

			'platform', tileset, 0, 

			200

		);

		// There are many ways to set collision between tiles and players

		// As we want players to collide with all of the platforms, we tell Phaser to
		// set collisions for every tile in our platform layer whose index isn't -1.

		// Tiled indices can only be >= 0, therefore we are colliding with all of
		// the platform layer

		platform.setCollisionByExclusion ( -1, true );

		// Add the player to the game world

		this.player = this.physics.add.sprite ( 50, 300, 'player' );

		// Our Player will not Bounce from Items

		this.player.setBounce ( 0 );

		// Don't go out of the Map

		// this.player.setCollideWorldBounds ( true );

		this.physics.add.collider ( this.player, platform );

		// Camera Follow

		this.cameras.main.startFollow ( this.player, false, 0.08, 0.08 );
		this.cameras.main.setBounds ( 0, 0, 9100, 9100 );
		this.cameras.main.setDeadzone ( this.__GAME_WIDTH, this.__GAME_HEIGHT );
		this.cameras.main.setZoom ( 1.0 );
		this.cameras.roundPixels = true;

	}

	this.render = function ( __cursors, __player, __timestamp, __elapsed, __debug )

	{

		__debug = __debug || 0;
		this.__debug = __debug;

		this.__cursors = __cursors;
		this.__player = __player;
		this.__timestamp = __timestamp;
		this.__elapsed = __elapsed;

		if ( this.__debug )

		{

			console.log

			(

				'\r\n' + 

					'this.__cursors :: ' + this.__cursors + '\r\n' + 
					'this.__player :: ' + this.__player + '\r\n' + 
					'this.__timestamp :: ' + this.__timestamp + '\r\n' + 
					'this.__elapsed :: ' + this.__elapsed + '\r\n' + 

				'\r\n'

			);

		}

		// Control the player with left or right keys

		if ( this.__cursors.left.isDown )

		{

			this.__player.setVelocityX ( -200 );

		}

		else if ( this.__cursors.right.isDown )

		{

			this.__player.setVelocityX ( 200 );

		}

		else

		{

			// If no keys are pressed, the player keeps still

			this.__player.setVelocityX ( 0 );

		}

			// Player can jump while walking any direction by 
			// pressing the space bar or the 'UP' arrow

		if 

		(

			( this.__cursors.space.isDown || this.__cursors.up.isDown )

				&& 

			( this.__player.body.onFloor ( ) )

		)

		{

			this.__player.setVelocityY ( -450 );

		}

	}

	this.update = function ( __timestamp, __elapsed )

	{

		this.__timestamp = __timestamp;

			this.__elapsed = __elapsed;

			this.__lag += this.__elapsed;

		while ( this.__lag >= this.__frameduration )

		{

			this.__phys ( this.__frameduration );

			this.__lag -= this.__frameduration;

		}

		render

		(

			this.cursors, this.player, this.__timestamp, 

			this.__elapsed

		);

	}

	this.__config = 

	{

		type : this.__PHASER_TYPE, parent : this.__PHASER_PARENT, width: this.__GAME_WIDTH, 

			height : this.__GAME_HEIGHT, // roundPixels : true, pixelArt : true, 

			resolution : window.devicePixelRatio, 

		scale: 

		{

			mode : this.__PHASER_SCALE_MODE, 

			autoCenter : this.__PHASER_SCALE_AUTOCENTER, 

		}, 

		scene : 

		{

			preload, create, update, 

		}, 

		physics : 

		{

			default : __physicsType, 

			arcade : 

			{

				gravity : 

				{

					y : this.__gravity, 

				}, 

			}, 

		}

	}

	this.__game = new Phaser.Game ( this.__config );


