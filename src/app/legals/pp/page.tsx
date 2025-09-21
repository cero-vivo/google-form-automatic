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
          <Badge variant="outline" className="mb-2">Last updated: September 21, 2025</Badge>
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
            <h4 className="font-semibold">Personal Data</h4>
            <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:</p>
            <ul className="list-disc ml-6">
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Phone number</li>
              <li>Address, State, Province, ZIP/Postal code, City</li>
              <li>Usage Data</li>
            </ul>
            <h4 className="font-semibold mt-4">Usage Data</h4>
            <p>
              Usage Data is collected automatically when using the Service. It may include IP address, browser type, pages visited, time spent, device identifiers, and diagnostic data.
            </p>
            <h4 className="font-semibold mt-4">Information from Third-Party Social Media Services</h4>
            <p>
              The Company allows You to create an account and log in to use the Service through Google, Facebook, Instagram, Twitter, or LinkedIn. We may collect data associated with your social account.
            </p>
            <h4 className="font-semibold mt-4">Information Collected while Using the Application</h4>
            <p>
              With your permission, we may collect location information to provide features and improve our Service.
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
          </section>
          {/* Retention, Transfer, Delete, Disclosure, Security, Children, Links, Changes, Contact */}
          <section>
            <h3 className="text-xl font-semibold mb-2">Retention of Your Personal Data</h3>
            <p>The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy, to comply with legal obligations, resolve disputes, and enforce agreements.</p>
            <h3 className="text-xl font-semibold mb-2">Transfer of Your Personal Data</h3>
            <p>Your information may be transferred to computers located outside of Your jurisdiction. We ensure adequate controls are in place for security and privacy.</p>
            <h3 className="text-xl font-semibold mb-2">Delete Your Personal Data</h3>
            <p>You have the right to delete or request deletion of Your Personal Data. You may update, amend, or delete Your information at any time by signing in to Your Account or contacting Us.</p>
            <h3 className="text-xl font-semibold mb-2">Disclosure of Your Personal Data</h3>
            <ul className="list-disc ml-6">
              <li><strong>Business Transactions:</strong> If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred.</li>
              <li><strong>Law enforcement:</strong> The Company may disclose Your Personal Data if required to do so by law.</li>
              <li><strong>Other legal requirements:</strong> To comply with legal obligations, protect rights, prevent wrongdoing, ensure safety, or protect against liability.</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">Security of Your Personal Data</h3>
            <p>We strive to use commercially acceptable means to protect Your Personal Data, but no method of transmission or storage is 100% secure.</p>
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