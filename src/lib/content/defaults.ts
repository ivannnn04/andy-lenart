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
            "text": "Vytvořeni z betonu,",
            "end": 58.82
          },
          {
            "time": 60.31,
            "text": "nevinnost uzavřena v blocích.",
            "end": 62.66
          },
          {
            "time": 70.68,
            "text": "The cave that held you at your arrival.",
            "end": 74.63
          },
          {
            "time": 76.18,
            "text": "The one you aimed for when falling endlessly,",
            "end": 79.3
          },
          {
            "time": 82.77,
            "text": "coming back persistently.",
            "end": 84.42
          },
          {
            "time": 87.28,
            "text": "Recognition and the weight of places.",
            "end": 90.08
          },
          {
            "time": 95.03,
            "text": "Život vás všech",
            "end": 96.19
          },
          {
            "time": 97.56,
            "text": "v částech nás samých.",
            "end": 99.11
          },
          {
            "time": 100.72,
            "text": "V kruzích.",
            "end": 101.83
          },
          {
            "time": 108.6,
            "text": "The circles of livelihood",
            "end": 110.63
          },
          {
            "time": 111.38,
            "text": "nad námi proudí.",
            "end": 113.47
          },
          {
            "time": 114.39,
            "text": "S životem v rukou,",
            "end": 116
          },
          {
            "time": 116.88,
            "text": "we are reaching for unity.",
            "end": 119.14
          },
          {
            "time": 120.37,
            "text": "Lying in squares made out of concrete.",
            "end": 123.94
          },
          {
            "time": 127.86,
            "text": "You are feeling the warmth of your own echo.",
            "end": 131.27
          },
          {
            "time": 132.88,
            "text": "Tváře, co tě zformovaly.",
            "end": 134.95
          },
          {
            "time": 136.88,
            "text": "My endless mirrors that could not feel more distant.",
            "end": 140.93
          },
          {
            "time": 141.59,
            "text": "Yet it is me, it is us.",
            "end": 146.02
          },
          {
            "time": 159.41,
            "text": "I am guiding you home",
            "end": 162.69
          },
          {
            "time": 162.9,
            "text": "Já vedu tě domů"
          },
          {
            "time": 165.17,
            "text": "Where the world is open",
            "end": 168.45
          },
          {
            "time": 168.6,
            "text": "Kde svět je otevřen"
          },
          {
            "time": 171.96,
            "text": "There are four walls",
            "end": 174.2
          },
          {
            "time": 174.2,
            "text": "Jsou tam čtyři stěny",
            "end": 176.67
          },
          {
            "time": 177.24,
            "text": "Where you will find",
            "end": 179.52
          },
          {
            "time": 179.8,
            "text": "Kde najdeš"
          },
          {
            "time": 183,
            "text": "Your endless time",
            "end": 185
          },
          {
            "time": 185,
            "text": "Tvůj nekonečný čas",
            "end": 187
          },
          {
            "time": 187,
            "text": "In one moment",
            "end": 189.2
          },
          {
            "time": 189.2,
            "text": "V jednom momentu"
          },
          {
            "time": 191.6,
            "text": "The one you never believed was yours",
            "end": 195.23
          },
          {
            "time": 195.5,
            "text": "Ten, co jsi nikdy nevěřil, že ti patřil"
          },
          {
            "time": 198.9,
            "text": "And you might have been right all along",
            "end": 201.38
          },
          {
            "time": 202.52,
            "text": "A možná jsi měl celou dobu pravdu",
            "end": 205.03
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
            "text": "Sdíleni se stěnami.",
            "end": 27.94
          },
          {
            "time": 30.04,
            "text": "My life overlapping with yours.",
            "end": 34.6
          },
          {
            "time": 34.9,
            "text": "The beautiful dance of voices.",
            "end": 36.87
          },
          {
            "time": 39.6,
            "text": "Your life travels so far,",
            "end": 41.79
          },
          {
            "time": 42.87,
            "text": "I can hear its story."
          },
          {
            "time": 48.08,
            "text": "Spojeni linkami zvuku,",
            "end": 49.31
          },
          {
            "time": 52.02,
            "text": "zamotáni v pavučině osudů druhých.",
            "end": 55.04
          },
          {
            "time": 58.8,
            "text": "About you, with you whilst apart.",
            "end": 64.2
          },
          {
            "time": 64.5,
            "text": "Whilst apart…",
            "end": 70.9
          },
          {
            "time": 71.48,
            "text": "The sound of your laugh,",
            "end": 73.57
          },
          {
            "time": 76.34,
            "text": "the sound of your crying,"
          },
          {
            "time": 79.16,
            "text": "the sound of your exchange.",
            "end": 82.37
          },
          {
            "time": 84.37,
            "text": "Kde můj život začíná a kde končí tvůj.",
            "end": 86.85
          },
          {
            "time": 88.95,
            "text": "Where my life ends and yours begins.",
            "end": 91.49
          },
          {
            "time": 94,
            "text": "Cizinci vesmíru,",
            "end": 95.27
          },
          {
            "time": 95.8,
            "text": "sousedé lidstva.",
            "end": 96.96
          },
          {
            "time": 99.64,
            "text": "Šum mého života.",
            "end": 101.76
          },
          {
            "time": 104.18,
            "text": "Your eyes reflecting in my window.",
            "end": 106.53
          },
          {
            "time": 110.23,
            "text": "Transparent walls holding your hopes.",
            "end": 113.54
          },
          {
            "time": 116.28,
            "text": "Every layer with every little story",
            "end": 120.55
          },
          {
            "time": 121.78,
            "text": "and you always trusting them…",
            "end": 125.7
          },
          {
            "time": 128.21,
            "text": "…and you always trusting them.",
            "end": 132.99
          },
          {
            "time": 138.64,
            "text": "And when the sun touches the concrete walls,",
            "end": 143.36
          },
          {
            "time": 143.76,
            "text": "you know it’s the morning.",
            "end": 147.91
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
            "text": "Moderní proudovou metodou tu budují sídliště",
            "end": 54.3
          },
          {
            "time": 54.3,
            "text": "pro padesát tisíc obyvatel.",
            "end": 57.12
          },
          {
            "time": 70.77,
            "text": "Pro padesát tisíc obyvatel.",
            "end": 73.47
          },
          {
            "time": 87.9,
            "text": "Of the colour that exposed me",
            "end": 91.46
          },
          {
            "time": 94.36,
            "text": "to life itself,",
            "end": 96
          },
          {
            "time": 97.36,
            "text": "where I see the meaning of myself, being one with stone",
            "end": 101.79
          },
          {
            "time": 102.71,
            "text": "that is yourself,",
            "end": 104.19
          },
          {
            "time": 105.81,
            "text": "the recognition of oneself.",
            "end": 109.63
          },
          {
            "time": 111.09,
            "text": "Poutavé vzory,",
            "end": 112.67
          },
          {
            "time": 113.75,
            "text": "součástí sebe.",
            "end": 115.43
          },
          {
            "time": 116.79,
            "text": "Rozeznání mě a tebe.",
            "end": 120.48
          },
          {
            "time": 125.2,
            "text": "Už dnes si našlo prvních deset tisíc obyvatel",
            "end": 128.1
          },
          {
            "time": 128.1,
            "text": "svůj nový domov.",
            "end": 129.92
          },
          {
            "time": 135.22,
            "text": "And as I stood there in the dark,",
            "end": 137.76
          },
          {
            "time": 137.76,
            "text": "I saw that I was standing in a world made out of patterns,",
            "end": 142.1
          },
          {
            "time": 142.1,
            "text": "light, and structure.",
            "end": 143.59
          },
          {
            "time": 143.59,
            "text": "Projected onto the walls, I could no longer see the skies.",
            "end": 147.93
          },
          {
            "time": 149.01,
            "text": "Surrounded by a square",
            "end": 150.21
          },
          {
            "time": 150.21,
            "text": "that is the definition of who I am and will be,",
            "end": 153.19
          },
          {
            "time": 153.65,
            "text": "what I will dream of, where I will go.",
            "end": 156.31
          },
          {
            "time": 156.31,
            "text": "Entertaining ideas, I will go wherever a contrast starts.",
            "end": 160.58
          },
          {
            "time": 161.3,
            "text": "Being called back, standing on the sea,",
            "end": 164.23
          },
          {
            "time": 164.79,
            "text": "further than any place.",
            "end": 166.94
          },
          {
            "time": 166.94,
            "text": "You will never stop shaping me,",
            "end": 169.72
          },
          {
            "time": 169.72,
            "text": "the one form that is me.",
            "end": 171.87
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
            "text": "Creating imagery,",
            "end": 92.67
          },
          {
            "time": 95.4,
            "text": "I am leaving your silhouette.",
            "end": 98.91
          },
          {
            "time": 100.72,
            "text": "In the black and white tone,",
            "end": 102.5
          },
          {
            "time": 105.75,
            "text": "I am exposing all light.",
            "end": 109.03
          },
          {
            "time": 110.61,
            "text": "V náručí včerejších dnů,",
            "end": 112.61
          },
          {
            "time": 113.27,
            "text": "bez pohybu,",
            "end": 114.47
          },
          {
            "time": 115.86,
            "text": "duch doby.",
            "end": 116.99
          },
          {
            "time": 118.2,
            "text": "V sochařské expresi,",
            "end": 120.03
          },
          {
            "time": 120.79,
            "text": "I see my days",
            "end": 123.04
          },
          {
            "time": 123.38,
            "text": "engraved in the familiarity of stone.",
            "end": 128
          },
          {
            "time": 133.46,
            "text": "In the crystal form,",
            "end": 135.39
          },
          {
            "time": 138.71,
            "text": "like the last day I saw you."
          },
          {
            "time": 143.44,
            "text": "Zvuk ticha odráží se,",
            "end": 145.57
          },
          {
            "time": 148.6,
            "text": "na zem klesá.",
            "end": 150.11
          },
          {
            "time": 151.06,
            "text": "The sound of silence echoes,",
            "end": 153.6
          },
          {
            "time": 155.99,
            "text": "falling to the ground.",
            "end": 157.51
          },
          {
            "time": 163.76,
            "text": "Objekty kamene,",
            "end": 165.22
          },
          {
            "time": 166.68,
            "text": "tvar dětství,",
            "end": 168.07
          },
          {
            "time": 168.79,
            "text": "space to hide.",
            "end": 170.27
          },
          {
            "time": 171.38,
            "text": "Němá tvář s anonymní tváří,",
            "end": 175.4
          },
          {
            "time": 175.4,
            "text": "showing a fragile face in solidity.",
            "end": 180.58
          },
          {
            "time": 181.56,
            "text": "Placed in stillness, surrounding blocks and land,",
            "end": 185.73
          },
          {
            "time": 186.6,
            "text": "our monumental art."
          },
          {
            "time": 192.9,
            "text": "With roots, facing blocks and your windows…",
            "end": 198.63
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
            "time": 5.22,
            "text": "On a Sunday afternoon: four walls,",
            "end": 8.32
          },
          {
            "time": 8.32,
            "text": "a warm meal, and a circle of family.",
            "end": 11.6
          },
          {
            "time": 17.93,
            "text": "We are hearing a familiar voice coming from the radio.",
            "end": 23.28
          },
          {
            "time": 24.36,
            "text": "Dívají-li se však nepředpojatýma očima,",
            "end": 27.42
          },
          {
            "time": 27.42,
            "text": "nenaleznou stopy po nezaměstnanosti,",
            "end": 30.25
          },
          {
            "time": 30.3,
            "text": "podvyživených dětech či beznadějném stáří.",
            "end": 33.08
          },
          {
            "time": 34.25,
            "text": "And suddenly,",
            "end": 35.76
          },
          {
            "time": 38.15,
            "text": "the sun never left the sky.",
            "end": 40.37
          },
          {
            "time": 41.73,
            "text": "We existed in the ultimate palette of neons.",
            "end": 45.33
          },
          {
            "time": 47.01,
            "text": "We were the chosen ones.",
            "end": 49.78
          },
          {
            "time": 51.49,
            "text": "Doves flying above me,",
            "end": 53.78
          },
          {
            "time": 55.69,
            "text": "I am living in a flawless land.",
            "end": 57.94
          },
          {
            "time": 61.45,
            "text": "Slunce zjevilo se před námi, v blahobytu.",
            "end": 66.13
          },
          {
            "time": 67.88,
            "text": "Vždyť víš, že…v jednotě je síla…",
            "end": 73.11
          },
          {
            "time": 74.44,
            "text": "…že v jednotě je síla.",
            "end": 77.88
          },
          {
            "time": 136.84,
            "text": "The music played, the dance began,",
            "end": 142.2
          },
          {
            "time": 142.7,
            "text": "Community, joyous land,",
            "end": 147.5
          },
          {
            "time": 148.04,
            "text": "The culture rich, the spirit high,",
            "end": 153.04
          },
          {
            "time": 153.57,
            "text": "A chance to forget about asking why.",
            "end": 159
          },
          {
            "time": 159.5,
            "text": "But deep within, the truth did hide,",
            "end": 165.2
          },
          {
            "time": 165.7,
            "text": "The cost of progress, the loss of pride,",
            "end": 171.2
          },
          {
            "time": 171.5,
            "text": "The iron grip, the lack of choice,",
            "end": 179.4
          },
          {
            "time": 179.91,
            "text": "The hidden voices, the silenced noise.",
            "end": 183.45
          },
          {
            "time": 196.04,
            "text": "With passing nights and passing days,",
            "end": 199.92
          },
          {
            "time": 201.16,
            "text": "we’ve created our tomorrows.",
            "end": 204.5
          },
          {
            "time": 209.22,
            "text": "In forgiveness that we couldn’t see…",
            "end": 213.11
          },
          {
            "time": 213.86,
            "text": "…růžový oblak kouře zrozen z našich hodnot.",
            "end": 218.61
          },
          {
            "time": 219.8,
            "text": "The beauty of life stored in the idea of living.",
            "end": 227
          },
          {
            "time": 233.67,
            "text": "And the laughter of all of us",
            "end": 237.26
          },
          {
            "time": 237.26,
            "text": "with the hope in our hearts carried us through.",
            "end": 243.09
          },
          {
            "time": 243.35,
            "text": "Nekonečná naděje a nekonečná láska.",
            "end": 253.84
          },
          {
            "time": 258.29,
            "text": "Materiál změny.",
            "end": 261.5
          },
          {
            "time": 262.3,
            "text": "Ta látka, co hýbe světem.",
            "end": 269.43
          },
          {
            "time": 279.49,
            "text": "The substance that moves the world.",
            "end": 281.46
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
            "text": "Architektonická tvorba není nikdy plně svobodná,",
            "end": 51.3
          },
          {
            "time": 54.42,
            "text": "je to tvorba kolektivní.",
            "end": 57.92
          },
          {
            "time": 81.2,
            "text": "Standing",
            "end": 82.79
          },
          {
            "time": 87.06,
            "text": "on the other side,",
            "end": 88.45
          },
          {
            "time": 91.86,
            "text": "We witness time passing.",
            "end": 93.12
          },
          {
            "time": 103.35,
            "text": "Frozen in moments,",
            "end": 105.12
          },
          {
            "time": 111.67,
            "text": "frozen in patterns.",
            "end": 114.85
          },
          {
            "time": 120.85,
            "text": "Vždy byli jsme spolu,",
            "end": 122.27
          },
          {
            "time": 128.53,
            "text": "v řadách,",
            "end": 129.7
          },
          {
            "time": 134.64,
            "text": "ve slibech a naději.",
            "end": 135.94
          },
          {
            "time": 141.5,
            "text": "Ve slibech a naději."
          },
          {
            "time": 160.66,
            "text": "Použitím věžových domů",
            "end": 163.35
          },
          {
            "time": 163.35,
            "text": "ztratilo sídliště uniformní vzhled, stalo se vzdušnějším",
            "end": 167.45
          },
          {
            "time": 167.45,
            "text": "a otevřelo pohled do krajiny.",
            "end": 171.78
          },
          {
            "time": 175.19,
            "text": "Ve slibech a naději.",
            "end": 179.17
          },
          {
            "time": 183.09,
            "text": "Ve slibech a naději.",
            "end": 188.29
          },
          {
            "time": 191.03,
            "text": "Ve slibech a naději.",
            "end": 196.03
          },
          {
            "time": 196.66,
            "text": "Ve slibech a naději…",
            "end": 199.3
          },
          {
            "time": 209.46,
            "text": "…a naději.",
            "end": 210.72
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
            "text": "Your beloved objects on display.",
            "end": 10.24
          },
          {
            "time": 11.86,
            "text": "Čas a naše léta vystavena ve vitrínách.",
            "end": 16.13
          },
          {
            "time": 18.87,
            "text": "The space of sweetness,",
            "end": 20.32
          },
          {
            "time": 21.33,
            "text": "the streets with stations of comfort.",
            "end": 24.26
          },
          {
            "time": 26.61,
            "text": "Roses with sounds, my faded colours.",
            "end": 30.66
          },
          {
            "time": 32.82,
            "text": "Noc provází ty zvuky zvonku.",
            "end": 35.87
          },
          {
            "time": 37.97,
            "text": "Melodie vstupu a odchodu.",
            "end": 40.35
          },
          {
            "time": 43.38,
            "text": "The melody of entering and leaving.",
            "end": 46.11
          },
          {
            "time": 50.07,
            "text": "Vypili jsme příliš mnoho času",
            "end": 52.13
          },
          {
            "time": 55.67,
            "text": "nad sklenicí života.",
            "end": 57.57
          },
          {
            "time": 60.92,
            "text": "Vůně starých budov,",
            "end": 62.63
          },
          {
            "time": 67.67,
            "text": "otisk nás všech.",
            "end": 69.67
          },
          {
            "time": 72.79,
            "text": "We’ve drunk too much time",
            "end": 74.63
          },
          {
            "time": 79.44,
            "text": "over the glass of life.",
            "end": 81.47
          },
          {
            "time": 85.04,
            "text": "The smell of old buildings,",
            "end": 86.75
          },
          {
            "time": 91.51,
            "text": "the imprint of all of us.",
            "end": 93.6
          },
          {
            "time": 95.44,
            "text": "In the shadows of long night,",
            "end": 99.6
          },
          {
            "time": 100,
            "text": "glass bottles following your path,",
            "end": 104.13
          },
          {
            "time": 104.53,
            "text": "between walls, between us,",
            "end": 108.5
          },
          {
            "time": 108.5,
            "text": "finding symbols of your trust.",
            "end": 113.2
          },
          {
            "time": 113.3,
            "text": "Místo ztvárněno jen pro nás,",
            "end": 116.3
          },
          {
            "time": 117.9,
            "text": "čas setkání znovu a zas,",
            "end": 120.9
          },
          {
            "time": 122.2,
            "text": "bound to the rituals,",
            "end": 124.6
          },
          {
            "time": 124.88,
            "text": "we are bound to the rituals.",
            "end": 129
          },
          {
            "time": 167.99,
            "text": "Through changing times,",
            "end": 172.03
          },
          {
            "time": 173.68,
            "text": "the years that passed,",
            "end": 176.42
          },
          {
            "time": 176.98,
            "text": "I am the temple with the neon signs.",
            "end": 180.9
          },
          {
            "time": 186,
            "text": "Through changing times,",
            "end": 189.95
          },
          {
            "time": 190.45,
            "text": "the years that passed,",
            "end": 195
          },
          {
            "time": 195,
            "text": "I am the temple with the neon signs.",
            "end": 198.95
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
            "text": "Walking between ideas,",
            "end": 10.4
          },
          {
            "time": 13.36,
            "text": "unraveling the narratives of urban life.",
            "end": 16.96
          },
          {
            "time": 22.55,
            "text": "The formation and transformation of communities.",
            "end": 26.59
          },
          {
            "time": 39.54,
            "text": "The multifaceted tapestry of urban existence.",
            "end": 43.94
          },
          {
            "time": 47.96,
            "text": "Roste mu pod rukama veliká stavebnice,",
            "end": 50.9
          },
          {
            "time": 50.9,
            "text": "město z panelu.",
            "end": 52.87
          },
          {
            "time": 53.27,
            "text": "Aby si tu děti mohly hrát na trávníku",
            "end": 56.58
          },
          {
            "time": 57.4,
            "text": "a aby se sem vešlo slunce.",
            "end": 60.1
          },
          {
            "time": 73.04,
            "text": "I am making space for the sun to fit into my concrete jungle.",
            "end": 77.58
          },
          {
            "time": 77.58,
            "text": "For the kids to play on the green grass,",
            "end": 80.61
          },
          {
            "time": 81.84,
            "text": "for me to build a city of panels.",
            "end": 85.31
          },
          {
            "time": 98.29,
            "text": "Symmetric fate with lively structure,",
            "end": 102.24
          },
          {
            "time": 106.1,
            "text": "with voices in the mirror line.",
            "end": 108.29
          },
          {
            "time": 110.32,
            "text": "With connection,",
            "end": 113.15
          },
          {
            "time": 116.88,
            "text": "linear perfection.",
            "end": 119.3
          },
          {
            "time": 119.3,
            "text": "In the space of design",
            "end": 122.02
          },
          {
            "time": 122.61,
            "text": "where principles take shape,",
            "end": 125
          },
          {
            "time": 125,
            "text": "lies a system where visions escape.",
            "end": 131.3
          },
          {
            "time": 131.5,
            "text": "Curves and angles, harmonious in sight,",
            "end": 136.9
          },
          {
            "time": 137.4,
            "text": "creating symphony of form and light.",
            "end": 143.1
          },
          {
            "time": 158.07,
            "text": "Unraveling the narratives of urban life.",
            "end": 162.02
          },
          {
            "time": 167.8,
            "text": "The formation and transformation of communities.",
            "end": 171.81
          },
          {
            "time": 181.81,
            "text": "The multifaceted tapestry of urban existence.",
            "end": 185.86
          },
          {
            "time": 197.08,
            "text": "Since two shapes cannot be the same, nor two objects equal,",
            "end": 202.14
          },
          {
            "time": 202.14,
            "text": "concepts such as shape and number have to belong to a realm",
            "end": 207.29
          },
          {
            "time": 207.29,
            "text": "beyond sense and experience.",
            "end": 209.66
          },
          {
            "time": 210.48,
            "text": "The realm of forms and ideas.",
            "end": 213.22
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
            "text": "Samostatný život svůj.",
            "end": 11.3
          },
          {
            "time": 11.8,
            "text": "Vznikám tam, kde prázdnota se jeví.",
            "end": 14.34
          },
          {
            "time": 16.79,
            "text": "I am my own system breaking yours.",
            "end": 19.65
          },
          {
            "time": 21.59,
            "text": "Given clues, I divide streets from greyness.",
            "end": 24.8
          },
          {
            "time": 26.52,
            "text": "Tvé město, má mapa.",
            "end": 28.48
          },
          {
            "time": 28.92,
            "text": "Lyricky v konfliktu,",
            "end": 30.79
          },
          {
            "time": 31.28,
            "text": "jazykem nepoznaným.",
            "end": 34
          },
          {
            "time": 34,
            "text": "I arise where the void appears.",
            "end": 38.11
          },
          {
            "time": 41.17,
            "text": "I paint the world the way I see it,",
            "end": 43.5
          },
          {
            "time": 43.5,
            "text": "my art is in my voice, can you hear it?",
            "end": 47.3
          },
          {
            "time": 47.3,
            "text": "The nights are witnessing the imprint of my mind,",
            "end": 51.65
          },
          {
            "time": 53.36,
            "text": "onto the messages that I will always write for you to find.",
            "end": 59.6
          },
          {
            "time": 59.6,
            "text": "After all, this is the land of my people.",
            "end": 63.6
          },
          {
            "time": 63.6,
            "text": "Já stojím v čase, který stéká jako chvíle."
          },
          {
            "time": 68.4,
            "text": "With endless canvas, my being seems so real.",
            "end": 73.38
          },
          {
            "time": 75.57,
            "text": "I am the voice of the city, can you feel?",
            "end": 83.11
          },
          {
            "time": 97.62,
            "text": "Já stojím v čase, který stéká jako chvíle.",
            "end": 102.5
          },
          {
            "time": 102.7,
            "text": "Stopy slova v mlze, ty zrcadlí mé cíle.",
            "end": 107.1
          },
          {
            "time": 107.19,
            "text": "Ve stěnách ticha zachytíš odstín noci,",
            "end": 111.35
          },
          {
            "time": 111.35,
            "text": "srdce mi bije s nocí,",
            "end": 114.21
          },
          {
            "time": 114.64,
            "text": "stavíš svět na půdorysu moci.",
            "end": 117.6
          },
          {
            "time": 119.54,
            "text": "I paint the world the way I see it,",
            "end": 121.9
          },
          {
            "time": 121.9,
            "text": "my art is in my voice, can you hear it?",
            "end": 125.7
          },
          {
            "time": 125.7,
            "text": "The nights are witnessing the imprint of my mind,",
            "end": 129.89
          },
          {
            "time": 130.77,
            "text": "onto the messages that I will always write for you to find.",
            "end": 138.4
          },
          {
            "time": 138.4,
            "text": "After all, this is the land of my people.",
            "end": 142.54
          },
          {
            "time": 142.54,
            "text": "Já stojím v čase, který stéká jako chvíle.",
            "end": 146.17
          },
          {
            "time": 146.39,
            "text": "With endless canvas, my being seems so real.",
            "end": 151.68
          },
          {
            "time": 153.94,
            "text": "I am the voice of the city, can you feel?",
            "end": 157.25
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
            "text": "In the utilitarian landscape,",
            "end": 10.63
          },
          {
            "time": 12.5,
            "text": "we quietly observe our purpose.",
            "end": 15.87
          },
          {
            "time": 16.85,
            "text": "The purpose of material,",
            "end": 18.69
          },
          {
            "time": 21.36,
            "text": "rytmus proměněn ve funkci.",
            "end": 25.09
          },
          {
            "time": 25.68,
            "text": "Beauty, an old principle of naivety.",
            "end": 31.46
          },
          {
            "time": 33.78,
            "text": "Offering simplicity,",
            "end": 37.15
          },
          {
            "time": 38.07,
            "text": "we have built a modern universe.",
            "end": 44.8
          },
          {
            "time": 46.74,
            "text": "A modern universe.",
            "end": 49.99
          },
          {
            "time": 51.03,
            "text": "Šedá plocha, popsaná slovy.",
            "end": 54.5
          },
          {
            "time": 54.5,
            "text": "A different angle,",
            "end": 57.03
          },
          {
            "time": 57.52,
            "text": "inner knowing.",
            "end": 60.2
          },
          {
            "time": 60.2,
            "text": "I am walking through the hall of new visions, one wall.",
            "end": 66.53
          },
          {
            "time": 68.02,
            "text": "Study of language and its principle,",
            "end": 71.52
          },
          {
            "time": 72.5,
            "text": "it’s a novelty, visual miracle.",
            "end": 75.87
          },
          {
            "time": 76.79,
            "text": "It’s a way to behave in a space,",
            "end": 82.37
          },
          {
            "time": 82.6,
            "text": "your functional grace.",
            "end": 85.8
          },
          {
            "time": 86,
            "text": "your functional grace.",
            "end": 89.4
          },
          {
            "time": 93.8,
            "text": "Never needs questions,",
            "end": 97.2
          },
          {
            "time": 97.5,
            "text": "what works never needs questions.",
            "end": 102.6
          },
          {
            "time": 103,
            "text": "Never needs questions.",
            "end": 106.6
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
            "text": "vycházeli z teze své doktríny.",
            "end": 128.93
          },
          {
            "time": 129.56,
            "text": "Totiž že ony nové formy se skrývají ve funkčních úkolech.",
            "end": 133.76
          },
          {
            "time": 134.1,
            "text": "Tak je také třeba rozumět termínu funkcionalismus.",
            "end": 137.79
          },
          {
            "time": 138.52,
            "text": "Bylo to jméno pro metodu, která měla přivést designéra",
            "end": 141.9
          },
          {
            "time": 141.9,
            "text": "k oněm skrytým inherentním formám."
          },
          {
            "time": 143.67,
            "text": "Jinými slovy, funkcionalisté neplédovali pro funkční metodu",
            "end": 147.47
          },
          {
            "time": 147.47,
            "text": "kvůli tomu, že měli na mysli lepší fungování budov",
            "end": 150.85
          },
          {
            "time": 150.85,
            "text": "a tím dobro uživatelů,",
            "end": 153.12
          },
          {
            "time": 153.36,
            "text": "nýbrž kvůli tomu, že měli na mysli novou výtvarnou řeč,",
            "end": 157.82
          },
          {
            "time": 157.82,
            "text": "která měla touto metodou vzniknout.",
            "end": 159.91
          }
        ],
        "verse": [],
        "collage": "funkce"
      }
    }
  ]
};
