import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import ContactMessage from '../models/ContactMessage.js';
import Invitation from '../models/Invitation.js';
import Order from '../models/Order.js';
import RSVP from '../models/RSVP.js';
import Template from '../models/Template.js';
import User from '../models/User.js';

dotenv.config();

const svgData = (title, tone) => {
  const encoded = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="#fffaf2"/>
          <stop offset="0.55" stop-color="#fff1d9"/>
          <stop offset="1" stop-color="${tone}"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#g)"/>
      <circle cx="1000" cy="150" r="180" fill="#ffffff" opacity=".45"/>
      <circle cx="170" cy="680" r="210" fill="#c59b5f" opacity=".12"/>
      <rect x="170" y="130" width="860" height="540" rx="36" fill="#ffffff" opacity=".72"/>
      <text x="600" y="365" text-anchor="middle" font-family="Georgia, serif" font-size="64" fill="#6f4b2d">${title}</text>
      <text x="600" y="430" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#8a6b4c">Digital invitation template</text>
    </svg>
  `);
  return `data:image/svg+xml;charset=UTF-8,${encoded}`;
};

const templates = [
  ['Rose Garden', 'wedding', 29000, '#f6d7cf'],
  ['Pearl Vows', 'wedding', 35000, '#ead6b7'],
  ['Little Blessing', 'baptism', 24000, '#d9e8df'],
  ['Soft Cross', 'baptism', 26000, '#e7ddff'],
  ['First Candle', 'birth', 22000, '#fde0b5'],
  ['Baby Bloom', 'birth', 25000, '#f7cddd'],
  ['Golden Summit', 'corporate', 32000, '#e4d3b0'],
  ['Executive Toast', 'corporate', 38000, '#d7e2e8'],
  ['Promise Day', 'engagement', 27000, '#ffd8cb'],
  ['Amber Rings', 'engagement', 31000, '#f0c878']
].map(([title, category, price, tone], index) => ({
  title,
  slug: title.toLowerCase().replaceAll(' ', '-'),
  category,
  price,
  description: 'A refined digital invitation with elegant sections, RSVP support, gallery, map link, and mobile-friendly layout.',
  features: ['Responsive invitation page', 'RSVP form', 'Map button', 'Gallery section', 'Calendar-ready event details'],
  mainImage: svgData(title, tone),
  gallery: [svgData(`${title} I`, tone), svgData(`${title} II`, tone)],
  isFeatured: index < 6
}));

const run = async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany(),
    Template.deleteMany(),
    Order.deleteMany(),
    Invitation.deleteMany(),
    RSVP.deleteMany(),
    ContactMessage.deleteMany()
  ]);
  await User.create({
    name: 'Admin',
    email: 'admin@einvite.local',
    password: 'Admin123!',
    role: 'admin'
  });
  const createdTemplates = await Template.insertMany(templates);
  await Invitation.create({
    slug: 'sample-rose',
    templateId: createdTemplates[0]._id,
    eventType: 'wedding',
    names: 'Aram & Lilit',
    date: new Date('2026-09-14T18:00:00.000Z'),
    time: '18:00',
    location: 'Elegant Hall, Yerevan',
    mapLink: 'https://maps.google.com',
    message: 'Together with our families, we invite you to share a warm evening of love, music, and celebration.',
    gallery: createdTemplates[0].gallery,
    language: 'en',
    isPublished: true
  });
  console.log('Seed complete');
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
