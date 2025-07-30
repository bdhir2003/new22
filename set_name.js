// Simple script to set the hero name to Mamello Makhele
console.log('Setting hero name to Mamello Makhele...');

// Get existing data or create new
let portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '{}');

// Set hero name
if (!portfolioData.hero) portfolioData.hero = {};
portfolioData.hero.name = 'Mamello Makhele';

// Set personal name too
if (!portfolioData.personal) portfolioData.personal = {};
portfolioData.personal.fullName = 'Mamello Makhele';

// Save back to localStorage
localStorage.setItem('portfolioData', JSON.stringify(portfolioData));

console.log('Name set successfully!');
console.log('Hero name:', portfolioData.hero.name);
console.log('Full name:', portfolioData.personal.fullName);
