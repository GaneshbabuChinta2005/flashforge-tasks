const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
    { text: "You learn more from failure than from success.", author: "Unknown" },
    { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
    { text: "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you.", author: "Steve Jobs" }
];

let currentQuote = quotes[0];

function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    currentQuote = quotes[randomIndex];
    displayQuote();
}

function displayQuote() {
    const quoteText = document.getElementById('quote');
    const quoteAuthor = document.getElementById('author');

    // Add fade out effect
    quoteText.style.opacity = '0';
    quoteAuthor.style.opacity = '0';

    setTimeout(() => {
        quoteText.textContent = `"${currentQuote.text}"`;
        quoteAuthor.textContent = `— ${currentQuote.author}`;

        // Fade in
        quoteText.style.opacity = '1';
        quoteAuthor.style.opacity = '1';
    }, 300);
}

function copyQuote() {
    const quoteText = `"${currentQuote.text}" — ${currentQuote.author}`;
    navigator.clipboard.writeText(quoteText).then(() => {
        const btn = document.getElementById('copy-quote');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    });
}

function tweetQuote() {
    const quoteText = `"${currentQuote.text}" — ${currentQuote.author}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quoteText)}`;
    window.open(twitterUrl, '_blank');
}

// Event listeners
document.getElementById('new-quote').addEventListener('click', getRandomQuote);
document.getElementById('copy-quote').addEventListener('click', copyQuote);
document.getElementById('tweet-quote').addEventListener('click', tweetQuote);

// Add smooth transitions
const style = document.createElement('style');
style.textContent = `
    #quote, #author {
        transition: opacity 0.3s ease-in-out;
    }
`;
document.head.appendChild(style);

// Initialize with first quote
displayQuote();