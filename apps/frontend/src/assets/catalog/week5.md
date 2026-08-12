## Bouncy Balls!

#### Entry date: 12th August 2026

Been a busy week at work, so the entry is a little late, but it's time to do something fun. (again!) For this week, I
wanted to have something more dynamic / interesting as the background for the page, instead of the current image we
have. So I decided that it's time to put some of what I learnt during the graphics / games modules in university to use.
(Arguably, some of the simplest part of it, but still...)

### Design & Implementation

Let's first make the component that holds the balls. This is simply a box containing an array of circular boxes with
randomised sizes, colours and some transparency. To enable us to contain the balls in the box by making the balls bounce
off its walls, we will also need a ref to the box. Of course, we also need refs on each of the balls to handle the
collision and moving part of it all.

To keep the logic separated and not make the component code itself a mess, let's consolidate it all in a hook, which
will handle initial styling / spawning and collision calculations. The whole process is not too difficult. To begin, we
have a useEffect hook that starts a loop. This loop will handle the per tick calculation of positions and calculations.
Next, we need to do the initial setup for the positions of the balls. For this, we make use of ResizeObserver as well,
so the ball positions get properly recalculated when the window resizes, preventing balls from getting trapped outside.

With the balls spawned, we simply calculate the position to move them for the next frame scaled to the amount of time
passed. Once that is done, we then use the position to check for collisions as well. Since we are ignoring the mass of
the balls in the collision and just preserving the speed of the balls, our job here is not too hard. If you would like
to see the math it is properly labelled and commented in the code blocks below.

### Challenges

This task was more annoying than complicated, since it's just been a while since I've done any math outside of basic
single operation arithmetics. Some of the bugs encountered include balls getting "trapped" in each other or vibrating
around when colliding due to the lack of guard for multiple balls colliding in 1 frame, as well as the ticking not
taking into account time passed and just being fix stepped ticks at the start, resulting in jittery motion when browser
performance isn't ideal.

The test setup for the app also broke since we are using ResizeObserver now, which needs to be mocked for tests to run.
Granted, the test is just testing for app render right now, but having the stub mocks will help future test
implementation. (Arguably, tests would have been great to constrain the correctness of the physics calculations, but I
do not have the luxury of time this week, unfortunately.)

### Source Code

https://raw.githubusercontent.com/Yukun99/yukun/refs/heads/main/apps/frontend/src/common/hooks/use-floating-circles.ts
https://raw.githubusercontent.com/Yukun99/yukun/refs/heads/main/apps/frontend/src/common/components/effects/floating-circles.tsx

### Component

./components/week5.tsx