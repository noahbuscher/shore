Shore
=====

Shore is a simple waveform generator library for JS. It's reminiscent of SoundCloud's, but can be used in conjunction with an audio element and is not tied to an online service. Here's what a basic waveform looks like using Shore:

![](http://codingbean.com/shore/wave1.png)

Shore is currently real-time and volume dependant, so in order for the waveform to work, you must have the file audibly playing. I'm working on getting pre-processing working, though, so this should be fixed soon. I hope.

Also, if the waveform outgrows the canvas, the canvas scrolls to fit it, so no worries there.

### Use

Using Shore is pretty simple. Just create an audio element with a file and call the Shore function with options! Here's an example HTML snippet:

```HTML
<html>
	<head>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
		<script src="../shore.js"></script>
		<script>
			window.onload = function() {
				shore({
					source: 'source',
					view: 'visualisation',
					color: '#FF2C00',
					scale: 0.4
				});

			};
		</script>
	</head>
	<body>
		
		<audio id="source" controls>
  			<source src="bird.wav" type="audio/wav">
		</audio>
		<canvas id="visualisation" width="800" height="200"></canvas>
	</body>
</html>
```

The view is the canvas that you'll be displaying on, the source is the audio element with playable file, and the color is the hue of the waveform.

### Thanks

Thank you to [freesound.org](http://instagram.com/p/jU4RWIxZ7u/) for the example audio file.
