import React, { useState, useEffect, useRef, useCallback, memo } from 'react';

import './App.css';

const API = 'http://127.0.0.1:8000';
const SPRITE_GEN5 = 'https://play.pokemonshowdown.com/sprites/gen5/';
const SPRITE_ANI  = 'https://play.pokemonshowdown.com/sprites/ani/';
const TYPE_NULL_SPRITE = 'https://play.pokemonshowdown.com/sprites/gen5/typenull.png';

const NAME_REMAPS = {
  'donzozo': 'dondozo',
  'dudunsprace-three': 'dudunsparce-three',
};

const toShowdownName = (name) => {
  let n = name.toLowerCase().trim();
  n = n.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  n = n.replace(/[éèê]/g, 'e');
  n = n.replace(/['\u2019]/g, '');
  n = n.replace(/♀/g, '-f').replace(/♂/g, '-m');
  n = n.replace(/[:.]/g, '');
  n = n.replace(/\s+/g, '-');
  n = n.replace(/-+/g, '-').replace(/^-|-$/g, '');
  return NAME_REMAPS[n] ?? n;
};

const SPRITE_OVERRIDES = {
  'tauros-paldea-aqua':    'tauros-paldeaaqua',
  'tauros-paldea-blaze':   'tauros-paldeablaze',
  'tauros-paldea':         'tauros-paldeacombat',
  'mr-mime-galar':         'mrmime-galar',
  'jangmo-o':              'jangmoo',
  'hakamo-o':              'hakamoo',
  'dudunsparce-three':     'dudunsparce-threesegment',
  'tapu-fini':             'tapufini',
  'tapu-bulu':             'tapubulu',
  'tapu-koko':             'tapukoko',
  'tapu-lele':             'tapulele',
  'toxtricity-low-key':    'toxtricity-lowkey',
  'flutter-mane':          'fluttermane',
  'great-tusk':            'greattusk',
  'iron-treads':           'irontreads',
  'iron-thorns':           'ironthorns',
  'iron-valiant':          'ironvaliant',
  'scream-tail':           'screamtail',
  'iron-bundle':           'ironbundle',
  'roaring-moon':          'roaringmoon',
  'walking-wake':          'walkingwake',
  'iron-jugulis':          'ironjugulis',
  'nidoran-f':             'nidoranf',
  'nidoran-m':             'nidoranm',
  'flabebe':               'flabebe',
  'mime-jr':               'mimejr',
  'mr-mime':               'mrmime',
  'type-null':             'typenull',
  'brute-bonnet':          'brutebonnet',
  'slither-wing':          'slitherwing',
  'sandy-shocks':          'sandyshocks',
  'gouging-fire':          'gougingfire',
  'raging-bolt':           'ragingbolt',
  'iron-hands':            'ironhands',
  'iron-moth':             'ironmoth',
  'iron-leaves':           'ironleaves',
  'iron-crown':            'ironcrown',
  'iron-boulder':          'ironboulder',
  'zygarde-10':             'zygarde-10',
  'zygarde-10%':            'zygarde-10',
  'chi-yu':                 'chiyu',
  'wo-chien':               'wochien',
  'chien-pao':              'chienpao',
  'ting-lu':                'tinglu',
};

const getGen5Url = (name) => {
  const key = toShowdownName(name);
  return `${SPRITE_GEN5}${SPRITE_OVERRIDES[key] ?? key}.png`;
};
const getAniUrl  = (name) => `${SPRITE_ANI}${toShowdownName(name)}.gif`;
const getNulldexUrl = (name) => `https://ddex-chi.vercel.app/pokemon/${encodeURIComponent(toShowdownName(name))}`;

const SmartSprite = memo(function SmartSprite({ name, className, style }) {
  const [src, setSrc] = useState(() => getGen5Url(name));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(getGen5Url(name));
    setFailed(false);
  }, [name]);

  const handleError = useCallback(() => {
    setSrc(prev => {
      if (prev === getGen5Url(name)) return getAniUrl(name);
      setFailed(true);
      return prev;
    });
  }, [name]);

  if (failed) return <div className="sprite-placeholder" style={style}>?</div>;
  return <img src={src} alt={name} className={className} style={style} onError={handleError} />;
});

const EVO_CHAINS = [
  ["bulbasaur","ivysaur","venusaur"],["charmander","charmeleon","charizard"],
  ["squirtle","wartortle","blastoise"],["caterpie","metapod","butterfree"],
  ["weedle","kakuna","beedrill"],["pidgey","pidgeotto","pidgeot"],
  ["rattata","rattata-alola","raticate","raticate-alola"],["spearow","fearow"],
  ["ekans","arbok"],["pichu","pikachu","raichu","raichu-alola"],
  ["sandshrew","sandshrew-alola","sandslash","sandslash-alola"],
  ["nidoran-f","nidorina","nidoqueen"],["nidoran-m","nidorino","nidoking"],
  ["cleffa","clefairy","clefable"],["vulpix","vulpix-alola","ninetales","ninetales-alola"],
  ["igglybuff","jigglypuff","wigglytuff"],["zubat","golbat","crobat"],
  ["oddish","gloom","vileplume","bellossom"],["paras","parasect"],["venonat","venomoth"],
  ["diglett","diglett-alola","dugtrio","dugtrio-alola"],
  ["meowth","meowth-alola","meowth-galar","persian","persian-alola","perrserker"],
  ["psyduck","golduck"],["mankey","primeape","annihilape"],
  ["growlithe","growlithe-hisui","arcanine","arcanine-hisui"],
  ["poliwag","poliwhirl","poliwrath","politoed"],["abra","kadabra","alakazam"],
  ["machop","machoke","machamp"],["bellsprout","weepinbell","victreebel"],
  ["tentacool","tentacruel"],
  ["geodude","geodude-alola","graveler","graveler-alola","golem","golem-alola"],
  ["ponyta","ponyta-galar","rapidash","rapidash-galar"],
  ["slowpoke","slowbro","slowbro-galar","slowking","slowking-galar"],
  ["magnemite","magneton","magnezone"],
  ["farfetchd","farfetchd-galar","sirfetchd"],
  ["doduo","dodrio"],["seel","dewgong"],
  ["grimer","grimer-alola","muk","muk-alola"],["shellder","cloyster"],
  ["gastly","haunter","gengar"],["onix","steelix"],["drowzee","hypno"],
  ["krabby","kingler"],
  ["voltorb","voltorb-hisui","electrode","electrode-hisui"],
  ["exeggcute","exeggutor","exeggutor-alola"],
  ["cubone","marowak","marowak-alola"],
  ["tyrogue","hitmonlee","hitmonchan","hitmontop"],["lickitung","lickilicky"],
  ["koffing","weezing","weezing-galar"],["rhyhorn","rhydon","rhyperior"],
  ["chansey","blissey"],["tangela","tangrowth"],["horsea","seadra","kingdra"],
  ["goldeen","seaking"],["staryu","starmie"],
  ["mime-jr","mr-mime","mr-mime-galar","mr-rime"],
  ["scyther","scizor","kleavor"],["magmar","magmortar"],
  ["tauros","tauros-paldea","tauros-paldea-blaze","tauros-paldea-aqua"],
  ["magikarp","gyarados"],
  ["eevee","vaporeon","jolteon","flareon","espeon","umbreon","leafeon","glaceon","sylveon"],
  ["porygon","porygon2","porygon-z"],["omanyte","omastar"],["kabuto","kabutops"],
  ["dratini","dragonair","dragonite"],
  ["chikorita","bayleef","meganium"],
  ["cyndaquil","quilava","typhlosion","typhlosion-hisui"],
  ["totodile","croconaw","feraligatr"],["sentret","furret"],["hoothoot","noctowl"],
  ["ledyba","ledian"],["spinarak","ariados"],["chinchou","lanturn"],
  ["togepi","togetic","togekiss"],["natu","xatu"],["mareep","flaaffy","ampharos"],
  ["azurill","marill","azumarill"],["bonsly","sudowoodo"],
  ["hoppip","skiploom","jumpluff"],["aipom","ambipom"],["sunkern","sunflora"],
  ["yanma","yanmega"],["wooper","wooper-paldea","quagsire","clodsire"],
  ["murkrow","honchkrow"],["misdreavus","mismagius"],
  ["girafarig","farigiraf"],["pineco","forretress"],["dunsparce","dudunsparce"],
  ["gligar","gliscor"],["snubbull","granbull"],
  ["qwilfish","qwilfish-hisui","overqwil"],
  ["sneasel","sneasel-hisui","weavile","sneasler"],
  ["teddiursa","ursaring","ursaluna"],["slugma","magcargo"],
  ["swinub","piloswine","mamoswine"],["corsola","corsola-galar","cursola"],
  ["remoraid","octillery"],["houndour","houndoom"],["phanpy","donphan"],
  ["stantler","wyrdeer"],["larvitar","pupitar","tyranitar"],
  ["treecko","grovyle","sceptile"],["torchic","combusken","blaziken"],
  ["mudkip","marshtomp","swampert"],["poochyena","mightyena"],
  ["zigzagoon","zigzagoon-galar","linoone","linoone-galar","obstagoon"],
  ["wurmple","silcoon","beautifly","cascoon","dustox"],
  ["lotad","lombre","ludicolo"],["seedot","nuzleaf","shiftry"],
  ["taillow","swellow"],["wingull","pelipper"],
  ["ralts","kirlia","gardevoir","gallade"],["surskit","masquerain"],
  ["shroomish","breloom"],["slakoth","vigoroth","slaking"],
  ["nincada","ninjask","shedinja"],["whismur","loudred","exploud"],
  ["makuhita","hariyama"],["nosepass","probopass"],["skitty","delcatty"],
  ["aron","lairon","aggron"],["meditite","medicham"],["electrike","manectric"],
  ["roselia","roserade"],["gulpin","swalot"],["carvanha","sharpedo"],
  ["wailmer","wailord"],["numel","camerupt"],["spoink","grumpig"],
  ["trapinch","vibrava","flygon"],["cacnea","cacturne"],["swablu","altaria"],
  ["barboach","whiscash"],["corphish","crawdaunt"],["baltoy","claydol"],
  ["lileep","cradily"],["anorith","armaldo"],["feebas","milotic"],
  ["shuppet","banette"],["duskull","dusclops","dusknoir"],
  ["snorunt","glalie","froslass"],["spheal","sealeo","walrein"],
  ["clamperl","huntail","gorebyss"],["bagon","shelgon","salamence"],
  ["beldum","metang","metagross"],["bidoof","bibarel"],
  ["starly","staravia","staraptor"],["shinx","luxio","luxray"],
  ["budew","roselia","roserade"],["cranidos","rampardos"],["shieldon","bastiodon"],
  ["combee","vespiquen"],["buizel","floatzel"],["cherubi","cherrim"],
  ["shellos","gastrodon"],["drifloon","drifblim"],["buneary","lopunny"],
  ["glameow","purugly"],["chingling","chimecho"],["stunky","skuntank"],
  ["bronzor","bronzong"],["happiny","chansey","blissey"],
  ["gible","gabite","garchomp"],["munchlax","snorlax"],["riolu","lucario"],
  ["hippopotas","hippowdon"],["skorupi","drapion"],["croagunk","toxicroak"],
  ["finneon","lumineon"],["snover","abomasnow"],
  ["tepig","pignite","emboar"],["snivy","servine","serperior"],
  ["oshawott","dewott","samurott","samurott-hisui"],
  ["patrat","watchog"],["lillipup","herdier","stoutland"],["purrloin","liepard"],
  ["munna","musharna"],["pidove","tranquill","unfezant"],
  ["blitzle","zebstrika"],["roggenrola","boldore","gigalith"],
  ["woobat","swoobat"],["drilbur","excadrill"],
  ["timburr","gurdurr","conkeldurr"],["tympole","palpitoad","seismitoad"],
  ["sewaddle","swadloon","leavanny"],["venipede","whirlipede","scolipede"],
  ["cottonee","whimsicott"],["petilil","lilligant","lilligant-hisui"],
  ["sandile","krokorok","krookodile"],
  ["darumaka","darumaka-galar","darmanitan","darmanitan-galar"],
  ["dwebble","crustle"],["scraggy","scrafty"],
  ["yamask","yamask-galar","cofagrigus","runerigus"],
  ["tirtouga","carracosta"],["archen","archeops"],["trubbish","garbodor"],
  ["zorua","zorua-hisui","zoroark","zoroark-hisui"],["minccino","cinccino"],
  ["gothita","gothorita","gothitelle"],["solosis","duosion","reuniclus"],
  ["ducklett","swanna"],["vanillite","vanillish","vanilluxe"],
  ["deerling","sawsbuck"],["karrablast","escavalier"],["foongus","amoonguss"],
  ["frillish","jellicent"],["joltik","galvantula"],["ferroseed","ferrothorn"],
  ["klink","klang","klinklang"],["tynamo","eelektrik","eelektross"],
  ["elgyem","beheeyem"],["litwick","lampent","chandelure"],
  ["axew","fraxure","haxorus"],["cubchoo","beartic"],
  ["shelmet","accelgor"],["stunfisk","stunfisk-galar"],["mienfoo","mienshao"],
  ["golett","golurk"],["pawniard","bisharp","kingambit"],
  ["rufflet","braviary","braviary-hisui"],["vullaby","mandibuzz"],
  ["deino","zweilous","hydreigon"],["larvesta","volcarona"],
  ["chespin","quilladin","chesnaught"],["fennekin","braixen","delphox"],
  ["froakie","frogadier","greninja"],["bunnelby","diggersby"],
  ["fletchling","fletchinder","talonflame"],["litleo","pyroar"],
  ["flabebe","floette","florges"],["skiddo","gogoat"],["pancham","pangoro"],
  ["espurr","meowstic"],["honedge","doublade","aegislash"],
  ["spritzee","aromatisse"],["swirlix","slurpuff"],["inkay","malamar"],
  ["binacle","barbaracle"],["skrelp","dragalge"],["clauncher","clawitzer"],
  ["helioptile","heliolisk"],["tyrunt","tyrantrum"],["amaura","aurorus"],
  ["goomy","sliggoo","sliggoo-hisui","goodra","goodra-hisui"],
  ["phantump","trevenant"],["pumpkaboo","gourgeist"],
  ["bergmite","avalugg","avalugg-hisui"],["noibat","noivern"],
  ["rowlet","dartrix","decidueye","decidueye-hisui"],
  ["litten","torracat","incineroar"],["popplio","brionne","primarina"],
  ["pikipek","trumbeak","toucannon"],["yungoos","gumshoos"],
  ["grubbin","charjabug","vikavolt"],["crabrawler","crabominable"],
  ["cutiefly","ribombee"],["rockruff","lycanroc"],["mareanie","toxapex"],
  ["mudbray","mudsdale"],["dewpider","araquanid"],["fomantis","lurantis"],
  ["morelull","shiinotic"],["salandit","salazzle"],["stufful","bewear"],
  ["bounsweet","steenee","tsareena"],["wimpod","golisopod"],
  ["sandygast","palossand"],["type-null","silvally"],
  ["jangmo-o","hakamo-o","kommo-o"],
  ["grookey","thwackey","rillaboom"],["scorbunny","raboot","cinderace"],
  ["sobble","drizzile","inteleon"],["skwovet","greedent"],
  ["rookidee","corvisquire","corviknight"],["blipbug","dottler","orbeetle"],
  ["nickit","thievul"],["gossifleur","eldegoss"],["wooloo","dubwool"],
  ["chewtle","drednaw"],["yamper","boltund"],["rolycoly","carkol","coalossal"],
  ["applin","flapple","appletun","dipplin","hydrapple"],
  ["silicobra","sandaconda"],["arrokuda","barraskewda"],
  ["toxel","toxtricity"],["sizzlipede","centiskorch"],
  ["clobbopus","grapploct"],["sinistea","polteageist"],
  ["hatenna","hattrem","hatterene"],["impidimp","morgrem","grimmsnarl"],
  ["milcery","alcremie"],["snom","frosmoth"],["cufant","copperajah"],
  ["dreepy","drakloak","dragapult"],
  ["sprigatito","floragato","meowscarada"],["fuecoco","crocalor","skeledirge"],
  ["quaxly","quaxwell","quaquaval"],["lechonk","oinkologne"],
  ["tarountula","spidops"],["nymble","lokix"],["pawmi","pawmo","pawmot"],
  ["tandemaus","maushold"],["fidough","dachsbun"],["smoliv","dolliv","arboliva"],
  ["nacli","naclstack","garganacl"],["charcadet","armarouge","ceruledge"],
  ["tadbulb","bellibolt"],["wattrel","kilowattrel"],["maschiff","mabosstiff"],
  ["shroodle","grafaiai"],["bramblin","brambleghast"],
  ["toedscool","toedscruel"],["capsakid","scovillain"],
  ["rellor","rabsca"],["flittle","espathra"],
  ["tinkatink","tinkatuff","tinkaton"],["wiglett","wugtrio"],
  ["finizen","palafin"],["varoom","revavroom"],["glimmet","glimmora"],
  ["greavard","houndstone"],["cetoddle","cetitan"],
  ["gimmighoul","gholdengo"],["frigibax","arctibax","baxcalibur"],
  ["falinks"],["morpeko"],["klawf"],["tatsugiri"],["wo-chien"],
  ["chi-yu"],["ting-lu"],["chien-pao"],
];

const FAMILY_MAP = {};
for (const chain of EVO_CHAINS) {
  for (const mon of chain) { FAMILY_MAP[mon] = new Set(chain); }
}

const normName = (name) => toShowdownName(name);

const isDupedOut = (encPokemon, boxPokemon) => {
  const encN = normName(encPokemon);
  return boxPokemon.some(p => {
    if (p.status === 'dead') return false;
    const boxN = normName(p.species);
    if (encN === boxN) return true;
    const ef = FAMILY_MAP[encN], bf = FAMILY_MAP[boxN];
    if (ef && ef.has(boxN)) return true;
    if (bf && bf.has(encN)) return true;
    return false;
  });
};

const getAdjustedEncounters = (encounters, box) => {
  const dupedRate = encounters
    .filter(e => isDupedOut(e.pokemon, box))
    .reduce((s, e) => s + (Number(e.rate) || 0), 0);
  if (dupedRate === 0 || box.length === 0) return encounters.map(e => ({ ...e, adjRate: e.rate }));
  const remaining = 100 - dupedRate;
  return encounters.map(e => {
    if (isDupedOut(e.pokemon, box)) return { ...e, adjRate: 0 };
    const adj = remaining > 0 ? ((Number(e.rate) / remaining) * 100) : 0;
    return { ...e, adjRate: Math.round(adj * 10) / 10 };
  });
};

const EXTRA_ENCOUNTERS = {
  "Trainer Hill": {
    gift: [{pokemon:"Eevee",level:1,rate:100}],
  },
  "Battle Frontier": {
    gift: [{pokemon:"Type: Null",level:40,rate:100}],
  },
  "Mossdeep City": {
    gift: [
      { group:"Past Paradox", pokemon:[
        {pokemon:"Great Tusk",level:60,rate:10},{pokemon:"Scream Tail",level:60,rate:10},
        {pokemon:"Brute Bonnet",level:60,rate:10},{pokemon:"Flutter Mane",level:60,rate:10},
        {pokemon:"Slither Wing",level:60,rate:10},{pokemon:"Sandy Shocks",level:60,rate:10},
        {pokemon:"Roaring Moon",level:60,rate:10},{pokemon:"Walking Wake",level:60,rate:10},
        {pokemon:"Gouging Fire",level:60,rate:10},{pokemon:"Raging Bolt",level:60,rate:10},
      ]},
      { group:"Future Paradox", pokemon:[
        {pokemon:"Iron Treads",level:60,rate:10},{pokemon:"Iron Bundle",level:60,rate:10},
        {pokemon:"Iron Hands",level:60,rate:10},{pokemon:"Iron Jugulis",level:60,rate:10},
        {pokemon:"Iron Moth",level:60,rate:10},{pokemon:"Iron Thorns",level:60,rate:10},
        {pokemon:"Iron Valiant",level:60,rate:10},{pokemon:"Iron Leaves",level:60,rate:10},
        {pokemon:"Iron Boulder",level:60,rate:10},{pokemon:"Iron Crown",level:60,rate:10},
      ]},
      { group:"Ultra Beast", pokemon:[
        {pokemon:"Nihilego",level:60,rate:10},{pokemon:"Buzzwole",level:60,rate:10},
        {pokemon:"Pheromosa",level:60,rate:10},{pokemon:"Xurkitree",level:60,rate:10},
        {pokemon:"Celesteela",level:60,rate:10},{pokemon:"Kartana",level:60,rate:10},
        {pokemon:"Guzzlord",level:60,rate:10},{pokemon:"Poipole",level:60,rate:10},
        {pokemon:"Stakataka",level:60,rate:10},{pokemon:"Blacephalon",level:60,rate:10},
      ]},
    ],
  },
  "Route 111": {
    static: [
      {pokemon:"Golett",level:25,rate:25},{pokemon:"Sandygast",level:25,rate:25},
      {pokemon:"Sandshrew",level:25,rate:25},{pokemon:"Phanpy",level:25,rate:25},
    ],
  },
  "New Mauville (Inside)": {
    static: [
      {pokemon:"Voltorb",level:20,rate:20},{pokemon:"Voltorb-Hisui",level:20,rate:20},
      {pokemon:"Foongus",level:20,rate:20},{pokemon:"Ditto",level:20,rate:20},
      {pokemon:"Stunfisk-Galar",level:20,rate:20},
    ],
  },
  "Aqua Hideout": {
    static: [
      {pokemon:"Gimmighoul",level:35,rate:20},{pokemon:"Electrode-Hisui",level:35,rate:20},
      {pokemon:"Amoonguss",level:35,rate:20},{pokemon:"Ditto",level:35,rate:20},
      {pokemon:"Stunfisk-Galar",level:35,rate:20},
    ],
  },
  "Safari Zone South": {
    grass: [{pokemon:"Uxie",level:76,rate:10},{pokemon:"Uxie",level:76,rate:10},{pokemon:"Azelf",level:76,rate:10},{pokemon:"Azelf",level:76,rate:10},{pokemon:"Mesprit",level:76,rate:10},{pokemon:"Mesprit",level:76,rate:10},{pokemon:"Cresselia",level:76,rate:10},{pokemon:"Cresselia",level:76,rate:10},{pokemon:"Shaymin",level:76,rate:10},{pokemon:"Shaymin",level:76,rate:5},{pokemon:"Shaymin",level:76,rate:4},{pokemon:"Shaymin",level:76,rate:1}],
  },
  "Safari Zone North": {
    grass: [{pokemon:"Regieleki",level:76,rate:10},{pokemon:"Regieleki",level:76,rate:10},{pokemon:"Regidrago",level:76,rate:10},{pokemon:"Regidrago",level:76,rate:10},{pokemon:"Glastrier",level:76,rate:10},{pokemon:"Glastrier",level:76,rate:10},{pokemon:"Spectrier",level:76,rate:10},{pokemon:"Spectrier",level:76,rate:10},{pokemon:"Jirachi",level:76,rate:10},{pokemon:"Jirachi",level:76,rate:5},{pokemon:"Jirachi",level:76,rate:4},{pokemon:"Jirachi",level:76,rate:1}],
    rock_smash: [{pokemon:"Regirock",level:76,rate:25},{pokemon:"Regice",level:76,rate:25},{pokemon:"Registeel",level:76,rate:25},{pokemon:"Regigigas",level:76,rate:15},{pokemon:"Regigigas",level:76,rate:10}],
  },
  "Safari Zone Southwest": {
    grass: [{pokemon:"Raikou",level:78,rate:10},{pokemon:"Raikou",level:78,rate:10},{pokemon:"Entei",level:78,rate:10},{pokemon:"Entei",level:78,rate:10},{pokemon:"Suicune",level:78,rate:10},{pokemon:"Suicune",level:78,rate:10},{pokemon:"Mew",level:78,rate:10},{pokemon:"Mew",level:78,rate:10},{pokemon:"Celebi",level:78,rate:10},{pokemon:"Celebi",level:78,rate:5},{pokemon:"Celebi",level:78,rate:4},{pokemon:"Celebi",level:78,rate:1}],
    fishing: [{pokemon:"Phione",level:78,rate:20},{pokemon:"Phione",level:78,rate:20},{pokemon:"Phione",level:78,rate:20},{pokemon:"Phione",level:78,rate:20},{pokemon:"Manaphy",level:78,rate:10},{pokemon:"Manaphy",level:78,rate:10}],
    surfing: [{pokemon:"Articuno",level:78,rate:20},{pokemon:"Zapdos",level:78,rate:20},{pokemon:"Moltres",level:78,rate:20},{pokemon:"Tapu Koko",level:78,rate:20},{pokemon:"Tapu Lele",level:78,rate:10},{pokemon:"Tapu Lele",level:78,rate:10}],
  },
  "Safari Zone Northwest": {
    grass: [{pokemon:"Cobalion",level:78,rate:10},{pokemon:"Cobalion",level:78,rate:10},{pokemon:"Terrakion",level:78,rate:10},{pokemon:"Terrakion",level:78,rate:10},{pokemon:"Virizion",level:78,rate:10},{pokemon:"Virizion",level:78,rate:10},{pokemon:"Keldeo",level:78,rate:10},{pokemon:"Keldeo",level:78,rate:10},{pokemon:"Meloetta",level:78,rate:10},{pokemon:"Meloetta",level:78,rate:5},{pokemon:"Meloetta",level:78,rate:4},{pokemon:"Meloetta",level:78,rate:1}],
    fishing: [{pokemon:"Phione",level:78,rate:20},{pokemon:"Phione",level:78,rate:20},{pokemon:"Phione",level:78,rate:20},{pokemon:"Manaphy",level:78,rate:20},{pokemon:"Manaphy",level:78,rate:10},{pokemon:"Manaphy",level:78,rate:10}],
    surfing: [{pokemon:"Articuno-Galar",level:78,rate:20},{pokemon:"Zapdos-Galar",level:78,rate:20},{pokemon:"Moltres-Galar",level:78,rate:20},{pokemon:"Tapu Fini",level:78,rate:20},{pokemon:"Tapu Bulu",level:78,rate:10},{pokemon:"Tapu Bulu",level:78,rate:10}],
  },
  "Safari Zone Southeast": {
    grass: [{pokemon:"Chien-Pao",level:80,rate:10},{pokemon:"Wo-Chien",level:80,rate:10},{pokemon:"Ting-Lu",level:80,rate:10},{pokemon:"Chi-Yu",level:80,rate:10},{pokemon:"Okidogi",level:80,rate:10},{pokemon:"Fezandipiti",level:80,rate:10},{pokemon:"Munkidori",level:80,rate:10},{pokemon:"Pecharunt",level:80,rate:10},{pokemon:"Zarude",level:80,rate:10},{pokemon:"Magearna",level:80,rate:5},{pokemon:"Marshadow",level:80,rate:4},{pokemon:"Marshadow",level:80,rate:1}],
    fishing: [{pokemon:"Volcanion",level:80,rate:20},{pokemon:"Volcanion",level:80,rate:20},{pokemon:"Latios",level:80,rate:20},{pokemon:"Latias",level:80,rate:20},{pokemon:"Manaphy",level:80,rate:10},{pokemon:"Phione",level:80,rate:10}],
    surfing: [{pokemon:"Darkrai",level:80,rate:20},{pokemon:"Manaphy",level:80,rate:20},{pokemon:"Hoopa",level:80,rate:20},{pokemon:"Cresselia",level:80,rate:20},{pokemon:"Volcanion",level:80,rate:10},{pokemon:"Volcanion",level:80,rate:10}],
    rock_smash: [{pokemon:"Diancie",level:80,rate:25},{pokemon:"Heatran",level:80,rate:25},{pokemon:"Regigigas",level:80,rate:25},{pokemon:"Zygarde-10%",level:80,rate:15},{pokemon:"Zygarde-10%",level:80,rate:10}],
  },
  "Safari Zone Northeast": {
    grass: [{pokemon:"Genesect",level:80,rate:10},{pokemon:"Genesect",level:80,rate:10},{pokemon:"Zeraora",level:80,rate:10},{pokemon:"Zeraora",level:80,rate:10},{pokemon:"Meltan",level:80,rate:10},{pokemon:"Meltan",level:80,rate:10},{pokemon:"Ogerpon",level:80,rate:10},{pokemon:"Ogerpon",level:80,rate:10},{pokemon:"Victini",level:80,rate:10},{pokemon:"Victini",level:80,rate:5},{pokemon:"Victini",level:80,rate:4},{pokemon:"Kubfu",level:80,rate:1}],
  },
  "Navel Rock Entrance": {
    grass: [{pokemon:"Minior",level:40,rate:10},{pokemon:"Forretress",level:40,rate:10},{pokemon:"Scizor",level:40,rate:10},{pokemon:"Kleavor",level:40,rate:10},{pokemon:"Flygon",level:40,rate:10},{pokemon:"Mienshao",level:40,rate:10},{pokemon:"Crobat",level:40,rate:10},{pokemon:"Gliscor",level:40,rate:10},{pokemon:"Cyclizar",level:40,rate:10},{pokemon:"Persian-Alola",level:40,rate:5},{pokemon:"Persian-Alola",level:40,rate:4},{pokemon:"Persian-Alola",level:40,rate:1}],
  },
  "Navel Rock B1F": {
    grass: [{pokemon:"Salazzle",level:40,rate:10},{pokemon:"Togekiss",level:40,rate:10},{pokemon:"Ambipom",level:40,rate:10},{pokemon:"Hawlucha",level:40,rate:10},{pokemon:"Primarina",level:40,rate:10},{pokemon:"Swalot",level:40,rate:10},{pokemon:"Samurott",level:40,rate:10},{pokemon:"Samurott-Hisui",level:40,rate:10},{pokemon:"Grafaiai",level:40,rate:10},{pokemon:"Grafaiai",level:40,rate:5},{pokemon:"Whimsicott",level:40,rate:4},{pokemon:"Liepard",level:40,rate:1}],
  },
  "Navel Rock Fork": {
    grass: [{pokemon:"Wyrdeer",level:40,rate:10},{pokemon:"Exeggutor-Alola",level:40,rate:10},{pokemon:"Carbink",level:40,rate:10},{pokemon:"Cofagrigus",level:40,rate:10},{pokemon:"Klefki",level:40,rate:10},{pokemon:"Reuniclus",level:40,rate:10},{pokemon:"Hatterene",level:40,rate:10},{pokemon:"Orbeetle",level:40,rate:10},{pokemon:"Spiritomb",level:40,rate:10},{pokemon:"Spiritomb",level:40,rate:5},{pokemon:"Spiritomb",level:40,rate:4},{pokemon:"Spiritomb",level:40,rate:1}],
  },
  "Navel Rock Up 1": {
    grass: [{pokemon:"Excadrill",level:40,rate:10},{pokemon:"Toedscruel",level:40,rate:10},{pokemon:"Avalugg",level:40,rate:10},{pokemon:"Avalugg-Hisui",level:40,rate:10},{pokemon:"Torkoal",level:40,rate:10},{pokemon:"Coalossal",level:40,rate:10},{pokemon:"Togekiss",level:40,rate:10},{pokemon:"Gliscor",level:40,rate:10},{pokemon:"Corviknight",level:40,rate:10},{pokemon:"Altaria",level:40,rate:5},{pokemon:"Altaria",level:40,rate:4},{pokemon:"Altaria",level:40,rate:1}],
  },
  "Navel Rock Up 2": {
    grass: [{pokemon:"Golem",level:40,rate:10},{pokemon:"Golem-Alola",level:40,rate:10},{pokemon:"Magnezone",level:40,rate:10},{pokemon:"Steelix",level:40,rate:10},{pokemon:"Forretress",level:40,rate:10},{pokemon:"Donphan",level:40,rate:10},{pokemon:"Bastiodon",level:40,rate:10},{pokemon:"Probopass",level:40,rate:10},{pokemon:"Crustle",level:40,rate:10},{pokemon:"Avalugg",level:40,rate:5},{pokemon:"Avalugg-Hisui",level:40,rate:4},{pokemon:"Avalugg-Hisui",level:40,rate:1}],
  },
  "Navel Rock Up 3": {
    grass: [{pokemon:"Lycanroc-Midnight",level:40,rate:10},{pokemon:"Bibarel",level:40,rate:10},{pokemon:"Bombirdier",level:40,rate:10},{pokemon:"Carbink",level:40,rate:10},{pokemon:"Shuckle",level:40,rate:10},{pokemon:"Minior",level:40,rate:10},{pokemon:"Druddigon",level:40,rate:10},{pokemon:"Armaldo",level:40,rate:10},{pokemon:"Copperajah",level:40,rate:10},{pokemon:"Meowstic",level:40,rate:5},{pokemon:"Meowstic-F",level:40,rate:4},{pokemon:"Meowstic-F",level:40,rate:1}],
  },
  "Navel Rock Up 4": {
    grass: [{pokemon:"Cradily",level:40,rate:10},{pokemon:"Porygon2",level:40,rate:10},{pokemon:"Alcremie",level:40,rate:10},{pokemon:"Gliscor",level:40,rate:10},{pokemon:"Hydrapple",level:40,rate:10},{pokemon:"Garganacl",level:40,rate:10},{pokemon:"Togekiss",level:40,rate:10},{pokemon:"Altaria",level:40,rate:10},{pokemon:"Sableye",level:40,rate:10},{pokemon:"Avalugg",level:40,rate:5},{pokemon:"Avalugg-Hisui",level:40,rate:4},{pokemon:"Avalugg-Hisui",level:40,rate:1}],
  },
  "Navel Rock Down 1": {
    grass: [{pokemon:"Audino",level:40,rate:10},{pokemon:"Yanmega",level:40,rate:10},{pokemon:"Klawf",level:40,rate:10},{pokemon:"Espathra",level:40,rate:10},{pokemon:"Klefki",level:40,rate:10},{pokemon:"Stonjourner",level:40,rate:10},{pokemon:"Obstagoon",level:40,rate:10},{pokemon:"Hitmontop",level:40,rate:10},{pokemon:"Sableye",level:40,rate:10},{pokemon:"Hitmontop",level:40,rate:5},{pokemon:"Hitmontop",level:40,rate:4},{pokemon:"Hitmontop",level:40,rate:1}],
  },
  "Navel Rock Down 2": {
    grass: [{pokemon:"Clefable",level:40,rate:10},{pokemon:"Mr. Mime",level:40,rate:10},{pokemon:"Shiinotic",level:40,rate:10},{pokemon:"Amoonguss",level:40,rate:10},{pokemon:"Lucario",level:40,rate:10},{pokemon:"Blastoise",level:40,rate:10},{pokemon:"Sinistcha",level:40,rate:10},{pokemon:"Volcarona",level:40,rate:10},{pokemon:"Toedscruel",level:40,rate:10},{pokemon:"Raichu",level:40,rate:5},{pokemon:"Raichu-Alola",level:40,rate:4},{pokemon:"Raichu-Alola",level:40,rate:1}],
  },
  "Navel Rock Down 3": {
    grass: [{pokemon:"Shiftry",level:40,rate:10},{pokemon:"Lokix",level:40,rate:10},{pokemon:"Grimmsnarl",level:40,rate:10},{pokemon:"Toxicroak",level:40,rate:10},{pokemon:"Honchkrow",level:40,rate:10},{pokemon:"Obstagoon",level:40,rate:10},{pokemon:"Cinderace",level:40,rate:10},{pokemon:"Lycanroc-Dusk",level:40,rate:10},{pokemon:"Mawile",level:40,rate:10},{pokemon:"Spiritomb",level:40,rate:5},{pokemon:"Spiritomb",level:40,rate:4},{pokemon:"Spiritomb",level:40,rate:1}],
  },
  "Navel Rock Down 4": {
    grass: [{pokemon:"Shiftry",level:40,rate:10},{pokemon:"Infernape",level:40,rate:10},{pokemon:"Palossand",level:40,rate:10},{pokemon:"Diggersby",level:40,rate:10},{pokemon:"Cyclizar",level:40,rate:10},{pokemon:"Scrafty",level:40,rate:10},{pokemon:"Blastoise",level:40,rate:10},{pokemon:"Mr. Mime-Galar",level:40,rate:10},{pokemon:"Hariyama",level:40,rate:10},{pokemon:"Hitmonchan",level:40,rate:5},{pokemon:"Hitmonlee",level:40,rate:4},{pokemon:"Hitmonlee",level:40,rate:1}],
  },
  "Navel Rock Down 5": {
    grass: [{pokemon:"Meganium",level:40,rate:10},{pokemon:"Torterra",level:40,rate:10},{pokemon:"Drapion",level:40,rate:10},{pokemon:"Perrserker",level:40,rate:10},{pokemon:"Falinks",level:40,rate:10},{pokemon:"Escavalier",level:40,rate:10},{pokemon:"Turtonator",level:40,rate:10},{pokemon:"Cradily",level:40,rate:10},{pokemon:"Armaldo",level:40,rate:10},{pokemon:"Klawf",level:40,rate:5},{pokemon:"Sliggoo-Hisui",level:40,rate:4},{pokemon:"Pupitar",level:40,rate:1}],
  },
};

const GYM_SECTIONS = [
  { gym:"Roxanne", badge:"Stone Badge", emoji:"🪨", routes:["Littleroot Town","Littleroot Grove","Route 101","Oldale Town","Oldale Grove","Route 103","Verdanturf Tunnel","Verdanturf Tunnel B1F","Route 102","Route 102 Grove","Petalburg City","Petalburg Grove","Route 104","Petalburg Woods","Rustboro City","Rustboro Grove","Route 115"] },
  { gym:"Brawly", badge:"Knuckle Badge", emoji:"🥊", routes:["Route 116","Rusturf Tunnel","Dewford Town","Route 107","Route 106","Granite Cave 1F","Granite Cave B1F","Granite Cave B2F","Granite Cave Steven's Room"] },
  { gym:"Wattson", badge:"Dynamo Badge", emoji:"⚡", routes:["Route 109","Slateport City","Route 110","Icicle Cave","Verdanturf Town","Route 117","Mauville City","Route 118","Route 111"] },
  { gym:"Norman", badge:"Balance Badge", emoji:"⚖️", routes:["Trainer Hill","Land Cave Entrance","Land Cave End","Altering Cave","Altering Grove","Verdanturf Grotto"] },
  { gym:"Flannery", badge:"Heat Badge", emoji:"🔥", routes:["Mirage Tower 1F","Mirage Tower 2F","Mirage Tower 3F","Mirage Tower 4F","Route 113","Fallarbor Town","Route 114","Route 114 Underpass","Meteor Falls","Meteor Falls Room 2","Meteor Falls B1F Room 1","Meteor Falls B1F Room 2","Route 112","Fiery Path","Mt. Chimney","Jagged Pass"] },
  { gym:"Winona", badge:"Feather Badge", emoji:"🪶", routes:["Route 134","New Mauville (Outside)","New Mauville (Inside)","Route 105","Route 108","Abandoned Ship B1F Rooms","Abandoned Ship Dive Room","Route 119","Fortree City","Route 120"] },
  { gym:"Tate & Liza", badge:"Mind Badge", emoji:"🔮", routes:["Route 121","Lilycove City","Aqua Hideout","Battle Frontier","Artisan Cave B1F","Artisan Cave 1F","Southern Island Exterior","Southern Island Interior","Route 122","Route 123","Mt. Pyre 1F","Mt. Pyre 2F","Mt. Pyre 3F","Mt. Pyre 4F","Mt. Pyre 5F","Mt. Pyre 6F","Mt. Pyre Exterior","Mt. Pyre Summit","Magma Hideout Floor 1","Magma Hideout Floor 2","Magma Hideout Floor 3","Magma Hideout Floor 4","Mossdeep City","Route 125","Shoal Cave (Entrance Room)","Shoal Cave (Inner Room)","Shoal Cave (Stairs Room)","Shoal Cave (Lower Room)","Shoal Cave (Ice Room)"] },
  { gym:"Steven", badge:"Rain Badge", emoji:"🌊", routes:["Route 127","Route 126","Route 126 Underwater","Sootopolis City","Route 128","Seafloor Cavern (No Water)","Seafloor Cavern (Water)","Cave Of Origin Entrance","Cave Of Origin 1F","Route 131","Pacifidlog Town","Sky Pillar 1F","Sky Pillar 2F","Sky Pillar 3F","Sky Pillar 4F","Sky Pillar 5F"] },
  { gym:"E4", badge:"Elite Four", emoji:"👑", routes:["Ever Grande City","Victory Road 1F","Victory Road B1F","Victory Road Final Room"] },
];

const METHOD_COLORS = { grass:'#2d6a30', fishing:'#1a5276', surfing:'#117a8b', rock_smash:'#7d6608', gift:'#6a0d83', static:'#0d5c7a' };

const LAND_ROUTES = new Set([
  "Verdanturf Tunnel","Verdanturf Tunnel B1F","Rusturf Tunnel",
  "Granite Cave 1F","Granite Cave B1F","Granite Cave B2F","Granite Cave Steven's Room",
  "Icicle Cave","Land Cave Entrance","Land Cave End","Altering Cave","Verdanturf Grotto",
  "Mirage Tower 1F","Mirage Tower 2F","Mirage Tower 3F","Mirage Tower 4F",
  "Route 114 Underpass","Meteor Falls","Meteor Falls Room 2",
  "Meteor Falls B1F Room 1","Meteor Falls B1F Room 2",
  "Fiery Path","New Mauville (Outside)","New Mauville (Inside)",
  "Artisan Cave B1F","Artisan Cave 1F","Mt. Pyre 1F","Mt. Pyre 2F","Mt. Pyre 3F","Mt. Pyre 4F","Mt. Pyre 5F","Mt. Pyre 6F",
  "Magma Hideout Floor 1","Magma Hideout Floor 2","Magma Hideout Floor 3","Magma Hideout Floor 4",
  "Shoal Cave (Entrance Room)","Shoal Cave (Inner Room)","Shoal Cave (Stairs Room)","Shoal Cave (Lower Room)","Shoal Cave (Ice Room)",
  "Seafloor Cavern (No Water)","Seafloor Cavern (Water)","Cave Of Origin Entrance","Cave Of Origin 1F","Sky Pillar 1F","Sky Pillar 2F","Sky Pillar 3F","Sky Pillar 4F","Sky Pillar 5F",
  "Victory Road 1F","Victory Road B1F","Victory Road Final Room","Navel Rock Entrance",
  "Navel Rock B1F","Navel Rock Fork","Navel Rock Up 1","Navel Rock Up 2","Navel Rock Up 3","Navel Rock Up 4",
  "Navel Rock Down 1","Navel Rock Down 2","Navel Rock Down 3","Navel Rock Down 4","Navel Rock Down 5",
]);

const getMethodDisplay = (method, routeName) => {
  if (method === 'grass' && LAND_ROUTES.has(routeName)) {
    return { color: '#8b7d5a', icon: '⛰️', label: 'LAND' };
  }
  const icons = { grass:'🌿', fishing:'🎣', surfing:'🌊', rock_smash:'🪨', gift:'🎁', static:'⭐' };
  const labels = { grass:'GRASS', fishing:'FISHING', surfing:'SURFING', rock_smash:'ROCK SMASH', gift:'GIFT', static:'STATIC' };
  return {
    color: METHOD_COLORS[method] || '#444',
    icon: icons[method] || '•',
    label: labels[method] || method.replace('_',' ').toUpperCase(),
  };
};

function MethodIcon({ method, small, routeName }) {
  const sz = small ? '0.9rem' : '1rem';
  if (method === 'grass' && routeName && LAND_ROUTES.has(routeName)) return <span style={{fontSize:sz}}>⛰️</span>;
  if (method === 'fishing')    return <span style={{fontSize:sz}}>🎣</span>;
  if (method === 'rock_smash') return <span style={{fontSize:sz}}>🪨</span>;
  if (method === 'grass')      return <span style={{fontSize:sz}}>🌿</span>;
  if (method === 'surfing')    return <span style={{fontSize:sz}}>🌊</span>;
  if (method === 'gift')       return <span style={{fontSize:sz}}>🎁</span>;
  if (method === 'static')     return <span style={{fontSize:sz}}>⭐</span>;
  return <span>•</span>;
}

function parseShowdown(text) {
  return text.trim().split(/\n\s*\n/).filter(b=>b.trim()).map(block=>{
    const lines = block.trim().split('\n');
    const first = lines[0].trim();
    let nickname='', species='';
    if (first.includes('(')&&first.includes(')')) {
      nickname=first.slice(0,first.indexOf('(')).trim();
      species=first.slice(first.indexOf('(')+1,first.lastIndexOf(')')).trim();
    } else { species=first.split('@')[0].trim(); }
    let level=1;
    for (const line of lines.slice(1)) {
      if (line.startsWith('Level:')) level=parseInt(line.split(':')[1])||level;
    }
    return {species,nickname,level,status:'alive',id:Date.now()+Math.random()};
  }).filter(p=>p.species);
}

function SpritePopup({ enc, adjRate, onCatch, onClose }) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-card" onClick={e=>e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>✕</button>
        <SmartSprite name={enc.pokemon} className="popup-sprite" />
        <div className="popup-name">{enc.pokemon}</div>
        <div className="popup-meta">
          Lv. {enc.level} · Base: {enc.rate}%
          {adjRate !== undefined && adjRate !== enc.rate &&
            <span className="popup-adj"> → Adj: {adjRate}%</span>}
        </div>
        <div className="popup-actions">
          <button className="popup-btn catch-btn" onClick={()=>{onCatch(enc.pokemon);onClose();}}>
            🎯 Catch & Add to Box
          </button>
          <a className="popup-btn dex-btn" href={getNulldexUrl(enc.pokemon)} target="_blank" rel="noreferrer">
            📖 View in Nulldex
          </a>
        </div>
      </div>
    </div>
  );
}

const SpriteCard = memo(function SpriteCard({ enc, adjRate, duped, onCatch }) {
  const [popup, setPopup] = useState(false);
  return (
    <>
      <div className={`sprite-card ${duped?'duped':''}`} onClick={()=>setPopup(true)}>
        <SmartSprite name={enc.pokemon} className="sprite-img" />
        {duped && <div className="duped-badge">DUPED</div>}
        <div className="sprite-name">{enc.pokemon}</div>
        <div className="sprite-meta">
          Lv.{enc.level}
          {duped
            ? <span className="sprite-rate rate-duped"> ✕</span>
            : <span className="sprite-rate"> {adjRate !== undefined ? adjRate : enc.rate}%</span>
          }
        </div>
      </div>
      {popup && <SpritePopup enc={enc} adjRate={adjRate} onCatch={onCatch} onClose={()=>setPopup(false)}/>}
    </>
  );
});

const RouteCard = memo(function RouteCard({ route, box, onCatch }) {
  const [expanded, setExpanded] = useState(false);

  const extra = EXTRA_ENCOUNTERS[route.name] || {};
  const backendMethods = Object.entries(route.encounters || {});
  const extraMethods = Object.entries(extra);
  const backendKeys = new Set(backendMethods.map(([m]) => m));
  const allMethods = [
    ...backendMethods,
    ...extraMethods.filter(([m]) => !backendKeys.has(m)),
  ];
  const mergedMethods = allMethods.map(([m, encs]) => {
    if (backendKeys.has(m) && extra[m]) {
      return [m, [...encs, ...extra[m]]];
    }
    return [m, encs];
  });

  const isSpecial = (m) => m === 'gift' || m === 'static';
  const visible = expanded ? mergedMethods : mergedMethods.slice(0,1);

  return (
    <div className="route-card" id={`route-${route.name.replace(/\s+/g,'-')}`}>
      <div className="route-card-header" onClick={()=>setExpanded(!expanded)}>
        <h3>{route.name}</h3>
        <div className="route-header-right">
          {mergedMethods.length>1 && !expanded && (
            <span className="method-pills">
              {mergedMethods.slice(1).map(([m])=>(
                <span key={m} className="pill"><MethodIcon method={m} small routeName={route.name}/></span>
              ))}
            </span>
          )}
          <span className="expand-icon">{expanded?'▲':'▼'}</span>
        </div>
      </div>

      {visible.map(([method,encounters])=>{
        if (isSpecial(method)) {
          const hasGroups = encounters.length > 0 && encounters[0].group;
          const adjustGroup = (pokemons) => {
            const dupedRate = pokemons.filter(e => isDupedOut(e.pokemon, box)).reduce((s,e) => s + (Number(e.rate)||0), 0);
            const remaining = 100 - dupedRate;
            return pokemons.map(e => {
              if (isDupedOut(e.pokemon, box)) return {...e, adjRate: 0};
              const adj = (dupedRate === 0 || box.length === 0) ? e.rate : (remaining > 0 ? Math.round((Number(e.rate)/remaining)*1000)/10 : 0);
              return {...e, adjRate: adj};
            });
          };
          return (
            <div key={method} className="encounter-method">
              <div className="method-header-row">
                <div className="method-header" style={{background:METHOD_COLORS[method]||'#444'}}>
                  <MethodIcon method={method}/> <span>{method.toUpperCase()}</span>
                </div>
              </div>
              {hasGroups ? encounters.map((grp,gi)=>{
                const adjusted = adjustGroup(grp.pokemon);
                return (
                  <div key={gi}>
                    <div style={{fontSize:'0.7rem',fontWeight:700,color:'var(--text2)',letterSpacing:'0.5px',padding:'8px 0 6px 2px',textTransform:'uppercase'}}>{grp.group}</div>
                    <div className="sprite-grid">
                      {adjusted.map((enc,i)=>(
                        <SpriteCard key={i} enc={enc} adjRate={enc.adjRate} duped={isDupedOut(enc.pokemon,box)} onCatch={onCatch}/>
                      ))}
                    </div>
                  </div>
                );
              }) : (
                <div className="sprite-grid">
                  {encounters.map((enc,i)=>(
                    <SpriteCard key={i} enc={enc} adjRate={enc.rate} duped={isDupedOut(enc.pokemon,box)} onCatch={onCatch}/>
                  ))}
                </div>
              )}
            </div>
          );
        }
        const adjusted = getAdjustedEncounters(encounters, box);
        const { color: mColor, icon: mIcon, label: mLabel } = getMethodDisplay(method, route.name);
        return (
          <div key={method} className="encounter-method">
            <div className="method-header-row">
              <div className="method-header" style={{background:mColor}}>
                <span>{mIcon}</span> <span>{mLabel}</span>
              </div>
            </div>
            <div className="sprite-grid">
              {adjusted.map((enc,i)=>(
                <SpriteCard key={i} enc={enc} adjRate={enc.adjRate} duped={isDupedOut(enc.pokemon,box)} onCatch={onCatch}/>
              ))}
            </div>
          </div>
        );
      })}

      {mergedMethods.length>1 && (
        <button className="view-more-btn" onClick={()=>setExpanded(!expanded)}>
          <strong>{expanded?'▲ Show Less':`▼ View All Methods (${mergedMethods.length})`}</strong>
        </button>
      )}
    </div>
  );
});

function TrackerEntry({ p, onToggle, onRemove }) {
  const isDead = p.status==='dead';
  return (
    <div className={`tracker-entry ${isDead?'dead':''}`}>
      <div className="tracker-sprite">
        <SmartSprite name={p.species} className="tracker-sprite-img"/>
      </div>
      <div className="tracker-info">
        <div className="tracker-species">{p.species}</div>
        {p.level>1 && <div className="tracker-level">Lv. {p.level}</div>}
      </div>
      <div className="tracker-actions">
        <button className={`status-btn ${isDead?'revive-btn':'kill-btn'}`} onClick={()=>onToggle(p.id)}>
          {isDead?'♻️':'💀'}
        </button>
        <button className="remove-btn" onClick={()=>onRemove(p.id)}>✕</button>
      </div>
    </div>
  );
}

function NuzlockeTracker({ box, setBox }) {
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [newName, setNewName] = useState('');
  const fileRef = useRef();

  const save = useCallback((updated) => { localStorage.setItem('nuzlocke_box',JSON.stringify(updated)); return updated; }, []);
  const addPokemon = useCallback((name) => {
    const n=(name||newName).trim(); if(!n) return;
    setBox(prev=>save([...prev,{species:n,status:'alive',id:Date.now()+Math.random()}]));
    if(!name) setNewName('');
  }, [newName, save, setBox]);
  const toggleStatus = useCallback((id) => setBox(prev=>save(prev.map(p=>p.id===id?{...p,status:p.status==='alive'?'dead':'alive'}:p))), [save, setBox]);
  const removePokemon = useCallback((id) => setBox(prev=>save(prev.filter(p=>p.id!==id))), [save, setBox]);
  const clearBox = useCallback(() => { setBox([]); localStorage.removeItem('nuzlocke_box'); }, [setBox]);
  const handleImport = useCallback(() => { setBox(prev=>save([...prev,...parseShowdown(importText)])); setImportText(''); setShowImport(false); }, [importText, save, setBox]);
  const handleFile = useCallback((e) => {
    const file=e.target.files[0]; if(!file) return;
    const r=new FileReader();
    r.onload=(ev)=>setBox(prev=>save([...prev,...parseShowdown(ev.target.result)]));
    r.readAsText(file); e.target.value='';
  }, [save, setBox]);

  const alive=box.filter(p=>p.status==='alive');
  const dead=box.filter(p=>p.status==='dead');

  return (
    <div className="tracker">
      <div className="tracker-header"><h2>📦 Nuzlocke Box</h2></div>
      <div className="tracker-add">
        <input className="tracker-input" placeholder="Pokémon name..." value={newName}
          onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addPokemon()}/>
        <button className="tracker-btn add-btn" onClick={()=>addPokemon()}>+ Add</button>
      </div>
      <div className="import-row">
        <button className="tracker-btn import-btn" onClick={()=>setShowImport(!showImport)}>📋 Paste</button>
        <button className="tracker-btn import-btn" onClick={()=>fileRef.current.click()}>📁 File</button>
        <input ref={fileRef} type="file" accept=".txt" style={{display:'none'}} onChange={handleFile}/>
        {box.length>0 && <button className="tracker-btn clear-btn" onClick={clearBox}>🚛 Clear</button>}
      </div>
      {showImport && (
        <div className="import-box">
          <textarea className="import-textarea" placeholder="Paste your Lua/Showdown export here..."
            value={importText} onChange={e=>setImportText(e.target.value)} rows={8}/>
          <button className="tracker-btn add-btn" onClick={handleImport}>Import</button>
        </div>
      )}
      {alive.length>0 && (
        <div className="tracker-section">
          <div className="tracker-section-label">ACTIVE ({alive.length})</div>
          {alive.map(p=><TrackerEntry key={p.id} p={p} onToggle={toggleStatus} onRemove={removePokemon}/>)}
        </div>
      )}
      {dead.length>0 && (
        <div className="tracker-section">
          <div className="tracker-section-label dead-label">FALLEN ({dead.length})</div>
          {dead.map(p=><TrackerEntry key={p.id} p={p} onToggle={toggleStatus} onRemove={removePokemon}/>)}
        </div>
      )}
      {box.length===0 && (
        <div className="tracker-empty">Add Pokémon or import your save.<br/><br/>Dupes clause active — owned species & evolutions are greyed out on encounter tables.</div>
      )}
    </div>
  );
}

const SAFARI_LAND = {
  "Safari Zone South":      [{r:"10%",p:"Uxie"},{r:"10%",p:"Uxie"},{r:"10%",p:"Azelf"},{r:"10%",p:"Azelf"},{r:"10%",p:"Mesprit"},{r:"10%",p:"Mesprit"},{r:"10%",p:"Cresselia"},{r:"10%",p:"Cresselia"},{r:"10%",p:"Shaymin"},{r:"5%",p:"Shaymin"},{r:"4%",p:"Shaymin"},{r:"1%",p:"Shaymin"}],
  "Safari Zone North":      [{r:"10%",p:"Regieleki"},{r:"10%",p:"Regieleki"},{r:"10%",p:"Regidrago"},{r:"10%",p:"Regidrago"},{r:"10%",p:"Glastrier"},{r:"10%",p:"Glastrier"},{r:"10%",p:"Spectrier"},{r:"10%",p:"Spectrier"},{r:"10%",p:"Jirachi"},{r:"5%",p:"Jirachi"},{r:"4%",p:"Jirachi"},{r:"1%",p:"Jirachi"}],
  "Safari Zone Southwest":  [{r:"10%",p:"Raikou"},{r:"10%",p:"Raikou"},{r:"10%",p:"Entei"},{r:"10%",p:"Entei"},{r:"10%",p:"Suicune"},{r:"10%",p:"Suicune"},{r:"10%",p:"Mew"},{r:"10%",p:"Mew"},{r:"10%",p:"Celebi"},{r:"5%",p:"Celebi"},{r:"4%",p:"Celebi"},{r:"1%",p:"Celebi"}],
  "Safari Zone Northwest":  [{r:"10%",p:"Cobalion"},{r:"10%",p:"Cobalion"},{r:"10%",p:"Terrakion"},{r:"10%",p:"Terrakion"},{r:"10%",p:"Virizion"},{r:"10%",p:"Virizion"},{r:"10%",p:"Keldeo"},{r:"10%",p:"Keldeo"},{r:"10%",p:"Meloetta"},{r:"5%",p:"Meloetta"},{r:"4%",p:"Meloetta"},{r:"1%",p:"Meloetta"}],
  "Safari Zone Southeast":  [{r:"10%",p:"Chien-Pao"},{r:"10%",p:"Wo-Chien"},{r:"10%",p:"Ting-Lu"},{r:"10%",p:"Chi-Yu"},{r:"10%",p:"Okidogi"},{r:"10%",p:"Fezandipiti"},{r:"10%",p:"Munkidori"},{r:"10%",p:"Pecharunt"},{r:"10%",p:"Zarude"},{r:"5%",p:"Magearna"},{r:"4%",p:"Marshadow"},{r:"1%",p:"Marshadow"}],
  "Safari Zone Northeast":  [{r:"10%",p:"Genesect"},{r:"10%",p:"Genesect"},{r:"10%",p:"Zeraora"},{r:"10%",p:"Zeraora"},{r:"10%",p:"Meltan"},{r:"10%",p:"Meltan"},{r:"10%",p:"Ogerpon"},{r:"10%",p:"Ogerpon"},{r:"10%",p:"Victini"},{r:"5%",p:"Victini"},{r:"4%",p:"Victini"},{r:"1%",p:"Kubfu"}],
};

const SAFARI_FISHING = {
  "Safari Zone Southwest":  [{r:"20%",p:"Phione"},{r:"20%",p:"Phione"},{r:"20%",p:"Phione"},{r:"20%",p:"Phione"},{r:"10%",p:"Manaphy"},{r:"10%",p:"Manaphy"}],
  "Safari Zone Northwest":  [{r:"20%",p:"Phione"},{r:"20%",p:"Phione"},{r:"20%",p:"Phione"},{r:"20%",p:"Manaphy"},{r:"10%",p:"Manaphy"},{r:"10%",p:"Manaphy"}],
  "Safari Zone Southeast":  [{r:"20%",p:"Volcanion"},{r:"20%",p:"Volcanion"},{r:"20%",p:"Latios"},{r:"20%",p:"Latias"},{r:"10%",p:"Manaphy"},{r:"10%",p:"Phione"}],
};

const SAFARI_SURF = {
  "Safari Zone Southwest":  [{r:"20%",p:"Articuno"},{r:"20%",p:"Zapdos"},{r:"20%",p:"Moltres"},{r:"20%",p:"Tapu Koko"},{r:"10%",p:"Tapu Lele"},{r:"10%",p:"Tapu Lele"}],
  "Safari Zone Northwest":  [{r:"20%",p:"Articuno-Galar"},{r:"20%",p:"Zapdos-Galar"},{r:"20%",p:"Moltres-Galar"},{r:"20%",p:"Tapu Fini"},{r:"10%",p:"Tapu Bulu"},{r:"10%",p:"Tapu Bulu"}],
  "Safari Zone Southeast":  [{r:"20%",p:"Darkrai"},{r:"20%",p:"Manaphy"},{r:"20%",p:"Hoopa"},{r:"20%",p:"Cresselia"},{r:"10%",p:"Volcanion"},{r:"10%",p:"Volcanion"}],
};

const SAFARI_ROCK = {
  "Safari Zone North":      [{r:"25%",p:"Regirock"},{r:"25%",p:"Regice"},{r:"25%",p:"Registeel"},{r:"15%",p:"Regigigas"},{r:"10%",p:"Regigigas"}],
  "Safari Zone Southeast":  [{r:"25%",p:"Diancie"},{r:"25%",p:"Heatran"},{r:"25%",p:"Regigigas"},{r:"15%",p:"Zygarde-10%"},{r:"10%",p:"Zygarde-10%"}],
};

const NAVEL_LAND = {
  "Navel Rock Entrance": [{r:"10%",p:"Minior"},{r:"10%",p:"Forretress"},{r:"10%",p:"Scizor"},{r:"10%",p:"Kleavor"},{r:"10%",p:"Flygon"},{r:"10%",p:"Mienshao"},{r:"10%",p:"Crobat"},{r:"10%",p:"Gliscor"},{r:"10%",p:"Cyclizar"},{r:"5%",p:"Persian-Alola"},{r:"4%",p:"Persian-Alola"},{r:"1%",p:"Persian-Alola"}],
  "Navel Rock B1F":      [{r:"10%",p:"Salazzle"},{r:"10%",p:"Togekiss"},{r:"10%",p:"Ambipom"},{r:"10%",p:"Hawlucha"},{r:"10%",p:"Primarina"},{r:"10%",p:"Swalot"},{r:"10%",p:"Samurott"},{r:"10%",p:"Samurott-Hisui"},{r:"10%",p:"Grafaiai"},{r:"5%",p:"Grafaiai"},{r:"4%",p:"Whimsicott"},{r:"1%",p:"Liepard"}],
  "Navel Rock Fork":     [{r:"10%",p:"Wyrdeer"},{r:"10%",p:"Exeggutor-Alola"},{r:"10%",p:"Carbink"},{r:"10%",p:"Cofagrigus"},{r:"10%",p:"Klefki"},{r:"10%",p:"Reuniclus"},{r:"10%",p:"Hatterene"},{r:"10%",p:"Orbeetle"},{r:"10%",p:"Spiritomb"},{r:"5%",p:"Spiritomb"},{r:"4%",p:"Spiritomb"},{r:"1%",p:"Spiritomb"}],
  "Navel Rock Up 1":     [{r:"10%",p:"Excadrill"},{r:"10%",p:"Toedscruel"},{r:"10%",p:"Avalugg"},{r:"10%",p:"Avalugg-Hisui"},{r:"10%",p:"Torkoal"},{r:"10%",p:"Coalossal"},{r:"10%",p:"Togekiss"},{r:"10%",p:"Gliscor"},{r:"10%",p:"Corviknight"},{r:"5%",p:"Altaria"},{r:"4%",p:"Altaria"},{r:"1%",p:"Altaria"}],
  "Navel Rock Up 2":     [{r:"10%",p:"Golem"},{r:"10%",p:"Golem-Alola"},{r:"10%",p:"Magnezone"},{r:"10%",p:"Steelix"},{r:"10%",p:"Forretress"},{r:"10%",p:"Donphan"},{r:"10%",p:"Bastiodon"},{r:"10%",p:"Probopass"},{r:"10%",p:"Crustle"},{r:"5%",p:"Avalugg"},{r:"4%",p:"Avalugg-Hisui"},{r:"1%",p:"Avalugg-Hisui"}],
  "Navel Rock Up 3":     [{r:"10%",p:"Lycanroc-Midnight"},{r:"10%",p:"Bibarel"},{r:"10%",p:"Bombirdier"},{r:"10%",p:"Carbink"},{r:"10%",p:"Shuckle"},{r:"10%",p:"Minior"},{r:"10%",p:"Druddigon"},{r:"10%",p:"Armaldo"},{r:"10%",p:"Copperajah"},{r:"5%",p:"Meowstic"},{r:"4%",p:"Meowstic-F"},{r:"1%",p:"Meowstic-F"}],
  "Navel Rock Up 4":     [{r:"10%",p:"Cradily"},{r:"10%",p:"Porygon2"},{r:"10%",p:"Alcremie"},{r:"10%",p:"Gliscor"},{r:"10%",p:"Hydrapple"},{r:"10%",p:"Garganacl"},{r:"10%",p:"Togekiss"},{r:"10%",p:"Altaria"},{r:"10%",p:"Sableye"},{r:"5%",p:"Avalugg"},{r:"4%",p:"Avalugg-Hisui"},{r:"1%",p:"Avalugg-Hisui"}],
  "Navel Rock Down 1":   [{r:"10%",p:"Audino"},{r:"10%",p:"Yanmega"},{r:"10%",p:"Klawf"},{r:"10%",p:"Espathra"},{r:"10%",p:"Klefki"},{r:"10%",p:"Stonjourner"},{r:"10%",p:"Obstagoon"},{r:"10%",p:"Hitmontop"},{r:"10%",p:"Sableye"},{r:"5%",p:"Hitmontop"},{r:"4%",p:"Hitmontop"},{r:"1%",p:"Hitmontop"}],
  "Navel Rock Down 2":   [{r:"10%",p:"Clefable"},{r:"10%",p:"Mr. Mime"},{r:"10%",p:"Shiinotic"},{r:"10%",p:"Amoonguss"},{r:"10%",p:"Lucario"},{r:"10%",p:"Blastoise"},{r:"10%",p:"Sinistcha"},{r:"10%",p:"Volcarona"},{r:"10%",p:"Toedscruel"},{r:"5%",p:"Raichu"},{r:"4%",p:"Raichu-Alola"},{r:"1%",p:"Raichu-Alola"}],
  "Navel Rock Down 3":   [{r:"10%",p:"Shiftry"},{r:"10%",p:"Lokix"},{r:"10%",p:"Grimmsnarl"},{r:"10%",p:"Toxicroak"},{r:"10%",p:"Honchkrow"},{r:"10%",p:"Obstagoon"},{r:"10%",p:"Cinderace"},{r:"10%",p:"Lycanroc-Dusk"},{r:"10%",p:"Mawile"},{r:"5%",p:"Spiritomb"},{r:"4%",p:"Spiritomb"},{r:"1%",p:"Spiritomb"}],
  "Navel Rock Down 4":   [{r:"10%",p:"Shiftry"},{r:"10%",p:"Infernape"},{r:"10%",p:"Palossand"},{r:"10%",p:"Diggersby"},{r:"10%",p:"Cyclizar"},{r:"10%",p:"Scrafty"},{r:"10%",p:"Blastoise"},{r:"10%",p:"Mr. Mime-Galar"},{r:"10%",p:"Hariyama"},{r:"5%",p:"Hitmonchan"},{r:"4%",p:"Hitmonlee"},{r:"1%",p:"Hitmonlee"}],
  "Navel Rock Down 5":   [{r:"10%",p:"Meganium"},{r:"10%",p:"Torterra"},{r:"10%",p:"Drapion"},{r:"10%",p:"Perrserker"},{r:"10%",p:"Falinks"},{r:"10%",p:"Escavalier"},{r:"10%",p:"Turtonator"},{r:"10%",p:"Cradily"},{r:"10%",p:"Armaldo"},{r:"5%",p:"Klawf"},{r:"4%",p:"Sliggoo-Hisui"},{r:"1%",p:"Pupitar"}],
};

const OTHER_LOCATIONS = {
  "Safari Zone South":     { grass: [{pokemon:"Uxie",level:76,rate:10},{pokemon:"Uxie",level:76,rate:10},{pokemon:"Azelf",level:76,rate:10},{pokemon:"Azelf",level:76,rate:10},{pokemon:"Mesprit",level:76,rate:10},{pokemon:"Mesprit",level:76,rate:10},{pokemon:"Cresselia",level:76,rate:10},{pokemon:"Cresselia",level:76,rate:10},{pokemon:"Shaymin",level:76,rate:10},{pokemon:"Shaymin",level:76,rate:5},{pokemon:"Shaymin",level:76,rate:4},{pokemon:"Shaymin",level:76,rate:1}] },
  "Safari Zone North":     { grass: [{pokemon:"Regieleki",level:76,rate:10},{pokemon:"Regieleki",level:76,rate:10},{pokemon:"Regidrago",level:76,rate:10},{pokemon:"Regidrago",level:76,rate:10},{pokemon:"Glastrier",level:76,rate:10},{pokemon:"Glastrier",level:76,rate:10},{pokemon:"Spectrier",level:76,rate:10},{pokemon:"Spectrier",level:76,rate:10},{pokemon:"Jirachi",level:76,rate:10},{pokemon:"Jirachi",level:76,rate:5},{pokemon:"Jirachi",level:76,rate:4},{pokemon:"Jirachi",level:76,rate:1}], rock_smash: [{pokemon:"Regirock",level:76,rate:25},{pokemon:"Regice",level:76,rate:25},{pokemon:"Registeel",level:76,rate:25},{pokemon:"Regigigas",level:76,rate:15},{pokemon:"Regigigas",level:76,rate:10}] },
  "Safari Zone Southwest": { grass: [{pokemon:"Raikou",level:78,rate:10},{pokemon:"Raikou",level:78,rate:10},{pokemon:"Entei",level:78,rate:10},{pokemon:"Entei",level:78,rate:10},{pokemon:"Suicune",level:78,rate:10},{pokemon:"Suicune",level:78,rate:10},{pokemon:"Mew",level:78,rate:10},{pokemon:"Mew",level:78,rate:10},{pokemon:"Celebi",level:78,rate:10},{pokemon:"Celebi",level:78,rate:5},{pokemon:"Celebi",level:78,rate:4},{pokemon:"Celebi",level:78,rate:1}], fishing: [{pokemon:"Phione",level:78,rate:20},{pokemon:"Phione",level:78,rate:20},{pokemon:"Phione",level:78,rate:20},{pokemon:"Phione",level:78,rate:20},{pokemon:"Manaphy",level:78,rate:10},{pokemon:"Manaphy",level:78,rate:10}], surfing: [{pokemon:"Articuno",level:78,rate:20},{pokemon:"Zapdos",level:78,rate:20},{pokemon:"Moltres",level:78,rate:20},{pokemon:"Tapu Koko",level:78,rate:20},{pokemon:"Tapu Lele",level:78,rate:10},{pokemon:"Tapu Lele",level:78,rate:10}] },
  "Safari Zone Northwest": { grass: [{pokemon:"Cobalion",level:78,rate:10},{pokemon:"Cobalion",level:78,rate:10},{pokemon:"Terrakion",level:78,rate:10},{pokemon:"Terrakion",level:78,rate:10},{pokemon:"Virizion",level:78,rate:10},{pokemon:"Virizion",level:78,rate:10},{pokemon:"Keldeo",level:78,rate:10},{pokemon:"Keldeo",level:78,rate:10},{pokemon:"Meloetta",level:78,rate:10},{pokemon:"Meloetta",level:78,rate:5},{pokemon:"Meloetta",level:78,rate:4},{pokemon:"Meloetta",level:78,rate:1}], fishing: [{pokemon:"Phione",level:78,rate:20},{pokemon:"Phione",level:78,rate:20},{pokemon:"Phione",level:78,rate:20},{pokemon:"Manaphy",level:78,rate:20},{pokemon:"Manaphy",level:78,rate:10},{pokemon:"Manaphy",level:78,rate:10}], surfing: [{pokemon:"Articuno-Galar",level:78,rate:20},{pokemon:"Zapdos-Galar",level:78,rate:20},{pokemon:"Moltres-Galar",level:78,rate:20},{pokemon:"Tapu Fini",level:78,rate:20},{pokemon:"Tapu Bulu",level:78,rate:10},{pokemon:"Tapu Bulu",level:78,rate:10}] },
  "Safari Zone Southeast": { grass: [{pokemon:"Chien-Pao",level:80,rate:10},{pokemon:"Wo-Chien",level:80,rate:10},{pokemon:"Ting-Lu",level:80,rate:10},{pokemon:"Chi-Yu",level:80,rate:10},{pokemon:"Okidogi",level:80,rate:10},{pokemon:"Fezandipiti",level:80,rate:10},{pokemon:"Munkidori",level:80,rate:10},{pokemon:"Pecharunt",level:80,rate:10},{pokemon:"Zarude",level:80,rate:10},{pokemon:"Magearna",level:80,rate:5},{pokemon:"Marshadow",level:80,rate:4},{pokemon:"Marshadow",level:80,rate:1}], fishing: [{pokemon:"Volcanion",level:80,rate:20},{pokemon:"Volcanion",level:80,rate:20},{pokemon:"Latios",level:80,rate:20},{pokemon:"Latias",level:80,rate:20},{pokemon:"Manaphy",level:80,rate:10},{pokemon:"Phione",level:80,rate:10}], surfing: [{pokemon:"Darkrai",level:80,rate:20},{pokemon:"Manaphy",level:80,rate:20},{pokemon:"Hoopa",level:80,rate:20},{pokemon:"Cresselia",level:80,rate:20},{pokemon:"Volcanion",level:80,rate:10},{pokemon:"Volcanion",level:80,rate:10}], rock_smash: [{pokemon:"Diancie",level:80,rate:25},{pokemon:"Heatran",level:80,rate:25},{pokemon:"Regigigas",level:80,rate:25},{pokemon:"Zygarde",level:80,rate:15},{pokemon:"Zygarde",level:80,rate:10}] },
  "Safari Zone Northeast": { grass: [{pokemon:"Genesect",level:80,rate:10},{pokemon:"Genesect",level:80,rate:10},{pokemon:"Zeraora",level:80,rate:10},{pokemon:"Zeraora",level:80,rate:10},{pokemon:"Meltan",level:80,rate:10},{pokemon:"Meltan",level:80,rate:10},{pokemon:"Ogerpon",level:80,rate:10},{pokemon:"Ogerpon",level:80,rate:10},{pokemon:"Victini",level:80,rate:10},{pokemon:"Victini",level:80,rate:5},{pokemon:"Victini",level:80,rate:4},{pokemon:"Kubfu",level:80,rate:1}] },
  "Navel Rock Entrance":   { grass: [{pokemon:"Minior",level:40,rate:10},{pokemon:"Forretress",level:40,rate:10},{pokemon:"Scizor",level:40,rate:10},{pokemon:"Kleavor",level:40,rate:10},{pokemon:"Flygon",level:40,rate:10},{pokemon:"Mienshao",level:40,rate:10},{pokemon:"Crobat",level:40,rate:10},{pokemon:"Gliscor",level:40,rate:10},{pokemon:"Cyclizar",level:40,rate:10},{pokemon:"Persian-Alola",level:40,rate:5},{pokemon:"Persian-Alola",level:40,rate:4},{pokemon:"Persian-Alola",level:40,rate:1}] },
  "Navel Rock B1F":        { grass: [{pokemon:"Salazzle",level:40,rate:10},{pokemon:"Togekiss",level:40,rate:10},{pokemon:"Ambipom",level:40,rate:10},{pokemon:"Banette",level:40,rate:10},{pokemon:"Primarina",level:40,rate:10},{pokemon:"Hawlucha",level:40,rate:10},{pokemon:"Swalot",level:40,rate:10},{pokemon:"Samurott",level:40,rate:10},{pokemon:"Samurott-Hisui",level:40,rate:10},{pokemon:"Grafaiai",level:40,rate:5},{pokemon:"Whimsicott",level:40,rate:4},{pokemon:"Liepard",level:40,rate:1}] },
  "Navel Rock Fork":       { grass: [{pokemon:"Wyrdeer",level:40,rate:10},{pokemon:"Exeggutor-Alola",level:40,rate:10},{pokemon:"Carbink",level:40,rate:10},{pokemon:"Cofagrigus",level:40,rate:10},{pokemon:"Klefki",level:40,rate:10},{pokemon:"Reuniclus",level:40,rate:10},{pokemon:"Audino",level:40,rate:10},{pokemon:"Orbeetle",level:40,rate:10},{pokemon:"Hatterene",level:40,rate:10},{pokemon:"Spiritomb",level:40,rate:5},{pokemon:"Spiritomb",level:40,rate:4},{pokemon:"Spiritomb",level:40,rate:1}] },
  "Navel Rock Up 1":       { grass: [{pokemon:"Excadrill",level:40,rate:10},{pokemon:"Toedscruel",level:40,rate:10},{pokemon:"Avalugg",level:40,rate:10},{pokemon:"Avalugg-Hisui",level:40,rate:10},{pokemon:"Torkoal",level:40,rate:10},{pokemon:"Coalossal",level:40,rate:10},{pokemon:"Togekiss",level:40,rate:10},{pokemon:"Gliscor",level:40,rate:10},{pokemon:"Corviknight",level:40,rate:10},{pokemon:"Altaria",level:40,rate:5},{pokemon:"Altaria",level:40,rate:4},{pokemon:"Altaria",level:40,rate:1}] },
  "Navel Rock Up 2":       { grass: [{pokemon:"Golem",level:40,rate:10},{pokemon:"Golem-Alola",level:40,rate:10},{pokemon:"Magnezone",level:40,rate:10},{pokemon:"Steelix",level:40,rate:10},{pokemon:"Forretress",level:40,rate:10},{pokemon:"Donphan",level:40,rate:10},{pokemon:"Bastiodon",level:40,rate:10},{pokemon:"Probopass",level:40,rate:10},{pokemon:"Crustle",level:40,rate:10},{pokemon:"Avalugg",level:40,rate:5},{pokemon:"Avalugg-Hisui",level:40,rate:4},{pokemon:"Avalugg-Hisui",level:40,rate:1}] },
  "Navel Rock Up 3":       { grass: [{pokemon:"Lycanroc-Midnight",level:40,rate:10},{pokemon:"Bibarel",level:40,rate:10},{pokemon:"Bombirdier",level:40,rate:10},{pokemon:"Carbink",level:40,rate:10},{pokemon:"Shuckle",level:40,rate:10},{pokemon:"Minior",level:40,rate:10},{pokemon:"Druddigon",level:40,rate:10},{pokemon:"Armaldo",level:40,rate:10},{pokemon:"Copperajah",level:40,rate:10},{pokemon:"Meowstic",level:40,rate:5},{pokemon:"Meowstic-F",level:40,rate:4},{pokemon:"Meowstic-F",level:40,rate:1}] },
  "Navel Rock Up 4":       { grass: [{pokemon:"Cradily",level:40,rate:10},{pokemon:"Porygon2",level:40,rate:10},{pokemon:"Alcremie",level:40,rate:10},{pokemon:"Gliscor",level:40,rate:10},{pokemon:"Hydrapple",level:40,rate:10},{pokemon:"Garganacl",level:40,rate:10},{pokemon:"Togekiss",level:40,rate:10},{pokemon:"Altaria",level:40,rate:10},{pokemon:"Sableye",level:40,rate:10},{pokemon:"Avalugg",level:40,rate:5},{pokemon:"Avalugg-Hisui",level:40,rate:4},{pokemon:"Avalugg-Hisui",level:40,rate:1}] },
  "Navel Rock Down 1":     { grass: [{pokemon:"Audino",level:40,rate:10},{pokemon:"Yanmega",level:40,rate:10},{pokemon:"Klawf",level:40,rate:10},{pokemon:"Espathra",level:40,rate:10},{pokemon:"Klefki",level:40,rate:10},{pokemon:"Dachsbun",level:40,rate:10},{pokemon:"Stonjourner",level:40,rate:10},{pokemon:"Obstagoon",level:40,rate:10},{pokemon:"Sableye",level:40,rate:10},{pokemon:"Hitmontop",level:40,rate:5},{pokemon:"Hitmontop",level:40,rate:4},{pokemon:"Hitmontop",level:40,rate:1}] },
  "Navel Rock Down 2":     { grass: [{pokemon:"Clefable",level:40,rate:10},{pokemon:"Mr. Mime",level:40,rate:10},{pokemon:"Shiinotic",level:40,rate:10},{pokemon:"Amoonguss",level:40,rate:10},{pokemon:"Lucario",level:40,rate:10},{pokemon:"Blastoise",level:40,rate:10},{pokemon:"Sinistcha",level:40,rate:10},{pokemon:"Volcarona",level:40,rate:10},{pokemon:"Toedscruel",level:40,rate:10},{pokemon:"Raichu",level:40,rate:5},{pokemon:"Raichu-Alola",level:40,rate:4},{pokemon:"Raichu-Alola",level:40,rate:1}] },
  "Navel Rock Down 3":     { grass: [{pokemon:"Shiftry",level:40,rate:10},{pokemon:"Lokix",level:40,rate:10},{pokemon:"Grimmsnarl",level:40,rate:10},{pokemon:"Toxicroak",level:40,rate:10},{pokemon:"Honchkrow",level:40,rate:10},{pokemon:"Obstagoon",level:40,rate:10},{pokemon:"Cinderace",level:40,rate:10},{pokemon:"Lycanroc-Dusk",level:40,rate:10},{pokemon:"Mawile",level:40,rate:10},{pokemon:"Spiritomb",level:40,rate:5},{pokemon:"Spiritomb",level:40,rate:4},{pokemon:"Spiritomb",level:40,rate:1}] },
  "Navel Rock Down 4":     { grass: [{pokemon:"Shiftry",level:40,rate:10},{pokemon:"Infernape",level:40,rate:10},{pokemon:"Palossand",level:40,rate:10},{pokemon:"Diggersby",level:40,rate:10},{pokemon:"Cyclizar",level:40,rate:10},{pokemon:"Scrafty",level:40,rate:10},{pokemon:"Blastoise",level:40,rate:10},{pokemon:"Mr. Mime-Galar",level:40,rate:10},{pokemon:"Hariyama",level:40,rate:10},{pokemon:"Hitmonchan",level:40,rate:5},{pokemon:"Hitmonlee",level:40,rate:4},{pokemon:"Hitmonlee",level:40,rate:1}] },
  "Navel Rock Down 5":     { grass: [{pokemon:"Meganium",level:40,rate:10},{pokemon:"Torterra",level:40,rate:10},{pokemon:"Drapion",level:40,rate:10},{pokemon:"Perrserker",level:40,rate:10},{pokemon:"Falinks",level:40,rate:10},{pokemon:"Escavalier",level:40,rate:10},{pokemon:"Turtonator",level:40,rate:10},{pokemon:"Cradily",level:40,rate:10},{pokemon:"Armaldo",level:40,rate:10},{pokemon:"Klawf",level:40,rate:5},{pokemon:"Sliggoo-Hisui",level:40,rate:4},{pokemon:"Pupitar",level:40,rate:1}] },
};

const SAFARI_LOCATIONS = ["Safari Zone South","Safari Zone North","Safari Zone Southwest","Safari Zone Northwest","Safari Zone Southeast","Safari Zone Northeast"];
const NAVEL_LOCATIONS  = ["Navel Rock Entrance","Navel Rock B1F","Navel Rock Fork","Navel Rock Up 1","Navel Rock Up 2","Navel Rock Up 3","Navel Rock Up 4","Navel Rock Down 1","Navel Rock Down 2","Navel Rock Down 3","Navel Rock Down 4","Navel Rock Down 5"];

function OtherLocationCard({ name, encounters, box, onCatch }) {
  const [expanded, setExpanded] = useState(false);
  const methods = Object.entries(encounters);
  const visible = expanded ? methods : methods.slice(0, 1);
  return (
    <div className="route-card">
      <div className="route-card-header" onClick={() => setExpanded(!expanded)}>
        <h3>{name}</h3>
        <div className="route-header-right">
          {methods.length > 1 && !expanded && (
            <span className="method-pills">
              {methods.slice(1).map(([m]) => <span key={m} className="pill"><MethodIcon method={m} small /></span>)}
            </span>
          )}
          <span className="expand-icon">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>
      {visible.map(([method, encs]) => {
        const adjusted = getAdjustedEncounters(encs, box);
        return (
          <div key={method} className="encounter-method">
            <div className="method-header-row">
              <div className="method-header" style={{ background: METHOD_COLORS[method] || '#444' }}>
                <MethodIcon method={method} /> <span>{method.replace('_', ' ').toUpperCase()}</span>
              </div>
            </div>
            <div className="sprite-grid">
              {adjusted.map((enc, i) => (
                <SpriteCard key={i} enc={enc} adjRate={enc.adjRate} duped={isDupedOut(enc.pokemon, box)} onCatch={onCatch} />
              ))}
            </div>
          </div>
        );
      })}
      {methods.length > 1 && (
        <button className="view-more-btn" onClick={() => setExpanded(!expanded)}>
          <strong>{expanded ? '▲ Show Less' : `▼ View All Methods (${methods.length})`}</strong>
        </button>
      )}
    </div>
  );
}

function OtherSection({ box, onCatch }) {
  const [tab, setTab] = useState('safari');
  const locations = tab === 'safari' ? SAFARI_LOCATIONS : NAVEL_LOCATIONS;
  const tabStyle = (t) => ({
    padding: '6px 14px', border: 'none', borderRadius: 6, cursor: 'pointer',
    fontWeight: 700, fontSize: '0.78rem', transition: 'all 0.15s',
    background: tab === t ? 'var(--accent)' : 'var(--bg4)',
    color: tab === t ? '#fff' : 'var(--text2)',
  });
  return (
    <div className="special-section">
      <div className="gym-header"><h2>🎁 Other Encounters</h2></div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button style={tabStyle('safari')} onClick={() => setTab('safari')}>🌿 Safari Zone</button>
        <button style={tabStyle('navel')} onClick={() => setTab('navel')}>🪨 Navel Rock</button>
      </div>
      {locations.map(name => (
        <OtherLocationCard key={name} name={name} encounters={OTHER_LOCATIONS[name] || {}} box={box} onCatch={onCatch} />
      ))}
    </div>
  );
}

function SpecialSection() {
  return (
    <div className="special-section">
      <div className="gym-header"><h2>✨ Special Encounters</h2></div>
      <div className="other-card">
        <h3>🔄 Trades</h3>
        <table className="other-table">
          <thead><tr><th>Wanted Pokémon</th><th>Location</th><th>Offered Pokémon</th></tr></thead>
          <tbody>
            <tr><td>Qwilfish</td><td>Rustboro City</td><td>Qwilfish-Hisui</td></tr>
            <tr><td>Stoutland</td><td>Mirage Tower 3F</td><td>Houndstone</td></tr>
            <tr><td>Castform</td><td>Weather Institute</td><td>Tornadus / Thundurus / Landorus / Enamorus</td></tr>
            <tr><td>Florges (non red color)</td><td>Fortree City</td><td>Floette-Eternal</td></tr>
          </tbody>
        </table>
      </div>
      <div className="other-card">
        <h3>⭐ Gifts / Statics</h3>
        <table className="other-table">
          <thead><tr><th>Location</th><th>Pokémon</th></tr></thead>
          <tbody>
            <tr><td>Trainer Hill</td><td>Random Eeveelution</td></tr>
            <tr><td>Route 111</td><td>Random Golett / Sandygast / Sandshrew / Phanpy</td></tr>
            <tr><td>New Mauville (Inside)</td><td>Random Voltorb / Voltorb-Hisui / Foongus / Ditto / Stunfisk-Galar</td></tr>
            <tr><td>Battle Frontier</td><td>Type: Null</td></tr>
            <tr><td>Aqua Hideout</td><td>Random Gimmighoul / Electrode-Hisui / Amoonguss / Ditto / Stunfisk-Galar</td></tr>
            <tr><td>Mossdeep City Space Center</td><td>Choose Ultra Beast / Paradox to get one randomly</td></tr>
          </tbody>
        </table>
      </div>
      <div className="other-card">
        <h3>🎰 Game Corner <span style={{fontSize:'0.75rem', fontWeight:'normal', color:'var(--text2)'}}>Available after New Mauville Quest</span></h3>
        <table className="other-table">
          <thead><tr><th>Pool</th><th>Pokémon</th></tr></thead>
          <tbody>
            <tr><td>Pool 1</td><td>Random Minior / Pumpkaboo / Flabébé / Shellos</td></tr>
            <tr><td>Pool 2 (Accessible after Feather Badge)</td><td>Random Togedemaru / Morpeko / Toxel / Rotom</td></tr>
            <tr><td>Pool 3 (Accessible after Mind Badge)</td><td>Random Honedge / Mimikyu / Finizen / Darumaka / Darumaka-G</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function App() {
  const [routes,setRoutes]   = useState([]);
  const [loading,setLoading] = useState(true);
  const [activeSection,setActiveSection] = useState('Roxanne');
  const [search,setSearch]   = useState('');
  const [box,setBox]         = useState(()=>{ try{return JSON.parse(localStorage.getItem('nuzlocke_box'))||[];}catch{return [];} });
  const [darkMode,setDarkMode] = useState(()=>{ const s=localStorage.getItem('dark_mode'); return s===null?true:s==='true'; });
  const sectionRefs = useRef({});
  const contentRef  = useRef();

  useEffect(()=>{
    fetch(`${API}/encounters/pokemon_null`)
      .then(r=>r.json()).then(data=>{setRoutes(data.routes);setLoading(false);})
      .catch(()=>setLoading(false));
  },[]);

  useEffect(()=>{ document.body.className=darkMode?'dark':'light'; localStorage.setItem('dark_mode',darkMode); },[darkMode]);

  useEffect(()=>{
    const el=contentRef.current; if(!el) return;
    const onScroll=()=>{
      const top=el.scrollTop+80;
      let cur=GYM_SECTIONS[0].gym;
      for (const key of [...GYM_SECTIONS.map(g=>g.gym),'Other','Special']) {
        const ref=sectionRefs.current[key];
        if(ref&&ref.offsetTop<=top) cur=key;
      }
      setActiveSection(cur);
    };
    el.addEventListener('scroll',onScroll,{passive:true});
    return ()=>el.removeEventListener('scroll',onScroll);
  },[loading]);

  const scrollTo=useCallback((key)=>{
    setSearch('');
    const el=sectionRefs.current[key];
    if(el&&contentRef.current) contentRef.current.scrollTop=el.offsetTop-16;
  },[]);

  const handleCatch=useCallback((species)=>{
    setBox(prev=>{ const u=[...prev,{species,status:'alive',id:Date.now()+Math.random()}]; localStorage.setItem('nuzlocke_box',JSON.stringify(u)); return u; });
  },[]);

  const getRoutes=useCallback((gymRoutes)=>gymRoutes.map(n=>{
    const found = routes.find(r=>r.name===n);
    if (found) return found;
    if (EXTRA_ENCOUNTERS[n]) return { name: n, encounters: {} };
    return null;
  }).filter(Boolean),[routes]);

  const searchResults=search.length>1 ? routes.filter(r=>r.name.toLowerCase().includes(search.toLowerCase())) : null;

  const allNavItems=[
    ...GYM_SECTIONS.map(g=>({key:g.gym,label:g.gym,badge:g.badge,emoji:g.emoji})),
    {key:'Other',label:'Other',badge:'Gifts & Trades',emoji:'🎁',tooltip:'Contains Safari Zone & Navel Rock encounters'},
    {key:'Special',label:'Special',badge:'Special Enc.',emoji:'✨'},
  ];

  return (
    <div className={`app ${darkMode?'dark':'light'}`}>
      <header className="header">
        <div className="header-left">
          <h1>
            Pokémon Null
            <img src={TYPE_NULL_SPRITE} alt="Type: Null" className="header-type-null"/>
          </h1>
          <span className="header-sub">Encounter Router · 116 Routes</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <a href="https://www.twitch.tv/xyzal_0" target="_blank" rel="noreferrer"
            style={{display:'flex',alignItems:'center',gap:6,textDecoration:'none',whiteSpace:'nowrap'}}>
            <span style={{fontSize:'0.8rem',fontWeight:700,color:'#9147ff'}}>Created by: xyzal </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#9147ff" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
            </svg>
          </a>
          <input className="search-bar" placeholder="🔍 Search routes..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </header>

      <div className="layout">
        <nav className="sidebar">
          <div className="sidebar-label">GYM SPLITS</div>
          {allNavItems.map(({key,label,badge,emoji,tooltip},i)=>(
            <React.Fragment key={key}>
              {i===GYM_SECTIONS.length && <div className="sidebar-divider"/>}
              <button className={`nav-btn ${activeSection===key?'active':''}`} onClick={()=>scrollTo(key)} title={tooltip||undefined}>
                <span className="nav-left"><span className="nav-emoji">{emoji}</span><span className="nav-gym">{label}</span></span>
                <span className="nav-badge">{badge}</span>
              </button>
            </React.Fragment>
          ))}
          <div className="sidebar-divider"/>
          <div className="theme-toggle">
            <button className={`theme-btn ${darkMode?'active':''}`} onClick={()=>setDarkMode(true)}>Dark</button>
            <button className={`theme-btn ${!darkMode?'active':''}`} onClick={()=>setDarkMode(false)}>Light</button>
          </div>
        </nav>

        <main className="content" ref={contentRef}>
          {loading && <div className="loading">⏳ Loading encounter data...</div>}
          {searchResults && (
            <div className="search-results-wrap">
              <h2 className="search-title">Results for "{search}" ({searchResults.length})</h2>
              {searchResults.length===0
                ? <p className="no-results">No routes found.</p>
                : searchResults.map(r=><RouteCard key={r.name} route={r} box={box} onCatch={handleCatch}/>)
              }
            </div>
          )}
          {!searchResults && !loading && (
            <>
              {GYM_SECTIONS.map(({gym,badge,emoji,routes:gr})=>(
                <div key={gym} className="gym-section" ref={el=>sectionRefs.current[gym]=el}>
                  <div className="gym-header">
                    <h2>{emoji} {gym} Split</h2>
                    <span className="badge-chip">{badge}</span>
                  </div>
                  {getRoutes(gr).map(r=><RouteCard key={r.name} route={r} box={box} onCatch={handleCatch}/>)}
                </div>
              ))}
              <div ref={el=>sectionRefs.current['Other']=el}><OtherSection box={box} onCatch={handleCatch}/></div>
              <div ref={el=>sectionRefs.current['Special']=el}><SpecialSection/></div>
            </>
          )}
        </main>

        <aside className="tracker-panel">
          <NuzlockeTracker box={box} setBox={setBox}/>
        </aside>
      </div>
    </div>
  );
}

export default App;