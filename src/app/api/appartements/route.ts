import { NextResponse } from 'next/server'

interface AppartementData {
  appartement: string
  chapitre: string
  titre: string
  getMessage: (prenom: string) => string
}

const APPARTEMENTS: AppartementData[] = [
  {
    appartement: 'Apt RDC',
    chapitre: 'Prologue',
    titre: 'La solitude du grand âge',
    getMessage: (p) =>
      `${p}, certaines distances ne se mesurent pas en kilomètres. On peut traverser toute une vie en donnant aux autres et se retrouver un soir entouré de ceux qu'on aime — sans pourtant se sentir moins seul·e. La solitude du grand âge est l'une des plus silencieuses qui soit, parce qu'elle arrive souvent déguisée en proximité. Un appel sans raison, une visite imprévue : parfois c'est tout ce qu'il faut pour faire tomber un mur invisible.`,
  },
  {
    appartement: 'Apt 1A',
    chapitre: 'Chapitre 1',
    titre: "L'amour et la trahison",
    getMessage: (p) =>
      `${p}, les bonheurs les plus fragiles sont souvent ceux qui brillent le plus fort de l'extérieur. Derrière une façade de complicité et de sourires partagés peut vivre une fissure silencieuse, que personne ne voit parce que personne ne cherche à la voir. L'amour blessé ne crie pas toujours — parfois il se tait si bien qu'on finit par croire qu'il n'existe plus. Nommer ce qui fait mal, c'est déjà refuser que le silence gagne.`,
  },
  {
    appartement: 'Apt 1B',
    chapitre: 'Chapitre 2',
    titre: "L'exil intérieur de l'étudiant",
    getMessage: (p) =>
      `${p}, réussir en apparence et s'effondrer en silence : c'est l'une des solitudes les plus épuisantes qui soient, parce qu'elle se cache derrière les diplômes et les mentions. Loin de ses repères, loin des siens, on peut exceller et se perdre en même temps. Si vous connaissez quelqu'un qui « s'en sort très bien » mais dont les yeux semblent absents — demandez-lui vraiment comment il va. Ces deux mots peuvent changer une journée entière.`,
  },
  {
    appartement: 'Apt 2A',
    chapitre: 'Chapitre 3',
    titre: 'La fuite perpétuelle',
    getMessage: (p) =>
      `${p}, voyager peut être une façon d'explorer le monde — ou une façon de fuir le seul endroit où l'on ait vraiment peur de rester : soi-même. La fuite perpétuelle n'a pas toujours le visage de l'aventure ; parfois elle ressemble à quelqu'un de brillant, toujours en mouvement, qui n'a jamais le temps de s'arrêter. Ce n'est pas de la liberté — c'est peut-être un silence qu'on évite. Et ce silence mérite d'être écouté, pas enjambé.`,
  },
  {
    appartement: 'Apt 2B',
    chapitre: 'Chapitre 4',
    titre: 'La joie comme armure',
    getMessage: (p) =>
      `${p}, il y a des gens qui illuminent chaque pièce qu'ils traversent — et rentrent chez eux épuisés d'avoir tant souri. La joie peut être une armure magnifique : elle protège, elle rassure les autres, elle maintient une distance entre soi et ce qu'on ressent vraiment. Si vous connaissez quelqu'un de « toujours là pour les autres », de « tellement fort » — posez-vous une question simple : qui est là pour lui, pour elle ? Ce silence-là mérite d'être entendu.`,
  },
  {
    appartement: 'Apt 3A',
    chapitre: 'Chapitre 5',
    titre: 'Le sacrifice silencieux',
    getMessage: (p) =>
      `${p}, certains amours se taisent pour ne pas peser. On renonce à ses rêves, à ses désirs, parfois à soi-même — pour laisser à l'autre toute la place. Le sacrifice silencieux ne s'annonce pas : il se glisse dans les petites décisions, les abdications discrètes, les « ça ira » prononcés trop souvent. Si vous ressentez ce poids, ou si vous en reconnaissez les signes chez quelqu'un que vous aimez, sachez qu'il existe des mots pour le nommer — et des bras pour l'accueillir.`,
  },
  {
    appartement: 'Apt 3B',
    chapitre: 'Chapitre 6',
    titre: "La colère née de l'impuissance",
    getMessage: (p) =>
      `${p}, la colère n'est pas toujours ce qu'elle semble être. Parfois, derrière la violence des mots ou la brusquerie des gestes, il y a une impuissance immense — celle de ne pas savoir dire autrement qu'on souffre. La honte culturelle, les injonctions familiales, l'amour qu'on n'a pas appris à exprimer : tout cela peut transformer une douleur en blessure pour soi et pour les autres. Ce n'est pas une fatalité. Des professionnels savent entendre ce que les mots de tous les jours ne peuvent pas dire.`,
  },
]

function normalizePrenom(prenom: string): string {
  return prenom
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]/g, '')
}

function getAppartementIndex(prenom: string): number {
  const normalized = normalizePrenom(prenom)
  if (!normalized) return 0

  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 31 + normalized.charCodeAt(i)) & 0x7fffffff
  }

  return hash % APPARTEMENTS.length
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const prenom = typeof body.prenom === 'string' ? body.prenom.trim() : ''

    if (!prenom || prenom.length === 0) {
      return NextResponse.json({ error: 'Prénom requis' }, { status: 400 })
    }

    const cleanPrenom = prenom.slice(0, 50)
    const index = getAppartementIndex(cleanPrenom)
    const apt = APPARTEMENTS[index]

    return NextResponse.json({
      appartement: apt.appartement,
      chapitre: apt.chapitre,
      titre: apt.titre,
      message: apt.getMessage(cleanPrenom),
    })
  } catch {
    return NextResponse.json({ error: 'Une erreur est survenue.' }, { status: 500 })
  }
}
