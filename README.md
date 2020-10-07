# banners-auto-package
Auto-package banners. 
1. Put your work folder under './sources' (Sources > 160x600, 300x50, etc) 
2. Change variable zipName to your preference Package Name ( JOBNUMBER_DCM ) 
3. Run 'gulp process' -> this syntax will capture all your banners, and put it into '/backup' folder under '/sources'. then compress each folder to zip. 
4. Done, find your package under 'dist' folder


NB:
* Under head tag, put below comment code, it will auto-inject meta ad.size:
```
<!--AD.SIZE-->
```
* naming your HTML file as index.html
