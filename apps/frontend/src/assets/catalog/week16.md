## Now Available in Technicolour!

#### Entry date: 24th October 2026

Following our jump to the 3rd dimension, I realise that a lot of my designs have colour built in. This made the monochrome displays of some of them not just look worse, but straight up lose certain details. So let's get some colour in there. Enjoy the rainbow boat :)

### Design & Implementation

Since the colour is already in the 3mf files, we just have to apply them to the proper surfaces before rendering the model. Since there's no fixed "format" for 3mf files given that they're just fancy zip files, I decided I would support only 2 formats, 1 being Bambu project 3mfs, and the other being just "raw" 3mf files with colour.

### Challenges

Although adding colour itself might not have been hard, the addition of colour also caused some models to take much longer to load and parse. With the original method we used to load the models, this resulted in the main thread blocking, and also a period where the model just does not show up. To tackle this, an async parser that converts models into the actual geometry data for display had to be added, with a spinner in the interim while the processing is done on another thread.

### Component

./components/week16.tsx