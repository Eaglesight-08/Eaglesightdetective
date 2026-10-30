import { articles, formatDate } from '@/lib/content';
import PageHead from '@/components/PageHead';
import PostCard from '@/components/PostCard';

export const metadata = {
  title: 'Insights',
  description: 'Practical cyber security guides, scam alerts and forensic explainers from Eaglesight investigators.',
};

export default function InsightsPage() {
  const [feature, ...rest] = articles;
  return (
    <>
      <PageHead eyebrow="Insights" title="Guides, alerts and explainers">
        Practical advice from our investigators on staying safe online, responding to incidents and handling digital
        evidence correctly.
      </PageHead>

      <section className="section">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 32 }}>
            <PostCard post={feature} date={formatDate(feature.date)} feature />
          </div>
          <div className="grid-3">
            {rest.map((a) => (
              <div key={a.slug} className="reveal"><PostCard post={a} date={formatDate(a.date)} /></div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
