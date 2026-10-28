export type AcademyProgramme = {
  durationMonths: 6 | 12;
  price: number;
  subtitle: string;
};

export type AcademyGalleryImage = {
  src: string;
  alt: string;
};

export type AcademyData = {
  admissionStatus: 'open' | 'closed';
  providerName: string;
  heroEyebrow: string;
  title: string;
  physicalTrainingBadge: string;
  admissionOpenBadge: string;
  admissionClosedBadge: string;
  intro: string;
  enquireButton: string;
  waitlistButton: string;
  viewProgrammesButton: string;
  whatsappMessagePrefix: string;
  enquiryMessage: string;
  waitlistMessage: string;
  learningEyebrow: string;
  learningHeading: string;
  learningOutcomes: string[];
  programmesEyebrow: string;
  programmesHeading: string;
  programmeEnquireButton: string;
  programmeDurationSuffix: string;
  programmeEnquiryDurationSuffix: string;
  programmeEnquiryMessageTemplate: string;
  programmes: AcademyProgramme[];
  feesNote: string;
  benefitsEyebrow: string;
  benefitsHeading: string;
  benefits: string[];
  noticeEyebrow: string;
  noticeHeading: string;
  equipmentNotice: string;
  trainingLocation: string;
  joiningEyebrow: string;
  joiningHeading: string;
  joiningSteps: string[];
  galleryEyebrow: string;
  galleryHeading: string;
  gallery: AcademyGalleryImage[];
  finalEyebrow: string;
  finalHeading: string;
};

export const academyData: AcademyData = {
  admissionStatus: 'open',
  providerName: 'The Ronkus Brand',
  heroEyebrow: 'The Ronkus Brand',
  title: 'Shoemaking Academy',
  physicalTrainingBadge: '100% Physical Training',
  admissionOpenBadge: 'Admission in Progress',
  admissionClosedBadge: 'Admission Closed',
  intro: 'A complete hands-on training for beginners who want to become skilled shoemakers and build a profitable footwear business.',
  enquireButton: 'Enquire on WhatsApp',
  waitlistButton: 'Join the Waitlist on WhatsApp',
  viewProgrammesButton: 'View Programmes',
  whatsappMessagePrefix: 'Hello The Ronkus Brand, ',
  enquiryMessage: 'I would like to enquire about the Shoemaking Academy.',
  waitlistMessage: 'I would like to join the Shoemaking Academy waitlist.',
  learningEyebrow: 'Learn the craft and the business',
  learningHeading: 'What You Will Learn',
  learningOutcomes: [
    'Shoemaking from beginner to professional',
    'Branding & Marketing',
    'Product Photography',
    'Customer relationship management',
    'Business management',
    'And lots more!',
  ],
  programmesEyebrow: 'Choose your learning path',
  programmesHeading: 'Programmes',
  programmeEnquireButton: 'Enquire about this programme',
  programmeDurationSuffix: 'Months',
  programmeEnquiryDurationSuffix: '-month',
  programmeEnquiryMessageTemplate: 'I would like to enquire about the {durationMonths} Shoemaking Academy programme.',
  programmes: [
    {
      durationMonths: 6,
      price: 300000,
      subtitle: 'Foundation to Intermediate Shoemaking Skills',
    },
    {
      durationMonths: 12,
      price: 500000,
      subtitle: 'Professional Shoemaking & Business Mastery',
    },
  ],
  feesNote: 'Fees shown as advertised. Message us on WhatsApp to confirm the current intake and payment options.',
  benefitsEyebrow: 'Support for your next step',
  benefitsHeading: 'What You Will Get',
  benefits: [
    'Certificate of completion',
    'Practical hands-on training',
    'Business & Branding sessions',
    'Lifetime access to alumni community',
    'Mentorship support after graduation',
  ],
  noticeEyebrow: 'Please note',
  noticeHeading: 'Good to Know',
  equipmentNotice: 'Training tools and equipment are not included. A recommended list will be provided upon admission.',
  trainingLocation: 'Training takes place in person in Ile-Ife, Osun State.',
  joiningEyebrow: 'Your journey starts here',
  joiningHeading: 'How to Join',
  joiningSteps: [
    'Message us on WhatsApp',
    'We confirm admission details and share your recommended tools list',
    'Begin your hands-on training',
  ],
  galleryEyebrow: 'Inside the workshop',
  galleryHeading: 'Photo Gallery',
  gallery: [],
  finalEyebrow: 'Take the next step',
  finalHeading: 'Ready to build your craft?',
};
