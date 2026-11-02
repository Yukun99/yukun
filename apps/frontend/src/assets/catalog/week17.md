## Taste the Rainbow

#### Entry date: 2nd November 2026

Now that we have more colours, I decided it might be a good idea to allow the colours to be easily mapped to other colours, and also downloaded with said mapped colours, so that anyone coming over can play with the 3D viewport and get a little "souvenir" for their efforts.

### Design & Implementation

I took inspiration from the Makerworld 3D model viewport for the UI, and threw in the download button below that to allow for, well, downloads. Simple design there.

The main difference is that I have to store the 3MF file in addition to the geometry data now with the addition of download support, so there were some changes required to the backend.

### Challenges

The difficult part this week was moreso figuring out how to store the updated colour data in the 3MF file in a way that does not break how it loads. Once that was done things were easier.

### Component

./components/week17.tsx