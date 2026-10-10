## HAHAHA... I HAVE NO IDEA!

#### Entry date: 10th October 2026

A little sick for this whole week but there was an idea... to have more ideas? Basically, ideas page that allows me to track what I think of for this website :) 

### Design & Implementation

Generally, I wanted something similar to the app I built for the Spark Systems take home assignment. I really liked the grid that was modifiable via dragging, and so we have that again, but this time obviously matching the theme of this site. It is also much simplier, since it does not need to receive updates and there's no different layouts of grid items or types of grid items.

The design was kept simple, with Google authentication being added to block everyone else from editing the page, and a pop up dialog that allows for editing of the title and contents of each item, along with a delete button to clear a certain cell. Dragging the cells also lets me rearrange them.

### Challenges

Been a long time since I've done anything related to Google auth, so that was a small bump in the road, but nothing too difficult. Every component is basically a tweak of what we already have or a tweak of what I have already implemented elsewhere so it was not too hard.

There were some funny interactions and weird UI element offsets from the catalog entry example component, but as usual, it just needed a portal.

### Component

./components/week14.tsx