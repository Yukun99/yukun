## Janitor Work

#### Entry date: 4th October 2026

Busy weekend in real life, but always time for some good ol' cleanup. It's been a long time since we have done some well needed work on making sure the repository is still easy to work with, so that's today's goal.

### Design & Implementation

Lowkey there's not much to design, but I did make some choices.

1. Scroll bars & hooks
  - Scroll bars are now generally all floating scroll bars
  - Floating scroll bars all have standardised positioning and formatting
  - Scroll snapping or other logic is now centralised for performance
  - Scroll snapping and other logic are hook based instead of polling based
2. Sections
  - Section props count reduced
  - Section props renamed to be more self-explanatory
3. Home Sections
  - Sections in Home page are now mapped to reduce prop declaration code
4. Accordions
  - Accordions now go in an accordion group instead of having logic mixed with other code
5. Circles
  - Circle handler now no longer throws loop errors

### Challenges

Chill week, not much challenges this time, but it was fun cleaning things up and taking it slow for a change. Still wanted to be consistent for the challenge and holding myself accountable, but no point forcing a feature through when I have no inspiration for it this week :)

### Component

./components/week13.tsx