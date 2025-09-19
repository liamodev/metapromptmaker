import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
            
            <h2>Data Collection</h2>
            <p>
              Meta Prompt Maker collects minimal data to provide and improve our service:
            </p>
            <ul>
              <li>Prompts you submit and our responses (stored anonymously)</li>
              <li>Usage analytics (hashed IP addresses, user agents)</li>
              <li>Performance metrics and error logs</li>
            </ul>

            <h2>Data Usage</h2>
            <p>We use collected data to:</p>
            <ul>
              <li>Provide the prompt optimization service</li>
              <li>Improve our AI models and responses</li>
              <li>Monitor system performance and reliability</li>
              <li>Prevent abuse and ensure security</li>
            </ul>

            <h2>Data Storage</h2>
            <p>
              All data is stored securely in encrypted databases. We implement industry-standard 
              security measures to protect your information.
            </p>

            <h2>Data Sharing</h2>
            <p>
              We do not sell, rent, or share your personal data with third parties, except:
            </p>
            <ul>
              <li>When required by law or legal process</li>
              <li>To protect our rights and prevent fraud</li>
              <li>With service providers who help us operate the platform</li>
            </ul>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Request access to your data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of analytics tracking</li>
            </ul>

            <h2>Contact</h2>
            <p>
              For privacy-related questions or requests, please contact us at privacy@altitude7.com
            </p>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
