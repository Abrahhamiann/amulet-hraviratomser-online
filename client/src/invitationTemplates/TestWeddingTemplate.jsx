import React from 'react';
import { Image as ImageIcon, Pencil, ShoppingBag } from 'lucide-react';
import weddingForest from '../assets/morph/wedding-forest-optimized.jpg';
import weddingSunset from '../assets/morph/wedding-sunset.jpg';

export const isTestTemplate = (template) => {
  const title = template?.title?.trim().toLowerCase();
  const slug = template?.slug?.trim().toLowerCase();
  return title === 'test' || slug === 'test';
};

export const getTestWeddingDraft = () => ({
  mainNames: 'Արամ և Լիլիթ',
  eventDate: '2026-09-11',
  eventTime: '14:30',
  eventLocation: 'Սուրբ Սարգիս եկեղեցի, ք. Երևան, Նալբանդյան 21',
  eventMessage: 'Սիրելի հյուրեր, մենք ցանկանում ենք Ձեզ հետ կիսել մեր կյանքի ամենակարևոր օրերից մեկը և մեծ սիրով հրավիրում ենք Ձեզ մեր հարսանիքին։',
  image: weddingSunset,
  gallery: [weddingSunset, weddingForest]
});

export function TestWeddingCardPreview() {
  return (
    <div className="test-wedding-card-preview" style={{ '--test-wedding-bg': `url(${weddingSunset})` }}>
      <div>
        <span>Սիրելի հյուրեր,</span>
        <strong>11 Սեպտեմբերի</strong>
        <em>2026</em>
      </div>
    </div>
  );
}

const formatArmenianDate = (value) => {
  if (!value) return '11 Սեպտեմբերի';
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('hy-AM', { day: 'numeric', month: 'long' }).format(date);
};

export function TestWeddingLivePreview({ draft, price, onEdit, onOrder, loading }) {
  const heroImage = draft?.image || weddingSunset;
  const dateText = formatArmenianDate(draft?.eventDate);
  const year = draft?.eventDate ? new Date(`${draft.eventDate}T00:00:00`).getFullYear() : 2026;

  return (
    <article className="test-wedding-live" style={{ '--test-wedding-bg': `url(${heroImage})` }}>
      <section className="test-wedding-intro">
        <div className="test-wedding-copy">
          <span className="test-script">Սիրելի հյուրեր,</span>
          <p>{draft?.eventMessage}</p>
          <strong className="test-script">{dateText}</strong>
          <strong className="test-script">{year}</strong>
          <i />
          <div className="test-wedding-event">
            <span className="test-script">{draft?.eventTime || '14:30'}</span>
            <small>ՊՍԱԿԱԴՐՈՒԹՅՈՒՆ</small>
            <b>{draft?.eventLocation || 'Սուրբ Սարգիս եկեղեցի'}</b>
          </div>
          <button type="button">ԻՆՉՊԵՍ ՀԱՍՆԵԼ</button>
          <div className="test-wedding-event">
            <span className="test-script">18:00</span>
            <small>ՀԱՐՍԱՆՅԱՑ ՀԱՆԴԻՍՈՒԹՅՈՒՆ</small>
            <b>Florence ռեստորանային համալիր</b>
          </div>
        </div>
      </section>

      <section className="test-wedding-rsvp-mock">
        <div className="test-color-dots" aria-hidden="true">
          {['#b97b7e', '#c69092', '#d5779d', '#571b2d', '#d7cfbb', '#f1d785', '#9a7543', '#704329', '#9d9f18', '#4a591a', '#8ca8c9', '#4d667d', '#12376b', '#111'].map((color) => (
            <span key={color} style={{ background: `radial-gradient(circle at 35% 30%, #fff8, transparent 24%), ${color}` }} />
          ))}
        </div>
        <h2>Խնդրում ենք հաստատել Ձեր ներկայությունը</h2>
        <p>Կսպասենք ձեր պատասխանի մինչև օգոստոսի 15-ը</p>
        <div className="test-rsvp-lines">
          <label><input type="radio" name="testSide" /> Հարսի կողմ</label>
          <label><input type="radio" name="testSide" /> Փեսայի կողմ</label>
          <span>Անուն Ազգանուն</span>
          <label><input type="radio" name="testAnswer" defaultChecked /> Մենք կգանք</label>
          <label><input type="radio" name="testAnswer" /> Չենք կարող գալ :(</label>
          <span>Հյուրերի թիվ</span>
          <span>Մեկնաբանություն (ոչ պարտադիր)</span>
        </div>
        <button type="button">Ուղարկել</button>
      </section>

      <section className="test-wedding-photo">
        <img src={draft?.gallery?.[1] || weddingForest} alt={draft?.mainNames || 'Wedding'} />
        <div>
          <ImageIcon size={20} />
          <span className="test-script">{draft?.mainNames || 'Արամ և Լիլիթ'}</span>
        </div>
      </section>

      <section className="test-wedding-actions">
        <div>
          <span>Հրավերի արժեքը</span>
          <strong>{Number(price || 29000).toLocaleString()} AMD</strong>
        </div>
        <div>
          <button className="btn btn-ghost" type="button" onClick={onEdit}>
            <Pencil size={18} />
            Խմբագրել
          </button>
          <button className="btn btn-primary" type="button" onClick={onOrder} disabled={loading}>
            <ShoppingBag size={18} />
            {loading ? 'Բեռնվում է...' : 'Պատվիրել այս հրավերը'}
          </button>
        </div>
      </section>
    </article>
  );
}

export function TestWeddingInvitationView({ draft, daysLeftText, actions, rsvpForm }) {
  const heroImage = draft?.image || draft?.gallery?.[0] || weddingSunset;
  const dateText = formatArmenianDate(draft?.eventDate);
  const year = draft?.eventDate ? new Date(`${draft.eventDate}T00:00:00`).getFullYear() : 2026;
  const photoImage = draft?.gallery?.[1] || draft?.gallery?.[0] || weddingForest;

  return (
    <article className="test-wedding-live test-wedding-public" style={{ '--test-wedding-bg': `url(${heroImage})` }}>
      <section className="test-wedding-intro">
        <div className="test-wedding-copy">
          <span className="test-script">Սիրելի հյուրեր,</span>
          <p>{draft?.eventMessage}</p>
          <strong className="test-script">{dateText}</strong>
          <strong className="test-script">{year}</strong>
          <i />
          <div className="test-wedding-event">
            <span className="test-script">{draft?.eventTime || '14:30'}</span>
            <small>ՊՍԱԿԱԴՐՈՒԹՅՈՒՆ</small>
            <b>{draft?.eventLocation || 'Սուրբ Սարգիս եկեղեցի'}</b>
          </div>
          <button type="button">ԻՆՉՊԵՍ ՀԱՍՆԵԼ</button>
          <div className="test-wedding-event">
            <span className="test-script">18:00</span>
            <small>ՀԱՐՍԱՆՅԱՑ ՀԱՆԴԻՍՈՒԹՅՈՒՆ</small>
            <b>Florence ռեստորանային համալիր</b>
          </div>
        </div>
      </section>

      <section className="test-wedding-rsvp-mock test-wedding-rsvp-real">
        <div className="test-color-dots" aria-hidden="true">
          {['#b97b7e', '#c69092', '#d5779d', '#571b2d', '#d7cfbb', '#f1d785', '#9a7543', '#704329', '#9d9f18', '#4a591a', '#8ca8c9', '#4d667d', '#12376b', '#111'].map((color) => (
            <span key={color} style={{ background: `radial-gradient(circle at 35% 30%, #fff8, transparent 24%), ${color}` }} />
          ))}
        </div>
        <h2>Խնդրում ենք հաստատել Ձեր ներկայությունը</h2>
        <p>Կսպասենք Ձեր պատասխանին մինչև միջոցառման օրը</p>
        {rsvpForm}
      </section>

      <section className="test-wedding-photo">
        <img
          src={photoImage}
          alt={draft?.mainNames || 'Wedding'}
          onError={(event) => {
            event.currentTarget.src = weddingForest;
          }}
        />
        <div>
          <ImageIcon size={20} />
          <span className="test-script">{draft?.mainNames || 'Արամ և Լիլիթ'}</span>
        </div>
      </section>

      <section className="test-wedding-actions">
        <div>
          <span>{daysLeftText}</span>
          <strong>{draft?.eventLocation}</strong>
        </div>
        <div>{actions}</div>
      </section>
    </article>
  );
}
