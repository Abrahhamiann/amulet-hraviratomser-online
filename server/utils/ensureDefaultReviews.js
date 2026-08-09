import Review from '../models/Review.js';
import Setting from '../models/Setting.js';

const REVIEW_SEED_KEY = 'reviews_initialized_v2';

const defaultReviews = [
  ['Անի Մկրտչյան', 'Շատ գեղեցիկ և նուրբ հրավիրատոմս ստացանք։ Ամեն ինչ ճաշակով էր արված։'],
  ['Մարիամ Սարգսյան', 'Amulet-ի միջոցով մեր հարսանիքի հրավիրատոմսը դարձավ ավելի յուրահատուկ ու ժամանակակից։'],
  ['Լիլիթ Հարությունյան', 'Ուղարկում ես հղումը, և հյուրերը միանգամից տեսնում են ամբողջ անհրաժեշտ տեղեկությունը։'],
  ['Նարե Հովհաննիսյան', 'Դիզայնը շատ պրեմիում էր, իսկ խմբագրելը՝ պարզ և հարմար։'],
  ['Սոնա Ավետիսյան', 'Մեր հյուրերը շատ հավանեցին հրավիրատոմսը։ Շնորհակալ ենք գեղեցիկ աշխատանքի համար։'],
  ['Էլեն Գրիգորյան', 'Ամեն ինչ պատրաստվեց արագ, գեղեցիկ և շատ կոկիկ։'],
  ['Կարեն Պետրոսյան', 'Հրավերը ստացվեց ճիշտ այնպես, ինչպես պատկերացնում էինք։'],
  ['Գոհար Խաչատրյան', 'Նուրբ գույներ, գեղեցիկ դիզայն և շատ հարմար լուծում։'],
  ['Տաթևիկ Մելքոնյան', 'Ամեն մանրուք մտածված էր։ Արդյունքը շատ հաճելի ստացվեց։'],
  ['Վահե Սիմոնյան', 'Հյուրերը հեշտ գտան վայրը, ժամը և միջոցառման բոլոր մանրամասները։'],
  ['Մանե Մարգարյան', 'Շատ որակյալ և գեղեցիկ աշխատանք։ Անպայման խորհուրդ կտամ։'],
  ['Արփի Կարապետյան', 'Amulet-ը մեր միջոցառմանը յուրահատուկ ու էլեգանտ սկիզբ տվեց։']
];

export async function ensureDefaultReviews() {
  const initialized = await Setting.exists({ key: REVIEW_SEED_KEY });
  if (initialized) return;

  await Review.insertMany(defaultReviews.map(([customer, text], index) => ({
    staticKey: `curated-${index + 1}`,
    customer,
    text,
    rating: 5,
    target: 'Amulet',
    language: 'hy',
    source: 'static',
    status: 'approved',
    publishedAt: new Date()
  })), { ordered: false }).catch((error) => {
    if (error?.code !== 11000) throw error;
  });

  await Setting.updateOne(
    { key: REVIEW_SEED_KEY },
    { $set: { value: { initialized: true, initializedAt: new Date() } } },
    { upsert: true }
  );
}
