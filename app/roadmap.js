// The roadmap to the platinum: five stages, in the order this guide recommends playing them.
// The order is built from the official trophy descriptions — story chapters and named missions
// first, then the strands and partner feats they unlock, then the counted collectibles and
// challenges, then free-roam feats and the money loop, and finally the 100% checklist sweep —
// and from the PowerPyx roadmap's findings (one playthrough, no mission replay, free-roam after
// the story, a lenient 100% checklist). Each trophy in app/data/trophies.json carries the stage
// it belongs to.

export const STAGES = [
  {
    n: 1,
    title: 'Story playthrough — and the one missable',
    blurb:
      'Play the five chapters in order: the opening mission, the four chapter trophies, the six named story missions and the finale. ' +
      'The story takes around 60–80 hours by the PowerPyx roadmap’s estimate, and every trophy in this stage is a completion award — there are no mission medals to chase. ' +
      'One thing must not be postponed: the Chapter 1 meditation spot for Positive Mental Attitude disappears when Chapter 1 ends, and with no mission replay it cannot be recovered, ' +
      'so meditate there during Chapter 1 and keep a manual save at the start of every chapter.',
  },
  {
    n: 2,
    title: 'Strangers, partners and story-adjacent feats',
    blurb:
      'With both Jason and Lucia playable from Chapter 2, work the character strands — Andy, Kenton, Billy, Randy and Tyrone — through to each final mission, eight completed strands in all for the Strangers & Freaks silver. ' +
      'The partner feats (losing four stars together, the three-shop robbery chain) also belong here, while the two-protagonist mechanics are fresh. ' +
      'None of this is missable: the strands stay open in post-story free-roam, so anything unfinished can be swept up later.',
  },
  {
    n: 3,
    title: 'Collectibles and the counted challenges',
    blurb:
      'The counters: 250 stunts, gold in all 42 shooting range challenges, a drone race win at each of 14 locations, 20 different race wins, three full collectible card sets on the way to more, ' +
      'WAiNK It at 100 locations, 50 challenges, 100 discovered vehicles, all 52 areas of Leonida explored and 10 vehicles registered. ' +
      'These reward steady habits over bingeing — a few in every area you visit — and most of them feed the 100% checklist at higher thresholds than the trophies themselves ask.',
  },
  {
    n: 4,
    title: 'Free-roam feats and the money loop',
    blurb:
      'Leonida’s one-off feats and its economy: five bank vaults, an armored truck, one illegal operation per gang, a stealth jewelry job, an unscheduled airport departure, ' +
      'and the cryptic one-offs whose descriptions are all the game gives you. Underneath them runs the money loop — rob, launder $250,000 of marked bills through your contacts, ' +
      'spend $100,000 across the shops and buy all eight garages. Everything here is repeatable in free-roam, so attempt the hard ones whenever you feel equipped.',
  },
  {
    n: 5,
    title: 'The 100% sweep and the platinum',
    blurb:
      'After the story, the 100% Completion checklist opens under Progress > Stats, and A Long Road asks you to complete it. ' +
      'PowerPyx’s roadmap stresses how lenient it is — closer to 60% of everything: 70 of 80 challenges, 15 of 18 card sets, 300 stunts — with only robberies, underwater discoveries, ' +
      'shooting ranges, drone races and Bret’s quests required in full. Most of it is already done by the time you arrive; sweep what remains, and Vice Got a Price! unlocks the moment the last of the 54 lands.',
  },
];

export function renderRoadmap(trophies, earned, openDetail) {
  const host = document.getElementById('roadmapStages');
  if (!host) return;
  host.replaceChildren();
  for (const stage of STAGES) {
    const inStage = trophies.filter((t) => t.stage === stage.n);
    const done = inStage.filter((t) => earned.has(t.id)).length;

    const section = document.createElement('section');
    section.className = 'stage';

    const head = document.createElement('div');
    head.className = 'stage-head';
    const num = document.createElement('span');
    num.className = 'stage-num';
    num.textContent = `Stage ${stage.n}`;
    const title = document.createElement('h3');
    title.textContent = stage.title;
    const count = document.createElement('span');
    count.className = 'stage-count';
    count.textContent = `${done}/${inStage.length} earned`;
    head.append(num, title, count);

    const blurb = document.createElement('p');
    blurb.textContent = stage.blurb;

    const ul = document.createElement('ul');
    for (const t of inStage) {
      const li = document.createElement('li');
      const grade = document.createElement('span');
      grade.className = `tag grade-${t.grade}`;
      grade.textContent = t.grade;
      const name = document.createElement('span');
      name.className = 's-name';
      name.textContent = earned.has(t.id) ? `✓ ${t.name}` : t.name;
      const desc = document.createElement('span');
      desc.className = 's-desc';
      desc.textContent = t.description;
      li.append(grade, name, desc);
      if (t.missable) {
        const flag = document.createElement('span');
        flag.className = 'tag missable';
        flag.textContent = '⚠ Missable';
        li.append(flag);
      }
      li.addEventListener('click', () => openDetail(t));
      ul.append(li);
    }

    section.append(head, blurb, ul);
    host.append(section);
  }
}
