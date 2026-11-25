## rm -rf

#### Entry date: 25th November 2026

We can upload, modify and remap colours in the viewport, so why can't we also delete some objects? This week we are
adding the ability to delete objects from plates before downloading the 3mf, in case you decide that some of my models
suck :P

Oh and if you mess up you can just click the reset button now to go back and undo all the mapping / deletes without
having to reload the whole page :)

### Design & Implementation

Not to much changes UI wise, just a few extra buttons, but it was fun fiddling with the highlighting of selected
objects.

There were also some minor tweaks to how the viewport pivots and some other pages load, but they were also mostly minor
changes.

### Challenges

The highlighting part was the hardest this week, with the initial implementation being occluded by other objects which
are supposed to be behind the outline. The initial fix I made then resulted in Z fighting between the selected model
itself and its own outline, so I went with a mask that goes over visible surfaces to make it show as a silhouette that
does not also show inner lines on the object bodies, while the depth bias helps with the occlusion happening.

Perhaps we will see some more difficult tasks soon when I get any more crazy ideas :)

### Source Code

pages/3d/use-removal.ts
pages/3d/components/model-actions.tsx
pages/3d/utils/items.ts
pages/3d/utils/outline.ts
pages/3d/utils/remove-items.ts

### Component

./components/week20.tsx