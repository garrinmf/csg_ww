Web Workers Demo
==================
using CSG.js
------------------

[Demo](http://garrinmf.github.io/csg_ww)

Very basic example of Web Workers with message passing and returning a result.  The polyhedra intersection library CSG.js is loaded in the Web Worker and used to perform polyhedron intersections.

Take note when using the non-Web Worker buttons that everything appears at once and that for the larger sets it takes awhile.  While using the Web Worker enabled buttons gives you 'constant feedback' where you see each message appear.  During the non-WW buttons you can't select text and the animated GIF is frozen while the WW-enabled buttons enable everything to 'function normally'

\* *Note: This project needs to be hosted in a 'server environment', not the filesystem, to get past browser security protocols.*
