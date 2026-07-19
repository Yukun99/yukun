## Skill Button / Dialog

#### Entry date: 19th July 2026

Week 2. This week, I wanted to complete the resume section of my website, with some flair. This involved some
augmentation of existing components, along with implementation of new ones.

### Design & Implementation

To begin, let's improve the functionality of our simple Section component. We already have the styling to make things
look nice and like glass, so let's use it. Apply the same styling to the button container, and have helper functions to
find the correct icons and labels for the button content. The only part of this that was a little brain tickling was the
slicing up of the UK and US flag using styling for the English language skill, and of course the usual styling
provisions for both desktop and mobile.

The Skill Dialog did bring up an interesting challenge though! It seemed simple at first. Just use a Dialog component,
slap our Section component as the pop up, create a helper function for the contents and wire it up to the Skill Button
components, and voila! This worked, but if you try this yourself, you would quickly realise that there seems to be an
annoying popping in of the transparency effect that I applied on the Section component. (Self inflicted problem in the
pursuit of aesthetics, I know.) Well, let's go through how it was solved below :)

### Challenges

The root cause of this issue was fun to trace. Since was not familiar with the way that backdropFilter and
WebkitBackdropFilter worked, I did not know that these filters only applied **after** any animations on the component
were complete. Since the Dialog component has a short fade in animation (to look and feel sleeker, admittedly), it
caused the backdropFilter to suddenly pop in at the end of the animation, resulting in the jarring sudden blurring of
the background after we already see the translucent Section component appear.

Of course, another simple fix would have been to just disable the fade in, thus immediately showing our Section
component and not having the backdropFilter pop in. However, as my CS professor once said, we can do better! And so, in
the pursuit of *aesthetics*, let's try.

Thus my own happy middle ground was borne. Instead of having everything pop in immediately to avoid the backdropFilter
pop in issue, let's **just** pop in the problematic part, the filter part of the background! Instead of applying the
backdropFilter to our Section component that needs to pop in, we apply it directly to the Dialog component, and make
that appear immdiately. Then, we place the Section **inside** of said Dialog, wrapped in a Fade component with the exact
same fade value as before. We also augment this inner Section component to not have its own backdropFilter when a prop
is populated. Now, our blur immediately appears, while the actual contents of the Dialog components fade in after that,
creating a surprisingly illusion of everything fading in together!

See you next week for more (possibly superficial and inane) fixes in the pursuit of beauty.

P.S. I also had to augment the Catalog page itself to take in more than one piece of source code, since this week we
technically made 2 new cool little components, but that was pretty trivial so it isn't really worth mentioning.

### Source Code

https://raw.githubusercontent.com/Yukun99/yukun/refs/heads/main/apps/frontend/src/pages/resume/components/skill-button.tsx
https://raw.githubusercontent.com/Yukun99/yukun/refs/heads/main/apps/frontend/src/pages/resume/components/skill-dialog.tsx

### Component

./components/week2.tsx