## Mobile Navigation

#### Entry date: 23rd August 2026

Finally, more time to work on things. This week, I decided to put in more work, since I won't be around for the next 2 weeks basically, but I still wanted components ready for the entries. SOOOOOO I have done all that. BUT! We will focus on the simplest of them, the mobile navigation button and drawer.

### Design & Implementation

Due to the other changes I made, the mobile page now requires the device to be placed horizontally, and thus vertical space is at a premium. To solve that problem, I made use of a UI element inspired by what the app I develop at work uses, a floating navigation button that opens the navigation menu. I then moved the buttons and settings buttons inside a drawer that it opens, so that we can basically use all the space for our content.

### Challenges

Honestly, the challenges were in the other components, and this navigation change is pretty smooth sailing in general, but having this navigation bit display correctly in this week's section did take some work, so there's that.

### Source Code

features/navigation/navigation-mobile.tsx
features/navigation/navigation-drawer-mobile.tsx

### Component

./components/week7.tsx