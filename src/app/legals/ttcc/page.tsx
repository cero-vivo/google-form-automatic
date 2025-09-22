'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export default function TTCCPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <Logo className="mb-2" />
          <CardTitle className="text-3xl font-bold mb-2">Terms and Conditions</CardTitle>
          <Badge variant="outline" className="mb-2">Last updated: September 21, 2025</Badge>
          <p className="text-muted-foreground">Please read these terms and conditions carefully before using Our Service.</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Personal Data Collected (Google Auth + Drive) */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Personal Data Collected (Google Auth + Drive)</h2>
            <ul className="list-disc ml-6 mb-4">
              <li><strong>What we collect:</strong> name, email address, profile photo (according to basic Google Auth permissions).</li>
              <li><strong>Drive:</strong> access to create/store forms in the user's account, only with explicit authorization.</li>
              <li><strong>Storage period:</strong> while the user has an active account. If the account is deleted, your data is removed from our servers.</li>
              <li><strong>Right to erasure:</strong> the user may request deletion by sending an email to our support address.</li>
            </ul>
            <p className="mb-2"><strong>Clause:</strong></p>
            <p className="bg-gray-100 rounded p-3 text-sm">
              We collect basic information from the user's Google Account (name, email address, and profile photo) solely to enable login and personalize the experience. Additionally, with the user's authorization, we may access Google Drive to create and store forms linked to their account.<br /><br />
              This data is retained while the account remains active. The user may request deletion of their account and associated data at any time by contacting us at <a href="mailto:luis.espinoza.nav@outlook.com" className="underline text-blue-600">luis.espinoza.nav@outlook.com</a>.
            </p>
          </section>
          {/* ...existing code... */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Interpretation and Definitions</h2>
            <h3 className="font-medium">Interpretation</h3>
            <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
            <h3 className="font-medium mt-4">Definitions</h3>
            <ul className="list-disc ml-6">
              <li><strong>Application:</strong> means the software program provided by the Company downloaded by You on any electronic device, named FastForm</li>
              <li><strong>Application Store:</strong> means the digital distribution service operated and developed by Apple Inc. (Apple App Store) or Google Inc. (Google Play Store) in which the Application has been downloaded.</li>
              <li><strong>Affiliate:</strong> means an entity that controls, is controlled by or is under common control with a party.</li>
              <li><strong>Country:</strong> Argentina</li>
              <li><strong>Company:</strong> ("We", "Us" or "Our") refers to Fast Form.</li>
              <li><strong>Device:</strong> any device that can access the Service (computer, cellphone, tablet).</li>
              <li><strong>Service:</strong> refers to the Application or the Website or both.</li>
              <li><strong>Terms and Conditions:</strong> these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.</li>
              <li><strong>Third-party Social Media Service:</strong> any services or content provided by a third-party that may be displayed, included or made available by the Service.</li>
              <li>
                <strong>Website:</strong> Fast Form, accessible from {" "}
                <Link href="https://www.fastform.com" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">https://www.fastform.com</Link>
              </li>
              <li><strong>You:</strong> the individual or entity accessing or using the Service.</li>
            </ul>
          </section>
          {/* ...existing code... */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Acknowledgment</h2>
            <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
            <p>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>
            <p>By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.</p>
            <p>You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.</p>
            <p>Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. Our Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your personal information when You use the Application or the Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service.</p>
          </section>
          {/* ...existing code... */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Links to Other Websites</h2>
            <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company.</p>
            <p>The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.</p>
            <p>We strongly advise You to read the terms and conditions and privacy policies of any third-party web sites or services that You visit.</p>
          </section>
          {/* ...existing code... */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Termination</h2>
            <p>We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.</p>
            <p>Upon termination, Your right to use the Service will cease immediately.</p>
          </section>
          {/* ...existing code... */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Limitation of Liability</h2>
            <p>Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 USD if You haven't purchased anything through the Service.</p>
            <p>To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of this Terms), even if the Company or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.</p>
            <p>Some states do not allow the exclusion of implied warranties or limitation of liability for incidental or consequential damages, which means that some of the above limitations may not apply. In these states, each party's liability will be limited to the greatest extent permitted by law.</p>
          </section>
          {/* ...existing code... */}
          <section>
            <h2 className="text-xl font-semibold mb-2">"AS IS" and "AS AVAILABLE" Disclaimer</h2>
            <p>The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may arise out of course of dealing, course of performance, usage or trade practice. Without limitation to the foregoing, the Company provides no warranty or undertaking, and makes no representation of any kind that the Service will meet Your requirements, achieve any intended results, be compatible or work with any other software, applications, systems or services, operate without interruption, meet any performance or reliability standards or be error free or that any errors or defects can or will be corrected.</p>
            <p>Without limiting the foregoing, neither the Company nor any of the company's provider makes any representation or warranty of any kind, express or implied: (i) as to the operation or availability of the Service, or the information, content, and materials or products included thereon; (ii) that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of any information or content provided through the Service; or (iv) that the Service, its servers, the content, or e-mails sent from or on behalf of the Company are free of viruses, scripts, trojan horses, worms, malware, timebombs or other harmful components.</p>
            <p>Some jurisdictions do not allow the exclusion of certain types of warranties or limitations on applicable statutory rights of a consumer, so some or all of the above exclusions and limitations may not apply to You. But in such a case the exclusions and limitations set forth in this section shall be applied to the greatest extent enforceable under applicable law.</p>
          </section>
          {/* ...existing code... */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Governing Law</h2>
            <p>The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.</p>
          </section>
          {/* ...existing code... */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Disputes Resolution</h2>
            <p>If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company.</p>
          </section>
          {/* ...existing code... */}
          <section>
            <h2 className="text-xl font-semibold mb-2">For European Union (EU) Users</h2>
            <p>If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which You are resident.</p>
          </section>
          {/* ...existing code... */}
          <section>
            <h2 className="text-xl font-semibold mb-2">United States Legal Compliance</h2>
            <p>You represent and warrant that (i) You are not located in a country that is subject to the United States government embargo, or that has been designated by the United States government as a "terrorist supporting" country, and (ii) You are not listed on any United States government list of prohibited or restricted parties.</p>
          </section>
          {/* ...existing code... */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Severability and Waiver</h2>
            <h3 className="font-medium">Severability</h3>
            <p>If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.</p>
            <h3 className="font-medium mt-4">Waiver</h3>
            <p>Except as provided herein, the failure to exercise a right or to require performance of an obligation under these Terms shall not affect a party's ability to exercise such right or require such performance at any time thereafter nor shall the waiver of a breach constitute a waiver of any subsequent breach.</p>
          </section>
          {/* ...existing code... */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Translation Interpretation</h2>
            <p>These Terms and Conditions may have been translated if We have made them available to You on our Service.
            You agree that the original English text shall prevail in the case of a dispute.</p>
          </section>
          {/* ...existing code... */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Changes to These Terms and Conditions</h2>
            <p>We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.</p>
            <p>By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the website and the Service.</p>
          </section>
          {/* ...existing code... */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
            <p>If you have any questions about these Terms and Conditions, You can contact us:</p>
            <ul className="list-disc ml-6">
              <li>By email: <a href="mailto:luis.espinoza.nav@outlook.com" className="underline text-blue-600">luis.espinoza.nav@outlook.com</a></li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
    
