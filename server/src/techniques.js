'use strict';

/**
 * Breathing techniques offered by SafeHarbor.
 *
 * Each technique has:
 *   id          – URL-safe slug
 *   name        – Display name
 *   description – Short explanation of purpose/benefit
 *   pattern     – Phase durations in seconds { inhale, holdAfterInhale, exhale, holdAfterExhale }
 *   cycles      – Recommended number of cycles per session
 *   useCase     – Primary use-case tags
 *   instructions – Step-by-step guide shown in the UI
 */
const techniques = [
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    description:
      'A powerful stress-relief technique used by athletes and military personnel. ' +
      'The equal-phase pattern activates the parasympathetic nervous system and ' +
      'reduces anxiety within minutes.',
    pattern: {
      inhale: 4,
      holdAfterInhale: 4,
      exhale: 4,
      holdAfterExhale: 4,
    },
    cycles: 4,
    useCase: ['anxiety', 'stress', 'focus', 'performance'],
    instructions: [
      'Sit upright in a comfortable position with your back straight.',
      'Exhale completely to empty your lungs.',
      'Inhale slowly through your nose for 4 counts.',
      'Hold your breath at the top for 4 counts.',
      'Exhale slowly through your mouth for 4 counts.',
      'Hold at the bottom (lungs empty) for 4 counts.',
      'Repeat for at least 4 cycles.',
    ],
  },
  {
    id: '4-7-8-breathing',
    name: '4-7-8 Breathing',
    description:
      'Developed by Dr. Andrew Weil, this technique acts as a natural tranquilizer for the ' +
      'nervous system. The extended exhale stimulates the vagus nerve and is especially ' +
      'effective for sleep onset and acute anxiety.',
    pattern: {
      inhale: 4,
      holdAfterInhale: 7,
      exhale: 8,
      holdAfterExhale: 0,
    },
    cycles: 4,
    useCase: ['sleep', 'acute-anxiety', 'relaxation'],
    instructions: [
      'Place the tip of your tongue against the ridge behind your upper front teeth.',
      'Exhale completely through your mouth, making a whoosh sound.',
      'Close your mouth and inhale quietly through your nose for 4 counts.',
      'Hold your breath for 7 counts.',
      'Exhale completely through your mouth with a whoosh sound for 8 counts.',
      'This completes one breath cycle. Repeat 3 more times.',
      'Practice twice daily for best results.',
    ],
  },
  {
    id: '5-5-5-diaphragmatic',
    name: '5-5-5 Diaphragmatic Breathing',
    description:
      'Deep belly breathing that engages the diaphragm fully. The steady 5-second rhythm ' +
      'is easy to follow even during high distress and provides an immediate grounding ' +
      'anchor by connecting breath to body sensation.',
    pattern: {
      inhale: 5,
      holdAfterInhale: 5,
      exhale: 5,
      holdAfterExhale: 0,
    },
    cycles: 5,
    useCase: ['grounding', 'panic', 'dissociation', 'beginners'],
    instructions: [
      'Lie down or sit comfortably. Place one hand on your chest, one on your belly.',
      'Breathe in slowly through your nose for 5 counts, letting your belly rise.',
      'The hand on your chest should move as little as possible.',
      'Hold for 5 counts, keeping your body relaxed.',
      'Exhale slowly through pursed lips for 5 counts, feeling your belly fall.',
      'Notice the physical sensations — the rise and fall — to stay present.',
      'Repeat for 5 cycles or until you feel grounded.',
    ],
  },
  {
    id: 'pursed-lip-breathing',
    name: 'Pursed Lip Breathing',
    description:
      'A simple technique that slows the breathing rate and keeps airways open longer. ' +
      'Highly effective during panic attacks or shortness of breath, providing quick ' +
      'relief by restoring a normal breathing rhythm.',
    pattern: {
      inhale: 2,
      holdAfterInhale: 0,
      exhale: 4,
      holdAfterExhale: 0,
    },
    cycles: 6,
    useCase: ['panic', 'shortness-of-breath', 'anxiety', 'COPD-support'],
    instructions: [
      'Relax your neck and shoulder muscles.',
      'Inhale slowly through your nose for 2 counts (keep your mouth closed).',
      'Pucker or "purse" your lips as if you are about to whistle or blow out a candle.',
      'Breathe out slowly and gently through pursed lips for 4 counts.',
      'Do not force the air out — let it flow naturally.',
      'Repeat until your breathing feels comfortable and controlled.',
    ],
  },
  {
    id: 'alternate-nostril',
    name: 'Alternate Nostril Breathing (Nadi Shodhana)',
    description:
      'An ancient yogic pranayama practice that balances the left and right hemispheres of ' +
      'the brain. Reduces stress hormones, improves cardiovascular function, and promotes ' +
      'a sense of calm and mental clarity.',
    pattern: {
      inhale: 4,
      holdAfterInhale: 4,
      exhale: 4,
      holdAfterExhale: 0,
    },
    cycles: 5,
    useCase: ['balance', 'focus', 'stress', 'mindfulness'],
    instructions: [
      'Sit comfortably with a straight spine. Rest your left hand on your left knee.',
      'Raise your right hand to your nose. Place your index and middle fingers between your eyebrows.',
      'Close your right nostril with your right thumb. Inhale slowly through your left nostril for 4 counts.',
      'Close both nostrils. Hold for 4 counts.',
      'Release your thumb and exhale through your right nostril for 4 counts.',
      'Inhale through your right nostril for 4 counts. Hold for 4 counts.',
      'Close the right nostril. Exhale through the left nostril for 4 counts. That is one complete cycle.',
      'Repeat for 5 cycles. Always finish by exhaling through the left nostril.',
    ],
  },
];

module.exports = techniques;
