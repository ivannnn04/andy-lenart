/**
 * The content the site ships with. The admin panel saves its edits to the
 * store (see store.ts); until something is saved — or when no store is
 * connected — the site shows this.
 */
import type { SiteContent } from "./types";

export const DEFAULT_CONTENT: SiteContent = {
  "settings": {
    "siteTitle": "Andy Lenárt — Departures 1322",
    "siteDescription": "Departures 1322, Collection 01 by Andy Lenárt: 10 designs, 10 tracks. Every garment holds a world of sound.",
    "contactEmail": "connect@andylenart.com",
    "nav": [
      {
        "label": "Manifesto",
        "href": "/#manifesto"
      },
      {
        "label": "Collections",
        "href": "/#collection"
      },
      {
        "label": "Listen",
        "href": "/#listen"
      },
      {
        "label": "Own",
        "href": "/#stay-connected"
      }
    ]
  },
  "home": {
    "heroLines": [
      "I grew up in a post-communist block",
      "with a mother who was a waitress."
    ],
    "heroTagline": "This is how it continues...",
    "manifesto": [
      "One night I dreamed I broke into the flat I grew up in and found strangers asleep in every room. I wasn’t there to take anything.",
      "I just sat on the floor in grief. That’s where this collection began."
    ],
    "owners": {
      "label": "FOR OWNERS",
      "title": "EVERY GARMENT HOLDS A WORLD OF SOUND",
      "steps": [
        {
          "title": "Tap the garment",
          "body": "Bring your smartphone to the garment logo in order to enter your Listening Room."
        },
        {
          "title": "Enter your word",
          "body": "Inside the garment, you will find a concept text. Enter the requested word to gain access."
        },
        {
          "title": "Listen and leave a mark",
          "body": "Hear the full track, then enter The Staircase: a **collective wall** shared by everyone who **owns a piece** from this collection, wherever they are."
        }
      ],
      "statement": "THE ALBUM LIVES INSIDE THE COLLECTION.",
      "statementBold": "WHEN THE LAST PIECE IS SOLD, IT GOES EVERYWHERE."
    },
    "stayConnected": {
      "title": "Hear when the next piece is out",
      "subtitle": "Follow the collection. Receive an email when the next garment is ready."
    }
  },
  "collection": [
    {
      "no": "01",
      "title": "Born by the Pelican Sculpture",
      "description": "One can depart, but the place does not release you.",
      "status": "Available · 12 left",
      "garmentSlug": "born-by-the-pelican-sculpture",
      "price": "£ 1,500",
      "preview": {
        "src": "/audio/garment-01-preview.aac",
        "duration": "0:30"
      },
      "image": {
        "src": "/images/garment-01.webp",
        "alt": "Garment 01: white coat with hand-drawn black lettering, worn on concrete steps beneath tower blocks"
      }
    },
    {
      "no": "02",
      "title": "Paper Walls",
      "description": "Not yet released",
      "status": "Next release · Notify me",
      "statusHref": "#stay-connected",
      "preview": {
        "src": "/audio/garment-02-preview.aac",
        "duration": "0:30"
      }
    },
    {
      "no": "03",
      "title": "Symmetrica",
      "description": "Not yet released",
      "status": "Coming soon",
      "preview": {
        "src": "/audio/garment-03-preview.aac",
        "duration": "0:30"
      }
    },
    {
      "no": "04",
      "title": "Aliens and Herons (Vetřelci a volavky)",
      "description": "Not yet released",
      "status": "Coming soon",
      "titleSize": 20,
      "preview": {
        "src": "/audio/garment-04-preview.aac",
        "duration": "0:30"
      }
    },
    {
      "no": "05",
      "title": "The Blueprint",
      "description": "Not yet released",
      "status": "Coming soon",
      "dimmed": true,
      "preview": {
        "src": "/audio/garment-05-preview.aac",
        "duration": "0:30"
      }
    },
    {
      "no": "06",
      "title": "Soviet Sunset",
      "description": "Not yet released",
      "status": "Coming soon",
      "dimmed": true,
      "preview": {
        "src": "/audio/garment-06-preview.aac",
        "duration": "0:30"
      }
    },
    {
      "no": "07",
      "title": "Stations of Comfort",
      "description": "Not yet released",
      "status": "Coming soon",
      "dimmed": true,
      "preview": {
        "src": "/audio/garment-07-preview.aac",
        "duration": "0:30"
      }
    },
    {
      "no": "08",
      "title": "Philosophy of Form",
      "description": "Not yet released",
      "status": "Coming soon",
      "dimmed": true,
      "preview": {
        "src": "/audio/garment-08-preview.aac",
        "duration": "0:30"
      }
    },
    {
      "no": "09",
      "title": "The Signatures",
      "description": "Not yet released",
      "status": "Coming soon",
      "dimmed": true,
      "preview": {
        "src": "/audio/garment-09-preview.aac",
        "duration": "0:30"
      }
    },
    {
      "no": "10",
      "title": "Funkce",
      "description": "Not yet released",
      "status": "Coming soon",
      "dimmed": true,
      "preview": {
        "src": "/audio/garment-10-preview.aac",
        "duration": "0:30"
      }
    }
  ],
  "garments": [
    {
      "slug": "born-by-the-pelican-sculpture",
      "no": "01",
      "titleLines": [
        "Born by the",
        "Pelican Sculpture"
      ],
      "tagline": "One can depart, but the place does not release you.",
      "price": "£1,500",
      "availability": "Limited edition · 12 remaining",
      "remaining": "12 remaining",
      "size": "One size",
      "preview": {
        "src": "/audio/garment-01-preview.aac",
        "duration": "0:30",
        "waveform": [
          18,
          20,
          23,
          24,
          23,
          24,
          26,
          26,
          27,
          29,
          28,
          27,
          29,
          32,
          29,
          32,
          28,
          31,
          28,
          26,
          24,
          33,
          30,
          28,
          31,
          26,
          26,
          26,
          29,
          28,
          27,
          30,
          31,
          31,
          29,
          29,
          29,
          28,
          27,
          25,
          21,
          12,
          4,
          4,
          4,
          4,
          4,
          4
        ]
      },
      "gallery": [
        {
          "src": "/images/garment-01.webp",
          "alt": "White coat with hand-drawn black lettering, worn on concrete steps beneath tower blocks",
          "width": 590,
          "height": 760
        },
        {
          "src": "/images/garment-01-2.webp",
          "alt": "Model in the coat with painted beige sleeves, a blue checked bag over her shoulder, in front of a brutalist housing block",
          "width": 1253,
          "height": 1875
        },
        {
          "src": "/images/garment-01-3.webp",
          "alt": "Close-up of the coat's spray-painted lettering, a string bag of oranges on her arm, a balconied tower behind",
          "width": 1253,
          "height": 1875
        },
        {
          "src": "/images/garment-01-4.webp",
          "alt": "Model in the coat on concrete steps beside a handrail, holding a large blue checked bag",
          "width": 1253,
          "height": 1875
        },
        {
          "src": "/images/garment-01-5.webp",
          "alt": "Model on a concrete ledge swinging a string bag of oranges against a blue sky and tower blocks",
          "width": 1253,
          "height": 1875
        }
      ],
      "requestPhoto": 3,
      "details": [
        {
          "title": "Fabric & Making"
        },
        {
          "title": "Sizing"
        },
        {
          "title": "Shipping"
        },
        {
          "title": "Sound tech & Listening Rooms"
        }
      ],
      "concept": {
        "paragraphs": [
          "To return is always, in some way, to depart. We carry the concept of home like a subtle, persistent weight. Opening this collection, the first piece explores our pull towards places we can no longer reach, and why certain environments, objects, and felt stillness hold onto us even after we’ve let go.",
          "It is haunting how deeply we are carved out by the everyday world around us."
        ],
        "image": {
          "src": "/images/garment-01-concept.webp",
          "alt": "Black-and-white photo of a hand resting on a tiled wall sprayed with graffiti, tower blocks behind",
          "width": 1836,
          "height": 1056
        },
        "quote": "“Lying in squares made out of concrete.”"
      },
      "credits": [
        {
          "name": "Jasiek Szczepańczyk",
          "role": "Music composer, Producer & Audio Engineer"
        },
        {
          "name": "Andy Lenárt",
          "role": "Lyricist, Spoken Word Artist & Creative Director"
        }
      ],
      "inside": {
        "title": [
          "Listening Room only",
          "its owners can enter"
        ],
        "paragraphs": [
          "Wearing this coat gives you access to a **private listening space.** Tapping the garment and inputting the keyword printed inside unlocks your design’s distinct **ambient track**, part of a 10-piece sound collection.",
          "Each room leads directly into **The Staircase: a communal digital space** where owners of every piece connect to share their thoughts."
        ],
        "image": {
          "alt": "Blurred glimpse of the Listening Room",
          "width": 560,
          "height": 360
        }
      }
    }
  ],
  "rooms": [
    {
      "slug": "born-by-the-pelican-sculpture",
      "garmentNo": "01",
      "titleLines": [
        "Born by the",
        "Pelican Sculpture"
      ],
      "keyword": "andy",
      "photo": {
        "src": "/images/garment-01-4.webp",
        "alt": "Model in the coat on concrete steps beside a handrail, holding a large blue checked bag",
        "width": 1253,
        "height": 1875
      },
      "track": "/audio/garment-01-track.m4a",
      "lyrics": [
        {
          "time": 57.33,
          "text": "Vytvoření zpe"
        },
        {
          "time": 60.31,
          "text": "Innocence is closed in the heart."
        },
        {
          "time": 70.68,
          "text": "The case that held you at your arrival."
        },
        {
          "time": 76.18,
          "text": "The one he aimed for and falling endlessly."
        },
        {
          "time": 82.77,
          "text": "Coming back persistently."
        },
        {
          "time": 87.28,
          "text": "Recognition and the weight of places."
        },
        {
          "time": 95.03,
          "text": "You're the last friend."
        },
        {
          "time": 97.56,
          "text": "Chastic not so me."
        },
        {
          "time": 100.72,
          "text": "Proceed."
        },
        {
          "time": 108.6,
          "text": "the circles of livelihood,"
        },
        {
          "time": 111.38,
          "text": "Adnami Protein"
        },
        {
          "time": 114.39,
          "text": "Give a Thumbel Goal."
        },
        {
          "time": 116.88,
          "text": "We are reaching for unity."
        },
        {
          "time": 120.37,
          "text": "lying in squares made out of concrete."
        },
        {
          "time": 127.86,
          "text": "You're feeling the warmth of your own echo."
        },
        {
          "time": 132.88,
          "text": "It's better to just find one."
        },
        {
          "time": 136.88,
          "text": "my endless mirrors that could not feel more distant."
        },
        {
          "time": 141.59,
          "text": "Yet it is me, it is us."
        },
        {
          "time": 159.41,
          "text": "I'm guiding you home."
        },
        {
          "time": 165.17,
          "text": "where the world is open."
        },
        {
          "time": 171.96,
          "text": "There are four models."
        },
        {
          "time": 177.24,
          "text": "where you will find"
        },
        {
          "time": 183,
          "text": "Your endless fire can achieve chaos in one moment."
        },
        {
          "time": 191.6,
          "text": "The one you never believed, was yours."
        },
        {
          "time": 198.9,
          "text": "and he might have been right."
        },
        {
          "time": 202.52,
          "text": "I don't know."
        }
      ],
      "verse": [
        "I look for truth in the early 2000s.",
        "I look for reimagined fragments of me,",
        "and the rest of you, in the simplicity of early technology.",
        "I pull the white noise closer to me, hoping it will take me along."
      ],
      "collage": "pelican"
    },
    {
      "slug": "paper-walls",
      "garmentNo": "02",
      "titleLines": [
        "Paper Walls"
      ],
      "keyword": "andy02",
      "photo": {
        "src": "/images/room-02-photo-paper-walls.png",
        "alt": "Black-and-white photo of two men at a table in front of a bookcase",
        "width": 464,
        "height": 298
      },
      "track": "/audio/paper-walls-track.m4a",
      "lyrics": [
        {
          "time": 26.77,
          "text": "Dílení se stin"
        },
        {
          "time": 30.04,
          "text": "overlapping with yours."
        },
        {
          "time": 34.9,
          "text": "Beautiful dance of voices."
        },
        {
          "time": 41.01,
          "text": "so far."
        },
        {
          "time": 42.87,
          "text": "I read Starling"
        },
        {
          "time": 48.08,
          "text": "any link in the"
        },
        {
          "time": 52.02,
          "text": "I'm a tiny, spoutin' a so-dry"
        },
        {
          "time": 58.8,
          "text": "about you."
        },
        {
          "time": 71.48,
          "text": "The sound of your love."
        },
        {
          "time": 76.34,
          "text": "crying"
        },
        {
          "time": 79.16,
          "text": "Sound."
        },
        {
          "time": 80.92,
          "text": "you exchange."
        },
        {
          "time": 84.37,
          "text": "Where my life begins, where yours ends."
        },
        {
          "time": 88.95,
          "text": "Where my life ends and your begins."
        },
        {
          "time": 94,
          "text": "She's in the vest middle."
        },
        {
          "time": 95.8,
          "text": "So sit down, let's talk"
        },
        {
          "time": 99.64,
          "text": "Chum."
        },
        {
          "time": 100.88,
          "text": "Meho života"
        },
        {
          "time": 104.18,
          "text": "Your eyes reflecting in my window."
        },
        {
          "time": 110.23,
          "text": "transparent walls"
        },
        {
          "time": 112.66,
          "text": "Your hopes."
        },
        {
          "time": 116.28,
          "text": "every layer"
        },
        {
          "time": 118.32,
          "text": "with every little story."
        },
        {
          "time": 121.78,
          "text": "I love you."
        },
        {
          "time": 123.99,
          "text": "Always trusting them."
        },
        {
          "time": 128.21,
          "text": "And you, always trust in them."
        },
        {
          "time": 138.64,
          "text": "and when the sun"
        },
        {
          "time": 140.72,
          "text": "That she's thinking great walls"
        },
        {
          "time": 143.76,
          "text": "You know."
        },
        {
          "time": 147.03,
          "text": "It's the morning."
        }
      ],
      "verse": [],
      "collage": "paper-walls"
    },
    {
      "slug": "the-blueprint",
      "garmentNo": "03",
      "titleLines": [
        "The Blueprint"
      ],
      "keyword": "andy03",
      "photo": {
        "src": "/images/room-03-photo-family.png",
        "alt": "Black-and-white photo of a mother with two small children on her lap",
        "width": 201,
        "height": 265
      },
      "track": "/audio/the-blueprint-track.m4a",
      "lyrics": [
        {
          "time": 0,
          "text": "The Blueprint"
        }
      ],
      "verse": [],
      "collage": "blueprint"
    },
    {
      "slug": "soviet-sunset",
      "garmentNo": "04",
      "titleLines": [
        "Soviet Sunset"
      ],
      "keyword": "andy04",
      "photo": {
        "src": "/images/room-04-photo-protest.png",
        "alt": "Faded colour photo of a crowd in front of a monument covered in posters and flags",
        "width": 273,
        "height": 166
      },
      "track": "/audio/soviet-sunset-track.m4a",
      "lyrics": [
        {
          "time": 47.54,
          "text": "The archaeological work is never completely free."
        },
        {
          "time": 54.42,
          "text": "It is a collective work."
        },
        {
          "time": 81.2,
          "text": "standing"
        },
        {
          "time": 87.06,
          "text": "The other side."
        },
        {
          "time": 91.86,
          "text": "We witness"
        },
        {
          "time": 103.35,
          "text": "frozen in moments"
        },
        {
          "time": 111.67,
          "text": "Frozen in patterns."
        },
        {
          "time": 120.85,
          "text": "De Belis mes polis."
        },
        {
          "time": 128.53,
          "text": "Ta-ta."
        },
        {
          "time": 134.64,
          "text": "Zippy Unity."
        },
        {
          "time": 160.66,
          "text": "After using the houses,"
        },
        {
          "time": 163.35,
          "text": "he lost his uniform and became more"
        },
        {
          "time": 167.45,
          "text": "and more intelligent and open-minded."
        },
        {
          "time": 175.19,
          "text": "I'm not."
        },
        {
          "time": 183.09,
          "text": "Yes, they were. I'm a genius."
        },
        {
          "time": 191.03,
          "text": "Best in the world, I don't know"
        },
        {
          "time": 196.66,
          "text": "I'm sure of all you have."
        },
        {
          "time": 209.46,
          "text": "I'm sorry."
        }
      ],
      "verse": [],
      "collage": "soviet-sunset"
    },
    {
      "slug": "stations-of-comfort",
      "garmentNo": "05",
      "titleLines": [
        "Stations of Comfort"
      ],
      "keyword": "andy05",
      "photo": {
        "src": "/images/room-05-photo-sculpture.png",
        "alt": "Black-and-white photo of a concrete sculpture between bushes in front of a housing block",
        "width": 122,
        "height": 165
      },
      "track": "/audio/stations-of-comfort-track.m4a",
      "lyrics": [
        {
          "time": 7.12,
          "text": "Your beloved object."
        },
        {
          "time": 9.27,
          "text": "on display."
        },
        {
          "time": 11.86,
          "text": "Yes."
        },
        {
          "time": 13.62,
          "text": "and our music is displayed in the showcase."
        },
        {
          "time": 18.87,
          "text": "A face of sweetness."
        },
        {
          "time": 21.33,
          "text": "The streets?"
        },
        {
          "time": 22.9,
          "text": "with stations of comfort."
        },
        {
          "time": 26.61,
          "text": "Roses with sounds."
        },
        {
          "time": 29.4,
          "text": "my faded colors"
        },
        {
          "time": 32.82,
          "text": "Not spravazi, this hook is wonka."
        },
        {
          "time": 37.97,
          "text": "Melody of the step and the step away."
        },
        {
          "time": 43.38,
          "text": "The melody of entering and leaving."
        },
        {
          "time": 50.07,
          "text": "At least my predishm naho jasso."
        },
        {
          "time": 55.67,
          "text": "nad sklenicí života."
        },
        {
          "time": 60.92,
          "text": "The smell of old shoes."
        },
        {
          "time": 67.67,
          "text": "He's gonna say."
        },
        {
          "time": 72.79,
          "text": "You drank too much time."
        },
        {
          "time": 79.44,
          "text": "over the glass of life."
        },
        {
          "time": 85.04,
          "text": "smell of old buildings."
        },
        {
          "time": 91.51,
          "text": "imprint of all of us."
        },
        {
          "time": 95.44,
          "text": "in the shadows"
        },
        {
          "time": 101.3,
          "text": "Gotta make your pounds"
        },
        {
          "time": 104.53,
          "text": "Between walls, between us, find examples of your trust."
        },
        {
          "time": 116.34,
          "text": "And we broke up."
        },
        {
          "time": 118.52,
          "text": "Yes."
        },
        {
          "time": 121.11,
          "text": "has us out."
        },
        {
          "time": 124.88,
          "text": "They are bound by their rituals."
        },
        {
          "time": 140.98,
          "text": "Oh"
        },
        {
          "time": 167.99,
          "text": "Now can people find their justice?"
        },
        {
          "time": 173.68,
          "text": "Yes, yes."
        },
        {
          "time": 176.98,
          "text": "I'm keeping my mind in my system."
        },
        {
          "time": 186,
          "text": "Thank you."
        },
        {
          "time": 190.45,
          "text": "La la la la la la la la la, you can't stop the blast"
        }
      ],
      "verse": [],
      "collage": "stations-of-comfort"
    },
    {
      "slug": "symmetrica",
      "garmentNo": "06",
      "titleLines": [
        "Symmetrica"
      ],
      "keyword": "andy06",
      "photo": {
        "src": "/images/room-06-photo-tower.png",
        "alt": "Black-and-white photo of a long housing block above trees",
        "width": 275,
        "height": 250
      },
      "track": "/audio/symmetrica-track.m4a",
      "lyrics": [
        {
          "time": 50.71,
          "text": "Modern method of transport is used to build a large settlement for 50,000 inhabitants."
        },
        {
          "time": 70.77,
          "text": "Propanisat is its omnivore."
        },
        {
          "time": 89.43,
          "text": "that exposed me."
        },
        {
          "time": 94.36,
          "text": "For life itself."
        },
        {
          "time": 97.36,
          "text": "where I see the meaning of myself being one with stone."
        },
        {
          "time": 102.71,
          "text": "Taste yourself."
        },
        {
          "time": 105.81,
          "text": "The recognition."
        },
        {
          "time": 108.4,
          "text": "of oneself"
        },
        {
          "time": 111.09,
          "text": "I thought I was going to..."
        },
        {
          "time": 113.75,
          "text": "Such as this one here."
        },
        {
          "time": 116.79,
          "text": "Where is this guy?"
        },
        {
          "time": 119.57,
          "text": "Yeah, I'm in"
        },
        {
          "time": 125.2,
          "text": "Today, the first 10,000 inhabitants have found their new home."
        },
        {
          "time": 135.22,
          "text": "And as I stood there, in the dark,"
        },
        {
          "time": 137.76,
          "text": "I saw that I was standing in a world made out of patterns,"
        },
        {
          "time": 142.1,
          "text": "light and structure."
        },
        {
          "time": 143.59,
          "text": "Projected onto the walls, I could no longer see the skies."
        },
        {
          "time": 149.01,
          "text": "Ceramic pie square,"
        },
        {
          "time": 150.21,
          "text": "that is the definition of who I am and will be."
        },
        {
          "time": 153.65,
          "text": "What I will dream of, where I will go."
        },
        {
          "time": 156.31,
          "text": "And staining ideals, I will go wherever you can trust thorns."
        },
        {
          "time": 161.3,
          "text": "Spin Kopa, standing on the sea."
        },
        {
          "time": 164.79,
          "text": "prettier than any place."
        },
        {
          "time": 166.94,
          "text": "You will never stop shaping me."
        },
        {
          "time": 169.72,
          "text": "The one farm that is me."
        }
      ],
      "verse": [],
      "collage": "symmetrica"
    },
    {
      "slug": "aliens-and-herons",
      "garmentNo": "07",
      "titleLines": [
        "Aliens and Herons"
      ],
      "keyword": "andy07",
      "photo": {
        "src": "/images/room-07-photo-hand.png",
        "alt": "Black-and-white photo of a hand resting on a weathered stone sculpture",
        "width": 306,
        "height": 451
      },
      "track": "/audio/aliens-and-herons-track.m4a",
      "lyrics": [
        {
          "time": 90.45,
          "text": "creating imagery."
        },
        {
          "time": 92.05,
          "text": "Thank you."
        },
        {
          "time": 95.83,
          "text": "leaving"
        },
        {
          "time": 98.07,
          "text": "Your silhouette."
        },
        {
          "time": 100.72,
          "text": "in that black and white tone"
        },
        {
          "time": 105.75,
          "text": "I'm exposing."
        },
        {
          "time": 108.34,
          "text": "All light."
        },
        {
          "time": 110.61,
          "text": "Náruči včerejších d"
        },
        {
          "time": 113.27,
          "text": "That's why I have you."
        },
        {
          "time": 115.86,
          "text": "Do you have a tabby"
        },
        {
          "time": 118.2,
          "text": "Such a scary expression."
        },
        {
          "time": 120.79,
          "text": "I see my days."
        },
        {
          "time": 123.38,
          "text": "Great"
        },
        {
          "time": 125.91,
          "text": "in the familiarity"
        },
        {
          "time": 133.46,
          "text": "In the crystal floor"
        },
        {
          "time": 138.71,
          "text": "My son."
        },
        {
          "time": 143.44,
          "text": "Cok ticha odráží se."
        },
        {
          "time": 148.6,
          "text": "I'm closer."
        },
        {
          "time": 151.06,
          "text": "The sound of silence echoes."
        },
        {
          "time": 155.99,
          "text": "falling to their ground."
        },
        {
          "time": 163.76,
          "text": "I'll be at the cabin."
        },
        {
          "time": 166.68,
          "text": "Can't speak."
        },
        {
          "time": 168.79,
          "text": "Space to high."
        },
        {
          "time": 171.38,
          "text": "I'm fragile."
        },
        {
          "time": 178.96,
          "text": "Basically, it's a minute."
        },
        {
          "time": 181.56,
          "text": "Like this stillness? Is there only blocks?"
        },
        {
          "time": 194.16,
          "text": "and blocks"
        },
        {
          "time": 196.37,
          "text": "And you're better now."
        }
      ],
      "verse": [],
      "collage": "aliens-and-herons"
    },
    {
      "slug": "philosophy-of-form",
      "garmentNo": "08",
      "titleLines": [
        "Philosophy of Form"
      ],
      "keyword": "andy08",
      "photo": {
        "src": "/images/room-08-photo-shadows.png",
        "alt": "Black-and-white photo of a tower block with leaf shadows across it",
        "width": 350,
        "height": 446
      },
      "track": "/audio/philosophy-of-form-track.m4a",
      "lyrics": [
        {
          "time": 8.6,
          "text": "Walk in between ideas."
        },
        {
          "time": 13.36,
          "text": "Unraveling the narratives of urban life."
        },
        {
          "time": 22.55,
          "text": "formation and transformation of communities."
        },
        {
          "time": 39.54,
          "text": "Multi-faceted tapestry of urban existence."
        },
        {
          "time": 47.96,
          "text": "Go and get him a big building under his feet. A place to sleep."
        },
        {
          "time": 53.27,
          "text": "so that children could play here on the lawn."
        },
        {
          "time": 57.4,
          "text": "Aby sesem vešul slons."
        },
        {
          "time": 73.04,
          "text": "I'm making space for the sun to fit into my concrete jungle,"
        },
        {
          "time": 77.58,
          "text": "for the kids to play on the green grass."
        },
        {
          "time": 81.84,
          "text": "Permit bell."
        },
        {
          "time": 83.76,
          "text": "Acetate panels"
        },
        {
          "time": 98.29,
          "text": "Symmetric fade, refining this."
        },
        {
          "time": 106.1,
          "text": "And the staff? Love you."
        },
        {
          "time": 110.32,
          "text": "Best connection."
        },
        {
          "time": 116.88,
          "text": "Linear perfection. In the space you can see me."
        },
        {
          "time": 122.61,
          "text": "Our principles take shape. Voices speak."
        },
        {
          "time": 128.56,
          "text": "Where Fishing is Misery, Cursing and Diss"
        },
        {
          "time": 134.55,
          "text": "I am the news."
        },
        {
          "time": 137.46,
          "text": "Take a seat."
        },
        {
          "time": 140.56,
          "text": "He's here."
        },
        {
          "time": 142.23,
          "text": "Amen."
        },
        {
          "time": 158.07,
          "text": "Unraveling the narratives"
        },
        {
          "time": 160.31,
          "text": "I've written my..."
        },
        {
          "time": 167.8,
          "text": "the formation and transformation of communities."
        },
        {
          "time": 181.81,
          "text": "multifaceted tapestry of existence."
        },
        {
          "time": 197.08,
          "text": "It's two shapes, but cannot be the same, nor do objects equal."
        },
        {
          "time": 202.14,
          "text": "Concepts, such as shape and number, have to belong to a random,"
        },
        {
          "time": 207.29,
          "text": "beyond sense, and experience."
        },
        {
          "time": 210.48,
          "text": "I love you guys. I love you guys."
        }
      ],
      "verse": [],
      "collage": "philosophy-of-form"
    },
    {
      "slug": "the-signatures",
      "garmentNo": "09",
      "titleLines": [
        "The Signatures"
      ],
      "keyword": "andy09",
      "photo": {
        "src": "/images/room-09-graffiti.png",
        "alt": "Black-and-white photos of graffiti tags layered over each other",
        "width": 421,
        "height": 553
      },
      "track": "/audio/the-signatures-track.m4a",
      "lyrics": [
        {
          "time": 9.65,
          "text": "Samostatný život svój."
        },
        {
          "time": 11.8,
          "text": "See you come time."
        },
        {
          "time": 13.59,
          "text": "I'm not the"
        },
        {
          "time": 16.79,
          "text": "and my own system breaking yours."
        },
        {
          "time": 21.59,
          "text": "Given clues, I divide streets from greeners."
        },
        {
          "time": 26.52,
          "text": "Damn you, Star Momma Pong."
        },
        {
          "time": 28.92,
          "text": "The Ritz give conflict to."
        },
        {
          "time": 31.28,
          "text": "As I am never known, I arise."
        },
        {
          "time": 36.37,
          "text": "where the void appears."
        },
        {
          "time": 41.17,
          "text": "I've been the world the way I see it. My art is in my face."
        },
        {
          "time": 46.16,
          "text": "Can you hear? Tonight I'm releasing the imprint of my mind."
        },
        {
          "time": 53.36,
          "text": "And the messages, I will always write for you to find after all."
        },
        {
          "time": 60.72,
          "text": "This is the land of me people. Yes, the image is there."
        },
        {
          "time": 70.55,
          "text": "My being seems so real."
        },
        {
          "time": 75.57,
          "text": "I'm the voice of the city, can you feel?"
        },
        {
          "time": 81.43,
          "text": "Can you feel?"
        },
        {
          "time": 97.62,
          "text": "I'm standing in time."
        },
        {
          "time": 104.95,
          "text": "You are the heart of my soul."
        },
        {
          "time": 107.19,
          "text": "Without any silence."
        },
        {
          "time": 108.73,
          "text": "You want to escape from the night."
        },
        {
          "time": 111.35,
          "text": "Heart is running away from the night."
        },
        {
          "time": 114.64,
          "text": "Put the light on when the sun is about to rise."
        },
        {
          "time": 119.54,
          "text": "I bend the roadway I see My artist in my face"
        },
        {
          "time": 124.56,
          "text": "Can you hear it? The night I released the imprint of my mind"
        },
        {
          "time": 130.77,
          "text": "Messages."
        },
        {
          "time": 134.26,
          "text": "So I'll always wait for you to find us all."
        },
        {
          "time": 139.14,
          "text": "This is the land of my people."
        },
        {
          "time": 142.54,
          "text": "Here's the images I've released."
        },
        {
          "time": 146.39,
          "text": "We found this camera."
        },
        {
          "time": 148.92,
          "text": "My being seems so real."
        },
        {
          "time": 153.94,
          "text": "I'm the voice of the city. Can you feel?"
        }
      ],
      "verse": [],
      "collage": "the-signatures"
    },
    {
      "slug": "funkce",
      "garmentNo": "10",
      "titleLines": [
        "Funkce"
      ],
      "keyword": "andy10",
      "photo": {
        "src": "/images/room-10-photo-family.png",
        "alt": "Faded colour photo of a family around a coffee table with bottles and fruit",
        "width": 394,
        "height": 270
      },
      "track": "/audio/funkce-track.m4a",
      "lyrics": [
        {
          "time": 8.02,
          "text": "in the utilitarian landscape."
        },
        {
          "time": 12.5,
          "text": "We quietly observe."
        },
        {
          "time": 14.68,
          "text": "Our grandmas."
        },
        {
          "time": 16.85,
          "text": "the purpose of material"
        },
        {
          "time": 21.36,
          "text": "Rhythmus."
        },
        {
          "time": 23.44,
          "text": "Brilliant, my feng tse."
        },
        {
          "time": 25.68,
          "text": "Beauty."
        },
        {
          "time": 27.54,
          "text": "an old principle of naivety."
        },
        {
          "time": 33.78,
          "text": "Without simplicity."
        },
        {
          "time": 38.07,
          "text": "We have built a modern"
        },
        {
          "time": 42.71,
          "text": "universe."
        },
        {
          "time": 46.74,
          "text": "Water Universe."
        },
        {
          "time": 51.03,
          "text": "A different angle."
        },
        {
          "time": 57.52,
          "text": "In our never-hate questions, I'm barking."
        },
        {
          "time": 61.72,
          "text": "For the whole of New Visions, one more."
        },
        {
          "time": 68.02,
          "text": "Study a language."
        },
        {
          "time": 70.39,
          "text": "and it's Prince."
        },
        {
          "time": 72.5,
          "text": "It's a novelty."
        },
        {
          "time": 74.58,
          "text": "Visual America."
        },
        {
          "time": 76.79,
          "text": "It's a way"
        },
        {
          "time": 78.96,
          "text": "to behave."
        },
        {
          "time": 81.11,
          "text": "In space."
        },
        {
          "time": 99.22,
          "text": "Thank you."
        },
        {
          "time": 127.03,
          "text": "If you are a member of the community, you will"
        },
        {
          "time": 129.56,
          "text": "Because they, new forms, hide in their tasks."
        },
        {
          "time": 134.1,
          "text": "So, you also need to understand the term functionalism."
        },
        {
          "time": 138.52,
          "text": "The name for the method was brought to me by a designer with a"
        },
        {
          "time": 142.32,
          "text": "hidden, inherent form."
        },
        {
          "time": 143.67,
          "text": "In other words, the functionalists did not create a functional"
        },
        {
          "time": 147.47,
          "text": "method because they had in mind a better functioning of"
        },
        {
          "time": 150.85,
          "text": "buildings and therefore better users."
        },
        {
          "time": 153.36,
          "text": "mainly because they had a new, strong language that could be"
        },
        {
          "time": 157.82,
          "text": "used in their methodologies."
        }
      ],
      "verse": [],
      "collage": "funkce"
    }
  ]
};
