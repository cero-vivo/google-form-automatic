'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import React from "react";


export default function PPPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <Logo className="mb-2" />
          <CardTitle className="text-3xl font-bold mb-2">Privacy Policy</CardTitle>
          <Badge variant="outline" className="mb-2">Last updated: October 2, 2025</Badge>
          <p className="text-muted-foreground">
            This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Interpretation and Definitions */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Interpretation and Definitions</h2>
            <h3 className="font-medium">Interpretation</h3>
            <p>
              The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
            </p>
            <h3 className="font-medium mt-4">Definitions</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li><strong>Account:</strong> means a unique account created for You to access our Service or parts of our Service.</li>
              <li><strong>Affiliate:</strong> means an entity that controls, is controlled by or is under common control with a party.</li>
              <li><strong>Application:</strong> refers to Fast Form, the software program provided by the Company.</li>
              <li><strong>Company:</strong> refers to Fast Form ("We", "Us" or "Our").</li>
              <li><strong>Cookies:</strong> are small files placed on Your device by a website, containing browsing details.</li>
              <li><strong>Country:</strong> Argentina</li>
              <li><strong>Device:</strong> any device that can access the Service (computer, cellphone, tablet).</li>
              <li><strong>Personal Data:</strong> any information that relates to an identified or identifiable individual.</li>
              <li><strong>Service:</strong> refers to the Application or the Website or both.</li>
              <li><strong>Service Provider:</strong> third-party processing data on behalf of the Company.</li>
              <li><strong>Third-party Social Media Service:</strong> any website or social network for login/account creation.</li>
              <li><strong>Usage Data:</strong> data collected automatically by use of the Service.</li>
              <li>
                <strong>Website:</strong> Fast Form, accessible from {" "}
                <Link href="https://www.fastform.pro" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">www.fastform.pro</Link>
              </li>
              <li><strong>You:</strong> the individual or entity accessing or using the Service.</li>
            </ul>
          </section>
          {/* Collecting and Using Your Personal Data */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Collecting and Using Your Personal Data</h2>
            <h3 className="font-medium">Types of Data Collected</h3>
            
            {/* Google User Data Section */}
            <h4 className="font-semibold">Google User Data</h4>
            <p>When you authenticate with Google, our application accesses the following specific types of Google user data:</p>
            <ul className="list-disc ml-6 mb-4">
              <li><strong>Google Account Information:</strong> Your email address, first name, last name, and profile photo from your Google account</li>
              <li><strong>Google Forms Data:</strong> Access to create, view, edit, and manage Google Forms in your Google account, including form structure, questions, responses, and settings</li>
              <li><strong>Google Drive Data:</strong> Limited access ONLY to files created by FastForm in your Google Drive. We cannot access any other files in your Drive.</li>
              <li><strong>Form Responses:</strong> Access to view and analyze responses submitted to your Google Forms</li>
            </ul>
            <p className="mb-4"><strong>Specific Google API Scopes:</strong></p>
            <ul className="list-disc ml-6 mb-4">
              <li><code>https://www.googleapis.com/auth/forms</code> - Full access to Google Forms</li>
              <li><code>https://www.googleapis.com/auth/forms.body</code> - Access to form content and structure</li>
              <li><code>https://www.googleapis.com/auth/drive.file</code> - Access to files created by the app in Google Drive</li>
              <li><code>email</code> - Access to your email address</li>
              <li><code>profile</code> - Access to your basic profile information</li>
            </ul>
            
            <h4 className="font-semibold">Other Personal Data</h4>
            <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:</p>
            <ul className="list-disc ml-6">
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Phone number (optional)</li>
              <li>Usage Data</li>
            </ul>
            <h4 className="font-semibold mt-4">Usage Data</h4>
            <p>
              Usage Data is collected automatically when using the Service. It may include IP address, browser type, pages visited, time spent, device identifiers, and diagnostic data.
            </p>
            <h4 className="font-semibold mt-4">Information from Third-Party Social Media Services</h4>
            <p>
              The Company allows You to create an account and log in to use the Service through Google authentication. We may collect data associated with your Google account as specified above.
            </p>
            <h4 className="font-semibold mt-4">Tracking Technologies and Cookies</h4>
            <p>
              We use Cookies and similar technologies (beacons, tags, scripts) to track activity and store information. You can refuse Cookies via browser settings, but some features may not work.
            </p>
            <ul className="list-disc ml-6">
              <li><strong>Essential Cookies:</strong> Required for Service functionality.</li>
              <li><strong>Acceptance Cookies:</strong> Identify if users accepted cookies.</li>
              <li><strong>Functionality Cookies:</strong> Remember choices and preferences.</li>
            </ul>
            <p>
              For more information about the cookies we use and your choices regarding cookies, please visit our Cookies Policy or the Cookies section of our Privacy Policy.
            </p>
          </section>
          {/* Use of Your Personal Data */}
          <section>
            <h3 className="text-xl font-semibold mb-2">Use of Your Personal Data</h3>
            
            <h4 className="font-semibold">Use of Google User Data</h4>
            <p className="mb-4">We use your Google user data exclusively for the following purposes:</p>
            <ul className="list-disc ml-6 mb-4">
              <li><strong>Google Forms Creation & Management:</strong> To create, edit, delete, and manage Google Forms on your behalf using Google Forms API</li>
              <li><strong>Form Storage:</strong> To store your forms in your Google Drive account and access them when needed</li>
              <li><strong>Form Responses:</strong> To retrieve and display responses to your forms for analysis and management purposes</li>
              <li><strong>Account Authentication:</strong> To verify your identity and provide personalized access to your forms</li>
              <li><strong>Service Integration:</strong> To seamlessly integrate with your Google workspace and maintain synchronization</li>
            </ul>
            <p className="mb-4"><strong>Important:</strong> We do not access, read, or modify any of your other Google Drive files beyond the Google Forms that you create or manage through our service.</p>
            
            <h4 className="font-semibold">General Use of Personal Data</h4>
            <ul className="list-disc ml-6">
              <li><strong>To provide and maintain our Service</strong>, including to monitor the usage of our Service.</li>
              <li><strong>To manage Your Account:</strong> to manage Your registration as a user of the Service.</li>
              <li><strong>For the performance of a contract:</strong> the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</li>
              <li><strong>To contact You:</strong> by email, telephone, SMS, or other electronic communication regarding updates or informative communications.</li>
              <li><strong>To provide You</strong> with news, special offers and general information about other goods, services and events which we offer.</li>
              <li><strong>To manage Your requests:</strong> To attend and manage Your requests to Us.</li>
              <li><strong>For business transfers:</strong> We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets.</li>
              <li><strong>For other purposes</strong>: data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.</li>
            </ul>
            <p>We may share Your personal information in the following situations:</p>
            <ul className="list-disc ml-6">
              <li><strong>With Service Providers:</strong> to monitor and analyze the use of our Service, to contact You.</li>
              <li><strong>For business transfers:</strong> in connection with, or during negotiations of, any merger, sale of Company assets, financing, or acquisition.</li>
              <li><strong>With Affiliates:</strong> Our parent company and any other subsidiaries, joint venture partners or other companies that We control or that are under common control with Us.</li>
              <li><strong>With business partners:</strong> to offer You certain products, services or promotions.</li>
              <li><strong>With other users:</strong> when You share personal information or interact in public areas with other users.</li>
              <li><strong>With Your consent</strong>: for any other purpose with Your consent.</li>
            </ul>
            
            <h4 className="font-semibold mt-4">Sharing of Google User Data</h4>
            <p className="mb-4"><strong>We do NOT share your Google user data with third parties.</strong> Specifically:</p>
            <ul className="list-disc ml-6 mb-4">
              <li><strong>Google Forms Data:</strong> Your forms, form content, and form responses remain private and are not shared with any third parties</li>
              <li><strong>Google Drive Access:</strong> We only access the specific Google Forms files you create through our service</li>
              <li><strong>Google Account Information:</strong> Your Google profile information is used solely for authentication and service personalization</li>
              <li><strong>No Data Mining:</strong> We do not analyze, mine, or use your Google data for advertising or marketing purposes</li>
              <li><strong>No Third-party Sales:</strong> We never sell, rent, or lease your Google user data to any third party</li>
            </ul>
            <p className="mb-4"><strong>Exception:</strong> Google user data may only be disclosed if required by law, legal process, or to protect the rights and safety of our users and the public, in compliance with Google's User Data Policy.</p>
          </section>
          {/* Retention, Transfer, Delete, Disclosure, Security, Children, Links, Changes, Contact */}
          <section>
            <h3 className="text-xl font-semibold mb-2">Retention of Your Personal Data</h3>
            <p className="mb-4">The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy, to comply with legal obligations, resolve disputes, and enforce agreements.</p>
            
            <h4 className="font-semibold">Google User Data Retention</h4>
            <ul className="list-disc ml-6 mb-4">
              <li><strong>Access Tokens:</strong> Google access tokens are retained only while your account is active and are automatically refreshed or expired according to Google's token lifecycle</li>
              <li><strong>Form Data:</strong> We do not permanently store your Google Forms content. Form data is accessed directly from your Google account when needed</li>
              <li><strong>Profile Information:</strong> Basic Google profile information (name, email, photo) is retained while your account is active for authentication and personalization</li>
              <li><strong>Usage Metadata:</strong> Minimal usage data may be retained for up to 12 months for service improvement and security purposes</li>
              <li><strong>Automatic Cleanup:</strong> Expired tokens and temporary data are automatically removed from our systems</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2">Delete Your Personal Data</h3>
            <p className="mb-4">You have the right to delete or request deletion of Your Personal Data. You may update, amend, or delete Your information at any time by signing in to Your Account or contacting Us.</p>
            
            <h4 className="font-semibold">Google User Data Deletion</h4>
            <p className="mb-4">You can request deletion of your Google user data through the following methods:</p>
            <ul className="list-disc ml-6 mb-4">
              <li><strong>Account Deletion:</strong> When you delete your FastForm account, all associated Google tokens and profile data are immediately removed from our systems</li>
              <li><strong>Revoke Access:</strong> You can revoke FastForm's access to your Google account at any time through your Google Account settings at <Link href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">https://myaccount.google.com/permissions</Link></li>
              <li><strong>Data Deletion Request:</strong> Contact us at luis.espinoza.nav@outlook.com to request specific data deletion</li>
              <li><strong>Automatic Removal:</strong> If you don't use our service for 12 months, your data will be automatically scheduled for deletion</li>
            </ul>
            <p className="mb-4"><strong>Important:</strong> Your Google Forms and their content remain in your Google Drive account and are not deleted when you remove access to FastForm. You maintain full control over your Google data through your Google account.</p>
            
            <h3 className="text-xl font-semibold mb-2">Transfer of Your Personal Data</h3>
            <p className="mb-4">Your information may be transferred to computers located outside of Your jurisdiction. We ensure adequate controls are in place for security and privacy.</p>
            <p className="mb-4"><strong>Google User Data:</strong> Your Google user data is processed in compliance with Google's terms of service and data protection requirements. Data transfers are secured and comply with applicable privacy regulations.</p>
            <h3 className="text-xl font-semibold mb-2">Disclosure of Your Personal Data</h3>
            <ul className="list-disc ml-6">
              <li><strong>Business Transactions:</strong> If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred.</li>
              <li><strong>Law enforcement:</strong> The Company may disclose Your Personal Data if required to do so by law.</li>
              <li><strong>Other legal requirements:</strong> To comply with legal obligations, protect rights, prevent wrongdoing, ensure safety, or protect against liability.</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">Security of Your Personal Data</h3>
            <p className="mb-4">We strive to use commercially acceptable means to protect Your Personal Data, but no method of transmission or storage is 100% secure.</p>
            
            <h4 className="font-semibold">Protection of Google User Data</h4>
            <p className="mb-4">We implement specific security measures to protect your Google user data:</p>
            <ul className="list-disc ml-6 mb-4">
              <li><strong>Secure Token Storage:</strong> Google access tokens are stored securely using encryption and are not accessible to unauthorized personnel</li>
              <li><strong>Limited Access:</strong> Our application only requests the minimum necessary permissions (scopes) required for functionality</li>
              <li><strong>Secure Transmission:</strong> All communications with Google APIs use HTTPS encryption</li>
              <li><strong>Access Control:</strong> Only authenticated users can access their own Google data through our service</li>
              <li><strong>Regular Security Reviews:</strong> We regularly review and update our security practices to comply with Google's security requirements</li>
              <li><strong>No Local Storage:</strong> Sensitive Google data is not permanently stored on our servers beyond what's necessary for service functionality</li>
            </ul>
            
            <h4 className="font-semibold">Data Storage & Protection Practices</h4>
            <ul className="list-disc ml-6 mb-4">
              <li><strong>Authentication Tokens:</strong> Temporarily stored with expiration times and automatic renewal mechanisms</li>
              <li><strong>Form Metadata:</strong> Only essential form information is cached to improve performance, with regular cleanup</li>
              <li><strong>User Profiles:</strong> Basic Google profile information is stored securely for account management</li>
              <li><strong>Encryption:</strong> All sensitive data is encrypted both in transit and at rest</li>
              <li><strong>Access Logs:</strong> We maintain security logs to monitor access and detect unauthorized activities</li>
            </ul>
            <h2 className="text-xl font-semibold mb-2">Children's Privacy</h2>
            <p>We do not knowingly collect information from anyone under the age of 13. If you are a parent and become aware that your child has provided us with Personal Data, please contact us.</p>
            <h2 className="text-xl font-semibold mb-2">Links to Other Websites</h2>
            <p>Our Service may contain links to other websites not operated by Us. We advise you to review the Privacy Policy of every site you visit.</p>
            <h2 className="text-xl font-semibold mb-2">Changes to this Privacy Policy</h2>
            <p>We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
            <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, You can contact us:</p>
            <ul className="list-disc ml-6">
              <li>By email: luis.espinoza.nav@outlook.com</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}