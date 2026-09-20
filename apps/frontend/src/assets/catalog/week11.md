## 1... 2... 3... Huh?

#### Entry date: 20th September 2026

Time to do a little upgrade of our visitor counter. While a simple counter that increments every visit is nice, it is also a little simplistic, and everytime my browser refreshes in the background, the count goes up. Doesn't really tell you how many people have visited, so much as it tells you how many times the site has been visited. So let's change that :)

(On a side note, I might be about to get 2 job offers and change jobs soon, so YAHOO YIPEE WOOHOO!!!)

(I will try my best to continue working on this though, I code because I like making things, especially things that are interactive and visible, so this is right up my alley lol)

### Design & Implementation

Since I (read: Claude) implemented a backend for last week's THA project, I thought it might be nice to have something similar for this project, to make the visitor counter more robust and meaningful.

While I thought about saving more data, I also realise that that extra data could quickly scale beyond what little storage space I have on the web host, so ultimately I settled on 2 data points: total number of visitors and which visitor you are. For identifying visitors, we use 2 data points and some encryption to do matching, and there's the new counter done :)

### Challenges

Look, I still don't know what PHP is, and the theme for my life this weekend was touching grass, so Claude is back out in full force. I'll figure PHP myself out one day, but today is not the day. See you next week for less PHP and more JS/TS again :P

### Component

./components/week11.tsx