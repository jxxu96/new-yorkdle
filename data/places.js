// New Yorkdle places dataset — Manhattan only.
//
// Coordinates were cross-checked against Wikipedia/Wikidata and OpenStreetMap
// (© OpenStreetMap contributors, ODbL). Fields:
//   id, name, aliases[], lat, lng (5 decimals), category, neighborhood,
//   difficulty ("iconic" | "local"), clues[3] (vague → specific), fact
//   radius   (optional) win radius in meters for big footprints (default 75)
//   path     (optional) [[lat, lng], ...] for linear places (bridges, the High Line);
//            distance is measured to the nearest point of the path.

export const PLACES = [
  /* ============================== ICONIC ============================== */
  {
    id: "empire-state-building", name: "Empire State Building", aliases: ["ESB", "Empire State"],
    lat: 40.74844, lng: -73.98566, category: "building", neighborhood: "Midtown South", difficulty: "iconic",
    clues: [
      "Built in just 410 days during the Great Depression.",
      "King Kong climbed it in 1933; its tower lights change color for holidays and big games.",
      "Fifth Avenue at 34th Street — the Art Deco giant that ruled the skyline for 40 years.",
    ],
    fact: "It has its own ZIP code: 10118.",
  },
  {
    id: "chrysler-building", name: "Chrysler Building", aliases: ["Chrysler"],
    lat: 40.75165, lng: -73.97540, category: "building", neighborhood: "Midtown East", difficulty: "iconic",
    clues: [
      "An Art Deco skyscraper that briefly held the “world’s tallest” title around 1930.",
      "Its spire was secretly assembled inside the building, then hoisted out the top to beat a rival.",
      "Lexington Avenue at 42nd Street — look for the stainless-steel sunburst crown and eagle gargoyles.",
    ],
    fact: "Its gargoyles and hood ornaments were modeled on 1929 car parts.",
  },
  {
    id: "flatiron-building", name: "Flatiron Building", aliases: ["Fuller Building", "Flatiron"],
    lat: 40.74111, lng: -73.98966, category: "building", neighborhood: "Flatiron District", difficulty: "iconic",
    clues: [
      "A 1902 skyscraper on a lot shaped like a slice of pie.",
      "Winds whipping around its corner supposedly gave us the phrase “23 skidoo.”",
      "Where Broadway crosses Fifth Avenue at 23rd Street — a famously skinny triangle.",
    ],
    fact: "At its narrow tip the building is only about 6.5 feet wide.",
  },
  {
    id: "grand-central-terminal", name: "Grand Central Terminal", aliases: ["Grand Central", "Grand Central Station", "GCT"],
    lat: 40.75273, lng: -73.97723, category: "landmark", neighborhood: "Midtown East", difficulty: "iconic", radius: 100,
    clues: [
      "A Beaux-Arts gateway from 1913 that hundreds of thousands pass through every day.",
      "Look up: its turquoise ceiling shows the zodiac — painted backwards.",
      "42nd Street at Park Avenue. Meet me under the four-faced opal clock.",
    ],
    fact: "Whisper into a corner of the tiled arches outside the Oyster Bar and a friend across the way can hear you.",
  },
  {
    id: "the-met", name: "The Metropolitan Museum of Art", aliases: ["The Met", "Met Museum", "Metropolitan Museum", "Met Fifth Avenue"],
    lat: 40.77944, lng: -73.96324, category: "museum", neighborhood: "Upper East Side", difficulty: "iconic", radius: 120,
    clues: [
      "The largest art museum in the Americas.",
      "Its grand front steps host a famous fashion gala on the first Monday in May.",
      "Fifth Avenue along the eastern edge of Central Park, around 82nd Street.",
    ],
    fact: "It houses an entire Egyptian temple — the Temple of Dendur — in its own glass hall.",
  },
  {
    id: "washington-square-arch", name: "Washington Square Arch", aliases: ["Washington Arch", "Washington Square Park", "Washington Square"],
    lat: 40.73120, lng: -73.99708, category: "landmark", neighborhood: "Greenwich Village", difficulty: "iconic",
    clues: [
      "A marble monument modeled on Paris’s Arc de Triomphe.",
      "It marks the very beginning of Fifth Avenue.",
      "The gateway to a park beloved by NYU students, chess hustlers and street performers.",
    ],
    fact: "In 1917 artists climbed to its top and declared the “Free and Independent Republic of Washington Square.”",
  },
  {
    id: "strand-bookstore", name: "Strand Bookstore", aliases: ["The Strand", "Strand", "Strand Books"],
    lat: 40.73330, lng: -73.99085, category: "shop", neighborhood: "Greenwich Village", difficulty: "iconic",
    clues: [
      "Family-owned since 1927 and a temple for bargain hunters.",
      "Its famous slogan brags about “18 miles” of what it sells.",
      "Broadway at 12th Street, with $1 carts lined up on the sidewalk.",
    ],
    fact: "It’s the last survivor of “Book Row,” a stretch of Fourth Avenue that once had dozens of bookshops.",
  },
  {
    id: "katzs-delicatessen", name: "Katz's Delicatessen", aliases: ["Katz's", "Katz's Deli", "Katzs"],
    lat: 40.72233, lng: -73.98742, category: "food", neighborhood: "Lower East Side", difficulty: "iconic",
    clues: [
      "A deli feeding New Yorkers since 1888.",
      "Hold on to your paper ticket — lose it and you’ll pay at the door.",
      "Houston Street at Ludlow, where a famous movie scene ended with “I’ll have what she’s having.”",
    ],
    fact: "During WWII it urged families to “Send a salami to your boy in the Army.”",
  },
  {
    id: "apollo-theater", name: "Apollo Theater", aliases: ["The Apollo", "Apollo"],
    lat: 40.81013, lng: -73.94986, category: "music venue", neighborhood: "Harlem", difficulty: "iconic",
    clues: [
      "A legendary stage where countless Black artists got their big break.",
      "Amateur Night crowds are famously tough; performers rub the “Tree of Hope” stump for luck.",
      "West 125th Street, under a bright red marquee.",
    ],
    fact: "Ella Fitzgerald won one of its earliest Amateur Nights in 1934, at age 17.",
  },
  {
    id: "the-cloisters", name: "The Met Cloisters", aliases: ["The Cloisters", "Cloisters"],
    lat: 40.86486, lng: -73.93180, category: "museum", neighborhood: "Fort Tryon Park (Washington Heights)", difficulty: "iconic",
    clues: [
      "A museum that looks like it was airlifted out of medieval Europe.",
      "Pieces of real monasteries were shipped over and rebuilt here; its famous tapestries star a unicorn.",
      "On a hilltop park near Manhattan’s northern tip, overlooking the Hudson.",
    ],
    fact: "John D. Rockefeller Jr. also bought the New Jersey cliffs across the river so the view would stay wild.",
  },
  {
    id: "little-island", name: "Little Island", aliases: ["Little Island at Pier 55", "Pier 55"],
    lat: 40.74194, lng: -74.01028, category: "park", neighborhood: "Meatpacking District", difficulty: "iconic",
    clues: [
      "A park that opened in 2021 and seems to float above the water.",
      "It stands on 132 concrete “tulip” pots rising out of the river.",
      "Off Hudson River Park near West 13th Street.",
    ],
    fact: "It was funded largely by Barry Diller and Diane von Furstenberg.",
  },
  {
    id: "stonewall-inn", name: "Stonewall Inn", aliases: ["Stonewall", "The Stonewall"],
    lat: 40.73389, lng: -74.00217, category: "bar", neighborhood: "West Village", difficulty: "iconic",
    clues: [
      "A bar that became the birthplace of a civil rights movement.",
      "A 1969 police raid here sparked days of protest — remembered every June.",
      "Christopher Street, across from a little park with white statues.",
    ],
    fact: "In 2016 it became the first U.S. national monument dedicated to LGBTQ+ history.",
  },
  {
    id: "times-square", name: "Times Square", aliases: ["Crossroads of the World", "Duffy Square"],
    lat: 40.75800, lng: -73.98550, category: "landmark", neighborhood: "Theater District", difficulty: "iconic", radius: 120,
    clues: [
      "Nicknamed “the Crossroads of the World.”",
      "About a million people pack in here to watch a ball drop every New Year’s Eve.",
      "Where Broadway crosses Seventh Avenue in the 40s, buried in billboards.",
    ],
    fact: "It was called Longacre Square until a newspaper moved in in 1904.",
  },
  {
    id: "rockefeller-center", name: "Rockefeller Center", aliases: ["Rockefeller Plaza", "30 Rock", "The Rink at Rockefeller Center", "Top of the Rock"],
    lat: 40.75864, lng: -73.97842, category: "landmark", neighborhood: "Midtown", difficulty: "iconic",
    clues: [
      "An Art Deco complex built during the Depression.",
      "A golden Prometheus watches over ice skaters every winter.",
      "Between Fifth and Sixth Avenues around 49th Street — home of the giant holiday tree.",
    ],
    fact: "The first tree, in 1931, was put up by construction workers who decorated it with tin cans.",
  },
  {
    id: "bethesda-fountain", name: "Bethesda Fountain", aliases: ["Bethesda Terrace", "Angel of the Waters"],
    lat: 40.77412, lng: -73.97114, category: "landmark", neighborhood: "Central Park", difficulty: "iconic",
    clues: [
      "A Central Park showpiece that’s appeared in countless movies and TV shows.",
      "Its winged statue was the first major public artwork in NYC commissioned from a woman.",
      "At the bottom of the grand staircase at the end of the Mall, overlooking the Lake.",
    ],
    fact: "Emma Stebbins’ “Angel of the Waters” celebrates the clean water brought by the Croton Aqueduct.",
  },
  {
    id: "brooklyn-bridge", name: "Brooklyn Bridge", aliases: [],
    lat: 40.70907, lng: -74.00073, category: "bridge", neighborhood: "Civic Center", difficulty: "iconic", radius: 40,
    path: [[40.71140, -74.00338], [40.70907, -74.00073], [40.70805, -73.99925]],
    clues: [
      "Opened in 1883 — the longest suspension bridge in the world at the time.",
      "P.T. Barnum paraded 21 elephants across it to prove it was safe.",
      "Its walkway starts across from City Hall Park — pin anywhere along its Manhattan approach.",
    ],
    fact: "Emily Warren Roebling took over the engineering when her husband fell ill, and was the first to cross it.",
  },
  {
    id: "one-world-trade-center", name: "One World Trade Center", aliases: ["Freedom Tower", "1 WTC", "One WTC", "World Trade Center"],
    lat: 40.71290, lng: -74.01335, category: "building", neighborhood: "Financial District", difficulty: "iconic",
    clues: [
      "The tallest building in the Western Hemisphere.",
      "Its height — 1,776 feet — is a patriotic nod to a famous year.",
      "West Street at Vesey, rising over the site of the Twin Towers.",
    ],
    fact: "Its observatory elevators climb 102 floors in under a minute.",
  },
  {
    id: "september-11-memorial", name: "9/11 Memorial", aliases: ["National September 11 Memorial", "9/11 Memorial & Museum", "September 11 Memorial", "Reflecting Absence"],
    lat: 40.71156, lng: -74.01350, category: "landmark", neighborhood: "Financial District", difficulty: "iconic", radius: 110,
    clues: [
      "A place of quiet reflection in the heart of downtown.",
      "Two vast square pools with the largest man-made waterfalls in North America.",
      "The footprints of the Twin Towers, ringed by bronze panels with nearly 3,000 names.",
    ],
    fact: "A “Survivor Tree” — a pear tree pulled from the rubble — still blooms on the plaza every spring.",
  },
  {
    id: "the-oculus", name: "The Oculus", aliases: ["World Trade Center Transportation Hub", "WTC PATH Station", "Oculus"],
    lat: 40.71150, lng: -74.01120, category: "building", neighborhood: "Financial District", difficulty: "iconic",
    clues: [
      "A train station that doubles as a shopping mall.",
      "Santiago Calatrava designed it to evoke a bird released from a child’s hands.",
      "Gleaming white steel ribs beside the World Trade Center; its skylight opens every September 11.",
    ],
    fact: "At roughly $4 billion, it’s often called the world’s most expensive train station.",
  },
  {
    id: "charging-bull", name: "Charging Bull", aliases: ["Wall Street Bull", "The Bull", "Bowling Green Bull"],
    lat: 40.70558, lng: -74.01342, category: "landmark", neighborhood: "Financial District", difficulty: "iconic",
    clues: [
      "A 7,100-pound bronze that started life as an unauthorized “gift.”",
      "The artist dumped it on the street overnight in 1989; the city moved it a few blocks a week later.",
      "At the north tip of Bowling Green, where tourists line up to rub a certain part for luck.",
    ],
    fact: "Arturo Di Modica spent about $360,000 of his own money making it.",
  },
  {
    id: "new-york-stock-exchange", name: "New York Stock Exchange", aliases: ["NYSE", "Stock Exchange", "Wall Street"],
    lat: 40.70694, lng: -74.01111, category: "building", neighborhood: "Financial District", difficulty: "iconic",
    clues: [
      "Its traders got their start under a buttonwood tree in 1792.",
      "A giant American flag often drapes its marble columns; a bell rings at 9:30 sharp.",
      "Broad Street at Wall Street, a few steps from a statue of George Washington.",
    ],
    fact: "Its opening and closing bells have been rung by everyone from astronauts to Muppets.",
  },
  {
    id: "trinity-church", name: "Trinity Church", aliases: ["Trinity Church Wall Street", "Trinity Wall Street"],
    lat: 40.70806, lng: -74.01222, category: "church", neighborhood: "Financial District", difficulty: "iconic",
    clues: [
      "A Gothic Revival church that was once the tallest structure in NYC.",
      "Alexander Hamilton is buried in its churchyard.",
      "Broadway at the head of Wall Street.",
    ],
    fact: "Its 281-foot spire was the city’s tallest point from 1846 until 1890.",
  },
  {
    id: "st-patricks-cathedral", name: "St. Patrick's Cathedral", aliases: ["Saint Patrick's Cathedral", "St Patricks Cathedral", "St. Pat's"],
    lat: 40.75850, lng: -73.97640, category: "church", neighborhood: "Midtown", difficulty: "iconic",
    clues: [
      "The largest Gothic Revival Catholic cathedral in North America.",
      "Its twin spires rise 330 feet, and a famous March parade marches right past its doors.",
      "Fifth Avenue at 50th Street, across from the Atlas statue.",
    ],
    fact: "When its cornerstone was laid in 1858, the site was considered way out in the countryside.",
  },
  {
    id: "moma", name: "Museum of Modern Art", aliases: ["MoMA", "Modern Art Museum"],
    lat: 40.76148, lng: -73.97762, category: "museum", neighborhood: "Midtown", difficulty: "iconic",
    clues: [
      "Home of Van Gogh’s “The Starry Night.”",
      "Opened in 1929 with Rockefeller family backing; its sculpture garden is a Midtown oasis.",
      "West 53rd Street between Fifth and Sixth Avenues.",
    ],
    fact: "Its collection includes video games like Pac-Man and Tetris.",
  },
  {
    id: "guggenheim", name: "Solomon R. Guggenheim Museum", aliases: ["The Guggenheim", "Guggenheim", "Guggenheim Museum"],
    lat: 40.78298, lng: -73.95898, category: "museum", neighborhood: "Upper East Side", difficulty: "iconic",
    clues: [
      "A museum that’s a masterpiece itself.",
      "Frank Lloyd Wright designed it so you view the art while walking a spiral ramp.",
      "Fifth Avenue at 89th Street, facing Central Park.",
    ],
    fact: "Twenty-one artists signed a letter protesting that Wright’s curving walls would be terrible for showing their work.",
  },
  {
    id: "natural-history-museum", name: "American Museum of Natural History", aliases: ["AMNH", "Natural History Museum", "Museum of Natural History"],
    lat: 40.78120, lng: -73.97410, category: "museum", neighborhood: "Upper West Side", difficulty: "iconic", radius: 110,
    clues: [
      "Dinosaurs, a giant blue whale and a planetarium under one roof.",
      "Its exhibits famously come to life after dark in a 2006 movie.",
      "Central Park West at 79th Street — Teddy Roosevelt’s name is all over the entrance.",
    ],
    fact: "The 94-foot blue whale in its ocean hall weighs about 21,000 pounds.",
  },
  {
    id: "lincoln-center", name: "Lincoln Center", aliases: ["Lincoln Center for the Performing Arts", "Metropolitan Opera", "Met Opera", "Revson Fountain"],
    lat: 40.77232, lng: -73.98340, category: "music venue", neighborhood: "Upper West Side (Lincoln Square)", difficulty: "iconic", radius: 100,
    clues: [
      "A cultural campus built on the bulldozed blocks that inspired “West Side Story.”",
      "Home to the opera, the ballet and the Philharmonic.",
      "Columbus Avenue at 64th Street, around a famous dancing fountain.",
    ],
    fact: "The opening of the 1961 “West Side Story” film was shot on streets about to be cleared to build it.",
  },
  {
    id: "carnegie-hall", name: "Carnegie Hall", aliases: ["Carnegie"],
    lat: 40.76510, lng: -73.97990, category: "music venue", neighborhood: "Midtown", difficulty: "iconic",
    clues: [
      "A concert hall with legendary acoustics, opened in 1891.",
      "Tchaikovsky conducted on opening night.",
      "Seventh Avenue at 57th Street. How do you get here? Practice, practice, practice.",
    ],
    fact: "Steel magnate Andrew Carnegie paid for it — about $1 million at the time.",
  },
  {
    id: "radio-city", name: "Radio City Music Hall", aliases: ["Radio City"],
    lat: 40.75980, lng: -73.97930, category: "music venue", neighborhood: "Midtown", difficulty: "iconic",
    clues: [
      "An Art Deco palace billed as “The Showplace of the Nation.”",
      "The Rockettes high-kick here every holiday season.",
      "Sixth Avenue at 50th Street; its neon marquee wraps the corner.",
    ],
    fact: "Its Great Stage is framed like a setting sun — an idea the designer reportedly got watching a sunset at sea.",
  },
  {
    id: "madison-square-garden", name: "Madison Square Garden", aliases: ["MSG", "The Garden"],
    lat: 40.75051, lng: -73.99341, category: "sports", neighborhood: "Midtown South", difficulty: "iconic", radius: 80,
    clues: [
      "It calls itself “The World’s Most Famous Arena.”",
      "Home of the Knicks and Rangers — perched on top of a busy train station.",
      "Between Seventh and Eighth Avenues, 31st to 33rd Streets.",
    ],
    fact: "This is the fourth arena with the name — the first two actually stood by Madison Square.",
  },
  {
    id: "high-line", name: "The High Line", aliases: ["High Line", "High Line Park"],
    lat: 40.74518, lng: -74.00663, category: "park", neighborhood: "Chelsea", difficulty: "iconic", radius: 40,
    path: [
      [40.73944, -74.00819], [40.73984, -74.00824], [40.74088, -74.00805], [40.74184, -74.00775],
      [40.74282, -74.00744], [40.74329, -74.00702], [40.74518, -74.00663], [40.74728, -74.00518],
      [40.74907, -74.00384], [40.75041, -74.00295], [40.75159, -74.00209], [40.75240, -74.00204],
      [40.75335, -74.00355], [40.75406, -74.00530], [40.75470, -74.00593], [40.75520, -74.00587],
      [40.75602, -74.00529], [40.75645, -74.00435], [40.75632, -74.00367], [40.75617, -74.00346],
    ],
    clues: [
      "A park in the sky, built on something abandoned.",
      "Freight trains once rumbled here 30 feet above the street; it reopened as a walkway in 2009.",
      "Pin any part of its 1.45-mile route, from Gansevoort Street up the West Side to 34th Street.",
    ],
    fact: "It was slated for demolition until two neighbors founded Friends of the High Line in 1999.",
  },
  {
    id: "chelsea-market", name: "Chelsea Market", aliases: [],
    lat: 40.74245, lng: -74.00600, category: "food", neighborhood: "Chelsea", difficulty: "iconic", radius: 100,
    clues: [
      "A food hall inside an old factory complex.",
      "The Oreo cookie was invented in this building in 1912.",
      "Ninth Avenue between 15th and 16th Streets, with the elevated park running past its back.",
    ],
    fact: "The building was the headquarters of the National Biscuit Company — Nabisco.",
  },
  {
    id: "vessel", name: "Vessel", aliases: ["The Vessel", "Hudson Yards"],
    lat: 40.75378, lng: -74.00218, category: "landmark", neighborhood: "Hudson Yards", difficulty: "iconic",
    clues: [
      "A climbable sculpture that opened in 2019.",
      "154 interlocking flights of stairs form a copper-colored honeycomb.",
      "The centerpiece of a brand-new neighborhood built over a West Side rail yard.",
    ],
    fact: "Its 2,500 steps lead nowhere in particular — some locals nicknamed it “the Shawarma.”",
  },
  {
    id: "nypl-main", name: "New York Public Library Main Branch", aliases: ["NYPL", "New York Public Library", "Stephen A. Schwarzman Building", "42nd Street Library", "Public Library"],
    lat: 40.75310, lng: -73.98215, category: "building", neighborhood: "Midtown", difficulty: "iconic", radius: 80,
    clues: [
      "A Beaux-Arts palace for readers that opened in 1911.",
      "Two marble lions named Patience and Fortitude guard its steps.",
      "Fifth Avenue at 42nd Street — the Ghostbusters met their first ghost here.",
    ],
    fact: "The original stuffed animals that inspired Winnie-the-Pooh live here.",
  },
  {
    id: "bryant-park", name: "Bryant Park", aliases: [],
    lat: 40.75389, lng: -73.98389, category: "park", neighborhood: "Midtown", difficulty: "iconic", radius: 90,
    clues: [
      "A lawn ringed by skyscrapers that was a no-go zone in the 1970s.",
      "Winter brings a skating rink and holiday shops; summer brings free outdoor movies.",
      "Between Fifth and Sixth Avenues, 40th to 42nd Streets — right behind the main library.",
    ],
    fact: "Miles of the library’s bookshelves are stored in vaults beneath its lawn.",
  },
  {
    id: "union-square", name: "Union Square", aliases: ["Union Square Park", "Union Sq"],
    lat: 40.73590, lng: -73.99060, category: "park", neighborhood: "Between Flatiron and the Village", difficulty: "iconic", radius: 100,
    clues: [
      "A historic gathering place for rallies, protests and skateboarders.",
      "A big greenmarket fills it four days a week.",
      "Where Broadway meets 14th Street, beside a giant digital Climate Clock.",
    ],
    fact: "America’s first Labor Day parade marched here in 1882.",
  },
  {
    id: "plaza-hotel", name: "The Plaza Hotel", aliases: ["The Plaza", "Plaza Hotel"],
    lat: 40.76450, lng: -73.97440, category: "building", neighborhood: "Midtown (Central Park South)", difficulty: "iconic",
    clues: [
      "A French château of a hotel, opened in 1907.",
      "Home of Eloise, the fictional girl who lives on its top floor.",
      "Fifth Avenue at Central Park South, facing the Pulitzer Fountain.",
    ],
    fact: "The Beatles stayed here on their first U.S. visit in 1964.",
  },
  {
    id: "tiffany", name: "Tiffany & Co. Flagship", aliases: ["Tiffany's", "Tiffany & Co", "Tiffany", "The Landmark"],
    lat: 40.76259, lng: -73.97378, category: "shop", neighborhood: "Midtown", difficulty: "iconic",
    clues: [
      "A jewelry store with a robin’s-egg-blue signature.",
      "Audrey Hepburn ate a pastry while gazing into its windows in a 1961 film.",
      "Fifth Avenue at 57th Street, a block south of the Plaza.",
    ],
    fact: "It now has a café inside, so you really can have breakfast there.",
  },
  {
    id: "united-nations", name: "United Nations Headquarters", aliases: ["UN", "U.N.", "United Nations", "UN Headquarters"],
    lat: 40.74937, lng: -73.96803, category: "building", neighborhood: "Turtle Bay", difficulty: "iconic", radius: 130,
    clues: [
      "Diplomats from nearly every country on Earth work here.",
      "Member states’ flags line the avenue out front; a knotted-gun sculpture stands nearby.",
      "On the East River between 42nd and 48th Streets.",
    ],
    fact: "John D. Rockefeller Jr. bought the land for $8.5 million and donated it in 1946.",
  },
  {
    id: "intrepid", name: "Intrepid Museum", aliases: ["Intrepid Sea, Air & Space Museum", "USS Intrepid", "Intrepid"],
    lat: 40.76456, lng: -73.99960, category: "museum", neighborhood: "Hell's Kitchen", difficulty: "iconic",
    clues: [
      "A museum that saw combat in World War II.",
      "Fighter jets sit on its deck, and a space shuttle lives in a pavilion on top.",
      "A retired aircraft carrier moored at a Hudson River pier off West 46th Street.",
    ],
    fact: "The shuttle Enterprise on board was a test vehicle that never went to space.",
  },
  {
    id: "the-dakota", name: "The Dakota", aliases: ["Dakota", "Dakota Apartments"],
    lat: 40.77650, lng: -73.97630, category: "building", neighborhood: "Upper West Side", difficulty: "iconic",
    clues: [
      "A gabled, slightly spooky apartment house from 1884.",
      "“Rosemary’s Baby” was filmed here, and John Lennon lived — and was killed — at its entrance.",
      "Central Park West at 72nd Street, across from a memorial garden.",
    ],
    fact: "Legend says it got its name because it was so far uptown it might as well have been in the Dakota Territory.",
  },
  {
    id: "strawberry-fields", name: "Strawberry Fields", aliases: ["Imagine Mosaic", "Imagine Circle", "John Lennon Memorial"],
    lat: 40.77556, lng: -73.97500, category: "park", neighborhood: "Central Park", difficulty: "iconic",
    clues: [
      "A 2.5-acre memorial garden named after a song.",
      "Its black-and-white mosaic spells out a single word.",
      "Inside Central Park near West 72nd Street, across from the building where a Beatle lived.",
    ],
    fact: "Yoko Ono funded its landscaping; plants were donated from around the world.",
  },
  {
    id: "central-park-zoo", name: "Central Park Zoo", aliases: ["Zoo"],
    lat: 40.76780, lng: -73.97180, category: "park", neighborhood: "Central Park", difficulty: "iconic", radius: 100,
    clues: [
      "A small menagerie that’s been in this spot since the 1860s.",
      "Penguins, snow leopards — and the stars of “Madagascar” escaped from here.",
      "In the park’s southeast corner near Fifth Avenue and 64th, under a musical animal clock.",
    ],
    fact: "The bronze animals on the Delacorte Clock dance in a circle every half hour.",
  },
  {
    id: "belvedere-castle", name: "Belvedere Castle", aliases: ["Belvedere"],
    lat: 40.77945, lng: -73.96906, category: "landmark", neighborhood: "Central Park", difficulty: "iconic",
    clues: [
      "A miniature castle built as a Victorian “folly” in 1869.",
      "Its name means “beautiful view” in Italian, and it doubles as a weather station.",
      "Perched on Vista Rock in the middle of Central Park, above Turtle Pond.",
    ],
    fact: "Official Central Park weather readings have been taken here since 1919.",
  },
  {
    id: "low-library", name: "Columbia University (Low Library)", aliases: ["Columbia", "Columbia University", "Low Memorial Library", "Alma Mater statue"],
    lat: 40.80810, lng: -73.96190, category: "building", neighborhood: "Morningside Heights", difficulty: "iconic",
    clues: [
      "An Ivy League school founded in 1754 as King’s College.",
      "A bronze “Alma Mater” sits on the steps — students hunt for the owl hidden in her robe.",
      "Broadway at 116th Street, under a big domed rotunda.",
    ],
    fact: "Low Library hasn’t been a library since 1934 — it’s mostly offices now.",
  },
  {
    id: "st-john-the-divine", name: "Cathedral of St. John the Divine", aliases: ["St. John the Divine", "Saint John the Divine", "St John the Divine"],
    lat: 40.80389, lng: -73.96208, category: "church", neighborhood: "Morningside Heights", difficulty: "iconic", radius: 90,
    clues: [
      "One of the largest cathedrals in the world — still unfinished after 130 years.",
      "Its nickname jokes that it will never be done; peacocks roam its grounds.",
      "Amsterdam Avenue at 112th Street.",
    ],
    fact: "Construction began in 1892 and its planned towers still haven’t been built.",
  },
  {
    id: "grants-tomb", name: "Grant's Tomb", aliases: ["General Grant National Memorial", "Grant National Memorial"],
    lat: 40.81333, lng: -73.96306, category: "landmark", neighborhood: "Morningside Heights", difficulty: "iconic",
    clues: [
      "The largest mausoleum in North America.",
      "A Civil War general and president rests here beside his wife.",
      "Riverside Drive at 122nd Street, overlooking the Hudson.",
    ],
    fact: "Old riddle: “Who’s buried in it?” Technically nobody — the coffins are entombed above ground.",
  },
  {
    id: "castle-clinton", name: "Castle Clinton", aliases: ["Battery Park", "Castle Garden", "The Battery"],
    lat: 40.70350, lng: -74.01680, category: "landmark", neighborhood: "The Battery", difficulty: "iconic",
    clues: [
      "A circular sandstone fort built for the War of 1812.",
      "It’s been a concert hall, an immigration station and an aquarium.",
      "In the park at Manhattan’s southern tip, where you buy Statue of Liberty ferry tickets.",
    ],
    fact: "Before Ellis Island opened, more than 8 million immigrants entered America here.",
  },
  {
    id: "staten-island-ferry", name: "Staten Island Ferry Terminal", aliases: ["Whitehall Terminal", "Staten Island Ferry", "Whitehall Ferry Terminal"],
    lat: 40.70141, lng: -74.01313, category: "landmark", neighborhood: "Financial District", difficulty: "iconic",
    clues: [
      "Tens of thousands of people a day start a free ride here.",
      "Big orange boats leave every 15–30 minutes and cruise past the Statue of Liberty.",
      "At Manhattan’s southern tip, just east of Battery Park.",
    ],
    fact: "The ride has been free since 1997 — the best deal in town.",
  },
  {
    id: "woolworth-building", name: "Woolworth Building", aliases: ["Woolworth"],
    lat: 40.71236, lng: -74.00822, category: "building", neighborhood: "Civic Center", difficulty: "iconic",
    clues: [
      "Nicknamed the “Cathedral of Commerce.”",
      "A five-and-dime king paid cash for it in 1913; it was the world’s tallest for 17 years.",
      "Broadway across from City Hall Park, topped by a green copper crown.",
    ],
    fact: "A lobby carving shows the founder counting his nickels and dimes.",
  },
  {
    id: "macys", name: "Macy's Herald Square", aliases: ["Macy's", "Macys"],
    lat: 40.75070, lng: -73.98920, category: "shop", neighborhood: "Midtown South", difficulty: "iconic",
    clues: [
      "Once billed as “the world’s largest store.”",
      "A famous Thanksgiving parade ends here, and “Miracle on 34th Street” is set inside.",
      "A full block at 34th Street and Broadway — some escalators are still made of wood.",
    ],
    fact: "Its wooden escalators, installed in the 1920s, are among the oldest still running.",
  },
  {
    id: "hotel-chelsea", name: "Hotel Chelsea", aliases: ["Chelsea Hotel", "The Chelsea"],
    lat: 40.74444, lng: -73.99694, category: "building", neighborhood: "Chelsea", difficulty: "iconic",
    clues: [
      "A red-brick hotel famous as a bohemian crash pad.",
      "Bob Dylan and Patti Smith lived here; Leonard Cohen wrote a song about it.",
      "West 23rd Street between Seventh and Eighth Avenues, with lacy iron balconies.",
    ],
    fact: "Arthur C. Clarke wrote “2001: A Space Odyssey” while living here.",
  },
  {
    id: "cbgb", name: "CBGB", aliases: ["CBGB & OMFUG", "CBGBs", "315 Bowery"],
    lat: 40.72524, lng: -73.99197, category: "music venue", neighborhood: "NoHo / Bowery", difficulty: "iconic",
    clues: [
      "A grimy club that became the cradle of punk.",
      "The Ramones, Blondie, Talking Heads and Patti Smith all played here in the ’70s.",
      "On the Bowery at Bleecker Street; it closed in 2006.",
    ],
    fact: "The name stood for “Country, BlueGrass, and Blues” — the music the owner originally planned to book.",
  },
  {
    id: "magnolia-bakery", name: "Magnolia Bakery", aliases: ["Magnolia"],
    lat: 40.73590, lng: -74.00500, category: "food", neighborhood: "West Village", difficulty: "iconic",
    clues: [
      "A bakery that turned a TV cameo into a tourist pilgrimage.",
      "“Sex and the City” made its cupcakes famous; its banana pudding has a cult following.",
      "Bleecker Street at West 11th Street.",
    ],
    fact: "The original shop opened on this corner in 1996 — now there are locations around the world.",
  },
  {
    id: "sylvias", name: "Sylvia's Restaurant", aliases: ["Sylvia's", "Sylvias"],
    lat: 40.80872, lng: -73.94454, category: "food", neighborhood: "Harlem", difficulty: "iconic",
    clues: [
      "Run by the self-styled “Queen of Soul Food.”",
      "It opened in 1962 with 35 seats; presidents and celebrities line up for the fried chicken.",
      "Malcolm X Boulevard between 126th and 127th Streets.",
    ],
    fact: "Sylvia Woods bought the luncheonette where she waitressed, with money her mother raised by mortgaging her farm.",
  },
  {
    id: "frick", name: "The Frick Collection", aliases: ["Frick", "Frick Museum"],
    lat: 40.77110, lng: -73.96720, category: "museum", neighborhood: "Upper East Side", difficulty: "iconic",
    clues: [
      "An art museum inside a Gilded Age steel baron’s mansion.",
      "Vermeers, Rembrandts and an indoor garden court; it reopened in 2025 after a big renovation.",
      "Fifth Avenue at 70th Street, facing Central Park.",
    ],
    fact: "Its founder reportedly wanted it to make Andrew Carnegie’s mansion “look like a miner’s shack.”",
  },
  {
    id: "whitney", name: "Whitney Museum of American Art", aliases: ["The Whitney", "Whitney", "Whitney Museum"],
    lat: 40.73960, lng: -74.00890, category: "museum", neighborhood: "Meatpacking District", difficulty: "iconic",
    clues: [
      "A museum devoted to American art, founded by a sculptor and heiress.",
      "Its Renzo Piano building opened in 2015 with terraces overlooking the Hudson.",
      "Gansevoort Street, at the southern end of the elevated park.",
    ],
    fact: "Gertrude Vanderbilt Whitney founded it after the Met turned down her collection.",
  },
  {
    id: "ed-sullivan-theater", name: "Ed Sullivan Theater", aliases: ["The Late Show theater", "Late Show"],
    lat: 40.76383, lng: -73.98278, category: "theater", neighborhood: "Theater District", difficulty: "iconic",
    clues: [
      "A Broadway theater that has spent decades as a TV studio.",
      "The Beatles made their U.S. TV debut here in 1964 in front of 73 million viewers.",
      "Broadway between 53rd and 54th Streets, where “The Late Show” taped.",
    ],
    fact: "David Letterman’s “Late Show” moved in in 1993; Stephen Colbert took over in 2015.",
  },
  {
    id: "studio-54", name: "Studio 54", aliases: ["Studio Fifty-Four"],
    lat: 40.76436, lng: -73.98378, category: "theater", neighborhood: "Theater District", difficulty: "iconic",
    clues: [
      "The most exclusive nightclub of the disco era.",
      "Bianca Jagger rode in on a white horse; getting past the velvet rope was the real show.",
      "West 54th Street between Broadway and Eighth Avenue — today it’s a Broadway theater.",
    ],
    fact: "Before the disco, the building was a CBS TV studio; the name comes straight from its street.",
  },
  {
    id: "toms-restaurant", name: "Tom's Restaurant", aliases: ["Tom's Diner", "Monk's Cafe", "Tom's"],
    lat: 40.80556, lng: -73.96556, category: "food", neighborhood: "Morningside Heights", difficulty: "iconic",
    clues: [
      "A Greek diner seen by millions, most of whom never knew where it was.",
      "Its exterior played Monk’s Café on “Seinfeld,” and Suzanne Vega sang about it.",
      "Broadway at 112th Street, near Columbia.",
    ],
    fact: "Only the outside appeared on Seinfeld — the inside was a Hollywood set.",
  },
  {
    id: "friends-building", name: "The \"Friends\" Apartment Building", aliases: ["Friends Building", "Friends apartment", "90 Bedford Street"],
    lat: 40.73232, lng: -74.00529, category: "building", neighborhood: "West Village", difficulty: "iconic",
    clues: [
      "A corner building where six fictional pals “lived” for ten seasons.",
      "Its exterior shot introduced countless scenes at Monica’s place.",
      "Bedford Street at Grove Street in the West Village.",
    ],
    fact: "There’s no Central Perk downstairs — it’s a restaurant called The Little Owl.",
  },
  {
    id: "ghostbusters-firehouse", name: "Ghostbusters Firehouse", aliases: ["Hook & Ladder 8", "Ladder 8", "Ghostbusters HQ", "Ghostbusters"],
    lat: 40.71956, lng: -74.00662, category: "landmark", neighborhood: "Tribeca", difficulty: "iconic",
    clues: [
      "A working firehouse with a Hollywood side gig.",
      "In a 1984 comedy it was HQ for a team of paranormal exterminators.",
      "North Moore Street at Varick Street in Tribeca.",
    ],
    fact: "Only the outside was used — the interior scenes were shot at a firehouse in Los Angeles.",
  },
  {
    id: "columbus-circle", name: "Columbus Circle", aliases: [],
    lat: 40.76809, lng: -73.98189, category: "landmark", neighborhood: "Southwest corner of Central Park", difficulty: "iconic",
    clues: [
      "A busy traffic circle with a 70-foot granite column in the middle.",
      "It’s the official point from which road distances to New York City are measured.",
      "Where Broadway meets Eighth Avenue and Central Park South.",
    ],
    fact: "The column went up in 1892 for the 400th anniversary of a famous 1492 voyage.",
  },
  {
    id: "george-washington-bridge", name: "George Washington Bridge", aliases: ["GWB", "G.W. Bridge"],
    lat: 40.85010, lng: -73.94437, category: "bridge", neighborhood: "Washington Heights", difficulty: "iconic", radius: 40,
    path: [[40.84949, -73.94139], [40.85010, -73.94437], [40.85045, -73.94640]],
    clues: [
      "The world’s busiest motor-vehicle bridge.",
      "Its steel towers were meant to be clad in granite, but people liked them bare.",
      "Crosses the Hudson to New Jersey around 178th Street; a little red lighthouse sits beneath it.",
    ],
    fact: "On some holidays the world’s largest free-flying American flag hangs from its New Jersey tower.",
  },
  {
    id: "queensboro-bridge", name: "Queensboro Bridge", aliases: ["59th Street Bridge", "Ed Koch Queensboro Bridge"],
    lat: 40.75946, lng: -73.96063, category: "bridge", neighborhood: "Midtown East (Sutton Place)", difficulty: "iconic", radius: 40,
    path: [[40.76019, -73.96364], [40.75996, -73.96195], [40.75946, -73.96063], [40.75870, -73.95855]],
    clues: [
      "A 1909 cantilever bridge that hops over an island on its way across the river.",
      "Simon & Garfunkel told it to “slow down, you move too fast.”",
      "Leaves Manhattan around 59th–60th Streets, soaring over Roosevelt Island to Queens.",
    ],
    fact: "It was officially renamed for Mayor Ed Koch in 2011, but almost nobody calls it that.",
  },
  {
    id: "south-street-seaport", name: "South Street Seaport", aliases: ["Seaport", "Schermerhorn Row", "South Street Seaport Museum", "Pier 17"],
    lat: 40.70639, lng: -74.00361, category: "landmark", neighborhood: "Financial District (Seaport)", difficulty: "iconic",
    clues: [
      "Cobblestones and tall ships in the city’s oldest port district.",
      "Its Federal-style brick warehouses on Fulton Street date to the early 1800s.",
      "Fulton Street at the East River, beneath the elevated FDR Drive.",
    ],
    fact: "The Fulton Fish Market operated here for about 180 years before moving to the Bronx in 2005.",
  },
  {
    id: "tavern-on-the-green", name: "Tavern on the Green", aliases: ["Tavern"],
    lat: 40.77230, lng: -73.97780, category: "food", neighborhood: "Central Park", difficulty: "iconic",
    clues: [
      "A restaurant that started life as a sheepfold.",
      "The flock that grazed a nearby meadow slept in this building until 1934.",
      "Inside Central Park at West 67th Street, by the marathon finish line.",
    ],
    fact: "In its chandelier-filled heyday it was one of the highest-grossing restaurants in the country.",
  },
  {
    id: "wollman-rink", name: "Wollman Rink", aliases: ["Wollman", "Central Park ice rink"],
    lat: 40.76750, lng: -73.97444, category: "sports", neighborhood: "Central Park", difficulty: "iconic",
    clues: [
      "Skaters glide here with Central Park South’s skyline as a backdrop.",
      "The final scene of “Love Story” was filmed here, and so was a date in “Serendipity.”",
      "In the southeast part of Central Park near 62nd Street, by the Pond and Gapstow Bridge.",
    ],
    fact: "In summer it has traded the ice for a kids’ amusement park.",
  },
  {
    id: "bloomingdales", name: "Bloomingdale's", aliases: ["Bloomies", "Bloomingdales"],
    lat: 40.76221, lng: -73.96717, category: "shop", neighborhood: "Midtown East", difficulty: "iconic",
    clues: [
      "A department store with a nickname that sounds like a flower patch.",
      "Its shopping bags come in Little, Medium and Big Brown sizes.",
      "The whole block from Lexington to Third Avenue at 59th Street.",
    ],
    fact: "The founding brothers got their start selling hoop skirts on the Lower East Side.",
  },
  {
    id: "gracie-mansion", name: "Gracie Mansion", aliases: ["Mayor's Residence"],
    lat: 40.77611, lng: -73.94306, category: "building", neighborhood: "Yorkville (Upper East Side)", difficulty: "iconic",
    clues: [
      "A Federal-style country house from 1799.",
      "It’s been the official home of New York’s mayors since Fiorello La Guardia.",
      "Inside Carl Schurz Park at East 88th Street, overlooking Hell Gate.",
    ],
    fact: "Merchant Archibald Gracie built it — and hosted Alexander Hamilton there.",
  },
  {
    id: "sheep-meadow", name: "Sheep Meadow", aliases: [],
    lat: 40.77153, lng: -73.97508, category: "park", neighborhood: "Central Park", difficulty: "iconic", radius: 120,
    clues: [
      "A 15-acre lawn that’s an official “quiet zone.”",
      "Real sheep grazed here until 1934.",
      "Central Park between West 66th and 69th Streets.",
    ],
    fact: "It was first called the Parade Ground, meant for military drills.",
  },

  /* ============================== LOCAL =============================== */
  {
    id: "russ-and-daughters", name: "Russ & Daughters", aliases: ["Russ and Daughters"],
    lat: 40.72259, lng: -73.98832, category: "food", neighborhood: "Lower East Side", difficulty: "local",
    clues: [
      "An “appetizing” shop selling smoked fish since 1914.",
      "The founder had no sons, so he named it after his girls.",
      "East Houston Street between Orchard and Allen, a stone’s throw from a famous deli.",
    ],
    fact: "It’s now run by the fourth generation of the family, under the same neon sign.",
  },
  {
    id: "mcsorleys", name: "McSorley's Old Ale House", aliases: ["McSorley's", "McSorleys"],
    lat: 40.72871, lng: -73.98974, category: "bar", neighborhood: "East Village", difficulty: "local",
    clues: [
      "One of NYC’s oldest saloons, with sawdust on the floor.",
      "Only two choices: light or dark. Women weren’t allowed in until 1970.",
      "East 7th Street, just off Cooper Square.",
    ],
    fact: "The dusty wishbones over the bar were left by WWI soldiers who never came back to claim them.",
  },
  {
    id: "joes-pizza", name: "Joe's Pizza (Carmine St)", aliases: ["Joe's Pizza", "Joes Pizza", "Joe's"],
    lat: 40.73066, lng: -74.00219, category: "food", neighborhood: "Greenwich Village", difficulty: "local",
    clues: [
      "A no-frills slice joint open since 1975.",
      "Peter Parker delivered pies for this place in “Spider-Man 2.”",
      "Carmine Street just off Bleecker, by Father Demo Square.",
    ],
    fact: "Founder Joe Pozzuoli came from Naples; many call it the quintessential New York slice.",
  },
  {
    id: "mamouns", name: "Mamoun's Falafel", aliases: ["Mamoun's", "Mamouns"],
    lat: 40.73024, lng: -74.00043, category: "food", neighborhood: "Greenwich Village", difficulty: "local",
    clues: [
      "A tiny shop that’s fed students and night owls since 1971.",
      "Said to be one of the oldest falafel joints in the country — go easy on the hot sauce.",
      "MacDougal Street, steps from the Comedy Cellar and Café Wha?.",
    ],
    fact: "Syrian-born founder Mamoun Chater opened it in 1971; it’s still family-run.",
  },
  {
    id: "petes-tavern", name: "Pete's Tavern", aliases: ["Petes Tavern"],
    lat: 40.73653, lng: -73.98675, category: "bar", neighborhood: "Gramercy", difficulty: "local",
    clues: [
      "It claims to be NYC’s oldest continuously operating bar and restaurant (since 1864).",
      "During Prohibition it posed as a flower shop and kept on pouring.",
      "Irving Place at East 18th Street.",
    ],
    fact: "A booth is dedicated to O. Henry, who supposedly wrote “The Gift of the Magi” there.",
  },
  {
    id: "elizabeth-street-garden", name: "Elizabeth Street Garden", aliases: [],
    lat: 40.72219, lng: -73.99464, category: "park", neighborhood: "Nolita", difficulty: "local",
    clues: [
      "A quirky sculpture garden tucked between tenements.",
      "Stone lions, balustrades and statues salvaged from old estates sit among the trees.",
      "Between Prince and Spring Streets in Nolita.",
    ],
    fact: "It’s been at the center of a long fight between neighbors who love it and plans for affordable housing on the lot.",
  },
  {
    id: "paley-park", name: "Paley Park", aliases: [],
    lat: 40.76028, lng: -73.97511, category: "park", neighborhood: "Midtown", difficulty: "local",
    clues: [
      "A “vest-pocket park” about the size of a tennis court.",
      "A 20-foot waterfall drowns out the traffic noise.",
      "East 53rd Street just off Fifth Avenue, where the Stork Club once stood.",
    ],
    fact: "CBS founder William S. Paley built it in 1967 and named it after his father.",
  },
  {
    id: "greenacre-park", name: "Greenacre Park", aliases: ["Greenacre"],
    lat: 40.75621, lng: -73.96925, category: "park", neighborhood: "Turtle Bay", difficulty: "local",
    clues: [
      "A hidden pocket park with a 25-foot waterfall.",
      "A gift from Abby Rockefeller Mauzé, it opened in 1971.",
      "East 51st Street between Second and Third Avenues.",
    ],
    fact: "Designed by Hideo Sasaki’s firm, it’s studied as a model of tiny urban parks.",
  },
  {
    id: "sylvan-terrace", name: "Sylvan Terrace", aliases: [],
    lat: 40.83472, lng: -73.93917, category: "oddity", neighborhood: "Washington Heights", difficulty: "local",
    clues: [
      "A single block of 20 wooden row houses that feels frozen in 1882.",
      "It was once the carriage drive of a Revolutionary War–era mansion next door.",
      "A cobblestone lane between St. Nicholas Avenue and Jumel Terrace at 161st Street.",
    ],
    fact: "The mansion next door served as George Washington’s headquarters in 1776.",
  },
  {
    id: "pomander-walk", name: "Pomander Walk", aliases: [],
    lat: 40.79399, lng: -73.97330, category: "oddity", neighborhood: "Upper West Side", difficulty: "local",
    clues: [
      "A gated lane of mock-Tudor cottages hidden in the middle of a block.",
      "Inspired by a 1910 London stage play, it looks like a storybook English village.",
      "Between West 94th and 95th Streets, Broadway and West End Avenue.",
    ],
    fact: "Residents over the years reportedly included Humphrey Bogart and Rosalind Russell.",
  },
  {
    id: "little-red-lighthouse", name: "Little Red Lighthouse", aliases: ["Jeffrey's Hook Lighthouse", "Jeffrey's Hook Light"],
    lat: 40.85026, lng: -73.94696, category: "landmark", neighborhood: "Fort Washington Park (Washington Heights)", difficulty: "local",
    clues: [
      "A tiny cast-iron beacon that starred in a 1942 children’s book.",
      "A giant new neighbor made it obsolete; kids wrote letters to save it.",
      "On the rocky Hudson shore in Fort Washington Park, right under the GWB.",
    ],
    fact: "“The Little Red Lighthouse and the Great Gray Bridge” made it so beloved that the city kept it.",
  },
  {
    id: "freedom-tunnel", name: "Freedom Tunnel", aliases: ["Riverside Park tunnel"],
    lat: 40.81452, lng: -73.96420, category: "oddity", neighborhood: "Riverside Park (West Harlem)", difficulty: "local",
    clues: [
      "A long, dark railroad tunnel that became an underground art gallery.",
      "Its nickname honors a graffiti artist whose murals glowed under shafts of light from the grates above.",
      "Runs beneath Riverside Park; its northern portal opens near West 123rd Street.",
    ],
    fact: "Amtrak trains still run through it; the people who lived inside were moved out in the early 1990s.",
  },
  {
    id: "city-hall-station", name: "Old City Hall Subway Station", aliases: ["City Hall station", "City Hall Loop", "Old City Hall Station"],
    lat: 40.71257, lng: -74.00665, category: "subway", neighborhood: "Civic Center", difficulty: "local",
    clues: [
      "The jewel of NYC’s original 1904 subway — closed since 1945.",
      "Guastavino tile vaults, brass chandeliers and stained-glass skylights.",
      "Stay on the downtown 6 past its last stop to glimpse it on the loop beneath the park.",
    ],
    fact: "It closed partly because its tightly curved platform was too short for newer, longer trains.",
  },
  {
    id: "alamo-cube", name: "The Alamo (Astor Place Cube)", aliases: ["Astor Place Cube", "The Cube", "Alamo"],
    lat: 40.73000, lng: -73.99111, category: "oddity", neighborhood: "East Village", difficulty: "local",
    clues: [
      "An 1,800-pound steel sculpture that spins if enough people push.",
      "Installed by Tony Rosenthal in 1967, it’s been a meeting spot for skaters and students ever since.",
      "Balanced on one corner on a traffic island near Cooper Union.",
    ],
    fact: "Pranksters once dressed it up as a giant Rubik’s Cube.",
  },
  {
    id: "nom-wah", name: "Nom Wah Tea Parlor", aliases: ["Nom Wah"],
    lat: 40.71449, lng: -73.99819, category: "food", neighborhood: "Chinatown", difficulty: "local",
    clues: [
      "Chinatown’s oldest dim sum parlor, open since 1920.",
      "Its retro diner booths have starred in movies and music videos.",
      "On crooked Doyers Street, once nicknamed “the Bloody Angle.”",
    ],
    fact: "It started as a bakery famous for mooncakes and almond cookies.",
  },
  {
    id: "columbus-park", name: "Columbus Park", aliases: ["Mulberry Bend Park"],
    lat: 40.71486, lng: -73.99986, category: "park", neighborhood: "Chinatown", difficulty: "local",
    clues: [
      "Seniors gather here for mahjong, Chinese chess and erhu music.",
      "It replaced a notorious Five Points slum photographed by Jacob Riis.",
      "Bounded by Mulberry, Baxter, Bayard and Worth Streets.",
    ],
    fact: "It opened in 1897 after the slum known as Mulberry Bend was torn down.",
  },
  {
    id: "ferrara", name: "Ferrara Bakery & Cafe", aliases: ["Ferrara", "Ferrara Bakery"],
    lat: 40.71904, lng: -73.99702, category: "food", neighborhood: "Little Italy", difficulty: "local",
    clues: [
      "It bills itself as America’s first espresso bar (since 1892).",
      "Cannoli and sfogliatelle under a classic neon sign.",
      "Grand Street just off Mulberry Street.",
    ],
    fact: "It was founded as a place for opera lovers to linger over espresso and pastries.",
  },
  {
    id: "old-st-patricks", name: "St. Patrick's Old Cathedral", aliases: ["Old St. Patrick's Cathedral", "Basilica of St. Patrick's Old Cathedral", "Old St Pat's"],
    lat: 40.72359, lng: -73.99519, category: "church", neighborhood: "Nolita", difficulty: "local",
    clues: [
      "New York’s first Catholic cathedral, completed in 1815.",
      "Its walled churchyard and catacombs appear in “The Godfather.”",
      "Mulberry Street at Prince Street in Nolita.",
    ],
    fact: "Its tall brick wall was partly built to protect it from anti-Catholic mobs in the 1800s.",
  },
  {
    id: "economy-candy", name: "Economy Candy", aliases: [],
    lat: 40.72005, lng: -73.98790, category: "shop", neighborhood: "Lower East Side", difficulty: "local",
    clues: [
      "A floor-to-ceiling sweets shop open since 1937.",
      "It began as a Depression-era shoe-repair shop that sold candy on the side.",
      "Rivington Street between Essex and Ludlow.",
    ],
    fact: "It stocks around 2,000 kinds of candy, from Pez to halvah.",
  },
  {
    id: "essex-market", name: "Essex Market", aliases: ["Essex Street Market"],
    lat: 40.71792, lng: -73.98805, category: "food", neighborhood: "Lower East Side", difficulty: "local",
    clues: [
      "A public market created in 1940 to get pushcarts off the streets.",
      "Butchers, cheesemongers and a food court, now in a shiny modern building.",
      "At Delancey Street, part of a huge new development near the Williamsburg Bridge.",
    ],
    fact: "Mayor Fiorello La Guardia opened it in 1940; it moved across the street in 2019.",
  },
  {
    id: "tenement-museum", name: "Tenement Museum", aliases: ["Lower East Side Tenement Museum", "97 Orchard Street"],
    lat: 40.71850, lng: -73.99014, category: "museum", neighborhood: "Lower East Side", difficulty: "local",
    clues: [
      "A museum in buildings where some 15,000 immigrants once lived.",
      "Tour the restored, cramped apartments of real families from 1863 to 2011.",
      "Orchard Street, just below Delancey.",
    ],
    fact: "The upper floors of its main building were sealed in 1935 and found nearly frozen in time.",
  },
  {
    id: "bowery-ballroom", name: "Bowery Ballroom", aliases: [],
    lat: 40.72040, lng: -73.99340, category: "music venue", neighborhood: "Lower East Side", difficulty: "local",
    clues: [
      "A beloved mid-sized rock club with a basement bar.",
      "Built just before the 1929 crash, it sat empty for years before becoming a venue in 1998.",
      "Delancey Street at Chrystie Street.",
    ],
    fact: "Its sister club, Mercury Lounge, is just a few blocks away on Houston Street.",
  },
  {
    id: "webster-hall", name: "Webster Hall", aliases: [],
    lat: 40.73167, lng: -73.98917, category: "music venue", neighborhood: "East Village", difficulty: "local",
    clues: [
      "An 1886 dance hall that’s hosted anarchists, masquerade balls and rock stars.",
      "Bohemian costume bashes earned it the nickname “the Devil’s Playhouse.”",
      "East 11th Street between Third and Fourth Avenues.",
    ],
    fact: "In the 1950s and ’60s RCA used it as a recording studio for Broadway cast albums.",
  },
  {
    id: "village-vanguard", name: "Village Vanguard", aliases: ["The Vanguard"],
    lat: 40.73600, lng: -74.00161, category: "music venue", neighborhood: "West Village", difficulty: "local",
    clues: [
      "A wedge-shaped basement club with famously perfect sound.",
      "Coltrane, Bill Evans and Sonny Rollins recorded classic live albums here.",
      "Seventh Avenue South just below West 11th Street, under a red awning.",
    ],
    fact: "Open since 1935, it’s one of the oldest jazz clubs still running.",
  },
  {
    id: "mintons", name: "Minton's Playhouse", aliases: ["Minton's", "Mintons"],
    lat: 40.80474, lng: -73.95238, category: "music venue", neighborhood: "Harlem", difficulty: "local",
    clues: [
      "A Harlem club where a whole new kind of jazz was born in the 1940s.",
      "Thelonious Monk was the house pianist; after-hours jams gave rise to bebop.",
      "West 118th Street, in the old Hotel Cecil.",
    ],
    fact: "Its 1940s jam sessions included Dizzy Gillespie, Charlie Parker and Kenny Clarke.",
  },
  {
    id: "jefferson-market-library", name: "Jefferson Market Library", aliases: ["Jefferson Market Courthouse", "Jefferson Market"],
    lat: 40.73472, lng: -73.99917, category: "building", neighborhood: "Greenwich Village", difficulty: "local",
    clues: [
      "A Victorian Gothic fairy-tale building with a clock tower.",
      "Built in 1877 as a courthouse; today it lends books.",
      "Sixth Avenue at West 10th Street.",
    ],
    fact: "Its tower once doubled as a fire lookout, with a bell to sound the alarm.",
  },
  {
    id: "hess-triangle", name: "Hess Triangle", aliases: ["Hess Estate"],
    lat: 40.73350, lng: -74.00306, category: "oddity", neighborhood: "West Village", difficulty: "local",
    clues: [
      "Possibly the smallest piece of private property in the city.",
      "A tiny mosaic declares its owners never dedicated it “for public purposes.”",
      "In the sidewalk at Seventh Avenue South and Christopher Street, outside a cigar shop.",
    ],
    fact: "It’s about 500 square inches — a defiant leftover from when the city seized a building to extend Seventh Avenue.",
  },
  {
    id: "narrowest-house", name: "75½ Bedford Street", aliases: ["Narrowest House", "Millay House", "Edna St. Vincent Millay House"],
    lat: 40.73137, lng: -74.00503, category: "oddity", neighborhood: "West Village", difficulty: "local",
    clues: [
      "Often called the narrowest house in New York City.",
      "Just 9.5 feet wide — a Pulitzer-winning poet lived here in the 1920s.",
      "Between Morton and Commerce Streets in the West Village.",
    ],
    fact: "Poet Edna St. Vincent Millay lived here around 1923–24.",
  },
  {
    id: "earth-room", name: "The New York Earth Room", aliases: ["Earth Room"],
    lat: 40.72598, lng: -73.99975, category: "oddity", neighborhood: "SoHo", difficulty: "local",
    clues: [
      "A second-floor loft filled with something you’d normally find outside.",
      "Since 1977: 280,000 pounds of it, 22 inches deep. Look, don’t touch.",
      "Wooster Street in SoHo — an artwork by Walter De Maria.",
    ],
    fact: "A caretaker has raked and watered the soil for decades.",
  },
  {
    id: "haughwout-building", name: "E.V. Haughwout Building", aliases: ["Haughwout Building", "Haughwout"],
    lat: 40.72171, lng: -73.99960, category: "building", neighborhood: "SoHo", difficulty: "local",
    clues: [
      "A cast-iron palazzo of a store, built in 1857.",
      "It had the world’s first commercial passenger elevator, by Elisha Otis.",
      "Broadway at Broome Street.",
    ],
    fact: "Its facade copies a Venetian library — but cast in iron instead of carved stone.",
  },
  {
    id: "dominique-ansel", name: "Dominique Ansel Bakery", aliases: ["Dominique Ansel", "Cronut bakery"],
    lat: 40.72517, lng: -74.00295, category: "food", neighborhood: "SoHo", difficulty: "local",
    clues: [
      "A French pastry shop that caused months-long lines in 2013.",
      "It invented a trademarked croissant–doughnut hybrid.",
      "Spring Street between Sixth Avenue and Thompson Street.",
    ],
    fact: "Scalpers once resold its Cronuts for as much as $100 each.",
  },
  {
    id: "ear-inn", name: "The Ear Inn", aliases: ["Ear Inn"],
    lat: 40.72583, lng: -74.00972, category: "bar", neighborhood: "Hudson Square", difficulty: "local",
    clues: [
      "One of the city’s oldest bars, in a house from around 1817.",
      "Its neon “BAR” sign was partly painted over to dodge a landmark review — creating its name.",
      "Spring Street near Greenwich Street, once right on the Hudson waterfront.",
    ],
    fact: "The house was built for James Brown, a Black veteran said to have served George Washington.",
  },
  {
    id: "56-leonard", name: "56 Leonard Street", aliases: ["Jenga Building", "56 Leonard"],
    lat: 40.71767, lng: -74.00637, category: "building", neighborhood: "Tribeca", difficulty: "local",
    clues: [
      "A 2017 luxury tower that looks like a teetering stack of glass boxes.",
      "Its nickname comes from a stacking game; a mirrored Anish Kapoor sculpture squishes under one corner.",
      "Leonard Street at Church Street in Tribeca.",
    ],
    fact: "The Kapoor sculpture at its base looks like a giant bean being crushed by the tower.",
  },
  {
    id: "mmuseumm", name: "Mmuseumm", aliases: ["Mmuseum"],
    lat: 40.71741, lng: -74.00272, category: "museum", neighborhood: "Tribeca / Chinatown", difficulty: "local",
    clues: [
      "One of the world’s tiniest museums.",
      "It lives in an old freight elevator shaft, viewable through a window 24/7.",
      "Cortlandt Alley, a gritty lane between Canal and Franklin used in countless film shoots.",
    ],
    fact: "Its collection celebrates the overlooked — ordinary objects from everyday life around the world.",
  },
  {
    id: "county-courthouse", name: "New York County Courthouse", aliases: ["60 Centre Street", "Foley Square courthouse", "State Supreme Court"],
    lat: 40.71422, lng: -74.00153, category: "building", neighborhood: "Civic Center", difficulty: "local",
    clues: [
      "A hexagonal courthouse whose steps are a TV and movie staple.",
      "Its columned steps appear in “Law & Order,” “The Godfather” and “Miracle on 34th Street.”",
      "On the east side of Foley Square.",
    ],
    fact: "It’s shaped like a hexagon because it was built on an irregular lot.",
  },
  {
    id: "african-burial-ground", name: "African Burial Ground National Monument", aliases: ["African Burial Ground"],
    lat: 40.71444, lng: -74.00444, category: "landmark", neighborhood: "Civic Center", difficulty: "local",
    clues: [
      "A memorial to a colonial-era cemetery rediscovered in 1991.",
      "Digging for a federal building uncovered the remains of hundreds of free and enslaved Africans.",
      "Duane Street at Elk Street, near Foley Square.",
    ],
    fact: "As many as 15,000 people may have been buried at the site in the 1600s and 1700s.",
  },
  {
    id: "st-pauls-chapel", name: "St. Paul's Chapel", aliases: ["Saint Paul's Chapel", "St Pauls Chapel"],
    lat: 40.71132, lng: -74.00920, category: "church", neighborhood: "Financial District", difficulty: "local",
    clues: [
      "Manhattan’s oldest surviving church building (1766).",
      "George Washington prayed here after his inauguration; after 9/11 it became a relief station.",
      "Broadway at Fulton Street, across from the World Trade Center.",
    ],
    fact: "Not a single window broke when the Twin Towers fell just across the street.",
  },
  {
    id: "fraunces-tavern", name: "Fraunces Tavern", aliases: ["Fraunces"],
    lat: 40.70330, lng: -74.01130, category: "bar", neighborhood: "Financial District", difficulty: "local",
    clues: [
      "A colonial-era tavern that’s also a museum.",
      "George Washington bid farewell to his officers here in 1783.",
      "Pearl Street at Broad Street.",
    ],
    fact: "The building you see is largely a 1907 reconstruction of the 18th-century tavern.",
  },
  {
    id: "delmonicos", name: "Delmonico's", aliases: ["Delmonicos"],
    lat: 40.70504, lng: -74.01021, category: "food", neighborhood: "Financial District", difficulty: "local",
    clues: [
      "Often called America’s first fine-dining restaurant (1837).",
      "Birthplace of a famous steak, eggs Benedict and, some say, baked Alaska.",
      "Where Beaver Street meets William Street, behind a pillared entrance.",
    ],
    fact: "Legend says the pillars at its door were brought over from Pompeii.",
  },
  {
    id: "elevated-acre", name: "The Elevated Acre", aliases: ["Elevated Acre", "55 Water Street Plaza"],
    lat: 40.70333, lng: -74.00944, category: "park", neighborhood: "Financial District", difficulty: "local",
    clues: [
      "A secret park hiding up an escalator.",
      "An acre of lawn and boardwalk on top of an office building’s base, with East River views.",
      "Water Street near Old Slip — look for the escalator.",
    ],
    fact: "It’s a privately owned public space — a perk developers provide in exchange for building bigger.",
  },
  {
    id: "irish-hunger-memorial", name: "Irish Hunger Memorial", aliases: ["Irish Famine Memorial"],
    lat: 40.71514, lng: -74.01655, category: "landmark", neighborhood: "Battery Park City", difficulty: "local",
    clues: [
      "A half-acre slice of rural Ireland, cantilevered over a busy street.",
      "It includes a real 19th-century stone cottage shipped over from County Mayo.",
      "Vesey Street at North End Avenue in Battery Park City.",
    ],
    fact: "Its stones came from every one of Ireland’s 32 counties.",
  },
  {
    id: "empire-diner", name: "Empire Diner", aliases: [],
    lat: 40.74711, lng: -74.00436, category: "food", neighborhood: "Chelsea", difficulty: "local",
    clues: [
      "A gleaming Art Deco dining car from 1946.",
      "It’s a postcard favorite and shows up in Woody Allen’s “Manhattan.”",
      "Tenth Avenue at West 22nd Street.",
    ],
    fact: "A tiny model of a very famous skyscraper perches on its roof.",
  },
  {
    id: "shake-shack-madison", name: "Shake Shack (Madison Square Park)", aliases: ["Shake Shack", "Original Shake Shack"],
    lat: 40.74151, lng: -73.98817, category: "food", neighborhood: "Flatiron District", difficulty: "local",
    clues: [
      "A burger stand that grew into a global chain.",
      "It began in 2001 as a hot-dog cart supporting a park art project.",
      "Inside Madison Square Park, across from the Flatiron Building.",
    ],
    fact: "The lines got so long that a webcam (“Shack Cam”) let people check the wait.",
  },
  {
    id: "kalustyans", name: "Kalustyan's", aliases: ["Kalustyans"],
    lat: 40.74278, lng: -73.98194, category: "shop", neighborhood: "Murray Hill (“Curry Hill”)", difficulty: "local",
    clues: [
      "A spice emporium stocking thousands of products from around the globe.",
      "Open since 1944; chefs come for rare chilies, teas and dals.",
      "Lexington Avenue in the high 20s, a stretch nicknamed “Curry Hill.”",
    ],
    fact: "It started as an Armenian-owned spice shop and grew into a global pantry.",
  },
  {
    id: "little-church", name: "The Little Church Around the Corner", aliases: ["Church of the Transfiguration", "Little Church"],
    lat: 40.74526, lng: -73.98598, category: "church", neighborhood: "NoMad", difficulty: "local",
    clues: [
      "A cozy Episcopal church set back in a garden.",
      "Its nickname dates to 1870, when another church refused to bury an actor and sent mourners here.",
      "East 29th Street just off Fifth Avenue.",
    ],
    fact: "Actors have loved it ever since — a stained-glass window honors Edwin Booth.",
  },
  {
    id: "morgan-library", name: "The Morgan Library & Museum", aliases: ["Morgan Library", "The Morgan", "Pierpont Morgan Library"],
    lat: 40.74917, lng: -73.98139, category: "museum", neighborhood: "Murray Hill", difficulty: "local",
    clues: [
      "A banker’s private library turned museum.",
      "It holds three Gutenberg Bibles and a jaw-dropping three-story book room.",
      "Madison Avenue at 36th Street.",
    ],
    fact: "J.P. Morgan once locked bankers in his library overnight to end the Panic of 1907.",
  },
  {
    id: "tudor-city", name: "Tudor City", aliases: ["Tudor City Place"],
    lat: 40.74912, lng: -73.97052, category: "building", neighborhood: "Turtle Bay", difficulty: "local",
    clues: [
      "A 1920s apartment complex built as a self-contained “city within a city.”",
      "Its buildings had few windows facing east — toward slaughterhouses on the river.",
      "On a bluff above First Avenue at 42nd Street, with a bridge looking out over the UN.",
    ],
    fact: "The slaughterhouses it turned its back on were later cleared to make way for the UN.",
  },
  {
    id: "algonquin", name: "The Algonquin Hotel", aliases: ["Algonquin", "Algonquin Round Table"],
    lat: 40.75583, lng: -73.98233, category: "building", neighborhood: "Midtown", difficulty: "local",
    clues: [
      "A hotel famous for a sharp-tongued literary lunch club of the 1920s.",
      "Dorothy Parker’s “Round Table” traded barbs here; a resident cat has roamed it for decades.",
      "West 44th Street between Fifth and Sixth Avenues.",
    ],
    fact: "Its resident cats are always named Matilda (if female) or Hamlet (if male).",
  },
  {
    id: "sardis", name: "Sardi's", aliases: ["Sardis"],
    lat: 40.75791, lng: -73.98753, category: "food", neighborhood: "Theater District", difficulty: "local",
    clues: [
      "A restaurant where Broadway stars wait up for opening-night reviews.",
      "Its walls are covered in about 1,300 caricatures of celebrities.",
      "West 44th Street, right by Shubert Alley.",
    ],
    fact: "The idea for the Tony Awards was hatched here.",
  },
  {
    id: "rudys", name: "Rudy's Bar & Grill", aliases: ["Rudy's", "Rudys"],
    lat: 40.75999, lng: -73.99173, category: "bar", neighborhood: "Hell's Kitchen", difficulty: "local",
    clues: [
      "A dive bar loved for cheap pitchers and red duct-taped booths.",
      "Order a drink and you get a free hot dog.",
      "Ninth Avenue in the mid-40s — look for the big pig statue out front.",
    ],
    fact: "It’s been pouring since 1933, right after Prohibition ended.",
  },
  {
    id: "halal-guys", name: "The Halal Guys (original cart)", aliases: ["Halal Guys", "53rd and 6th"],
    lat: 40.76168, lng: -73.97928, category: "food", neighborhood: "Midtown", difficulty: "local",
    clues: [
      "A street-food cart that became a worldwide franchise.",
      "Chicken over rice drenched in white sauce — beware the red sauce.",
      "The corner of West 53rd Street and Sixth Avenue.",
    ],
    fact: "It started in 1990 as a hot-dog cart, then switched to halal food for Muslim cab drivers.",
  },
  {
    id: "pj-clarkes", name: "P.J. Clarke's", aliases: ["PJ Clarke's", "PJ Clarkes"],
    lat: 40.75901, lng: -73.96809, category: "bar", neighborhood: "Midtown East", difficulty: "local",
    clues: [
      "A 19th-century saloon that refused to sell out to a skyscraper.",
      "The tower got built around it instead; Sinatra had his own table.",
      "Third Avenue at 55th Street.",
    ],
    fact: "Nat King Cole called its burger “the Cadillac of burgers.”",
  },
  {
    id: "apple-fifth-avenue", name: "Apple Fifth Avenue", aliases: ["Apple Store Fifth Avenue", "Apple Cube", "Glass Cube"],
    lat: 40.76383, lng: -73.97298, category: "shop", neighborhood: "Midtown", difficulty: "local",
    clues: [
      "A store you enter through a giant glass box.",
      "Open 24 hours a day, 365 days a year — mostly underground.",
      "Fifth Avenue at 59th Street, across from the Plaza.",
    ],
    fact: "The original cube used 90 glass panels; a 2011 rebuild got it down to just 15.",
  },
  {
    id: "argosy", name: "Argosy Book Store", aliases: ["Argosy"],
    lat: 40.76240, lng: -73.96910, category: "shop", neighborhood: "Midtown East", difficulty: "local",
    clues: [
      "Said to be NYC’s oldest independent bookstore (1925).",
      "Six floors of rare books, antique maps and autographs.",
      "East 59th Street between Park and Lexington Avenues.",
    ],
    fact: "Its sidewalk carts of cheap books have been a fixture for decades.",
  },
  {
    id: "roosevelt-island-tram", name: "Roosevelt Island Tramway", aliases: ["Roosevelt Island Tram", "The Tram"],
    lat: 40.76115, lng: -73.96430, category: "subway", neighborhood: "Midtown East (Lenox Hill)", difficulty: "local",
    clues: [
      "A commute with a view, gliding about 250 feet above a river.",
      "North America’s first commuter aerial tramway (1976).",
      "Its Manhattan station is at Second Avenue and 60th Street.",
    ],
    fact: "It’s part of the transit system — tap the same card you use on the subway.",
  },
  {
    id: "helmsley-building", name: "Helmsley Building", aliases: ["230 Park Avenue", "New York Central Building"],
    lat: 40.75444, lng: -73.97583, category: "building", neighborhood: "Midtown East", difficulty: "local",
    clues: [
      "A gilded 1929 tower that a major avenue drives right through.",
      "Two traffic tunnels pierce its base; it was built for a railroad company.",
      "Straddles Park Avenue just north of Grand Central, at 46th Street.",
    ],
    fact: "It was built as the New York Central Railroad’s headquarters.",
  },
  {
    id: "grace-church", name: "Grace Church", aliases: ["Grace Church Manhattan"],
    lat: 40.73197, lng: -73.99089, category: "church", neighborhood: "Greenwich Village", difficulty: "local",
    clues: [
      "A delicate Gothic Revival church that makes Broadway bend.",
      "Broadway jogs here because a landowner wouldn’t let it cut straight through.",
      "Broadway at East 10th Street.",
    ],
    fact: "P.T. Barnum’s star General Tom Thumb was married here in 1863.",
  },
  {
    id: "st-marks-church", name: "St. Mark's Church in-the-Bowery", aliases: ["St. Mark's Church", "St Marks Church"],
    lat: 40.73038, lng: -73.98712, category: "church", neighborhood: "East Village", difficulty: "local",
    clues: [
      "Manhattan’s second-oldest church, on land that was a Dutch governor’s farm.",
      "Peter Stuyvesant is buried in its vault.",
      "Second Avenue at East 10th Street.",
    ],
    fact: "It’s also a long-running home for poetry readings and avant-garde dance.",
  },
  {
    id: "veselka", name: "Veselka", aliases: [],
    lat: 40.72898, lng: -73.98700, category: "food", neighborhood: "East Village", difficulty: "local",
    clues: [
      "A round-the-clock diner serving pierogi since 1954.",
      "A Ukrainian institution in a historically Ukrainian neighborhood.",
      "Second Avenue at East 9th Street.",
    ],
    fact: "The name means “rainbow” in Ukrainian.",
  },
  {
    id: "russian-turkish-baths", name: "Russian & Turkish Baths", aliases: ["Russian and Turkish Baths", "10th Street Baths"],
    lat: 40.72828, lng: -73.98354, category: "oddity", neighborhood: "East Village", difficulty: "local",
    clues: [
      "A steamy old-school bathhouse open since 1892.",
      "Brave a sauna heated by tons of rocks, then jump in the icy plunge pool.",
      "East 10th Street between First Avenue and Avenue A.",
    ],
    fact: "For years its two feuding co-owners took turns, each running it on alternate weeks.",
  },
  {
    id: "nuyorican-poets-cafe", name: "Nuyorican Poets Cafe", aliases: ["Nuyorican", "Nuyorican Poets Café"],
    lat: 40.72195, lng: -73.98178, category: "theater", neighborhood: "Alphabet City (East Village)", difficulty: "local",
    clues: [
      "A performance space that helped launch the poetry slam scene.",
      "Founded in 1973 in a poet’s living room to showcase Puerto Rican writers.",
      "East 3rd Street between Avenues B and C.",
    ],
    fact: "Its Friday Night Slam has been a proving ground for spoken-word stars for decades.",
  },
  {
    id: "tompkins-square-park", name: "Tompkins Square Park", aliases: ["Tompkins Square", "Tompkins"],
    lat: 40.72639, lng: -73.98167, category: "park", neighborhood: "East Village", difficulty: "local", radius: 120,
    clues: [
      "A park with a long history of riots, rallies and rebellion.",
      "Home to one of NYC’s first dog runs and a famous Halloween dog parade.",
      "Between Avenues A and B, from 7th to 10th Streets.",
    ],
    fact: "The Hare Krishna movement’s U.S. story began under one of its elm trees in 1966.",
  },
  {
    id: "merchants-house", name: "Merchant's House Museum", aliases: ["Merchant's House", "Old Merchant's House", "Seabury Tredwell House"],
    lat: 40.72767, lng: -73.99236, category: "museum", neighborhood: "NoHo", difficulty: "local",
    clues: [
      "A perfectly preserved 1832 rowhouse, often called the city’s most haunted house.",
      "The same family lived here for nearly 100 years — and their furniture never left.",
      "East 4th Street between Lafayette Street and the Bowery.",
    ],
    fact: "Gertrude Tredwell, the last of the family, lived here until 1933 — and some say she never left.",
  },
  {
    id: "new-museum", name: "New Museum", aliases: ["New Museum of Contemporary Art"],
    lat: 40.72224, lng: -73.99322, category: "museum", neighborhood: "Lower East Side (Bowery)", difficulty: "local",
    clues: [
      "A contemporary art museum that looks like a stack of off-kilter boxes.",
      "Designed by the Japanese firm SANAA, its tower opened in 2007.",
      "On the Bowery, facing the end of Prince Street.",
    ],
    fact: "Founded in 1977, it’s devoted entirely to contemporary art.",
  },
  {
    id: "eldridge-street-synagogue", name: "Eldridge Street Synagogue", aliases: ["Museum at Eldridge Street"],
    lat: 40.71472, lng: -73.99361, category: "church", neighborhood: "Chinatown / Lower East Side", difficulty: "local",
    clues: [
      "One of the first great synagogues built by Eastern European Jews in America (1887).",
      "Its huge round window was remade in 2010 with 1,200 pieces of glass by artist Kiki Smith.",
      "Between Canal and Division Streets in Chinatown.",
    ],
    fact: "After decades of decline, pigeons roosted in the sanctuary until a 20-year restoration.",
  },
  {
    id: "manhattan-bridge-arch", name: "Manhattan Bridge Arch & Colonnade", aliases: ["Manhattan Bridge", "Manhattan Bridge Arch"],
    lat: 40.71530, lng: -73.99518, category: "bridge", neighborhood: "Chinatown", difficulty: "local",
    clues: [
      "A grand Beaux-Arts gateway modeled on Paris’s Porte Saint-Denis.",
      "Its curving colonnade frames the entrance to a 1909 bridge that carries subway trains to Brooklyn.",
      "Where the Bowery meets Canal Street in Chinatown.",
    ],
    fact: "Carrère and Hastings — architects of the main public library — designed it.",
  },
  {
    id: "the-cage", name: "The Cage (West 4th Street Courts)", aliases: ["West 4th Street Courts", "The Cage", "West 4th Courts"],
    lat: 40.73139, lng: -74.00083, category: "sports", neighborhood: "Greenwich Village", difficulty: "local",
    clues: [
      "A fenced-in basketball court where streetball reputations are made.",
      "Its tiny size makes games famously physical; crowds press against the chain-link.",
      "Sixth Avenue at West 3rd Street, right above a busy subway hub.",
    ],
    fact: "Its summer tournament has drawn NBA players and scouts for decades.",
  },
  {
    id: "gramercy-park", name: "Gramercy Park", aliases: [],
    lat: 40.73794, lng: -73.98591, category: "park", neighborhood: "Near Irving Place", difficulty: "local",
    clues: [
      "One of only two private parks in New York City.",
      "Only residents of the surrounding buildings get a key — and the locks change every year.",
      "At the top of Irving Place, between 20th and 21st Streets.",
    ],
    fact: "It’s been gated since 1831; the public is let in on just one day a year — Christmas Eve.",
  },
  {
    id: "grays-papaya", name: "Gray's Papaya", aliases: ["Grays Papaya"],
    lat: 40.77838, lng: -73.98157, category: "food", neighborhood: "Upper West Side", difficulty: "local",
    clues: [
      "A seatless hot dog stand that promises “No gimmicks.”",
      "Its “Recession Special” is a cheap-eats legend.",
      "Broadway at West 72nd Street.",
    ],
    fact: "It’s had cameos in “You’ve Got Mail,” “Sex and the City” and more.",
  },
  {
    id: "levain-bakery", name: "Levain Bakery", aliases: ["Levain"],
    lat: 40.77990, lng: -73.98034, category: "food", neighborhood: "Upper West Side", difficulty: "local",
    clues: [
      "A basement bakery with lines up the stairs.",
      "Its cookies weigh six ounces each — gooey hockey pucks.",
      "West 74th Street just off Amsterdam Avenue.",
    ],
    fact: "The founders were triathletes who created the cookie as training fuel.",
  },
  {
    id: "zabars", name: "Zabar's", aliases: ["Zabars"],
    lat: 40.78481, lng: -73.97958, category: "shop", neighborhood: "Upper West Side", difficulty: "local",
    clues: [
      "A gourmet food emporium famous for smoked fish and coffee.",
      "Family-run since 1934; its orange signs are a neighborhood icon.",
      "Broadway at West 80th Street.",
    ],
    fact: "Upstairs is a gloriously cluttered kitchenware floor that locals swear by.",
  },
  {
    id: "barney-greengrass", name: "Barney Greengrass", aliases: ["The Sturgeon King"],
    lat: 40.78796, lng: -73.97459, category: "food", neighborhood: "Upper West Side", difficulty: "local",
    clues: [
      "A smoked-fish restaurant serving the neighborhood since 1908.",
      "Its eggs scrambled with lox and onions are legendary; the decor hasn’t changed in decades.",
      "Amsterdam Avenue between 86th and 87th Streets.",
    ],
    fact: "It’s been nicknamed “The Sturgeon King” for generations.",
  },
  {
    id: "lexington-candy-shop", name: "Lexington Candy Shop", aliases: ["Lexington Candy"],
    lat: 40.77751, lng: -73.95722, category: "food", neighborhood: "Upper East Side", difficulty: "local",
    clues: [
      "A luncheonette that’s barely changed since 1925.",
      "Egg creams, lime rickeys and a vintage Coca-Cola collection.",
      "On the corner of 83rd Street and the avenue it’s named after.",
    ],
    fact: "It appears in “Three Days of the Condor” with Robert Redford.",
  },
  {
    id: "bemelmans-bar", name: "Bemelmans Bar", aliases: ["Bemelmans", "The Carlyle"],
    lat: 40.77426, lng: -73.96299, category: "bar", neighborhood: "Upper East Side", difficulty: "local",
    clues: [
      "A swanky piano bar inside a grand hotel.",
      "Its walls are painted with whimsical murals by the creator of “Madeline.”",
      "Madison Avenue at East 76th Street, inside a hotel favored by presidents.",
    ],
    fact: "Ludwig Bemelmans painted the murals in exchange for a year and a half of lodging for his family.",
  },
  {
    id: "alice-in-wonderland", name: "Alice in Wonderland Statue", aliases: ["Alice in Wonderland", "Alice statue"],
    lat: 40.77504, lng: -73.96653, category: "landmark", neighborhood: "Central Park", difficulty: "local",
    clues: [
      "A bronze statue that kids are encouraged to climb.",
      "A girl perches on a giant mushroom with a rabbit, a cat and a hatter.",
      "In Central Park near East 75th Street, just north of the model-boat pond.",
    ],
    fact: "Publisher George Delacorte commissioned it in 1959 in honor of his wife.",
  },
  {
    id: "balto", name: "Balto Statue", aliases: ["Balto"],
    lat: 40.76996, lng: -73.97101, category: "landmark", neighborhood: "Central Park", difficulty: "local",
    clues: [
      "A bronze animal hero, rubbed shiny by kids.",
      "It honors a sled dog that helped rush diphtheria medicine to Nome in 1925.",
      "In Central Park near East 67th Street, not far from the zoo.",
    ],
    fact: "The real dog attended his statue’s unveiling in December 1925.",
  },
  {
    id: "cleopatras-needle", name: "Cleopatra's Needle", aliases: ["The Obelisk", "Central Park Obelisk"],
    lat: 40.77961, lng: -73.96541, category: "landmark", neighborhood: "Central Park", difficulty: "local",
    clues: [
      "The oldest man-made object in Central Park — by about 3,000 years.",
      "A 3,500-year-old Egyptian obelisk shipped across the ocean in 1880.",
      "On a knoll right behind the Met.",
    ],
    fact: "It has nothing to do with Cleopatra — it was already over 1,000 years old when she was born.",
  },
  {
    id: "bow-bridge", name: "Bow Bridge", aliases: [],
    lat: 40.77576, lng: -73.97177, category: "bridge", neighborhood: "Central Park", difficulty: "local",
    clues: [
      "A cast-iron footbridge that’s a magnet for marriage proposals.",
      "Built in 1862, it’s one of the oldest cast-iron bridges in America.",
      "In Central Park, linking Cherry Hill to the Ramble across the Lake.",
    ],
    fact: "It’s appeared in films from “Manhattan” to “Spider-Man 3.”",
  },
  {
    id: "conservatory-garden", name: "Conservatory Garden", aliases: ["Vanderbilt Gate"],
    lat: 40.79380, lng: -73.95230, category: "park", neighborhood: "Central Park (East Harlem)", difficulty: "local", radius: 90,
    clues: [
      "Central Park’s only formal garden — six acres of it.",
      "Three gardens in Italian, French and English styles; wedding photographers love it.",
      "Enter through an ornate iron gate at Fifth Avenue and 105th Street.",
    ],
    fact: "Its wrought-iron gate once guarded the Vanderbilt mansion on Fifth Avenue.",
  },
  {
    id: "graffiti-hall-of-fame", name: "Graffiti Hall of Fame", aliases: [],
    lat: 40.79320, lng: -73.94808, category: "oddity", neighborhood: "East Harlem", difficulty: "local",
    clues: [
      "A schoolyard that’s been an outdoor street-art gallery since 1980.",
      "Top writers from around the world are invited to paint its walls.",
      "East 106th Street at Park Avenue.",
    ],
    fact: "Community activist Ray Rodriguez founded it to give artists a legal place to paint.",
  },
  {
    id: "raos", name: "Rao's", aliases: ["Raos"],
    lat: 40.79393, lng: -73.93422, category: "food", neighborhood: "East Harlem", difficulty: "local",
    clues: [
      "Maybe the hardest table to get in New York.",
      "A handful of tables have been “owned” by regulars for decades; its jarred sauce is everywhere.",
      "East 114th Street at Pleasant Avenue.",
    ],
    fact: "It’s been in the same family since 1896.",
  },
  {
    id: "patsys-pizzeria", name: "Patsy's Pizzeria (East Harlem)", aliases: ["Patsy's", "Patsys", "Patsy's Pizzeria"],
    lat: 40.79712, lng: -73.93480, category: "food", neighborhood: "East Harlem", difficulty: "local",
    clues: [
      "A coal-oven pizzeria from 1933 that Frank Sinatra adored.",
      "It still sells slices from a walk-up window.",
      "First Avenue between 117th and 118th Streets.",
    ],
    fact: "It’s one of the few coal-fired pizza ovens left in the city.",
  },
  {
    id: "harlem-fire-watchtower", name: "Harlem Fire Watchtower", aliases: ["Mount Morris Fire Watchtower", "Marcus Garvey Park"],
    lat: 40.80410, lng: -73.94357, category: "landmark", neighborhood: "Harlem", difficulty: "local",
    clues: [
      "The last surviving fire watchtower in New York City.",
      "Its cast-iron frame dates to 1857; a bell once called out the firefighters.",
      "Atop the rocky hill in the park between 120th and 124th Streets at Madison Avenue.",
    ],
    fact: "It was taken apart, restored and put back in 2019.",
  },
  {
    id: "hotel-theresa", name: "Hotel Theresa", aliases: ["Theresa Towers", "The Theresa"],
    lat: 40.80875, lng: -73.94893, category: "building", neighborhood: "Harlem", difficulty: "local",
    clues: [
      "Once called the “Waldorf of Harlem.”",
      "Fidel Castro stayed here in 1960 — and Khrushchev dropped by to visit.",
      "Adam Clayton Powell Jr. Boulevard at West 125th Street.",
    ],
    fact: "Malcolm X’s Organization of Afro-American Unity had its offices here.",
  },
  {
    id: "abyssinian-baptist-church", name: "Abyssinian Baptist Church", aliases: ["Abyssinian Church"],
    lat: 40.81664, lng: -73.94148, category: "church", neighborhood: "Harlem", difficulty: "local",
    clues: [
      "One of America’s most influential Black churches, founded in 1808.",
      "Adam Clayton Powell Jr. preached here before heading to Congress.",
      "West 138th Street between Lenox and Seventh Avenues.",
    ],
    fact: "It was founded by Black congregants who refused segregated seating at another church.",
  },
  {
    id: "strivers-row", name: "Strivers' Row", aliases: ["Striver's Row", "St. Nicholas Historic District"],
    lat: 40.81806, lng: -73.94361, category: "building", neighborhood: "Harlem", difficulty: "local", radius: 100,
    clues: [
      "Elegant 1890s rowhouses designed by three different architects.",
      "Old signs on the back alleys still say “Walk Your Horses.”",
      "West 138th and 139th Streets between Adam Clayton Powell Jr. and Frederick Douglass Boulevards.",
    ],
    fact: "Its nickname came from the ambitious Black professionals who moved here in the 1920s.",
  },
  {
    id: "125th-street-viaduct", name: "125th Street Station (1 train)", aliases: ["125 St station", "Manhattan Valley Viaduct"],
    lat: 40.81555, lng: -73.95840, category: "subway", neighborhood: "Manhattanville", difficulty: "local",
    clues: [
      "A subway station that’s way up in the air.",
      "Trains cross a steel-arch viaduct here because the ground dips into a valley.",
      "Over Broadway in Manhattanville, where Harlem meets Columbia’s new campus.",
    ],
    fact: "Its soaring 1904 viaduct spans the low “Manhattan Valley” on the Upper West Side line.",
  },
  {
    id: "hamilton-grange", name: "Hamilton Grange", aliases: ["Hamilton Grange National Memorial", "Alexander Hamilton's house"],
    lat: 40.82139, lng: -73.94722, category: "building", neighborhood: "Sugar Hill / West Harlem", difficulty: "local",
    clues: [
      "The only home a certain Founding Father ever owned.",
      "It’s been moved twice — most recently rolled downhill in 2008.",
      "In St. Nicholas Park at West 141st Street.",
    ],
    fact: "He lived here only two years before his fatal duel with Aaron Burr in 1804.",
  },
  {
    id: "rucker-park", name: "Rucker Park", aliases: ["Holcombe Rucker Park"],
    lat: 40.82956, lng: -73.93647, category: "sports", neighborhood: "Harlem", difficulty: "local",
    clues: [
      "A playground court known as the mecca of streetball.",
      "Dr. J, Kareem and Kobe all played in its legendary summer leagues.",
      "West 155th Street at Frederick Douglass Boulevard, at the foot of Coogan’s Bluff.",
    ],
    fact: "It’s named for Holcombe Rucker, a teacher who started a tournament to keep kids off the streets.",
  },
  {
    id: "hispanic-society", name: "Hispanic Society Museum & Library", aliases: ["Hispanic Society", "Hispanic Society of America", "Audubon Terrace"],
    lat: 40.83352, lng: -73.94651, category: "museum", neighborhood: "Washington Heights", difficulty: "local",
    clues: [
      "A Beaux-Arts museum with one of the finest collections of Spanish art outside Spain.",
      "It holds Goya’s “Duchess of Alba” and a dazzling room of Sorolla murals.",
      "On a hidden plaza off Broadway at West 155th Street.",
    ],
    fact: "Railroad heir Archer Huntington founded it in 1904.",
  },
  {
    id: "audubon-ballroom", name: "Audubon Ballroom", aliases: ["Shabazz Center", "Malcolm X and Dr. Betty Shabazz Memorial"],
    lat: 40.83917, lng: -73.94056, category: "building", neighborhood: "Washington Heights", difficulty: "local",
    clues: [
      "A former theater and dance hall where history turned tragic in 1965.",
      "Malcolm X was assassinated here while giving a speech.",
      "Broadway at West 165th Street, now part of a university medical building.",
    ],
    fact: "Its ornate facade was saved, and it now houses a memorial and educational center.",
  },
  {
    id: "168th-street-station", name: "168th Street Station", aliases: ["168 St station", "168th St"],
    lat: 40.84090, lng: -73.93975, category: "subway", neighborhood: "Washington Heights", difficulty: "local",
    clues: [
      "A deep subway station that feels like a cathedral.",
      "Its vaulted ceiling recalls a grand European train hall; elevators take you down.",
      "Under Broadway by NewYork-Presbyterian’s big uptown hospital.",
    ],
    fact: "Two lines meet here: the 1 runs about 100 feet down, while the A/C is closer to the surface.",
  },
  {
    id: "high-bridge", name: "High Bridge & Water Tower", aliases: ["High Bridge", "Highbridge Water Tower", "Highbridge Park"],
    lat: 40.84254, lng: -73.93262, category: "bridge", neighborhood: "Washington Heights", difficulty: "local",
    clues: [
      "New York City’s oldest standing bridge (1848).",
      "It was built to carry drinking water over the Harlem River; a granite tower kept the pressure up.",
      "On the bluffs over the Harlem River near Amsterdam Avenue and 173rd Street.",
    ],
    fact: "After decades closed, it reopened to walkers and cyclists in 2015.",
  },
  {
    id: "191st-street-station", name: "191st Street Station", aliases: ["191 St station", "Tunnel Street", "191st Street tunnel"],
    lat: 40.85526, lng: -73.92940, category: "subway", neighborhood: "Washington Heights", difficulty: "local",
    clues: [
      "The deepest station in the subway system — about 180 feet down.",
      "A 1,000-foot mural-lined tunnel leads to it from Broadway.",
      "On the 1 train, deep below St. Nicholas Avenue at the northern end of Washington Heights.",
    ],
    fact: "Its long pedestrian tunnel is officially a city street, nicknamed “Tunnel Street.”",
  },
  {
    id: "dyckman-farmhouse", name: "Dyckman Farmhouse", aliases: ["Dyckman House", "Dyckman Farmhouse Museum"],
    lat: 40.86722, lng: -73.92306, category: "building", neighborhood: "Inwood", difficulty: "local",
    clues: [
      "Manhattan’s last Dutch colonial farmhouse.",
      "Built around 1784, it sits on a raised garden while the city grew up around it.",
      "Broadway at 204th Street in Inwood.",
    ],
    fact: "The family farm once spread across roughly 250 acres of northern Manhattan.",
  },
  {
    id: "shorakkopoch-rock", name: "Shorakkopoch Rock", aliases: ["Shorakkopoch", "Inwood Hill Park"],
    lat: 40.87332, lng: -73.92369, category: "oddity", neighborhood: "Inwood", difficulty: "local",
    clues: [
      "A boulder marking a legendary real-estate deal.",
      "A plaque says Peter Minuit “bought” the island near here in 1626, under a giant tulip tree.",
      "At the edge of Manhattan’s last natural forest, near the Inwood ball fields.",
    ],
    fact: "The tulip tree that stood here was said to be 280 years old when it died in the 1930s.",
  },
  {
    id: "riverside-church", name: "Riverside Church", aliases: ["The Riverside Church"],
    lat: 40.81194, lng: -73.96306, category: "church", neighborhood: "Morningside Heights", difficulty: "local",
    clues: [
      "A neo-Gothic church with the tallest church tower in the United States.",
      "Martin Luther King Jr. gave a famous speech against the Vietnam War here in 1967.",
      "Overlooking the Hudson at West 120th Street, just south of Grant’s Tomb.",
    ],
    fact: "Its carillon has 74 bells; the biggest weighs about 20 tons.",
  },
  {
    id: "72nd-street-second-ave", name: "72nd Street Station (Second Avenue Subway)", aliases: ["72 St station", "Second Avenue Subway", "Q train 72nd Street"],
    lat: 40.76889, lng: -73.95833, category: "subway", neighborhood: "Upper East Side (Lenox Hill)", difficulty: "local",
    clues: [
      "A subway station that opened on New Year’s Day 2017 — after nearly a century of waiting.",
      "Its walls feature life-size mosaic portraits of everyday New Yorkers by Vik Muniz.",
      "On the Q line under Second Avenue, in the low 70s.",
    ],
    fact: "A Second Avenue subway line was first proposed back in 1920.",
  },
  {
    id: "moynihan-train-hall", name: "Moynihan Train Hall", aliases: ["Moynihan", "Penn Station", "Farley Building"],
    lat: 40.75130, lng: -73.99534, category: "building", neighborhood: "Midtown West", difficulty: "local",
    clues: [
      "A sky-lit concourse that opened in 2021 to make up for a lost landmark.",
      "It’s inside a grand old post office building.",
      "Eighth Avenue between 31st and 33rd Streets, across from the arena.",
    ],
    fact: "The building’s frieze reads “Neither snow nor rain nor heat nor gloom of night…”",
  },
  {
    id: "91st-street-ghost-station", name: "91st Street Ghost Station", aliases: ["91st Street station", "Abandoned 91st Street station"],
    lat: 40.79140, lng: -73.97410, category: "subway", neighborhood: "Upper West Side", difficulty: "local",
    clues: [
      "A subway station that closed in 1959 but never went away.",
      "Peer out a 1 train window between 86th and 96th to see its graffiti-covered platforms.",
      "Under Broadway in the low 90s.",
    ],
    fact: "It became redundant when the platforms at 96th Street were lengthened.",
  },
  {
    id: "brush-stairway", name: "John T. Brush Stairway", aliases: ["Brush Stairway", "Polo Grounds stairway"],
    lat: 40.83243, lng: -73.93940, category: "sports", neighborhood: "Coogan's Bluff (Harlem)", difficulty: "local",
    clues: [
      "The last surviving piece of a legendary ballpark.",
      "It led fans down a cliff to the Polo Grounds, home of the Giants and the early Mets.",
      "Edgecombe Avenue near West 158th Street, descending Coogan’s Bluff.",
    ],
    fact: "Its 1913 plaque reads “The John T. Brush Stairway Presented by the New York Giants.”",
  },
  {
    id: "joan-of-arc-statue", name: "Joan of Arc Statue", aliases: ["Joan of Arc Memorial", "Joan of Arc Park"],
    lat: 40.79411, lng: -73.97648, category: "landmark", neighborhood: "Upper West Side", difficulty: "local",
    clues: [
      "A bronze warrior on horseback — NYC’s first statue of a real woman (1915).",
      "Its pedestal includes stones from the tower in Rouen where she was imprisoned.",
      "Riverside Drive at West 93rd Street.",
    ],
    fact: "Sculptor Anna Hyatt Huntington’s copies also stand in Blois, France, and Quebec City.",
  },
];
