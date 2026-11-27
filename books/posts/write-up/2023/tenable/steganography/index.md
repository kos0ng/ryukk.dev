# Steganography

<!-- challenge-index: e2b6546dd666cf40 -->

| Challenge | Topic |
| --- | --- |
| [Ancient Scrawls (409 pts) 🥈](#ancient-scrawls-409-pts) | Animated GIF, Mouse Trajectories |

<!-- /challenge-index -->

## Ancient Scrawls (409 pts)

### Description

My friends and I kept getting caught passing notes in computer class, so we came up with a different way to communicate.

### Solution

So basically we given gif file that show cursor movement. Cursor movement produce flag, something like writing text using mouse. To do  this challenge faster we do the extraction on each frame and draw process automatically. First step we do are extracting the frame (script credit to 0xazr)

```python
import os
from PIL import Image

def separate_gif(gif_path, save_path):
    gif = Image.open(gif_path)
    try:
        os.mkdir(save_path)
    except:
        pass
    for i in range(gif.n_frames):
        gif.seek(i)
        gif.save(os.path.join(save_path, 'frame{:02d}.png'.format(i)))

if __name__ == '__main__':
    separate_gif('file.gif', 'frames/')
```

After splitting gif to each frame the next step is drawing line using PIL for each non white pixel. Here is script i used to draw the flag

```python
from PIL import Image, ImageDraw

# trial and error
pairs = [[1,74],[74,115], [120, 170], [169, 218], [223, 293], [302, 390], [395, 413]]

for pair in pairs:
	new_img = Image.new(mode="RGB", size=(3000, 1000))
	img1 = ImageDraw.Draw(new_img)  
	shape = []
	for a in range(pair[0], pair[1]):
		nm = str(a).rjust(2, "0")
		fn = f"frames/frame{nm}.png"
		img = Image.open(fn)	
		pixels = img.load()
		check = False
		for i in range(img.size[0]):
			for j in range(img.size[1]):
				if(pixels[i,j] != (255, 255, 255, 255)):
					if(len(shape) <= 1):
						shape.append((i,j))
						check = True
					elif(len(shape) == 2):
						img1.line(shape, fill ="red", width = 1)
						del shape[0]
					break
			if(check):
				break
	new_img.show()
```

Flag : flag{theydontreachcursiveanymore}
