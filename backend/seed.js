const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Club = require('./models/Club');
const Event = require('./models/Event');
const Registration = require('./models/Registration');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB...');

  // Clear existing data
  await User.deleteMany();
  await Club.deleteMany();
  await Event.deleteMany();
  await Registration.deleteMany();
  console.log('Cleared existing data');

  // Create clubs
  const clubs = await Club.create([
    { name: 'Tech Club', description: 'Coding, hackathons, and tech workshops for engineering enthusiasts.' },
    { name: 'Sports Club', description: 'Football, cricket, basketball and all sports activities on campus.' },
    { name: 'Cultural Club', description: 'Dance, music, drama and all cultural activities throughout the year.' },
    { name: 'Science Club', description: 'Science exhibitions, experiments and research activities.' },
  ]);
  console.log(`Created ${clubs.length} clubs`);

  const techClub = clubs[0];
  const sportsClub = clubs[1];
  const culturalClub = clubs[2];
  const scienceClub = clubs[3];

  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@campus.edu',
    password: 'admin123',
    role: 'admin'
  });

  // Create organizers
  const techOrganizer = await User.create({
    name: 'Ravi Kumar',
    email: 'ravi@campus.edu',
    password: 'organizer123',
    role: 'organizer',
    club: techClub._id
  });

  const sportsOrganizer = await User.create({
    name: 'Priya Sharma',
    email: 'priya@campus.edu',
    password: 'organizer123',
    role: 'organizer',
    club: sportsClub._id
  });

  const culturalOrganizer = await User.create({
    name: 'Anita Singh',
    email: 'anita@campus.edu',
    password: 'organizer123',
    role: 'organizer',
    club: culturalClub._id
  });

  // Create students
  const student1 = await User.create({
    name: 'Arjun Mehta',
    email: 'arjun@campus.edu',
    password: 'student123',
    role: 'student',
    rollNo: 'CS2021001',
    className: 'B.Tech CSE',
    section: 'A'
  });

  const student2 = await User.create({
    name: 'Sneha Patel',
    email: 'sneha@campus.edu',
    password: 'student123',
    role: 'student',
    rollNo: 'CS2021002',
    className: 'B.Tech CSE',
    section: 'B'
  });

  const student3 = await User.create({
    name: 'Rahul Das',
    email: 'rahul@campus.edu',
    password: 'student123',
    role: 'student',
    rollNo: 'ME2021010',
    className: 'B.Tech ME',
    section: 'A'
  });

  console.log('Created users');

  // Create events with different statuses
  const events = await Event.create([
    {
      title: 'National Level Hackathon 2024',
      description: 'A 24-hour hackathon for all engineering students. Build innovative solutions to real-world problems. Top teams get cash prizes and internship opportunities.',
      date: new Date('2024-08-15'),
      club: techClub._id,
      status: 'approved',
      budget: 50000,
      venue: 'Main Auditorium, Block A',
      createdBy: student1._id,
      maxParticipants: 200,
      registrationFee: 200
    },
    {
      title: 'Web Development Bootcamp',
      description: '3-day intensive bootcamp covering HTML, CSS, JavaScript, React and Node.js. Certificate provided to all participants.',
      date: new Date('2024-09-05'),
      club: techClub._id,
      status: 'approved',
      budget: 15000,
      venue: 'CS Lab 3, Block B',
      createdBy: student1._id,
      maxParticipants: 60,
      registrationFee: 100
    },
    {
      title: 'Inter-College Cricket Tournament',
      description: 'Annual inter-college cricket tournament. Teams from 8 colleges competing for the championship trophy.',
      date: new Date('2024-08-20'),
      club: sportsClub._id,
      status: 'approved',
      budget: 30000,
      venue: 'College Cricket Ground',
      createdBy: student2._id,
      maxParticipants: 150,
      registrationFee: 500
    },
    {
      title: 'Annual Cultural Fest - Utsav 2024',
      description: 'The biggest cultural event of the year. Dance, music, drama, fashion show and many more activities.',
      date: new Date('2024-10-01'),
      club: culturalClub._id,
      status: 'approved',
      budget: 100000,
      venue: 'Open Air Amphitheatre',
      createdBy: student3._id,
      maxParticipants: 500,
      registrationFee: 50
    },
    {
      title: 'AI & Machine Learning Workshop',
      description: 'Hands-on workshop on AI and ML fundamentals. Learn Python, TensorFlow and build your first ML model.',
      date: new Date('2024-09-20'),
      club: techClub._id,
      status: 'forwarded_to_admin',
      createdBy: student1._id,
      maxParticipants: 80,
      registrationFee: 150
    },
    {
      title: 'Basketball Championship',
      description: 'Intra-college basketball championship. Open for all students. Register your team of 5.',
      date: new Date('2024-09-10'),
      club: sportsClub._id,
      status: 'submitted',
      createdBy: student2._id,
      maxParticipants: 100,
      registrationFee: 300
    },
    {
      title: 'Classical Dance Competition',
      description: 'Solo and group classical dance competition. Categories: Bharatanatyam, Kathak, Kuchipudi.',
      date: new Date('2024-10-15'),
      club: culturalClub._id,
      status: 'submitted',
      createdBy: student3._id,
      maxParticipants: 80,
      registrationFee: 100
    },
    {
      title: 'Cybersecurity Seminar',
      description: 'Expert talk on cybersecurity trends, ethical hacking and data protection. Free entry.',
      date: new Date('2024-09-25'),
      club: techClub._id,
      status: 'rejected',
      rejectionReason: 'Date conflicts with college exams. Please reschedule.',
      createdBy: student1._id,
      maxParticipants: 120,
      registrationFee: 0
    },
  ]);

  console.log(`Created ${events.length} events`);

  // Create registrations for approved events
  const hackathon = events[0];
  const webBootcamp = events[1];
  const cricket = events[2];

  await Registration.create([
    { user: student1._id, event: hackathon._id, paymentStatus: 'paid' },
    { user: student2._id, event: hackathon._id, paymentStatus: 'paid' },
    { user: student3._id, event: hackathon._id, paymentStatus: 'pending' },
    { user: student1._id, event: webBootcamp._id, paymentStatus: 'paid' },
    { user: student2._id, event: cricket._id, paymentStatus: 'paid' },
    { user: student3._id, event: cricket._id, paymentStatus: 'pending' },
  ]);

  console.log('Created registrations');

  console.log('\n✅ Seed completed successfully!\n');
  console.log('=== LOGIN CREDENTIALS ===');
  console.log('Admin:     admin@campus.edu     / admin123');
  console.log('Tech Org:  ravi@campus.edu      / organizer123');
  console.log('Sports Org: priya@campus.edu    / organizer123');
  console.log('Cultural Org: anita@campus.edu  / organizer123');
  console.log('Student 1: arjun@campus.edu     / student123');
  console.log('Student 2: sneha@campus.edu     / student123');
  console.log('Student 3: rahul@campus.edu     / student123');
  console.log('=========================\n');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
