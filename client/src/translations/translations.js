export const languages = [
  { code: 'hy', label: 'Հայերեն' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' }
];

const common = {
  brand: 'Amulet',
  contactPhoneValue: '+374 77 805 607',
  contactEmailValue: 'hello@amulet.local',
  contactAddressValue: 'Yerevan, Armenia',
  contactInstagramValue: '@amulet.placeholder',
  phoneWeddingDate: '26.08.26',
  phoneCorporate: 'AMULET'
};

const en = {
  ...common,
  home: 'Home',
  templates: 'Invitations',
  about: 'About',
  contact: 'Contact',
  orderNow: 'Order',
  viewTemplates: 'View invitations',
  orderCustom: 'Order custom invitation',
  heroTitle: '1 invitation instead of 1000 calls',
  heroDevice: 'Wedding invitation',
  heroRsvp: 'RSVP',
  hashtags: ['# Web invitations', '# Wedding', '# Baptism', '# Birthday'],
  storiesKicker: 'Welcome to Amulet',
  storiesTitle: 'Every celebration begins with a beautiful invitation',

  viewAllStories: 'View all stories',
  invitationGallery: 'Invitation gallery',
  morphTitle: 'Your story begins with the right invitation',
  eventsKicker: 'Events',
  eventsTitle: 'Choose the invitation for your event',
  featured: 'Featured invitations',
  faq: 'FAQ',
  faqTitle: 'Frequently Asked Questions',
  roadmapTitle: 'How to use',
  roadmapSteps: [
    { title: 'Find your event style', text: 'Start from the category that matches your celebration: wedding, baptism, birthday, engagement, or corporate event.' },
    { title: 'Preview it on a phone', text: 'Open a template and see how the digital invitation will feel on a guest mobile screen.' },
    { title: 'Place the order', text: 'Fill in names, date, time, location, map link, photos, and the message for your guests.' },
    { title: 'We build your invitation', text: 'The Amulet team turns your details into a polished online invitation with gallery, map, countdown, and RSVP.' },
    { title: 'Approve the final version', text: 'Check the prepared link, request final edits if needed, and confirm the invitation before it goes live.' },
    { title: 'Send one beautiful link', text: 'Share the invitation through WhatsApp, Viber, Telegram, email, Instagram, or any other channel.' },
    { title: 'Collect guest replies', text: 'Guests submit RSVP answers from the invitation page, so attendance stays organized.' }
  ],
  eventTestimonials: [
    { name: 'Wedding and engagement', designation: 'Wedding / Engagement', quote: 'Wedding, engagement, and love stories begin with a carefully chosen invitation.', image: 'wedding' },
    { name: 'Baptism', designation: 'Baptism', quote: 'A warm digital invitation for a sacred day that family and guests will remember.', image: 'baptism' },
    { name: 'Birthday', designation: 'Birthday', quote: 'Bright, personal invitations for birthdays that feel festive before the party starts.', image: 'birth' },
    { name: 'Corporate', designation: 'Corporate event', quote: 'Send a polished invitation, save time, and keep every guest detail in one flow.', image: 'corporate' },
    { name: 'Partners', designation: 'Event partners', quote: 'A refined presentation for partners, venues, decorators, and event teams.', image: 'partners' }
  ],
  chooseInvitation: 'Choose invitation',
  menuPartners: 'For partners',
  menuPrivacy: 'Privacy policy',
  menuLogin: 'Login',
  partnerTitle: 'For partners',
  partnerSubtitle: 'How to become a partner',
  partnerLogin: 'Enter',
  wedding: 'Wedding',
  baptism: 'Baptism',
  birth: 'Birthday',
  corporate: 'Corporate',
  engagement: 'Engagement',
  weddingTitle: 'Wedding and engagement',
  weddingSubtitle: 'The most precious moments begin with an invitation',
  baptismTitle: 'Baptism',
  baptismSubtitle: 'Send an invitation that will be remembered',
  birthTitle: 'Birthday',
  birthSubtitle: 'Stand out from everyone',
  corporateTitle: 'Corporate',
  corporateSubtitle: 'Save your time',
  phoneWeddingNames: 'Aram & Lilit',
  phoneBaptismName: 'Narek',
  phoneBlessedDay: 'Blessed day',
  phoneBirthday: 'Happy Birthday',
  search: 'Search',
  sort: 'Sort',
  newest: 'Newest',
  priceAsc: 'Price low to high',
  priceDesc: 'Price high to low',
  all: 'All',
  preview: 'Preview',
  order: 'Order',
  livePreview: 'Live preview',
  orderThis: 'Order this invitation',
  features: 'Features',
  gallery: 'Gallery',
  fullName: 'Full name',
  phone: 'Phone number',
  email: 'Email',
  eventType: 'Event type',
  selectedTemplate: 'Selected invitation',
  eventDate: 'Event date',
  eventTime: 'Event time',
  eventLocation: 'Event location',
  mapLink: 'Google Maps link',
  mainNames: 'Main names',
  eventMessage: 'Invitation text',
  preferredLanguage: 'Preferred language',
  notes: 'Additional notes',
  submit: 'Submit',
  successOrder: 'Your order was sent successfully.',
  orderErrorDetails: 'Please check the required fields and try again.',
  orderConnectionError: 'Could not connect to the server. Please restart the server and try again.',
  checkoutError: 'Could not open payment. Please try again.',
  invitationPrice: 'Invitation price',
  paymentSuccessTitle: 'Payment completed',
  paymentSuccessText: 'Your online invitation is ready and saved in your profile.',
  paymentSuccessErrorTitle: 'Payment confirmation failed',
  paymentSuccessErrorText: 'We could not confirm this payment. Please open your profile or try again.',
  successContact: 'Your message was sent successfully.',
  successContactDetails: 'Thank you for reaching out. We will review your request and reply to your email soon.',
  rsvp: 'RSVP',
  guestName: 'Guest name',
  attendance: 'Attendance',
  attending: 'I will attend',
  declined: 'I cannot attend',
  unsure: 'I am not sure',
  guestCount: 'Number of guests',
  message: 'Message',
  openMap: 'Open map',
  share: 'Share invitation',
  addCalendar: 'Add to calendar',
  login: 'Login',
  password: 'Password',
  dashboard: 'Dashboard',
  logout: 'Logout',
  loading: 'Loading...',
  error: 'Something went wrong',
  required: 'Please fill required fields',
  customDesign: 'Custom design',
  catalogIntro: 'Browse original designs and choose a starting point for your event.',
  orderIntro: 'Send the event details and our team will prepare a personalized online invitation.',
  contactIntro: 'Tell us what you are planning and we will help shape the invitation.',
  aboutTitle: 'About Amulet',
  aboutIntro: 'A modern platform for online invitations.',
  aboutP1: 'Amulet is a modern online invitation platform created to make the important and memorable days of your life more beautiful and unique.',
  aboutP2: 'Through our platform, you can choose a ready-made design, personalize the invitation, add all event information, and easily send it to your guests. Amulet is designed for weddings, engagements, baptisms, birthdays, corporate events, and other important occasions.',
  aboutP3: 'We combine refined design, modern technology, and ease of use to create invitations that not only inform guests about the event, but also convey its mood and story.',
  aboutParagraphs: [
    'Amulet is a modern online invitation platform created to make the important and memorable days of your life more beautiful and unique.',
    'Through our platform, you can choose a ready-made design, personalize the invitation, add all event information, and easily send it to your guests. Amulet is designed for weddings, engagements, baptisms, birthdays, corporate events, and other important occasions.',
    'We combine refined design, modern technology, and ease of use to create invitations that not only inform guests about the event, but also convey its mood and story.',
    'Our goal is to help you save time, reduce printing costs, and create an invitation that will remain in your and your guests’ memory for a long time.'
  ],
  aboutSignature: 'Amulet — the first beautiful step of your memorable day.',
  aboutBenefitsTitle: 'Why choose Amulet',
  aboutBenefits: [
    'Modern and refined designs',
    'Wide personalization options',
    'Comfortable viewing on all devices',
    'Online RSVP confirmation from guests',
    'Fast and simple sharing through a link',
    'Multilingual invitation options',
    'Personal approach and technical support'
  ],
  aboutCompanyCredit: 'Amulet was created by R’SOFT Development Company with love, attention to detail, and the desire to make every event unique.',
  contactName: 'Name',
  footerText: 'Digital invitations with RSVP, maps, galleries, and personal details.',
  daysToGo: 'days to go',
  rsvpSaved: 'Thank you. Your RSVP was saved.',
  faqItems: [
    ['What is included in the price?', 'Photos, event schedule, addresses, map, RSVP form, countdown, and all required texts.'],
    ['How many days does preparation take?', 'Usually 3-4 days. Custom designs may take longer depending on complexity.'],
    ['How can I send the web invitation?', 'You can share it via WhatsApp, Instagram, Viber, Telegram, Email, SMS, or any other platform.'],
    ['What languages are available?', 'Invitations can be prepared in Armenian, English, Russian, and other languages.']
  ]
};

const hy = {
  ...en,
  home: 'Գլխավոր',
  templates: 'Հրավերներ',
  about: 'Մեր մասին',
  contact: 'Կապ',
  orderNow: 'Պատվիրել',
  viewTemplates: 'Դիտել հրավերները',
  orderCustom: 'Պատվիրել անհատական հրավեր',
  heroTitle: '1 հրավեր՝ 1000 զանգի փոխարեն',
  heroDevice: 'Հարսանեկան հրավեր',
  hashtags: ['# Վեբ հրավիրատոմսեր', '# Հարսանիք', '# Մկրտություն', '# Ծնունդ'],
  storiesKicker: 'Բարի գալուստ Ամուլետ',
  storiesTitle: 'Յուրաքանչյուր տոն սկսվում է գեղեցիկ հրավերից',
  viewAllStories: 'Դիտել բոլոր պատմությունները',
  invitationGallery: 'Հրավերների պատկերասրահ',
  morphTitle: 'Քո պատմությունը սկսվում է ճիշտ հրավերից',
  eventsKicker: 'Միջոցառումներ',
  eventsTitle: 'Ընտրիր քո միջոցառման հրավերը',
  featured: 'Ընտրված հրավերներ',
  faq: 'Հարցեր',
  faqTitle: 'Հաճախ տրվող հարցեր',
  roadmapTitle: 'Ինչպե՞ս օգտվել',
  roadmapSteps: [
    { title: 'Գտիր քո միջոցառման ոճը', text: 'Սկսիր այն բաժնից, որը համապատասխանում է քո օրվան՝ հարսանիք, մկրտություն, ծնունդ, նշանադրություն կամ կորպորատիվ միջոցառում։' },
    { title: 'Դիտիր հեռախոսային preview-ը', text: 'Բացիր նախադիտումը եւ տես, թե հրավերը ինչպես է երեւալու հյուրի հեռախոսում։' },
    { title: 'Լրացրու պատվերի տվյալները', text: 'Գրիր անունները, օրը, ժամը, վայրը, քարտեզի հղումը, նկարները եւ հյուրերին փոխանցվող հիմնական տեքստը։' },
    { title: 'Մենք ձեւավորում ենք հրավերը', text: 'Amulet-ի թիմը քո տվյալներով պատրաստում է առցանց հրավեր՝ պատկերասրահով, քարտեզով, հետհաշվարկով եւ RSVP դաշտով։' },
    { title: 'Հաստատիր վերջնական տարբերակը', text: 'Դիտիր պատրաստի հղումը, անհրաժեշտության դեպքում խնդրիր վերջին փոփոխությունները եւ հաստատիր հրապարակումը։' },
    { title: 'Ուղարկիր մեկ գեղեցիկ հղում', text: 'Կիսվիր հրավերով WhatsApp-ով, Viber-ով, Telegram-ով, email-ով, Instagram-ով կամ ցանկացած այլ հարթակով։' },
    { title: 'Հավաքիր RSVP պատասխանները', text: 'Հյուրերը հրավերի էջից հաստատում են մասնակցությունը, իսկ դու ստանում ես պատասխանները ավելի կազմակերպված ձեւով։' }
  ],
  eventTestimonials: [
    { name: 'Հարսանեկան եւ նշանադրության', designation: 'Հարսանիք / Նշանադրություն', quote: 'Հարսանիք, նշանադրություն եւ սիրո պատմություն՝ ամենաթանկ ակնթարթները սկսվում են հրավերից։', image: 'wedding' },
    { name: 'Մկրտության', designation: 'Մկրտություն', quote: 'Սուրբ օրվա համար ջերմ թվային հրավեր, որը կմնա ընտանիքի եւ հյուրերի հիշողության մեջ։', image: 'baptism' },
    { name: 'Ծննդյան', designation: 'Ծնունդ', quote: 'Պայծառ եւ անհատական հրավերներ, որոնք տոնական տրամադրությունը սկսում են դեռ մինչեւ օրը։', image: 'birth' },
    { name: 'Կորպորատիվ', designation: 'Կորպորատիվ միջոցառում', quote: 'Ուղարկիր հստակ ու գեղեցիկ հրավեր, խնայիր ժամանակ եւ պահիր հյուրերի տվյալները մեկ հոսքում։', image: 'corporate' },
    { name: 'Գործընկերների համար', designation: 'Միջոցառման գործընկերներ', quote: 'Նրբաճաշակ ներկայացում սրահների, դեկորատորների, կազմակերպիչների եւ գործընկերների համար։', image: 'partners' }
  ],
  chooseInvitation: 'Ընտրել հրավեր',
  menuPartners: 'Գործընկերների համար',
  menuPrivacy: 'Գաղտնիության քաղաքականություն',
  menuLogin: 'Մուտք',
  partnerTitle: 'Գործընկերների համար',
  partnerSubtitle: 'Ինչպես դառնալ գործընկեր',
  partnerLogin: 'Մուտք',
  wedding: 'Հարսանիք',
  baptism: 'Մկրտություն',
  birth: 'Ծնունդ',
  corporate: 'Կորպորատիվ',
  engagement: 'Նշանադրություն',
  weddingTitle: 'Հարսանեկան եւ նշանադրության',
  weddingSubtitle: 'Ամենաթանկ ակնթարթները սկսվում են հրավերից',
  baptismTitle: 'Մկրտության',
  baptismSubtitle: 'Ուղարկիր հրավեր, որը չի մոռացվի',
  birthTitle: 'Ծննդյան',
  birthSubtitle: 'Տարբերվիր բոլորից',
  corporateTitle: 'Կորպորատիվ',
  corporateSubtitle: 'Խնայիր ժամանակդ',
  phoneWeddingNames: 'Արամ & Լիլիթ',
  phoneBaptismName: 'Նարեկ',
  phoneBlessedDay: 'Սուրբ օր',
  phoneBirthday: 'Ծնունդ',
  search: 'Փնտրել',
  sort: 'Դասավորել',
  newest: 'Նորերը',
  priceAsc: 'Գին՝ ցածրից բարձր',
  priceDesc: 'Գին՝ բարձրից ցածր',
  all: 'Բոլորը',
  preview: 'Դիտել',
  order: 'Պատվիրել',
  livePreview: 'Կենդանի դիտում',
  orderThis: 'Պատվիրել այս հրավերը',
  features: 'Հնարավորություններ',
  gallery: 'Պատկերասրահ',
  fullName: 'Անուն ազգանուն',
  phone: 'Հեռախոսահամար',
  email: 'Էլ. հասցե',
  eventType: 'Միջոցառման տեսակ',
  selectedTemplate: 'Ընտրված հրավեր',
  eventDate: 'Միջոցառման օր',
  eventTime: 'Ժամ',
  eventLocation: 'Վայր',
  mapLink: 'Google Maps հղում',
  mainNames: 'Գլխավոր անուններ',
  eventMessage: 'Հրավերի տեքստ',
  preferredLanguage: 'Նախընտրելի լեզու',
  notes: 'Լրացուցիչ նշումներ',
  submit: 'Ուղարկել',
  successOrder: 'Ձեր պատվերը հաջողությամբ ուղարկվեց։',
  orderErrorDetails: 'Խնդրում ենք ստուգել պարտադիր դաշտերը և կրկին փորձել։',
  orderConnectionError: 'Չհաջողվեց միանալ սերվերին։ Խնդրում ենք restart անել server-ը և կրկին փորձել։',
  checkoutError: 'Չհաջողվեց բացել վճարման էջը։ Խնդրում ենք կրկին փորձել։',
  invitationPrice: 'Հրավերի արժեքը',
  paymentSuccessTitle: 'Վճարումը հաջողվեց',
  paymentSuccessText: 'Ձեր օնլայն հրավերը պատրաստ է և պահպանվել է ձեր profile-ում։',
  paymentSuccessErrorTitle: 'Չհաջողվեց հաստատել վճարումը',
  paymentSuccessErrorText: 'Չկարողացանք հաստատել այս վճարումը։ Խնդրում ենք բացել profile-ը կամ կրկին փորձել։',
  successContact: 'Ձեր նամակը հաջողությամբ ուղարկվեց։',
  successContactDetails: 'Շնորհակալություն կապ հաստատելու համար։ Մենք կկարդանք ձեր նամակը և շուտով կպատասխանենք ձեր email-ին։',
  guestName: 'Հյուրի անունը',
  attendance: 'Մասնակցություն',
  attending: 'Կմասնակցեմ',
  declined: 'Չեմ կարող մասնակցել',
  unsure: 'Դեռ վստահ չեմ',
  guestCount: 'Հյուրերի քանակ',
  message: 'Հաղորդագրություն',
  openMap: 'Բացել քարտեզը',
  share: 'Կիսվել հրավերով',
  addCalendar: 'Ավելացնել օրացույցում',
  login: 'Մուտք',
  password: 'Գաղտնաբառ',
  dashboard: 'Վահանակ',
  logout: 'Ելք',
  loading: 'Բեռնվում է...',
  error: 'Ինչ-որ բան սխալ է',
  required: 'Խնդրում ենք լրացնել պարտադիր դաշտերը',
  customDesign: 'Անհատական դիզայն',
  catalogIntro: 'Դիտիր օրիգինալ դիզայնները եւ ընտրիր քո միջոցառման մեկնարկային տարբերակը։',
  orderIntro: 'Ուղարկիր միջոցառման տվյալները, եւ մեր թիմը կպատրաստի անհատական առցանց հրավեր։',
  contactIntro: 'Պատմիր, թե ինչ ես պլանավորում, եւ մենք կօգնենք ձեւավորել հրավերը։',
  aboutTitle: 'Amulet-ի մասին',
  aboutIntro: 'Օնլայն հրավիրատոմսերի ժամանակակից հարթակ։',
  aboutP1: 'Amulet-ը օնլայն հրավիրատոմսերի ժամանակակից հարթակ է, որը ստեղծվել է ձեր կյանքի կարևոր և հիշարժան օրերը ավելի գեղեցիկ ու յուրահատուկ դարձնելու համար։',
  aboutP2: 'Մեր հարթակի միջոցով կարող եք ընտրել պատրաստի դիզայն, անհատականացնել հրավիրատոմսը, ավելացնել միջոցառման ամբողջ տեղեկատվությունը և հեշտությամբ ուղարկել այն ձեր հյուրերին։ Amulet-ը նախատեսված է հարսանիքների, նշանադրությունների, մկրտությունների, ծննդյան տոների, կորպորատիվ միջոցառումների և այլ կարևոր առիթների համար։',
  aboutP3: 'Մենք համադրում ենք նրբաճաշակ դիզայնը, ժամանակակից տեխնոլոգիաներն ու օգտագործման պարզությունը՝ ստեղծելով հրավիրատոմսեր, որոնք ոչ միայն տեղեկացնում են միջոցառման մասին, այլև փոխանցում են դրա տրամադրությունն ու պատմությունը։',
  aboutParagraphs: [
    'Amulet-ը օնլայն հրավիրատոմսերի ժամանակակից հարթակ է, որը ստեղծվել է ձեր կյանքի կարևոր և հիշարժան օրերը ավելի գեղեցիկ ու յուրահատուկ դարձնելու համար։',
    'Մեր հարթակի միջոցով կարող եք ընտրել պատրաստի դիզայն, անհատականացնել հրավիրատոմսը, ավելացնել միջոցառման ամբողջ տեղեկատվությունը և հեշտությամբ ուղարկել այն ձեր հյուրերին։ Amulet-ը նախատեսված է հարսանիքների, նշանադրությունների, մկրտությունների, ծննդյան տոների, կորպորատիվ միջոցառումների և այլ կարևոր առիթների համար։',
    'Մենք համադրում ենք նրբաճաշակ դիզայնը, ժամանակակից տեխնոլոգիաներն ու օգտագործման պարզությունը՝ ստեղծելով հրավիրատոմսեր, որոնք ոչ միայն տեղեկացնում են միջոցառման մասին, այլև փոխանցում են դրա տրամադրությունն ու պատմությունը։',
    'Մեր նպատակն է օգնել ձեզ խնայել ժամանակը, նվազեցնել տպագրական ծախսերը և ստեղծել հրավիրատոմս, որը երկար կմնա ձեր և ձեր հյուրերի հիշողության մեջ։'
  ],
  aboutSignature: 'Amulet — ձեր հիշարժան օրվա առաջին գեղեցիկ քայլը։',
  aboutBenefitsTitle: 'Ինչո՞ւ ընտրել Amulet-ը',
  aboutBenefits: [
    'Ժամանակակից և նրբաճաշակ դիզայններ',
    'Անհատականացման լայն հնարավորություններ',
    'Հարմարավետ դիտում բոլոր սարքերից',
    'Հյուրերի մասնակցության առցանց հաստատում',
    'Արագ և պարզ տարածում հղման միջոցով',
    'Բազմալեզու հրավիրատոմսերի հնարավորություն',
    'Անհատական մոտեցում և տեխնիկական աջակցություն'
  ],
  aboutCompanyCredit: 'Amulet-ը ստեղծվել է R’SOFT Development Company-ի կողմից՝ սիրով, մանրուքների նկատմամբ ուշադրությամբ և յուրաքանչյուր միջոցառումը յուրահատուկ դարձնելու ցանկությամբ։',
  contactName: 'Անուն',
  footerText: 'Թվային հրավերներ՝ RSVP-ով, քարտեզներով, պատկերասրահով եւ անձնական մանրամասներով։',
  daysToGo: 'օր մնաց',
  rsvpSaved: 'Շնորհակալություն։ Ձեր RSVP-ն պահպանվեց։',
  faqItems: [
    ['Ինչ է ներառված արժեքի մեջ', 'Լուսանկարներ, միջոցառման ծրագիր, հասցեներ, քարտեզ, RSVP ձեւ, հետհաշվարկ եւ բոլոր անհրաժեշտ տեքստերը։'],
    ['Քանի օր է տեւում պատրաստումը', 'Սովորաբար 3-4 օր։ Անհատական դիզայնի դեպքում ժամկետը կախված է բարդությունից։'],
    ['Ինչպես կարող եմ ուղարկել վեբ հրավերը', 'Կարող եք կիսվել WhatsApp-ով, Instagram-ով, Viber-ով, Telegram-ով, Email-ով, SMS-ով կամ ցանկացած այլ հարթակով։'],
    ['Ինչ լեզուներ են հասանելի', 'Հրավերները կարող են պատրաստվել հայերեն, անգլերեն, ռուսերեն եւ այլ լեզուներով։']
  ]
};

const ru = {
  ...en,
  home: 'Главная',
  templates: 'Приглашения',
  about: 'О нас',
  contact: 'Контакты',
  orderNow: 'Заказать',
  viewTemplates: 'Смотреть приглашения',
  orderCustom: 'Заказать индивидуальное приглашение',
  heroTitle: '1 приглашение вместо 1000 звонков',
  heroDevice: 'Свадебное приглашение',
  hashtags: ['# Веб-приглашения', '# Свадьба', '# Крещение', '# День рождения'],
  storiesKicker: 'Добро пожаловать в Amulet',
  storiesTitle: 'Каждый праздник начинается с красивого приглашения',
  viewAllStories: 'Смотреть все истории',
  invitationGallery: 'Галерея приглашений',
  morphTitle: 'Твоя история начинается с правильного приглашения',
  eventsKicker: 'События',
  eventsTitle: 'Выбери приглашение для своего события',
  featured: 'Избранные приглашения',
  faq: 'Вопросы',
  faqTitle: 'Частые вопросы',
  roadmapTitle: 'Как пользоваться',
  roadmapSteps: [
    { title: 'Найди стиль события', text: 'Выбери категорию для свадьбы, крещения, дня рождения, помолвки или корпоративного события.' },
    { title: 'Посмотри на телефоне', text: 'Открой шаблон и увидь, как приглашение будет выглядеть на экране гостя.' },
    { title: 'Оформи заказ', text: 'Добавь имена, дату, время, место, ссылку на карту, фотографии и текст приглашения.' },
    { title: 'Мы создаем приглашение', text: 'Команда Amulet превращает данные в красивое онлайн-приглашение с галереей, картой, таймером и RSVP.' },
    { title: 'Подтверди финальную версию', text: 'Проверь готовую ссылку, попроси правки при необходимости и подтверди публикацию.' },
    { title: 'Отправь одну красивую ссылку', text: 'Делись приглашением через WhatsApp, Viber, Telegram, email, Instagram или любой другой канал.' },
    { title: 'Собирай ответы гостей', text: 'Гости отправляют RSVP прямо со страницы приглашения, а ответы остаются организованными.' }
  ],
  eventTestimonials: [
    { name: 'Свадьба и помолвка', designation: 'Свадьба / Помолвка', quote: 'Свадьба, помолвка и история любви начинаются с продуманного приглашения.', image: 'wedding' },
    { name: 'Крещение', designation: 'Крещение', quote: 'Теплое цифровое приглашение для святого дня, который запомнят семья и гости.', image: 'baptism' },
    { name: 'День рождения', designation: 'День рождения', quote: 'Яркие персональные приглашения создают настроение еще до начала праздника.', image: 'birth' },
    { name: 'Корпоратив', designation: 'Корпоративное событие', quote: 'Отправь аккуратное приглашение, сэкономь время и держи данные гостей в одном потоке.', image: 'corporate' },
    { name: 'Для партнеров', designation: 'Партнеры событий', quote: 'Элегантная подача для площадок, декораторов, организаторов и партнеров.', image: 'partners' }
  ],
  chooseInvitation: 'Выбрать приглашение',
  menuPartners: 'Для партнеров',
  menuPrivacy: 'Политика конфиденциальности',
  menuLogin: 'Вход',
  partnerTitle: 'Для партнеров',
  partnerSubtitle: 'Как стать партнером',
  wedding: 'Свадьба',
  baptism: 'Крещение',
  birth: 'День рождения',
  corporate: 'Корпоратив',
  engagement: 'Помолвка',
  weddingTitle: 'Свадьба и помолвка',
  weddingSubtitle: 'Самые ценные моменты начинаются с приглашения',
  baptismTitle: 'Крещение',
  baptismSubtitle: 'Отправь приглашение, которое запомнят',
  birthTitle: 'День рождения',
  birthSubtitle: 'Выделись среди всех',
  corporateTitle: 'Корпоратив',
  corporateSubtitle: 'Сэкономь свое время',
  phoneWeddingNames: 'Арам & Лилит',
  phoneBaptismName: 'Нарек',
  phoneBlessedDay: 'Святой день',
  phoneBirthday: 'День рождения'
};

const es = {
  ...en,
  home: 'Inicio',
  templates: 'Invitaciones',
  about: 'Nosotros',
  contact: 'Contacto',
  orderNow: 'Pedir',
  viewTemplates: 'Ver invitaciones',
  orderCustom: 'Pedir invitación personalizada',
  heroTitle: '1 invitación en lugar de 1000 llamadas',
  storiesKicker: 'Bienvenido a Amulet',
  storiesTitle: 'Cada celebración empieza con una invitación hermosa',
  viewAllStories: 'Ver todas las historias',
  invitationGallery: 'Galería de invitaciones',
  morphTitle: 'Tu historia empieza con la invitación correcta',
  eventsKicker: 'Eventos',
  eventsTitle: 'Elige la invitación para tu evento',
  featured: 'Invitaciones destacadas',
  faq: 'Preguntas',
  faqTitle: 'Preguntas frecuentes',
  roadmapTitle: 'Cómo funciona',
  chooseInvitation: 'Elegir invitación',
  menuPartners: 'Para socios',
  menuPrivacy: 'Política de privacidad',
  menuLogin: 'Entrar',
  wedding: 'Boda',
  baptism: 'Bautizo',
  birth: 'Cumpleaños',
  corporate: 'Corporativo',
  engagement: 'Compromiso',
  eventTestimonials: [
    { name: 'Boda y compromiso', designation: 'Boda / Compromiso', quote: 'Las bodas, compromisos e historias de amor empiezan con una invitación cuidada.', image: 'wedding' },
    { name: 'Bautizo', designation: 'Bautizo', quote: 'Una invitación digital cálida para un día sagrado e inolvidable.', image: 'baptism' },
    { name: 'Cumpleaños', designation: 'Cumpleaños', quote: 'Invitaciones personales y alegres que crean ambiente antes de la fiesta.', image: 'birth' },
    { name: 'Corporativo', designation: 'Evento corporativo', quote: 'Envía una invitación elegante, ahorra tiempo y organiza a tus invitados.', image: 'corporate' },
    { name: 'Socios', designation: 'Socios de eventos', quote: 'Una presentación refinada para espacios, decoradores, equipos y socios.', image: 'partners' }
  ]
};

const fr = {
  ...en,
  home: 'Accueil',
  templates: 'Invitations',
  about: 'À propos',
  contact: 'Contact',
  orderNow: 'Commander',
  viewTemplates: 'Voir les invitations',
  orderCustom: 'Commander une invitation sur mesure',
  heroTitle: '1 invitation au lieu de 1000 appels',
  storiesKicker: 'Bienvenue chez Amulet',
  storiesTitle: 'Chaque fête commence par une belle invitation',
  viewAllStories: 'Voir toutes les histoires',
  invitationGallery: 'Galerie d’invitations',
  morphTitle: 'Ton histoire commence par la bonne invitation',
  eventsKicker: 'Événements',
  eventsTitle: 'Choisis l’invitation pour ton événement',
  featured: 'Invitations sélectionnées',
  faq: 'Questions',
  faqTitle: 'Questions fréquentes',
  roadmapTitle: 'Comment ça marche',
  chooseInvitation: 'Choisir une invitation',
  menuPartners: 'Pour les partenaires',
  menuPrivacy: 'Politique de confidentialité',
  menuLogin: 'Connexion',
  wedding: 'Mariage',
  baptism: 'Baptême',
  birth: 'Anniversaire',
  corporate: 'Corporate',
  engagement: 'Fiançailles',
  eventTestimonials: [
    { name: 'Mariage et fiançailles', designation: 'Mariage / Fiançailles', quote: 'Les mariages, fiançailles et histoires d’amour commencent par une invitation soignée.', image: 'wedding' },
    { name: 'Baptême', designation: 'Baptême', quote: 'Une invitation digitale chaleureuse pour un jour sacré et mémorable.', image: 'baptism' },
    { name: 'Anniversaire', designation: 'Anniversaire', quote: 'Des invitations personnelles et joyeuses qui donnent le ton avant la fête.', image: 'birth' },
    { name: 'Corporate', designation: 'Événement corporate', quote: 'Envoie une invitation élégante, gagne du temps et organise tes invités.', image: 'corporate' },
    { name: 'Partenaires', designation: 'Partenaires événementiels', quote: 'Une présentation raffinée pour lieux, décorateurs, équipes et partenaires.', image: 'partners' }
  ]
};

const de = {
  ...en,
  home: 'Start',
  templates: 'Einladungen',
  about: 'Über uns',
  contact: 'Kontakt',
  orderNow: 'Bestellen',
  viewTemplates: 'Einladungen ansehen',
  orderCustom: 'Individuelle Einladung bestellen',
  heroTitle: '1 Einladung statt 1000 Anrufen',
  storiesKicker: 'Willkommen bei Amulet',
  storiesTitle: 'Jede Feier beginnt mit einer schönen Einladung',
  viewAllStories: 'Alle Geschichten ansehen',
  invitationGallery: 'Einladungsgalerie',
  morphTitle: 'Deine Geschichte beginnt mit der richtigen Einladung',
  eventsKicker: 'Events',
  eventsTitle: 'Wähle die Einladung für dein Event',
  featured: 'Ausgewählte Einladungen',
  faq: 'Fragen',
  faqTitle: 'Häufige Fragen',
  roadmapTitle: 'So funktioniert es',
  chooseInvitation: 'Einladung wählen',
  menuPartners: 'Für Partner',
  menuPrivacy: 'Datenschutz',
  menuLogin: 'Login',
  wedding: 'Hochzeit',
  baptism: 'Taufe',
  birth: 'Geburtstag',
  corporate: 'Corporate',
  engagement: 'Verlobung',
  eventTestimonials: [
    { name: 'Hochzeit und Verlobung', designation: 'Hochzeit / Verlobung', quote: 'Hochzeiten, Verlobungen und Liebesgeschichten beginnen mit einer passenden Einladung.', image: 'wedding' },
    { name: 'Taufe', designation: 'Taufe', quote: 'Eine warme digitale Einladung für einen heiligen und unvergesslichen Tag.', image: 'baptism' },
    { name: 'Geburtstag', designation: 'Geburtstag', quote: 'Persönliche und festliche Einladungen, die schon vor der Feier Stimmung machen.', image: 'birth' },
    { name: 'Corporate', designation: 'Firmenevent', quote: 'Sende eine elegante Einladung, spare Zeit und organisiere alle Gäste übersichtlich.', image: 'corporate' },
    { name: 'Partner', designation: 'Eventpartner', quote: 'Eine stilvolle Präsentation für Locations, Dekoration, Teams und Partner.', image: 'partners' }
  ]
};

const it = {
  ...en,
  home: 'Home',
  templates: 'Inviti',
  about: 'Chi siamo',
  contact: 'Contatti',
  orderNow: 'Ordina',
  viewTemplates: 'Vedi inviti',
  orderCustom: 'Ordina invito personalizzato',
  heroTitle: '1 invito invece di 1000 chiamate',
  storiesKicker: 'Benvenuto in Amulet',
  storiesTitle: 'Ogni festa inizia con un bellissimo invito',
  viewAllStories: 'Vedi tutte le storie',
  invitationGallery: 'Galleria inviti',
  morphTitle: 'La tua storia inizia con l’invito giusto',
  eventsKicker: 'Eventi',
  eventsTitle: 'Scegli l’invito per il tuo evento',
  featured: 'Inviti in evidenza',
  faq: 'Domande',
  faqTitle: 'Domande frequenti',
  roadmapTitle: 'Come funziona',
  chooseInvitation: 'Scegli invito',
  menuPartners: 'Per partner',
  menuPrivacy: 'Privacy policy',
  menuLogin: 'Accesso',
  wedding: 'Matrimonio',
  baptism: 'Battesimo',
  birth: 'Compleanno',
  corporate: 'Corporate',
  engagement: 'Fidanzamento',
  eventTestimonials: [
    { name: 'Matrimonio e fidanzamento', designation: 'Matrimonio / Fidanzamento', quote: 'Matrimoni, fidanzamenti e storie d’amore iniziano con un invito curato.', image: 'wedding' },
    { name: 'Battesimo', designation: 'Battesimo', quote: 'Un invito digitale caldo per un giorno sacro e memorabile.', image: 'baptism' },
    { name: 'Compleanno', designation: 'Compleanno', quote: 'Inviti personali e festosi che creano atmosfera prima della festa.', image: 'birth' },
    { name: 'Corporate', designation: 'Evento corporate', quote: 'Invia un invito elegante, risparmia tempo e organizza tutti gli ospiti.', image: 'corporate' },
    { name: 'Partner', designation: 'Partner eventi', quote: 'Una presentazione raffinata per location, decoratori, team e partner.', image: 'partners' }
  ]
};

Object.assign(ru, {
  search: 'Поиск',
  sort: 'Сортировка',
  newest: 'Новые',
  priceAsc: 'Цена по возрастанию',
  priceDesc: 'Цена по убыванию',
  all: 'Все',
  preview: 'Просмотр',
  order: 'Заказать',
  livePreview: 'Живой просмотр',
  orderThis: 'Заказать это приглашение',
  features: 'Возможности',
  gallery: 'Галерея',
  fullName: 'Имя и фамилия',
  phone: 'Телефон',
  email: 'Email',
  eventType: 'Тип события',
  selectedTemplate: 'Выбранное приглашение',
  eventDate: 'Дата события',
  eventTime: 'Время',
  eventLocation: 'Место',
  mapLink: 'Ссылка Google Maps',
  mainNames: 'Главные имена',
  eventMessage: 'Текст приглашения',
  preferredLanguage: 'Предпочитаемый язык',
  notes: 'Дополнительные заметки',
  submit: 'Отправить',
  successOrder: 'Ваш заказ успешно отправлен.',
  orderErrorDetails: 'Пожалуйста, проверьте обязательные поля и попробуйте снова.',
  orderConnectionError: 'Не удалось подключиться к серверу. Перезапустите сервер и попробуйте снова.',
  successContact: 'Ваше сообщение успешно отправлено.',
  successContactDetails: 'Спасибо за обращение. Мы прочитаем ваше сообщение и скоро ответим на ваш email.',
  rsvp: 'RSVP',
  guestName: 'Имя гостя',
  attendance: 'Участие',
  attending: 'Я приду',
  declined: 'Я не смогу прийти',
  unsure: 'Пока не уверен',
  guestCount: 'Количество гостей',
  message: 'Сообщение',
  openMap: 'Открыть карту',
  share: 'Поделиться приглашением',
  addCalendar: 'Добавить в календарь',
  login: 'Вход',
  password: 'Пароль',
  dashboard: 'Панель',
  logout: 'Выход',
  loading: 'Загрузка...',
  error: 'Что-то пошло не так',
  required: 'Заполните обязательные поля',
  customDesign: 'Индивидуальный дизайн',
  catalogIntro: 'Просмотрите оригинальные дизайны и выберите основу для своего события.',
  orderIntro: 'Отправьте детали события, и наша команда подготовит персональное онлайн-приглашение.',
  contactIntro: 'Расскажите, что вы планируете, и мы поможем оформить приглашение.',
  aboutTitle: 'Об Amulet',
  aboutIntro: 'Современная платформа для онлайн-приглашений.',
  aboutP1: 'Amulet — это современная платформа онлайн-приглашений, созданная для того, чтобы сделать важные и памятные дни вашей жизни более красивыми и особенными.',
  aboutP2: 'С помощью нашей платформы вы можете выбрать готовый дизайн, персонализировать приглашение, добавить всю информацию о мероприятии и легко отправить его гостям. Amulet подходит для свадеб, помолвок, крещений, дней рождения, корпоративных мероприятий и других важных поводов.',
  aboutP3: 'Мы объединяем изящный дизайн, современные технологии и простоту использования, создавая приглашения, которые не только сообщают о событии, но и передают его настроение и историю.',
  aboutParagraphs: [
    'Amulet — это современная платформа онлайн-приглашений, созданная для того, чтобы сделать важные и памятные дни вашей жизни более красивыми и особенными.',
    'С помощью нашей платформы вы можете выбрать готовый дизайн, персонализировать приглашение, добавить всю информацию о мероприятии и легко отправить его гостям. Amulet подходит для свадеб, помолвок, крещений, дней рождения, корпоративных мероприятий и других важных поводов.',
    'Мы объединяем изящный дизайн, современные технологии и простоту использования, создавая приглашения, которые не только сообщают о событии, но и передают его настроение и историю.',
    'Наша цель — помочь вам сэкономить время, сократить расходы на печать и создать приглашение, которое надолго останется в памяти у вас и ваших гостей.'
  ],
  aboutSignature: 'Amulet — первый красивый шаг вашего памятного дня.',
  aboutBenefitsTitle: 'Почему выбирают Amulet',
  aboutBenefits: [
    'Современные и изящные дизайны',
    'Широкие возможности персонализации',
    'Удобный просмотр на всех устройствах',
    'Онлайн-подтверждение участия гостей',
    'Быстрая и простая отправка по ссылке',
    'Возможность многоязычных приглашений',
    'Индивидуальный подход и техническая поддержка'
  ],
  aboutCompanyCredit: 'Amulet создан компанией R’SOFT Development Company с любовью, вниманием к деталям и желанием сделать каждое мероприятие уникальным.',
  contactName: 'Имя',
  footerText: 'Цифровые приглашения с RSVP, картами, галереями и личными деталями.',
  daysToGo: 'дней осталось',
  rsvpSaved: 'Спасибо. Ваш RSVP сохранен.',
  faqItems: [
    ['Что входит в стоимость?', 'Фотографии, программа события, адреса, карта, RSVP-форма, таймер и все нужные тексты.'],
    ['Сколько дней занимает подготовка?', 'Обычно 3-4 дня. Индивидуальный дизайн может занять больше времени.'],
    ['Как отправить веб-приглашение?', 'Им можно поделиться через WhatsApp, Instagram, Viber, Telegram, Email, SMS или любую другую платформу.'],
    ['Какие языки доступны?', 'Приглашения можно подготовить на армянском, английском, русском и других языках.']
  ]
});

Object.assign(es, {
  roadmapSteps: [
    { title: 'Encuentra el estilo de tu evento', text: 'Elige la categoría que corresponde a tu celebración: boda, bautizo, cumpleaños, compromiso o evento corporativo.' },
    { title: 'Míralo en el teléfono', text: 'Abre una plantilla y comprueba cómo se verá la invitación digital en la pantalla del invitado.' },
    { title: 'Realiza el pedido', text: 'Añade nombres, fecha, hora, lugar, mapa, fotos y el mensaje para tus invitados.' },
    { title: 'Creamos tu invitación', text: 'El equipo de Amulet convierte tus datos en una invitación online con galería, mapa, cuenta regresiva y RSVP.' },
    { title: 'Aprueba la versión final', text: 'Revisa el enlace preparado, solicita últimos cambios si hace falta y confirma la publicación.' },
    { title: 'Envía un enlace bonito', text: 'Comparte la invitación por WhatsApp, Viber, Telegram, email, Instagram o cualquier canal.' },
    { title: 'Recoge respuestas RSVP', text: 'Los invitados responden desde la página y la asistencia queda organizada.' }
  ],
  partnerTitle: 'Para socios', partnerSubtitle: 'Cómo ser socio', partnerLogin: 'Entrar',
  weddingTitle: 'Boda y compromiso', weddingSubtitle: 'Los momentos más valiosos empiezan con una invitación',
  baptismTitle: 'Bautizo', baptismSubtitle: 'Envía una invitación que será recordada',
  birthTitle: 'Cumpleaños', birthSubtitle: 'Destaca entre todos',
  corporateTitle: 'Corporativo', corporateSubtitle: 'Ahorra tiempo',
  phoneWeddingNames: 'Aram & Lilit', phoneBaptismName: 'Narek', phoneBlessedDay: 'Día santo', phoneBirthday: 'Cumpleaños',
  search: 'Buscar', sort: 'Ordenar', newest: 'Más nuevos', priceAsc: 'Precio menor a mayor', priceDesc: 'Precio mayor a menor', all: 'Todos',
  preview: 'Vista previa', order: 'Pedir', livePreview: 'Vista en vivo', orderThis: 'Pedir esta invitación', features: 'Funciones', gallery: 'Galería',
  fullName: 'Nombre completo', phone: 'Teléfono', email: 'Email', eventType: 'Tipo de evento', selectedTemplate: 'Invitación seleccionada',
  eventDate: 'Fecha del evento', eventTime: 'Hora', eventLocation: 'Lugar', mapLink: 'Enlace de Google Maps', mainNames: 'Nombres principales',
  eventMessage: 'Texto de invitación', preferredLanguage: 'Idioma preferido', notes: 'Notas adicionales', submit: 'Enviar',
  successOrder: 'Tu pedido se envió correctamente.', successContact: 'Tu mensaje se envió correctamente.', guestName: 'Nombre del invitado',
  attendance: 'Asistencia', attending: 'Asistiré', declined: 'No puedo asistir', unsure: 'No estoy seguro', guestCount: 'Número de invitados',
  message: 'Mensaje', openMap: 'Abrir mapa', share: 'Compartir invitación', addCalendar: 'Añadir al calendario',
  login: 'Entrar', password: 'Contraseña', dashboard: 'Panel', logout: 'Salir', loading: 'Cargando...', error: 'Algo salió mal',
  required: 'Completa los campos obligatorios', customDesign: 'Diseño personalizado',
  catalogIntro: 'Explora diseños originales y elige un punto de partida para tu evento.',
  orderIntro: 'Envía los detalles del evento y nuestro equipo preparará una invitación online personalizada.',
  contactIntro: 'Cuéntanos qué estás planeando y te ayudaremos a crear la invitación.',
  aboutTitle: 'Sobre Amulet', aboutIntro: 'Una plataforma moderna para invitaciones online.',
  aboutP1: 'Amulet es una plataforma moderna de invitaciones online creada para hacer que los días importantes y memorables de tu vida sean más bellos y únicos.',
  aboutP2: 'Con nuestra plataforma puedes elegir un diseño listo, personalizar la invitación, añadir toda la información del evento y enviarla fácilmente a tus invitados. Amulet está pensado para bodas, compromisos, bautizos, cumpleaños, eventos corporativos y otras ocasiones importantes.',
  aboutP3: 'Combinamos diseño refinado, tecnología moderna y facilidad de uso para crear invitaciones que no solo informan sobre el evento, sino que también transmiten su ambiente y su historia.',
  aboutParagraphs: [
    'Amulet es una plataforma moderna de invitaciones online creada para hacer que los días importantes y memorables de tu vida sean más bellos y únicos.',
    'Con nuestra plataforma puedes elegir un diseño listo, personalizar la invitación, añadir toda la información del evento y enviarla fácilmente a tus invitados. Amulet está pensado para bodas, compromisos, bautizos, cumpleaños, eventos corporativos y otras ocasiones importantes.',
    'Combinamos diseño refinado, tecnología moderna y facilidad de uso para crear invitaciones que no solo informan sobre el evento, sino que también transmiten su ambiente y su historia.',
    'Nuestro objetivo es ayudarte a ahorrar tiempo, reducir los gastos de impresión y crear una invitación que permanezca durante mucho tiempo en tu memoria y en la de tus invitados.'
  ],
  aboutSignature: 'Amulet — el primer paso bello de tu día memorable.',
  aboutBenefitsTitle: 'Por qué elegir Amulet',
  aboutBenefits: [
    'Diseños modernos y refinados',
    'Amplias opciones de personalización',
    'Visualización cómoda en todos los dispositivos',
    'Confirmación online de asistencia de los invitados',
    'Difusión rápida y sencilla mediante un enlace',
    'Posibilidad de invitaciones multilingües',
    'Atención personalizada y soporte técnico'
  ],
  aboutCompanyCredit: 'Amulet fue creado por R’SOFT Development Company con amor, atención a los detalles y el deseo de hacer único cada evento.',
  contactName: 'Nombre', footerText: 'Invitaciones digitales con RSVP, mapas, galerías y detalles personales.',
  daysToGo: 'días restantes', rsvpSaved: 'Gracias. Tu RSVP fue guardado.',
  faqItems: [
    ['¿Qué incluye el precio?', 'Fotos, programa, direcciones, mapa, formulario RSVP, cuenta regresiva y textos necesarios.'],
    ['¿Cuántos días tarda?', 'Normalmente 3-4 días. Los diseños personalizados pueden tardar más.'],
    ['¿Cómo envío la invitación web?', 'Puedes compartirla por WhatsApp, Instagram, Viber, Telegram, Email, SMS u otra plataforma.'],
    ['¿Qué idiomas están disponibles?', 'Las invitaciones pueden prepararse en armenio, inglés, ruso y otros idiomas.']
  ]
});

Object.assign(fr, {
  roadmapSteps: [
    { title: 'Trouve le style de ton événement', text: 'Choisis la catégorie qui correspond à ta célébration : mariage, baptême, anniversaire, fiançailles ou corporate.' },
    { title: 'Prévisualise sur téléphone', text: 'Ouvre un modèle et vois comment l’invitation digitale apparaîtra sur l’écran d’un invité.' },
    { title: 'Passe commande', text: 'Ajoute les noms, la date, l’heure, le lieu, la carte, les photos et le message pour les invités.' },
    { title: 'Nous créons ton invitation', text: 'L’équipe Amulet transforme tes détails en invitation en ligne avec galerie, carte, compte à rebours et RSVP.' },
    { title: 'Valide la version finale', text: 'Vérifie le lien préparé, demande les derniers ajustements si besoin et confirme la mise en ligne.' },
    { title: 'Envoie un beau lien', text: 'Partage l’invitation via WhatsApp, Viber, Telegram, email, Instagram ou tout autre canal.' },
    { title: 'Collecte les réponses RSVP', text: 'Les invités répondent depuis la page et la présence reste organisée.' }
  ],
  partnerTitle: 'Pour les partenaires', partnerSubtitle: 'Comment devenir partenaire', partnerLogin: 'Entrer',
  weddingTitle: 'Mariage et fiançailles', weddingSubtitle: 'Les moments les plus précieux commencent par une invitation',
  baptismTitle: 'Baptême', baptismSubtitle: 'Envoie une invitation dont on se souviendra',
  birthTitle: 'Anniversaire', birthSubtitle: 'Démarque-toi',
  corporateTitle: 'Corporate', corporateSubtitle: 'Gagne du temps',
  phoneWeddingNames: 'Aram & Lilit', phoneBaptismName: 'Narek', phoneBlessedDay: 'Jour sacré', phoneBirthday: 'Anniversaire',
  search: 'Rechercher', sort: 'Trier', newest: 'Nouveautés', priceAsc: 'Prix croissant', priceDesc: 'Prix décroissant', all: 'Tous',
  preview: 'Aperçu', order: 'Commander', livePreview: 'Aperçu en direct', orderThis: 'Commander cette invitation', features: 'Fonctions', gallery: 'Galerie',
  fullName: 'Nom complet', phone: 'Téléphone', email: 'Email', eventType: 'Type d’événement', selectedTemplate: 'Invitation sélectionnée',
  eventDate: 'Date', eventTime: 'Heure', eventLocation: 'Lieu', mapLink: 'Lien Google Maps', mainNames: 'Noms principaux',
  eventMessage: 'Texte de l’invitation', preferredLanguage: 'Langue préférée', notes: 'Notes supplémentaires', submit: 'Envoyer',
  successOrder: 'Votre commande a été envoyée.', successContact: 'Votre message a été envoyé.', guestName: 'Nom de l’invité',
  attendance: 'Présence', attending: 'Je serai présent', declined: 'Je ne peux pas venir', unsure: 'Je ne suis pas sûr', guestCount: 'Nombre d’invités',
  message: 'Message', openMap: 'Ouvrir la carte', share: 'Partager l’invitation', addCalendar: 'Ajouter au calendrier',
  login: 'Connexion', password: 'Mot de passe', dashboard: 'Tableau de bord', logout: 'Déconnexion', loading: 'Chargement...', error: 'Une erreur est survenue',
  required: 'Veuillez remplir les champs obligatoires', customDesign: 'Design personnalisé',
  catalogIntro: 'Parcourez les designs originaux et choisissez une base pour votre événement.',
  orderIntro: 'Envoyez les détails de l’événement et notre équipe préparera une invitation personnalisée.',
  contactIntro: 'Dites-nous ce que vous préparez et nous aiderons à créer l’invitation.',
  aboutTitle: 'À propos d’Amulet', aboutIntro: 'Une plateforme moderne pour invitations en ligne.',
  aboutP1: 'Amulet est une plateforme moderne d’invitations en ligne, créée pour rendre les jours importants et mémorables de votre vie plus beaux et uniques.',
  aboutP2: 'Avec notre plateforme, vous pouvez choisir un design prêt à l’emploi, personnaliser l’invitation, ajouter toutes les informations de l’événement et l’envoyer facilement à vos invités. Amulet est conçu pour les mariages, fiançailles, baptêmes, anniversaires, événements d’entreprise et autres occasions importantes.',
  aboutP3: 'Nous associons design raffiné, technologies modernes et simplicité d’utilisation pour créer des invitations qui ne se contentent pas d’informer sur l’événement, mais en transmettent aussi l’ambiance et l’histoire.',
  aboutParagraphs: [
    'Amulet est une plateforme moderne d’invitations en ligne, créée pour rendre les jours importants et mémorables de votre vie plus beaux et uniques.',
    'Avec notre plateforme, vous pouvez choisir un design prêt à l’emploi, personnaliser l’invitation, ajouter toutes les informations de l’événement et l’envoyer facilement à vos invités. Amulet est conçu pour les mariages, fiançailles, baptêmes, anniversaires, événements d’entreprise et autres occasions importantes.',
    'Nous associons design raffiné, technologies modernes et simplicité d’utilisation pour créer des invitations qui ne se contentent pas d’informer sur l’événement, mais en transmettent aussi l’ambiance et l’histoire.',
    'Notre objectif est de vous aider à gagner du temps, réduire les coûts d’impression et créer une invitation qui restera longtemps dans votre mémoire et celle de vos invités.'
  ],
  aboutSignature: 'Amulet — le premier beau pas de votre journée mémorable.',
  aboutBenefitsTitle: 'Pourquoi choisir Amulet',
  aboutBenefits: [
    'Designs modernes et raffinés',
    'Large choix de personnalisation',
    'Consultation confortable sur tous les appareils',
    'Confirmation de présence en ligne des invités',
    'Partage rapide et simple par lien',
    'Possibilité d’invitations multilingues',
    'Approche personnalisée et support technique'
  ],
  aboutCompanyCredit: 'Amulet a été créé par R’SOFT Development Company avec amour, attention aux détails et l’envie de rendre chaque événement unique.',
  contactName: 'Nom', footerText: 'Invitations digitales avec RSVP, cartes, galeries et détails personnels.',
  daysToGo: 'jours restants', rsvpSaved: 'Merci. Votre RSVP a été enregistré.',
  faqItems: [
    ['Que comprend le prix ?', 'Photos, programme, adresses, carte, formulaire RSVP, compte à rebours et textes nécessaires.'],
    ['Combien de jours faut-il ?', 'Généralement 3-4 jours. Les designs sur mesure peuvent prendre plus de temps.'],
    ['Comment envoyer l’invitation web ?', 'Vous pouvez la partager via WhatsApp, Instagram, Viber, Telegram, Email, SMS ou toute autre plateforme.'],
    ['Quelles langues sont disponibles ?', 'Les invitations peuvent être préparées en arménien, anglais, russe et autres langues.']
  ]
});

Object.assign(de, {
  roadmapSteps: [
    { title: 'Finde den Stil deines Events', text: 'Wähle die passende Kategorie: Hochzeit, Taufe, Geburtstag, Verlobung oder Firmenevent.' },
    { title: 'Sieh es auf dem Telefon', text: 'Öffne eine Vorlage und prüfe, wie die digitale Einladung auf dem Gastbildschirm wirkt.' },
    { title: 'Gib die Bestellung auf', text: 'Trage Namen, Datum, Uhrzeit, Ort, Karte, Fotos und die Nachricht an die Gäste ein.' },
    { title: 'Wir erstellen deine Einladung', text: 'Das Amulet-Team macht daraus eine Online-Einladung mit Galerie, Karte, Countdown und RSVP.' },
    { title: 'Bestätige die finale Version', text: 'Prüfe den Link, bitte bei Bedarf um letzte Änderungen und bestätige die Veröffentlichung.' },
    { title: 'Sende einen schönen Link', text: 'Teile die Einladung über WhatsApp, Viber, Telegram, E-Mail, Instagram oder jeden anderen Kanal.' },
    { title: 'Sammle RSVP-Antworten', text: 'Gäste antworten direkt auf der Seite und die Teilnahme bleibt übersichtlich.' }
  ],
  partnerTitle: 'Für Partner', partnerSubtitle: 'Wie man Partner wird', partnerLogin: 'Eintreten',
  weddingTitle: 'Hochzeit und Verlobung', weddingSubtitle: 'Die wertvollsten Momente beginnen mit einer Einladung',
  baptismTitle: 'Taufe', baptismSubtitle: 'Sende eine Einladung, die in Erinnerung bleibt',
  birthTitle: 'Geburtstag', birthSubtitle: 'Heb dich von allen ab',
  corporateTitle: 'Corporate', corporateSubtitle: 'Spare Zeit',
  phoneWeddingNames: 'Aram & Lilit', phoneBaptismName: 'Narek', phoneBlessedDay: 'Heiliger Tag', phoneBirthday: 'Geburtstag',
  search: 'Suchen', sort: 'Sortieren', newest: 'Neueste', priceAsc: 'Preis aufsteigend', priceDesc: 'Preis absteigend', all: 'Alle',
  preview: 'Vorschau', order: 'Bestellen', livePreview: 'Live-Vorschau', orderThis: 'Diese Einladung bestellen', features: 'Funktionen', gallery: 'Galerie',
  fullName: 'Vollständiger Name', phone: 'Telefon', email: 'E-Mail', eventType: 'Eventtyp', selectedTemplate: 'Gewählte Einladung',
  eventDate: 'Datum', eventTime: 'Uhrzeit', eventLocation: 'Ort', mapLink: 'Google Maps Link', mainNames: 'Hauptnamen',
  eventMessage: 'Einladungstext', preferredLanguage: 'Bevorzugte Sprache', notes: 'Zusätzliche Notizen', submit: 'Senden',
  successOrder: 'Deine Bestellung wurde gesendet.', successContact: 'Deine Nachricht wurde gesendet.', guestName: 'Name des Gastes',
  attendance: 'Teilnahme', attending: 'Ich komme', declined: 'Ich kann nicht kommen', unsure: 'Ich bin nicht sicher', guestCount: 'Anzahl Gäste',
  message: 'Nachricht', openMap: 'Karte öffnen', share: 'Einladung teilen', addCalendar: 'Zum Kalender hinzufügen',
  login: 'Login', password: 'Passwort', dashboard: 'Dashboard', logout: 'Abmelden', loading: 'Lädt...', error: 'Etwas ist schiefgelaufen',
  required: 'Bitte Pflichtfelder ausfüllen', customDesign: 'Individuelles Design',
  catalogIntro: 'Durchsuche originale Designs und wähle eine Basis für dein Event.',
  orderIntro: 'Sende die Eventdetails und unser Team erstellt eine persönliche Online-Einladung.',
  contactIntro: 'Erzähl uns, was du planst, und wir helfen bei der Einladung.',
  aboutTitle: 'Über Amulet', aboutIntro: 'Eine moderne Plattform für Online-Einladungen.',
  aboutP1: 'Amulet ist eine moderne Plattform für Online-Einladungen, geschaffen, um die wichtigen und unvergesslichen Tage Ihres Lebens schöner und einzigartiger zu machen.',
  aboutP2: 'Mit unserer Plattform können Sie ein fertiges Design auswählen, die Einladung personalisieren, alle Informationen zur Veranstaltung hinzufügen und sie einfach an Ihre Gäste senden. Amulet eignet sich für Hochzeiten, Verlobungen, Taufen, Geburtstage, Firmenveranstaltungen und andere wichtige Anlässe.',
  aboutP3: 'Wir verbinden feines Design, moderne Technologie und einfache Nutzung, um Einladungen zu schaffen, die nicht nur über das Ereignis informieren, sondern auch seine Stimmung und Geschichte vermitteln.',
  aboutParagraphs: [
    'Amulet ist eine moderne Plattform für Online-Einladungen, geschaffen, um die wichtigen und unvergesslichen Tage Ihres Lebens schöner und einzigartiger zu machen.',
    'Mit unserer Plattform können Sie ein fertiges Design auswählen, die Einladung personalisieren, alle Informationen zur Veranstaltung hinzufügen und sie einfach an Ihre Gäste senden. Amulet eignet sich für Hochzeiten, Verlobungen, Taufen, Geburtstage, Firmenveranstaltungen und andere wichtige Anlässe.',
    'Wir verbinden feines Design, moderne Technologie und einfache Nutzung, um Einladungen zu schaffen, die nicht nur über das Ereignis informieren, sondern auch seine Stimmung und Geschichte vermitteln.',
    'Unser Ziel ist es, Ihnen Zeit zu sparen, Druckkosten zu reduzieren und eine Einladung zu erstellen, die Ihnen und Ihren Gästen lange in Erinnerung bleibt.'
  ],
  aboutSignature: 'Amulet — der erste schöne Schritt Ihres unvergesslichen Tages.',
  aboutBenefitsTitle: 'Warum Amulet wählen',
  aboutBenefits: [
    'Moderne und feine Designs',
    'Umfangreiche Personalisierungsmöglichkeiten',
    'Komfortable Ansicht auf allen Geräten',
    'Online-Bestätigung der Teilnahme durch Gäste',
    'Schnelles und einfaches Teilen per Link',
    'Möglichkeit mehrsprachiger Einladungen',
    'Persönlicher Ansatz und technischer Support'
  ],
  aboutCompanyCredit: 'Amulet wurde von R’SOFT Development Company mit Liebe, Liebe zum Detail und dem Wunsch geschaffen, jedes Event einzigartig zu machen.',
  contactName: 'Name', footerText: 'Digitale Einladungen mit RSVP, Karten, Galerien und persönlichen Details.',
  daysToGo: 'Tage übrig', rsvpSaved: 'Danke. Dein RSVP wurde gespeichert.',
  faqItems: [
    ['Was ist im Preis enthalten?', 'Fotos, Ablauf, Adressen, Karte, RSVP-Formular, Countdown und alle nötigen Texte.'],
    ['Wie viele Tage dauert die Vorbereitung?', 'Meist 3-4 Tage. Individuelle Designs können länger dauern.'],
    ['Wie sende ich die Web-Einladung?', 'Du kannst sie über WhatsApp, Instagram, Viber, Telegram, E-Mail, SMS oder andere Plattformen teilen.'],
    ['Welche Sprachen sind verfügbar?', 'Einladungen können auf Armenisch, Englisch, Russisch und weiteren Sprachen erstellt werden.']
  ]
});

Object.assign(it, {
  roadmapSteps: [
    { title: 'Trova lo stile del tuo evento', text: 'Scegli la categoria adatta: matrimonio, battesimo, compleanno, fidanzamento o evento corporate.' },
    { title: 'Guardalo sul telefono', text: 'Apri un modello e vedi come apparirà l’invito digitale sullo schermo degli ospiti.' },
    { title: 'Effettua l’ordine', text: 'Inserisci nomi, data, ora, luogo, mappa, foto e messaggio per gli ospiti.' },
    { title: 'Creiamo il tuo invito', text: 'Il team Amulet trasforma i dettagli in un invito online con galleria, mappa, conto alla rovescia e RSVP.' },
    { title: 'Approva la versione finale', text: 'Controlla il link, chiedi ultime modifiche se servono e conferma la pubblicazione.' },
    { title: 'Invia un bel link', text: 'Condividi l’invito via WhatsApp, Viber, Telegram, email, Instagram o qualsiasi canale.' },
    { title: 'Raccogli RSVP', text: 'Gli ospiti rispondono dalla pagina e la partecipazione resta organizzata.' }
  ],
  partnerTitle: 'Per partner', partnerSubtitle: 'Come diventare partner', partnerLogin: 'Entra',
  weddingTitle: 'Matrimonio e fidanzamento', weddingSubtitle: 'I momenti più preziosi iniziano con un invito',
  baptismTitle: 'Battesimo', baptismSubtitle: 'Invia un invito che sarà ricordato',
  birthTitle: 'Compleanno', birthSubtitle: 'Distinguiti da tutti',
  corporateTitle: 'Corporate', corporateSubtitle: 'Risparmia tempo',
  phoneWeddingNames: 'Aram & Lilit', phoneBaptismName: 'Narek', phoneBlessedDay: 'Giorno sacro', phoneBirthday: 'Compleanno',
  search: 'Cerca', sort: 'Ordina', newest: 'Più recenti', priceAsc: 'Prezzo crescente', priceDesc: 'Prezzo decrescente', all: 'Tutti',
  preview: 'Anteprima', order: 'Ordina', livePreview: 'Anteprima live', orderThis: 'Ordina questo invito', features: 'Funzioni', gallery: 'Galleria',
  fullName: 'Nome completo', phone: 'Telefono', email: 'Email', eventType: 'Tipo di evento', selectedTemplate: 'Invito selezionato',
  eventDate: 'Data', eventTime: 'Ora', eventLocation: 'Luogo', mapLink: 'Link Google Maps', mainNames: 'Nomi principali',
  eventMessage: 'Testo invito', preferredLanguage: 'Lingua preferita', notes: 'Note aggiuntive', submit: 'Invia',
  successOrder: 'Il tuo ordine è stato inviato.', successContact: 'Il tuo messaggio è stato inviato.', guestName: 'Nome ospite',
  attendance: 'Partecipazione', attending: 'Parteciperò', declined: 'Non posso partecipare', unsure: 'Non sono sicuro', guestCount: 'Numero ospiti',
  message: 'Messaggio', openMap: 'Apri mappa', share: 'Condividi invito', addCalendar: 'Aggiungi al calendario',
  login: 'Accesso', password: 'Password', dashboard: 'Dashboard', logout: 'Esci', loading: 'Caricamento...', error: 'Qualcosa è andato storto',
  required: 'Compila i campi obbligatori', customDesign: 'Design personalizzato',
  catalogIntro: 'Sfoglia design originali e scegli una base per il tuo evento.',
  orderIntro: 'Invia i dettagli dell’evento e il nostro team preparerà un invito online personalizzato.',
  contactIntro: 'Raccontaci cosa stai organizzando e ti aiuteremo a creare l’invito.',
  aboutTitle: 'Informazioni su Amulet', aboutIntro: 'Una piattaforma moderna per inviti online.',
  aboutP1: 'Amulet è una piattaforma moderna per inviti online, creata per rendere più belli e unici i giorni importanti e memorabili della tua vita.',
  aboutP2: 'Con la nostra piattaforma puoi scegliere un design pronto, personalizzare l’invito, aggiungere tutte le informazioni dell’evento e inviarlo facilmente ai tuoi ospiti. Amulet è pensato per matrimoni, fidanzamenti, battesimi, compleanni, eventi aziendali e altre occasioni importanti.',
  aboutP3: 'Uniamo design raffinato, tecnologie moderne e semplicità d’uso per creare inviti che non solo informano sull’evento, ma ne trasmettono anche l’atmosfera e la storia.',
  aboutParagraphs: [
    'Amulet è una piattaforma moderna per inviti online, creata per rendere più belli e unici i giorni importanti e memorabili della tua vita.',
    'Con la nostra piattaforma puoi scegliere un design pronto, personalizzare l’invito, aggiungere tutte le informazioni dell’evento e inviarlo facilmente ai tuoi ospiti. Amulet è pensato per matrimoni, fidanzamenti, battesimi, compleanni, eventi aziendali e altre occasioni importanti.',
    'Uniamo design raffinato, tecnologie moderne e semplicità d’uso per creare inviti che non solo informano sull’evento, ma ne trasmettono anche l’atmosfera e la storia.',
    'Il nostro obiettivo è aiutarti a risparmiare tempo, ridurre i costi di stampa e creare un invito che rimanga a lungo nella memoria tua e dei tuoi ospiti.'
  ],
  aboutSignature: 'Amulet — il primo bellissimo passo del tuo giorno memorabile.',
  aboutBenefitsTitle: 'Perché scegliere Amulet',
  aboutBenefits: [
    'Design moderni e raffinati',
    'Ampie possibilità di personalizzazione',
    'Visualizzazione comoda su tutti i dispositivi',
    'Conferma online della partecipazione degli ospiti',
    'Condivisione rapida e semplice tramite link',
    'Possibilità di inviti multilingue',
    'Approccio personale e supporto tecnico'
  ],
  aboutCompanyCredit: 'Amulet è stato creato da R’SOFT Development Company con amore, attenzione ai dettagli e il desiderio di rendere unico ogni evento.',
  contactName: 'Nome', footerText: 'Inviti digitali con RSVP, mappe, gallerie e dettagli personali.',
  daysToGo: 'giorni rimasti', rsvpSaved: 'Grazie. Il tuo RSVP è stato salvato.',
  faqItems: [
    ['Cosa include il prezzo?', 'Foto, programma, indirizzi, mappa, modulo RSVP, conto alla rovescia e testi necessari.'],
    ['Quanti giorni servono?', 'Di solito 3-4 giorni. I design personalizzati possono richiedere più tempo.'],
    ['Come invio l’invito web?', 'Puoi condividerlo via WhatsApp, Instagram, Viber, Telegram, Email, SMS o altra piattaforma.'],
    ['Quali lingue sono disponibili?', 'Gli inviti possono essere preparati in armeno, inglese, russo e altre lingue.']
  ]
});

const privacySectionsHy = [
  {
    title: 'Ինչ տվյալներ կարող ենք հավաքել',
    items: [
      'անուն, ազգանուն և կապի տվյալներ',
      'հեռախոսահամար և էլ. փոստ',
      'միջոցառման տեսակը, ամսաթիվը, ժամը և վայրը',
      'հրավերի համար փոխանցված տեքստեր, լուսանկարներ և հյուրերի անուններ',
      'տեխնիկական տվյալներ՝ սարքի տեսակ, դիտարկիչ, IP հասցե և էջի օգտագործման տվյալներ'
    ]
  },
  {
    title: 'Ինչ նպատակով ենք օգտագործում տվյալները',
    text: [
      'Տվյալներն օգտագործվում են պատվերը մշակելու, առցանց հրավիրատոմս պատրաստելու, հաճախորդի հետ կապ հաստատելու, ծառայության որակը բարելավելու և տեխնիկական անվտանգությունը ապահովելու համար։'
    ]
  },
  {
    title: 'Հրավերի հասանելիությունը',
    text: [
      'Հրավերի հղումը կարող է բացվել այն մարդկանց կողմից, որոնց փոխանցվել է հղումը։ Խորհուրդ ենք տալիս հրավիրատոմսում չտեղադրել չափազանց զգայուն տվյալներ։'
    ]
  },
  {
    title: 'Տվյալների փոխանցում երրորդ անձանց',
    text: [
      'Մենք չենք վաճառում կամ վարձակալությամբ չենք փոխանցում ձեր անձնական տվյալները։ Դրանք կարող են փոխանցվել միայն այն ծառայություններ մատուցողներին, որոնք օգնում են աշխատեցնել կայքը, մշակել վճարումները կամ ապահովել պատվերի կատարումը։'
    ]
  },
  {
    title: 'Վճարումներ',
    text: [
      'Վճարումները կարող են մշակվել վճարային համակարգերի միջոցով։ Amulet-ը չի պահպանում բանկային քարտի ամբողջական տվյալները։'
    ]
  },
  {
    title: 'Cookies և տեխնիկական տվյալներ',
    text: [
      'Կայքը կարող է օգտագործել cookies և նմանատիպ տեխնոլոգիաներ՝ լեզվի նախընտրությունը հիշելու, կայքի աշխատանքը վերլուծելու և փորձը բարելավելու համար։'
    ]
  },
  {
    title: 'Տվյալների պահպանում և անվտանգություն',
    text: [
      'Տվյալները պահվում են այնքան ժամանակ, որքան անհրաժեշտ է պատվերի, աջակցության կամ օրենքով նախատեսված պարտավորությունների համար։ Մենք կիրառում ենք ողջամիտ տեխնիկական և կազմակերպչական միջոցներ տվյալները պաշտպանելու համար։'
    ]
  },
  {
    title: 'Ձեր իրավունքները',
    text: [
      'Դուք կարող եք խնդրել տեսնել, ուղղել կամ ջնջել ձեր անձնական տվյալները, ինչպես նաև սահմանափակել դրանց օգտագործումը՝ կապ հաստատելով մեզ հետ։'
    ]
  },
  {
    title: 'Երեխաների տվյալներ և լուսանկարներ',
    text: [
      'Մկրտության կամ մանկական միջոցառումների դեպքում լուսանկարները և տվյալները պետք է փոխանցվեն ծնողի կամ օրինական ներկայացուցչի համաձայնությամբ։'
    ]
  },
  {
    title: 'Կապ մեզ հետ',
    text: [
      'Գաղտնիության քաղաքականության վերաբերյալ հարցերի դեպքում կարող եք գրել hello@amulet.local հասցեին կամ զանգահարել +374 77 805 607։'
    ]
  }
];

const privacySectionsEn = [
  { title: 'Data we may collect', text: ['We may collect contact details, event information, invitation texts, photos, guest names, and technical data needed to provide and improve the service.'] },
  { title: 'How we use data', text: ['We use data to process orders, prepare online invitations, contact customers, improve the website, prevent abuse, and meet legal requirements.'] },
  { title: 'Invitation access', text: ['Anyone with the invitation link may be able to view it, so avoid adding highly sensitive information.'] },
  { title: 'Sharing with third parties', text: ['We do not sell personal data. Data may be shared only with providers that help operate the website, process payments, or complete your order.'] },
  { title: 'Payments', text: ['Payments may be processed through payment providers. Amulet does not store complete bank card details.'] },
  { title: 'Cookies and technical data', text: ['We may use cookies to remember preferences, analyze usage, and improve the experience.'] },
  { title: 'Storage and security', text: ['Data is kept only as long as needed for orders, support, or legal obligations, and we use reasonable safeguards to protect it.'] },
  { title: 'Your rights', text: ['You may ask to access, correct, delete, or restrict the use of your personal data by contacting us.'] },
  { title: 'Children data and photos', text: ['For baptisms or children events, photos and information should be provided with parent or legal guardian consent.'] },
  { title: 'Contact', text: ['For privacy questions, contact hello@amulet.local or +374 77 805 607.'] }
];

const privacySectionsRu = [
  { title: 'Какие данные мы можем собирать', text: ['Мы можем собирать контактные данные, информацию о событии, тексты приглашения, фотографии, имена гостей и технические данные для работы сервиса.'] },
  { title: 'Как мы используем данные', text: ['Данные используются для обработки заказов, подготовки онлайн-приглашений, связи с клиентом, улучшения сайта и обеспечения безопасности.'] },
  { title: 'Доступ к приглашению', text: ['Приглашение может быть доступно людям, у которых есть ссылка. Не размещайте в нем слишком чувствительную информацию.'] },
  { title: 'Передача третьим лицам', text: ['Мы не продаем персональные данные. Они могут передаваться только поставщикам, которые помогают работе сайта, оплате или выполнению заказа.'] },
  { title: 'Платежи', text: ['Платежи могут обрабатываться платежными системами. Amulet не хранит полные данные банковской карты.'] },
  { title: 'Cookies и технические данные', text: ['Мы можем использовать cookies для запоминания настроек, анализа использования и улучшения опыта.'] },
  { title: 'Хранение и безопасность', text: ['Данные хранятся столько, сколько нужно для заказа, поддержки или юридических обязательств.'] },
  { title: 'Ваши права', text: ['Вы можете запросить доступ, исправление, удаление или ограничение использования ваших данных.'] },
  { title: 'Данные и фото детей', text: ['Для детских событий данные и фото должны передаваться с согласием родителя или законного представителя.'] },
  { title: 'Контакты', text: ['По вопросам конфиденциальности: hello@amulet.local или +374 77 805 607.'] }
];

const privacySectionsEs = [
  { title: 'Datos que podemos recopilar', text: ['Podemos recopilar datos de contacto, información del evento, textos, fotos, nombres de invitados y datos técnicos necesarios para el servicio.'] },
  { title: 'Cómo usamos los datos', text: ['Usamos los datos para procesar pedidos, preparar invitaciones online, contactar al cliente, mejorar el sitio y mantener la seguridad.'] },
  { title: 'Acceso a la invitación', text: ['Quien tenga el enlace puede ver la invitación, por eso recomendamos no incluir información demasiado sensible.'] },
  { title: 'Terceros', text: ['No vendemos datos personales. Solo los compartimos con proveedores necesarios para operar el sitio, pagos o pedidos.'] },
  { title: 'Pagos', text: ['Los pagos pueden ser procesados por proveedores de pago. Amulet no guarda los datos completos de la tarjeta.'] },
  { title: 'Cookies', text: ['Podemos usar cookies para recordar preferencias, analizar uso y mejorar la experiencia.'] },
  { title: 'Seguridad', text: ['Conservamos los datos solo el tiempo necesario y usamos medidas razonables de protección.'] },
  { title: 'Tus derechos', text: ['Puedes pedir acceso, corrección, eliminación o limitación del uso de tus datos.'] },
  { title: 'Datos de niños', text: ['En eventos infantiles, las fotos y datos deben enviarse con consentimiento de los padres o tutores.'] },
  { title: 'Contacto', text: ['Para privacidad: hello@amulet.local o +374 77 805 607.'] }
];

const privacySectionsFr = [
  { title: 'Données collectées', text: ['Nous pouvons collecter les coordonnées, les informations de l’événement, les textes, photos, noms d’invités et données techniques nécessaires au service.'] },
  { title: 'Utilisation des données', text: ['Les données servent à traiter les commandes, préparer les invitations, contacter le client, améliorer le site et assurer la sécurité.'] },
  { title: 'Accès à l’invitation', text: ['Toute personne ayant le lien peut voir l’invitation. Évitez d’y ajouter des informations trop sensibles.'] },
  { title: 'Partage avec des tiers', text: ['Nous ne vendons pas les données personnelles. Elles peuvent être partagées uniquement avec les prestataires nécessaires au service.'] },
  { title: 'Paiements', text: ['Les paiements peuvent être traités par des prestataires de paiement. Amulet ne stocke pas les données complètes de carte bancaire.'] },
  { title: 'Cookies', text: ['Nous pouvons utiliser des cookies pour mémoriser les préférences, analyser l’usage et améliorer l’expérience.'] },
  { title: 'Sécurité', text: ['Les données sont conservées uniquement le temps nécessaire et protégées par des mesures raisonnables.'] },
  { title: 'Vos droits', text: ['Vous pouvez demander l’accès, la correction, la suppression ou la limitation de vos données.'] },
  { title: 'Données des enfants', text: ['Pour les événements d’enfants, les photos et données doivent être fournies avec l’accord d’un parent ou représentant légal.'] },
  { title: 'Contact', text: ['Questions de confidentialité : hello@amulet.local ou +374 77 805 607.'] }
];

const privacySectionsDe = [
  { title: 'Welche Daten wir erfassen können', text: ['Wir können Kontaktdaten, Eventinformationen, Einladungstexte, Fotos, Gästenamen und technische Daten erfassen, die für den Service nötig sind.'] },
  { title: 'Wie wir Daten nutzen', text: ['Wir nutzen Daten für Bestellungen, Online-Einladungen, Kundenkontakt, Website-Verbesserung und Sicherheit.'] },
  { title: 'Zugriff auf die Einladung', text: ['Wer den Link hat, kann die Einladung sehen. Bitte keine sehr sensiblen Informationen hinzufügen.'] },
  { title: 'Weitergabe an Dritte', text: ['Wir verkaufen keine personenbezogenen Daten. Sie werden nur mit Dienstleistern geteilt, die für Website, Zahlung oder Auftrag nötig sind.'] },
  { title: 'Zahlungen', text: ['Zahlungen können über Zahlungsanbieter verarbeitet werden. Amulet speichert keine vollständigen Kartendaten.'] },
  { title: 'Cookies', text: ['Wir können Cookies nutzen, um Einstellungen zu speichern, Nutzung zu analysieren und die Erfahrung zu verbessern.'] },
  { title: 'Speicherung und Sicherheit', text: ['Daten werden nur so lange gespeichert wie nötig und mit angemessenen Maßnahmen geschützt.'] },
  { title: 'Ihre Rechte', text: ['Sie können Zugriff, Korrektur, Löschung oder Einschränkung Ihrer Daten beantragen.'] },
  { title: 'Kinderdaten und Fotos', text: ['Bei Kinderveranstaltungen müssen Fotos und Daten mit Zustimmung der Eltern oder Erziehungsberechtigten bereitgestellt werden.'] },
  { title: 'Kontakt', text: ['Datenschutzfragen: hello@amulet.local oder +374 77 805 607.'] }
];

const privacySectionsIt = [
  { title: 'Dati che possiamo raccogliere', text: ['Possiamo raccogliere contatti, informazioni sull’evento, testi, foto, nomi degli ospiti e dati tecnici necessari al servizio.'] },
  { title: 'Uso dei dati', text: ['Usiamo i dati per gestire ordini, preparare inviti online, contattare il cliente, migliorare il sito e garantire sicurezza.'] },
  { title: 'Accesso all’invito', text: ['Chi possiede il link può vedere l’invito. Evita di inserire informazioni troppo sensibili.'] },
  { title: 'Terze parti', text: ['Non vendiamo dati personali. Li condividiamo solo con fornitori necessari per sito, pagamenti o ordini.'] },
  { title: 'Pagamenti', text: ['I pagamenti possono essere elaborati da provider di pagamento. Amulet non conserva i dati completi della carta.'] },
  { title: 'Cookies', text: ['Possiamo usare cookies per ricordare preferenze, analizzare l’uso e migliorare l’esperienza.'] },
  { title: 'Sicurezza', text: ['I dati sono conservati solo per il tempo necessario e protetti con misure ragionevoli.'] },
  { title: 'I tuoi diritti', text: ['Puoi chiedere accesso, correzione, eliminazione o limitazione dei tuoi dati.'] },
  { title: 'Dati e foto di bambini', text: ['Per eventi di bambini, foto e dati devono essere forniti con consenso dei genitori o tutori.'] },
  { title: 'Contatto', text: ['Domande sulla privacy: hello@amulet.local o +374 77 805 607.'] }
];

Object.assign(hy, {
  menuTagline: 'Հարմարավետ և ժամանակակից հրավիրատոմսեր քո միջոցառման համար',
  menuPrivacy: 'Գաղտնիության քաղաքականություն',
  menuPartners: 'Գործընկերների համար',
  menuLogin: 'Մուտք',
  allInvitations: 'Բոլոր հրավիրատոմսերը',
  templateCatalogKicker: 'Հրավերների կատալոգ',
  templateChooserTitle: 'Ընտրիր հրավիրատոմսի տեսակը',
  templateChooserHint: 'Ընտրիր, թե ինչ հրավիրատոմս ես ուզում',
  templatesAllLanguages: '• Մոդելները նշված են մեկ լեզվի համար',
  templatesFastDelivery: '• Պատրաստման ժամկետը 4 օր',
  customerTestimonialsKicker: 'Հաճախորդների կարծիքներ',
  customerTestimonialsTitle: 'Հաճախորդների կարծիքները Ամուլետի մասին',
  customerTestimonialsSubtitle: 'Իրական տպավորություններ տարբեր միջոցառումներից՝ հարսանիք, նշանադրություն, մկրտություն, ծնունդ և կորպորատիվ երեկոներ։',
  privacyTitle: 'Գաղտնիության քաղաքականություն',
  privacyUpdated: 'Վերջին թարմացում՝ 08.07.2026',
  privacyIntro: 'Բարի գալուստ Amulet։ Այս քաղաքականությունը բացատրում է, թե ինչ տվյալներ ենք հավաքում, ինչպես ենք օգտագործում դրանք և ինչպես ենք պաշտպանում ձեր գաղտնիությունը առցանց հրավիրատոմսերի ծառայությունից օգտվելիս։',
  privacySections: privacySectionsHy
});

Object.assign(en, {
  menuTagline: 'Comfortable, modern invitations for every event',
  allInvitations: 'All invitations',
  templateCatalogKicker: 'Invitation catalog',
  templateChooserTitle: 'Choose invitation type',
  templateChooserHint: 'Choose what kind of invitation you want',
  templatesAllLanguages: '• Templates are listed for one language',
  templatesFastDelivery: '• Preparation time is 4 days',
  customerTestimonialsKicker: 'Customer reviews',
  customerTestimonialsTitle: 'What customers say about Amulet',
  customerTestimonialsSubtitle: 'Warm feedback from weddings, engagements, baptisms, birthdays, and corporate events.',
  privacyTitle: 'Privacy Policy',
  privacyUpdated: 'Last updated: 08.07.2026',
  privacyIntro: 'Welcome to Amulet. This policy explains what data we collect, how we use it, and how we protect your privacy while using our online invitation service.',
  privacySections: privacySectionsEn
});

Object.assign(ru, {
  menuTagline: 'Удобные современные приглашения для любого события',
  allInvitations: 'Все приглашения',
  templateCatalogKicker: 'Каталог приглашений',
  templateChooserTitle: 'Выберите тип приглашения',
  templateChooserHint: 'Выберите, какое приглашение вам нужно',
  templatesAllLanguages: '• Шаблоны указаны для одного языка',
  templatesFastDelivery: '• Срок подготовки 4 дня',
  customerTestimonialsKicker: 'Отзывы клиентов',
  customerTestimonialsTitle: 'Отзывы клиентов об Amulet',
  customerTestimonialsSubtitle: 'Отзывы о свадьбах, помолвках, крещениях, днях рождения и корпоративных событиях.',
  privacyTitle: 'Политика конфиденциальности',
  privacyUpdated: 'Последнее обновление: 08.07.2026',
  privacyIntro: 'Добро пожаловать в Amulet. Эта политика объясняет, какие данные мы собираем, как используем их и как защищаем вашу конфиденциальность.',
  privacySections: privacySectionsRu
});

Object.assign(es, {
  menuTagline: 'Invitaciones modernas y cómodas para cada evento',
  allInvitations: 'Todas las invitaciones',
  templateCatalogKicker: 'Catálogo de invitaciones',
  templateChooserTitle: 'Elige el tipo de invitación',
  templateChooserHint: 'Elige qué invitación quieres',
  templatesAllLanguages: '• Los modelos están indicados para un idioma',
  templatesFastDelivery: '• Tiempo de preparación: 4 días',
  customerTestimonialsKicker: 'Opiniones',
  customerTestimonialsTitle: 'Opiniones de clientes sobre Amulet',
  customerTestimonialsSubtitle: 'Comentarios cálidos de bodas, compromisos, bautizos, cumpleaños y eventos corporativos.',
  privacyTitle: 'Política de privacidad',
  privacyUpdated: 'Última actualización: 08.07.2026',
  privacyIntro: 'Bienvenido a Amulet. Esta política explica qué datos recopilamos, cómo los usamos y cómo protegemos tu privacidad.',
  privacySections: privacySectionsEs
});

Object.assign(fr, {
  menuTagline: 'Des invitations modernes et pratiques pour chaque événement',
  allInvitations: 'Toutes les invitations',
  templateCatalogKicker: 'Catalogue d’invitations',
  templateChooserTitle: 'Choisir le type d’invitation',
  templateChooserHint: 'Choisissez le type d’invitation souhaité',
  templatesAllLanguages: '• Les modèles sont indiqués pour une langue',
  templatesFastDelivery: '• Délai de préparation : 4 jours',
  customerTestimonialsKicker: 'Avis clients',
  customerTestimonialsTitle: 'Ce que les clients disent d’Amulet',
  customerTestimonialsSubtitle: 'Des retours chaleureux pour mariages, fiançailles, baptêmes, anniversaires et événements corporate.',
  privacyTitle: 'Politique de confidentialité',
  privacyUpdated: 'Dernière mise à jour : 08.07.2026',
  privacyIntro: 'Bienvenue chez Amulet. Cette politique explique quelles données nous collectons, comment nous les utilisons et comment nous protégeons votre confidentialité.',
  privacySections: privacySectionsFr
});

Object.assign(de, {
  menuTagline: 'Moderne, bequeme Einladungen für jedes Event',
  allInvitations: 'Alle Einladungen',
  templateCatalogKicker: 'Einladungskatalog',
  templateChooserTitle: 'Einladungstyp wählen',
  templateChooserHint: 'Wähle, welche Einladung du möchtest',
  templatesAllLanguages: '• Vorlagen sind für eine Sprache angegeben',
  templatesFastDelivery: '• Vorbereitungszeit: 4 Tage',
  customerTestimonialsKicker: 'Kundenstimmen',
  customerTestimonialsTitle: 'Was Kunden über Amulet sagen',
  customerTestimonialsSubtitle: 'Feedback zu Hochzeiten, Verlobungen, Taufen, Geburtstagen und Firmenevents.',
  privacyTitle: 'Datenschutzerklärung',
  privacyUpdated: 'Letzte Aktualisierung: 08.07.2026',
  privacyIntro: 'Willkommen bei Amulet. Diese Erklärung beschreibt, welche Daten wir erfassen, wie wir sie nutzen und wie wir Ihre Privatsphäre schützen.',
  privacySections: privacySectionsDe
});

Object.assign(it, {
  menuTagline: 'Inviti moderni e comodi per ogni evento',
  allInvitations: 'Tutti gli inviti',
  templateCatalogKicker: 'Catalogo inviti',
  templateChooserTitle: 'Scegli il tipo di invito',
  templateChooserHint: 'Scegli quale invito desideri',
  templatesAllLanguages: '• I modelli sono indicati per una lingua',
  templatesFastDelivery: '• Tempo di preparazione: 4 giorni',
  customerTestimonialsKicker: 'Recensioni clienti',
  customerTestimonialsTitle: 'Cosa dicono i clienti di Amulet',
  customerTestimonialsSubtitle: 'Feedback da matrimoni, fidanzamenti, battesimi, compleanni ed eventi corporate.',
  privacyTitle: 'Informativa sulla privacy',
  privacyUpdated: 'Ultimo aggiornamento: 08.07.2026',
  privacyIntro: 'Benvenuto in Amulet. Questa informativa spiega quali dati raccogliamo, come li usiamo e come proteggiamo la tua privacy.',
  privacySections: privacySectionsIt
});

Object.assign(en, {
  authIntro: 'Sign in or create an Amulet account to keep your details safe.',
  authRegister: 'Register',
  authNamePlaceholder: 'Your name',
  authWait: 'Please wait...',
  authCreateAccount: 'Create account',
  authSignIn: 'Sign in',
  authOr: 'or',
  authGoogleMissing: 'Add VITE_GOOGLE_CLIENT_ID to enable Google sign-in',
  authVerifyTitle: 'Verify your email',
  authVerifyIntro: 'We sent a 6-digit verification code to {email}.',
  authCodeSent: 'The verification code was sent to your email.',
  authCodeLength: 'The code must be 6 digits.',
  authCodeWrong: 'The code is incorrect.',
  authChecking: 'Checking...',
  authConfirm: 'Confirm',
  accountTitle: 'My page',
  accountInvitations: 'My invitations',
  accountNoInvitations: 'You do not have any invitations',
  accountOrdersError: 'Could not load your invitations.',
  accountViewDesign: 'View design',
  accountViewInvitation: 'View invitation',
  accountLogout: 'Log out',
  accountLogoutTitle: 'Do you want to log out?',
  accountLogoutText: 'If you leave your account, you will need to enter your email and password again the next time you want to access your page.',
  accountStay: 'Stay',
  accountLogoutConfirm: 'Yes, log out'
});

Object.assign(hy, {
  authIntro: 'Մուտք գործիր կամ ստեղծիր Amulet օգտահաշիվ՝ քո տվյալները անվտանգ պահելու համար։',
  authRegister: 'Գրանցում',
  authNamePlaceholder: 'Քո անունը',
  authWait: 'Սպասիր...',
  authCreateAccount: 'Գրանցվել',
  authSignIn: 'Մուտք գործել',
  authOr: 'կամ',
  authGoogleMissing: 'Google մուտքի համար ավելացրու VITE_GOOGLE_CLIENT_ID',
  authVerifyTitle: 'Հաստատիր email-ը',
  authVerifyIntro: '{email} հասցեին ուղարկել ենք 6 նիշանոց կոդ։ Մուտքագրիր այն՝ գրանցումն ավարտելու համար։',
  authCodeSent: 'Վերիֆիկացիայի կոդը ուղարկվել է email-ին։',
  authCodeLength: 'Կոդը պետք է լինի 6 նիշ։',
  authCodeWrong: 'Կոդը սխալ է։',
  authChecking: 'Ստուգվում է...',
  authConfirm: 'Հաստատել',
  accountTitle: 'Իմ էջը',
  accountInvitations: 'Իմ հրավիրատոմսերը',
  accountNoInvitations: 'դուք հրավիրատոմսեր չունեք',
  accountOrdersError: 'Չհաջողվեց բեռնել հրավիրատոմսերը։',
  accountViewDesign: 'Դիտել դիզայնը',
  accountViewInvitation: 'Դիտել հրավերը',
  accountLogout: 'Դուրս գալ',
  accountLogoutTitle: 'Ցանկանո՞ւմ ես դուրս գալ օգտահաշվից',
  accountLogoutText: 'Եթե դուրս գաս օգտահաշվից, հաջորդ անգամ քո էջ մուտք գործելու համար պետք է կրկին լրացնես email-ն ու գաղտնաբառը։',
  accountStay: 'Մնալ էջում',
  accountLogoutConfirm: 'Այո, դուրս գալ'
});

Object.assign(ru, {
  authIntro: 'Войдите или создайте аккаунт Amulet, чтобы безопасно хранить свои данные.',
  authRegister: 'Регистрация',
  authNamePlaceholder: 'Ваше имя',
  authWait: 'Подождите...',
  authCreateAccount: 'Зарегистрироваться',
  authSignIn: 'Войти',
  authOr: 'или',
  authGoogleMissing: 'Добавьте VITE_GOOGLE_CLIENT_ID для входа через Google',
  authVerifyTitle: 'Подтвердите email',
  authVerifyIntro: 'Мы отправили 6-значный код на {email}. Введите его, чтобы завершить регистрацию.',
  authCodeSent: 'Код подтверждения отправлен на ваш email.',
  authCodeLength: 'Код должен состоять из 6 цифр.',
  authCodeWrong: 'Код неверный.',
  authChecking: 'Проверяем...',
  authConfirm: 'Подтвердить',
  accountTitle: 'Моя страница',
  accountInvitations: 'Мои приглашения',
  accountNoInvitations: 'У вас нет приглашений',
  accountOrdersError: 'Не удалось загрузить приглашения.',
  accountViewDesign: 'Посмотреть дизайн',
  accountLogout: 'Выйти',
  accountLogoutTitle: 'Хотите выйти из аккаунта?',
  accountLogoutText: 'Если вы выйдете, при следующем входе на свою страницу нужно будет снова указать email и пароль.',
  accountStay: 'Остаться',
  accountLogoutConfirm: 'Да, выйти'
});

Object.assign(es, {
  authIntro: 'Inicia sesión o crea una cuenta de Amulet para guardar tus datos con seguridad.',
  authRegister: 'Registro',
  authNamePlaceholder: 'Tu nombre',
  authWait: 'Espera...',
  authCreateAccount: 'Crear cuenta',
  authSignIn: 'Entrar',
  authOr: 'o',
  authGoogleMissing: 'Añade VITE_GOOGLE_CLIENT_ID para activar Google',
  authVerifyTitle: 'Confirma tu email',
  authVerifyIntro: 'Hemos enviado un código de 6 dígitos a {email}. Introdúcelo para completar el registro.',
  authCodeSent: 'El código de verificación se envió a tu email.',
  authCodeLength: 'El código debe tener 6 dígitos.',
  authCodeWrong: 'El código es incorrecto.',
  authChecking: 'Comprobando...',
  authConfirm: 'Confirmar',
  accountTitle: 'Mi página',
  accountInvitations: 'Mis invitaciones',
  accountNoInvitations: 'No tienes invitaciones',
  accountOrdersError: 'No se pudieron cargar tus invitaciones.',
  accountViewDesign: 'Ver diseño',
  accountLogout: 'Salir',
  accountLogoutTitle: '¿Quieres cerrar sesión?',
  accountLogoutText: 'Si sales de tu cuenta, la próxima vez tendrás que volver a introducir tu email y contraseña.',
  accountStay: 'Quedarme',
  accountLogoutConfirm: 'Sí, salir'
});

Object.assign(fr, {
  authIntro: 'Connectez-vous ou créez un compte Amulet pour garder vos données en sécurité.',
  authRegister: 'Inscription',
  authNamePlaceholder: 'Votre nom',
  authWait: 'Patientez...',
  authCreateAccount: 'Créer un compte',
  authSignIn: 'Se connecter',
  authOr: 'ou',
  authGoogleMissing: 'Ajoutez VITE_GOOGLE_CLIENT_ID pour activer Google',
  authVerifyTitle: 'Confirmez votre email',
  authVerifyIntro: 'Nous avons envoyé un code à 6 chiffres à {email}. Saisissez-le pour finaliser l’inscription.',
  authCodeSent: 'Le code de vérification a été envoyé à votre email.',
  authCodeLength: 'Le code doit contenir 6 chiffres.',
  authCodeWrong: 'Le code est incorrect.',
  authChecking: 'Vérification...',
  authConfirm: 'Confirmer',
  accountTitle: 'Ma page',
  accountInvitations: 'Mes invitations',
  accountNoInvitations: 'Vous n’avez aucune invitation',
  accountOrdersError: 'Impossible de charger vos invitations.',
  accountViewDesign: 'Voir le design',
  accountLogout: 'Se déconnecter',
  accountLogoutTitle: 'Voulez-vous vous déconnecter ?',
  accountLogoutText: 'Si vous quittez votre compte, vous devrez saisir à nouveau votre email et votre mot de passe la prochaine fois.',
  accountStay: 'Rester',
  accountLogoutConfirm: 'Oui, sortir'
});

Object.assign(de, {
  authIntro: 'Melde dich an oder erstelle ein Amulet-Konto, um deine Daten sicher zu speichern.',
  authRegister: 'Registrieren',
  authNamePlaceholder: 'Dein Name',
  authWait: 'Bitte warten...',
  authCreateAccount: 'Konto erstellen',
  authSignIn: 'Anmelden',
  authOr: 'oder',
  authGoogleMissing: 'Füge VITE_GOOGLE_CLIENT_ID hinzu, um Google zu aktivieren',
  authVerifyTitle: 'E-Mail bestätigen',
  authVerifyIntro: 'Wir haben einen 6-stelligen Code an {email} gesendet. Gib ihn ein, um die Registrierung abzuschließen.',
  authCodeSent: 'Der Bestätigungscode wurde an deine E-Mail gesendet.',
  authCodeLength: 'Der Code muss 6 Ziffern haben.',
  authCodeWrong: 'Der Code ist falsch.',
  authChecking: 'Wird geprüft...',
  authConfirm: 'Bestätigen',
  accountTitle: 'Meine Seite',
  accountInvitations: 'Meine Einladungen',
  accountNoInvitations: 'Du hast keine Einladungen',
  accountOrdersError: 'Einladungen konnten nicht geladen werden.',
  accountViewDesign: 'Design ansehen',
  accountLogout: 'Abmelden',
  accountLogoutTitle: 'Möchtest du dich abmelden?',
  accountLogoutText: 'Wenn du dein Konto verlässt, musst du beim nächsten Zugriff auf deine Seite erneut E-Mail und Passwort eingeben.',
  accountStay: 'Bleiben',
  accountLogoutConfirm: 'Ja, abmelden'
});

Object.assign(it, {
  authIntro: 'Accedi o crea un account Amulet per tenere al sicuro i tuoi dati.',
  authRegister: 'Registrazione',
  authNamePlaceholder: 'Il tuo nome',
  authWait: 'Attendi...',
  authCreateAccount: 'Crea account',
  authSignIn: 'Accedi',
  authOr: 'o',
  authGoogleMissing: 'Aggiungi VITE_GOOGLE_CLIENT_ID per attivare Google',
  authVerifyTitle: 'Conferma la tua email',
  authVerifyIntro: 'Abbiamo inviato un codice di 6 cifre a {email}. Inseriscilo per completare la registrazione.',
  authCodeSent: 'Il codice di verifica è stato inviato alla tua email.',
  authCodeLength: 'Il codice deve essere di 6 cifre.',
  authCodeWrong: 'Il codice non è corretto.',
  authChecking: 'Verifica...',
  authConfirm: 'Conferma',
  accountTitle: 'La mia pagina',
  accountInvitations: 'I miei inviti',
  accountNoInvitations: 'Non hai inviti',
  accountOrdersError: 'Impossibile caricare i tuoi inviti.',
  accountViewDesign: 'Vedi design',
  accountLogout: 'Esci',
  accountLogoutTitle: 'Vuoi uscire dall’account?',
  accountLogoutText: 'Se esci dall’account, la prossima volta dovrai inserire di nuovo email e password.',
  accountStay: 'Resta',
  accountLogoutConfirm: 'Sì, esci'
});

Object.assign(hy, {
  newHeroTitle: 'Քո հրավերը՝ նոր ձևաչափով',
  newHeroText: 'Ստեղծիր գեղեցիկ և ժամանակակից օնլայն հրավեր՝ նախատեսված հենց քո հիշարժան օրվա համար։ Ընտրիր դիզայնը, ավելացրու անհրաժեշտ տվյալները և ընդամենը մեկ հղումով ուղարկիր այն բոլոր հյուրերին։ Հեշտ, արագ և տպավորիչ։',
  creationFlowTitle: 'Ստեղծիր օնլայն հրավեր ընդամենը 10 րոպեում',
  creationFlowSubtitle: 'Պահպանիր ավանդույթը և վայելիր հարմարավետությունը',
  creationSteps: [
    { title: 'Ընտրիր դիզայնը', text: 'Գտիր քո միջոցառմանը համապատասխան ոճը և բացիր այն հեռախոսի տեսքով։' },
    { title: 'Լրացրու տվյալները', text: 'Ավելացրու անունները, օրը, ժամը, հասցեն, նկարները և հյուրերի համար կարևոր տեքստերը։' },
    { title: 'Ուղարկիր հրավերը', text: 'Կիսվիր պատրաստի հղումով WhatsApp-ով, Viber-ով, Telegram-ով կամ ցանկացած հարթակով։' }
  ],
  step: 'Քայլ',
  startCreating: 'Սկսել ստեղծել',
  new: 'Նոր',
  close: 'Փակել',
  scanQr: 'Scan QR կոդը',
  scanQrText: 'Scan արեք QR կոդը՝ հրավերը հեռախոսով բացելու համար։',
  chooseTemplate: 'Ընտրել այս ձևանմուշը',
  templateDefaultDescription: 'Ժամանակակից օնլայն հրավեր՝ նկարներով, քարտեզով, RSVP-ով և մեկ հղումով արագ ուղարկելու հնարավորությամբ։',
  templateTrialNote: 'Անվճար փորձարկում · վճարիր միայն եթե հավանես',
  templateSwitchNote: 'Խմբագրման ընթացքում կարող ես փոխել ձևանմուշը։',
  templateModalFeatures: ['Փոփոխվող բովանդակություն', 'Google Maps', 'Հյուրի անվան ցուցադրում', 'RSVP', 'Անսահմանափակ նկարներ', 'Բազմալեզու տարբերակ', 'Հղումով կիսվել', 'Հյուրերի գիրք']
});

Object.assign(en, {
  newHeroTitle: 'Your invitation in a new format',
  newHeroText: 'Create a beautiful modern online invitation made for your memorable day. Choose a design, add the details, and send it to every guest with one link. Easy, fast, and impressive.',
  creationFlowTitle: 'Create your online invitation in just 10 minutes',
  creationFlowSubtitle: 'Keep the tradition and enjoy the convenience',
  creationSteps: [
    { title: 'Choose a template', text: 'Find the style that fits your event and preview it as a phone invitation.' },
    { title: 'Fill in your details', text: 'Add names, date, time, address, photos, and the text your guests need.' },
    { title: 'Send your invitation', text: 'Share the finished link through WhatsApp, Viber, Telegram, or any platform.' }
  ],
  step: 'Step',
  startCreating: 'Start creating',
  new: 'New',
  close: 'Close',
  scanQr: 'Scan QR code',
  scanQrText: 'Scan the QR code to open the invitation on your phone.',
  chooseTemplate: 'Choose this template',
  templateDefaultDescription: 'A modern online invitation with photos, map, RSVP, and one-link sharing.',
  templateTrialNote: 'Free to try · pay only if you love it',
  templateSwitchNote: 'You can switch templates anytime while editing.',
  templateModalFeatures: ['Customizable content', 'Google Maps', 'Guest name display', 'RSVP', 'Unlimited photos', 'Multiple languages', 'Link sharing', 'Guest book']
});

Object.assign(ru, {
  newHeroTitle: 'Ваше приглашение в новом формате',
  newHeroText: 'Создайте красивое и современное онлайн-приглашение для вашего памятного дня. Выберите дизайн, добавьте данные и отправьте всем гостям одной ссылкой. Легко, быстро и впечатляюще.',
  creationFlowTitle: 'Создайте онлайн-приглашение всего за 10 минут',
  creationFlowSubtitle: 'Сохраняйте традиции и наслаждайтесь удобством',
  creationSteps: [
    { title: 'Выберите шаблон', text: 'Найдите стиль для вашего события и посмотрите, как приглашение выглядит на телефоне.' },
    { title: 'Заполните данные', text: 'Добавьте имена, дату, время, адрес, фотографии и важный текст для гостей.' },
    { title: 'Отправьте приглашение', text: 'Поделитесь готовой ссылкой через WhatsApp, Viber, Telegram или любую платформу.' }
  ],
  step: 'Шаг',
  startCreating: 'Начать создание',
  new: 'Новое',
  close: 'Закрыть',
  scanQr: 'Сканировать QR-код',
  scanQrText: 'Сканируйте QR-код, чтобы открыть приглашение на телефоне.',
  chooseTemplate: 'Выбрать этот шаблон',
  templateDefaultDescription: 'Современное онлайн-приглашение с фото, картой, RSVP и быстрой отправкой одной ссылкой.',
  templateTrialNote: 'Бесплатно попробовать · платите только если понравится',
  templateSwitchNote: 'Шаблон можно сменить в процессе редактирования.',
  templateModalFeatures: ['Редактируемый контент', 'Google Maps', 'Имя гостя', 'RSVP', 'Неограниченные фото', 'Несколько языков', 'Отправка ссылкой', 'Гостевая книга']
});

Object.assign(es, {
  newHeroTitle: 'Tu invitación en un nuevo formato',
  newHeroText: 'Crea una invitación online hermosa y moderna para tu día especial. Elige un diseño, añade los datos y envíala a todos tus invitados con un solo enlace. Fácil, rápido e impactante.',
  creationFlowTitle: 'Crea tu invitación online en solo 10 minutos',
  creationFlowSubtitle: 'Mantén la tradición y disfruta la comodidad',
  creationSteps: [
    { title: 'Elige una plantilla', text: 'Encuentra el estilo ideal para tu evento y míralo como invitación móvil.' },
    { title: 'Completa tus datos', text: 'Añade nombres, fecha, hora, dirección, fotos y el texto para tus invitados.' },
    { title: 'Envía tu invitación', text: 'Comparte el enlace final por WhatsApp, Viber, Telegram o cualquier plataforma.' }
  ],
  step: 'Paso',
  startCreating: 'Empezar',
  new: 'Nuevo',
  close: 'Cerrar',
  scanQr: 'Escanear QR',
  scanQrText: 'Escanea el código QR para abrir la invitación en tu teléfono.',
  chooseTemplate: 'Elegir esta plantilla',
  templateDefaultDescription: 'Una invitación online moderna con fotos, mapa, RSVP y envío con un solo enlace.',
  templateTrialNote: 'Prueba gratis · paga solo si te encanta',
  templateSwitchNote: 'Puedes cambiar de plantilla durante la edición.',
  templateModalFeatures: ['Contenido editable', 'Google Maps', 'Nombre del invitado', 'RSVP', 'Fotos ilimitadas', 'Varios idiomas', 'Compartir enlace', 'Libro de invitados']
});

Object.assign(fr, {
  newHeroTitle: 'Votre invitation dans un nouveau format',
  newHeroText: 'Créez une belle invitation en ligne moderne pour votre journée mémorable. Choisissez un design, ajoutez les informations et envoyez-la à tous vos invités avec un seul lien. Simple, rapide et marquant.',
  creationFlowTitle: 'Créez votre invitation en ligne en 10 minutes',
  creationFlowSubtitle: 'Gardez la tradition et profitez du confort',
  creationSteps: [
    { title: 'Choisissez un modèle', text: 'Trouvez le style adapté à votre événement et prévisualisez-le sur mobile.' },
    { title: 'Ajoutez vos détails', text: 'Ajoutez les noms, la date, l’heure, l’adresse, les photos et le texte pour vos invités.' },
    { title: 'Envoyez l’invitation', text: 'Partagez le lien final via WhatsApp, Viber, Telegram ou toute autre plateforme.' }
  ],
  step: 'Étape',
  startCreating: 'Commencer',
  new: 'Nouveau',
  close: 'Fermer',
  scanQr: 'Scanner le QR code',
  scanQrText: 'Scannez le QR code pour ouvrir l’invitation sur votre téléphone.',
  chooseTemplate: 'Choisir ce modèle',
  templateDefaultDescription: 'Une invitation en ligne moderne avec photos, carte, RSVP et partage par lien unique.',
  templateTrialNote: 'Essai gratuit · payez seulement si vous aimez',
  templateSwitchNote: 'Vous pouvez changer de modèle pendant l’édition.',
  templateModalFeatures: ['Contenu modifiable', 'Google Maps', 'Nom de l’invité', 'RSVP', 'Photos illimitées', 'Plusieurs langues', 'Partage par lien', 'Livre d’or']
});

Object.assign(de, {
  newHeroTitle: 'Ihre Einladung in einem neuen Format',
  newHeroText: 'Erstellen Sie eine schöne, moderne Online-Einladung für Ihren besonderen Tag. Wählen Sie ein Design, ergänzen Sie die Details und senden Sie sie mit einem einzigen Link an alle Gäste. Einfach, schnell und eindrucksvoll.',
  creationFlowTitle: 'Erstellen Sie Ihre Online-Einladung in nur 10 Minuten',
  creationFlowSubtitle: 'Bewahren Sie die Tradition und genießen Sie den Komfort',
  creationSteps: [
    { title: 'Vorlage wählen', text: 'Finden Sie den passenden Stil für Ihr Event und sehen Sie ihn als mobile Einladung.' },
    { title: 'Details ausfüllen', text: 'Ergänzen Sie Namen, Datum, Uhrzeit, Adresse, Fotos und wichtige Texte für Gäste.' },
    { title: 'Einladung senden', text: 'Teilen Sie den fertigen Link über WhatsApp, Viber, Telegram oder jede andere Plattform.' }
  ],
  step: 'Schritt',
  startCreating: 'Loslegen',
  new: 'Neu',
  close: 'Schließen',
  scanQr: 'QR-Code scannen',
  scanQrText: 'Scannen Sie den QR-Code, um die Einladung auf dem Handy zu öffnen.',
  chooseTemplate: 'Diese Vorlage wählen',
  templateDefaultDescription: 'Eine moderne Online-Einladung mit Fotos, Karte, RSVP und Teilen per Einzellink.',
  templateTrialNote: 'Kostenlos testen · zahlen Sie nur, wenn es gefällt',
  templateSwitchNote: 'Sie können die Vorlage beim Bearbeiten jederzeit wechseln.',
  templateModalFeatures: ['Anpassbare Inhalte', 'Google Maps', 'Gastname', 'RSVP', 'Unbegrenzte Fotos', 'Mehrere Sprachen', 'Link teilen', 'Gästebuch']
});

Object.assign(it, {
  newHeroTitle: 'Il tuo invito in un nuovo formato',
  newHeroText: 'Crea un invito online bello e moderno per il tuo giorno speciale. Scegli un design, aggiungi i dettagli e invialo a tutti gli ospiti con un solo link. Facile, veloce e d’effetto.',
  creationFlowTitle: 'Crea il tuo invito online in soli 10 minuti',
  creationFlowSubtitle: 'Mantieni la tradizione e goditi la comodità',
  creationSteps: [
    { title: 'Scegli un modello', text: 'Trova lo stile adatto al tuo evento e visualizzalo come invito mobile.' },
    { title: 'Inserisci i dettagli', text: 'Aggiungi nomi, data, ora, indirizzo, foto e testo per gli ospiti.' },
    { title: 'Invia l’invito', text: 'Condividi il link finale tramite WhatsApp, Viber, Telegram o qualsiasi piattaforma.' }
  ],
  step: 'Passo',
  startCreating: 'Inizia',
  new: 'Nuovo',
  close: 'Chiudi',
  scanQr: 'Scansiona QR',
  scanQrText: 'Scansiona il codice QR per aprire l’invito sul telefono.',
  chooseTemplate: 'Scegli questo modello',
  templateDefaultDescription: 'Un invito online moderno con foto, mappa, RSVP e condivisione con un solo link.',
  templateTrialNote: 'Prova gratis · paga solo se ti piace',
  templateSwitchNote: 'Puoi cambiare modello durante la modifica.',
  templateModalFeatures: ['Contenuto modificabile', 'Google Maps', 'Nome ospite', 'RSVP', 'Foto illimitate', 'Più lingue', 'Condivisione link', 'Libro ospiti']
});

Object.assign(hy, {
  accountDeleteInvitation: 'Ջնջել հրավիրատոմսը',
  accountDeleteTitle: 'Ջնջե՞լ այս հրավիրատոմսը',
  accountDeleteText: 'Եթե ջնջեք հրավիրատոմսը, այն այլևս հասանելի չի լինի ձեր էջում, իսկ հյուրերի պատասխանները նույնպես կհեռացվեն։ Ջնջված հրավիրատոմսը հետ վերադարձնել հնարավոր չէ։',
  accountDeleteCancel: 'Չջնջել',
  accountDeleteConfirm: 'Այո, ջնջել',
  accountDeleteError: 'Չհաջողվեց ջնջել հրավիրատոմսը։ Խնդրում ենք փորձել կրկին։'
});

Object.assign(en, {
  accountDeleteInvitation: 'Delete invitation',
  accountDeleteTitle: 'Delete this invitation?',
  accountDeleteText: 'If you delete this invitation, it will no longer be available in your profile and guest replies will be removed as well. A deleted invitation cannot be restored.',
  accountDeleteCancel: 'Keep it',
  accountDeleteConfirm: 'Yes, delete',
  accountDeleteError: 'Could not delete the invitation. Please try again.'
});

Object.assign(ru, {
  accountDeleteInvitation: 'Удалить приглашение',
  accountDeleteTitle: 'Удалить это приглашение?',
  accountDeleteText: 'Если удалить приглашение, оно больше не будет доступно в вашем профиле, а ответы гостей также будут удалены. Удаленное приглашение восстановить невозможно.',
  accountDeleteCancel: 'Не удалять',
  accountDeleteConfirm: 'Да, удалить',
  accountDeleteError: 'Не удалось удалить приглашение. Попробуйте еще раз.'
});

Object.assign(es, {
  accountDeleteInvitation: 'Eliminar invitación',
  accountDeleteTitle: '¿Eliminar esta invitación?',
  accountDeleteText: 'Si eliminas esta invitación, ya no estará disponible en tu perfil y también se eliminarán las respuestas de los invitados. Una invitación eliminada no se puede restaurar.',
  accountDeleteCancel: 'Conservar',
  accountDeleteConfirm: 'Sí, eliminar',
  accountDeleteError: 'No se pudo eliminar la invitación. Inténtalo de nuevo.'
});

Object.assign(fr, {
  accountDeleteInvitation: 'Supprimer l’invitation',
  accountDeleteTitle: 'Supprimer cette invitation ?',
  accountDeleteText: 'Si vous supprimez cette invitation, elle ne sera plus disponible dans votre profil et les réponses des invités seront également supprimées. Une invitation supprimée ne peut pas être restaurée.',
  accountDeleteCancel: 'Conserver',
  accountDeleteConfirm: 'Oui, supprimer',
  accountDeleteError: 'Impossible de supprimer l’invitation. Veuillez réessayer.'
});

Object.assign(de, {
  accountDeleteInvitation: 'Einladung löschen',
  accountDeleteTitle: 'Diese Einladung löschen?',
  accountDeleteText: 'Wenn Sie diese Einladung löschen, ist sie in Ihrem Profil nicht mehr verfügbar und die Antworten der Gäste werden ebenfalls entfernt. Eine gelöschte Einladung kann nicht wiederhergestellt werden.',
  accountDeleteCancel: 'Behalten',
  accountDeleteConfirm: 'Ja, löschen',
  accountDeleteError: 'Die Einladung konnte nicht gelöscht werden. Bitte versuchen Sie es erneut.'
});

Object.assign(it, {
  accountDeleteInvitation: 'Elimina invito',
  accountDeleteTitle: 'Eliminare questo invito?',
  accountDeleteText: 'Se elimini questo invito, non sarà più disponibile nel tuo profilo e verranno eliminate anche le risposte degli ospiti. Un invito eliminato non può essere ripristinato.',
  accountDeleteCancel: 'Conserva',
  accountDeleteConfirm: 'Sì, elimina',
  accountDeleteError: 'Impossibile eliminare l’invito. Riprova.'
});

export const translations = { hy, en, ru, es, fr, de, it };
