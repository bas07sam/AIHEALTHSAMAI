import { useMemo } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { skillQuestionMap, skillQuestionMapAr } from '../data/courseData';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { AlertTriangle, TrendingUp, BookOpen, ArrowRight } from 'lucide-react';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function SkillRadarChart({ detailedResults }) {
  const navigate = useNavigate();
  const { t, lang, isRTL } = useLanguage();
  const currentSkillMap = lang === 'ar' ? skillQuestionMapAr : skillQuestionMap;

  const skillAnalysis = useMemo(() => {
    if (!detailedResults || detailedResults.length === 0) return null;

    return currentSkillMap.map(mapping => {
      const relevantResults = detailedResults.filter(r => mapping.questionIds.includes(r.id));
      const correctCount = relevantResults.filter(r => r.isCorrect).length;
      const totalQ = relevantResults.length;
      const percentage = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;

      return {
        ...mapping,
        correctCount,
        totalQuestions: totalQ,
        percentage
      };
    });
  }, [detailedResults, currentSkillMap]);

  if (!skillAnalysis) return null;

  // Module expected skill level (100% = full competency expected)
  const moduleSkillLevels = skillAnalysis.map(() => 100);
  const learnerSkillLevels = skillAnalysis.map(s => s.percentage);

  const weakAreas = skillAnalysis.filter(s => s.percentage < 70);
  const strongAreas = skillAnalysis.filter(s => s.percentage >= 70);

  const chartData = {
    labels: skillAnalysis.map(s => s.shortLabel),
    datasets: [
      {
        label: lang === 'ar' ? 'مستوى الوحدة المستهدف' : 'Module Target Level',
        data: moduleSkillLevels,
        backgroundColor: 'rgba(14, 165, 233, 0.08)',
        borderColor: 'rgba(14, 165, 233, 0.4)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: 'rgba(14, 165, 233, 0.5)',
        pointBorderColor: 'rgba(14, 165, 233, 0.5)',
        pointRadius: 3,
        pointHoverRadius: 5
      },
      {
        label: lang === 'ar' ? 'أداؤك' : 'Your Performance',
        data: learnerSkillLevels,
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderColor: 'rgba(16, 185, 129, 0.9)',
        borderWidth: 2.5,
        pointBackgroundColor: learnerSkillLevels.map(v =>
          v >= 70 ? 'rgba(16, 185, 129, 1)' : 'rgba(239, 68, 68, 1)'
        ),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 12, family: isRTL ? "'Markazi Text', 'Inter', sans-serif" : "'Inter', sans-serif" }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const idx = context.dataIndex;
            const skill = skillAnalysis[idx];
            if (context.datasetIndex === 0) return lang === 'ar' ? `المستهدف: ${context.raw}%` : `Target: ${context.raw}%`;
            return lang === 'ar'
              ? `النتيجة: ${context.raw}% (${skill.correctCount}/${skill.totalQuestions} صحيح)`
              : `Score: ${context.raw}% (${skill.correctCount}/${skill.totalQuestions} correct)`;
          }
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          font: { size: 10 },
          backdropColor: 'transparent',
          color: '#94a3b8'
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.15)',
          circular: true
        },
        angleLines: {
          color: 'rgba(148, 163, 184, 0.15)'
        },
        pointLabels: {
          font: { size: isRTL ? 12 : 11, family: isRTL ? "'Markazi Text', 'Inter', sans-serif" : "'Inter', sans-serif", weight: '500' },
          color: '#475569',
          padding: 12
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Radar Chart Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-display font-semibold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-600" />
            {lang === 'ar' ? 'تحليل أداء المهارات' : 'Skill Performance Analysis'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{lang === 'ar' ? 'نتائج اختبارك مقارنة بمستويات مهارات الوحدات المتوقعة' : 'Your exam results mapped against the expected module skill levels'}</p>
        </div>
        <div className="p-5">
          <div className="max-w-md mx-auto">
            <Radar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Skill Breakdown List */}
        <div className="px-5 pb-5">
          <div className="grid sm:grid-cols-2 gap-2">
            {skillAnalysis.map(skill => (
              <div key={skill.skill} className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${
                skill.percentage >= 70
                  ? 'bg-emerald-50 border-emerald-100'
                  : 'bg-red-50 border-red-100'
              }`}>
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${skill.percentage >= 70 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className="text-xs font-medium text-slate-700 truncate">{skill.shortLabel}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-bold ${skill.percentage >= 70 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {skill.percentage}%
                  </span>
                  <span className="text-[10px] text-slate-400">{skill.correctCount}/{skill.totalQuestions}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations for Weak Areas */}
      {weakAreas.length > 0 && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-amber-200 bg-amber-100/50">
            <h3 className="font-display font-semibold text-amber-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              {lang === 'ar' ? 'توصيات مخصصة' : 'Personalized Recommendations'}
            </h3>
            <p className="text-xs text-amber-600 mt-0.5">
              {lang === 'ar' ? 'المهارات التالية حصلت على أقل من 70%. نوصي بمراجعة هذه الوحدات.' : 'The following skill areas scored below 70%. We recommend revisiting these modules.'}
            </p>
          </div>
          <div className="p-5 space-y-3">
            {weakAreas.map(area => (
              <div key={area.skill} className="bg-white rounded-lg border border-amber-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
                      <h4 className="text-sm font-semibold text-slate-800">{area.skill}</h4>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">
                      {lang === 'ar'
                        ? <>حصلت على <span className="font-bold text-red-600">{area.percentage}%</span> ({area.correctCount}/{area.totalQuestions} صحيح)</>
                        : <>You scored <span className="font-bold text-red-600">{area.percentage}%</span> ({area.correctCount}/{area.totalQuestions} correct)</>}
                    </p>
                    <p className="text-xs text-slate-600">
                      {lang === 'ar'
                        ? <><span className="font-medium">موصى به:</span> راجع <span className="font-semibold text-cyan-700">{area.moduleLabel}</span> لتعزيز فهمك في هذا المجال.</>
                        : <><span className="font-medium">Recommended:</span> Revisit <span className="font-semibold text-cyan-700">{area.moduleLabel}</span> to strengthen your understanding in this area.</>}
                    </p>
                  </div>
                  {area.relatedSections.length > 0 && (
                    <button
                      onClick={() => navigate(`/module/${area.relatedSections[0]}`)}
                      className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-cyan-600 text-white rounded-lg text-xs font-medium hover:bg-cyan-700 transition-all"
                    >
                      {lang === 'ar' ? 'مراجعة' : 'Review'}
                      <ArrowRight className="w-3 h-3 rtl-flip" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strong Areas */}
      {strongAreas.length > 0 && weakAreas.length > 0 && (
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5">
          <h3 className="font-display font-semibold text-emerald-800 flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            {lang === 'ar' ? 'نقاط القوة' : 'Strong Areas'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {strongAreas.map(area => (
              <span key={area.skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-emerald-700 border border-emerald-100">
                <span className="font-bold">{area.percentage}%</span>
                {area.shortLabel}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
