// Snappy New York copy. Pure data + a picker, so it's testable without a DOM.

export const COPY = {
  win: [
    'Bada bing! You nailed it!',
    'Now THAT’s a real New Yorker!',
    'Right on the money, boss!',
    'You found it faster than a cab in the rain!',
  ],
  winFirstTry: ['Hole in one! You’ve clearly lived here.', 'First try?! Get this person a bagel.'],
  lose: ['Fuggedaboutit!', 'Ay, tough break, pal.', 'Oof. Even the pigeons knew that one.'],
  scorching: ['So close you can smell the pretzels!', 'Right around the corner, pal!', 'You’re practically on the stoop!'],
  warm: ['Gettin’ warmer!', 'Same neighborhood-ish. Keep walkin’.', 'Not bad — a few blocks off.'],
  chilly: ['Nope — wrong part of town.', 'Cold as a February bodega cat.', 'Hop on the subway, it’s a ways.'],
  freezing: ['Whoa, different ZIP code entirely!', 'You’re walkin’ the wrong way, pal!', 'Way off — take the express.'],
  water: ['Splash! That’s the river, pal.', 'You’d need a ferry for that one.', 'That’s water. Even the rats won’t swim there.'],
  unknown: ['Hey, I’m walkin’ here! Pick a place from the list.', 'Never heard of it — try the list or the map.'],
  repeat: ['You already tried that one!', 'Déjà vu, pal — you guessed that already.'],
  roundOver: ['Round’s over — come back tomorrow!', 'This one’s done. Try Practice mode!'],
};

export function pick(list, seed = Math.random()) {
  return list[Math.floor(seed * list.length) % list.length];
}

export function tierLine(tierKey, seed) {
  return pick(COPY[tierKey] || COPY.chilly, seed);
}
