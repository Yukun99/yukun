## Work Timeline

#### Entry date: 7th September 2026

Now for the actual "cool" component lol, the timeline for displaying my work experience, in a more aesthetically
pleasing way.

### Design & Implementation

In my mind, I wanted this to look somewhat like the fancy dials or numerical displays that you would see on a submarine
pressure gauge, where the numbers are printed on the side of a wheel, and as you scroll along the next numbers scroll
into view. To achieve this effect, I needed to simply have the items snap into place, and have the currently active
"dial" text be larger, while shrinking the previous item away and expanding the next item into view. A little less
opacity on the previous/next items also gives the illusion of them being further in shadow, and adds to the effect.

### Challenges

Of course, the bulk of the challenge was just to implement the animations and effects on the timeline items, but further
work was also needed to adapt it to mobile, where I had the timeline at the top instead of at the side.

Other changes I made included adding the skills used in each job at the bottom of the listing with the extra real estate
we have now, since each work experience card takes up the whole page now. These are functionally sized down versions of
the buttons that I made for the skills page, and open up the same dialog.

Finally, since I wanted each item to snap into place when the user scrolls to it, and the default snap scrolling
behaviour was not what I wanted exactly, I had to implement that myself too, where the item that occupies more of the
screen when the user stops scrolling will snap into place after a set delay.

### Source Code

common/components/timeline/timeline.tsx

### Component

./components/week9.tsx