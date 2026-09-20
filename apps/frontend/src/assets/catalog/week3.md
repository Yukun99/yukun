## Button / Star Burst

#### Entry date: 26th July 2026

This week I wanted to have some fun. After completing the settings/toggle bar at the top of the page, there was 2
buttons on the right, and one on the left. In the pursuit of symmetry, this week we'll add something fun to the left :)

### Design & Implementation

First, I decided to design a logo for myself that would be very simple to implement using svg. Since my initials are XY,
I decided to simply overlay the letters over each other for the logo. Of course, this would then look very boring, so
let's add some flair to it.

The first thing we'll do is to colour the button icon using a linear gradient, with the brighter colour at the top left
corner of the button icon, just like our Section component. This serves double duty, making the whole page look like it
was lit from the top left corner, subtly making everything more consistent.

Next up is the fun part. I wanted to make the button not do anything in terms of functionality, but still be something
fun for the user (i.e. me at 2am because I got a little too locked in) to play with. And thus the idea for the Star
Burst effect came in. Put simply, I wanted each click on the button to set off a mini firework, at the exact spot on the
button that was clicked by the user. There are multiple ways to do this effect, but the one I decided on was to simply
spawn a bunch of stars at the click point facing different directions stored as `angle`, with different lifetime values
stored as `dist`. We then use animation to make these items travel in the direction specified until the end. To mimic
the effect of fireworks fizzling out, I also made the scale of the stars decrease as the animation plays.

### Challenges

This task was not really challenging per se, but getting the math correct and figuring out the different options for
animating components after not using them for a while was quite fun. Through a combination of asking Claude and good old
Googling, I eventually got there.

### Source Code

common/components/buttons/round-icon-button.tsx
common/components/effects/star-burst.tsx

### Component

./components/week3.tsx