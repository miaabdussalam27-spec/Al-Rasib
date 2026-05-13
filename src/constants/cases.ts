export interface Evidence {
  id: string;
  text: string;
}

export interface Case {
  id: string;
  title: string;
  scenario: string;
  correctClaim: string;
  evidencePool: Evidence[];
  correctEvidenceIds: string[];
  correctReasoningKey: string; // Used for AI validation or specific matching
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const MYSTERY_CASES: Case[] = [
  {
    id: 'case-1',
    title: 'The Melting Sculpture',
    difficulty: 'Easy',
    scenario: "A famous ice sculpture was stolen from a gallery at midnight. The guard claims he saw a suspect running away, but the gallery is kept at a constant 2°C. The thief dropped a small glass bottle labeled 'Compound X' near the pedestal. There's a wet patch on the floor where the sculpture used to be.",
    correctClaim: "Compound X is a chemical that lowers the melting point of ice.",
    evidencePool: [
      { id: 'e1', text: "The gallery is kept at 2°C (above freezing point of plain water)." },
      { id: 'e2', text: "There is a wet patch on the floor where the sculpture was." },
      { id: 'e3', text: "The suspect was wearing a blue sweater." },
      { id: 'e4', text: "A bottle labeled 'Compound X' was found at the scene." },
      { id: 'e5', text: "The guard heard a loud splash at midnight." }
    ],
    correctEvidenceIds: ['e1', 'e2', 'e4'],
    correctReasoningKey: "If the sculpture melted at 2°C (which it usually wouldn't stay ice at) or melted faster than normal due to a chemical interaction, Compound X likely altered the physical properties of the ice."
  },
  {
    id: 'case-2',
    title: 'The Wilted Garden',
    difficulty: 'Medium',
    scenario: "Farmer Bess noticed her prize-winning tomatoes are wilting. She uses the same water as Farmer Bill, but Bill's tomatoes are thriving. A soil test shows high concentrations of salt. Bess recently repaired her fence with pressure-treated wood right next to the tomatoes. It rained heavily for three days after the fence was built.",
    correctClaim: "Leaching from the pressure-treated wood poisoned the soil with salt/chemicals.",
    evidencePool: [
      { id: 'e2-1', text: "Soil test shows high concentrations of salt." },
      { id: 'e2-2', text: "Farmer Bill's tomatoes are thriving." },
      { id: 'e2-3', text: "Heavy rain for three days after building the fence." },
      { id: 'e2-4', text: "The fence is right next to the tomatoes." },
      { id: 'e2-5', text: "Farmer Bess uses a yellow watering can." }
    ],
    correctEvidenceIds: ['e2-1', 'e2-3', 'e2-4'],
    correctReasoningKey: "Water from the rain likely carried dissolved salts or chemicals from the new fence wood into the nearby soil, affecting the plant's osmosis process."
  },
  {
    id: 'case-3',
    title: 'The Silent Forest',
    difficulty: 'Hard',
    scenario: "In a remote pine forest, all the birds have suddenly stopped singing and many are found dead on the floor. Strangely, the nearby deciduous forest is unaffected. A local factory was recently cited for poor ventilation of their sulfur-processing unit. A quick chemical analysis of the pine needles shows a significant decrease in pH, and the needles are turning brown prematurely. There was a period of unusually dense fog for the last 48 hours.",
    correctClaim: "Sulfur dioxide emissions from the factory mixed with fog to create acid rain, specifically harming the pine forest's delicate ecosystem.",
    evidencePool: [
      { id: 'e3-1', text: "Birds in the pine forest have stopped singing and many are dead." },
      { id: 'e3-2', text: "The nearby deciduous forest is unaffected." },
      { id: 'e3-3', text: "Factory recently cited for poor sulfur ventilation." },
      { id: 'e3-4', text: "Pine needles show a significant decrease in pH." },
      { id: 'e3-5', text: "Dense fog occurred for the last 48 hours." },
      { id: 'e3-6', text: "Local squirrels are following a new migration path." }
    ],
    correctEvidenceIds: ['e3-3', 'e3-4', 'e3-5'],
    correctReasoningKey: "The sulfur dioxide (SO2) from the factory likely reacted with the water in the dense fog to form sulfuric acid (acid rain/acid fog). This lowered the pH (acidity) of the pine needles, damaging the trees and disrupting the local bird population which relies on the pine forest for food or shelter."
  }
];
