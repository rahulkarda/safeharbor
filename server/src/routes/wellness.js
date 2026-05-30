'use strict';

const express = require('express');

const router = express.Router();

// ---------------------------------------------------------------------------
// 30 evidence-based CBT/DBT daily wellness tips
// ---------------------------------------------------------------------------
const TIPS = [
  {
    id: 1,
    category: 'CBT',
    tip: 'Notice negative automatic thoughts and ask yourself: "Is this thought based on facts or assumptions?" Write down the evidence for and against the thought.',
  },
  {
    id: 2,
    category: 'DBT',
    tip: 'Practice the TIPP skill when overwhelmed: Temperature (cold water on face), Intense exercise, Paced breathing, and Paired muscle relaxation.',
  },
  {
    id: 3,
    category: 'CBT',
    tip: 'Use behavioral activation today. Schedule one small, pleasurable activity even if you do not feel like it — action often precedes motivation, not the other way around.',
  },
  {
    id: 4,
    category: 'DBT',
    tip: 'Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.',
  },
  {
    id: 5,
    category: 'CBT',
    tip: 'Identify one cognitive distortion you used today (e.g., catastrophizing, all-or-nothing thinking) and reframe the situation in a more balanced way.',
  },
  {
    id: 6,
    category: 'DBT',
    tip: 'Use DEAR MAN when you need to make a request: Describe, Express, Assert, Reinforce, stay Mindful, Appear confident, Negotiate.',
  },
  {
    id: 7,
    category: 'CBT',
    tip: 'Set a worry window — a dedicated 15-minute period each day to write down worries. Outside this window, gently redirect your mind when worries arise.',
  },
  {
    id: 8,
    category: 'DBT',
    tip: 'Practice "Opposite Action": when an emotion urges you to do one thing, identify what the opposite constructive action would be and do that instead.',
  },
  {
    id: 9,
    category: 'CBT',
    tip: 'Challenge "should" statements by replacing them with "it would be nice if" or "I would prefer." This reduces self-imposed pressure and shame.',
  },
  {
    id: 10,
    category: 'Mindfulness',
    tip: 'Spend 5 minutes in mindful observation. Choose one object and observe it as if you have never seen it before — notice colour, texture, weight, smell.',
  },
  {
    id: 11,
    category: 'CBT',
    tip: 'Use a thought record: situation → automatic thought → emotion → evidence for/against → balanced thought. This builds cognitive flexibility over time.',
  },
  {
    id: 12,
    category: 'DBT',
    tip: 'Practice "Wise Mind" by pausing before reacting. Ask: what does my emotional mind say? What does my rational mind say? What would my Wise Mind decide?',
  },
  {
    id: 13,
    category: 'CBT',
    tip: 'Engage in a brief gratitude practice: write three specific things you are grateful for today. Be concrete — vague gratitude is less effective than specific examples.',
  },
  {
    id: 14,
    category: 'DBT',
    tip: 'IMPROVE the moment: Imagery (safe place), Meaning, Prayer or purpose, Relaxation, One thing at a time, brief Vacation, Encouragement.',
  },
  {
    id: 15,
    category: 'CBT',
    tip: 'Test a negative prediction by running a small behavioral experiment. Ask: "What is the worst that could realistically happen?" Then take one small step to find out.',
  },
  {
    id: 16,
    category: 'Mindfulness',
    tip: 'Practice mindful eating at one meal today. Put down utensils between bites, chew slowly, and notice flavors, textures, and your hunger/fullness cues.',
  },
  {
    id: 17,
    category: 'CBT',
    tip: 'Break a large, overwhelming task into the single smallest possible next step. Ask: "What is the first five-minute action I can take right now?"',
  },
  {
    id: 18,
    category: 'DBT',
    tip: 'Use ACCEPTS for distress tolerance: Activities, Contributing, Comparisons, Emotions (opposite), Pushing away, Thoughts (other), Sensations.',
  },
  {
    id: 19,
    category: 'CBT',
    tip: 'Practice self-compassion by speaking to yourself as you would to a good friend experiencing the same difficulty. Reduce self-criticism and blame.',
  },
  {
    id: 20,
    category: 'DBT',
    tip: 'Check the "PLEASE" skills: treat PhysicaL illness, balance Eating, avoid mood-Altering substances, balance Sleep, get Exercise. Your body affects your mind.',
  },
  {
    id: 21,
    category: 'CBT',
    tip: 'Use socratic questioning on a limiting belief: "Is this always true? Are there any exceptions? What would I tell a friend who thought this?"',
  },
  {
    id: 22,
    category: 'Mindfulness',
    tip: 'Set a "mindfulness bell" on your phone every 2 hours. When it sounds, take three conscious breaths and notice your current thoughts, feelings, and body state without judgment.',
  },
  {
    id: 23,
    category: 'CBT',
    tip: 'Identify your values and take one small action aligned with them today. Living consistently with your values reduces anxiety and boosts self-esteem.',
  },
  {
    id: 24,
    category: 'DBT',
    tip: 'Practice "Radical Acceptance" about one situation you cannot control: acknowledge reality exactly as it is, without judgment or resistance.',
  },
  {
    id: 25,
    category: 'CBT',
    tip: 'Reduce avoidance by gently approaching one thing you have been putting off. Avoidance maintains anxiety; approach breaks the cycle.',
  },
  {
    id: 26,
    category: 'DBT',
    tip: 'Notice and name your emotion without judgment: "I notice I am feeling anxious." Labelling emotions activates the prefrontal cortex and reduces emotional intensity.',
  },
  {
    id: 27,
    category: 'CBT',
    tip: 'Challenge mind-reading by checking your assumptions directly. When you assume someone is thinking negatively about you, consider alternative explanations.',
  },
  {
    id: 28,
    category: 'Mindfulness',
    tip: 'Take a five-minute "nature dose" today — walk outside, look at the sky, or tend a plant. Brief nature exposure measurably lowers cortisol levels.',
  },
  {
    id: 29,
    category: 'CBT',
    tip: 'Identify one strength you used this week, however small. Recognizing competencies counters negativity bias and builds resilience over time.',
  },
  {
    id: 30,
    category: 'DBT',
    tip: 'Practice "Turning the Mind": acceptance is a choice you may need to make multiple times. Each time you notice resistance, gently choose to turn toward acceptance again.',
  },
];

// ---------------------------------------------------------------------------
// 30 positive affirmations
// ---------------------------------------------------------------------------
const AFFIRMATIONS = [
  { id: 1,  text: 'I am worthy of love, care, and kindness — especially from myself.' },
  { id: 2,  text: 'My feelings are valid. I give myself permission to feel them fully.' },
  { id: 3,  text: 'I am doing the best I can with the tools I have right now.' },
  { id: 4,  text: 'Healing is not linear, and every small step forward matters.' },
  { id: 5,  text: 'I have the strength to face today, one moment at a time.' },
  { id: 6,  text: 'I deserve rest, recovery, and peace of mind.' },
  { id: 7,  text: 'My past does not define me. I am constantly growing and evolving.' },
  { id: 8,  text: 'It is okay to ask for help. Reaching out is an act of courage.' },
  { id: 9,  text: 'I trust my ability to navigate challenges and find my way through.' },
  { id: 10, text: 'I choose to release what I cannot control and focus on what I can.' },
  { id: 11, text: 'My mental health is a priority, not a luxury.' },
  { id: 12, text: 'I am not my anxiety, depression, or difficult thoughts. I am the observer.' },
  { id: 13, text: 'Every breath I take is a fresh start.' },
  { id: 14, text: 'I am resilient. I have survived every difficult day so far.' },
  { id: 15, text: 'Imperfection is not failure — it is proof that I am trying.' },
  { id: 16, text: 'I treat myself with the same compassion I would give a dear friend.' },
  { id: 17, text: 'Progress, not perfection, is what I celebrate today.' },
  { id: 18, text: 'I am allowed to set boundaries and honour my own needs.' },
  { id: 19, text: 'This feeling is temporary. I have the capacity to ride it out.' },
  { id: 20, text: 'I am not alone. Support is available, and I deserve to receive it.' },
  { id: 21, text: 'I bring value to the world simply by being who I am.' },
  { id: 22, text: 'Difficult emotions carry information, not permanent truths about me.' },
  { id: 23, text: 'I am open to growth, even when change feels uncomfortable.' },
  { id: 24, text: 'Today I will be gentle with myself and acknowledge how far I have come.' },
  { id: 25, text: 'I choose thoughts that nourish my wellbeing over thoughts that deplete it.' },
  { id: 26, text: 'I have everything I need within me to take the next small step.' },
  { id: 27, text: 'Resting and recovering is just as productive as doing.' },
  { id: 28, text: 'My story is still being written, and it is worth continuing.' },
  { id: 29, text: 'I deserve to take up space in this world exactly as I am.' },
  { id: 30, text: 'Each day I choose myself, I strengthen my foundation for healing.' },
];

// ---------------------------------------------------------------------------
// GET /api/wellness/tips  – return all tips or a random daily tip
// ---------------------------------------------------------------------------
router.get('/tips', (req, res) => {
  const { daily, category } = req.query;

  let result = TIPS;

  if (category) {
    result = result.filter(
      (t) => t.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (daily === 'true' || daily === '1') {
    // Deterministic "daily" tip based on the UTC date so all users get the same one each day
    const dayOfYear = getDayOfYear(new Date());
    const index = dayOfYear % result.length;
    return res.json(result[index]);
  }

  return res.json(result);
});

// ---------------------------------------------------------------------------
// GET /api/wellness/affirmations  – return all or one random / daily affirmation
// ---------------------------------------------------------------------------
router.get('/affirmations', (req, res) => {
  const { daily, random } = req.query;

  if (random === 'true' || random === '1') {
    const randomIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
    return res.json(AFFIRMATIONS[randomIndex]);
  }

  if (daily === 'true' || daily === '1') {
    const dayOfYear = getDayOfYear(new Date());
    const index = dayOfYear % AFFIRMATIONS.length;
    return res.json(AFFIRMATIONS[index]);
  }

  return res.json(AFFIRMATIONS);
});

// ---------------------------------------------------------------------------
// Util
// ---------------------------------------------------------------------------
function getDayOfYear(date) {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

module.exports = router;
