## Dimension Hopping

#### Entry date: 19th October 2026

Still sick. But better, so let's do something bigger for this week. This week brings us into the 3rd dimension! I have always wanted a space to showcase my 3D models outside of just uploading them to MakerWorld, so here it is :) Enjoy messing with the viewport here, or check out my other models in the 3d page! (More to come once I add colour support)

### Design & Implementation

Initially, I wanted to reprise my prior studies in OpenGL and mess directly with WebGL for the renderer, but I quickly realised the limitations of, well, time. So we're back to just using libraries to do so. (Not to mention I have no idea how to optimise the viewport myself if it were in WebGL so it would likely have caused some performance issues)

Other than that, it is just a simple section at the side that allows me to upload models, along with a viewport serving the 3D models with some zoom, move and rotate controls.

### Challenges

New library and figuring out storage of the 3D files in the database took some work figuring out, and deciding on how best to shade the models. The lack of time also made it such that I could not go for some of the stretch goals, but I think it was fun to mess with this as an MVP.

### Component

./components/week15.tsx