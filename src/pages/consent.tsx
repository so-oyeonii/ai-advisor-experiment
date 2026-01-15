// Consent page with IRB-compliant informed consent form
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { assignConditionByNumber } from '@/lib/randomization';
import { saveSession, getKSTTimestamp, getNextParticipantNumber } from '@/lib/firebase';
import { useSurvey } from '@/contexts/SurveyContext';
import { Mail, Shield, Clock, DollarSign, Users, FileText, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export default function ConsentPage() {
  const router = useRouter();
  const { initializeSurvey } = useSurvey();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Consent checkboxes
  const [personalInfoConsent, setPersonalInfoConsent] = useState<string>('');
  const [futureDataConsent, setFutureDataConsent] = useState<string>('');
  const [finalAgreement, setFinalAgreement] = useState(false);

  // Expandable sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    background: true,
    method: false,
    benefits: false,
    confidentiality: false,
    risks: false,
    guidelines: false,
    period: false,
    voluntary: false,
    futureUse: false,
    rights: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Cloud Research URL 파라미터에서 workerId 추출
  const getCloudResearchParams = () => {
    if (!router.isReady) return { workerId: '', assignmentId: '', hitId: '' };

    const workerId = (
      router.query.participant ||
      router.query.participantId ||
      router.query.workerId ||
      router.query.worker_id ||
      router.query.PROLIFIC_PID ||
      ''
    ) as string;
    const assignmentId = (router.query.assignmentId || router.query.assignment_id || '') as string;
    const hitId = (router.query.hitId || router.query.hit_id || '') as string;

    return { workerId, assignmentId, hitId };
  };

  // Check if form is valid
  const isFormValid = personalInfoConsent === 'no_pii' && futureDataConsent !== '' && finalAgreement;

  const handleContinue = async (e: FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('🚀 Starting consent process...');

      const { workerId, assignmentId, hitId } = getCloudResearchParams();
      if (workerId) {
        console.log('✅ Cloud Research workerId:', workerId);
      }

      const participantId = uuidv4();
      console.log('✅ Generated participant ID:', participantId);

      const participantNumber = await getNextParticipantNumber();
      console.log('✅ Got participant number:', participantNumber);

      const experimentCondition = assignConditionByNumber(participantId, participantNumber);
      console.log('✅ Assigned condition (pattern', participantNumber % 240, '):', experimentCondition);

      const firstCondition = experimentCondition.selectedStimuli[0].condition;

      sessionStorage.setItem('participantId', participantId);
      sessionStorage.setItem('experimentCondition', JSON.stringify(experimentCondition));
      sessionStorage.setItem('currentStimulusIndex', '0');
      sessionStorage.setItem('hasConsented', 'true');
      console.log('✅ Saved to sessionStorage');

      initializeSurvey();
      console.log('✅ Initialized SurveyContext');

      console.log('🔄 Navigating to /scenario...');
      router.push('/scenario');

      saveSession({
        participantId,
        workerId: workerId || '',
        assignmentId: assignmentId || '',
        hitId: hitId || '',
        informedConsent: 'agreed',
        conditionNumber: experimentCondition.selectedStimuli[0].condition.conditionId,
        groupId: firstCondition.groupId,
        conditionId: firstCondition.conditionId,
        advisorType: firstCondition.advisorType,
        congruity: firstCondition.congruity,
        advisorValence: firstCondition.advisorValence,
        publicValence: firstCondition.publicValence,
        patternKey: experimentCondition.selectedStimuli.map((s) =>
          s.condition.advisorValence === 'positive' ? 'A' : 'B'
        ).join(''),
        productOrder: experimentCondition.selectedStimuli.map(s => s.product),
        stimulusOrder: experimentCondition.selectedStimuli.map((s) =>
          `${s.product}_${s.condition.conditionId}`
        ),
        currentStimulusIndex: 0,
        completedStimuli: [],
        completed: false,
        startTime: getKSTTimestamp(),
      }).then(() => {
        console.log('✅ Saved to Firebase successfully');
      }).catch(firebaseError => {
        console.warn('⚠️ Firebase save failed:', firebaseError);
      });
    } catch (err) {
      console.error('❌ Error initializing session:', err);
      setError(`Failed to initialize session: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`);
      setIsSubmitting(false);
    }
  };

  // Section Header Component
  const SectionHeader = ({ id, title, icon: Icon }: { id: string; title: string; icon: React.ElementType }) => (
    <button
      type="button"
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-blue-600" />
        <span className="font-semibold text-gray-900">{title}</span>
      </div>
      {expandedSections[id] ? (
        <ChevronUp className="w-5 h-5 text-gray-500" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-500" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-6 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-lg p-6 border-b-4 border-blue-600">
          <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-2">
            <Shield className="w-4 h-4" />
            <span>IRB NO. 2026-01-002-001</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Informed Consent Form
          </h1>
          <p className="text-gray-600">
            Please read the following information carefully before deciding to participate.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <Mail className="w-4 h-4" />
            <span>Study Coordinator: <a href="mailto:zenxy@g.skku.edu" className="text-blue-600 hover:underline">zenxy@g.skku.edu</a></span>
          </div>
        </div>

        {/* Quick Summary Card */}
        <div className="bg-blue-600 text-white p-6 shadow-lg">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Study at a Glance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 opacity-80" />
              <div>
                <p className="text-blue-100 text-sm">Duration</p>
                <p className="font-semibold">5-15 minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 opacity-80" />
              <div>
                <p className="text-blue-100 text-sm">Compensation</p>
                <p className="font-semibold">$2.00 USD</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 opacity-80" />
              <div>
                <p className="text-blue-100 text-sm">Participants</p>
                <p className="font-semibold">240 Adults (18+)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-lg p-6 space-y-4">

          {/* Section 1: Background */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <SectionHeader id="background" title="1. Background of the Study" icon={FileText} />
            {expandedSections.background && (
              <div className="p-4 text-gray-700 leading-relaxed">
                <p>
                  This study investigates the process of reading product reviews and making purchase decisions in online shopping.
                  In today&apos;s online shopping environment, not only general consumers but also experts and AI systems provide
                  reviews and recommendations about products. This research aims to examine how reviews from these various sources
                  influence consumers&apos; information processing and purchase decision-making.
                </p>
                <p className="mt-3">
                  Participants will read product information and reviews on simulated online shopping pages and provide their
                  evaluations and opinions about them.
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Research Method */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <SectionHeader id="method" title="2. Research Method" icon={FileText} />
            {expandedSections.method && (
              <div className="p-4 text-gray-700 leading-relaxed">
                <p>
                  Participants will access the study&apos;s web application via the Cloud Connect platform. Upon providing
                  informed consent, you will be asked to view online shopping pages for three randomly assigned products.
                </p>
                <p className="mt-3">
                  For each product, you are simply required to scroll through the page to review the product information
                  and customer reviews, just as you would in a typical online shopping scenario, and then complete a brief
                  survey regarding your impressions. This process (viewing a product page followed by a survey) will be
                  repeated three times. After completing these sections, a final survey will conclude your participation.
                </p>
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">Key Points:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Conducted via a standard PC web browser</li>
                    <li>No additional equipment or software installation required</li>
                    <li>No personally identifiable information (PII) will be collected</li>
                    <li>Total estimated time: approximately 5 to 15 minutes</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Benefits */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <SectionHeader id="benefits" title="3. Benefits of Participation" icon={DollarSign} />
            {expandedSections.benefits && (
              <div className="p-4 text-gray-700 leading-relaxed">
                <p>
                  Upon successful completion of all study procedures, you will receive compensation of <strong>$2.00 (USD)</strong> via
                  the Cloud Connect platform.
                </p>
                <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                  <p className="font-medium text-amber-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Please be aware:
                  </p>
                  <p className="text-amber-800 text-sm">
                    Compensation may be denied or rejected if you fail to submit the correct &apos;Completion Code&apos; to the
                    Cloud Connect platform after finishing the experiment.
                  </p>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  The knowledge gained from this study will contribute to understanding consumer decision-making processes
                  and may be published in academic journals for public access. While the results of this research may lead
                  to future commercial value, such as patents or royalties, no such future financial benefits will be
                  provided directly to you.
                </p>
              </div>
            )}
          </div>

          {/* Section 4: Confidentiality */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <SectionHeader id="confidentiality" title="4. Confidentiality of Personal Information" icon={Shield} />
            {expandedSections.confidentiality && (
              <div className="p-4 text-gray-700 leading-relaxed">
                <p>
                  If you choose to participate in this study, all your responses and behavioral data will be kept strictly
                  confidential. This study does not collect any Personally Identifiable Information (PII) such as your name,
                  social security number, or contact details. All data will be collected and managed based solely on the
                  Anonymous Participant ID assigned by the recruitment platform (Cloud Connect).
                </p>
                <p className="mt-3">
                  The information you provide, including survey responses (evaluations of persuasiveness, trust, etc.) and
                  behavioral data (webpage dwell time, etc.) automatically measured during the experiment, will be used
                  exclusively for statistical analysis and academic purposes.
                </p>
                <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                  <p className="font-medium text-blue-900 mb-2">Data Security Measures:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-blue-800">
                    <li>Data transmitted in real-time via secure protocol (HTTPS)</li>
                    <li>Stored in encrypted format (AES-256) on Google Firebase Cloud Servers</li>
                    <li>Access strictly limited to the Principal Investigator and authorized co-researchers</li>
                    <li>Electronic consent forms stored for three years with two-factor authentication (2FA)</li>
                    <li>After retention period, data will be irreversibly destroyed</li>
                  </ul>
                </div>

                {/* Personal Information Consent */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-300">
                  <p className="font-semibold text-gray-900 mb-3">
                    * Consent to the Collection of Personal Information <span className="text-red-500">(Required)</span>
                  </p>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="personalInfoConsent"
                        value="no_pii"
                        checked={personalInfoConsent === 'no_pii'}
                        onChange={(e) => setPersonalInfoConsent(e.target.value)}
                        className="mt-1 h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the recording of research data (e.g., survey responses), but I do not agree to the
                        collection of personally identifiable information. <strong>(Note: This study operates under this principle.)</strong>
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer opacity-50">
                      <input
                        type="radio"
                        name="personalInfoConsent"
                        value="with_pii"
                        disabled
                        className="mt-1 h-4 w-4 text-gray-400"
                      />
                      <span className="text-sm text-gray-500">
                        I agree to the collection of personally identifiable information as it is necessary for the nature of this research.
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer opacity-50">
                      <input
                        type="radio"
                        name="personalInfoConsent"
                        value="decline"
                        disabled
                        className="mt-1 h-4 w-4 text-gray-400"
                      />
                      <span className="text-sm text-gray-500">
                        I do not agree to the collection of personal information and therefore will not participate in this research.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Potential Risks */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <SectionHeader id="risks" title="5. Potential Risks and Discomforts" icon={AlertTriangle} />
            {expandedSections.risks && (
              <div className="p-4 text-gray-700 leading-relaxed space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">A. Absence of Physical/Mental Risks (Minimal Risk)</h4>
                  <p className="text-sm">
                    This study involves non-invasive tasks conducted via a web application, specifically viewing product
                    information and answering survey questions. The procedures are comparable to routine online shopping
                    activities; therefore, there are no anticipated physical risks or mental stress associated with
                    participation. The study does not include sensitive topics (e.g., politics, religion, trauma) that
                    might cause emotional distress.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">B. Potential Discomforts and Safeguards</h4>
                  <p className="text-sm">
                    Since the study requires viewing a PC screen for approximately 5 to 15 minutes, some participants may
                    experience minor discomforts such as temporary eye fatigue or mild boredom. If you experience any
                    discomfort, you may pause the experiment to rest or choose to withdraw from the study at any time.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">C. Privacy and Data Protection</h4>
                  <p className="text-sm">
                    The risk of privacy breach is minimal as this study is conducted on an anonymous basis. No personally
                    identifiable information (PII) such as names or addresses will be collected. All data will be managed
                    using anonymous IDs.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section 6: Guidelines */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <SectionHeader id="guidelines" title="6. Participant Guidelines" icon={FileText} />
            {expandedSections.guidelines && (
              <div className="p-4 text-gray-700 leading-relaxed">
                <p>
                  If you agree to participate in this study, you will be asked to browse online shopping pages for three
                  randomly assigned products and complete brief surveys. This experiment does not evaluate you personally;
                  therefore, there are no &quot;right&quot; or &quot;wrong&quot; answers. Please respond honestly and freely based on your own
                  impressions.
                </p>
                <div className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <p className="font-medium text-amber-900 mb-2">Important:</p>
                  <p className="text-sm text-amber-800">
                    Upon finishing the experiment, you must obtain the &apos;Completion Code&apos; and correctly enter it into
                    the Cloud Connect platform. Compensation is contingent upon this final step verification.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section 7: Study Period */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <SectionHeader id="period" title="7. Study Period and Number of Participants" icon={Users} />
            {expandedSections.period && (
              <div className="p-4 text-gray-700 leading-relaxed">
                <p>
                  This study is scheduled to be conducted from the date of approval until <strong>January 31, 2027</strong>.
                  The study will recruit a total of <strong>240 adults aged 18 and older</strong> residing in the United States,
                  via the Cloud Connect platform.
                </p>
                <p className="mt-3 text-sm text-gray-600">
                  <strong>Note:</strong> There will be no additional costs incurred to you for participating in this study.
                </p>
              </div>
            )}
          </div>

          {/* Section 9: Voluntary Participation */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <SectionHeader id="voluntary" title="9. Voluntary Participation and the Right to Withdraw" icon={Shield} />
            {expandedSections.voluntary && (
              <div className="p-4 text-gray-700 leading-relaxed">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Your participation in this study is entirely voluntary.</li>
                  <li>You may choose not to participate in this research without any penalty.</li>
                  <li>Even after providing your consent, you may withdraw from the study at any time for any reason without facing any consequences, other than the adjustment of participation-related compensation.</li>
                  <li>Your decision to participate or not will not affect you in any other way.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Section 11: Future Use of Data */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <SectionHeader id="futureUse" title="11. Consent for Future Use of Data" icon={FileText} />
            {expandedSections.futureUse && (
              <div className="p-4 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  If the current research yields significant findings, your data may be utilized in future studies to
                  contribute to further scientific advancements. Please indicate your preference regarding the use of
                  your data for future research:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                  <p className="font-semibold text-gray-900 mb-3">
                    Select one option <span className="text-red-500">(Required)</span>
                  </p>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="futureDataConsent"
                        value="all"
                        checked={futureDataConsent === 'all'}
                        onChange={(e) => setFutureDataConsent(e.target.value)}
                        className="mt-1 h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">
                        I consent to provide my data for all future research studies.
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="futureDataConsent"
                        value="skku_only"
                        checked={futureDataConsent === 'skku_only'}
                        onChange={(e) => setFutureDataConsent(e.target.value)}
                        className="mt-1 h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">
                        I consent to provide my data only to researchers affiliated with Sungkyunkwan University.
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="futureDataConsent"
                        value="this_study_only"
                        checked={futureDataConsent === 'this_study_only'}
                        onChange={(e) => setFutureDataConsent(e.target.value)}
                        className="mt-1 h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">
                        I consent to provide my data only to the researchers of this specific study.
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="futureDataConsent"
                        value="no_consent"
                        checked={futureDataConsent === 'no_consent'}
                        onChange={(e) => setFutureDataConsent(e.target.value)}
                        className="mt-1 h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">
                        I do not consent.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 12: Participant Rights */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <SectionHeader id="rights" title="12. Information on Participants' Rights" icon={Shield} />
            {expandedSections.rights && (
              <div className="p-4 text-gray-700 leading-relaxed">
                <p className="mb-3">
                  This study has been reviewed and approved by the Institutional Review Board (IRB) of Sungkyunkwan University.
                </p>
                <p className="mb-3">
                  If any information arises in the future that may affect your rights or well-being as a research participant,
                  the researchers will notify you promptly.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p className="font-medium text-gray-900 mb-2">Contact Information:</p>
                  <p className="text-sm">
                    If you have concerns regarding your rights as a participant or wish to report a violation of your rights,
                    you may contact the Institutional Review Board (IRB) of Sungkyunkwan University:
                  </p>
                  <ul className="mt-2 text-sm space-y-1">
                    <li><strong>TEL:</strong> +82-31-299-6711</li>
                    <li><strong>Email:</strong> <a href="mailto:yesol@skku.edu" className="text-blue-600 hover:underline">yesol@skku.edu</a></li>
                  </ul>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Final Consent Section */}
        <div className="bg-white rounded-b-xl shadow-lg p-6 border-t-2 border-gray-200">

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Validation Messages */}
          {!personalInfoConsent && (
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-md p-3">
              <p className="text-amber-800 text-sm">Please select an option in Section 4 (Confidentiality of Personal Information).</p>
            </div>
          )}
          {!futureDataConsent && personalInfoConsent && (
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-md p-3">
              <p className="text-amber-800 text-sm">Please select an option in Section 11 (Consent for Future Use of Data).</p>
            </div>
          )}

          {/* Final Agreement */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Final Consent</h3>
            <p className="text-gray-700 mb-4">
              By signing this consent form, you will receive a copy of the signed document for your records.
            </p>
            <p className="text-gray-700 mb-6">
              I confirm that I have received an explanation of this consent form, have read and understood its contents,
              and have received answers to any questions I had. I voluntarily agree to participate in this study and
              therefore sign this consent form.
            </p>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={finalAgreement}
                onChange={(e) => setFinalAgreement(e.target.checked)}
                disabled={!personalInfoConsent || !futureDataConsent || isSubmitting}
                className="mt-1 h-5 w-5 text-blue-600 rounded"
              />
              <span className="font-semibold text-gray-900">
                I have read and understood all the information above, and I voluntarily agree to participate in this study.
              </span>
            </label>
          </div>

          <form onSubmit={handleContinue}>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-4 px-6 rounded-xl text-lg font-bold transition-all ${
                isFormValid && !isSubmitting
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Initializing Study...' : 'I Agree - Start Study'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-4">
            By clicking the button above, you confirm your consent to participate in this research study.
          </p>
        </div>

      </div>
    </div>
  );
}
