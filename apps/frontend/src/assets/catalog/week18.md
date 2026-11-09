## Change NOW!

#### Entry date: 9th November 2026

This week has been super busy, because my girlfriend just moved! I'm still highly sore from dragging a few hundred kilos up 50 stairs, so this week we're taking it easy with some more QoL for the 3D model display, in the form of swapping or copying of mapped colours, and modifying of uploaded models.

P.S. Some more models have been uploaded to the 3D page if anyone is keeping track

### Design & Implementation

There were 2 main ideas that I explored for colour swapping. One was to have the "before" colour display be the button to click for swapping, and the other was to have the swapping in the colour picking dialog in a dropdown, along with 2 buttons to decide which action to use (swap or copy).

Initially, I thought that the former allows for 2 less keystrokes in order to do the swap via
```
click colour 1
click colour 2
```
as the latter would require
```
click colour 1
click on dropdown to open dropdown
click colour 2
click button to choose action 
```

With a little more thought, I settled on the latter for the initial implementation, as in my mind the swap or copy function would likely not be used often enough to warrant saving this many keystrokes, and the former implementation feels less intuitive. However, this still felt clunky in terms of both design and usage since the new UI elements were placed below the colour picker section in the dialog, resulting in increased mouse movement required, while also looking like a hastily tacked on feature.

Ultimately with some more thought, I managed to settle on the best of both worlds! The final design has the colour picker and mapping section side by side. Since the colour picking section tends to be quite tall, it also allows for basically all the colours I would reasonably have in a model to be there at once. This means I can also now just have a swap and copy button per colour right beside the colour swatch display, allow users to do both swap and copy in the ideal 2 keystrokes, while having all the colour manipulation options in a single place intuitively.

### Challenges

The thought process for this week's design was the most complicated part of the process, far more than any of the actual feature implementation. It's been a while since I've had to think about the design of a feature on the site so it was a really fun exercise in packing new features into existing UI in a way that just makes sense.

Honestly, I hope to do it more, since I think this is such an important skill to have in the age where developers might be so easily replaced by AI. It's precisely these intuitions and eye for detail in the frontend development space that AI tends to lack :)

### Component

./components/week18.tsx