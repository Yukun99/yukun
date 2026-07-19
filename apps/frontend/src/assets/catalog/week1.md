### Section

#### Entry date: 13th July 2026

Week 1. Exciting! For this week, I wanted to do some basic setup of the repository, get everything such as localisation
and routing working, and just get a simple reusable component as a container for displaying future entries.

### Design & Implementation

This week, the star of the show is the *Section* component. It is a simple rounded box with a glass-like effect. I have
always been fascinated with the clear elements on display in different apps and pages, and the design for this pane is
inspired heavily by glass-like UI elements from Windows Vista and Windows 7, which were a joy to look at and use.

For the design, I decided first to find a neutral colour that would allow both black and white text to read clearly as a
base background colour. To give an illusion of having a consistent light source shining on a glass pane, I then made
this background a linear gradient. Placed diagonally, this makes one corner of the container lighter, and the opposite
side shaded. To further bring the container to the front and make it look like it really pops off the page, I added a
box shadow. Finally, I added a blur and saturate filter, which completes the glass look, while also helping the text
remain far more readable with busy backgrounds.

To further showcase the blur and saturate effect, I then added a background image with many different colourful and
interesting shapes, which would now look like they are showing through frosted glass panes! Not having the panel be
fully transparent has the added benefit of adding depth when many of these components are stacked together, making them
feel thick and solid, like real pieces of glass.

### Challenges

The challenge for this portion was mainly fine-tuning exactly how I wanted to style the component, while making it
reusable and easily modifiable. You will see later on how some of the design decisions come back to bite me though, as I
had to embark on some rather esoteric fixes.

### Source Code

https://raw.githubusercontent.com/Yukun99/yukun/refs/heads/main/apps/frontend/src/common/components/sections/section.tsx