let bible = {}; // Loaded KJV
const topics = {
    anger: {
        synonyms: ['angry', 'wrath', 'mad', 'furious', 'rage'],
        verses: ['Psalms 37:8', 'Proverbs 14:29', 'James 1:20', 'Ephesians 4:26', 'Proverbs 15:1'],
        guidance: {
            kid: "When you feel mad, take a deep breath and ask God to help you calm down.",
            teen: "Anger is normal, but don't let it make you sin. Talk it out with a friend or pray.",
            adult: "Control your wrath, as it doesn't lead to righteousness. Seek peace quickly.",
            pastor: "Use these verses to teach on managing anger in sermons; emphasize forgiveness and self-control."
        }
    },
    fear: {
        synonyms: ['afraid', 'anxious', 'worried', 'scared', 'panic'],
        verses: ['Isaiah 41:10', '2 Timothy 1:7', '1 John 4:18', 'Psalms 34:4', 'Proverbs 29:25'],
        guidance: {
            kid: "God is with you, so don't be scared. He's like a big hug!",
            teen: "Fear can feel big, but God gives power and love. Trust Him.",
            adult: "Cast out fear with perfect love; God hasn't given a spirit of fear.",
            pastor: "Preach on fear as a snare; use these for counseling anxious congregants."
        }
    }
    // Add more topics later like grief, lust, discipline, leadership
};

async function loadBible() {
    const response = await fetch('kjv.json');
    bible = await response.json();
}

function normalizeInput(input) {
    return input.toLowerCase().trim();
}

function parseQuery(input) {
    const normalized = normalizeInput(input);
    if (normalized.includes('john 3:16') || normalized.match(/\d+:\d+/)) {
        return { intent: 'reference', payload: normalized };
    }
    return { intent: 'keyword', payload: normalized };
}

function executeQuery(parsed) {
    // Simple placeholder - expand later
    return { verses: [{ref: "John 3:16", text: "For God so loved the world..."}] };
}

function renderResults(results) {
    document.getElementById('output').innerHTML = '<div class="verse-card"><strong>Sample:</strong> ' + (results.verses[0]?.text || 'No results') + '</div>';
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadBible();
    document.getElementById('search-btn').addEventListener('click', () => {
        const input = document.getElementById('query').value;
        const parsed = parseQuery(input);
        const results = executeQuery(parsed);
        renderResults(results);
    });
});
