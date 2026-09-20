## Skeleton Section / Reveal

#### Entry date: 3rd August 2026

Week 4! Over a month has passed since I started this project, this time let's do something harder. I plan to move the
design / flow of the website in a more stylish direction as the months pass, and we are also loading more and more
components/source code snippets lazily, so I think now would be a good time to make a component to handle exactly this.

### Design & Implementation

Let's first make the skeleton for a loaded section. Since we are using section components that look like pieces of
glass, I figured that a simple silhouetted slot that the glass section "slides" into would look great. We also want this
slot to fade out as the component fades and slides in from the bottom, so let's add that as well. To make it look sleek,
I made use of linear-gradient to style the border, and added a fade out transition. All this is tied into whether the
children of the section is present.

Next, let's tackle the fading in of the component, with the useReveal hook and Reveal component. I made useReveal as a
way to provide the fade in and move up style props for existing containers, and Reveal as a wrapper for components that
might not be encased in my custom section containers. To make it configurable in the future, the fade in trigger comes
in 2 flavours. The first trigger is for on mount, which begins the fade in transition on mount, while the other option
is on scroll, which will begin the fade in transition shortly before the component scrolls into view, with an option to
play the transition either on every mount or only on first mount. To help with accessibility, let's also add a way to
turn off the animation if the user has low motion accessibility flag enabled!

### Challenges

This task was much more challenging than the previous week, partially due to how little time I had to spend on what is a
way bigger and more complicated task than last week. Figuring out the linear gradient background and showing / hiding
the skeleton with animations were also tasks I had not attempted before. I am still not completely happy with it, but we
will slowly address the issues and correct the implementation in the coming weeks :) Getting the effects and timings
exactly right also took some work, since I wanted the effect to look as close to a piece of glass sliding into a slot as
possible.

### Source Code

common/hooks/use-reveal.ts
common/skeletons/sk-section.tsx
common/components/effects/reveal.tsx

### Component

./components/week4.tsx