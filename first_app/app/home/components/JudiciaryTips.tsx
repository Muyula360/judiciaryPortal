// app/components/JudiciaryTips.tsx

'use client';

import { useState, useEffect } from 'react';
import * as Fa from 'react-icons/fa';

interface Tip {
  id: number;
  title: string;
  description: string;
  category: string;
  icon: string;
}

const judiciaryTips: Tip[] = [
  {
    id: 1,
    title: 'Know Your Rights',
    description: 'Every citizen has the right to legal representation. If you cannot afford a lawyer, you may be eligible for legal aid services provided by the government.',
    category: 'Rights',
    icon: '⚖️'
  },
  {
    id: 2,
    title: 'Court Etiquette',
    description: 'Always address the judge as "Your Honor" or "My Lord/Lady". Stand when the judge enters or leaves the courtroom. Dress formally and arrive early.',
    category: 'Procedure',
    icon: '👔'
  },
  {
    id: 3,
    title: 'Case Preparation',
    description: 'Prepare all your documents in advance. Organize evidence, witness statements, and legal arguments. This helps expedite court proceedings.',
    category: 'Preparation',
    icon: '📋'
  },
  {
    id: 4,
    title: 'Alternative Dispute Resolution',
    description: 'Consider mediation or arbitration before going to court. ADR is often faster, cheaper, and less stressful than litigation.',
    category: 'Resolution',
    icon: '🤝'
  },
  {
    id: 5,
    title: 'Statute of Limitations',
    description: 'Be aware that there are time limits for filing certain cases. Missing these deadlines can result in losing your right to sue.',
    category: 'Legal',
    icon: '⏰'
  },
  {
    id: 6,
    title: 'Appeal Process',
    description: 'If you disagree with a court decision, you have the right to appeal. Appeals must be filed within a specific timeframe, usually 30-60 days.',
    category: 'Process',
    icon: '📤'
  },
  {
    id: 7,
    title: 'Evidence Collection',
    description: 'Gather and preserve all relevant evidence. This includes documents, photos, videos, and witness contact information. Evidence is crucial for your case.',
    category: 'Evidence',
    icon: '🔍'
  },
  {
    id: 8,
    title: 'Court Fees',
    description: 'Most courts require filing fees. Fee waivers are available for those who cannot afford them. Check with the court clerk for fee waiver applications.',
    category: 'Practical',
    icon: '💰'
  },
  {
    id: 9,
    title: 'Confidentiality',
    description: 'Court proceedings are generally public, but certain documents can be sealed. Consult your lawyer about protecting sensitive information.',
    category: 'Privacy',
    icon: '🔒'
  },
  {
    id: 10,
    title: 'Judicial Independence',
    description: 'Judges are independent and impartial. They base decisions on law and evidence, not public opinion or outside influence.',
    category: 'Justice',
    icon: '🏛️'
  },
  {
    id: 11,
    title: 'Case Management',
    description: 'Court cases are managed through a case management system. Attend all scheduled hearings and comply with court orders to avoid penalties.',
    category: 'Procedure',
    icon: '📅'
  },
  {
    id: 12,
    title: 'Legal Documentation',
    description: 'All court documents must be properly formatted and filed correctly. Errors can delay your case or lead to dismissal.',
    category: 'Practical',
    icon: '📄'
  },
  {
    id: 13,
    title: 'Witness Testimony',
    description: 'Witnesses must be properly subpoenaed. Prepare your witnesses in advance and ensure they understand the importance of truthful testimony.',
    category: 'Evidence',
    icon: '🗣️'
  },
  {
    id: 14,
    title: 'Case Law Research',
    description: 'Understanding relevant case law is essential. Legal precedents can significantly impact your case outcome.',
    category: 'Legal',
    icon: '📚'
  },
  {
    id: 15,
    title: 'Courtroom Decorum',
    description: 'Maintain proper courtroom demeanor. Do not interrupt, use appropriate language, and show respect to all court personnel.',
    category: 'Procedure',
    icon: '🎯'
  },
  {
    id: 16,
    title: 'Understanding Legal Jargon',
    description: 'Familiarize yourself with common legal terms like "plaintiff," "defendant," "affidavit," and "subpoena." This helps you understand court proceedings better.',
    category: 'Legal',
    icon: '📖'
  },
  {
    id: 17,
    title: 'Pre-Trial Conference',
    description: 'Many cases are resolved during pre-trial conferences. Come prepared to discuss settlement options and case management issues.',
    category: 'Procedure',
    icon: '🤝'
  },
  {
    id: 18,
    title: 'Court Reporting',
    description: 'Court proceedings are recorded by court reporters. Speak clearly and avoid interrupting others to ensure accurate records.',
    category: 'Practical',
    icon: '📝'
  },
  {
    id: 19,
    title: 'Jury Selection',
    description: 'Understand the jury selection process. Jurors are selected randomly, and both sides can challenge potential jurors for cause or peremptorily.',
    category: 'Process',
    icon: '👥'
  },
  {
    id: 20,
    title: 'Post-Judgment Options',
    description: 'After a judgment, you may have options like appeal, motion for reconsideration, or enforcement of the judgment. Consult your lawyer for guidance.',
    category: 'Process',
    icon: '📋'
  },
  {
    id: 21,
    title: 'Legal Ethics',
    description: 'Lawyers must follow ethical rules. This includes maintaining client confidentiality, avoiding conflicts of interest, and providing competent representation.',
    category: 'Justice',
    icon: '⚖️'
  },
  {
    id: 22,
    title: 'Court Holidays',
    description: 'Courts observe public holidays and may close on certain days. Check the court calendar before filing important documents.',
    category: 'Practical',
    icon: '📅'
  },
  {
    id: 23,
    title: 'Electronic Filing',
    description: 'Many courts now offer electronic filing (e-filing). This is faster and more convenient than paper filing.',
    category: 'Practical',
    icon: '💻'
  },
  {
    id: 24,
    title: 'Self-Representation',
    description: 'If you choose to represent yourself (pro se), prepare thoroughly. The court expects self-represented litigants to follow the same rules as lawyers.',
    category: 'Rights',
    icon: '👤'
  },
  {
    id: 25,
    title: 'Court Security',
    description: 'Expect security screening when entering a courthouse. Do not bring weapons, large bags, or prohibited items.',
    category: 'Procedure',
    icon: '🛡️'
  },
  {
    id: 26,
    title: 'Mediation Process',
    description: 'Mediation is a confidential process where a neutral mediator helps parties reach a mutually acceptable resolution.',
    category: 'Resolution',
    icon: '🤝'
  },
  {
    id: 27,
    title: 'Case Management Conference',
    description: 'Case management conferences help the court manage timelines, set deadlines, and resolve procedural issues.',
    category: 'Procedure',
    icon: '📊'
  },
  {
    id: 28,
    title: 'Court Document Authentication',
    description: 'Court documents may need to be authenticated or notarized. Check with the court clerk for specific requirements.',
    category: 'Practical',
    icon: '📄'
  },
  {
    id: 29,
    title: 'Public Access',
    description: 'Most court proceedings are open to the public. However, certain cases like juvenile or family matters may be confidential.',
    category: 'Rights',
    icon: '👁️'
  },
  {
    id: 30,
    title: 'Legal Aid Services',
    description: 'Legal aid organizations provide free or low-cost legal services to eligible individuals. Contact your local legal aid office for assistance.',
    category: 'Rights',
    icon: '🤝'
  }
];

interface JudiciaryTipsProps {
  isDarkTheme?: boolean;
  className?: string;
}

export default function JudiciaryTips({ 
  isDarkTheme = false,
  className = ''
}: JudiciaryTipsProps) {
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [monthlyTips, setMonthlyTips] = useState<Tip[]>([]);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lastUpdate, setLastUpdate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Function to generate monthly tips based on month and year
  const generateMonthlyTips = (month: number, year: number) => {
    const seed = month + year * 12;
    const shuffled = [...judiciaryTips].sort((a, b) => {
      const hashA = (a.id * 31 + seed) % 100;
      const hashB = (b.id * 31 + seed) % 100;
      return hashA - hashB;
    });
    return shuffled.slice(0, 10);
  };

  // Calculate countdown until next month
  const calculateCountdown = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const diff = nextMonth.getTime() - now.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    setCountdown({ days, hours, minutes, seconds });
  };

  // Update tips function
  const updateTips = () => {
    const now = new Date();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentMonthName = monthNames[now.getMonth()];
    const currentYearStr = now.getFullYear().toString();
    
    setCurrentMonth(currentMonthName);
    setCurrentYear(currentYearStr);

    const newTips = generateMonthlyTips(now.getMonth(), now.getFullYear());
    setMonthlyTips(newTips);
    setCurrentTipIndex(0);
    setLastUpdate(`${currentMonthName} ${currentYearStr}`);
    setIsLoading(false);
    
    // Store in localStorage
    try {
      localStorage.setItem('judiciary_tips_month', currentMonthName);
      localStorage.setItem('judiciary_tips_year', currentYearStr);
      localStorage.setItem('judiciary_tips_data', JSON.stringify(newTips));
    } catch (e) {
      // Ignore
    }
  };

  useEffect(() => {
    try {
      const savedMonth = localStorage.getItem('judiciary_tips_month');
      const savedYear = localStorage.getItem('judiciary_tips_year');
      const savedTips = localStorage.getItem('judiciary_tips_data');
      
      if (savedMonth && savedYear && savedTips) {
        const now = new Date();
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const currentMonthName = monthNames[now.getMonth()];
        const currentYearStr = now.getFullYear().toString();
        
        if (savedMonth === currentMonthName && savedYear === currentYearStr) {
          setCurrentMonth(currentMonthName);
          setCurrentYear(currentYearStr);
          setLastUpdate(`${currentMonthName} ${currentYearStr}`);
          const parsedTips = JSON.parse(savedTips);
          setMonthlyTips(parsedTips);
          setIsLoading(false);
          calculateCountdown();
          return;
        }
      }
    } catch (e) {
      // Ignore
    }
    
    updateTips();
    calculateCountdown();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      calculateCountdown();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const currentMonthName = monthNames[now.getMonth()];
      const currentYearStr = now.getFullYear().toString();
      
      if (currentMonthName !== currentMonth || currentYearStr !== currentYear) {
        updateTips();
        calculateCountdown();
      }
    }, 3600000);

    return () => clearInterval(interval);
  }, [currentMonth, currentYear]);


  // Filter tips by category
  const getFilteredTips = () => {
    if (selectedCategory === 'All') {
      return monthlyTips;
    }
    return monthlyTips.filter(tip => tip.category === selectedCategory);
  };

  const filteredTips = getFilteredTips();
  const displayedTips = showAll ? filteredTips : filteredTips.slice(0, 5);

  // Next tip for carousel
  const nextTip = () => {
    if (filteredTips.length > 0) {
      setCurrentTipIndex((prev) => (prev + 1) % filteredTips.length);
    }
  };

  const prevTip = () => {
    if (filteredTips.length > 0) {
      setCurrentTipIndex((prev) => (prev - 1 + filteredTips.length) % filteredTips.length);
    }
  };

  const currentTip = filteredTips[currentTipIndex] || filteredTips[0];

  // Auto-play carousel
  useEffect(() => {
    if (filteredTips.length <= 1) return;

    const autoPlayInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % filteredTips.length);
    }, 10000);

    return () => clearInterval(autoPlayInterval);
  }, [filteredTips.length]);

  // Reset to first tip when filtered tips change (category filter changes)
  useEffect(() => {
    setCurrentTipIndex(0);
  }, [selectedCategory, filteredTips.length]);

  // Format countdown display
  const formatCountdown = () => {
    const { days, hours, minutes, seconds } = countdown;
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
    return parts.join(' ');
  };

  if (isLoading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className={`h-8 w-48 rounded ${isDarkTheme ? 'bg-slate-800' : 'bg-gray-200'} mb-4`}></div>
        <div className={`h-32 rounded-xl ${isDarkTheme ? 'bg-slate-800/50' : 'bg-gray-100'} mb-6`}></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-20 rounded-xl ${isDarkTheme ? 'bg-slate-800/30' : 'bg-gray-100'}`}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} pt-2`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-gray-400'}`}>
            <span className="text-3xl">⚖️</span>
            Judiciary Tips
          </h2>
          <p className={`text-sm ${isDarkTheme ? 'text-white' : 'text-white'}`}>
            Tips helps to understand The Judiciary of Tanzania processes
          </p>
        </div>
      </div>

      <div className={`mb-6 p-3 rounded-xl flex items-center justify-between ${
        isDarkTheme 
          ? 'bg-slate-900 border border-slate-800/50' 
          : 'bg-blue-50 border border-blue-200'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-xl">⏰</span>
          <div>
            <p className={`text-sm font-bold ${isDarkTheme ? 'text-white' : 'text-slate-950'}`}>
              Next Tips Update
            </p>
            <p className={`text-xs ${isDarkTheme ? 'text-slate-400' : 'text-slate-950'}`}>
              New tips will be available on the 1st of next month
            </p>
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-2">
            {countdown.days > 0 && (
              <div className="text-center">
                <div className={`text-2xl font-bold tabular-nums ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                  {String(countdown.days).padStart(2, '0')}
                </div>
                <div className={`text-[10px] uppercase tracking-wider ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                  Days
                </div>
              </div>
            )}
            <div className="text-center">
              <div className={`text-2xl font-bold tabular-nums ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                {String(countdown.hours).padStart(2, '0')}
              </div>
              <div className={`text-[10px] uppercase tracking-wider ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                Hrs
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold tabular-nums ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                {String(countdown.minutes).padStart(2, '0')}
              </div>
              <div className={`text-[10px] uppercase tracking-wider ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                Min
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold tabular-nums ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                {String(countdown.seconds).padStart(2, '0')}
              </div>
              <div className={`text-[10px] uppercase tracking-wider ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                Sec
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Carousel - Auto Plays */}
      {filteredTips.length > 0 && (
        <div className={`rounded-xl p-6 mb-6 transition-all duration-300 ${
          isDarkTheme 
            ? 'bg-slate-900 border border-slate-700' 
            : 'bg-white border border-gray-200 shadow-sm'
        }`}>
          <div className="flex items-start gap-4">
            <div className="text-5xl flex-shrink-0">{currentTip?.icon || '⚖️'}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  {currentTip?.title}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isDarkTheme ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {currentTip?.category}
                </span>
              </div>
              <p className={`text-sm leading-relaxed ${isDarkTheme ? 'text-slate-300' : 'text-gray-600'}`}>
                {currentTip?.description}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className={`text-xs ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`}>
                  {currentTipIndex + 1} of {filteredTips.length}
                </span>
                <div className="flex gap-1">
                  {filteredTips.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentTipIndex
                          ? 'bg-rose-500 w-3'
                          : isDarkTheme ? 'bg-slate-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={prevTip}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkTheme
                  ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <Fa.FaChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextTip}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkTheme
                  ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <Fa.FaChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

 

      {/* Footer */}
      <div className={`mt-6 pt-4 border-t ${
        isDarkTheme ? 'border-slate-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between text-xs">
          <span className={isDarkTheme ? 'text-slate-500' : 'text-gray-400'}>
            💡 Tips are automatically updated each month
          </span>
          <div className="flex items-center gap-4">
            <span className={isDarkTheme ? 'text-slate-500' : 'text-gray-400'}>
              {currentMonth} {currentYear} Edition
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}