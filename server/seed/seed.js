import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import ContactMessage from '../models/ContactMessage.js';
import Invitation from '../models/Invitation.js';
import Order from '../models/Order.js';
import RSVP from '../models/RSVP.js';
import Template from '../models/Template.js';
import User from '../models/User.js';

dotenv.config();

const templates = [
  {
    title: 'Midnight Vows Fullscreen',
    slug: 'midnight-vows-fullscreen',
    category: 'wedding',
    price: 35000,
    description: 'Fullscreen wedding invitation with music, RSVP, map links, animated text, and responsive design.',
    features: ['Fullscreen responsive invitation', 'Music button', 'RSVP form', 'Map buttons', 'Custom colors'],
    designKey: 'midnight-vows',
    mainImage: 'asset:occasion/midnight-vows-default.jpg',
    gallery: ['asset:occasion/midnight-vows-default.jpg'],
    galleryConfigured: false,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Baptism Blessing',
    slug: 'baptism-blessing',
    category: 'baptism',
    price: 29000,
    description: 'Elegant baptism invitation with animated envelope opening, music, countdown, RSVP, and map links.',
    features: ['Animated envelope opening', 'Countdown', 'Music button', 'RSVP form', 'Map buttons', 'Responsive layout'],
    designKey: 'baptism-blessing',
    mainImage: 'asset:baptism/baptism-envelope.png',
    gallery: [
      'asset:baptism/baptism-envelope.png',
      'asset:baptism/baptism-baby-church.png',
      'asset:baptism/baptism-family.png',
      'asset:baptism/baptism-cross.png',
      'asset:baptism/baptism-candle.png',
      'asset:baptism/baptism-church-icon.png',
      'asset:baptism/baptism-angel.png',
      'asset:baptism/baptism-dove.png'
    ],
    galleryConfigured: false,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Engagement Serenade',
    slug: 'engagement-serenade',
    category: 'engagement',
    price: 29000,
    description: 'Romantic fullscreen engagement invitation with Armenian script, John Legend music, smooth photo transitions, RSVP, and map links.',
    features: ['Fullscreen photo transitions', 'Custom Armenian font', 'Music button', 'RSVP form', 'Map buttons', 'Responsive layout'],
    designKey: 'engagement-serenade',
    mainImage: 'asset:morph/wedding-sunset.jpg',
    gallery: [
      'asset:morph/wedding-sunset.jpg',
      'asset:morph/engagement-smile.jpg',
      'asset:morph/engagement-hand.jpg',
      'asset:morph/engagement-ring.jpg',
      'asset:morph/engagement-roses.jpg',
      'asset:morph/engagement-bouquet-red.jpg',
      'asset:morph/engagement-chandelier.jpg'
    ],
    galleryConfigured: false,
    isFeatured: true,
    isActive: true
  }
];

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
    role: 'super_admin',
    isEmailVerified: true
  });
  const createdTemplates = await Template.insertMany(templates);
  await Invitation.create({
    slug: 'sample-midnight-vows',
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
