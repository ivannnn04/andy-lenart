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
  "garments": [
    {
      "slug": "born-by-the-pelican-sculpture",
      "no": "01",
      "titleLines": [
        "Born by the",
        "Pelican Sculpture"
      ],
      "status": "Available · 12 left",
      "cardImage": {
        "src": "/images/garment-01.webp",
        "alt": "Garment 01: white coat with hand-drawn black lettering, worn on concrete steps beneath tower blocks"
      },
      "tagline": "One can depart, but the place does not release you.",
      "price": "£1,500",
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
      "page": true,
      "availability": "Limited edition · 12 remaining",
      "remaining": "12 remaining",
      "size": "One size",
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
      },
      "room": {
        "enabled": true,
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
            "text": "Vytvořeni z betonu,"
          },
          {
            "time": 60.31,
            "text": "nevinnost uzavřena v blocích."
          },
          {
            "time": 70.68,
            "text": "The cave that held you at your arrival."
          },
          {
            "time": 76.18,
            "text": "The one you aimed for when falling endlessly,"
          },
          {
            "time": 82.77,
            "text": "coming back persistently."
          },
          {
            "time": 87.28,
            "text": "Recognition and the weight of places."
          },
          {
            "time": 95.03,
            "text": "Život vás všech"
          },
          {
            "time": 97.56,
            "text": "v částech nás samých."
          },
          {
            "time": 100.72,
            "text": "V kruzích."
          },
          {
            "time": 108.6,
            "text": "The circles of livelihood"
          },
          {
            "time": 111.38,
            "text": "nad námi proudí."
          },
          {
            "time": 114.39,
            "text": "S životem v rukou,"
          },
          {
            "time": 116.88,
            "text": "we are reaching for unity."
          },
          {
            "time": 120.37,
            "text": "Lying in squares made out of concrete."
          },
          {
            "time": 127.86,
            "text": "You are feeling the warmth of your own echo."
          },
          {
            "time": 132.88,
            "text": "Tváře, co tě zformovaly."
          },
          {
            "time": 136.88,
            "text": "My endless mirrors that could not feel more distant."
          },
          {
            "time": 141.59,
            "text": "Yet it is me, it is us."
          },
          {
            "time": 159.41,
            "text": "I am guiding you home"
          },
          {
            "time": 162.9,
            "text": "Já vedu tě domů"
          },
          {
            "time": 165.17,
            "text": "Where the world is open"
          },
          {
            "time": 168.6,
            "text": "Kde svět je otevřen"
          },
          {
            "time": 171.96,
            "text": "There are four walls"
          },
          {
            "time": 174.2,
            "text": "Jsou tam čtyři stěny"
          },
          {
            "time": 177.24,
            "text": "Where you will find"
          },
          {
            "time": 179.8,
            "text": "Kde najdeš"
          },
          {
            "time": 183,
            "text": "Your endless time"
          },
          {
            "time": 185,
            "text": "Tvůj nekonečný čas"
          },
          {
            "time": 187,
            "text": "In one moment"
          },
          {
            "time": 189.2,
            "text": "V jednom momentu"
          },
          {
            "time": 191.6,
            "text": "The one you never believed was yours"
          },
          {
            "time": 195.5,
            "text": "Ten, co jsi nikdy nevěřil, že ti patřil"
          },
          {
            "time": 198.9,
            "text": "And you might have been right all along"
          },
          {
            "time": 202.52,
            "text": "A možná jsi měl celou dobu pravdu"
          }
        ],
        "verse": [
          "I look for truth in the early 2000s.",
          "I look for reimagined fragments of me,",
          "and the rest of you, in the simplicity of early technology.",
          "I pull the white noise closer to me, hoping it will take me along."
        ],
        "collage": "pelican"
      }
    },
    {
      "slug": "paper-walls",
      "no": "02",
      "titleLines": [
        "Paper Walls"
      ],
      "status": "Next release · Notify me",
      "statusHref": "#stay-connected",
      "tagline": "Not yet released",
      "price": "",
      "preview": {
        "src": "/audio/garment-02-preview.aac",
        "duration": "0:30"
      },
      "page": false,
      "availability": "",
      "remaining": "",
      "size": "One size",
      "gallery": [],
      "requestPhoto": 0,
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
        "paragraphs": [],
        "image": {
          "alt": "",
          "width": 1836,
          "height": 1056
        },
        "quote": ""
      },
      "credits": [],
      "inside": {
        "title": [],
        "paragraphs": [],
        "image": {
          "alt": "",
          "width": 560,
          "height": 360
        }
      },
      "room": {
        "enabled": true,
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
            "text": "Sdíleni se stěnami."
          },
          {
            "time": 30.04,
            "text": "My life overlapping with yours."
          },
          {
            "time": 34.9,
            "text": "The beautiful dance of voices."
          },
          {
            "time": 39.6,
            "text": "Your life travels so far,"
          },
          {
            "time": 42.87,
            "text": "I can hear its story."
          },
          {
            "time": 48.08,
            "text": "Spojeni linkami zvuku,"
          },
          {
            "time": 52.02,
            "text": "zamotáni v pavučině osudů druhých."
          },
          {
            "time": 58.8,
            "text": "About you, with you whilst apart."
          },
          {
            "time": 64.5,
            "text": "Whilst apart…"
          },
          {
            "time": 71.48,
            "text": "The sound of your laugh,"
          },
          {
            "time": 76.34,
            "text": "the sound of your crying,"
          },
          {
            "time": 79.16,
            "text": "the sound of your exchange."
          },
          {
            "time": 84.37,
            "text": "Kde můj život začíná a kde končí tvůj."
          },
          {
            "time": 88.95,
            "text": "Where my life ends and yours begins."
          },
          {
            "time": 94,
            "text": "Cizinci vesmíru,"
          },
          {
            "time": 95.8,
            "text": "sousedé lidstva."
          },
          {
            "time": 99.64,
            "text": "Šum mého života."
          },
          {
            "time": 104.18,
            "text": "Your eyes reflecting in my window."
          },
          {
            "time": 110.23,
            "text": "Transparent walls holding your hopes."
          },
          {
            "time": 116.28,
            "text": "Every layer with every little story"
          },
          {
            "time": 121.78,
            "text": "and you always trusting them…"
          },
          {
            "time": 128.21,
            "text": "…and you always trusting them."
          },
          {
            "time": 138.64,
            "text": "And when the sun touches the concrete walls,"
          },
          {
            "time": 143.76,
            "text": "you know it’s the morning."
          }
        ],
        "verse": [],
        "collage": "paper-walls"
      }
    },
    {
      "slug": "symmetrica",
      "no": "03",
      "titleLines": [
        "Symmetrica"
      ],
      "status": "Coming soon",
      "tagline": "Not yet released",
      "price": "",
      "preview": {
        "src": "/audio/garment-03-preview.aac",
        "duration": "0:30"
      },
      "page": false,
      "availability": "",
      "remaining": "",
      "size": "One size",
      "gallery": [],
      "requestPhoto": 0,
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
        "paragraphs": [],
        "image": {
          "alt": "",
          "width": 1836,
          "height": 1056
        },
        "quote": ""
      },
      "credits": [],
      "inside": {
        "title": [],
        "paragraphs": [],
        "image": {
          "alt": "",
          "width": 560,
          "height": 360
        }
      },
      "room": {
        "enabled": true,
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
            "text": "Moderní proudovou metodou tu budují sídliště"
          },
          {
            "time": 54.3,
            "text": "pro padesát tisíc obyvatel."
          },
          {
            "time": 70.77,
            "text": "Pro padesát tisíc obyvatel."
          },
          {
            "time": 87.9,
            "text": "Of the colour that exposed me"
          },
          {
            "time": 94.36,
            "text": "to life itself,"
          },
          {
            "time": 97.36,
            "text": "where I see the meaning of myself, being one with stone"
          },
          {
            "time": 102.71,
            "text": "that is yourself,"
          },
          {
            "time": 105.81,
            "text": "the recognition of oneself."
          },
          {
            "time": 111.09,
            "text": "Poutavé vzory,"
          },
          {
            "time": 113.75,
            "text": "součástí sebe."
          },
          {
            "time": 116.79,
            "text": "Rozeznání mě a tebe."
          },
          {
            "time": 125.2,
            "text": "Už dnes si našlo prvních deset tisíc obyvatel"
          },
          {
            "time": 128.1,
            "text": "svůj nový domov."
          },
          {
            "time": 135.22,
            "text": "And as I stood there in the dark,"
          },
          {
            "time": 137.76,
            "text": "I saw that I was standing in a world made out of patterns,"
          },
          {
            "time": 142.1,
            "text": "light, and structure."
          },
          {
            "time": 143.59,
            "text": "Projected onto the walls, I could no longer see the skies."
          },
          {
            "time": 149.01,
            "text": "Surrounded by a square"
          },
          {
            "time": 150.21,
            "text": "that is the definition of who I am and will be,"
          },
          {
            "time": 153.65,
            "text": "what I will dream of, where I will go."
          },
          {
            "time": 156.31,
            "text": "Entertaining ideas, I will go wherever a contrast starts."
          },
          {
            "time": 161.3,
            "text": "Being called back, standing on the sea,"
          },
          {
            "time": 164.79,
            "text": "further than any place."
          },
          {
            "time": 166.94,
            "text": "You will never stop shaping me,"
          },
          {
            "time": 169.72,
            "text": "the one form that is me."
          },
          {
            "time": 173,
            "text": "The neon signs, the neon signs."
          },
          {
            "time": 178.4,
            "text": "The neon signs, the neon signs."
          }
        ],
        "verse": [],
        "collage": "symmetrica"
      }
    },
    {
      "slug": "aliens-and-herons",
      "no": "04",
      "titleLines": [
        "Aliens and Herons"
      ],
      "cardTitle": "Aliens and Herons (Vetřelci a volavky)",
      "titleSize": 20,
      "status": "Coming soon",
      "tagline": "Not yet released",
      "price": "",
      "preview": {
        "src": "/audio/garment-04-preview.aac",
        "duration": "0:30"
      },
      "page": false,
      "availability": "",
      "remaining": "",
      "size": "One size",
      "gallery": [],
      "requestPhoto": 0,
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
        "paragraphs": [],
        "image": {
          "alt": "",
          "width": 1836,
          "height": 1056
        },
        "quote": ""
      },
      "credits": [],
      "inside": {
        "title": [],
        "paragraphs": [],
        "image": {
          "alt": "",
          "width": 560,
          "height": 360
        }
      },
      "room": {
        "enabled": true,
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
            "text": "Creating imagery,"
          },
          {
            "time": 95.4,
            "text": "I am leaving your silhouette."
          },
          {
            "time": 100.72,
            "text": "In the black and white tone,"
          },
          {
            "time": 105.75,
            "text": "I am exposing all light."
          },
          {
            "time": 110.61,
            "text": "V náručí včerejších dnů,"
          },
          {
            "time": 113.27,
            "text": "bez pohybu,"
          },
          {
            "time": 115.86,
            "text": "duch doby."
          },
          {
            "time": 118.2,
            "text": "V sochařské expresi,"
          },
          {
            "time": 120.79,
            "text": "I see my days"
          },
          {
            "time": 123.38,
            "text": "engraved in the familiarity of stone."
          },
          {
            "time": 133.46,
            "text": "In the crystal form,"
          },
          {
            "time": 138.71,
            "text": "like the last day I saw you."
          },
          {
            "time": 143.44,
            "text": "Zvuk ticha odráží se,"
          },
          {
            "time": 148.6,
            "text": "na zem klesá."
          },
          {
            "time": 151.06,
            "text": "The sound of silence echoes,"
          },
          {
            "time": 155.99,
            "text": "falling to the ground."
          },
          {
            "time": 163.76,
            "text": "Objekty kamene,"
          },
          {
            "time": 166.68,
            "text": "tvar dětství,"
          },
          {
            "time": 168.79,
            "text": "space to hide."
          },
          {
            "time": 171.38,
            "text": "Němá tvář s anonymní tváří,"
          },
          {
            "time": 175.4,
            "text": "showing a fragile face in solidity."
          },
          {
            "time": 181.56,
            "text": "Placed in stillness, surrounding blocks and land,"
          },
          {
            "time": 186.6,
            "text": "our monumental art."
          },
          {
            "time": 192.9,
            "text": "With roots, facing blocks and your windows…"
          },
          {
            "time": 199.6,
            "text": "…your windows."
          }
        ],
        "verse": [],
        "collage": "aliens-and-herons"
      }
    },
    {
      "slug": "the-blueprint",
      "no": "05",
      "titleLines": [
        "The Blueprint"
      ],
      "status": "Coming soon",
      "dimmed": true,
      "tagline": "Not yet released",
      "price": "",
      "preview": {
        "src": "/audio/garment-05-preview.aac",
        "duration": "0:30"
      },
      "page": false,
      "availability": "",
      "remaining": "",
      "size": "One size",
      "gallery": [],
      "requestPhoto": 0,
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
        "paragraphs": [],
        "image": {
          "alt": "",
          "width": 1836,
          "height": 1056
        },
        "quote": ""
      },
      "credits": [],
      "inside": {
        "title": [],
        "paragraphs": [],
        "image": {
          "alt": "",
          "width": 560,
          "height": 360
        }
      },
      "room": {
        "enabled": true,
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
      }
    },
    {
      "slug": "soviet-sunset",
      "no": "06",
      "titleLines": [
        "Soviet Sunset"
      ],
      "status": "Coming soon",
      "dimmed": true,
      "tagline": "Not yet released",
      "price": "",
      "preview": {
        "src": "/audio/garment-06-preview.aac",
        "duration": "0:30"
      },
      "page": false,
      "availability": "",
      "remaining": "",
      "size": "One size",
      "gallery": [],
      "requestPhoto": 0,
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
        "paragraphs": [],
        "image": {
          "alt": "",
          "width": 1836,
          "height": 1056
        },
        "quote": ""
      },
      "credits": [],
      "inside": {
        "title": [],
        "paragraphs": [],
        "image": {
          "alt": "",
          "width": 560,
          "height": 360
        }
      },
      "room": {
        "enabled": true,
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
            "text": "Architektonická tvorba není nikdy plně svobodná,"
          },
          {
            "time": 54.42,
            "text": "je to tvorba kolektivní."
          },
          {
            "time": 81.2,
            "text": "Standing"
          },
          {
            "time": 87.06,
            "text": "on the other side,"
          },
          {
            "time": 91.86,
            "text": "We witness time passing."
          },
          {
            "time": 103.35,
            "text": "Frozen in moments,"
          },
          {
            "time": 111.67,
            "text": "frozen in patterns."
          },
          {
            "time": 120.85,
            "text": "Vždy byli jsme spolu,"
          },
          {
            "time": 128.53,
            "text": "v řadách,"
          },
          {
            "time": 134.64,
            "text": "ve slibech a naději."
          },
          {
            "time": 141.5,
            "text": "Ve slibech a naději."
          },
          {
            "time": 160.66,
            "text": "Použitím věžových domů"
          },
          {
            "time": 163.35,
            "text": "ztratilo sídliště uniformní vzhled, stalo se vzdušnějším"
          },
          {
            "time": 167.45,
            "text": "a otevřelo pohled do krajiny."
          },
          {
            "time": 175.19,
            "text": "Ve slibech a naději."
          },
          {
            "time": 183.09,
            "text": "Ve slibech a naději."
          },
          {
            "time": 191.03,
            "text": "Ve slibech a naději."
          },
          {
            "time": 196.66,
            "text": "Ve slibech a naději…"
          },
          {
            "time": 209.46,
            "text": "…a naději."
          }
        ],
        "verse": [],
        "collage": "soviet-sunset"
      }
    },
    {
      "slug": "stations-of-comfort",
      "no": "07",
      "titleLines": [
        "Stations of Comfort"
      ],
      "status": "Coming soon",
      "dimmed": true,
      "tagline": "Not yet released",
      "price": "",
      "preview": {
        "src": "/audio/garment-07-preview.aac",
        "duration": "0:30"
      },
      "page": false,
      "availability": "",
      "remaining": "",
      "size": "One size",
      "gallery": [],
      "requestPhoto": 0,
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
        "paragraphs": [],
        "image": {
          "alt": "",
          "width": 1836,
          "height": 1056
        },
        "quote": ""
      },
      "credits": [],
      "inside": {
        "title": [],
        "paragraphs": [],
        "image": {
          "alt": "",
          "width": 560,
          "height": 360
        }
      },
      "room": {
        "enabled": true,
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
            "text": "Your beloved objects on display."
          },
          {
            "time": 11.86,
            "text": "Čas a naše léta vystavena ve vitrínách."
          },
          {
            "time": 18.87,
            "text": "The space of sweetness,"
          },
          {
            "time": 21.33,
            "text": "the streets with stations of comfort."
          },
          {
            "time": 26.61,
            "text": "Roses with sounds, my faded colours."
          },
          {
            "time": 32.82,
            "text": "Noc provází ty zvuky zvonku."
          },
          {
            "time": 37.97,
            "text": "Melodie vstupu a odchodu."
          },
          {
            "time": 43.38,
            "text": "The melody of entering and leaving."
          },
          {
            "time": 50.07,
            "text": "Vypili jsme příliš mnoho času"
          },
          {
            "time": 55.67,
            "text": "nad sklenicí života."
          },
          {
            "time": 60.92,
            "text": "Vůně starých budov,"
          },
          {
            "time": 67.67,
            "text": "otisk nás všech."
          },
          {
            "time": 72.79,
            "text": "We’ve drunk too much time"
          },
          {
            "time": 79.44,
            "text": "over the glass of life."
          },
          {
            "time": 85.04,
            "text": "The smell of old buildings,"
          },
          {
            "time": 91.51,
            "text": "the imprint of all of us."
          },
          {
            "time": 95.44,
            "text": "In the shadows of long night,"
          },
          {
            "time": 101.3,
            "text": "glass bottles following your path,"
          },
          {
            "time": 104.53,
            "text": "between walls, between us,"
          },
          {
            "time": 108.5,
            "text": "finding symbols of your trust."
          },
          {
            "time": 116.34,
            "text": "Místo ztvárněno jen pro nás,"
          },
          {
            "time": 121.11,
            "text": "čas setkání znovu a zas,"
          },
          {
            "time": 124.88,
            "text": "bound to the rituals,"
          },
          {
            "time": 127.9,
            "text": "we are bound to the rituals."
          },
          {
            "time": 140.98,
            "text": "Through changing times,"
          },
          {
            "time": 145.46,
            "text": "the years that passed,"
          },
          {
            "time": 151.03,
            "text": "I am the temple with the neon signs."
          },
          {
            "time": 155.3,
            "text": "Through changing times,"
          },
          {
            "time": 160.28,
            "text": "the years that passed,"
          },
          {
            "time": 163.44,
            "text": "I am the temple with the neon signs."
          },
          {
            "time": 167.99,
            "text": "Through changing times,"
          },
          {
            "time": 173.68,
            "text": "the years that passed,"
          },
          {
            "time": 176.98,
            "text": "I am the temple with the neon signs."
          },
          {
            "time": 186,
            "text": "Through changing times,"
          },
          {
            "time": 190.45,
            "text": "the years that passed,"
          },
          {
            "time": 195,
            "text": "I am the temple with the neon signs."
          }
        ],
        "verse": [],
        "collage": "stations-of-comfort"
      }
    },
    {
      "slug": "philosophy-of-form",
      "no": "08",
      "titleLines": [
        "Philosophy of Form"
      ],
      "status": "Coming soon",
      "dimmed": true,
      "tagline": "Not yet released",
      "price": "",
      "preview": {
        "src": "/audio/garment-08-preview.aac",
        "duration": "0:30"
      },
      "page": false,
      "availability": "",
      "remaining": "",
      "size": "One size",
      "gallery": [],
      "requestPhoto": 0,
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
        "paragraphs": [],
        "image": {
          "alt": "",
          "width": 1836,
          "height": 1056
        },
        "quote": ""
      },
      "credits": [],
      "inside": {
        "title": [],
        "paragraphs": [],
        "image": {
          "alt": "",
          "width": 560,
          "height": 360
        }
      },
      "room": {
        "enabled": true,
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
            "text": "Walking between ideas,"
          },
          {
            "time": 13.36,
            "text": "unraveling the narratives of urban life."
          },
          {
            "time": 22.55,
            "text": "The formation and transformation of communities."
          },
          {
            "time": 39.54,
            "text": "The multifaceted tapestry of urban existence."
          },
          {
            "time": 47.96,
            "text": "Roste mu pod rukama veliká stavebnice,"
          },
          {
            "time": 50.9,
            "text": "město z panelu."
          },
          {
            "time": 53.27,
            "text": "Aby si tu děti mohly hrát na trávníku"
          },
          {
            "time": 57.4,
            "text": "a aby se sem vešlo slunce."
          },
          {
            "time": 73.04,
            "text": "I am making space for the sun to fit into my concrete jungle."
          },
          {
            "time": 77.58,
            "text": "For the kids to play on the green grass,"
          },
          {
            "time": 81.84,
            "text": "for me to build a city of panels."
          },
          {
            "time": 98.29,
            "text": "Symmetric fate with lively structure,"
          },
          {
            "time": 106.1,
            "text": "with voices in the mirror line."
          },
          {
            "time": 110.32,
            "text": "With connection,"
          },
          {
            "time": 116.88,
            "text": "linear perfection."
          },
          {
            "time": 119.3,
            "text": "In the space of design"
          },
          {
            "time": 122.61,
            "text": "where principles take shape,"
          },
          {
            "time": 125,
            "text": "lies a system where visions escape."
          },
          {
            "time": 128.56,
            "text": "Curves and angles, harmonious in sight,"
          },
          {
            "time": 134.55,
            "text": "creating symphony of form and light."
          },
          {
            "time": 158.07,
            "text": "Unraveling the narratives of urban life."
          },
          {
            "time": 167.8,
            "text": "The formation and transformation of communities."
          },
          {
            "time": 181.81,
            "text": "The multifaceted tapestry of urban existence."
          },
          {
            "time": 197.08,
            "text": "Since two shapes cannot be the same, nor two objects equal,"
          },
          {
            "time": 202.14,
            "text": "concepts such as shape and number have to belong to a realm"
          },
          {
            "time": 207.29,
            "text": "beyond sense and experience."
          },
          {
            "time": 210.48,
            "text": "The realm of forms and ideas."
          }
        ],
        "verse": [],
        "collage": "philosophy-of-form"
      }
    },
    {
      "slug": "the-signatures",
      "no": "09",
      "titleLines": [
        "The Signatures"
      ],
      "status": "Coming soon",
      "dimmed": true,
      "tagline": "Not yet released",
      "price": "",
      "preview": {
        "src": "/audio/garment-09-preview.aac",
        "duration": "0:30"
      },
      "page": false,
      "availability": "",
      "remaining": "",
      "size": "One size",
      "gallery": [],
      "requestPhoto": 0,
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
        "paragraphs": [],
        "image": {
          "alt": "",
          "width": 1836,
          "height": 1056
        },
        "quote": ""
      },
      "credits": [],
      "inside": {
        "title": [],
        "paragraphs": [],
        "image": {
          "alt": "",
          "width": 560,
          "height": 360
        }
      },
      "room": {
        "enabled": true,
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
            "text": "Samostatný život svůj."
          },
          {
            "time": 11.8,
            "text": "Vznikám tam, kde prázdnota se jeví."
          },
          {
            "time": 16.79,
            "text": "I am my own system breaking yours."
          },
          {
            "time": 21.59,
            "text": "Given clues, I divide streets from greyness."
          },
          {
            "time": 26.52,
            "text": "Tvé město, má mapa."
          },
          {
            "time": 28.92,
            "text": "Lyricky v konfliktu,"
          },
          {
            "time": 31.28,
            "text": "jazykem nepoznaným."
          },
          {
            "time": 34,
            "text": "I arise where the void appears."
          },
          {
            "time": 41.17,
            "text": "I paint the world the way I see it,"
          },
          {
            "time": 43.5,
            "text": "my art is in my voice, can you hear it?"
          },
          {
            "time": 47.3,
            "text": "The nights are witnessing the imprint of my mind,"
          },
          {
            "time": 53.36,
            "text": "onto the messages that I will always write for you to find."
          },
          {
            "time": 59.6,
            "text": "After all, this is the land of my people."
          },
          {
            "time": 63.6,
            "text": "Já stojím v čase, který stéká jako chvíle."
          },
          {
            "time": 68.4,
            "text": "With endless canvas, my being seems so real."
          },
          {
            "time": 75.57,
            "text": "I am the voice of the city, can you feel?"
          },
          {
            "time": 97.62,
            "text": "Já stojím v čase, který stéká jako chvíle."
          },
          {
            "time": 104.95,
            "text": "Stopy slova v mlze, ty zrcadlí mé cíle."
          },
          {
            "time": 107.19,
            "text": "Ve stěnách ticha zachytíš odstín noci,"
          },
          {
            "time": 111.35,
            "text": "srdce mi bije s nocí,"
          },
          {
            "time": 114.64,
            "text": "stavíš svět na půdorysu moci."
          },
          {
            "time": 119.54,
            "text": "I paint the world the way I see it,"
          },
          {
            "time": 121.9,
            "text": "my art is in my voice, can you hear it?"
          },
          {
            "time": 125.7,
            "text": "The nights are witnessing the imprint of my mind,"
          },
          {
            "time": 130.77,
            "text": "onto the messages that I will always write for you to find."
          },
          {
            "time": 138.4,
            "text": "After all, this is the land of my people."
          },
          {
            "time": 142.54,
            "text": "Já stojím v čase, který stéká jako chvíle."
          },
          {
            "time": 146.39,
            "text": "With endless canvas, my being seems so real."
          },
          {
            "time": 153.94,
            "text": "I am the voice of the city, can you feel?"
          }
        ],
        "verse": [],
        "collage": "the-signatures"
      }
    },
    {
      "slug": "funkce",
      "no": "10",
      "titleLines": [
        "Funkce"
      ],
      "status": "Coming soon",
      "dimmed": true,
      "tagline": "Not yet released",
      "price": "",
      "preview": {
        "src": "/audio/garment-10-preview.aac",
        "duration": "0:30"
      },
      "page": false,
      "availability": "",
      "remaining": "",
      "size": "One size",
      "gallery": [],
      "requestPhoto": 0,
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
        "paragraphs": [],
        "image": {
          "alt": "",
          "width": 1836,
          "height": 1056
        },
        "quote": ""
      },
      "credits": [],
      "inside": {
        "title": [],
        "paragraphs": [],
        "image": {
          "alt": "",
          "width": 560,
          "height": 360
        }
      },
      "room": {
        "enabled": true,
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
            "text": "In the utilitarian landscape,"
          },
          {
            "time": 12.5,
            "text": "we quietly observe our purpose."
          },
          {
            "time": 16.85,
            "text": "The purpose of material,"
          },
          {
            "time": 21.36,
            "text": "rytmus proměněn ve funkci."
          },
          {
            "time": 25.68,
            "text": "Beauty, an old principle of naivety."
          },
          {
            "time": 33.78,
            "text": "Offering simplicity,"
          },
          {
            "time": 38.07,
            "text": "we have built a modern universe."
          },
          {
            "time": 46.74,
            "text": "A modern universe."
          },
          {
            "time": 51.03,
            "text": "Šedá plocha, popsaná slovy."
          },
          {
            "time": 54.5,
            "text": "A different angle,"
          },
          {
            "time": 57.52,
            "text": "inner knowing."
          },
          {
            "time": 60.2,
            "text": "I am walking through the hall of new visions, one wall."
          },
          {
            "time": 68.02,
            "text": "Study of language and its principle,"
          },
          {
            "time": 72.5,
            "text": "it’s a novelty, visual miracle."
          },
          {
            "time": 76.79,
            "text": "It’s a way to behave in a space,"
          },
          {
            "time": 82.6,
            "text": "your functional grace."
          },
          {
            "time": 88,
            "text": "Never needs questions,"
          },
          {
            "time": 91.5,
            "text": "what works never needs questions."
          },
          {
            "time": 99.22,
            "text": "Never needs questions."
          },
          {
            "time": 120.6,
            "text": "Funkcionalisté ve svém úsilí přivést na svět"
          },
          {
            "time": 123.6,
            "text": "moderní výtvarnou řeč odpovídající nové době"
          },
          {
            "time": 127.03,
            "text": "vycházeli z teze své doktríny."
          },
          {
            "time": 129.56,
            "text": "Totiž že ony nové formy se skrývají ve funkčních úkolech."
          },
          {
            "time": 134.1,
            "text": "Tak je také třeba rozumět termínu funkcionalismus."
          },
          {
            "time": 138.52,
            "text": "Bylo to jméno pro metodu, která měla přivést designéra"
          },
          {
            "time": 141.9,
            "text": "k oněm skrytým inherentním formám."
          },
          {
            "time": 143.67,
            "text": "Jinými slovy, funkcionalisté neplédovali pro funkční metodu"
          },
          {
            "time": 147.47,
            "text": "kvůli tomu, že měli na mysli lepší fungování budov"
          },
          {
            "time": 150.85,
            "text": "a tím dobro uživatelů,"
          },
          {
            "time": 153.36,
            "text": "nýbrž kvůli tomu, že měli na mysli novou výtvarnou řeč,"
          },
          {
            "time": 157.82,
            "text": "která měla touto metodou vzniknout."
          }
        ],
        "verse": [],
        "collage": "funkce"
      }
    }
  ]
};
