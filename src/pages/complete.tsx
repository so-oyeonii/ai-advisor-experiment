import { Check, AlertTriangle, Mail, FileText, Shield, UserX } from 'lucide-react';

export default function CompletePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thank You!
          </h1>
          <p className="text-lg text-gray-600">
            You have successfully completed the study.
          </p>
        </div>

        {/* Debriefing Title */}
        <div className="bg-blue-600 text-white rounded-t-xl px-6 py-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText size={24} />
            Debriefing: Important Information About This Study
          </h2>
        </div>

        {/* Debriefing Content */}
        <div className="bg-white rounded-b-xl shadow-lg p-6 space-y-6">
          {/* Introduction */}
          <div className="text-gray-700 leading-relaxed">
            <p className="font-medium text-lg mb-2">To Our Valued Research Participants,</p>
            <p>
              Thank you very much for your valuable time and participation in this study.
              Before concluding the research session, we would like to explain the true purpose
              of this study and some important details regarding the experimental settings used.
            </p>
          </div>

          {/* Section 1: Background and Purpose */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-5">
            <h3 className="font-bold text-blue-900 text-lg mb-3">
              1. Background and Purpose of the Study
            </h3>
            <p className="text-blue-800 leading-relaxed">
              The purpose of this study was to understand how consumers process and evaluate
              product information provided by different sources (AI Systems vs. Human Experts)
              in an online shopping environment, particularly when these sources present opinions
              that are either consistent or incongruent with general consumer reviews. Through this,
              we aimed to investigate the differences in psychological mechanisms regarding
              persuasion resistance between AI and human advisors.
            </p>
          </div>

          {/* Section 2: Deception Disclosure */}
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-5">
            <h3 className="font-bold text-amber-900 text-lg mb-3 flex items-center gap-2">
              <AlertTriangle size={20} />
              2. Important Notice Regarding Research Materials (Disclosure of Deception)
            </h3>
            <p className="text-amber-800 mb-4 leading-relaxed">
              To observe realistic shopping experiences, this study inevitably included
              information that differed from reality (Deception). We would like to clarify the facts as follows:
            </p>

            <div className="space-y-4 text-amber-900">
              <div className="bg-white/50 rounded-lg p-4">
                <p className="font-semibold mb-1">Fictional Nature of Platform and Features</p>
                <p className="text-sm leading-relaxed">
                  The shopping website interface and the &apos;Expert/AI Review Feature&apos; you experienced
                  were fictional settings created solely for the purpose of this experiment.
                  Specifically, the description presenting it as a &quot;new feature from Amazon&quot; was
                  a scenario designed to enhance immersion. <strong>Amazon is NOT actually developing
                  or providing this specific feature.</strong>
                </p>
              </div>

              <div className="bg-white/50 rounded-lg p-4">
                <p className="font-semibold mb-1">No Affiliation with Amazon</p>
                <p className="text-sm leading-relaxed">
                  This study is not affiliated, associated, authorized, endorsed by, or in any way
                  officially connected with Amazon.com, Inc. or any of its subsidiaries. The brand
                  logos and UI elements were used strictly for research purposes to increase realism.
                  Any resemblance to actual products or features is purely coincidental.
                </p>
              </div>

              <div className="bg-white/50 rounded-lg p-4">
                <p className="font-semibold mb-1">Fabrication of Products and Reviews</p>
                <p className="text-sm leading-relaxed">
                  The product information and all associated reviews (including Expert Reviews,
                  AI Advice, and General Consumer Reviews) were arbitrarily created and manipulated
                  by the research team for experimental purposes. Therefore, the information presented
                  does not reflect actual product performance or real consumer experiences.
                </p>
              </div>

              <div className="bg-white/50 rounded-lg p-4">
                <p className="font-semibold mb-1">Manipulation of Information Source</p>
                <p className="text-sm leading-relaxed">
                  While the reviews were labeled as being written by either an &apos;AI&apos; or a &apos;Human Expert,&apos;
                  this was also part of the experimental manipulation where the same content was
                  presented with different source labels.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Reason for Not Disclosing */}
          <div className="bg-gray-50 border-l-4 border-gray-400 rounded-r-lg p-5">
            <h3 className="font-bold text-gray-800 text-lg mb-3">
              3. Reason for Not Disclosing Full Information in Advance
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We ask for your understanding regarding why we could not disclose these facts
              (review manipulation, fictional settings, etc.) prior to the study. If participants
              were aware that these elements were fictional beforehand, it could have distorted
              the natural process of information processing and evaluation. To measure consumers&apos;
              unconscious and natural reactions, we were obliged to present the scenario as if
              it were a real-world situation.
            </p>
          </div>

          {/* Section 4: Right to Withdraw */}
          <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-5">
            <h3 className="font-bold text-red-900 text-lg mb-3 flex items-center gap-2">
              <UserX size={20} />
              4. Right to Withdraw Data
            </h3>
            <p className="text-red-800 leading-relaxed">
              Now that you are aware of the full truth regarding the study, you have the right
              to request the withdrawal of your data immediately if you feel uncomfortable with
              the deceptive procedures used or do not wish for your data to be used in the research.
              <strong> There will be no penalty or disadvantage for withdrawing your data, and you
              will still receive the participation compensation as promised.</strong>
            </p>
          </div>

          {/* Section 5: Contact */}
          <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-5">
            <h3 className="font-bold text-green-900 text-lg mb-3 flex items-center gap-2">
              <Mail size={20} />
              5. Contact Information
            </h3>
            <p className="text-green-800 leading-relaxed">
              If you have any further questions regarding the research procedures or the content,
              or if you wish to receive additional information about the study results after completion,
              please do not hesitate to contact the research team.
            </p>
            <div className="mt-3">
              <a
                href="mailto:zenxy@g.skku.edu"
                className="inline-flex items-center gap-2 text-green-700 font-semibold hover:text-green-900 transition"
              >
                <Mail size={16} />
                zenxy@g.skku.edu
              </a>
            </div>
          </div>

          {/* Confidentiality Notice */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
            <Shield size={24} className="text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-purple-900 mb-1">Confidentiality</h4>
              <p className="text-purple-800 text-sm leading-relaxed">
                Your data will be kept strictly confidential and used solely for academic research purposes.
                No personally identifiable information was collected.
              </p>
            </div>
          </div>

          {/* Closing Message */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-700 font-medium text-lg">
              Once again, we deeply appreciate your time and contribution to this research.
            </p>
          </div>
        </div>

        {/* Backup Completion Code */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-900 text-lg mb-3 text-center">Completion Code (Backup)</h3>
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-2xl font-mono font-bold text-blue-600 tracking-wider select-all">
              7DE64B7FBE
            </p>
          </div>
          <p className="text-center text-gray-500 text-sm mt-2">
            If automatic redirect fails, copy and paste this code to Cloud Research
          </p>
        </div>

        {/* Cloud Research Redirect Button */}
        <div className="mt-6">
          <button
            onClick={() => window.location.href = 'https://connect.cloudresearch.com/participant/project/7DE64B7FBE/complete'}
            className="w-full bg-green-600 text-white px-6 py-4 rounded-xl hover:bg-green-700 transition font-semibold text-lg shadow-md"
          >
            Complete Survey & Return to Cloud Research
          </button>
          <p className="text-center text-gray-500 text-sm mt-2">
            Click the button above to complete your participation and receive compensation
          </p>
        </div>
      </div>
    </div>
  );
}
