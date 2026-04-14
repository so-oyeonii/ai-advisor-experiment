// Admin-only figure export page for paper: renders the exact stimuli used in the
// experiment and allows high-resolution PNG downloads (2x default, 3x optional).
// Protected by the same NEXT_PUBLIC_ADMIN_PASSWORD gate as /admin/export.
// Views available: Scenario intro, Advisor popups (AI / Human), and all 24 stimulus variants.

import { useRef, useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  Star,
  Search,
  ShoppingCart,
  Bot,
  User,
  Sparkles,
  Download,
  Package,
  Lock,
} from 'lucide-react';
import { getAllConditions, StimulusCondition } from '@/lib/randomization';
import {
  getStimulusData,
  ProductKey,
} from '@/lib/stimuliData';

type ViewType = 'scenario' | 'popup-ai' | 'popup-human' | 'stimulus';

const PRODUCT_KEYS: ProductKey[] = ['protein', 'tissue', 'soap'];

function buildStimulusFilename(c: StimulusCondition, product: ProductKey): string {
  const advVal = c.advisorValence === 'positive' ? 'PosAdv' : 'NegAdv';
  const pubVal = c.publicValence === 'positive' ? 'PosPub' : 'NegPub';
  return `fig_C${c.conditionId}_${c.advisorType}_${c.congruity}_${advVal}_${pubVal}_${product}.png`;
}

// ----------------------------------------------------------------------------
// Scenario View (mirrors src/pages/scenario.tsx content, without navigation)
// ----------------------------------------------------------------------------
function ScenarioView() {
  return (
    <div className="min-h-[900px] bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-[#131921] text-white py-2 px-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-6 h-6" />
            <span className="text-xl font-bold">Amazon</span>
          </div>
          <span className="text-sm opacity-80">Welcome, Participant</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-lg p-5 mb-4 border border-gray-200">
          <div className="text-center mb-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Before You Start</h1>
            <p className="text-gray-600">Please read the following information carefully</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
            <div className="flex items-start space-x-3">
              <ShoppingCart className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Shopping Situation</h2>
                <p className="text-gray-900 leading-relaxed font-medium">
                  You have run out of three items at home and are looking to purchase{' '}
                  <span className="font-bold text-blue-700">
                    Protein Powder, Hand Soap, and Tissue
                  </span>{' '}
                  on Amazon.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 rounded-xl border-2 border-purple-300 p-4 mb-4">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                NEW
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Amazon&apos;s Expert Review Service
              </h2>
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>

            <p className="text-center text-gray-700 mb-4">
              Amazon is offering a new service featuring{' '}
              <span className="font-bold text-purple-700">Expert Reviews</span> on products.
            </p>

            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-2 mb-4">
              <p className="text-center font-bold text-gray-900">
                ⭐ Please Read Carefully: There are two types of Expert Reviews ⭐
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md border-2 border-blue-300">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">Human Expert&apos;s Review</h4>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Human experts with{' '}
                  <span className="font-semibold text-blue-700">specialized knowledge</span> in the
                  field thoroughly analyze products and write detailed reviews.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md border-2 border-purple-300">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Bot className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">AI Expert&apos;s Review</h4>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Amazon&apos;s{' '}
                  <span className="font-semibold text-purple-700">AI technology</span> analyzes
                  vast amounts of data to provide objective and detailed reviews.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <p className="text-gray-900 font-semibold">
                Feel free to explore this new Expert Review feature!
              </p>
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </div>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg border-2 border-yellow-300">
            <p className="text-center text-gray-700 text-sm mb-1">
              📋 This is a moment to take a short break before entering the shopping page.
            </p>
            <p className="text-center text-gray-900 font-semibold text-sm">
              Once you click &quot;Start Shopping&quot;, please stay focused and continue without
              interruption.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg px-10 py-3 rounded-lg shadow-lg">
            Start Shopping →
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-3">
          This study takes approximately 10-15 minutes to complete.
        </p>
      </main>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Popup View (AI or Human) — modal content as shown on entering a stimulus page
// ----------------------------------------------------------------------------
function PopupView({ advisorType }: { advisorType: 'AI' | 'Human' }) {
  return (
    <div className="min-h-[700px] bg-gray-900 bg-opacity-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 relative">
        <div className="absolute top-3 right-3 text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <div className="text-center mb-4">
          <div className="flex justify-center mb-3">
            {advisorType === 'AI' ? (
              <div className="bg-purple-100 p-3 rounded-full">
                <Bot className="w-10 h-10 text-purple-600" />
              </div>
            ) : (
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="w-10 h-10 text-blue-600" />
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {advisorType === 'AI' ? "AI Expert's Review" : "Human Expert's Review"}
          </h2>
          <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-0.5 rounded-full text-sm font-bold">
            NEW FEATURE
          </div>
        </div>

        {advisorType === 'AI' ? (
          <div className="space-y-3 text-gray-700">
            <p className="text-base leading-relaxed">
              This product&apos;s expert review has been generated by{' '}
              <span className="font-bold text-purple-700">Amazon&apos;s AI Expert System</span>.
            </p>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded-r-lg">
              <h3 className="font-semibold text-gray-900 mb-2 text-base">
                How AI Expert Reviews Work:
              </h3>
              <ul className="space-y-1.5 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">🤖</span>
                  <span>
                    <strong>Advanced AI Analysis:</strong> Utilizes machine learning algorithms
                    trained on millions of product reviews.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📊</span>
                  <span>
                    <strong>Data-Driven Insights:</strong> Analyzes consumer feedback and product
                    testing data.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">⚡</span>
                  <span>
                    <strong>Real-Time Updates:</strong> Continuously learns from new data.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-gray-700">
            <p className="text-base leading-relaxed">
              This product&apos;s expert review has been written by a{' '}
              <span className="font-bold text-blue-700">certified Human Expert</span> with
              specialized knowledge.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg">
              <h3 className="font-semibold text-gray-900 mb-2 text-base">
                What Makes Our Human Experts Qualified:
              </h3>
              <ul className="space-y-1.5 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">👨‍🔬</span>
                  <span>
                    <strong>Professional Credentials:</strong> A human professional with relevant
                    certifications and degrees (e.g., nutrition, chemistry).
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📚</span>
                  <span>
                    <strong>Industry Experience:</strong> Years of expertise in evaluating similar
                    products.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold px-8 py-2.5 rounded-lg shadow-lg text-base">
            Continue to Product Page
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Stimulus View — exact replica of participant-facing stimulus page
// (post-popup state, with blurred price and blurred customer review bodies)
// ----------------------------------------------------------------------------
function StimulusView({
  condition,
  productKey,
}: {
  condition: StimulusCondition;
  productKey: ProductKey;
}) {
  const stimulusData = getStimulusData({
    product: productKey,
    advisorType: condition.advisorType,
    advisorValence: condition.advisorValence,
    publicValence: condition.publicValence,
    congruity: condition.congruity,
  });
  const { product, advisorReview, publicReviews } = stimulusData;

  return (
    <div className="bg-white">
      <header className="bg-[#232F3E] text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold">amazon</div>
            <div className="hidden md:flex items-center bg-white rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Search Amazon"
                className="px-4 py-2 w-80 lg:w-96 text-gray-900 outline-none text-sm"
                disabled
              />
              <button className="bg-[#FF9900] px-4 py-2.5">
                <Search size={20} className="text-gray-900" />
              </button>
            </div>
          </div>
          <ShoppingCart size={28} />
        </div>
      </header>

      <main className="px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-lg border border-gray-300 shadow-sm"
                crossOrigin="anonymous"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EProduct Image%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h1 className="text-2xl font-normal text-gray-900 leading-tight">{product.name}</h1>

            <div className="text-sm">
              <span className="text-gray-600">Brand: </span>
              <span className="text-blue-600">{product.brand}</span>
            </div>

            {/* Blurred price — matches participant view */}
            <div className="flex items-baseline space-x-2 blur-[20px] select-none">
              <span className="text-3xl text-red-700">{product.price}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="border-t border-gray-300 pt-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex items-start space-x-3">
                  {condition.advisorType === 'AI' ? (
                    <Bot size={24} className="text-blue-600 flex-shrink-0" />
                  ) : (
                    <User size={24} className="text-blue-600 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {condition.advisorType === 'AI'
                        ? "AI Expert's Review"
                        : "Human Expert's Review"}
                    </h3>
                    <div className="flex items-center space-x-2 mb-3 flex-wrap">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={
                              condition.advisorValence === 'positive'
                                ? 'fill-[#FFA41C] text-[#FFA41C]'
                                : i === 0
                                ? 'fill-[#FFA41C] text-[#FFA41C]'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {condition.advisorValence === 'positive'
                          ? '5.0 out of 5 stars'
                          : '1.0 out of 5 stars'}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">{advisorReview}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Top reviews from customers</h2>
                <span className="text-sm text-blue-600">See all 999+ reviews</span>
              </div>

              <div className="space-y-4 relative">
                {publicReviews.map((review, index) => (
                  <div
                    key={index}
                    className={`border-b border-gray-200 pb-4 ${
                      index >= 8 ? 'opacity-60' : index >= 7 ? 'opacity-80' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-gray-600" />
                      </div>
                      <span className="font-semibold text-sm text-gray-900">
                        {review.username}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2 flex-wrap">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < review.rating
                                ? 'fill-[#FFA41C] text-[#FFA41C]'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {review.rating}.0 out of 5 stars
                      </span>
                      <span className="text-xs text-orange-700 font-semibold">
                        ✓ Verified Purchase
                      </span>
                    </div>
                    {/* Blurred review body — matches participant view */}
                    <p className="text-sm text-gray-700 blur-sm select-none">{review.text}</p>
                  </div>
                ))}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/70 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Main page
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Password gate — identical pattern to /admin/export
// ----------------------------------------------------------------------------
function LoginScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      onAuthenticated();
    } else {
      alert('잘못된 비밀번호입니다.');
      setPassword('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">관리자 로그인</h1>
          <p className="text-gray-600 text-sm">
            논문 figure 추출 페이지입니다. 비밀번호를 입력하세요.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-base"
              placeholder="비밀번호 입력"
              autoFocus
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-base shadow-md"
          >
            로그인
          </button>

          <p className="text-xs text-gray-500 text-center mt-2">
            💡 비밀번호는 .env.local의 NEXT_PUBLIC_ADMIN_PASSWORD 값입니다
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FiguresPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <LoginScreen onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return <FiguresPageInner />;
}

function FiguresPageInner() {
  const conditions = getAllConditions();
  const [view, setView] = useState<ViewType>('stimulus');
  const [conditionId, setConditionId] = useState<number>(1);
  const [productKey, setProductKey] = useState<ProductKey>('protein');
  const [scale, setScale] = useState<2 | 3>(2);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string>('');

  const captureRef = useRef<HTMLDivElement>(null);

  const currentCondition = conditions.find((c) => c.conditionId === conditionId)!;

  const currentFilename = (() => {
    if (view === 'scenario') return 'fig_scenario.png';
    if (view === 'popup-ai') return 'fig_popup_AI.png';
    if (view === 'popup-human') return 'fig_popup_Human.png';
    return buildStimulusFilename(currentCondition, productKey);
  })();

  // ---- Download single PNG ----
  const handleDownloadCurrent = useCallback(async () => {
    if (!captureRef.current || busy) return;
    setBusy(true);
    setProgress('Rendering PNG...');
    try {
      // wait a frame so layout settles
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      const dataUrl = await toPng(captureRef.current, {
        pixelRatio: scale,
        cacheBust: true,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = currentFilename;
      link.href = dataUrl;
      link.click();
      setProgress('Done.');
    } catch (err) {
      console.error('Export failed:', err);
      setProgress('Failed. See console.');
    } finally {
      setBusy(false);
      setTimeout(() => setProgress(''), 2000);
    }
  }, [busy, scale, currentFilename]);

  // ---- Download all stimuli as ZIP ----
  const handleDownloadAll = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    const zip = new JSZip();
    const prevView = view;
    const prevCond = conditionId;
    const prevProd = productKey;

    try {
      // Switch to stimulus view for the batch
      setView('stimulus');

      let count = 0;
      const total = conditions.length * PRODUCT_KEYS.length + 3; // 24 + scenario + 2 popups

      // 1) Capture scenario & popups first by switching view
      const extraViews: ViewType[] = ['scenario', 'popup-ai', 'popup-human'];
      for (const v of extraViews) {
        setView(v);
        // allow render
        await new Promise((r) => setTimeout(r, 200));
        if (!captureRef.current) continue;
        const dataUrl = await toPng(captureRef.current, {
          pixelRatio: scale,
          cacheBust: true,
          backgroundColor: '#ffffff',
        });
        const base64 = dataUrl.split(',')[1];
        const fname =
          v === 'scenario'
            ? 'fig_scenario.png'
            : v === 'popup-ai'
            ? 'fig_popup_AI.png'
            : 'fig_popup_Human.png';
        zip.file(fname, base64, { base64: true });
        count += 1;
        setProgress(`Captured ${count}/${total}: ${fname}`);
      }

      // 2) Capture all 24 stimulus variants
      setView('stimulus');
      for (const cond of conditions) {
        for (const prod of PRODUCT_KEYS) {
          setConditionId(cond.conditionId);
          setProductKey(prod);
          // allow React to re-render and images to (re)load
          await new Promise((r) => setTimeout(r, 250));
          if (!captureRef.current) continue;
          const dataUrl = await toPng(captureRef.current, {
            pixelRatio: scale,
            cacheBust: true,
            backgroundColor: '#ffffff',
          });
          const base64 = dataUrl.split(',')[1];
          const fname = buildStimulusFilename(cond, prod);
          zip.file(fname, base64, { base64: true });
          count += 1;
          setProgress(`Captured ${count}/${total}: ${fname}`);
        }
      }

      setProgress(`Packaging ZIP...`);
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `figures_${scale}x.zip`);
      setProgress('Done.');
    } catch (err) {
      console.error('Batch export failed:', err);
      setProgress('Failed. See console.');
    } finally {
      // restore
      setView(prevView);
      setConditionId(prevCond);
      setProductKey(prevProd);
      setBusy(false);
      setTimeout(() => setProgress(''), 3000);
    }
  }, [busy, scale, view, conditionId, productKey, conditions]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r shadow-lg flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="p-4 space-y-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">📸 Paper Figures</h1>
            <p className="text-xs text-gray-600 mt-1">
              Export exact experimental stimuli as PNG for manuscript figures.
            </p>
          </div>

          {/* View selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">View</label>
            <div className="grid grid-cols-2 gap-1">
              {(
                [
                  ['scenario', 'Scenario'],
                  ['popup-ai', 'Popup · AI'],
                  ['popup-human', 'Popup · Human'],
                  ['stimulus', 'Stimulus'],
                ] as const
              ).map(([v, label]) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  disabled={busy}
                  className={`px-2 py-1.5 text-xs rounded border transition ${
                    view === v
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Stimulus-only controls */}
          {view === 'stimulus' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Condition
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {conditions.map((c) => (
                    <button
                      key={c.conditionId}
                      onClick={() => setConditionId(c.conditionId)}
                      disabled={busy}
                      className={`py-1.5 text-xs rounded border transition ${
                        conditionId === c.conditionId
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      <div className="font-bold">C{c.conditionId}</div>
                      <div className="text-[10px] opacity-80">G{c.groupId}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-[11px] text-gray-600 bg-gray-50 border rounded p-2 space-y-0.5">
                  <div>
                    <b>Advisor:</b> {currentCondition.advisorType}
                  </div>
                  <div>
                    <b>Congruity:</b> {currentCondition.congruity}
                  </div>
                  <div>
                    <b>Advisor Valence:</b> {currentCondition.advisorValence}
                  </div>
                  <div>
                    <b>Public Valence:</b> {currentCondition.publicValence}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Product</label>
                <div className="grid grid-cols-3 gap-1">
                  {PRODUCT_KEYS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setProductKey(p)}
                      disabled={busy}
                      className={`py-1.5 text-xs rounded border capitalize transition ${
                        productKey === p
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Scale toggle */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Export Scale (for print-quality figures)
            </label>
            <div className="grid grid-cols-2 gap-1">
              {[2, 3].map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s as 2 | 3)}
                  disabled={busy}
                  className={`py-1.5 text-xs rounded border transition ${
                    scale === s
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                  }`}
                >
                  {s}× {s === 2 ? '(default)' : '(≈300 DPI)'}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              3× produces near-300-DPI output suitable for journal print.
            </p>
          </div>

          {/* Download buttons */}
          <div className="space-y-2 pt-2 border-t">
            <button
              onClick={handleDownloadCurrent}
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-3 rounded shadow text-sm"
            >
              <Download size={16} />
              Download current PNG
            </button>

            <button
              onClick={handleDownloadAll}
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-2 px-3 rounded shadow text-sm"
            >
              <Package size={16} />
              Download all (27) as ZIP
            </button>

            {progress && (
              <div className="text-[11px] text-gray-700 bg-yellow-50 border border-yellow-300 rounded p-2 break-words">
                {progress}
              </div>
            )}

            <div className="text-[10px] text-gray-500 leading-tight">
              File name format:
              <code className="block mt-1 bg-gray-50 p-1 rounded border text-[10px] break-all">
                {currentFilename}
              </code>
            </div>
          </div>
        </div>
      </aside>

      {/* Capture area */}
      <main className="flex-1 p-6 overflow-x-auto">
        <div className="mb-3 text-xs text-gray-600">
          Preview below is the exact DOM that will be captured to PNG.
        </div>
        <div
          ref={captureRef}
          className="inline-block bg-white shadow-xl"
          style={{ width: view === 'stimulus' ? 1100 : 960 }}
        >
          {view === 'scenario' && <ScenarioView />}
          {view === 'popup-ai' && <PopupView advisorType="AI" />}
          {view === 'popup-human' && <PopupView advisorType="Human" />}
          {view === 'stimulus' && (
            <StimulusView condition={currentCondition} productKey={productKey} />
          )}
        </div>
      </main>
    </div>
  );
}
