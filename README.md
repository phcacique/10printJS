# 10printJS
This is my approach of the 10 print algorithm made in JS.

## Gallery
Each html file can have multiple elements that contains galleries. Each gallery can have multiple pieces of art.

### Creating a gallery
```javascript
gallery = new Gallery("main", 4);
```

where the first parameter is the id of the html element and the second is the maximum number of pieces of art per line.
You can also pass another parameter containing a fized size for each piece of art.

### Updating the gallery
Update all the pieces of art inside gallery:
```javascript
gallery.update();
```

### Creating a new piece
Create a new piece of art passing the number of subdivisions for its grid, the probability of changing line direction (number between 0 and 10) and a boolean that indicates if the line is a Diagonal or a vertical/horizontal one.
```javascript
gallery.createPiece(10, 5, true);
```
---
